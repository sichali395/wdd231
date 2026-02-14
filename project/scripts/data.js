/**
 * Kisyombe Village Heritage - DATA MODULE
 * WDD 231 Final Project
 */

import { fetchHeritageData, displayHeritageItems } from './main.js';

let heritageData = [];

export async function loadHeritageData(filter = 'all') {
    const data = await fetchHeritageData();
    if (data && data.length > 0) {
        heritageData = data;
        // Make data available globally for modal access
        window.heritageData = heritageData;
        displayHeritageItems(heritageData, filter);
    }
}

export function getHeritageData() {
    return heritageData;
}

export function getHeritageItemById(id) {
    return heritageData.find(item => item.id === parseInt(id));
}

export function getItemsByCategory(category) {
    return heritageData.filter(item => item.category === category);
}