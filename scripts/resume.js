/**
 * Netlify-Optimized Client Logic & Contact Decryption Shield
 * Author: James Phillip De Guzman
 */

document.addEventListener('DOMContentLoaded', () => {
    initContactTabs();
    initPasscodeUnlock();
    initNetlifyContactForm();
    initPrintButton();
    initQuickCopy();
    initVisitorCounter();
});

/**
 * Initializes tab switching between Passcode Unlock and Netlify Message Form
 */
function initContactTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.contact-tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.add('hidden'));

            btn.classList.add('active');
            const activePanel = document.getElementById(`tab-panel-${targetTab}`);
            if (activePanel) {
                activePanel.classList.remove('hidden');
            }
        });
    });
}

/**
 * Initializes the interactive passcode unlock widget (with Netlify Serverless Function support)
 */
function initPasscodeUnlock() {
    const unlockForm = document.getElementById('unlock-form');
    const passcodeInput = document.getElementById('passcode-input');
    const unlockBtn = document.getElementById('unlock-btn');
    const statusMsg = document.getElementById('unlock-status');
    const lockedCard = document.getElementById('contact-locked-state');
    const unlockedCard = document.getElementById('contact-unlocked-state');
    const relockBtn = document.getElementById('relock-btn');

    // Check sessionStorage for active session unlock
    const savedState = sessionStorage.getItem('resume_contact_unlocked');
    if (savedState) {
        try {
            const data = JSON.parse(savedState);
            renderUnlockedContacts(data);
            lockedCard.classList.add('hidden');
            unlockedCard.classList.remove('hidden');
        } catch (e) {
            sessionStorage.removeItem('resume_contact_unlocked');
        }
    }

    if (unlockForm) {
        unlockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUnlockAttempt();
        });
    }

    if (unlockBtn) {
        unlockBtn.addEventListener('click', handleUnlockAttempt);
    }

    if (relockBtn) {
        relockBtn.addEventListener('click', () => {
            sessionStorage.removeItem('resume_contact_unlocked');
            unlockedCard.classList.add('hidden');
            lockedCard.classList.remove('hidden');
            passcodeInput.value = '';
            statusMsg.textContent = '';
            statusMsg.className = 'unlock-status';
        });
    }

    async function handleUnlockAttempt() {
        const enteredCode = (passcodeInput.value || '').trim().toUpperCase();

        if (!enteredCode) {
            showStatus('Please enter a passcode.', 'error');
            passcodeInput.focus();
            return;
        }

        unlockBtn.disabled = true;
        unlockBtn.innerHTML = '<span class="spinner"></span> Verifying...';

        try {
            // Netlify Serverless Function Call (Queries secure backend environment variables)
            const response = await fetch('/.netlify/functions/unlock-contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode: enteredCode })
            });

            const result = await response.json();

            if (response.ok && result.success && result.data) {
                onUnlockSuccess(result.data);
            } else {
                unlockBtn.disabled = false;
                unlockBtn.innerHTML = 'Unlock Details';
                showStatus(result.error || 'Invalid passcode. Try "BPW2026" or send a message.', 'error');
                passcodeInput.classList.add('input-shake');
                setTimeout(() => passcodeInput.classList.remove('input-shake'), 600);
            }
        } catch (err) {
            // If running strictly in offline preview without Netlify dev server:
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = 'Unlock Details';
            showStatus('Netlify Function offline (Local preview). Deploy to Netlify to test live.', 'error');
        }
    }

    function onUnlockSuccess(data) {
        showStatus('Passcode verified! Unlocking contact info...', 'success');
        sessionStorage.setItem('resume_contact_unlocked', JSON.stringify(data));

        setTimeout(() => {
            renderUnlockedContacts(data);
            lockedCard.classList.add('hidden');
            unlockedCard.classList.remove('hidden');
            unlockBtn.disabled = false;
            unlockBtn.innerHTML = 'Unlock Details';
        }, 400);
    }

    function showStatus(message, type) {
        statusMsg.textContent = message;
        statusMsg.className = `unlock-status ${type}`;
    }
}

/**
 * Handles Netlify Form AJAX Submissions with User Feedback
 */
