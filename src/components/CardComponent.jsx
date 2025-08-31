import React from 'react';
import { cardTypes } from '../data/cardTypes.js';
import { getCardCost, canPlayCard } from '../utils/helpers.js';

export const CardComponent = ({ card, index, gameState, onSelect }) => {
    const { playerEnergy, discountedCards, selectedCardIndex } = gameState;
    const cardType = cardTypes[card.type];
    const discountType = discountedCards.get(card.id);
    const currentCost = getCardCost(card, discountedCards, cardTypes);
    const canPlay = canPlayCard(card, playerEnergy, discountedCards, cardTypes);
    
    const getCostDisplay = () => {
        if (discountType === "zero") {
            return (
                <span style={{ color: '#4CAF50' }}>
                    Cost: 0 Energy (reduced)
                </span>
            );
        }
        if (discountType === "reduced") {
            return (
                <span style={{ color: '#4CAF50' }}>
                    Cost: {currentCost} Energy (reduced)
                </span>
            );
        }
        return `Cost: ${currentCost} Energy`;
    };

    return (
        <div
            className={`card ${!canPlay ? 'disabled' : ''} ${selectedCardIndex === index ? 'selected' : ''}`}
            onClick={() => canPlay && onSelect(card, index)}
        >
            <h3>{cardType.name}</h3>
            <p>{getCostDisplay()}</p>
            <p>{cardType.description}</p>
        </div>
    );
};