import React from 'react';

export const TalentsScreen = ({ onBack }) => {
    const buttonStyle = {
        fontFamily: 'Cinzel, serif',
        fontSize: '2rem',
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
        <div className="main-menu">
            <div className="game-title">Talents</div>
            <p style={{ fontSize: '1.5rem', marginTop: '2rem', opacity: 0.8 }}>
                Talent system coming soon...
            </p>
            <button
                onClick={onBack}
                style={buttonStyle}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
            >
                Back
            </button>
        </div>
    );
};