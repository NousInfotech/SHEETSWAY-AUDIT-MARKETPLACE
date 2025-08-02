// src/lib/connect-utils.ts

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// --- LOCAL STORAGE UTILITIES (CORRECTED) ---

/**
 * Loads data from localStorage. It safely handles both JSON strings and plain strings.
 * @param key The key to look for in localStorage.
 * @param defaultValue The value to return if the key is not found.
 * @returns The parsed data or the default value.
 */
export const loadFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    if (!item) {
      return defaultValue;
    }

    // Attempt to parse the item as JSON.
    // If it fails, it's likely a plain string (e.g., "dark" from next-themes).
    // In that case, we return the item as-is.
    try {
      return JSON.parse(item);
    } catch (e) {
      // The value was not valid JSON, so return it directly.
      // We cast to 'any' then to 'T' to satisfy TypeScript's strict typing.
      return item as any as T;
    }
  } catch (error) {
    console.error(`Error loading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Saves data to localStorage. It stringifies objects/arrays but saves plain strings as-is.
 * @param key The key to save the value under.
 * @param value The value to save (can be a string, object, array, etc.).
 */
export const saveToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // If the value is already a string, store it directly.
    // Otherwise, stringify it to store it as a JSON string.
    const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
    window.localStorage.setItem(key, valueToStore);
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
};


// --- UI AND FORMATTING UTILITIES (UNCHANGED) ---

// Status and color utilities
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'text-blue-500 bg-blue-500/10';
    case 'completed':
      return 'text-green-500 bg-green-500/10';
    case 'cancelled':
      return 'text-red-500 bg-red-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export const getTypeColor = (type: string) => {
  switch (type) {
    case 'onboarding':
      return 'text-blue-500 bg-blue-500/10';
    case 'support':
      return 'text-green-500 bg-green-500/10';
    case 'audit':
      return 'text-purple-500 bg-purple-500/10';
    default:
      return 'text-gray-500 bg-gray-500/10';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500';
    case 'busy':
      return 'bg-yellow-500';
    case 'offline':
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

// Meeting duration utilities
export const getMeetingDuration = (
  type: 'onboarding' | 'support' | 'audit'
) => {
  switch (type) {
    case 'audit':
      return 90;
    case 'onboarding':
      return 60;
    case 'support':
      return 30;
    default:
      return 30;
  }
};

// Time formatting utilities
export const formatTime = (date: Date) => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

// Generate meeting title
export const generateMeetingTitle = (
  type: 'onboarding' | 'support' | 'audit'
) => {
  return `${type.charAt(0).toUpperCase() + type.slice(1)} Meeting`;
};