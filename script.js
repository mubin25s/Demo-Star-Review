document.addEventListener('DOMContentLoaded', () => {
    // Star Rating Interaction
    const starRating = document.getElementById('star-rating');
    const ratingInput = document.getElementById('rating');
    const ratingDisplay = document.getElementById('rating-display');
    const emotionDisplay = document.getElementById('emotion-display');

    if (starRating) {
        const stars = starRating.querySelectorAll('i');
        let selectedRating = 0;

        stars.forEach((star, index) => {
            // Click to select
            star.addEventListener('click', () => {
                // If clicking the same star, deselect it
                if (selectedRating === index + 1) {
                    selectedRating = 0;
                } else {
                    selectedRating = index + 1;
                }
                ratingInput.value = selectedRating;
                updateStars(selectedRating);
                updateDisplay(selectedRating);
            });

            // Hover preview
            star.addEventListener('mouseenter', () => {
                updateStars(index + 1, true);
                updateDisplay(index + 1);
            });
        });

        // Reset to selected on mouse leave
        starRating.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
            updateDisplay(selectedRating);
        });

        function updateStars(rating, isHover = false) {
            stars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('fa-regular');
                    star.classList.add('fa-solid');
                    if (isHover) star.classList.add('hover-active');
                } else {
                    star.classList.remove('fa-solid', 'hover-active');
                    star.classList.add('fa-regular');
                }
            });
            updateCharacter(rating);
        }

        function updateCharacter(rating) {
            const charImg = document.getElementById('char-img');
            const charContainer = document.getElementById('rating-character');
            
            if (!charImg) return;

            let imgSrc = 'Characters/neutral.png';
            let className = '';

            switch (rating) {
                case 1:
                    imgSrc = 'Characters/terrified.png';
                    className = 'terrified';
                    break;
                case 2:
                    imgSrc = 'Characters/sad.png';
                    className = 'sad';
                    break;
                case 3:
                    imgSrc = 'Characters/worried.png';
                    className = 'worried';
                    break;
                case 4:
                    imgSrc = 'Characters/happy.png';
                    className = 'happy';
                    break;
                case 5:
                    imgSrc = 'Characters/overjoyed.png';
                    className = 'overjoyed';
                    break;
                default:
                    imgSrc = 'Characters/neutral.png';
                    className = '';
            }

            // Only update if source is different to avoid flickering
            if (!charImg.src.includes(imgSrc)) {
                charImg.src = imgSrc;
                
                // Add a pop animation
                charImg.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    charImg.style.transform = 'scale(1)';
                }, 100);
            }
            
            if (charContainer) {
                charContainer.className = 'rating-character ' + className;
            }
        }

        function updateDisplay(rating) {
            const emotions = {
                0: { text: 'Not rated', emotion: 'Waiting for your feedback...' },
                1: { text: '1 Star ⭐', emotion: 'Terrified! 😨' },
                2: { text: '2 Stars ⭐⭐', emotion: 'Sad 😢' },
                3: { text: '3 Stars ⭐⭐⭐', emotion: 'Worried... 😟' },
                4: { text: '4 Stars ⭐⭐⭐⭐', emotion: 'Happy! 😄' },
                5: { text: '5 Stars ⭐⭐⭐⭐⭐', emotion: 'OVERJOYED! 🤩' }
            };

            const current = emotions[rating] || emotions[0];
            ratingDisplay.textContent = current.text;
            emotionDisplay.textContent = current.emotion;
        }
    }
});
