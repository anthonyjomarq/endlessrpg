import React from 'react';

export const StatusBar = ({ 
    playerHealth, 
    maxHealth, 
    playerEnergy, 
    round, 
    canEndTurn, 
    onEndTurn,
    deck,
    hand,
    discardPile,
    exhaustedCards,
    empowerActive,
    counterActive,
    isDebug = false
}) => {
    if (isDebug) {
        return (
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
                </div>
            </div>
        );
    }

    return (
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
            
            <button
                className="button"
                onClick={onEndTurn}
                disabled={!canEndTurn}
            >
                End Turn
            </button>
        </div>
    );
};