// Global Application State
const state = {
    score: 0,
    unlockedBadges: [],
    soundEnabled: true,
    activeTab: 'home'
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadSavedState();
    setupNavigation();
    setupSoundToggle();
    updateUI();
    
    // Play a gentle welcome note after first interaction to comply with browser autoplay policies
    document.body.addEventListener('click', initAudioContext, { once: true });
});

// Load saved data from LocalStorage
function loadSavedState() {
    const savedScore = localStorage.getItem('gokula_score');
    if (savedScore !== null) {
        state.score = parseInt(savedScore, 10);
    }

    const savedBadges = localStorage.getItem('gokula_badges');
    if (savedBadges !== null) {
        try {
            state.unlockedBadges = JSON.parse(savedBadges);
        } catch (e) {
            state.unlockedBadges = [];
        }
    }

    const savedSound = localStorage.getItem('gokula_sound');
    if (savedSound !== null) {
        state.soundEnabled = savedSound === 'true';
    }
}

// Save state to LocalStorage
function saveState() {
    localStorage.setItem('gokula_score', state.score);
    localStorage.setItem('gokula_badges', JSON.stringify(state.unlockedBadges));
    localStorage.setItem('gokula_sound', state.soundEnabled);
}

// Navigation Router
function setupNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');
            switchTab(targetTab);
        });
    });
}

