export const enemyTypes = {
    goblin: {
        name: 'Goblin',
        sprite: 'assets/images/goblin-sprite.png',
        health: 15,
        damage: 4,
        intents: ['attack', 'buff'],
        rarity: 'common',
        abilities: ['quick_strike'],
        aiPattern: 'aggressive'
    },
    wolf: {
        name: 'Wolf',
        sprite: 'assets/images/wolf-sprite.png',
        health: 18,
        damage: 6,
        intents: ['attack', 'howl'],
        rarity: 'common',
        abilities: ['pack_hunter'],
        aiPattern: 'pack'
    },
    orc: {
        name: 'Orc',
        sprite: 'assets/images/orc-sprite.png',
        health: 25,
        damage: 8,
        intents: ['attack', 'rage'],
        rarity: 'uncommon',
        abilities: ['berserker_rage'],
        aiPattern: 'berserker'
    },
    skeletalWarrior: {
        name: 'Skeletal Warrior',
        sprite: 'assets/images/skeletal warrior-sprite.png',
        health: 20,
        damage: 7,
        intents: ['attack', 'defend'],
        rarity: 'uncommon',
        abilities: ['undead_resilience'],
        aiPattern: 'defensive'
    },
    poisonousPlant: {
        name: 'Poisonous Plant',
        sprite: 'assets/images/poisonous plant-sprite.png',
        health: 12,
        damage: 3,
        intents: ['poison', 'heal'],
        rarity: 'uncommon',
        abilities: ['poison_spores', 'root_bind'],
        aiPattern: 'support'
    },
    werewolf: {
        name: 'Werewolf',
        sprite: 'assets/images/werewolf-sprite.png',
        health: 30,
        damage: 10,
        intents: ['attack', 'transform'],
        rarity: 'rare',
        abilities: ['lycanthrope_fury', 'regeneration'],
        aiPattern: 'adaptive'
    },
    treant: {
        name: 'Treant',
        sprite: 'assets/images/treant-sprite.png',
        health: 35,
        damage: 6,
        intents: ['defend', 'heal', 'entangle'],
        rarity: 'rare',
        abilities: ['bark_skin', 'nature_heal'],
        aiPattern: 'guardian'
    },
    troll: {
        name: 'Troll',
        sprite: 'assets/images/troll-sprite.png',
        health: 50,
        damage: 12,
        intents: ['attack', 'smash', 'regenerate'],
        rarity: 'boss',
        abilities: ['regeneration', 'club_smash'],
        aiPattern: 'boss'
    }
};

export const getRandomEnemyType = (round) => {
    const commonEnemies = ['goblin', 'wolf'];
    const uncommonEnemies = ['orc', 'skeletalWarrior', 'poisonousPlant'];
    const rareEnemies = ['werewolf', 'treant'];
    const bossEnemies = ['troll'];
    
    let availableEnemies = [...commonEnemies];
    
    if (round >= 3) {
        availableEnemies.push(...uncommonEnemies);
    }
    
    if (round >= 6) {
        availableEnemies.push(...rareEnemies);
    }
    
    if (round >= 10) {
        availableEnemies.push(...bossEnemies);
    }
    
    return availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
};

// AI behavior functions
export const getEnemyIntent = (enemy, allEnemies, playerHealth, round) => {
    const enemyType = enemyTypes[enemy.type];
    const possibleIntents = enemyType.intents;
    
    switch (enemyType.aiPattern) {
        case 'aggressive':
            return Math.random() < 0.8 ? 'attack' : possibleIntents[Math.floor(Math.random() * possibleIntents.length)];
        
        case 'pack':
            const packSize = allEnemies.filter(e => e.type === 'wolf').length;
            return packSize > 1 && Math.random() < 0.4 ? 'howl' : 'attack';
        
        case 'berserker':
            const healthPercent = enemy.health / enemy.maxHealth;
            return healthPercent < 0.5 && Math.random() < 0.6 ? 'rage' : 'attack';
        
        case 'defensive':
            return Math.random() < 0.3 ? 'defend' : 'attack';
        
        case 'support':
            const injuredAllies = allEnemies.filter(e => e.health < e.maxHealth && e.id !== enemy.id);
            if (injuredAllies.length > 0 && Math.random() < 0.4) return 'heal';
            return Math.random() < 0.7 ? 'poison' : 'attack';
        
        case 'adaptive':
            if (round % 3 === 0 && Math.random() < 0.5) return 'transform';
            return Math.random() < 0.7 ? 'attack' : 'defend';
        
        case 'guardian':
            const lowHealthAllies = allEnemies.filter(e => e.health < e.maxHealth * 0.3);
            if (lowHealthAllies.length > 0 && Math.random() < 0.5) return 'heal';
            if (Math.random() < 0.3) return 'entangle';
            return Math.random() < 0.4 ? 'defend' : 'attack';
        
        case 'boss':
            if (round >= 10 && Math.random() < 0.4) return 'smash';
            if (enemy.health < enemy.maxHealth * 0.5 && Math.random() < 0.3) return 'regenerate';
            return 'attack';
        
        default:
            return 'attack';
    }
};

export const executeEnemyAction = (enemy, intent, allEnemies) => {
    const actions = {
        attack: {
            damage: enemy.damage,
            description: `attacks for ${enemy.damage} damage`,
            effect: null
        },
        defend: {
            damage: 0,
            description: 'takes a defensive stance',
            effect: { type: 'block', amount: 5 }
        },
        poison: {
            damage: enemy.damage,
            description: `attacks with poison for ${enemy.damage} damage`,
            effect: { type: 'poison', duration: 3, damage: 2 }
        },
        heal: {
            damage: 0,
            description: 'channels healing energy',
            effect: { type: 'heal', amount: 8 }
        },
        buff: {
            damage: 0,
            description: 'empowers itself',
            effect: { type: 'damage_buff', amount: 2, duration: 2 }
        },
        howl: {
            damage: 0,
            description: 'howls to empower pack',
            effect: { type: 'pack_buff', amount: 2 }
        },
        rage: {
            damage: Math.floor(enemy.damage * 1.5),
            description: `enters a rage, attacking for ${Math.floor(enemy.damage * 1.5)} damage`,
            effect: { type: 'self_damage', amount: 3 }
        },
        transform: {
            damage: 0,
            description: 'transforms, gaining power',
            effect: { type: 'transform', healthBonus: 10, damageBonus: 3 }
        },
        entangle: {
            damage: 0,
            description: 'attempts to entangle you',
            effect: { type: 'entangle', duration: 2 }
        },
        smash: {
            damage: Math.floor(enemy.damage * 1.8),
            description: `charges up a devastating smash for ${Math.floor(enemy.damage * 1.8)} damage`,
            effect: null
        },
        regenerate: {
            damage: 0,
            description: 'regenerates health',
            effect: { type: 'regenerate', amount: 15 }
        }
    };
    
    return actions[intent] || actions.attack;
};

export const createEnemy = (round) => {
    const enemyTypeKey = getRandomEnemyType(round);
    const enemyType = enemyTypes[enemyTypeKey];
    
    const enemy = {
        id: Math.random().toString(36).substr(2, 9),
        type: enemyTypeKey,
        name: enemyType.name,
        sprite: enemyType.sprite,
        health: enemyType.health,
        maxHealth: enemyType.health,
        damage: enemyType.damage,
        baseDamage: enemyType.damage,
        intent: 'attack',
        nextIntent: null,
        abilities: enemyType.abilities,
        damageNumbers: [],
        statusEffects: [],
        block: 0,
        buffs: new Map()
    };
    
    return enemy;
};