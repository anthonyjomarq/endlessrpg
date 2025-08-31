import React from 'react';

export const MainMenu = ({ onStartRun, onTalents }) => {
    const buttonStyle = {
        fontFamily: 'Cinzel, serif',
        fontSize: '2rem',
        color: '#fff',
        backgroundColor: '#e74c3c',
        border: 'none',
        padding: '1rem 3rem',
        borderRadius: '8px',
        cursor: 'pointer',
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
        <div className="main-menu">
            <div 
                className="game-title"
                style={{ marginBottom: '4rem' }}
            >
                RAID BOSS
            </div>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                alignItems: 'center'
            }}>
                <button
                    onClick={onStartRun}
                    style={buttonStyle}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    Start Run
                </button>
                
                <button
                    onClick={onTalents}
                    style={buttonStyle}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                >
                    Talents
                </button>
            </div>
        </div>
    );
};