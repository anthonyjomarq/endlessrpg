export const achievements = {
    // Combat achievements
    firstVictory: {
        id: 'firstVictory',
        name: 'First Steps',
        description: 'Complete your first round',
        icon: '🏆',
        requirement: { type: 'roundsCompleted', value: 1 },
        reward: { type: 'talentPoints', amount: 1 }
    },
    veteran: {
        id: 'veteran',
        name: 'Veteran Fighter',
        description: 'Complete 10 rounds in a single run',
        icon: '⚔️',
        requirement: { type: 'roundsCompleted', value: 10 },
        reward: { type: 'talentPoints', amount: 2 }
    },
    champion: {
        id: 'champion',
        name: 'Champion',
        description: 'Complete 20 rounds in a single run',
        icon: '👑',
        requirement: { type: 'roundsCompleted', value: 20 },
        reward: { type: 'talentPoints', amount: 3 }
    },
    
    // Damage achievements
    heavyHitter: {
        id: 'heavyHitter',
        name: 'Heavy Hitter',
        description: 'Deal 20+ damage in a single attack',
        icon: '💥',
        requirement: { type: 'singleDamage', value: 20 },
        reward: { type: 'talentPoints', amount: 1 }
    },
    berserker: {
        id: 'berserker',
        name: 'Berserker',
        description: 'Deal 100+ damage in a single turn',
        icon: '🔥',
        requirement: { type: 'turnDamage', value: 100 },
        reward: { type: 'talentPoints', amount: 2 }
    },
    
    // Survival achievements
    survivor: {
        id: 'survivor',
        name: 'Survivor',
        description: 'Win a combat with 1 HP remaining',
        icon: '❤️',
        requirement: { type: 'winWithHP', value: 1 },
        reward: { type: 'relic', relic: 'phoenixFeather' }
    },
    pacifist: {
        id: 'pacifist',
        name: 'Peaceful Resolution',
        description: 'Win a combat without attacking (counter/poison only)',
        icon: '☮️',
        requirement: { type: 'noDirectAttacks', value: 1 },
        reward: { type: 'talentPoints', amount: 2 }
    },
    
    // Card achievements
    collector: {
        id: 'collector',
        name: 'Card Collector',
        description: 'Have 20+ cards in your deck',
        icon: '📚',
        requirement: { type: 'deckSize', value: 20 },
        reward: { type: 'talentPoints', amount: 1 }
    },
    perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Have 10+ upgraded cards in your deck',
        icon: '✨',
        requirement: { type: 'upgradedCards', value: 10 },
        reward: { type: 'relic', relic: 'ancientTome' }
    },
    
    // Class achievements
    classicWarrior: {
        id: 'classicWarrior',
        name: 'Classic Warrior',
        description: 'Complete a run as Warrior',
        icon: '🛡️',
        requirement: { type: 'classWin', value: 'warrior' },
        reward: { type: 'talentPoints', amount: 2 }
    },
    masterMage: {
        id: 'masterMage',
        name: 'Master Mage',
        description: 'Complete a run as Mage',
        icon: '🔮',
        requirement: { type: 'classWin', value: 'mage' },
        reward: { type: 'talentPoints', amount: 2 }
    },
    shadowRogue: {
        id: 'shadowRogue',
        name: 'Shadow Rogue',
        description: 'Complete a run as Rogue',
        icon: '🗡️',
        requirement: { type: 'classWin', value: 'rogue' },
        reward: { type: 'talentPoints', amount: 2 }
    },
    divineCleric: {
        id: 'divineCleric',
        name: 'Divine Cleric',
        description: 'Complete a run as Cleric',
        icon: '⛪',
        requirement: { type: 'classWin', value: 'cleric' },
        reward: { type: 'talentPoints', amount: 2 }
    }
};

export const checkAchievement = (achievementId, gameStats) => {
    const achievement = achievements[achievementId];
    if (!achievement) return false;
    
    const { type, value } = achievement.requirement;
    
    switch (type) {
        case 'roundsCompleted':
            return (gameStats.maxRound || 0) >= value;
        case 'singleDamage':
            return gameStats.maxSingleDamage >= value;
        case 'turnDamage':
            return gameStats.maxTurnDamage >= value;
        case 'winWithHP':
            return gameStats.lowestWinHP <= value;
        case 'noDirectAttacks':
            return gameStats.pacifistWins >= value;
        case 'deckSize':
            return gameStats.maxDeckSize >= value;
        case 'upgradedCards':
            return gameStats.maxUpgradedCards >= value;
        case 'classWin':
            return (gameStats.classWins && gameStats.classWins[value] || 0) >= 1;
        default:
            return false;
    }
};