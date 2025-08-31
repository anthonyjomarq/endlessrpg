import React from 'react';
import { cardTypes } from '../../data/cardTypes.js';

export const CardRemovalOverlay = ({ deck, hand, discardPile, onRemoveCard }) => {
    const allCards = [...deck, ...hand, ...discardPile].sort((a, b) => {
        const cardA = cardTypes[a.type];
        const cardB = cardTypes[b.type];
        return cardA.name.localeCompare(cardB.name);
    });

    return (
        <div className="victory-overlay">
            <div className="victory-content" style={{
                backgroundColor: '#2a2a2a',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                maxWidth: '1000px',
                width: '95%'
            }}>
                <h2 style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '2.5rem',
                    color: '#e74c3c',
                    marginBottom: '2rem'
                }}>
                    Remove a Card
                </h2>
                <p style={{
                    fontSize: '1.5rem',
                    color: '#fff',
                    marginBottom: '2rem'
                }}>
                    Select a card to remove from your deck:
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '15px',
                    maxHeight: '60vh',
                    overflowY: 'auto',
                    padding: '10px'
                }}>
                    {allCards.map((card) => {
                        const cardType = cardTypes[card.type];
                        return (
                            <div
                                key={card.id}
                                className="card"
                                onClick={() => onRemoveCard(card)}
                                style={{
                                    backgroundColor: '#444',
                                    padding: '15px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: '2px solid transparent'
                                }}
                            >
                                <h3>{cardType.name}</h3>
                                <p>Cost: {cardType.cost} Energy</p>
                                <p>{cardType.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};