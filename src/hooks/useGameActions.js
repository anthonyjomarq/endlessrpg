import { useCallback } from 'react';
import { cardTypes } from '../data/cardTypes.js';
import { getCardCost, shuffleArray, createDamageNumber, generateRewards } from '../utils/helpers.js';

export const useGameActions = (gameState) => {
    const {
        playerEnergy,
        gameOver,
        hand,
        deck,
        discardPile,
        exhaustedCards,
        enemies,
        empowerActive,
        counterActive,
        isTargeting,
        selectedCard,
        selectedCardIndex,
        discountedCards,
        cardIdCounter,
        round,
        maxHealth,
        specialRewardOptions,
        setPlayerEnergy,
        setHand,
        setDeck,
        setDiscardPile,
        setExhaustedCards,
        setEnemies,
        setEmpowerActive,
        setCounterActive,
        setIsTargeting,
        setSelectedCard,
        setSelectedCardIndex,
        setDiscountedCards,
        setCardIdCounter,
        setShowVictory,
        setShowPreBossFight,
        setShowSpecialRewards,
        setShowCardRemoval,
        setRewardOptions,
        setSpecialRewardOptions,
        setRound,
        setPlayerHealth,
        setMaxHealth,
        setTotalDeckSize,
        endTurn,
        spawnEnemies
    } = gameState;

    // Select a card from hand
    const selectCard = useCallback((card, index) => {
        const cardDef = cardTypes[card.type];
        const currentCost = getCardCost(card, discountedCards, cardTypes);
        
        if (playerEnergy >= currentCost) {
            if (cardDef.needsTarget) {
                setSelectedCard(card);
                setSelectedCardIndex(index);
                setIsTargeting(true);
            } else {
                playCard(card, index);
            }
        }
    }, [playerEnergy, discountedCards]);

    // Select target for targeted cards
    const selectTarget = useCallback((targetIndex) => {
        if (isTargeting && selectedCard) {
            const card = selectedCard;
            const index = selectedCardIndex;
            
            setIsTargeting(false);
            setSelectedCard(null);
            setSelectedCardIndex(null);
            
            playCard(card, index, targetIndex);
        }
    }, [isTargeting, selectedCard, selectedCardIndex]);

    // Play a card
    const playCard = useCallback((card, handIndex, targetIndex = null) => {
        if (gameOver) return;

        const cardDef = cardTypes[card.type];
        const currentCost = getCardCost(card, discountedCards, cardTypes);

        if (playerEnergy >= currentCost) {
            // Deduct energy
            setPlayerEnergy(prev => prev - currentCost);
            
            // Remove discount
            setDiscountedCards(prev => {
                const newDiscounts = new Map(prev);
                newDiscounts.delete(card.id);
                return newDiscounts;
            });

            if (card.type === 'freshStart') {
                // Fresh Start handles its own card movement
                cardDef.effect(enemies, empowerActive, createDamageNumber, targetIndex, 
                              setEmpowerActive, setCounterActive, gameState, handIndex);
            } else {
                // Normal card handling
                const newHand = [...hand];
                const playedCard = newHand.splice(handIndex, 1)[0];
                setHand(newHand);

                // Play effect
                const updatedEnemies = cardDef.effect(enemies, empowerActive, createDamageNumber, 
                                                    targetIndex, setEmpowerActive, setCounterActive, gameState);
                setEnemies(updatedEnemies.filter(enemy => enemy.health > 0));

                // Move card to appropriate pile
                if (cardDef.exhausts) {
                    setExhaustedCards(prev => [...prev, playedCard]);
                } else {
                    setDiscardPile(prev => [...prev, playedCard]);
                }

                // Handle empower consumption for attack cards
                const attackCards = ['singleAttack', 'multiAttack', 'quickStrike', 'heavyAttack', 'doubleHit', 'healthSiphon'];
                if (attackCards.includes(card.type)) {
                    setEmpowerActive(false);
                }
            }
        }
    }, [gameOver, playerEnergy, discountedCards, hand, enemies, empowerActive]);

    // Select reward after victory
    const selectReward = useCallback((cardType) => {
        const newCard = {
            id: cardIdCounter + 1,
            type: cardType
        };
        setCardIdCounter(prev => prev + 1);
        
        const currentCards = [...deck, ...discardPile, ...hand, ...exhaustedCards];
        const allCards = [...currentCards, newCard];
        const shuffledDeck = shuffleArray(allCards);
        
        // Reset game state for next round
        setDeck(shuffledDeck);
        setHand([]);
        setDiscardPile([]);
        setExhaustedCards([]);
        setTotalDeckSize(prev => prev + 1);
        setShowVictory(false);
        setRound(prev => prev + 1);
        setPlayerEnergy(3);
        setEmpowerActive(false);
        setCounterActive(false);
        
        // Spawn new enemies and draw new hand
        spawnEnemies();
        setTimeout(() => {
            const newHand = shuffledDeck.slice(0, 3);
            const remainingDeck = shuffledDeck.slice(3);
            setHand(newHand);
            setDeck(remainingDeck);
        }, 0);
    }, [cardIdCounter, deck, discardPile, hand, exhaustedCards]);

    // Handle special reward selection (double rewards)
    const handleSpecialReward = useCallback((cardType) => {
        const newCard = {
            id: cardIdCounter + 1,
            type: cardType
        };
        setCardIdCounter(prev => prev + 1);
        
        const currentCards = [...deck, ...discardPile, ...hand, ...exhaustedCards];
        const allCards = [...currentCards, newCard];
        const shuffledDeck = shuffleArray(allCards);
        
        setDeck(shuffledDeck);
        setTotalDeckSize(prev => prev + 1);

        const remainingPicks = specialRewardOptions.length === 5 ? 1 : 0;
        
        if (remainingPicks === 0) {
            setShowSpecialRewards(false);
            setShowVictory(true);
            setSpecialRewardOptions([]);
        } else {
            setSpecialRewardOptions(prev => prev.filter(card => card !== cardType));
        }
    }, [cardIdCounter, deck, discardPile, hand, exhaustedCards, specialRewardOptions]);

    // Handle card removal
    const handleCardRemoval = useCallback((cardToRemove) => {
        setDeck(prev => prev.filter(card => card.id !== cardToRemove.id));
        setHand(prev => prev.filter(card => card.id !== cardToRemove.id));
        setDiscardPile(prev => prev.filter(card => card.id !== cardToRemove.id));
        
        setTotalDeckSize(prev => prev - 1);
        setShowCardRemoval(false);
        setShowVictory(true);
        setEmpowerActive(false);
        
        const rewards = generateRewards(cardTypes, 3);
        setRewardOptions(rewards);
    }, []);

    // Pre-boss fight actions
    const handlePreBossHeal = useCallback(() => {
        setPlayerHealth(prev => Math.min(maxHealth, prev + 50));
        setShowPreBossFight(false);
        setShowVictory(true);
        setEmpowerActive(false);
        const rewards = generateRewards(cardTypes, 3);
        setRewardOptions(rewards);
    }, [maxHealth]);

    const handlePreBossMaxHP = useCallback(() => {
        setMaxHealth(prev => prev + 25);
        setPlayerHealth(prev => prev + 25);
        setShowPreBossFight(false);
        setShowVictory(true);
        setEmpowerActive(false);
        const rewards = generateRewards(cardTypes, 3);
        setRewardOptions(rewards);
    }, []);

    const handleDoubleRewards = useCallback(() => {
        const specialRewards = generateRewards(cardTypes, 5);
        setSpecialRewardOptions(specialRewards);
        setShowSpecialRewards(true);
        setShowPreBossFight(false);
    }, []);

    return {
        selectCard,
        selectTarget,
        playCard,
        selectReward,
        handleSpecialReward,
        handleCardRemoval,
        handlePreBossHeal,
        handlePreBossMaxHP,
        handleDoubleRewards,
        endTurn
    };
};