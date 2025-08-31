// Utility functions for the game

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// Create damage number for animations
export const createDamageNumber = (amount, id) => ({
    amount,
    id,
    createdAt: Date.now()
});

// Get card cost after discounts
export const getCardCost = (card, discountedCards, cardTypes) => {
    const cardType = cardTypes[card.type];
    const discountType = discountedCards.get(card.id);
    
    if (discountType === "zero") return 0;
    if (discountType === "reduced") return Math.max(0, cardType.cost - 1);
    return cardType.cost;
};

// Check if player can play a card
export const canPlayCard = (card, playerEnergy, discountedCards, cardTypes) => {
    const cost = getCardCost(card, discountedCards, cardTypes);
    return playerEnergy >= cost;
};

// Generate random rewards
export const generateRewards = (cardTypes, count = 3) => {
    const possibleRewards = Object.keys(cardTypes);
    const rewards = [];
    
    while (rewards.length < count) {
        const randomCard = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
        if (!rewards.includes(randomCard)) {
            rewards.push(randomCard);
        }
    }
    
    return rewards;
};

// Validate card count integrity
export const validateCardCount = (deck, hand, discardPile, exhaustedCards, totalDeckSize) => {
    const current = deck.length + hand.length + discardPile.length + exhaustedCards.length;
    return current === totalDeckSize;
};

// Log game state for debugging
export const logGameState = (state, action = '') => {
    console.log(`Game State ${action}:`, {
        total: state.deck.length + state.hand.length + state.discardPile.length + state.exhaustedCards.length,
        deck: state.deck.length,
        hand: state.hand.length,
        discard: state.discardPile.length,
        exhausted: state.exhaustedCards.length,
        playerHealth: state.playerHealth,
        playerEnergy: state.playerEnergy,
        round: state.round,
        enemies: state.enemies.length
    });
};

// Clean up old damage numbers
export const cleanupDamageNumbers = (enemies) => {
    return enemies.map(enemy => ({
        ...enemy,
        damageNumbers: enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000)
    }));
};

// Calculate enemy spawn count based on round
export const getEnemyCount = (round) => {
    let minEnemies = 1;
    let maxEnemies;
    
    if (round <= 5) {
        maxEnemies = 2;
    } else if (round <= 10) {
        maxEnemies = 3;
    } else {
        maxEnemies = 4;
    }
    
    return Math.floor(Math.random() * (maxEnemies - minEnemies + 1)) + minEnemies;
};

// Create enemy with default stats
export const createEnemy = () => ({
    health: 20,
    maxHealth: 20,
    intent: 'attack',
    damage: 5,
    damageNumbers: []
});

// Check if it's boss round
export const isBossRound = (round) => round === 15;

// Check if it's pre-boss round
export const isPreBossRound = (round) => round === 14;