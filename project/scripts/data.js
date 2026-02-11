// ES Module - Data handling for Kisyombe Village Heritage
import { fetchHeritageData, displayHeritageItems } from './main.js';

let heritageData = [];

export async function loadHeritageData(filter = 'all') {
    const data = await fetchHeritageData();
    if (data && data.length > 0) {
        heritageData = data;
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
    // ARRAY METHOD: filter
    return heritageData.filter(item => item.category === category);
}

export function getItemsByClan(clanName) {
    // ARRAY METHOD: filter with includes
    return heritageData.filter(item =>
        item.clanAffiliation && item.clanAffiliation.includes(clanName)
    );
}