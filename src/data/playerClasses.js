export const playerClasses = {
    warrior: {
        name: 'Warrior',
        sprite: 'assets/images/warrior-sprite.png',
        description: 'High health and defensive abilities',
        startingHealth: 120,
        startingDeck: [
            'singleAttack', 'singleAttack', 'singleAttack',
            'heavyAttack', 'heavyAttack',
            'counter', 'counter',
            'divineBlessing'
        ],
        classCards: ['shieldBash', 'defensiveStance', 'battleCry']
    },
    mage: {
        name: 'Mage',
        sprite: 'assets/images/mage-sprite.png',
        description: 'Energy manipulation and magical attacks',
        startingHealth: 80,
        startingDeck: [
            'multiAttack', 'multiAttack',
            'singleAttack', 'singleAttack',
            'doubleEnergy', 'doubleEnergy',
            'empower', 'empower'
        ],
        classCards: ['fireball', 'energyBurst', 'magicMissile']
    },
    rogue: {
        name: 'Rogue',
        sprite: 'assets/images/rogue-sprite.png',
        description: 'Quick strikes and card manipulation',
        startingHealth: 90,
        startingDeck: [
            'quickStrike', 'quickStrike', 'quickStrike',
            'singleAttack', 'singleAttack',
            'luckyDraw',
            'recycle',
            'discount'
        ],
        classCards: ['backstab', 'stealth', 'poisonBlade']
    },
    cleric: {
        name: 'Cleric',
        sprite: 'assets/images/cleric-sprite.png',
        description: 'Healing abilities and support magic',
        startingHealth: 100,
        startingDeck: [
            'singleAttack', 'singleAttack',
            'healthSiphon', 'healthSiphon',
            'divineBlessing', 'divineBlessing',
            'empower',
            'counter'
        ],
        classCards: ['healingLight', 'blessedShield', 'sanctuary']
    }
};