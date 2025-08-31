import React from 'react';
import { cardTypes } from '../../data/cardTypes.js';

export const VictoryOverlay = ({ round, rewardOptions, onSelectReward }) => {
    return (
        <div className="victory-overlay">
            <div className="victory-content">
                <h2>Round {round} Completed!</h2>
                <p>Choose a card to add to your deck:</p>
                <div className="rewards-container">
                    {rewardOptions.map((cardType, index) => {
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