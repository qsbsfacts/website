import states from '../data/states.json';

// Shared by state tiles, chart bars, and chart data tables.
export const statusStyles = {
  conforms: { label: 'Conforms', color: '#15803d', symbol: '✓' },
  decoupled: { label: 'Decoupled', color: '#b91c1c', symbol: '×' },
  partial: { label: 'Partial', color: '#1d4ed8', symbol: '◐' },
  pending: { label: 'Pending', color: '#92400e', symbol: '?' },
  none: { label: 'No income tax', color: '#4b5563', symbol: '—' },
};
export function statePresentation(code: string) {
  const state = states.find(state => state.code === code)!;
  return { ...state, ...statusStyles[state.qsbsConformity as keyof typeof statusStyles] };
}
