import React from 'react';
import { cardTypes } from '../../data/cardTypes.js';

export const SpecialRewardsOverlay = ({ rewards, onSelectReward, remainingPicks }) => {
    return (
        <div className="victory-overlay">
            <div className="victory-content">
                <h2 style={{ 
                    fontFamily: 'Cinzel, serif',
                    fontSize: '2.5rem',
                    color: '#e74c3c',
                    marginBottom: '2rem'
                }}>
                    Choose Your Rewards
                </h2>
                <p style={{
                    fontSize: '1.5rem',
                    color: '#fff',
                    marginBottom: '2rem'
                }}>
                    Select {remainingPicks} more card{remainingPicks !== 1 ? 's' : ''}
                </p>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '20px',
                    padding: '20px'
                }}>
                    {rewards.map((cardType, index) => {
                        const card = cardTypes[cardType];
                        return (
                            <div
                                key={index}
                                className="reward-card"
                                onClick={() => onSelectReward(cardType)}
                            >
                                <h3>{card.name}</h3>
                                <p>Cost: {card.cost} Energy</p>
                                <p>{card.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};