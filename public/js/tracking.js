/**
 * Gratitude Marketing -- Analytics Tracking Implementation
 *
 * This file provides the complete client-side tracking utilities
 * for the Gratitude marketing website.
 *
 * Analytics provider: Plausible (self-hosted, cookieless, GDPR-compliant)
 *
 * Usage:
 *   1. Include the Plausible script in <head>
 *   2. Include this file after DOM is ready
 *   3. Call initTracking() on page load
 *
 * No cookies. No localStorage for analytics. No fingerprinting.
 * All data stays on EU-hosted infrastructure.
 */

// ============================================================
// CORE: Event Tracking
// ============================================================

/**
 * Track a custom event with Plausible.
 * Silently fails if Plausible is not loaded (e.g., ad blockers).
 *
 * @param {string} name - Event name (mkt_* convention)
 * @param {Object} [props] - Event properties (flat key-value, strings only)
 */
function trackEvent(name, props) {
  if (typeof window.plausible === 'function') {
    window.plausible(name, props ? { props: props } : undefined);
  }
}

// ============================================================
// SCROLL DEPTH TRACKING
// ============================================================

/**
 * Track scroll depth at 25%, 50%, 75%, 100% using IntersectionObserver.
 *
 * Prerequisites: Add invisible sentinel elements in your HTML:
 *   <div id="scroll-25" aria-hidden="true"></div>  (at 25% of page)
 *   <div id="scroll-50" aria-hidden="true"></div>  (at 50% of page)
 *   <div id="scroll-75" aria-hidden="true"></div>  (at 75% of page)
 *   <div id="scroll-100" aria-hidden="true"></div> (at bottom of page)
 *
 * Alternative: If sentinels are not present, falls back to scroll
 * percentage calculation on the scroll event (throttled).
 */
function initScrollDepthTracking() {
  var page = window.location.pathname;
  var tracked = {};
  var thresholds = [25, 50, 75, 100];

  // Try IntersectionObserver approach first
  var sentinelsFound = false;
  if ('IntersectionObserver' in window) {
    thresholds.forEach(function(pct) {
      var sentinel = document.getElementById('scroll-' + pct);
      if (sentinel) {
        sentinelsFound = true;
        var observer = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && !tracked[pct]) {
              tracked[pct] = true;
              trackEvent('mkt_scroll_' + pct, { page: page });
              observer.disconnect();
            }
          });
        }, { threshold: 0.1 });
        observer.observe(sentinel);
      }
    });
  }

  // Fallback: scroll event based tracking
  if (!sentinelsFound) {
    var scrollTimer = null;
    window.addEventListener('scroll', function() {
      if (scrollTimer) return;
      scrollTimer = setTimeout(function() {
        scrollTimer = null;
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        var docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (docHeight <= 0) return;
        var scrollPct = Math.round((scrollTop / docHeight) * 100);

        thresholds.forEach(function(pct) {
          if (scrollPct >= pct && !tracked[pct]) {
            tracked[pct] = true;
            trackEvent('mkt_scroll_' + pct, { page: page });
          }
        });
      }, 250); // Throttle to 250ms
    }, { passive: true });
  }
}

// ============================================================
// TIME ON PAGE TRACKING
// ============================================================

/**
 * Track time spent on page at 30s and 60s thresholds.
 */
function initTimeOnPageTracking() {
  var page = window.location.pathname;

  setTimeout(function() {
    trackEvent('mkt_time_30s', { page: page });
  }, 30000);

  setTimeout(function() {
    trackEvent('mkt_time_60s', { page: page });
  }, 60000);
}

// ============================================================
// CTA CLICK TRACKING
// ============================================================

/**
 * Track clicks on elements with data-track-cta attribute.
 *
 * HTML usage:
 *   <a href="/demo"
 *      data-track-cta="Richiedi Demo"
 *      data-track-source="hero">
 *     Richiedi Demo
 *   </a>
 */
