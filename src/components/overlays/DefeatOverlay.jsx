import React from 'react';

export const DefeatOverlay = ({ round, gameState }) => {
    const returnToMenu = () => {
        // Reset game states
        gameState.setGameOver(false);
        gameState.setPlayerHealth(100);
        gameState.setMaxHealth(100);
        gameState.setPlayerEnergy(3);
        gameState.setRound(1);
        gameState.setEmpowerActive(false);
        gameState.setCounterActive(false);
        gameState.setHand([]);
        gameState.setDiscardPile([]);
        gameState.setExhaustedCards([]);
        gameState.resetTargeting();
        
        // Return to main menu
        gameState.setCurrentScreen('menu');
    };

    const buttonStyle = {
        fontFamily: 'Cinzel, serif',
        fontSize: '1.5rem',
        color: '#fff',
        backgroundColor: '#e74c3c',
        border: 'none',
        padding: '1rem 3rem',
        borderRadius: '8px',
        cursor: 'pointer',
        marginTop: '2rem',
        transition: 'all 0.3s ease',
        textShadow: '0 0 10px rgba(231, 76, 60, 0.5)',
        boxShadow: '0 0 15px rgba(231, 76, 60, 0.3)',
    };

    const handleMouseOver = (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 0 25px rgba(231, 76, 60, 0.5)';
    };

    const handleMouseOut = (e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.3)';
    };

    return (
        <div className="victory-overlay">
            <div className="victory-content">
                <h2 style={{ 
                    color: '#ff4444',
                    fontSize: '2em',
                    marginBottom: '20px'
                }}>
                    Defeat!
                </h2>
                <p>You were defeated on round {round}!</p>
                <button
                    style={buttonStyle}
                    onClick={returnToMenu}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    Return to Main Menu
                </button>
            </div>
        </div>
    );
};