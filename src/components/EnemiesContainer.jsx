import React from 'react';
import { EnemyCard } from './EnemyCard.jsx';

export const EnemiesContainer = ({ enemies, isTargeting, onSelectTarget }) => {
    return (
        <div className="enemies-container">
            {enemies.length > 0 ? (
                enemies.map((enemy, index) => (
                    <EnemyCard
                        key={index}
                        enemy={enemy}
                        index={index}
                        isTargeting={isTargeting}
                        onSelect={onSelectTarget}
                    />
                ))
            ) : (
                <p>Summoning enemies...</p>
            )}
        </div>
    );
};