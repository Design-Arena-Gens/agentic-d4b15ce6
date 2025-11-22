'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '⭐', '💎', '7️⃣'];

export default function SlotMachine() {
  const [reels, setReels] = useState(['🍒', '🍒', '🍒']);
  const [spinning, setSpinning] = useState(false);
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(10);
  const [message, setMessage] = useState('Bienvenue! Bonne chance!');
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoSpinCount, setAutoSpinCount] = useState(0);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    if (autoPlay && !spinning && balance >= bet) {
      const timer = setTimeout(() => {
        spin();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, spinning, balance, bet]);

  const spin = () => {
    if (balance < bet) {
      setMessage('Solde insuffisant!');
      setAutoPlay(false);
      return;
    }

    setSpinning(true);
    setBalance(balance - bet);
    setMessage('En rotation...');

    let spinCount = 0;
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      spinCount++;

      if (spinCount >= 20) {
        clearInterval(spinInterval);
        finalizeSpin();
      }
    }, 100);
  };

  const finalizeSpin = () => {
    const finalReels = [
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)],
      symbols[Math.floor(Math.random() * symbols.length)]
    ];

    setReels(finalReels);
    setSpinning(false);

    // Check win conditions
    if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
      // All three match
      let winAmount = 0;
      if (finalReels[0] === '💎') {
        winAmount = bet * 50;
        setMessage(`JACKPOT! 💎💎💎 Vous gagnez ${winAmount}!`);
      } else if (finalReels[0] === '7️⃣') {
        winAmount = bet * 30;
        setMessage(`TRIPLE 7! Vous gagnez ${winAmount}!`);
      } else if (finalReels[0] === '⭐') {
        winAmount = bet * 20;
        setMessage(`TRIPLE ÉTOILE! Vous gagnez ${winAmount}!`);
      } else {
        winAmount = bet * 10;
        setMessage(`TRIPLE ${finalReels[0]}! Vous gagnez ${winAmount}!`);
      }
      setBalance(prev => prev + winAmount);
      setWins(prev => prev + 1);
    } else if (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
      // Two match
      const winAmount = bet * 2;
      setMessage(`Paire! Vous gagnez ${winAmount}!`);
      setBalance(prev => prev + winAmount);
      setWins(prev => prev + 1);
    } else {
      setMessage('Perdu... Réessayez!');
      setLosses(prev => prev + 1);
    }

    if (autoPlay) {
      setAutoSpinCount(prev => prev + 1);
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    if (!autoPlay) {
      setAutoSpinCount(0);
    }
  };

  const adjustBet = (amount) => {
    const newBet = bet + amount;
    if (newBet >= 1 && newBet <= balance) {
      setBet(newBet);
    }
  };

  const resetGame = () => {
    setBalance(1000);
    setBet(10);
    setWins(0);
    setLosses(0);
    setAutoSpinCount(0);
    setAutoPlay(false);
    setMessage('Jeu réinitialisé! Bonne chance!');
  };

  return (
    <div className={styles.container}>
      <div className={styles.machine}>
        <h1 className={styles.title}>🎰 AUTO SLOT 🎰</h1>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Solde:</span>
            <span className={styles.statValue}>{balance} €</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Mise:</span>
            <span className={styles.statValue}>{bet} €</span>
          </div>
        </div>

        <div className={styles.reels}>
          {reels.map((symbol, index) => (
            <div
              key={index}
              className={`${styles.reel} ${spinning ? styles.spinning : ''}`}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className={styles.message}>{message}</div>

        <div className={styles.betControls}>
          <button
            className={styles.betButton}
            onClick={() => adjustBet(-5)}
            disabled={spinning || autoPlay}
          >
            -5 €
          </button>
          <button
            className={styles.betButton}
            onClick={() => adjustBet(-1)}
            disabled={spinning || autoPlay}
          >
            -1 €
          </button>
          <button
            className={styles.betButton}
            onClick={() => adjustBet(1)}
            disabled={spinning || autoPlay}
          >
            +1 €
          </button>
          <button
            className={styles.betButton}
            onClick={() => adjustBet(5)}
            disabled={spinning || autoPlay}
          >
            +5 €
          </button>
        </div>

        <div className={styles.controls}>
          <button
            className={`${styles.spinButton} ${spinning ? styles.disabled : ''}`}
            onClick={spin}
            disabled={spinning || balance < bet || autoPlay}
          >
            {spinning ? 'EN COURS...' : 'JOUER'}
          </button>

          <button
            className={`${styles.autoButton} ${autoPlay ? styles.active : ''}`}
            onClick={toggleAutoPlay}
            disabled={spinning || balance < bet}
          >
            {autoPlay ? 'STOP AUTO' : 'AUTO PLAY'}
          </button>
        </div>

        {autoPlay && (
          <div className={styles.autoInfo}>
            Tours automatiques: {autoSpinCount}
          </div>
        )}

        <div className={styles.scoreBoard}>
          <div className={styles.score}>
            <span className={styles.scoreLabel}>Victoires:</span>
            <span className={styles.scoreValue}>{wins}</span>
          </div>
          <div className={styles.score}>
            <span className={styles.scoreLabel}>Défaites:</span>
            <span className={styles.scoreValue}>{losses}</span>
          </div>
        </div>

        <button
          className={styles.resetButton}
          onClick={resetGame}
          disabled={spinning}
        >
          Réinitialiser
        </button>

        <div className={styles.payouts}>
          <h3>Table des gains:</h3>
          <div className={styles.payoutList}>
            <div>💎💎💎 = Mise × 50</div>
            <div>7️⃣7️⃣7️⃣ = Mise × 30</div>
            <div>⭐⭐⭐ = Mise × 20</div>
            <div>Autres triples = Mise × 10</div>
            <div>Paire = Mise × 2</div>
          </div>
        </div>
      </div>
    </div>
  );
}
