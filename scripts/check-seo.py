"""Validate the deployable HTML and crawl graph without third-party dependencies."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse, urljoin
import json
import xml.etree.ElementTree as ET

DIST = Path(__file__).resolve().parents[1] / "dist"
ORIGIN = "https://qsbsfacts.org"
REQUIRED_ROUTES = {
    "/", "/calculator/", "/evidence/", "/sources/", "/state-impact/", "/the-94-percent-claim/", "/who-uses-it/",
    "/guides/", "/what-is-qsbs/", "/qsbs-eligibility/", "/qsbs-holding-period/", "/qsbs-exclusion-limits/",
    "/new-qsbs-rules/", "/qsbs-stock-options/", "/qsbs-rollover/", "/qsbs-trust-stacking/",
    "/california-qsbs/", "/california-exit-tax/", "/oregon-qsbs/", "/new-york-qsbs/",
}
ROUTES = sorted("/" + str(path.parent.relative_to(DIST)).replace(".", "").strip("/") + "/"
                for path in DIST.rglob("index.html"))
ROUTES = ["/" if route == "//" else route for route in ROUTES]
assert REQUIRED_ROUTES <= set(ROUTES), ("missing required pages", REQUIRED_ROUTES - set(ROUTES))

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta, self.canonicals, self.headings, self.links, self.ids = {}, [], [], [], set()
        self.title, self.schema, self.active = "", [], None
        self.feed(html)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "meta":
            self.meta[attrs.get("name", attrs.get("property"))] = attrs.get("content")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonicals.append(attrs["href"])
        if tag in ["h1", "h2", "h3", "h4", "h5", "h6"]:
            self.headings.append(int(tag[1]))
        if tag == "a" and "href" in attrs:
            self.links.append(attrs["href"])
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "title":
            self.active = "title"
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.active = "schema"
            self.schema.append("")

    def handle_endtag(self, tag):
        if tag in ("title", "script"):
            self.active = None

    def handle_data(self, text):
        if self.active == "title":
            self.title += text
        elif self.active == "schema":
            self.schema[-1] += text

pages = {route: Page((DIST / route.lstrip("/") / "index.html").read_text()) for route in ROUTES}
# Without this file Cloudflare Pages serves the homepage with HTTP 200 for
# arbitrary missing URLs (its default SPA fallback).
not_found_path = DIST / "404.html"
assert not_found_path.is_file(), "404.html required to disable Cloudflare SPA fallback"
not_found_html = not_found_path.read_text()
not_found = Page(not_found_html)
assert "noindex" in not_found.meta.get("robots", "")
assert not not_found.canonicals, "Missing URLs must not canonicalize to the homepage"
assert "<script" not in not_found_html.lower(), "Keep missing-page paths out of analytics"
assert not_found.headings.count(1) == 1
assert all(href in pages for href in not_found.links), "Broken recovery link in 404 page"

titles, descriptions = set(), set()
for route, page in pages.items():
    expected = ORIGIN + route
    assert page.canonicals == [expected], (route, "canonical", page.canonicals)
    assert page.meta["og:url"] == expected
    assert 20 <= len(page.title) <= 60, (route, "title length", len(page.title))
    description = page.meta["description"]
    assert 70 <= len(description) <= 160, (route, "description length", len(description))
    assert page.title not in titles and description not in descriptions, (route, "duplicate metadata")
    titles.add(page.title)
    descriptions.add(description)
    for prefix in ("og", "twitter"):
        assert page.meta[f"{prefix}:title"] == page.title
        assert page.meta[f"{prefix}:description"] == description
        assert page.meta[f"{prefix}:image:alt"]
        image = urlparse(page.meta[f"{prefix}:image"])
        assert image.netloc == "qsbsfacts.org" and (DIST / image.path.lstrip("/")).is_file()
    assert page.meta["twitter:card"] == "summary_large_image"
    assert page.headings.count(1) == 1, (route, "one H1 required")
    assert page.headings[0] == 1
    assert all(b <= a + 1 for a, b in zip(page.headings, page.headings[1:])), (route, "heading skip", page.headings)
    assert "main-content" in page.ids
    assert "noindex" not in page.meta.get("robots", "")
    assert page.schema, (route, "missing structured data")
    for raw in page.schema:
        entities = json.loads(raw)
        for entity in entities if isinstance(entities, list) else [entities]:
            assert entity["@context"] == "https://schema.org"
            if entity.get("url", "").startswith(ORIGIN):
                assert entity["url"] == expected, (route, "schema URL", entity["url"])
    for href in page.links:
        url = urlparse(urljoin(expected, href))
        if url.netloc != "qsbsfacts.org":
            continue
        if "." in url.path.rsplit("/", 1)[-1]:
            assert (DIST / url.path.lstrip("/")).exists(), (route, "missing asset", href)
            continue
        assert url.path in pages, (route, "noncanonical or broken internal link", href)
        if url.fragment:
            assert url.fragment in pages[url.path].ids, (route, "broken fragment", href)

# Every indexable page must be discoverable from the homepage using real links.
reachable, pending = set(), ["/"]
while pending:
    route = pending.pop()
    if route in reachable:
        continue
    reachable.add(route)
    for href in pages[route].links:
        url = urlparse(urljoin(ORIGIN + route, href))
        if url.netloc == "qsbsfacts.org" and url.path in pages and url.path not in reachable:
            pending.append(url.path)
assert reachable == set(ROUTES), ("orphan pages", set(ROUTES) - reachable)

ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
index = ET.parse(DIST / "sitemap-index.xml")
urls = []
for loc in index.findall(".//s:loc", ns):
    child = ET.parse(DIST / urlparse(loc.text).path.lstrip("/"))
    urls.extend(item.text for item in child.findall(".//s:loc", ns))
assert sorted(urls) == sorted(ORIGIN + route for route in ROUTES), ("sitemap coverage", urls)
robots = (DIST / "robots.txt").read_text()
assert "User-agent: *\nAllow: /" in robots
assert f"Sitemap: {ORIGIN}/sitemap-index.xml" in robots
print(f"SEO checks passed for all {len(pages)} pages: metadata, canonicals, JSON-LD, headings, links, images, robots, sitemap.")
