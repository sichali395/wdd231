/**
 * KISYOMBE VILLAGE HERITAGE - DATA MODULE
 * ES Module - Handles heritage data loading and management
 */

import { fetchHeritageData, displayHeritageItems, initFilterButtons } from './main.js';

let heritageData = [];

export async function loadHeritageData(filter = 'all') {
    const data = await fetchHeritageData();
    if (data && data.length > 0) {
        heritageData = data;
        displayHeritageItems(heritageData, filter);
        initFilterButtons();
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

export function getItemsByClan(clanName) {
    return heritageData.filter(item =>
        item.clanAffiliation && item.clanAffiliation.toLowerCase().includes(clanName.toLowerCase())
    );
}

export function getKyunguChiefs() {
    return heritageData.filter(item =>
        item.category === 'leader' && item.type === 'Paramount Chief'
    );
}

export function getSichaliLeaders() {
    return heritageData.filter(item =>
        item.clanAffiliation === 'Sichali' && item.category === 'leader'
    );
}