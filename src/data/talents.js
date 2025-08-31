export const talentTrees = {
    combat: {
        name: 'Combat Mastery',
        description: 'Improve your offensive capabilities',
        talents: {
            powerStrike: {
                id: 'powerStrike',
                name: 'Power Strike',
                description: 'Attack cards deal +1 damage',
                maxRank: 3,
                cost: [1, 2, 3],
                prerequisite: null,
                position: { x: 0, y: 0 }
            },
            criticalHit: {
                id: 'criticalHit',
                name: 'Critical Hit',
                description: '10% chance for attacks to deal double damage',
                maxRank: 2,
                cost: [2, 3],
                prerequisite: 'powerStrike',
                position: { x: 0, y: 1 }
            },
            multiStrike: {
                id: 'multiStrike',
                name: 'Multi-Strike',
                description: 'Multi-Attack hits one additional enemy',
                maxRank: 1,
                cost: [3],
                prerequisite: 'criticalHit',
                position: { x: 0, y: 2 }
            },
            weaponMaster: {
                id: 'weaponMaster',
                name: 'Weapon Master',
                description: 'Start each run with Heavy Attack+',
                maxRank: 1,
                cost: [4],
                prerequisite: 'multiStrike',
                position: { x: 0, y: 3 }
            }
        }
    },
    defense: {
        name: 'Defensive Arts',
        description: 'Enhance your survivability',
        talents: {
            vitality: {
                id: 'vitality',
                name: 'Vitality',
                description: 'Start with +10 max health',
                maxRank: 5,
                cost: [1, 1, 2, 2, 3],
                prerequisite: null,
                position: { x: 1, y: 0 }
            },
            armor: {
                id: 'armor',
                name: 'Natural Armor',
                description: 'Reduce all damage taken by 1',
                maxRank: 2,
                cost: [2, 4],
                prerequisite: 'vitality',
                position: { x: 1, y: 1 }
            },
            regeneration: {
                id: 'regeneration',
                name: 'Regeneration',
                description: 'Heal 2 HP at the start of each turn',
                maxRank: 3,
                cost: [2, 3, 4],
                prerequisite: 'armor',
                position: { x: 1, y: 2 }
            },
            lastStand: {
                id: 'lastStand',
                name: 'Last Stand',
                description: 'When below 25% health, gain +2 energy per turn',
                maxRank: 1,
                cost: [5],
                prerequisite: 'regeneration',
                position: { x: 1, y: 3 }
            }
        }
    },
    utility: {
        name: 'Arcane Knowledge',
        description: 'Manipulate cards and energy',
        talents: {
            cardDraw: {
                id: 'cardDraw',
                name: 'Card Draw',
                description: 'Draw +1 card each turn',
                maxRank: 2,
                cost: [2, 4],
                prerequisite: null,
                position: { x: 2, y: 0 }
            },
            energyEfficiency: {
                id: 'energyEfficiency',
                name: 'Energy Efficiency',
                description: 'Start each turn with +1 energy',
                maxRank: 2,
                cost: [3, 5],
                prerequisite: 'cardDraw',
                position: { x: 2, y: 1 }
            },
            cardMastery: {
                id: 'cardMastery',
                name: 'Card Mastery',
                description: 'Higher chance for upgraded cards in rewards',
                maxRank: 3,
                cost: [2, 3, 4],
                prerequisite: 'energyEfficiency',
                position: { x: 2, y: 2 }
            },
            grandMaster: {
                id: 'grandMaster',
                name: 'Grand Master',
                description: 'All starting cards are upgraded',
                maxRank: 1,
                cost: [6],
                prerequisite: 'cardMastery',
                position: { x: 2, y: 3 }
            }
        }
    }
};