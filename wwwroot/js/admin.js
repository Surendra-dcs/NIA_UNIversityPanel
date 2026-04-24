// =========================================
//  EduAdmin — Animated Counter Script
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    animateCounters();
});

/**
 * Animates all [data-target] elements from 0 → target value
 * using an easeOut curve over ~1.6 seconds.
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    counters.forEach((el, index) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 1600;                    // total ms
        const delay    = index * 120;             // stagger cards
        const startTime = performance.now() + delay;

        el.classList.add('animated');

        function tick(now) {
            const elapsed = Math.max(0, now - startTime);
            const progress = Math.min(elapsed / duration, 1);
            const eased    = 1 - Math.pow(1 - progress, 3);  // easeOutCubic
            const current  = Math.round(eased * target);

            el.textContent = current.toLocaleString('en-IN');  // Indian number format

            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                el.textContent = target.toLocaleString('en-IN');
            }
        }

        requestAnimationFrame(tick);
    });
}
