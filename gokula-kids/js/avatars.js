// Dashavatara Data
const avatarsData = [
    {
        name: "Matsya (The Fish)",
        emoji: "🐟",
        clue: "I am the giant golden fish. I swam in the cosmic ocean, guided a boat carrying holy sages, and saved the Vedas from a demon during the great flood.",
        options: ["Kurma", "Matsya", "Varaha", "Vamana"],
        description: "Matsya is the fish incarnation! Lord Vishnu took this form to save King Satyavrata, the sages, and all plants and animals from the great cosmic deluge."
    },
    {
        name: "Kurma (The Tortoise)",
        emoji: "🐢",
        clue: "I am the giant tortoise. I offered my shell as a sturdy pivot point to support Mount Mandara while the demigods and demons churned the Ocean of Milk.",
        options: ["Matsya", "Varaha", "Kurma", "Narasimha"],
        description: "Kurma is the tortoise incarnation! He sat at the bottom of the Ocean of Milk to support Mount Mandara, which was being used to churn the ocean for nectar."
    },
    {
        name: "Varaha (The Boar)",
        emoji: "🐗",
        clue: "I am the mighty boar. I dove to the deepest depths of the ocean to fight a demon, rescue Mother Earth, and carry her safely back to the surface on my tusks.",
        options: ["Varaha", "Kurma", "Narasimha", "Parashurama"],
        description: "Varaha is the boar incarnation! He rescued Mother Earth, who had fallen into the cosmic Garbhodaka ocean due to the heavy demon Hiranyaksa."
    },
    {
        name: "Narasimha (The Half-Lion)",
        emoji: "🦁",
        clue: "I am half-man and half-lion. I appeared from a stone pillar at twilight to protect my little devotee Prahlada and defeat the proud demon Hiranyakashipu.",
        options: ["Varaha", "Vamana", "Narasimha", "Rama"],
        description: "Narasimha is the half-man, half-lion incarnation! He protected young Prahlada Maharaja and vanquished his demon father who had received a boon of near-immortality."
    },
    {
        name: "Vamana (The Dwarf Priest)",
        emoji: "🧑‍🦲",
        clue: "I came as a young dwarf priest. I asked King Bali for just three steps of land, then grew so massive that I measured the entire universe in just two steps!",
        options: ["Vamana", "Rama", "Buddha", "Kalki"],
        description: "Vamana is the dwarf-brahmana incarnation! He reclaimed the three worlds from the demon king Bali by growing gigantic and taking three cosmic paces."
    },
    {
        name: "Parashurama (Warrior with Axe)",
        emoji: "🪓",
        clue: "I carry a heavy battle axe. I traveled across the world to defeat greedy kings and protect the gentle people, restoring peace and righteousness.",
        options: ["Rama", "Parashurama", "Balarama", "Buddha"],
        description: "Parashurama is the warrior with an axe! He rid the world of corrupt warrior kings who had neglected their duties and oppressed society."
    },
    {
        name: "Rama (Prince of Ayodhya)",
        emoji: "🏹",
        clue: "I am the prince of Ayodhya and carry a bow. I defeated the ten-headed demon king Ravana, rescued my wife Sita, and set the perfect example of a righteous king.",
        options: ["Parashurama", "Balarama", "Kalki", "Rama"],
        description: "Lord Ramacandra is the ideal king! His pastimes, detailed in the Ramayana, show the path of duty, honor, and devotion."
    },
    {
        name: "Balarama (Lord of the Plow)",
        emoji: "🌾",
        clue: "I am Krishna's strong older brother. I carry a heavy agricultural plow and a mace, and my clothes are the color of a dark blue raincloud.",
        options: ["Balarama", "Rama", "Buddha", "Matsya"],
        description: "Balarama is Krishna's first expansion and older brother! He represents spiritual strength and assists Krishna in all His pastimes."
    },
    {
        name: "Buddha (Sage of Peace)",
        emoji: "🧘",
        clue: "I sat under a Bodhi tree. I taught the world to practice compassion, kindness, and non-violence (Ahimsa) toward all living creatures.",
        options: ["Vamana", "Kalki", "Buddha", "Kurma"],
        description: "Buddha appeared to teach non-violence! He instructed mankind to stop animal sacrifices and live peacefully in mutual kindness."
    },
    {
        name: "Kalki (Rider of the White Horse)",
        emoji: "🐎",
        clue: "I am predicted to appear at the end of Kali-yuga. I will ride a flying white horse named Devadatta and brandish a sword to restore peace to the universe.",
        options: ["Narasimha", "Kalki", "Parashurama", "Matsya"],
        description: "Kalki is the future avatar! He will appear at the end of the dark age of Kali to re-establish the Golden Age of truth and righteousness."
    }
];

// Game State
let currentAvatarIndex = 0;
let avatarScore = 0;
let hasAnswered = false;

