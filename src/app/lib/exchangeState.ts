// Shared exchange state that persists during navigation but resets on page refresh
// This is a module-level variable that both chat and profile components can access

type ExchangeState = "incoming" | "accepted" | "declined" | null;

// Store exchange states for each parallel
const exchangeStates: Record<string, ExchangeState> = {};

// Listeners for state changes
const listeners: Set<() => void> = new Set();

export const getExchangeState = (parallelId: string): ExchangeState => {
  return exchangeStates[parallelId] || null;
};

export const setExchangeState = (parallelId: string, state: ExchangeState) => {
  exchangeStates[parallelId] = state;
  // Notify all listeners
  listeners.forEach(listener => listener());
};

export const subscribeToExchangeState = (callback: () => void) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
