import React from 'react';

export const EnemyCard = ({ enemy, index, isTargeting, onSelect }) => {
    return (
        <div 
            className={`enemy-card ${isTargeting ? 'targetable' : ''}`}
            onClick={() => isTargeting && onSelect(index)}
        >
            <p>Enemy {index + 1}</p>
            <div className="health-bar">
                <div
                    className="health-bar-fill"
                    style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
                />
            </div>
            <p>HP: {enemy.health}/{enemy.maxHealth}</p>
            <p>Intent: {enemy.intent}</p>
            
            {/* Damage numbers animation */}
            {enemy.damageNumbers && enemy.damageNumbers.map(damageNum => (
                <div
                    key={damageNum.id}
                    className="damage-number"
                    style={{
                        left: `${Math.random() * 60 + 20}%`
                    }}
                >
                    -{damageNum.amount}
                </div>
            ))}
        </div>
    );
};