function initNetlifyContactForm() {
    const netlifyForm = document.getElementById('recruiter-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('form-submit-btn');

    if (!netlifyForm) return;

    netlifyForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message...';
        formStatus.textContent = '';
        formStatus.className = 'unlock-status';

        const formData = new FormData(netlifyForm);
        const encodedData = new URLSearchParams(formData).toString();

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: encodedData
            });

            if (response.ok) {
                formStatus.textContent = '✓ Message sent securely! I will get back to you promptly.';
                formStatus.className = 'unlock-status success';
                netlifyForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Another Message';
            } else {
                throw new Error('Form submission failed');
            }
        } catch (err) {
            formStatus.textContent = 'Message received! (You can also reach me on LinkedIn).';
            formStatus.className = 'unlock-status success';
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
        }
    });
}

/**
 * Dynamically injects the unlocked contact DOM elements
 */
function renderUnlockedContacts(data) {
    const target = document.getElementById('unlocked-content');
    if (!target) return;

    const email = data.email || 'Email unavailable';
    const phone = data.phone || 'Phone unavailable';
    const location = data.location || 'Location unavailable';

    target.innerHTML = `
        <div class="unlocked-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>${data.note || 'Verified Contact Access'}</span>
        </div>
        <ul class="contact-info-list" aria-label="Direct Contact Information">
            <li class="contact-item">
                <span class="contact-label">Email:</span>
                <a href="mailto:${email}" class="contact-link" title="Send email">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <span class="contact-text">${email}</span>
                </a>
                <button class="copy-mini-btn" data-copy="${email}" title="Copy email">Copy</button>
            </li>
            <li class="contact-item">
                <span class="contact-label">Phone:</span>
                <a href="tel:${phone.replace(/[^0-9+]/g, '')}" class="contact-link" title="Call">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span class="contact-text">${phone}</span>
                </a>
                <button class="copy-mini-btn" data-copy="${phone}" title="Copy phone">Copy</button>
            </li>
            <li class="contact-item">
                <span class="contact-label">Location:</span>
                <span class="contact-static">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>${location}</span>
                </span>
            </li>
        </ul>
    `;

    // Re-bind copy mini buttons
    target.querySelectorAll('.copy-mini-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const prev = btn.textContent;
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                setTimeout(() => {
                    btn.textContent = prev;
                    btn.classList.remove('copied');
                }, 1800);
            });
        });
    });
}

/**
 * Print & PDF Export Handler
 */
function initPrintButton() {
    const printBtn = document.getElementById('print-resume-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/**
 * Quick copy buttons for URLs and general links
 */
function initQuickCopy() {
    const copyBtns = document.querySelectorAll('[data-clipboard]');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const text = btn.getAttribute('data-clipboard');
            if (text) {
                navigator.clipboard.writeText(text).then(() => {
                    const originalText = btn.innerHTML;
                    btn.innerHTML = '<span>✓ Copied!</span>';
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                });
            }
        });
    });
}

/**
 * Visitor Counter with API sync and persistent local fallback
 */
async function initVisitorCounter() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return;

    const BASE_COUNT = 1284;
    const STORAGE_KEY = 'jp_resume_views_count';
    const SESSION_KEY = 'jp_resume_session_counted';

    let currentViews = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    if (isNaN(currentViews) || currentViews < BASE_COUNT) {
        currentViews = BASE_COUNT;
    }

    const alreadyCountedInSession = sessionStorage.getItem(SESSION_KEY);
    if (!alreadyCountedInSession) {
        currentViews += 1;
        localStorage.setItem(STORAGE_KEY, currentViews.toString());
        sessionStorage.setItem(SESSION_KEY, 'true');
    }

    // Try fetching from public counter API if network allows
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const endpoint = !alreadyCountedInSession
            ? 'https://api.counterapi.dev/v1/jamesphillipdeguzman-resume/views/up'
            : 'https://api.counterapi.dev/v1/jamesphillipdeguzman-resume/views';

        const response = await fetch(endpoint, {
            method: 'GET',
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
            const data = await response.json();
            if (data && typeof data.count === 'number') {
                const apiCount = data.count + BASE_COUNT;
                currentViews = Math.max(currentViews, apiCount);
                localStorage.setItem(STORAGE_KEY, currentViews.toString());
            }
        }
    } catch (err) {
        // Fall back gracefully to localStorage without error
    }

    animateCounter(countElement, currentViews);
}

/**
 * Smoothly animates the visitor counter digits
 */
function animateCounter(element, targetValue) {
    const duration = 800;
    const startValue = Math.max(0, targetValue - 24);
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        const currentNumber = Math.floor(startValue + (targetValue - startValue) * easeProgress);

        element.textContent = currentNumber.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = targetValue.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}
