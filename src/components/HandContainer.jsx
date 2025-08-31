import React from 'react';
import { CardComponent } from './CardComponent.jsx';

export const HandContainer = ({ hand, gameState, onSelectCard }) => {
    return (
        <div className="hand-container">
            {hand.map((card, index) => (
                <CardComponent
                    key={card.id}
                    card={card}
                    index={index}
                    gameState={gameState}
                    onSelect={onSelectCard}
                />
            ))}
        </div>
    );
};