// DOM Elements
let avatarEmoji, avatarClue, currentAvatarNum, avatarProgressBar, avatarOptions, avatarFeedback, nextAvatarBtn;

function initAvatarsGame() {
    avatarEmoji = document.getElementById('avatar-emoji');
    avatarClue = document.getElementById('avatar-clue');
    currentAvatarNum = document.getElementById('current-avatar-num');
    avatarProgressBar = document.getElementById('avatar-progress-bar');
    avatarOptions = document.getElementById('avatar-options');
    avatarFeedback = document.getElementById('avatar-feedback');
    nextAvatarBtn = document.getElementById('next-avatar-btn');

    if (!avatarEmoji) return; // safeguard if not on DOM yet
    
    currentAvatarIndex = 0;
    avatarScore = 0;
    
    loadAvatar(currentAvatarIndex);
    
    nextAvatarBtn.addEventListener('click', handleNextAvatar);
}

function loadAvatar(index) {
    const avatar = avatarsData[index];
    hasAnswered = false;
    
    // Set UI elements
    avatarEmoji.textContent = avatar.emoji;
    avatarEmoji.parentElement.className = "silhouette"; // Hide it with silhouette filter
    avatarClue.textContent = avatar.clue;
    currentAvatarNum.textContent = index + 1;
    avatarProgressBar.style.width = `${((index + 1) / 10) * 100}%`;
    
    // Clear feedback
    avatarFeedback.classList.add('hidden');
    
    // Generate Options
    avatarOptions.innerHTML = '';
    avatar.options.forEach(optName => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        // Extract display name (without parentheses if present)
        const cleanName = optName.split(' ')[0];
        btn.textContent = cleanName;
        btn.addEventListener('click', () => handleOptionClick(btn, optName, avatar.name));
        avatarOptions.appendChild(btn);
    });
}

function handleOptionClick(selectedBtn, chosenOption, correctFullName) {
    if (hasAnswered) return;
    hasAnswered = true;
    
    const avatar = avatarsData[currentAvatarIndex];
    const isCorrect = chosenOption === correctFullName || correctFullName.includes(chosenOption);
    
    // Disable all options
    const optionBtns = avatarOptions.querySelectorAll('.option-btn');
    optionBtns.forEach(btn => {
        btn.disabled = true;
    });
    
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        avatarEmoji.parentElement.className = "revealed"; // Show full colors!
        window.playSynthSound('correct');
        avatarScore++;
        window.incrementScore(10);
        
        showFeedback(true, avatar.description);
    } else {
        selectedBtn.classList.add('wrong');
        window.playSynthSound('wrong');
        
        // Find correct button and highlight it gently
        optionBtns.forEach(btn => {
            if (correctFullName.includes(btn.textContent)) {
                btn.classList.add('correct');
            }
        });
        
        // Reveal avatar anyway
        avatarEmoji.parentElement.className = "revealed";
        showFeedback(false, `Oops! It was actually ${avatar.name}. ${avatar.description}`);
    }
}

function showFeedback(isCorrect, text) {
    const feedbackText = avatarFeedback.querySelector('.feedback-text');
    feedbackText.innerHTML = `<strong>${isCorrect ? '🎉 Correct! Wonderful!' : '✨ Learning Moment!'}</strong><br>${text}`;
    avatarFeedback.classList.remove('hidden');
}

function handleNextAvatar() {
    currentAvatarIndex++;
    if (currentAvatarIndex < 10) {
        loadAvatar(currentAvatarIndex);
    } else {
        // Game Completed!
        avatarOptions.innerHTML = '';
        avatarFeedback.classList.add('hidden');
        avatarClue.textContent = '';
        
        const finalPercent = Math.round((avatarScore / 10) * 100);
        avatarEmoji.textContent = "🏆";
        avatarEmoji.parentElement.className = "revealed";
        avatarClue.innerHTML = `
            <h3>Quiz Completed!</h3>
            <p>You guessed <strong>${avatarScore}</strong> out of 10 avatars correctly (${finalPercent}%).</p>
            <p>${avatarScore === 10 ? "Incredible! You are a Dashavatara scholar!" : "Great effort! Play again to get a perfect score!"}</p>
        `;
        
        // Reward logic
        if (avatarScore === 10) {
            window.unlockBadge('avatar_master');
        }
        
        // Add retry button
        const retryBtn = document.createElement('button');
        retryBtn.className = 'next-btn';
        retryBtn.textContent = 'Play Again';
        retryBtn.addEventListener('click', () => {
            initAvatarsGame();
        });
        avatarOptions.appendChild(retryBtn);
    }
}

// Bind to event listeners from app.js tab navigation
document.addEventListener('DOMContentLoaded', () => {
    initAvatarsGame();
});

document.addEventListener('tabChanged', (e) => {
    if (e.detail.tab === 'avatars') {
        initAvatarsGame();
    }
});
