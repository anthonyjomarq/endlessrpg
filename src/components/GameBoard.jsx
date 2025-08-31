import React from 'react';
import { StatusBar } from './StatusBar.jsx';
import { EnemiesContainer } from './EnemiesContainer.jsx';
import { HandContainer } from './HandContainer.jsx';
import { VictoryOverlay } from './overlays/VictoryOverlay.jsx';
import { DefeatOverlay } from './overlays/DefeatOverlay.jsx';
import { PreBossFight } from './overlays/PreBossFight.jsx';
import { SpecialRewardsOverlay } from './overlays/SpecialRewardsOverlay.jsx';
import { CardRemovalOverlay } from './overlays/CardRemovalOverlay.jsx';
import { useGameActions } from '../hooks/useGameActions.js';

export const GameBoard = ({ gameState }) => {
    const {
        playerHealth,
        maxHealth,
        playerEnergy,
        round,
        hand,
        deck,
        discardPile,
        exhaustedCards,
        enemies,
        empowerActive,
        counterActive,
        isTargeting,
        showVictory,
        showPreBossFight,
        showSpecialRewards,
        showCardRemoval,
        gameOver,
        showStatusMessage,
        statusMessage,
        showEnergyGain,
        canEndTurn,
        rewardOptions,
        specialRewardOptions
    } = gameState;

    const {
        selectCard,
        selectTarget,
        endTurn,
        selectReward,
        handleSpecialReward,
        handleCardRemoval,
        handlePreBossHeal,
        handlePreBossMaxHP,
        handleDoubleRewards
    } = useGameActions(gameState);

    return (
        <>
            {/* Overlays */}
            {showPreBossFight && (
                <PreBossFight
                    onHeal={handlePreBossHeal}
                    onIncreaseMaxHp={handlePreBossMaxHP}
                    onDoubleRewards={handleDoubleRewards}
                    currentHealth={playerHealth}
                    maxHealth={maxHealth}
                    onRemoveCard={() => {
                        gameState.setShowCardRemoval(true);
                        gameState.setShowPreBossFight(false);
                    }}
                />
            )}

            {showCardRemoval && (
                <CardRemovalOverlay
                    deck={deck}
                    hand={hand}
                    discardPile={discardPile}
                    onRemoveCard={handleCardRemoval}
                />
            )}

            {showSpecialRewards && (
                <SpecialRewardsOverlay
                    rewards={specialRewardOptions}
                    onSelectReward={handleSpecialReward}
                    remainingPicks={specialRewardOptions.length === 5 ? 2 : 1}
                />
            )}

            {showVictory && (
                <VictoryOverlay
                    round={round}
                    rewardOptions={rewardOptions}
                    onSelectReward={selectReward}
                />
            )}

            {gameOver && <DefeatOverlay round={round} gameState={gameState} />}

            {/* Status Messages */}
            {isTargeting && (
                <div className="targeting-message">
                    Select an enemy to target
                </div>
            )}

            {showStatusMessage && (
                <div className="targeting-message">
                    {statusMessage}
                </div>
            )}

            {showEnergyGain && (
                <div className="energy-gain">
                    +2 Energy
                </div>
            )}

            {/* Main Game UI */}
            <StatusBar
                playerHealth={playerHealth}
                maxHealth={maxHealth}
                playerEnergy={playerEnergy}
                round={round}
                canEndTurn={canEndTurn}
                onEndTurn={endTurn}
            />

            <EnemiesContainer
                enemies={enemies}
                isTargeting={isTargeting}
                onSelectTarget={selectTarget}
            />

            <HandContainer
                hand={hand}
                gameState={gameState}
                onSelectCard={selectCard}
            />

            {/* Debug Info */}
            <StatusBar
                deck={deck}
                hand={hand}
                discardPile={discardPile}
                exhaustedCards={exhaustedCards}
                empowerActive={empowerActive}
                counterActive={counterActive}
                isDebug={true}
            />
        </>
    );
};