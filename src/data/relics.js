export const relics = {
    // Starter relics (common)
    energyCrystal: {
        id: 'energyCrystal',
        name: 'Energy Crystal',
        description: 'Start each combat with +1 energy',
        rarity: 'common',
        sprite: 'assets/images/energy-crystal.png',
        effect: { type: 'startCombat', value: 'energy', amount: 1 }
    },
    healthPotion: {
        id: 'healthPotion', 
        name: 'Health Potion',
        description: 'Start each run with +15 max health',
        rarity: 'common',
        sprite: 'assets/images/health-potion.png',
        effect: { type: 'startRun', value: 'maxHealth', amount: 15 }
    },
    luckyCharm: {
        id: 'luckyCharm',
        name: 'Lucky Charm',
        description: 'Draw an additional card at the start of combat',
        rarity: 'common',
        sprite: 'assets/images/lucky-charm.png',
        effect: { type: 'startCombat', value: 'drawCards', amount: 1 }
    },
    
    // Uncommon relics
    vampiricTotem: {
        id: 'vampiricTotem',
        name: 'Vampiric Totem',
        description: 'Heal 1 HP whenever you deal damage',
        rarity: 'uncommon',
        sprite: 'assets/images/vampiric-totem.png',
        effect: { type: 'onDamageDealt', value: 'heal', amount: 1 }
    },
    shieldGenerator: {
        id: 'shieldGenerator',
        name: 'Shield Generator',
        description: 'Start each combat with 5 block',
        rarity: 'uncommon',
        sprite: 'assets/images/shield-generator.png',
        effect: { type: 'startCombat', value: 'block', amount: 5 }
    },
    ancientTome: {
        id: 'ancientTome',
        name: 'Ancient Tome',
        description: 'Upgraded cards cost 1 less energy',
        rarity: 'uncommon',
        sprite: 'assets/images/ancient-tome.png',
        effect: { type: 'passive', value: 'upgradedDiscount', amount: 1 }
    },
    
    // Rare relics
    phoenixFeather: {
        id: 'phoenixFeather',
        name: 'Phoenix Feather',
        description: 'Revive once per run with 50% health',
        rarity: 'rare',
        sprite: 'assets/images/phoenix-feather.png',
        effect: { type: 'onDeath', value: 'revive', amount: 0.5 }
    },
    timeWarp: {
        id: 'timeWarp',
        name: 'Time Warp Orb',
        description: 'Play 2 additional cards per turn',
        rarity: 'rare',
        sprite: 'assets/images/time-warp.png',
        effect: { type: 'passive', value: 'handSize', amount: 2 }
    },
    shadowCloak: {
        id: 'shadowCloak',
        name: 'Shadow Cloak',
        description: 'Enemies miss 25% of their attacks',
        rarity: 'rare',
        sprite: 'assets/images/shadow-cloak.png',
        effect: { type: 'passive', value: 'dodge', amount: 0.25 }
    },
    
    // Boss relics
    dragonHeart: {
        id: 'dragonHeart',
        name: 'Dragon Heart',
        description: 'Double your max health but take 1 damage each turn',
        rarity: 'boss',
        sprite: 'assets/images/dragon-heart.png',
        effect: { type: 'passive', value: 'dragonHeart', amount: 2 }
    },
    infiniteScroll: {
        id: 'infiniteScroll',
        name: 'Infinite Scroll',
        description: 'Draw your entire deck each turn',
        rarity: 'boss',
        sprite: 'assets/images/infinite-scroll.png',
        effect: { type: 'passive', value: 'infiniteHand', amount: 1 }
    }
};

export const getRandomRelic = (rarity = 'common') => {
    const relicPool = Object.values(relics).filter(relic => relic.rarity === rarity);
    return relicPool[Math.floor(Math.random() * relicPool.length)];
};