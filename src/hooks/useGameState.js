import { useState, useEffect, useCallback } from 'react';
import { shuffleArray, getEnemyCount, createEnemy, generateRewards } from '../utils/helpers.js';
import { cardTypes } from '../data/cardTypes.js';

// Game state constants
const INITIAL_HEALTH = 100;
const INITIAL_ENERGY = 3;
const BASE_DECK_SIZE = 8;

export const useGameState = () => {
    // Core game state
    const [playerHealth, setPlayerHealth] = useState(INITIAL_HEALTH);
    const [maxHealth, setMaxHealth] = useState(INITIAL_HEALTH);
    const [playerEnergy, setPlayerEnergy] = useState(INITIAL_ENERGY);
    const [round, setRound] = useState(1);
    
    // Card state
    const [hand, setHand] = useState([]);
    const [deck, setDeck] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [exhaustedCards, setExhaustedCards] = useState([]);
    const [totalDeckSize, setTotalDeckSize] = useState(BASE_DECK_SIZE);
    const [cardIdCounter, setCardIdCounter] = useState(0);
    const [discountedCards, setDiscountedCards] = useState(new Map());
    
    // Enemy state
    const [enemies, setEnemies] = useState([]);
    
    // Game effects state
    const [empowerActive, setEmpowerActive] = useState(false);
    const [counterActive, setCounterActive] = useState(false);
    
    // UI state
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isTargeting, setIsTargeting] = useState(false);
    const [showVictory, setShowVictory] = useState(false);
    const [showPreBossFight, setShowPreBossFight] = useState(false);
    const [showSpecialRewards, setShowSpecialRewards] = useState(false);
    const [showCardRemoval, setShowCardRemoval] = useState(false);
    const [rewardOptions, setRewardOptions] = useState([]);
    const [specialRewardOptions, setSpecialRewardOptions] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [showEnergyGain, setShowEnergyGain] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [showStatusMessage, setShowStatusMessage] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('splash');
    
    // Helper to create card instances with unique IDs
    const createCardInstance = useCallback((cardType) => ({
        id: cardIdCounter + 1,
        type: cardType
    }), [cardIdCounter]);
    
    // Initialize game deck
    const initializeGame = useCallback(() => {
        const initialDeckTypes = [
            'multiAttack', 'multiAttack',
            'singleAttack', 'singleAttack', 'singleAttack', 'singleAttack',
            'empower',
            'counter'
        ];
        
        const initialDeck = initialDeckTypes.map((type, index) => ({
            id: index + 1,
            type: type
        }));
        
        setCardIdCounter(initialDeck.length);
        
        const shuffledCards = shuffleArray([...initialDeck]);
        const initialHand = shuffledCards.slice(0, 3);
        const remainingDeck = shuffledCards.slice(3);
        
        setDeck(remainingDeck);
        setHand(initialHand);
        setDiscardPile([]);
        setExhaustedCards([]);
        setGameStarted(true);
        setTotalDeckSize(initialDeck.length);
        
        // Create initial enemies directly
        const numberOfEnemies = getEnemyCount(1);
        const newEnemies = Array(numberOfEnemies).fill().map(() => createEnemy());
        setEnemies(newEnemies);
    }, []);
    
    // Spawn enemies based on round
    const spawnEnemies = useCallback(() => {
        const numberOfEnemies = getEnemyCount(round);
        const newEnemies = Array(numberOfEnemies).fill().map(() => createEnemy());
        setEnemies(newEnemies);
    }, [round]);
    
    // Draw cards
    const drawCards = useCallback(() => {
        let currentDeck = [...deck];
        let currentDiscard = [...discardPile];
        const cardsNeeded = 3;
        
        if (currentDeck.length < cardsNeeded && currentDiscard.length > 0) {
            currentDeck = shuffleArray([...currentDeck, ...currentDiscard]);
            currentDiscard = [];
        }
        
        const newHand = currentDeck.slice(0, cardsNeeded);
        const remainingDeck = currentDeck.slice(cardsNeeded);
        
        setDeck(remainingDeck);
        setHand(newHand);
        setDiscardPile(currentDiscard);
    }, [deck, discardPile]);
    
    // Reset targeting state
    const resetTargeting = useCallback(() => {
        setIsTargeting(false);
        setSelectedCard(null);
        setSelectedCardIndex(null);
    }, []);
    
    // End turn logic
    const endTurn = useCallback(() => {
        if (gameOver) return;
        
        // Move hand to discard
        setDiscardPile(prev => [...prev, ...hand]);
        setHand([]);
        
        // Reset states
        setDiscountedCards(new Map());
        setPlayerEnergy(INITIAL_ENERGY);
        setCounterActive(false);
        resetTargeting();
        
        // Process enemy actions
        enemies.forEach((enemy) => {
            if (enemy.intent === 'attack') {
                if (counterActive) {
                    const updatedEnemies = [...enemies];
                    const enemyIndex = enemies.indexOf(enemy);
                    updatedEnemies[enemyIndex] = {
                        ...enemy,
                        health: enemy.health - enemy.damage,
                        damageNumbers: [
                            ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                            { amount: enemy.damage, id: Date.now(), createdAt: Date.now() }
                        ]
                    };
                    setEnemies(updatedEnemies.filter(e => e.health > 0));
                    setCounterActive(false);
                } else {
                    const newHealth = playerHealth - enemy.damage;
                    setPlayerHealth(newHealth);
                    if (newHealth <= 0) {
                        setGameOver(true);
                    }
                }
            }
        });
        
        // Draw new hand after a short delay
        setTimeout(drawCards, 0);
    }, [gameOver, hand, counterActive, enemies, playerHealth, drawCards, resetTargeting]);
    
    // Check if can end turn
    const canEndTurn = !isTargeting && (
        playerEnergy === 0 || 
        hand.every(card => {
            const cardDef = cardTypes[card.type];
            const discountType = discountedCards.get(card.id);
            const currentCost = discountType === "zero" ? 0 : 
                              discountType === "reduced" ? Math.max(0, cardDef.cost - 1) : 
                              cardDef.cost;
            return currentCost > playerEnergy;
        })
    );
    
    // Victory check
    useEffect(() => {
        if (enemies.length === 0 && !showVictory && gameStarted && round > 0) {
            if (round === 14) {
                setShowPreBossFight(true);
            } else {
                setShowVictory(true);
                setEmpowerActive(false);
                const rewards = generateRewards(cardTypes, 3);
                setRewardOptions(rewards);
            }
        }
    }, [enemies.length, showVictory, gameStarted, round]);
    
    return {
        // State
        playerHealth,
        maxHealth,
        playerEnergy,
        round,
        hand,
        deck,
        discardPile,
        exhaustedCards,
        totalDeckSize,
        cardIdCounter,
        discountedCards,
        enemies,
        empowerActive,
        counterActive,
        selectedCard,
        selectedCardIndex,
        isTargeting,
        showVictory,
        showPreBossFight,
        showSpecialRewards,
        showCardRemoval,
        rewardOptions,
        specialRewardOptions,
        gameStarted,
        gameOver,
        showEnergyGain,
        statusMessage,
        showStatusMessage,
        currentScreen,
        canEndTurn,
        
        // Setters
        setPlayerHealth,
        setMaxHealth,
        setPlayerEnergy,
        setRound,
        setHand,
        setDeck,
        setDiscardPile,
        setExhaustedCards,
        setTotalDeckSize,
        setCardIdCounter,
        setDiscountedCards,
        setEnemies,
        setEmpowerActive,
        setCounterActive,
        setSelectedCard,
        setSelectedCardIndex,
        setIsTargeting,
        setShowVictory,
        setShowPreBossFight,
        setShowSpecialRewards,
        setShowCardRemoval,
        setRewardOptions,
        setSpecialRewardOptions,
        setGameStarted,
        setGameOver,
        setShowEnergyGain,
        setStatusMessage,
        setShowStatusMessage,
        setCurrentScreen,
        
        // Actions
        initializeGame,
        spawnEnemies,
        drawCards,
        resetTargeting,
        endTurn,
        createCardInstance
    };
};