function switchTab(tabId) {
    state.activeTab = tabId;
    
    // Play transition sound
    playSynthSound('tap');

    // Update active class on nav buttons
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        if (tab.getAttribute('data-tab') === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update active class on tab panels
    const panels = document.querySelectorAll('.tab-content');
    panels.forEach(panel => {
        if (panel.id === `tab-${tabId}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    // Dispatch custom tab change events to let sub-modules know they are visible
    const event = new CustomEvent('tabChanged', { detail: { tab: tabId } });
    document.dispatchEvent(event);
    
    // Special adjustments for canvas-based games on switch
    if (tabId === 'maze' && window.initMazeGame) {
        window.initMazeGame();
    }
    if (tabId === 'art' && window.resizeDrawingCanvas) {
        window.resizeDrawingCanvas();
    }
}

// Sound Effects Controller using Web Audio API (No files needed!)
let audioCtx = null;

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function setupSoundToggle() {
    const soundBtn = document.getElementById('sound-btn');
    const soundIcon = document.getElementById('sound-icon');
    
    // Initialize display state
    soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
    
    soundBtn.addEventListener('click', () => {
        initAudioContext();
        state.soundEnabled = !state.soundEnabled;
        soundIcon.textContent = state.soundEnabled ? '🔊' : '🔇';
        saveState();
        
        if (state.soundEnabled) {
            playSynthSound('correct');
        }
    });
}

/**
 * Web Audio API synthesizer for child-friendly sound effects.
 * oscillator types: 'sine', 'square', 'sawtooth', 'triangle'
 */
function playSynthSound(type) {
    if (!state.soundEnabled) return;
    
    initAudioContext();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    const now = audioCtx.currentTime;
    
    switch (type) {
        case 'tap': // Short pleasant click
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(150, now + 0.1);
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);
            break;
            
        case 'correct': // Happy upward chime
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
            
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.1, now + 0.3);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
            
            osc.start(now);
            osc.stop(now + 0.5);
            break;
            
        case 'wrong': // Short sad slide down
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(220, now); // A3
            osc.frequency.linearRampToValueAtTime(110, now + 0.35); // A2
            
            gainNode.gain.setValueAtTime(0.12, now);
            gainNode.gain.linearRampToValueAtTime(0.01, now + 0.35);
            
            // Add a lowpass filter to make it less harsh
            const filter = audioCtx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(400, now);
            
            osc.disconnect(gainNode);
            osc.connect(filter);
            filter.connect(gainNode);
            
            osc.start(now);
            osc.stop(now + 0.35);
            break;
            
        case 'win': // Triumphant little melody
            const notes = [
                { f: 523.25, d: 0.1 }, // C5
                { f: 587.33, d: 0.1 }, // D5
                { f: 659.25, d: 0.1 }, // E5
                { f: 783.99, d: 0.15 }, // G5
                { f: 659.25, d: 0.1 }, // E5
                { f: 783.99, d: 0.3 }  // G5 (held)
            ];
            
            let timeOffset = 0;
            notes.forEach((note, idx) => {
                const noteOsc = audioCtx.createOscillator();
                const noteGain = audioCtx.createGain();
                
                noteOsc.type = 'sine';
                noteOsc.frequency.setValueAtTime(note.f, now + timeOffset);
                
                noteGain.gain.setValueAtTime(idx === notes.length - 1 ? 0.15 : 0.08, now + timeOffset);
                noteGain.gain.exponentialRampToValueAtTime(0.001, now + timeOffset + note.d);
                
                noteOsc.connect(noteGain);
                noteGain.connect(audioCtx.destination);
                
                noteOsc.start(now + timeOffset);
                noteOsc.stop(now + timeOffset + note.d);
                
                timeOffset += note.d * 0.9; // slight overlap
            });
            break;

        case 'move': // Quick tiny pop for moving in maze
            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            gainNode.gain.setValueAtTime(0.05, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.start(now);
            osc.stop(now + 0.05);
            break;

        case 'collect': // Sweet sparkling bubble pop
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, now); // A5
            osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15); // A6
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);
            break;
    }
}

// Global Core helpers
function incrementScore(points) {
    state.score += points;
    updateUI();
    saveState();
}

function unlockBadge(badgeId) {
    if (state.unlockedBadges.includes(badgeId)) return;
    
    state.unlockedBadges.push(badgeId);
    saveState();
    updateUI();
    
    // Play triumphant sound
    playSynthSound('win');
    
    // Display visual floating alert (toast) for kids
    showBadgeNotification(badgeId);
}

function showBadgeNotification(badgeId) {
    const badgeEl = document.getElementById(`badge-${badgeId}`);
    let badgeName = "New Badge";
    let badgeEmoji = "🏆";
    
    if (badgeEl) {
        badgeName = badgeEl.querySelector('h4').textContent;
        badgeEmoji = badgeEl.querySelector('.badge-emoji').textContent;
    }
    
    const notification = document.createElement('div');
    notification.className = 'badge-toast';
    notification.innerHTML = `
        <div class="toast-emoji">${badgeEmoji}</div>
        <div class="toast-content">
            <h4>Badge Unlocked!</h4>
            <p>${badgeName}</p>
        </div>
    `;
    
    // Dynamic toast styles injection
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.innerHTML = `
            .badge-toast {
                position: fixed;
                bottom: 30px;
                right: 30px;
                background: linear-gradient(135deg, #1e2435, #121620);
                border: 2px solid var(--makhan-gold);
                border-radius: 15px;
                padding: 15px 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                z-index: 9999;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            .badge-toast.show {
                transform: translateY(0);
                opacity: 1;
            }
            .toast-emoji {
                font-size: 35px;
                animation: float 2s infinite;
            }
            .toast-content h4 {
                font-family: 'Fredoka One', cursive;
                color: var(--makhan-gold);
                font-size: 16px;
                margin-bottom: 2px;
            }
            .toast-content p {
                font-size: 13px;
                color: var(--text-light);
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 50);
    
    // Remove toast
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 500);
    }, 4500);
}

function updateUI() {
    // Score
    document.getElementById('global-score').textContent = state.score;
    
    // Badges page updating
    state.unlockedBadges.forEach(badgeId => {
        const badgeCard = document.getElementById(`badge-${badgeId}`);
        if (badgeCard) {
            badgeCard.classList.remove('locked');
            badgeCard.classList.add('unlocked');
            const statusLabel = badgeCard.querySelector('.lock-status');
            if (statusLabel) {
                statusLabel.textContent = '✅ Unlocked!';
            }
        }
    });
}

// Make functions globally available for modules
window.switchTab = switchTab;
window.playSynthSound = playSynthSound;
window.incrementScore = incrementScore;
window.unlockBadge = unlockBadge;
window.state = state;
