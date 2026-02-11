// ES Module - Local Storage functionality for Kisyombe Village Heritage
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
            lastVisit: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPreferences));
        console.log('Local storage initialized with default preferences');
    } else {
        // Update last visit date
        const preferences = JSON.parse(localStorage.getItem(STORAGE_KEY));
        preferences.lastVisit = new Date().toISOString();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
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

        // Track visited pages for navigation history
        if (key === 'lastPage') {
            if (!preferences.visitedPages) {
                preferences.visitedPages = [];
            }
            preferences.visitedPages.push({
                page: value,
                timestamp: new Date().toISOString()
            });
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
    initStorage();
    return true;
}