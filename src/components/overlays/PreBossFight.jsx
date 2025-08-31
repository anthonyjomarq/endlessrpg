import React from 'react';

export const PreBossFight = ({ 
    onHeal, 
    onIncreaseMaxHp, 
    onDoubleRewards,
    onRemoveCard,
    currentHealth, 
    maxHealth 
}) => {
    const buttonStyle = {
        fontFamily: 'Cinzel, serif',
        fontSize: '1.5rem',
        color: '#fff',
        backgroundColor: '#e74c3c',
        border: 'none',
        padding: '1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textShadow: '0 0 10px rgba(231, 76, 60, 0.5)',
        boxShadow: '0 0 15px rgba(231, 76, 60, 0.3)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '120px'
    };

    const handleMouseOver = (e) => {
        e.target.style.transform = 'scale(1.05)';
        e.target.style.boxShadow = '0 0 25px rgba(231, 76, 60, 0.5)';
    };

    const handleMouseOut = (e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = '0 0 15px rgba(231, 76, 60, 0.3)';
    };
    
    const actualHealAmount = Math.min(50, maxHealth - currentHealth);
    const isFullHealth = currentHealth === maxHealth;

    return (
        <div className="victory-overlay">
            <div className="victory-content" style={{
                backgroundColor: '#2a2a2a',
                padding: '40px',
                borderRadius: '8px',
                textAlign: 'center',
                maxWidth: '900px',
                width: '90%'
            }}>
                <h2 style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '3rem',
                    color: '#e74c3c',
                    marginBottom: '2rem',
                    textShadow: '0 0 10px rgba(231, 76, 60, 0.5)'
                }}>
                    Boss Battle Approaching!
                </h2>
                <p style={{
                    fontSize: '1.5rem',
                    color: '#fff',
                    marginBottom: '2rem'
                }}>
                    Choose one bonus before facing the boss:
                </p>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px',
                    padding: '20px'
                }}>
                    {/* Heal Button */}
                    <button
                        style={{
                            ...buttonStyle,
                            opacity: isFullHealth ? 0.6 : 1,
                            cursor: isFullHealth ? 'not-allowed' : 'pointer',
                            backgroundColor: isFullHealth ? '#666' : '#e74c3c'
                        }}
                        onClick={isFullHealth ? null : onHeal}
                        disabled={isFullHealth}
                        onMouseOver={isFullHealth ? null : handleMouseOver}
                        onMouseOut={isFullHealth ? null : handleMouseOut}
                    >
                        <div>Heal</div>
                        <div style={{ fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            {isFullHealth ? 'Already at full health' : 
                             actualHealAmount < 50 ? `Restore ${actualHealAmount} HP` : 'Restore 50 HP'}
                        </div>
                        <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                            Current HP: {currentHealth}/{maxHealth}
                        </div>
                    </button>
                    
                    {/* Max HP Button */}
                    <button
                        style={buttonStyle}
                        onClick={onIncreaseMaxHp}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <div>Increase Max HP</div>
                        <div style={{ fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            +25 Maximum HP
                        </div>
                        <div style={{ fontSize: '1rem', marginTop: '0.5rem', opacity: 0.8 }}>
                            New Max HP will be: {maxHealth + 25}
                        </div>
                    </button>
                    
                    {/* Double Rewards Button */}
                    <button
                        style={buttonStyle}
                        onClick={onDoubleRewards}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <div>Double Rewards</div>
                        <div style={{ fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            Choose 2 cards from 5
                        </div>
                    </button>
                    
                    {/* Remove Card Button */}
                    <button
                        style={buttonStyle}
                        onClick={onRemoveCard}
                        onMouseOver={handleMouseOver}
                        onMouseOut={handleMouseOut}
                    >
                        <div>Remove Card</div>
                        <div style={{ fontSize: '1.2rem', marginTop: '0.5rem', opacity: 0.9 }}>
                            Remove a card from your deck
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};