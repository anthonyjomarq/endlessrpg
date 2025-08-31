// Card type definitions
export const cardTypes = {
    multiAttack: {
        name: 'Multi-Attack',
        cost: 2,
        description: 'Hit all enemies for 3 damage',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber) => {
            const damage = empowerActive ? 5 : 3;
            return enemies.map(enemy => ({
                ...enemy,
                health: Math.max(0, enemy.health - damage),
                damageNumbers: [
                    ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                    createDamageNumber(damage, Date.now())
                ]
            }));
        }
    },
    
    singleAttack: {
        name: 'Single Attack',
        cost: 1,
        description: 'Hit one enemy for 5 damage',
        needsTarget: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex) => {
            const damage = empowerActive ? 7 : 5;
            return enemies.map((enemy, index) => {
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
        }
    },
    
    empower: {
        name: 'Empower',
        cost: 1,
        description: 'Next attack deals +2 damage (persists until an attack is used)',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive) => {
            setEmpowerActive(true);
            return enemies;
        }
    },
    
    counter: {
        name: 'Counter',
        cost: 2,
        description: 'Block and return the next enemy attack back to them',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive) => {
            setCounterActive(true);
            return enemies;
        }
    },
    
    heavyAttack: {
        name: 'Heavy Attack',
        cost: 2,
        description: 'Deal 8 damage to one enemy',
        needsTarget: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex) => {
            const damage = empowerActive ? 10 : 8;
            return enemies.map((enemy, index) => 
                index === targetIndex 
                    ? {
                        ...enemy,
                        health: Math.max(0, enemy.health - damage),
                        damageNumbers: [
                            ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                            createDamageNumber(damage, Date.now())
                        ]
                    }
                    : enemy
            );
        }
    },
    
    quickStrike: {
        name: 'Quick Strike',
        cost: 1,
        description: 'Deal 3 damage to one enemy and draw a card',
        needsTarget: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            const damage = empowerActive ? 5 : 3;
            
            const updatedEnemies = enemies.map((enemy, index) => 
                index === targetIndex 
                    ? {
                        ...enemy,
                        health: Math.max(0, enemy.health - damage),
                        damageNumbers: [
                            ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                            createDamageNumber(damage, Date.now())
                        ]
                    }
                    : enemy
            );

            // Handle drawing a card
            setTimeout(() => {
                if (gameState.deck.length > 0) {
                    const cardToDraw = gameState.deck[0];
                    gameState.setDeck(prev => prev.slice(1));
                    gameState.setHand(prev => [...prev, cardToDraw]);
                } else if (gameState.discardPile.length > 0) {
                    const shuffledDiscard = gameState.shuffleArray([...gameState.discardPile]);
                    const cardToDraw = shuffledDiscard[0];
                    gameState.setDeck(prev => shuffledDiscard.slice(1));
                    gameState.setDiscardPile([]);
                    gameState.setHand(prev => [...prev, cardToDraw]);
                }
            }, 0);

            return updatedEnemies;
        }
    },
    
    doubleEnergy: {
        name: 'Energize',
        cost: 1,
        description: 'Gain 2 Energy',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            gameState.setPlayerEnergy(prev => prev + 1);
            gameState.setShowEnergyGain(true);
            setTimeout(() => gameState.setShowEnergyGain(false), 1000);
            return enemies;
        }
    },
    
    luckyDraw: {
        name: 'Lucky Draw',
        cost: 2,
        description: 'Draw a card and reduce its cost to 0 for this turn',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            if (gameState.deck.length > 0) {
                const cardToDraw = gameState.deck[0];
                gameState.setDeck(prev => prev.slice(1));
                gameState.setHand(prev => [...prev, cardToDraw]);
                gameState.setDiscountedCards(prev => {
                    const newDiscounts = new Map(prev);
                    newDiscounts.set(cardToDraw.id, "zero");
                    return newDiscounts;
                });
            } else if (gameState.discardPile.length > 0) {
                const shuffledDiscard = gameState.shuffleArray([...gameState.discardPile]);
                const cardToDraw = shuffledDiscard[0];
                gameState.setDeck(prev => shuffledDiscard.slice(1));
                gameState.setDiscardPile([]);
                gameState.setHand(prev => [...prev, cardToDraw]);
                gameState.setDiscountedCards(prev => {
                    const newDiscounts = new Map(prev);
                    newDiscounts.set(cardToDraw.id, "zero");
                    return newDiscounts;
                });
            }
            return enemies;
        }
    },
    
    healthSiphon: {
        name: 'Health Siphon',
        cost: 2,
        description: 'Deal 3 damage and heal for the damage dealt',
        needsTarget: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            const damage = empowerActive ? 5 : 3;
            
            return enemies.map((enemy, index) => {
                if (index === targetIndex) {
                    const actualDamage = Math.min(enemy.health, damage);
                    gameState.setPlayerHealth(prev => Math.min(gameState.maxHealth, prev + actualDamage));
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
        }
    },
    
    divineBlessing: {
        name: 'Divine Blessing',
        cost: 1,
        description: 'Heal 10 HP. Exhaust.',
        needsTarget: false,
        exhausts: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            gameState.setPlayerHealth(prev => Math.min(gameState.maxHealth, prev + 10));
            return enemies;
        }
    },
    
    freshStart: {
        name: 'Fresh Start',
        cost: 3,
        description: 'Discard your hand, draw 3 cards, and gain 3 energy',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState, handIndex) => {
            if (handIndex === undefined || !gameState.hand[handIndex]) {
                return enemies;
            }

            const freshStartCard = gameState.hand[handIndex];
            const otherCards = gameState.hand.filter((_, index) => index !== handIndex);
            const newDiscard = [...gameState.discardPile, freshStartCard, ...otherCards];
            
            gameState.setDiscardPile(newDiscard);
            gameState.setHand([]);

            const cardsToShuffle = [...gameState.deck];
            const shuffledCards = gameState.shuffleArray(cardsToShuffle);
            const newHand = shuffledCards.slice(0, 3);
            const newDeck = shuffledCards.slice(3);

            gameState.setDeck(newDeck);
            gameState.setHand(newHand);
            gameState.setPlayerEnergy(prev => prev + 3);

            return enemies;
        }
    },
    
    recycle: {
        name: 'Recycle',
        cost: 1,
        description: 'Draw a random card from your discard pile',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            if (gameState.discardPile.length === 0) {
                gameState.setStatusMessage('No cards in discard pile to draw!');
                gameState.setShowStatusMessage(true);
                setTimeout(() => gameState.setShowStatusMessage(false), 2000);
                return enemies;
            }

            const randomIndex = Math.floor(Math.random() * gameState.discardPile.length);
            const drawnCard = gameState.discardPile[randomIndex];
            
            const newDiscard = [...gameState.discardPile];
            newDiscard.splice(randomIndex, 1);
            
            gameState.setDiscardPile(newDiscard);
            gameState.setHand(prev => [...prev, drawnCard]);
            
            return enemies;
        }
    },
    
    discount: {
        name: 'Discount',
        cost: 2,
        description: 'Reduce the energy cost of all cards in hand by 1',
        needsTarget: false,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex, setEmpowerActive, setCounterActive, gameState) => {
            const newDiscounts = new Map();
            gameState.hand.forEach(card => {
                newDiscounts.set(card.id, "reduced");
            });
            gameState.setDiscountedCards(newDiscounts);
            return enemies;
        }
    },
    
    doubleHit: {
        name: 'Double Hit',
        cost: 2,
        description: 'Hit the same enemy twice for 2-5 damage each hit',
        needsTarget: true,
        effect: (enemies, empowerActive, createDamageNumber, targetIndex) => {
            const hit1 = Math.floor(Math.random() * 4) + 2;
            const hit2 = Math.floor(Math.random() * 4) + 2;
            const damage1 = empowerActive ? hit1 + 2 : hit1;
            const damage2 = empowerActive ? hit2 + 2 : hit2;
            
            return enemies.map((enemy, index) => {
                if (index === targetIndex) {
                    const afterFirstHit = Math.max(0, enemy.health - damage1);
                    const afterSecondHit = Math.max(0, afterFirstHit - damage2);
                    return {
                        ...enemy,
                        health: afterSecondHit,
                        damageNumbers: [
                            ...enemy.damageNumbers.filter(dn => Date.now() - dn.createdAt < 2000),
                            createDamageNumber(damage1, Date.now()),
                            createDamageNumber(damage2, Date.now() + 1)
                        ]
                    };
                }
                return enemy;
            });
        }
    }
};