function initCTATracking() {
  document.addEventListener('click', function(e) {
    var target = e.target.closest('[data-track-cta]');
    if (target) {
      trackEvent('mkt_cta_click', {
        label: target.getAttribute('data-track-cta'),
        source: target.getAttribute('data-track-source') || 'unknown'
      });
    }
  });
}

// ============================================================
// VIDEO TRACKING
// ============================================================

/**
 * Track video engagement: play, 25%, 50%, 100%.
 *
 * HTML usage:
 *   <video data-track-video="product_demo">...</video>
 *   OR
 *   <iframe data-track-video="product_demo" src="..."></iframe>
 *
 * Note: For iframe-embedded videos (YouTube, Vimeo), use their
 * respective JS APIs instead. This tracks native <video> elements.
 */
function initVideoTracking() {
  var videos = document.querySelectorAll('video[data-track-video]');
  videos.forEach(function(video) {
    var name = video.getAttribute('data-track-video');
    var milestones = { 25: false, 50: false };

    video.addEventListener('play', function() {
      trackEvent('mkt_video_play', { video: name });
    });

    video.addEventListener('timeupdate', function() {
      if (video.duration <= 0) return;
      var pct = (video.currentTime / video.duration) * 100;

      if (pct >= 25 && !milestones[25]) {
        milestones[25] = true;
        trackEvent('mkt_video_25', { video: name });
      }
      if (pct >= 50 && !milestones[50]) {
        milestones[50] = true;
        trackEvent('mkt_video_50', { video: name });
      }
    });

    video.addEventListener('ended', function() {
      trackEvent('mkt_video_100', { video: name });
    });
  });
}

// ============================================================
// DEMO FORM TRACKING
// ============================================================

/**
 * Track demo booking form interactions: view, start, steps, submit, abandon.
 *
 * HTML requirements:
 *   <form id="demo-form" data-page-source="pricing">
 *     <div class="form-step" data-step="1">...</div>
 *     <div class="form-step" data-step="2">...</div>
 *     <div class="form-step" data-step="3">...</div>
 *   </form>
 */
function initDemoFormTracking() {
  var form = document.getElementById('demo-form');
  if (!form) return;

  var source = form.getAttribute('data-page-source') || document.body.getAttribute('data-page-source') || 'direct';
  var formStarted = false;
  var formSubmitted = false;
  var currentStep = 0;
  var fieldsFilled = 0;

  // Track form view (IntersectionObserver)
  if ('IntersectionObserver' in window) {
    var viewObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          trackEvent('mkt_demo_form_view', { source: source });
          viewObserver.disconnect();
        }
      });
    }, { threshold: 0.3 });
    viewObserver.observe(form);
  }

  // Track form start (first focus)
  form.addEventListener('focusin', function() {
    if (!formStarted) {
      formStarted = true;
      currentStep = 1;
      trackEvent('mkt_demo_form_start', { source: source });
    }
  });

  // Track field completions
  form.addEventListener('change', function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      if (e.target.value.trim() !== '') {
        fieldsFilled++;
      }
    }
  });

  // Track step transitions
  // Call this function when advancing to a new step in your form logic
  window.trackDemoFormStep = function(step) {
    currentStep = step;
    trackEvent('mkt_demo_form_step', { step: String(step), source: source });
  };

  // Track submission
  form.addEventListener('submit', function(e) {
    formSubmitted = true;
    trackEvent('mkt_demo_form_submit', {
      source: source,
      fields_count: String(fieldsFilled)
    });
  });

  // Track abandonment
  window.addEventListener('beforeunload', function() {
    if (formStarted && !formSubmitted) {
      trackEvent('mkt_demo_form_abandon', {
        step: String(currentStep),
        fields_filled: String(fieldsFilled)
      });
    }
  });
}

// ============================================================
// CONTACT FORM TRACKING
// ============================================================

/**
 * Track contact form submission.
 * HTML: <form id="contact-form">...<select name="subject">...</select></form>
 */
function initContactFormTracking() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function() {
    var subjectEl = form.querySelector('[name="subject"]');
    var subject = subjectEl ? subjectEl.value : 'unknown';
    trackEvent('mkt_contact_form_submit', { subject: subject });
  });
}

