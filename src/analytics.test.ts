import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

const source = readFileSync(new URL('./components/Analytics.astro', import.meta.url), 'utf8').match(/<script is:inline>([\s\S]*?)<\/script>/)![1];
function setup(href = 'https://qsbsfacts.org/new-york-qsbs/?exit=123456&state=NY') {
  const handlers: Record<string, Function> = {};
  const scripts: object[] = [];
  class Element {
    matches() { return true; }
    closest() { return { href: 'https://qsbsfacts.org/calculator/?exit=123456' }; }
  }
  const window = { location: new URL(href), dataLayer: [] as IArguments[] };
  const document = {
    referrer: 'https://example.com/private?exit=654321#secret',
    addEventListener: (name: string, callback: Function) => { handlers[name] = callback; },
    querySelector: () => ({}),
    createElement: () => ({}),
    head: { appendChild: (script: object) => scripts.push(script) },
  };
  runInNewContext(source, { window, document, URL, URLSearchParams, Element, Date });
  return { window, handlers, scripts, Element, calls: () => window.dataLayer.map(call => Array.from(call)) };
}

describe('privacy-preserving engagement measurement', () => {
  it('omits financial inputs from config and all custom events, even after history changes', () => {
    const app = setup();
    app.window.location = new URL('https://qsbsfacts.org/new-york-qsbs/?exit=999999&holding=3');
    app.handlers.change({ target: new app.Element() });
    app.handlers.change({ target: new app.Element() });
    app.handlers.click({ target: new app.Element() });
    app.handlers['qsbs:share-success']();
    const events = app.calls().filter(call => call[0] === 'event');
    expect(events.map(call => call[1])).toEqual(['calculator_use', 'guide_to_calculator', 'calculator_share']);
    for (const call of app.calls().filter(call => ['config', 'event'].includes(call[0]))) {
      expect(call[2].page_location).toBe('https://qsbsfacts.org/new-york-qsbs/');
      expect(call[2].page_referrer).toBe('https://example.com/private');
    }
    expect(JSON.stringify(app.calls())).not.toMatch(/123456|654321|999999|holding=|state=|secret/);
  });
  it('does not load GA or send events for QA and preview visits', () => {
    for (const href of ['https://qsbsfacts.org/calculator/?qa=1', 'http://localhost:4321/calculator/', 'https://preview.pages.dev/']) {
      const app = setup(href);
      expect(app.scripts).toEqual([]);
      expect(app.calls()).toEqual([]);
      expect(app.handlers).toEqual({});
    }
  });
  it('does not count calculator example navigation as a guide conversion', () => {
    const app = setup('https://qsbsfacts.org/calculator/');
    app.handlers.click({ target: new app.Element() });
    expect(app.calls().filter(call => call[0] === 'event')).toEqual([]);
  });
});
