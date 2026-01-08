document.addEventListener('DOMContentLoaded', () => {
    const starRating = document.getElementById('star-rating');
    const ratingInput = document.getElementById('rating');
    const ratingDisplay = document.getElementById('rating-display');
    const emotionDisplay = document.getElementById('emotion-display');
    const speechBubble = document.getElementById('speech-bubble');
    const character = document.getElementById('rating-character');
    const card = document.querySelector('.rating-demo-card');

    // --- Personality Data ---
    const personality = {
        0: { dialog: "Rate me!", theme: "neutral" },
        1: { dialog: "OH NO! STOP!", theme: "terrified" },
        2: { dialog: "I'm so sorry...", theme: "sad" },
        3: { dialog: "Is something wrong?", theme: "worried" },
        4: { dialog: "I like this!", theme: "happy" },
        5: { dialog: "BEST DAY EVER!!!", theme: "overjoyed" }
    };

    // --- Particle System ---
    const canvas = document.getElementById('emotion-particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleColor = '#a855f7';
    let particleMode = 'float';

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 1;
            this.speedY = (Math.random() - 0.5) * 1;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            if (particleMode === 'erratic') {
                this.speedX += (Math.random() - 0.5) * 0.5;
                this.speedY += (Math.random() - 0.5) * 0.5;
                this.speedX *= 0.95;
                this.speedY *= 0.95;
            } else if (particleMode === 'sink') {
                this.speedY += 0.05;
                this.speedX *= 0.99;
            } else if (particleMode === 'rise') {
                this.speedY -= 0.1;
                this.speedX += (Math.random() - 0.5) * 2;
            }

            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.fillStyle = particleColor;
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    function updateAtmosphere(rating) {
        const theme = personality[rating].theme;
        document.body.className = 'theme-' + theme;
        
        switch(rating) {
            case 1: particleColor = '#ff3333'; particleMode = 'erratic'; break;
            case 2: particleColor = '#8a2be2'; particleMode = 'sink'; break;
            case 3: particleColor = '#ff00ff'; particleMode = 'float'; break;
            case 4: particleColor = '#00ff7f'; particleMode = 'float'; break;
            case 5: particleColor = '#ffd700'; particleMode = 'rise'; break;
            default: particleColor = '#a855f7'; particleMode = 'float'; break;
        }

        if (speechBubble) {
            speechBubble.textContent = personality[rating].dialog;
            speechBubble.style.transform = rating === 0 ? 'translateX(-50%) scale(0)' : 'translateX(-50%) scale(1)';
        }
    }

    // --- Interaction Logic ---
    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                selectedRating = (selectedRating === index + 1) ? 0 : index + 1;
                ratingInput.value = selectedRating;
                updateStars(selectedRating);
                updateDisplay(selectedRating);
            });

            star.addEventListener('mouseenter', () => {
                updateStars(index + 1, true);
                updateDisplay(index + 1);
            });
        });

        starRating.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
            updateDisplay(selectedRating);
        });

        function updateStars(rating, isHover = false) {
            stars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                    if (isHover) s.classList.add('hover-active');
                } else {
                    s.classList.remove('fa-solid', 'hover-active');
                    s.classList.add('fa-regular');
                }
            });
            updateCharacter(rating);
        }

        function updateCharacter(rating) {
            const charImg = document.getElementById('char-img');
            if (!charImg) return;

            const charConfigs = {
                1: { src: 'Characters/terrified.png', class: 'terrified' },
                2: { src: 'Characters/sad.png', class: 'sad' },
                3: { src: 'Characters/worried.png', class: 'worried' },
                4: { src: 'Characters/happy.png', class: 'happy' },
                5: { src: 'Characters/overjoyed.png', class: 'overjoyed' }
            };

            const config = charConfigs[rating] || { src: 'Characters/neutral.png', class: '' };
            
            if (!charImg.src.includes(config.src)) {
                charImg.src = config.src;
                charImg.style.transform = 'scale(0.8)';
                setTimeout(() => charImg.style.transform = 'scale(1)', 100);
            }
            
            if (character) character.className = 'rating-character ' + config.class;
        }

        function updateDisplay(rating) {
            const emotions = {
                0: { text: 'Not rated', emotion: 'Waiting for your feedback...', class: 'neutral' },
                1: { text: '1 Star ⭐', emotion: 'Terrified! 😨', class: 'terrified' },
                2: { text: '2 Stars ⭐⭐', emotion: 'Sad 😢', class: 'sad' },
                3: { text: '3 Stars ⭐⭐⭐', emotion: 'Worried... 😟', class: 'worried' },
                4: { text: '4 Stars ⭐⭐⭐⭐', emotion: 'Happy! 😄', class: 'happy' },
                5: { text: '5 Stars ⭐⭐⭐⭐⭐', emotion: 'OVERJOYED! 🤩', class: 'overjoyed' }
            };

            const current = emotions[rating] || emotions[0];
            ratingDisplay.textContent = current.text;
            emotionDisplay.textContent = current.emotion;

            if (card) {
                Object.values(emotions).forEach(e => card.classList.remove(e.class));
                card.classList.add(current.class);
            }

            updateAtmosphere(rating);
        }

        // Tilt & Magnetic Effect
        if (card) {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const cX = rect.width / 2;
                const cY = rect.height / 2;
                
                card.style.transform = `perspective(1000px) rotateX(${(y - cY) / 30}deg) rotateY(${(cX - x) / 30}deg)`;

                if (character) {
                    character.style.transform = `translate(${(x - cX) / 12}px, ${(y - cY) / 12}px)`;
                }
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
                if (character) character.style.transform = `translate(0, 0)`;
            });
        }
    }
});
