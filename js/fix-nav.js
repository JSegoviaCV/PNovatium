/**
 * Fix for mobile navigation "bounce" effect.
 * Intercepts clicks on navbar toggler and sub-menu links to prevent
 * conflicts between Bootstrap 5 and custom scripts (main.js).
 */
document.addEventListener('DOMContentLoaded', function() {
    // Use capture phase to intercept the event before other listeners
    document.addEventListener('click', function(e) {
        const toggler = e.target.closest('.navbar-toggler') || e.target.closest('.has-children');
        if (!toggler) return;

        // The menu collapses below 1200px due to 'navbar-expand-xl' class.
        // We only apply this manual fix when the menu is in collapsed (mobile/tablet) mode.
        // For wider screens, we let the default behavior (or main.js) handle it.
        if (window.innerWidth >= 1200) return;

        // Prevent other listeners (Bootstrap Data-API and main.js) from firing
        // This stops the "bounce" effect by killing the conflicting toggle call.
        e.stopImmediatePropagation();
        e.preventDefault();

        // Manual toggle logic
        // We use data-target instead of data-bs-target to avoid triggering Bootstrap's internal listeners
        const targetSelector = toggler.getAttribute('data-target');
        const targetEl = document.querySelector(targetSelector);
        
        if (targetEl) {
            const isShown = targetEl.classList.contains('show');
            
            // Use Bootstrap's JS API manually to perform the toggle
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(targetEl);
            if (isShown) {
                bsCollapse.hide();
                toggler.classList.add('collapsed');
                toggler.setAttribute('aria-expanded', 'false');
            } else {
                bsCollapse.show();
                toggler.classList.remove('collapsed');
                toggler.setAttribute('aria-expanded', 'true');
            }
        }

        // Maintain analytics/tracking if present in onclick attribute
        const onclickAttr = toggler.getAttribute('onclick');
        if (onclickAttr) {
            try {
                // Safely execute the onclick content in the context of the toggler
                new Function(onclickAttr).call(toggler);
            } catch (err) {
                console.error("Error executing onclick tracking:", err);
            }
        }
    }, true); // Capture phase (true) ensures we catch the event first
});