// ============================================================
// NEWSLETTER TRACKING
// ============================================================

/**
 * Track newsletter signups.
 * HTML: <form class="newsletter-form" data-source="footer">...</form>
 */
function initNewsletterTracking() {
  var forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function() {
      var source = form.getAttribute('data-source') || 'unknown';
      trackEvent('mkt_newsletter_signup', { source: source });
    });
  });
}

// ============================================================
// PRICING PAGE TRACKING
// ============================================================

/**
 * Track pricing page engagement.
 */
function initPricingTracking() {
  var pricingSection = document.getElementById('pricing');
  if (!pricingSection) return;

  // Track pricing view
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          trackEvent('mkt_pricing_view');
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(pricingSection);
  }

  // Track tier toggles
  var tierToggles = pricingSection.querySelectorAll('[data-tier-toggle]');
  tierToggles.forEach(function(toggle) {
    toggle.addEventListener('click', function() {
      trackEvent('mkt_pricing_toggle', {
        tier: toggle.getAttribute('data-tier-toggle')
      });
    });
  });

  // Track FAQ expansions
  var faqItems = pricingSection.querySelectorAll('[data-pricing-faq]');
  faqItems.forEach(function(item) {
    item.addEventListener('click', function() {
      trackEvent('mkt_pricing_faq_expand', {
        question: item.getAttribute('data-pricing-faq')
      });
    });
  });
}

// ============================================================
// A/B TESTING FRAMEWORK
// ============================================================

/**
 * Simple A/B testing using sessionStorage for variant persistence.
 * Variants are tracked as Plausible events with test name and variant ID.
 *
 * Usage:
 *   var variant = getABVariant('hero_headline', ['control', 'revenue', 'social_proof']);
 *   // Apply variant to DOM
 *   document.getElementById('hero').textContent = variants[variant];
 *
 * @param {string} testName - Unique test identifier
 * @param {string[]} variants - Array of variant IDs
 * @returns {string} The assigned variant ID
 */
function getABVariant(testName, variants) {
  var key = 'ab_' + testName;
  var variant;

  try {
    variant = sessionStorage.getItem(key);
  } catch (e) {
    // sessionStorage unavailable (private browsing, etc.)
    variant = null;
  }

  if (!variant || variants.indexOf(variant) === -1) {
    variant = variants[Math.floor(Math.random() * variants.length)];
    try {
      sessionStorage.setItem(key, variant);
    } catch (e) {
      // Ignore storage errors
    }
  }

  // Track impression
  trackEvent('mkt_ab_impression', {
    test: testName,
    variant: variant
  });

  return variant;
}

// ============================================================
// EXIT-INTENT POPUP TRACKING
// ============================================================

/**
 * Detect exit intent on desktop (mouse leaves viewport top).
 * Shows popup once per session.
 *
 * @param {Function} showPopupFn - Function to call when exit intent is detected
 */
function initExitIntentTracking(showPopupFn) {
  // Only on desktop
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  var shown = false;
  try {
    if (sessionStorage.getItem('exit_popup_shown')) return;
  } catch (e) {
    // Ignore
  }

  document.addEventListener('mouseout', function(e) {
    if (shown) return;
    if (e.clientY <= 0 && e.relatedTarget === null) {
      shown = true;
      try {
        sessionStorage.setItem('exit_popup_shown', '1');
      } catch (ex) {
        // Ignore
      }
      if (typeof showPopupFn === 'function') {
        showPopupFn();
      }
    }
  });
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize all tracking modules. Call this on DOMContentLoaded.
 */
function initTracking() {
  initScrollDepthTracking();
  initTimeOnPageTracking();
  initCTATracking();
  initVideoTracking();
  initDemoFormTracking();
  initContactFormTracking();
  initNewsletterTracking();
  initPricingTracking();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTracking);
} else {
  initTracking();
}

// Export for module usage (if bundled)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    trackEvent: trackEvent,
    getABVariant: getABVariant,
    initExitIntentTracking: initExitIntentTracking,
    initTracking: initTracking
  };
}
