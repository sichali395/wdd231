/**
 * KISYOMBE VILLAGE HERITAGE - LOCAL STORAGE MODULE
 * ES Module - Handles client-side persistence
 * Rubric Requirement: Local Storage implementation
 */

const STORAGE_KEY = 'kisyombe_preferences';

export function initStorage() {
    if (!localStorage.getItem(STORAGE_KEY)) {
        const defaultPreferences = {
            theme: 'Default',
            lastViewed: null,
            lastFilter: 'all',
            clanInterest: null,
            newsletter: false,
            visitedPages: [],
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visits: 1
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
        console.log('✅ Local storage initialized with default preferences');
        return defaultPreferences;
    } else {
        // Update last visit date and increment visit count
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEY));
        preferences.lastVisit = new Date().toISOString();
        preferences.visits = (preferences.visits || 0) + 1;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        return preferences;
    }
}

export function getPreference(key, defaultValue = null) {
    try {
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        return preferences[key] !== undefined ? preferences[key] : defaultValue;
    } catch (e) {
        console.error('Error reading from local storage:', e);
        return defaultValue;
    }
}

export function setPreference(key, value) {
    try {
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        preferences[key] = value;
        preferences.lastUpdated = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));

        // Track visited pages for history
        if (key === 'lastPage') {
            if (!preferences.visitedPages) {
                preferences.visitedPages = [];
            }
            preferences.visitedPages.push({
                page: value,
                timestamp: new Date().toISOString()
            });
            // Keep only last 10 visits
            if (preferences.visitedPages.length > 10) {
                preferences.visitedPages.shift();
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        }

        return true;
    } catch (e) {
        console.error('Error writing to local storage:', e);
        return false;
    }
}

export function getAllPreferences() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    } catch (e) {
        console.error('Error reading from local storage:', e);
        return {};
    }
}

export function clearPreferences() {
    localStorage.removeItem(STORAGE_KEY);
    return initStorage();
}