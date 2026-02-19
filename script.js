let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicator = document.querySelector('.slide-indicator');

function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    
    currentSlide = index;
    
    if (prevBtn) prevBtn.disabled = (currentSlide === 0);
    if (nextBtn) nextBtn.disabled = (currentSlide === totalSlides - 1);
    
    if (indicator) {
        indicator.innerText = `${currentSlide + 1} / ${totalSlides}`;
    }

    // Scroll slide to top
    slides[index].scrollTop = 0;
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) showSlide(currentSlide - 1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < totalSlides - 1) showSlide(currentSlide + 1);
    } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) showSlide(currentSlide - 1);
    }
});

// Initialize
showSlide(0);
