import React, { useState, useEffect, useCallback } from 'react';
import { enemyTypes, createEnemy, getEnemyIntent, executeEnemyAction } from '../data/enemyTypes.js';
import { playerClasses } from '../data/playerClasses.js';
import { talentTrees } from '../data/talents.js';
import { relics } from '../data/relics.js';
import { achievements, checkAchievement } from '../data/achievements.js';

export const Game = () => {
    // Core game state
    const [playerHealth, setPlayerHealth] = useState(100);
    const [maxHealth, setMaxHealth] = useState(100);
    const [playerEnergy, setPlayerEnergy] = useState(3);
    const [hand, setHand] = useState([]);
    const [deck, setDeck] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [exhaustedCards, setExhaustedCards] = useState([]);
    const [enemies, setEnemies] = useState([]);
    const [empowerActive, setEmpowerActive] = useState(false);
    const [empowerLevel, setEmpowerLevel] = useState(2);
    const [counterActive, setCounterActive] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isTargeting, setIsTargeting] = useState(false);
    const [round, setRound] = useState(1);
    const [showVictory, setShowVictory] = useState(false);
    const [rewardOptions, setRewardOptions] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentScreen, setCurrentScreen] = useState('splash');
    const [cardIdCounter, setCardIdCounter] = useState(0);
    const [discountedCards, setDiscountedCards] = useState(new Map());
    const [selectedClass, setSelectedClass] = useState(null);
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [playerStatusEffects, setPlayerStatusEffects] = useState([]);
    const [healthAnimation, setHealthAnimation] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    // Progression state
    const [talentPoints, setTalentPoints] = useState(3); // Start with 3 points
    const [talents, setTalents] = useState({});
    const [equippedRelics, setEquippedRelics] = useState([]);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);
    const [gameStats, setGameStats] = useState({
        maxRound: 0,
        maxSingleDamage: 0,
        maxTurnDamage: 0,
        lowestWinHP: 999,
        pacifistWins: 0,
        maxDeckSize: 0,
        maxUpgradedCards: 0,
        classWins: { warrior: 0, mage: 0, rogue: 0, cleric: 0 },
        totalRuns: 0
    });

    // Save game state to localStorage
    const saveGame = useCallback(() => {
        if (!gameStarted || gameOver) return;
        
        const gameState = {
            playerHealth,
            maxHealth,
            playerEnergy,
            hand,
            deck,
            discardPile,
            exhaustedCards,
            enemies,
            empowerActive,
            empowerLevel,
            counterActive,
            round,
            cardIdCounter,
            selectedClass,
            playerStatusEffects,
            equippedRelics,
            timestamp: Date.now()
        };
        
        localStorage.setItem('endlessrpg_save', JSON.stringify(gameState));
        setSaveIndicator(true);
        setTimeout(() => setSaveIndicator(false), 2000);
    }, [playerHealth, maxHealth, playerEnergy, hand, deck, discardPile, exhaustedCards, enemies, empowerActive, empowerLevel, counterActive, round, cardIdCounter, selectedClass, playerStatusEffects, gameStarted, gameOver]);

    // Load game state from localStorage
    const loadGame = useCallback(() => {
        const savedGame = localStorage.getItem('endlessrpg_save');
        if (savedGame) {
            try {
                const gameState = JSON.parse(savedGame);
                setPlayerHealth(gameState.playerHealth);
                setMaxHealth(gameState.maxHealth);
                setPlayerEnergy(gameState.playerEnergy);
                setHand(gameState.hand);
                setDeck(gameState.deck);
                setDiscardPile(gameState.discardPile);
                setExhaustedCards(gameState.exhaustedCards);
                setEnemies(gameState.enemies);
                setEmpowerActive(gameState.empowerActive);
                setEmpowerLevel(gameState.empowerLevel || 2);
                setCounterActive(gameState.counterActive);
                setRound(gameState.round);
                setCardIdCounter(gameState.cardIdCounter);
                setSelectedClass(gameState.selectedClass);
                setPlayerStatusEffects(gameState.playerStatusEffects || []);
                setGameStarted(true);
                setCurrentScreen('game');
                return true;
            } catch (error) {
                console.error('Failed to load save game:', error);
                return false;
            }
        }
        return false;
    }, []);

    // Check for saved game on mount
    const hasSavedGame = () => {
        const savedGame = localStorage.getItem('endlessrpg_save');
        return savedGame !== null;
    };

    // Save progression data separately
    const saveProgression = useCallback(() => {
        const progressionData = {
            talentPoints,
            talents,
            unlockedAchievements,
            gameStats
        };
        localStorage.setItem('endlessrpg_progression', JSON.stringify(progressionData));
    }, [talentPoints, talents, unlockedAchievements, gameStats]);

    // Load progression data
    const loadProgression = useCallback(() => {
        const savedProgression = localStorage.getItem('endlessrpg_progression');
        if (savedProgression) {
            try {
                const progressionData = JSON.parse(savedProgression);
                setTalentPoints(progressionData.talentPoints || 0);
                setTalents(progressionData.talents || {});
                setUnlockedAchievements(progressionData.unlockedAchievements || []);
                setGameStats(progressionData.gameStats || {
                    maxRound: 0,
                    maxSingleDamage: 0,
                    maxTurnDamage: 0,
                    lowestWinHP: 999,
                    pacifistWins: 0,
                    maxDeckSize: 0,
                    maxUpgradedCards: 0,
                    classWins: { warrior: 0, mage: 0, rogue: 0, cleric: 0 },
                    totalRuns: 0
                });
            } catch (error) {
                console.error('Failed to load progression:', error);
            }
        }
    }, []);

    // Load progression on mount
    useEffect(() => {
        loadProgression();
    }, [loadProgression]);

    // Card definitions
    const cardTypes = {
        multiAttack: {
            name: 'Multi-Attack',
            cost: 2,
            description: 'Hit all enemies for 3 damage',
            needsTarget: false,
            rarity: 'common'
        },
        singleAttack: {
            name: 'Single Attack',
            cost: 1,
            description: 'Hit one enemy for 5 damage',
            needsTarget: true,
            rarity: 'common'
        },
        empower: {
            name: 'Empower',
            cost: 1,
            description: 'Next attack deals +2 damage',
            needsTarget: false,
            rarity: 'common'
        },
        counter: {
            name: 'Counter',
            cost: 2,
            description: 'Block and return next enemy attack',
            needsTarget: false,
            rarity: 'uncommon'
        },
        heavyAttack: {
            name: 'Heavy Attack',
            cost: 2,
            description: 'Deal 8 damage to one enemy',
            needsTarget: true,
            rarity: 'uncommon'
        },
        quickStrike: {
            name: 'Quick Strike',
            cost: 1,
            description: 'Deal 3 damage and draw a card',
            needsTarget: true,
            rarity: 'common'
        },
        doubleEnergy: {
            name: 'Energize',
            cost: 1,
            description: 'Gain 2 Energy',
            needsTarget: false,
            rarity: 'common'
        },
        luckyDraw: {
            name: 'Lucky Draw',
            cost: 2,
            description: 'Draw a card and reduce its cost to 0',
            needsTarget: false,
            rarity: 'rare'
        },
        // Upgraded card variants
        singleAttackPlus: {
            name: 'Single Attack+',
            cost: 1,
            description: 'Hit one enemy for 7 damage',
            needsTarget: true,
            rarity: 'common',
            upgraded: true
        },
        multiAttackPlus: {
            name: 'Multi-Attack+',
            cost: 2,
            description: 'Hit all enemies for 5 damage',
            needsTarget: false,
            rarity: 'common',
            upgraded: true
        },
        heavyAttackPlus: {
            name: 'Heavy Attack+',
            cost: 2,
            description: 'Deal 12 damage to one enemy',
            needsTarget: true,
            rarity: 'uncommon',
            upgraded: true
        },
        empowerPlus: {
            name: 'Empower+',
            cost: 1,
            description: 'Next attack deals +3 damage',
            needsTarget: false,
            rarity: 'common',
            upgraded: true
        },
        counterPlus: {
            name: 'Counter+',
            cost: 2,
            description: 'Block and return next enemy attack, draw a card',
            needsTarget: false,
            rarity: 'uncommon',
            upgraded: true
        },
        healthSiphon: {
            name: 'Health Siphon',
            cost: 2,
            description: 'Deal 3 damage and heal for damage dealt',
            needsTarget: true,
            rarity: 'uncommon'
        },
        divineBlessing: {
            name: 'Divine Blessing',
            cost: 1,
            description: 'Heal 10 HP. Exhaust.',
            needsTarget: false,
            rarity: 'uncommon',
            exhausts: true
        },
        recycle: {
            name: 'Recycle',
            cost: 1,
            description: 'Draw a random card from discard pile',
            needsTarget: false,
            rarity: 'common'
        },
        discount: {
            name: 'Discount',
            cost: 2,
            description: 'Reduce cost of all cards in hand by 1',
            needsTarget: false,
            rarity: 'rare'
        }
    };

    // Helper functions
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const createDamageNumber = (amount, id) => ({
        amount,
        id,
        createdAt: Date.now()
    });

    const showHealthAnimation = (type, amount) => {
        setHealthAnimation({ type, amount, id: Date.now() });
        setTimeout(() => setHealthAnimation(null), 1500);
    };

    // Audio system
    const playSound = (soundType) => {
        try {
            const audio = new Audio();
            switch (soundType) {
                case 'cardPlay':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjOK1e3QgiEFKXa88dqIOwc';
                    break;
                case 'damage':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjOK1e3QgiEFKXa88dqIOwc';
                    break;
                case 'heal':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjOK1e3QgiEFKXa88dqIOwc';
                    break;
                case 'victory':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjOK1e3QgiEFKXa88dqIOwc';
                    break;
            }
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore audio errors
        } catch (error) {
            // Ignore audio errors
        }
    };

    // Calculate if player can end turn
    const canEndTurn = !isTargeting && (
        playerEnergy === 0 || 
        hand.every(card => {
            const cardDef = cardTypes[card.type];
            const discountType = discountedCards.get(card.id);
            const currentCost = discountType === "reduced" ? Math.max(0, cardDef.cost - 1) : cardDef.cost;
            return currentCost > playerEnergy;
        })
    );

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (currentScreen !== 'game' || gameOver || showVictory) return;

            const key = event.key.toLowerCase();
            
            switch (key) {
                case '1':
                case '2':
                case '3':
                    const cardIndex = parseInt(key) - 1;
                    if (hand[cardIndex] && canPlayCard(hand[cardIndex])) {
                        selectCard(hand[cardIndex], cardIndex);
                    }
                    break;
                case 'q':
                case 'w':
                case 'r':
                    if (isTargeting && enemies.length > 0) {
                        const targetMap = { 'q': 0, 'w': 1, 'r': 2 };
                        const targetIndex = targetMap[key];
                        if (enemies[targetIndex]) {
                            selectTarget(targetIndex);
                        }
                    }
                    break;
                case 'e':
                case 'enter':
                case ' ':
                    if (canEndTurn) {
                        endTurn();
                    }
                    break;
                case 'h':
                case '?':
                    setShowHelp(!showHelp);
                    break;
                case 'escape':
                    if (isTargeting) {
                        setIsTargeting(false);
                        setSelectedCard(null);
                        setSelectedCardIndex(null);
                    } else if (showHelp) {
                        setShowHelp(false);
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentScreen, gameOver, showVictory, hand, playerEnergy, isTargeting, enemies, showHelp, discountedCards, canEndTurn]);

    // Add audio to card plays and effects
    const selectCardWithAudio = (card, index) => {
        playSound('cardPlay');
        selectCard(card, index);
    };

    // Achievement checking
    const checkAchievements = useCallback(() => {
        Object.keys(achievements).forEach(achievementId => {
            if (!unlockedAchievements.includes(achievementId)) {
                if (checkAchievement(achievementId, gameStats)) {
                    setUnlockedAchievements(prev => [...prev, achievementId]);
                    const achievement = achievements[achievementId];
                    if (achievement.reward.type === 'talentPoints') {
                        setTalentPoints(prev => prev + achievement.reward.amount);
                    }
                    saveProgression();
                    playSound('victory');
                }
            }
        });
    }, [gameStats, unlockedAchievements, saveProgression]);

    // Update game stats
    const updateGameStats = useCallback((updates) => {
        setGameStats(prev => {
            const newStats = { ...prev, ...updates };
            return newStats;
        });
    }, []);

    useEffect(() => {
        checkAchievements();
    }, [gameStats, checkAchievements]);

    // Auto-save progression when it changes
    useEffect(() => {
        saveProgression();
    }, [talentPoints, talents, unlockedAchievements, saveProgression]);

    // Initialize game
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

        // Create initial enemies with sprites
        const numberOfEnemies = Math.floor(Math.random() * 2) + 1;
        const initialEnemies = Array(numberOfEnemies).fill().map(() => {
            const enemy = createEnemy(1);
            enemy.intent = getEnemyIntent(enemy, [], playerHealth, 1);
            return enemy;
        });
        setEnemies(initialEnemies);
    }, []);

    // Handle splash screen
    useEffect(() => {
        const startGame = () => {
            if (currentScreen === 'splash') {
                setCurrentScreen('menu');
            }
        };

        const handleKeyPress = () => startGame();
        const handleClick = () => startGame();

        if (currentScreen === 'splash') {
            window.addEventListener('keydown', handleKeyPress);
            window.addEventListener('click', handleClick);

            return () => {
                window.removeEventListener('keydown', handleKeyPress);
                window.removeEventListener('click', handleClick);
            };
        }
    }, [currentScreen]);

    // Auto-save after significant game events
    useEffect(() => {
        if (gameStarted && !gameOver) {
            saveGame();
        }
    }, [playerHealth, round, enemies.length, hand.length, saveGame, gameStarted, gameOver]);

    // Victory check
    useEffect(() => {
        if (enemies.length === 0 && !showVictory && gameStarted && round > 0) {
            setShowVictory(true);
            setEmpowerActive(false);
            playSound('victory');
            
            // Update game statistics  
            const newStats = {
                maxRound: Math.max(gameStats.maxRound, round),
                lowestWinHP: Math.min(gameStats.lowestWinHP, playerHealth),
                maxDeckSize: Math.max(gameStats.maxDeckSize, deck.length + hand.length + discardPile.length + exhaustedCards.length)
            };
            
            // Check for class completion achievement
            if (round >= 15) {
                newStats.classWins = {
                    ...gameStats.classWins,
                    [selectedClass]: (gameStats.classWins[selectedClass] || 0) + 1
                };
            }
            
            updateGameStats(newStats);
            
            // Award talent points for milestone rounds
            if (round % 5 === 0) {
                setTalentPoints(prev => prev + 1);
                saveProgression();
            }
            
            // Generate rewards with chance for upgraded cards
            const cardMasteryRank = talents.cardMastery || 0;
            const upgradeChance = 0.3 + (cardMasteryRank * 0.1);
            const possibleRewards = Object.keys(cardTypes).filter(cardType => !cardTypes[cardType].upgraded);
            const rewards = [];
            while (rewards.length < 3) {
                const randomCard = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
                if (!rewards.includes(randomCard)) {
                    // Chance to offer upgraded version (improved by Card Mastery talent)
                    const upgradedVersion = randomCard + 'Plus';
                    const shouldUpgrade = cardTypes[upgradedVersion] && Math.random() < upgradeChance;
                    rewards.push(shouldUpgrade ? upgradedVersion : randomCard);
                }
            }
            setRewardOptions(rewards);
        }
    }, [enemies.length, showVictory, gameStarted, round]);

    // Game actions
    const selectCard = (card, index) => {
        const cardDef = cardTypes[card.type];
        const discountType = discountedCards.get(card.id);
        const currentCost = discountType === "reduced" ? Math.max(0, cardDef.cost - 1) : cardDef.cost;

        if (playerEnergy >= currentCost) {
            if (cardDef.needsTarget) {
                setSelectedCard(card);
                setSelectedCardIndex(index);
                setIsTargeting(true);
            } else {
                playCard(card, index);
            }
        }
    };

    const selectTarget = (targetIndex) => {
        if (isTargeting && selectedCard) {
            const card = selectedCard;
            const index = selectedCardIndex;

            setIsTargeting(false);
            setSelectedCard(null);
            setSelectedCardIndex(null);

            playCard(card, index, targetIndex);
        }
    };

    const playCard = (card, handIndex, targetIndex = null) => {
        if (gameOver) return;

        const cardDef = cardTypes[card.type];
        const discountType = discountedCards.get(card.id);
        const currentCost = discountType === "reduced" ? Math.max(0, cardDef.cost - 1) : cardDef.cost;

        if (playerEnergy >= currentCost) {
            setPlayerEnergy(prev => prev - currentCost);

            const newHand = [...hand];
            const playedCard = newHand.splice(handIndex, 1)[0];
            setHand(newHand);

            // Card effects
            const attackCards = ['singleAttack', 'multiAttack', 'heavyAttack', 'quickStrike', 'healthSiphon', 'singleAttackPlus', 'multiAttackPlus', 'heavyAttackPlus'];
            
            if (card.type === 'multiAttack' || card.type === 'multiAttackPlus') {
                const baseDamage = card.type === 'multiAttackPlus' ? 5 : 3;
                const talentBonus = (talents.powerStrike || 0);
                const critChance = (talents.criticalHit || 0) * 0.1;
                const isCrit = Math.random() < critChance;
                const damage = empowerActive ? baseDamage + empowerLevel + talentBonus : baseDamage + talentBonus;
                const finalDamage = isCrit ? damage * 2 : damage;
                
                // Track damage for achievements
                updateGameStats({
                    maxSingleDamage: Math.max(gameStats.maxSingleDamage, finalDamage)
                });
                
                const updatedEnemies = enemies.map(enemy => ({
                    ...enemy,
                    health: Math.max(0, enemy.health - finalDamage),
                    damageNumbers: [
                        ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                        createDamageNumber(finalDamage, Date.now())
                    ]
                }));
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));
                playSound('damage');
                setEmpowerActive(false);
            } else if (card.type === 'singleAttack' || card.type === 'singleAttackPlus') {
                const baseDamage = card.type === 'singleAttackPlus' ? 7 : 5;
                const talentBonus = (talents.powerStrike || 0);
                const critChance = (talents.criticalHit || 0) * 0.1;
                const isCrit = Math.random() < critChance;
                const damage = empowerActive ? baseDamage + empowerLevel + talentBonus : baseDamage + talentBonus;
                const finalDamage = isCrit ? damage * 2 : damage;
                const updatedEnemies = enemies.map((enemy, index) => {
                    if (index === targetIndex) {
                        return {
                            ...enemy,
                            health: Math.max(0, enemy.health - finalDamage),
                            damageNumbers: [
                                ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                                createDamageNumber(finalDamage, Date.now())
                            ]
                        };
                    }
                    return enemy;
                });
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));
                setEmpowerActive(false);
            } else if (card.type === 'heavyAttack' || card.type === 'heavyAttackPlus') {
                const baseDamage = card.type === 'heavyAttackPlus' ? 12 : 8;
                const damage = empowerActive ? baseDamage + empowerLevel : baseDamage;
                const updatedEnemies = enemies.map((enemy, index) => {
                    if (index === targetIndex) {
                        return {
                            ...enemy,
                            health: Math.max(0, enemy.health - damage),
                            damageNumbers: [
                                ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                                createDamageNumber(damage, Date.now())
                            ]
                        };
                    }
                    return enemy;
                });
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));
                setEmpowerActive(false);
            } else if (card.type === 'quickStrike') {
                const damage = empowerActive ? 3 + empowerLevel : 3;
                const updatedEnemies = enemies.map((enemy, index) => {
                    if (index === targetIndex) {
                        return {
                            ...enemy,
                            health: Math.max(0, enemy.health - damage),
                            damageNumbers: [
                                ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                                createDamageNumber(damage, Date.now())
                            ]
                        };
                    }
                    return enemy;
                });
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));
                setEmpowerActive(false);
                
                // Draw a card
                setTimeout(() => {
                    if (deck.length > 0) {
                        const cardToDraw = deck[0];
                        setDeck(prev => prev.slice(1));
                        setHand(prev => [...prev, cardToDraw]);
                    } else if (discardPile.length > 0) {
                        const shuffledDiscard = shuffleArray([...discardPile]);
                        const cardToDraw = shuffledDiscard[0];
                        setDeck(shuffledDiscard.slice(1));
                        setDiscardPile([]);
                        setHand(prev => [...prev, cardToDraw]);
                    }
                }, 0);
            } else if (card.type === 'healthSiphon') {
                const damage = empowerActive ? 3 + empowerLevel : 3;
                const updatedEnemies = enemies.map((enemy, index) => {
                    if (index === targetIndex) {
                        const actualDamage = Math.min(enemy.health, damage);
                        const healAmount = actualDamage;
                        setPlayerHealth(prev => {
                            const newHealth = Math.min(maxHealth, prev + healAmount);
                            if (healAmount > 0) {
                                showHealthAnimation('heal', healAmount);
                                playSound('heal');
                            }
                            return newHealth;
                        });
                        return {
                            ...enemy,
                            health: Math.max(0, enemy.health - damage),
                            damageNumbers: [
                                ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                                createDamageNumber(damage, Date.now())
                            ]
                        };
                    }
                    return enemy;
                });
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));
                setEmpowerActive(false);
            } else if (card.type === 'doubleEnergy') {
                setPlayerEnergy(prev => prev + 2);
            } else if (card.type === 'divineBlessing') {
                setPlayerHealth(prev => {
                    const newHealth = Math.min(maxHealth, prev + 10);
                    showHealthAnimation('heal', 10);
                    playSound('heal');
                    return newHealth;
                });
            } else if (card.type === 'recycle') {
                if (discardPile.length > 0) {
                    const randomIndex = Math.floor(Math.random() * discardPile.length);
                    const drawnCard = discardPile[randomIndex];
                    const newDiscard = [...discardPile];
                    newDiscard.splice(randomIndex, 1);
                    setDiscardPile(newDiscard);
                    setHand(prev => [...prev, drawnCard]);
                }
            } else if (card.type === 'discount') {
                const newDiscounts = new Map();
                hand.forEach(handCard => {
                    if (handCard.id !== card.id) {
                        newDiscounts.set(handCard.id, "reduced");
                    }
                });
                setDiscountedCards(newDiscounts);
            } else if (card.type === 'empower' || card.type === 'empowerPlus') {
                setEmpowerActive(true);
                setEmpowerLevel(card.type === 'empowerPlus' ? 3 : 2);
            } else if (card.type === 'counter') {
                setCounterActive(true);
            } else if (card.type === 'counterPlus') {
                setCounterActive(true);
                // Draw a card as bonus effect
                if (deck.length > 0) {
                    const cardToDraw = deck[0];
                    setDeck(prev => prev.slice(1));
                    setHand(prev => [...prev, cardToDraw]);
                } else if (discardPile.length > 0) {
                    const shuffledDiscard = shuffleArray([...discardPile]);
                    const cardToDraw = shuffledDiscard[0];
                    setDeck(shuffledDiscard.slice(1));
                    setDiscardPile([]);
                    setHand(prev => [...prev, cardToDraw]);
                }
            }

            setDiscardPile(prev => [...prev, playedCard]);
        }
    };

    const endTurn = () => {
        if (gameOver) return;

        // Process player status effects
        let statusDamage = 0;
        const updatedPlayerEffects = playerStatusEffects.map(effect => {
            if (effect.type === 'poison') {
                statusDamage += effect.damage;
            }
            return { ...effect, duration: effect.duration - 1 };
        }).filter(effect => effect.duration > 0);
        
        setPlayerStatusEffects(updatedPlayerEffects);
        
        if (statusDamage > 0) {
            const newHealth = playerHealth - statusDamage;
            setPlayerHealth(newHealth);
            if (newHealth <= 0) {
                setGameOver(true);
                return;
            }
        }

        // Move hand to discard
        setDiscardPile(prev => [...prev, ...hand]);
        setHand([]);

        // Reset states
        setDiscountedCards(new Map());
        const baseEnergy = 3;
        const energyBonus = talents.energyEfficiency || 0;
        setPlayerEnergy(baseEnergy + energyBonus);
        setCounterActive(false);
        setIsTargeting(false);
        setSelectedCard(null);
        setSelectedCardIndex(null);

        // Process enemy actions with new AI system
        const updatedEnemies = enemies.map(enemy => {
            const action = executeEnemyAction(enemy, enemy.intent, enemies);
            let updatedEnemy = { ...enemy };
            
            // Apply enemy effects
            if (action.effect) {
                switch (action.effect.type) {
                    case 'block':
                        updatedEnemy.block = (updatedEnemy.block || 0) + action.effect.amount;
                        break;
                    case 'damage_buff':
                        updatedEnemy.damage = updatedEnemy.baseDamage + action.effect.amount;
                        updatedEnemy.buffs.set('damage_buff', { 
                            amount: action.effect.amount, 
                            duration: action.effect.duration 
                        });
                        break;
                    case 'heal':
                        updatedEnemy.health = Math.min(updatedEnemy.maxHealth, updatedEnemy.health + action.effect.amount);
                        break;
                    case 'regenerate':
                        updatedEnemy.health = Math.min(updatedEnemy.maxHealth, updatedEnemy.health + action.effect.amount);
                        break;
                    case 'transform':
                        updatedEnemy.maxHealth += action.effect.healthBonus;
                        updatedEnemy.health += action.effect.healthBonus;
                        updatedEnemy.damage = updatedEnemy.baseDamage + action.effect.damageBonus;
                        break;
                    case 'self_damage':
                        updatedEnemy.health = Math.max(1, updatedEnemy.health - action.effect.amount);
                        break;
                }
            }
            
            // Handle player damage
            if (action.damage > 0) {
                if (counterActive) {
                    updatedEnemy.health = Math.max(0, updatedEnemy.health - action.damage);
                    updatedEnemy.damageNumbers = [
                        ...updatedEnemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                        { amount: action.damage, id: Date.now(), createdAt: Date.now() }
                    ];
                    setCounterActive(false);
                } else {
                    const damage = Math.max(0, action.damage - (updatedEnemy.block || 0));
                    const newHealth = playerHealth - damage;
                    setPlayerHealth(newHealth);
                    if (damage > 0) {
                        showHealthAnimation('damage', damage);
                        playSound('damage');
                    }
                    
                    if (action.effect?.type === 'poison') {
                        setPlayerStatusEffects(prev => [...prev, {
                            type: 'poison',
                            duration: action.effect.duration,
                            damage: action.effect.damage,
                            id: Date.now()
                        }]);
                    }
                    
                    if (action.effect?.type === 'entangle') {
                        setPlayerStatusEffects(prev => [...prev, {
                            type: 'entangle',
                            duration: action.effect.duration,
                            id: Date.now()
                        }]);
                    }
                    
                    if (newHealth <= 0) {
                        setGameOver(true);
                    }
                }
            }
            
            // Handle pack buffs
            if (action.effect?.type === 'pack_buff') {
                return enemies.filter(e => e.type === 'wolf').map(wolfEnemy => ({
                    ...wolfEnemy,
                    damage: wolfEnemy.baseDamage + action.effect.amount
                }));
            }
            
            // Reset block after taking damage
            updatedEnemy.block = 0;
            
            // Calculate next intent
            updatedEnemy.intent = getEnemyIntent(updatedEnemy, enemies, playerHealth, round);
            
            return updatedEnemy;
        });
        
        setEnemies(updatedEnemies.filter(e => e.health > 0));

        // Draw new hand
        setTimeout(() => {
            let currentDeck = [...deck];
            const currentDiscard = [...discardPile, ...hand];
            const baseHandSize = 3;
            const cardDrawBonus = talents.cardDraw || 0;
            const handSize = baseHandSize + cardDrawBonus;

            if (currentDeck.length < handSize && currentDiscard.length > 0) {
                currentDeck = shuffleArray([...currentDeck, ...currentDiscard]);
                setDiscardPile([]);
            }

            const newHand = currentDeck.slice(0, handSize);
            const remainingDeck = currentDeck.slice(handSize);

            setDeck(remainingDeck);
            setHand(newHand);
        }, 100);
    };

    const selectReward = (cardType) => {
        const newCard = {
            id: cardIdCounter + 1,
            type: cardType
        };
        setCardIdCounter(prev => prev + 1);

        const currentCards = [...deck, ...discardPile, ...exhaustedCards];
        const allCards = [...currentCards, newCard];
        const shuffledDeck = shuffleArray(allCards);

        setDeck(shuffledDeck);
        setHand([]);
        setDiscardPile([]);
        setExhaustedCards([]);
        setShowVictory(false);
        setRound(prev => prev + 1);
        setPlayerEnergy(3);
        setEmpowerActive(false);
        setCounterActive(false);

        // Spawn new enemies with sprites
        const numberOfEnemies = Math.floor(Math.random() * 3) + 1;
        const newEnemies = Array(numberOfEnemies).fill().map(() => {
            const enemy = createEnemy(round + 1);
            enemy.intent = getEnemyIntent(enemy, [], playerHealth, round + 1);
            return enemy;
        });
        setEnemies(newEnemies);

        // Draw new hand
        setTimeout(() => {
            const newHand = shuffledDeck.slice(0, 3);
            const remainingDeck = shuffledDeck.slice(3);
            setHand(newHand);
            setDeck(remainingDeck);
        }, 0);
    };

    const getCardCost = (card) => {
        const cardDef = cardTypes[card.type];
        const discountType = discountedCards.get(card.id);
        return discountType === "reduced" ? Math.max(0, cardDef.cost - 1) : cardDef.cost;
    };

    const canPlayCard = (card) => {
        return playerEnergy >= getCardCost(card);
    };

    // Screen handlers
    const handleStartRun = () => {
        setCurrentScreen('classSelection');
    };

    const handleClassSelect = (classKey) => {
        setSelectedClass(classKey);
        setCurrentScreen('game');
        initializeGameWithClass(classKey);
    };

    const initializeGameWithClass = (classKey) => {
        const playerClass = playerClasses[classKey];
        let initialDeckTypes = [...playerClass.startingDeck];
        
        // Apply talent bonuses
        const vitalityRank = talents.vitality || 0;
        const baseHealth = playerClass.startingHealth + (vitalityRank * 10);
        
        // Grand Master talent - upgrade all starting cards
        if (talents.grandMaster) {
            initialDeckTypes = initialDeckTypes.map(cardType => {
                const upgradedVersion = cardType + 'Plus';
                return cardTypes[upgradedVersion] ? upgradedVersion : cardType;
            });
        }
        
        // Weapon Master talent - add Heavy Attack+
        if (talents.weaponMaster) {
            initialDeckTypes.push('heavyAttackPlus');
        }

        const initialDeck = initialDeckTypes.map((type, index) => ({
            id: index + 1,
            type: type
        }));

        setCardIdCounter(initialDeck.length);
        setPlayerHealth(baseHealth);
        setMaxHealth(baseHealth);

        const shuffledCards = shuffleArray([...initialDeck]);
        const initialHand = shuffledCards.slice(0, 3);
        const remainingDeck = shuffledCards.slice(3);

        setDeck(remainingDeck);
        setHand(initialHand);
        setDiscardPile([]);
        setExhaustedCards([]);
        setGameStarted(true);

        // Create initial enemies with sprites
        const numberOfEnemies = Math.floor(Math.random() * 2) + 1;
        const initialEnemies = Array(numberOfEnemies).fill().map(() => {
            const enemy = createEnemy(1);
            enemy.intent = getEnemyIntent(enemy, [], playerHealth, 1);
            return enemy;
        });
        setEnemies(initialEnemies);
    };

    const handleTalents = () => {
        setCurrentScreen('talents');
    };

    const handleAchievements = () => {
        setCurrentScreen('achievements');
    };

    const handleLoadGame = () => {
        if (loadGame()) {
            setCurrentScreen('game');
        }
    };

    const handleBackToMenu = () => {
        setCurrentScreen('menu');
    };

    const returnToMenu = () => {
        setGameOver(false);
        setPlayerHealth(100);
        setMaxHealth(100);
        setPlayerEnergy(3);
        setRound(1);
        setEmpowerActive(false);
        setCounterActive(false);
        setHand([]);
        setDiscardPile([]);
        setExhaustedCards([]);
        setIsTargeting(false);
        setSelectedCard(null);
        setSelectedCardIndex(null);
        setPlayerStatusEffects([]);
        setCurrentScreen('menu');
        // Clear save when returning to menu
        localStorage.removeItem('endlessrpg_save');
    };

    // Render different screens
    if (currentScreen === 'splash') {
        return (
            <div className="main-menu" style={{ cursor: 'pointer' }}>
                <div className="game-title">RAID BOSS</div>
                <div className="press-any-key">Press Any Key or Click to Start Game</div>
            </div>
        );
    }

    if (currentScreen === 'menu') {
        return (
            <div className="main-menu">
                <div className="game-title" style={{ marginBottom: '4rem' }}>RAID BOSS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={handleStartRun} className="button" style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '2rem',
                        padding: '1rem 3rem',
                        backgroundColor: '#e74c3c'
                    }}>
                        Start Run
                    </button>
                    {hasSavedGame() && (
                        <button onClick={handleLoadGame} className="button" style={{
                            fontFamily: 'Cinzel, serif',
                            fontSize: '2rem',
                            padding: '1rem 3rem',
                            backgroundColor: '#27ae60'
                        }}>
                            Continue Run
                        </button>
                    )}
                    <button onClick={handleTalents} className="button" style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '2rem',
                        padding: '1rem 3rem',
                        backgroundColor: '#e74c3c'
                    }}>
                        Talents {talentPoints > 0 && `(${talentPoints})`}
                    </button>
                    <button onClick={handleAchievements} className="button" style={{
                        fontFamily: 'Cinzel, serif',
                        fontSize: '2rem',
                        padding: '1rem 3rem',
                        backgroundColor: '#8e44ad'
                    }}>
                        Achievements
                    </button>
                </div>
            </div>
        );
    }

    if (currentScreen === 'classSelection') {
        return (
            <div className="main-menu">
                <div className="game-title" style={{ marginBottom: '2rem' }}>Choose Your Class</div>
                <div className="class-selection-container">
                    {Object.entries(playerClasses).map(([key, playerClass]) => (
                        <div
                            key={key}
                            className="class-card"
                            onClick={() => handleClassSelect(key)}
                        >
                            <img 
                                src={playerClass.sprite} 
                                alt={playerClass.name}
                                className="class-sprite"
                            />
                            <div className="class-name">{playerClass.name}</div>
                            <div className="class-description">{playerClass.description}</div>
                            <div className="class-stats">Starting Health: {playerClass.startingHealth}</div>
                        </div>
                    ))}
                </div>
                <button onClick={handleBackToMenu} className="button" style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.5rem',
                    padding: '1rem 2rem',
                    backgroundColor: '#666',
                    marginTop: '2rem'
                }}>
                    Back
                </button>
            </div>
        );
    }

    if (currentScreen === 'talents') {
        const investTalent = (treeId, talentId) => {
            const tree = talentTrees[treeId];
            const talent = tree.talents[talentId];
            const currentRank = talents[talentId] || 0;
            
            if (currentRank < talent.maxRank && talentPoints >= talent.cost[currentRank]) {
                setTalents(prev => ({
                    ...prev,
                    [talentId]: currentRank + 1
                }));
                setTalentPoints(prev => prev - talent.cost[currentRank]);
                saveProgression();
                playSound('cardPlay');
            }
        };

        return (
            <div className="main-menu">
                <div className="game-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Talents</div>
                <div className="talent-points">Talent Points: {talentPoints}</div>
                
                <div className="talent-trees">
                    {Object.entries(talentTrees).map(([treeId, tree]) => (
                        <div key={treeId} className="talent-tree">
                            <h3 className="tree-title">{tree.name}</h3>
                            <p className="tree-description">{tree.description}</p>
                            <div className="talents-grid">
                                {Object.entries(tree.talents).map(([talentId, talent]) => {
                                    const currentRank = talents[talentId] || 0;
                                    const maxRank = talent.maxRank;
                                    const canInvest = currentRank < maxRank && 
                                                    talentPoints >= talent.cost[currentRank] &&
                                                    (!talent.prerequisite || talents[talent.prerequisite] > 0);
                                    
                                    return (
                                        <div
                                            key={talentId}
                                            className={`talent-node ${canInvest ? 'available' : ''} ${currentRank > 0 ? 'invested' : ''}`}
                                            onClick={() => canInvest && investTalent(treeId, talentId)}
                                        >
                                            <div className="talent-name">{talent.name}</div>
                                            <div className="talent-rank">{currentRank}/{maxRank}</div>
                                            <div className="talent-description">{talent.description}</div>
                                            {canInvest && (
                                                <div className="talent-cost">Cost: {talent.cost[currentRank]}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                
                <button onClick={handleBackToMenu} className="button" style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.5rem',
                    padding: '1rem 2rem',
                    backgroundColor: '#e74c3c',
                    marginTop: '2rem'
                }}>
                    Back
                </button>
            </div>
        );
    }

    if (currentScreen === 'achievements') {
        return (
            <div className="main-menu">
                <div className="game-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>Achievements</div>
                
                <div className="achievements-container">
                    {Object.entries(achievements).map(([achievementId, achievement]) => {
                        const isUnlocked = unlockedAchievements.includes(achievementId);
                        
                        return (
                            <div
                                key={achievementId}
                                className={`achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <div className="achievement-info">
                                    <div className="achievement-name">{achievement.name}</div>
                                    <div className="achievement-description">{achievement.description}</div>
                                    <div className="achievement-reward">
                                        Reward: {achievement.reward.type === 'talentPoints' 
                                            ? `${achievement.reward.amount} Talent Points`
                                            : `Relic: ${achievement.reward.relic}`}
                                    </div>
                                </div>
                                {isUnlocked && <div className="achievement-unlocked">✓</div>}
                            </div>
                        );
                    })}
                </div>
                
                <div className="achievement-stats">
                    <p>Unlocked: {unlockedAchievements.length}/{Object.keys(achievements).length}</p>
                    <p>Available Talent Points: {talentPoints}</p>
                    <p>Max Round Reached: {gameStats.maxRound || 0}</p>
                </div>
                
                <button onClick={handleBackToMenu} className="button" style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '1.5rem',
                    padding: '1rem 2rem',
                    backgroundColor: '#e74c3c',
                    marginTop: '2rem'
                }}>
                    Back
                </button>
            </div>
        );
    }

    // Game screen
    return (
        <div className="game-container">
            {/* Save indicator */}
            <div className={`save-indicator ${saveIndicator ? 'show' : ''}`}>
                Game Saved!
            </div>

            {/* Health animation */}
            {healthAnimation && (
                <div className={`health-animation ${healthAnimation.type}`}>
                    {healthAnimation.type === 'heal' ? '+' : '-'}{healthAnimation.amount}
                </div>
            )}

            {/* Help overlay */}
            {showHelp && (
                <div className="help-overlay">
                    <div className="help-content">
                        <h2>Keyboard Shortcuts</h2>
                        <div className="help-section">
                            <h3>Cards</h3>
                            <p><kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> - Play cards from hand</p>
                        </div>
                        <div className="help-section">
                            <h3>Targeting</h3>
                            <p><kbd>Q</kbd> <kbd>W</kbd> <kbd>R</kbd> - Target enemies (left to right)</p>
                        </div>
                        <div className="help-section">
                            <h3>Game Control</h3>
                            <p><kbd>E</kbd> <kbd>Space</kbd> <kbd>Enter</kbd> - End turn</p>
                            <p><kbd>Esc</kbd> - Cancel targeting</p>
                        </div>
                        <div className="help-section">
                            <h3>Interface</h3>
                            <p><kbd>H</kbd> <kbd>?</kbd> - Toggle this help</p>
                        </div>
                        <button className="button" onClick={() => setShowHelp(false)}>
                            Close (Esc)
                        </button>
                    </div>
                </div>
            )}

            {/* Overlays */}
            {isTargeting && (
                <div className="targeting-message">
                    Select an enemy to target
                </div>
            )}

            {showVictory && (
                <div className="victory-overlay">
                    <div className="victory-content">
                        <h2>Round {round} Completed!</h2>
                        <p>Choose a card to add to your deck:</p>
                        <div className="rewards-container">
                            {rewardOptions.map((cardType, index) => {
                                const card = cardTypes[cardType];
                                return (
                                    <div
                                        key={index}
                                        className={`reward-card ${card.rarity} ${card.upgraded ? 'upgraded' : ''}`}
                                        onClick={() => selectReward(cardType)}
                                    >
                                        <h3>{card.name}</h3>
                                        <p>Cost: {card.cost} Energy</p>
                                        <p>{card.description}</p>
                                        <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
                                            {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                                            {card.upgraded && ' (Upgraded)'}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {gameOver && (
                <div className="victory-overlay">
                    <div className="victory-content">
                        <h2 style={{ color: '#ff4444', fontSize: '2em', marginBottom: '20px' }}>
                            Defeat!
                        </h2>
                        <p>You were defeated on round {round}!</p>
                        <button className="button" onClick={returnToMenu}>
                            Return to Main Menu
                        </button>
                    </div>
                </div>
            )}

            {/* Status Bar */}
            <div className="status-bar">
                <div>
                    <h2>Player Health: {playerHealth}/{maxHealth}</h2>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {Array(3).fill().map((_, i) => (
                            <span
                                key={i}
                                className={`energy-orb ${i >= Math.min(playerEnergy, 3) ? 'empty' : ''}`}
                            />
                        ))}
                        {playerEnergy > 3 && (
                            <span style={{
                                marginLeft: '10px',
                                color: '#3498db',
                                fontWeight: 'bold',
                                fontSize: '1.2em'
                            }}>
                                +{playerEnergy - 3}
                            </span>
                        )}
                    </div>
                </div>

                <div className="round-counter">
                    Round {round}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        className="button help-button"
                        onClick={() => setShowHelp(!showHelp)}
                        title="Keyboard shortcuts (H)"
                    >
                        ?
                    </button>
                    <button
                        className="button"
                        onClick={endTurn}
                        disabled={!canEndTurn}
                    >
                        End Turn (E)
                    </button>
                </div>
            </div>

            {/* Enemies */}
            <div className="enemies-container">
                {enemies.length > 0 ? (
                    enemies.map((enemy, index) => (
                        <div
                            key={enemy.id}
                            className={`enemy-card ${isTargeting ? 'targetable' : ''}`}
                            onClick={() => isTargeting && selectTarget(index)}
                        >
                            {isTargeting && index < 3 && (
                                <div className="target-hotkey">{['Q', 'W', 'R'][index]}</div>
                            )}
                            <img 
                                src={enemy.sprite} 
                                alt={enemy.name}
                                className="enemy-sprite"
                            />
                            <div className="enemy-name">{enemy.name}</div>
                            <div className={`enemy-intent intent-${enemy.intent}`}>
                                {enemy.intent.charAt(0).toUpperCase() + enemy.intent.slice(1)}
                                {enemy.intent === 'attack' && ` (${enemy.damage})`}
                                {enemy.intent === 'rage' && ` (${Math.floor(enemy.damage * 1.5)})`}
                                {enemy.intent === 'smash' && ` (${Math.floor(enemy.damage * 1.8)})`}
                                {enemy.intent === 'poison' && ` (${enemy.damage} + poison)`}
                                {enemy.intent === 'heal' && ' (heal 8)'}
                                {enemy.intent === 'defend' && ' (block 5)'}
                            </div>
                            {enemy.block > 0 && (
                                <div className="enemy-block">Block: {enemy.block}</div>
                            )}
                            {enemy.statusEffects && enemy.statusEffects.length > 0 && (
                                <div className="enemy-status-effects">
                                    {enemy.statusEffects.map(effect => (
                                        <span key={effect.id} className={`status-effect ${effect.type}`}>
                                            {effect.type} ({effect.duration})
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="health-bar">
                                <div
                                    className="health-bar-fill"
                                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                                />
                            </div>
                            <p>HP: {enemy.health}/{enemy.maxHealth}</p>

                            {enemy.damageNumbers && enemy.damageNumbers.map(damageNum => (
                                <div
                                    key={damageNum.id}
                                    className="damage-number"
                                    style={{ left: `${Math.random() * 60 + 20}%` }}
                                >
                                    -{damageNum.amount}
                                </div>
                            ))}
                        </div>
                    ))
                ) : (
                    <p>Summoning enemies...</p>
                )}
            </div>

            {/* Hand */}
            <div className="hand-container">
                {hand.map((card, index) => {
                    const cardType = cardTypes[card.type];
                    const currentCost = getCardCost(card);
                    const canPlay = canPlayCard(card);

                    return (
                        <div
                            key={card.id}
                            className={`card ${cardType.rarity} ${cardType.upgraded ? 'upgraded' : ''} ${!canPlay ? 'disabled' : ''} ${selectedCardIndex === index ? 'selected' : ''}`}
                            onClick={() => canPlay && selectCardWithAudio(card, index)}
                        >
                            <div className="card-hotkey">{index + 1}</div>
                            <h3>{cardType.name}</h3>
                            <p>Cost: {currentCost} Energy</p>
                            <p>{cardType.description}</p>
                            <p style={{ fontSize: '0.8em', opacity: 0.7, marginTop: '5px' }}>
                                {cardType.rarity.charAt(0).toUpperCase() + cardType.rarity.slice(1)}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Debug Info */}
            <div className="status-bar">
                <div style={{ display: 'flex', gap: '20px' }}>
                    <p>Total Cards: {deck.length + hand.length + discardPile.length + exhaustedCards.length}</p>
                    <p>Deck: {deck.length}</p>
                    <p>Hand: {hand.length}</p>
                    <p>Discard: {discardPile.length}</p>
                    <p>Exhausted: {exhaustedCards.length}</p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    {empowerActive && <span className="status-effect empower">Empower Active!</span>}
                    {counterActive && <span className="status-effect counter">Counter Active!</span>}
                    {playerStatusEffects.map(effect => (
                        <span key={effect.id} className={`status-effect ${effect.type}`}>
                            {effect.type.charAt(0).toUpperCase() + effect.type.slice(1)} ({effect.duration})
                        </span>
                    ))}
                </div>
            </div>

            {/* Keyboard hints */}
            <div className="keyboard-hints">
                <span>Cards: <kbd>1</kbd><kbd>2</kbd><kbd>3</kbd></span>
                {isTargeting && <span>Target: <kbd>Q</kbd><kbd>W</kbd><kbd>R</kbd></span>}
                <span>End Turn: <kbd>E</kbd></span>
                <span>Help: <kbd>H</kbd></span>
            </div>
        </div>
    );
};