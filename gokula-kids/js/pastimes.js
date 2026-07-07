// Pastime Stories and Quiz Module
(function() {
    const storiesData = {
        govardhan: {
            title: "Krishna Lifts Govardhan Hill 🏔️",
            emoji: "🏔️",
            summary: "To teach the proud King of Heaven, Indra, a lesson, little Krishna advised the residents of Vrindavan to worship Govardhan Hill instead of holding a festival for Indra. Angry at this, Indra sent devastating thunderstorms to flood Vrindavan. To protect His devotees, cows, and friends, seven-year-old Krishna lifted the massive Govardhan Hill on the pinky finger of His left hand like a giant umbrella! He held it up continuously for seven days until Indra realized Krishna's supreme nature and apologized.",
            badgeId: "quiz_govardhan",
            badgeName: "Govardhan Hero",
            badgeEmoji: "🏔️",
            badgeDesc: "Successfully completed the Govardhan Hill pastime quiz.",
            quiz: [
                {
                    q: "Why did Indra send heavy rainstorms to flood Vrindavan?",
                    opts: [
                        "Because Krishna took his butter",
                        "Because the residents worshiped Govardhan Hill instead of Indra",
                        "Because they did not invite him to their festival",
                        "Because Balarama challenged him to a duel"
                    ],
                    a: 1, // index of correct answer
                    info: "Correct! Indra was proud and got angry when Krishna asked the villagers to worship Govardhan Hill instead of him."
                },
                {
                    q: "How did little Krishna lift and hold the entire Govardhan Hill?",
                    opts: [
                        "With both His hands",
                        "Using a giant rope made of vines",
                        "On the pinky finger of His left hand",
                        "With the help of Balarama and the cowherd boys"
                    ],
                    a: 2,
                    info: "Correct! Little Krishna lifted the huge mountain effortlessly on the pinky finger of His left hand!"
                },
                {
                    q: "For how long did Krishna hold up Govardhan Hill to shield Vrindavan?",
                    opts: [
                        "7 hours",
                        "7 days",
                        "1 month",
                        "1 afternoon"
                    ],
                    a: 1,
                    info: "Correct! He held it up for 7 days and 7 nights without moving, sheltering all of Vrindavan."
                }
            ]
        },
        kaliya: {
            title: "Krishna Subdues the Kaliya Serpent 🐍",
            emoji: "🐍",
            summary: "A massive, multi-hooded black serpent named Kaliya lived in the Yamuna River. His deadly poison was so strong that the river water boiled, and any bird flying over it fell dead. Krishna wanted to purify the Yamuna, so He climbed a Kadamba tree and jumped into the bubbling water. The snake attacked and wrapped around Him, but Krishna grew larger and escaped. He then leaped onto Kaliya's many hoods and began dancing beautifully, playing His flute. As Kaliya grew weak, his wives prayed for mercy. Krishna spared Kaliya and ordered him to go to the ocean, purifying the river.",
            badgeId: "quiz_kaliya",
            badgeName: "Kaliya Tamer",
            badgeEmoji: "🐍",
            badgeDesc: "Successfully completed the Subduing Kaliya pastime quiz.",
            quiz: [
                {
                    q: "Where was the poisonous snake Kaliya living?",
                    opts: [
                        "In a dark cave under Govardhan Hill",
                        "In the Yamuna River",
                        "In the King's palace",
                        "In a hollow Kadamba tree"
                    ],
                    a: 1,
                    info: "Correct! Kaliya was living in the Yamuna River, poisoning the water for all the cowherd boys and cows."
                },
                {
                    q: "What did Krishna do to stop the Kaliya serpent?",
                    opts: [
                        "He cut off all of Kaliya's heads with a sword",
                        "He danced on Kaliya's hoods and played His flute",
                        "He caged Kaliya inside a clay pot",
                        "He sang a lullaby to put Kaliya to sleep"
                    ],
                    a: 1,
                    info: "Correct! Krishna jumped into the river and danced on Kaliya's many hoods to subdue him."
                },
                {
                    q: "Why did Krishna let Kaliya go instead of punishing him further?",
                    opts: [
                        "Kaliya escaped and swam away",
                        "Balarama requested Krishna to stop",
                        "Kaliya's wives prayed for mercy and Kaliya surrendered to Him",
                        "Kaliya promised to share his treasure"
                    ],
                    a: 2,
                    info: "Correct! Kaliya's wives, the Nagapatnis, prayed for mercy, and Kaliya surrendered, so Krishna pardoned him."
                }
            ]
        },
        butter_thief: {
            title: "The Sweet Butter Thief (Damodara) 🧈",
            emoji: "🧈",
            summary: "Little Krishna loved fresh butter and yogurt. He and His friends would devise clever plans to steal butter pots hung high up by the Gopis, forming human pyramids or using sticks. Krishna even shared the butter with the monkeys! One day, Mother Yashoda caught Him red-handed. She decided to bind Him to a wooden grinding mortar with a rope to keep Him safe. But every time she tied the rope, it was exactly two fingers too short! Yashoda added more and more rope, but it was always two fingers too short. Seeing His mother sweating and exhausted, Krishna smiled and willingly allowed Himself to be bound.",
            badgeId: "quiz_butter_thief",
            badgeName: "Makhan Friend",
            badgeEmoji: "🧈",
            badgeDesc: "Successfully completed the Butter Thief pastime quiz.",
            quiz: [
                {
                    q: "Who helped Krishna steal butter and shared it with Him?",
                    opts: [
                        "His friends and the forest monkeys",
                        "King Kamsa's guards",
                        "The Gopis themselves",
                        "The palace guards"
                    ],
                    a: 0,
                    info: "Correct! Krishna loved feeding the butter to His cowherd friends and the playful monkeys of Vrindavan."
                },
                {
                    q: "What did Mother Yashoda try to tie Krishna to as a gentle punishment?",
                    opts: [
                        "A wooden column in the kitchen",
                        "A heavy wooden grinding mortar",
                        "A swing under a banyan tree",
                        "His bedpost"
                    ],
                    a: 1,
                    info: "Correct! She tried to tie Him to a heavy wooden grinding mortar (ukhal)."
                },
                {
                    q: "By how much was Mother Yashoda's rope always short?",
                    opts: [
                        "Two feet",
                        "Two fingers",
                        "A hand span",
                        "Three inches"
                    ],
                    a: 1,
                    info: "Correct! The rope was always exactly two fingers short, showing that the Lord can only be bound by pure love, not force."
                }
            ]
        },
        universe_mouth: {
            title: "The Universe in Krishna's Mouth 🌌",
            emoji: "🌌",
            summary: "One day, when toddler Krishna was playing in the dirt, His brother Balarama and friends ran to Mother Yashoda complaining that Krishna was eating clay. Yashoda took Krishna's hand and asked, 'Why have You eaten dirt?' Krishna replied, 'I have not eaten dirt, Mother. My friends are lying! If you don't believe me, look inside my mouth.' When Yashoda looked inside His tiny mouth, she did not see dirt. Instead, she saw the sun, moon, stars, all planets, the three worlds, all oceans, mountains, and even Vrindavan and herself looking back! Yashoda was stunned by this cosmic sight.",
            badgeId: "quiz_universe_mouth",
            badgeName: "Cosmic Explorer",
            badgeEmoji: "🌌",
            badgeDesc: "Successfully completed the Universe in the Mouth pastime quiz.",
            quiz: [
                {
                    q: "What did Krishna's playmates accuse Him of eating?",
                    opts: [
                        "A whole clay pot of butter",
                        "Dirt and clay from the ground",
                        "Poisonous forest berries",
                        "A wild flower"
                    ],
                    a: 1,
                    info: "Correct! They complained to Mother Yashoda that little Krishna was eating dirt."
                },
                {
                    q: "What did Mother Yashoda see when Krishna opened His mouth?",
                    opts: [
                        "The stolen butter pot",
                        "The entire universe, including stars, planets, and oceans",
                        "A sparkling gold coin",
                        "Nothing, His mouth was empty"
                    ],
                    a: 1,
                    info: "Correct! She saw the entire cosmic manifestation, stars, planets, and even herself inside His tiny mouth."
                },
                {
                    q: "What does this beautiful pastime teach us about Krishna?",
                    opts: [
                        "He was a regular boy who liked magic tricks",
                        "He was the Supreme Lord of all creation, showing His divine nature",
                        "He had a very big appetite",
                        "He was playing a prank on His friends"
                    ],
                    a: 1,
                    info: "Correct! It shows that even though He played like a little child, Krishna is the supreme creator and controller of the entire cosmos."
                }
            ]
        }
    };

    // State Variables
    let currentStoryKey = 'govardhan';
    let currentQuestionIdx = 0;
    let quizScore = 0;
    let selectedStoryData = null;

    // DOM Elements
    let storyTitle, storyEmoji, storyBody, startQuizBtn, storyViewer;
    let quizPanel, quizQuestionTitle, quizQuestionText, quizOptions, quizFeedback, quizFeedbackText, nextQuestionBtn;
    let completionPanel, unlockedBadgeIcon, unlockedBadgeName, unlockedBadgeDesc, backToStoriesBtn;

    function initPastimes() {
        // Main story panel elements
        storyTitle = document.getElementById('story-title');
        storyEmoji = document.getElementById('story-emoji');
        storyBody = document.getElementById('story-body');
        startQuizBtn = document.getElementById('start-story-quiz-btn');
        storyViewer = document.getElementById('story-viewer');

        // Quiz elements
        quizPanel = document.getElementById('story-quiz-panel');
        quizQuestionTitle = document.getElementById('quiz-question-title');
        quizQuestionText = document.getElementById('quiz-question-text');
        quizOptions = document.getElementById('quiz-options');
        quizFeedback = document.getElementById('quiz-feedback');
        quizFeedbackText = document.getElementById('quiz-feedback-text');
        nextQuestionBtn = document.getElementById('next-quiz-question-btn');

        // Completion elements
        completionPanel = document.getElementById('quiz-completion-panel');
        unlockedBadgeIcon = document.getElementById('unlocked-badge-icon');
        unlockedBadgeName = document.getElementById('unlocked-badge-name');
        unlockedBadgeDesc = document.getElementById('unlocked-badge-desc');
        backToStoriesBtn = document.getElementById('back-to-stories-btn');

        if (!storyTitle) return;

        setupSidebarNavigation();
        loadStory(currentStoryKey);

        startQuizBtn.onclick = startStoryQuiz;
        nextQuestionBtn.onclick = handleNextQuestion;
        backToStoriesBtn.onclick = () => {
            window.playSynthSound('tap');
            resetToStoryViewer();
        };
    }

    function setupSidebarNavigation() {
        const items = document.querySelectorAll('.pastime-nav-item');
        items.forEach(item => {
            item.onclick = () => {
                const storyKey = item.getAttribute('data-story');
                items.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                
                window.playSynthSound('tap');
                loadStory(storyKey);
            };
        });
    }

    function loadStory(storyKey) {
        currentStoryKey = storyKey;
        selectedStoryData = storiesData[storyKey];
        
        resetToStoryViewer();
        
        storyTitle.textContent = selectedStoryData.title;
        storyEmoji.textContent = selectedStoryData.emoji;
        storyBody.textContent = selectedStoryData.summary;
    }

    function resetToStoryViewer() {
        storyViewer.classList.remove('hidden');
        quizPanel.classList.add('hidden');
        completionPanel.classList.add('hidden');
    }

    function startStoryQuiz() {
        window.playSynthSound('tap');
        storyViewer.classList.add('hidden');
        quizPanel.classList.remove('hidden');
        
        currentQuestionIdx = 0;
        quizScore = 0;
        
        loadQuestion(currentQuestionIdx);
    }

    function loadQuestion(idx) {
        const question = selectedStoryData.quiz[idx];
        
        quizQuestionTitle.textContent = `Question ${idx + 1} of 3`;
        quizQuestionText.textContent = question.q;
        quizFeedback.classList.add('hidden');
        
        quizOptions.innerHTML = '';
        question.opts.forEach((optText, optIdx) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option-btn';
            btn.textContent = optText;
            btn.onclick = () => handleQuizAnswer(btn, optIdx, question.a, question.info);
            quizOptions.appendChild(btn);
        });
    }

    function handleQuizAnswer(selectedBtn, chosenIdx, correctIdx, infoText) {
        const isCorrect = chosenIdx === correctIdx;
        
        // Disable all option buttons
        const optionBtns = quizOptions.querySelectorAll('.quiz-option-btn');
        optionBtns.forEach(btn => btn.disabled = true);
        
        if (isCorrect) {
            selectedBtn.classList.add('correct');
            window.playSynthSound('correct');
            quizScore++;
            window.incrementScore(10);
            
            quizFeedbackText.innerHTML = `<strong>🌟 Correct!</strong><br>${infoText}`;
            quizFeedback.classList.remove('hidden');
        } else {
            selectedBtn.classList.add('wrong');
            window.playSynthSound('wrong');
            
            // Highlight correct answer
            optionBtns[correctIdx].classList.add('correct');
            
            quizFeedbackText.innerHTML = `<strong>✨ Let's learn:</strong><br>${infoText}`;
            quizFeedback.classList.remove('hidden');
        }
    }

    function handleNextQuestion() {
        currentQuestionIdx++;
        if (currentQuestionIdx < 3) {
            loadQuestion(currentQuestionIdx);
        } else {
            handleQuizComplete();
        }
    }

    function handleQuizComplete() {
        quizPanel.classList.add('hidden');
        completionPanel.classList.remove('hidden');
        
        const success = quizScore === 3;
        
        if (success) {
            window.playSynthSound('win');
            
            // Set up badge display elements
            unlockedBadgeIcon.textContent = selectedStoryData.badgeEmoji;
            unlockedBadgeName.textContent = selectedStoryData.badgeName;
            unlockedBadgeDesc.textContent = selectedStoryData.badgeDesc;
            
            // Unlock badge globally
            window.unlockBadge(selectedStoryData.badgeId);
            
            completionPanel.querySelector('h2').textContent = "Excellent Job! 🎉";
            completionPanel.querySelector('p').innerHTML = `You answered 3 out of 3 questions correctly!<br>You have unlocked the <strong>${selectedStoryData.badgeName}</strong> badge. Keep it up!`;
        } else {
            window.playSynthSound('wrong');
            
            unlockedBadgeIcon.textContent = "📖";
            unlockedBadgeName.textContent = "Almost there!";
            unlockedBadgeDesc.textContent = "Answer all 3 questions correctly to win a badge.";
            
            completionPanel.querySelector('h2').textContent = "Keep Learning! ✨";
            completionPanel.querySelector('p').innerHTML = `You answered ${quizScore} out of 3 questions correctly.<br>Read the story again and try the quiz once more to unlock your badge!`;
        }
    }

    // Bind to DOM
    document.addEventListener('DOMContentLoaded', () => {
        initPastimes();
    });

    document.addEventListener('tabChanged', (e) => {
        if (e.detail.tab === 'pastimes') {
            initPastimes();
        }
    });

})();
