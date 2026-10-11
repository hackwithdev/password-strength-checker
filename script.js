(function () {
    'use strict';

    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    const generateBtn = document.getElementById('generateBtn');
    const strengthBar = document.getElementById('strengthBar');
    const strengthFill = document.getElementById('strengthFill');
    const strengthScore = document.getElementById('strengthScore');
    const charCount = document.getElementById('charCount');
    const entropyEl = document.getElementById('entropy');
    const criteriaList = document.getElementById('criteriaList');

    const criteria = {
        length: { regex: (p) => p.length >= 8, icon: 'icon-length' },
        lower: { regex: (p) => /[a-z]/.test(p), icon: 'icon-lower' },
        upper: { regex: (p) => /[A-Z]/.test(p), icon: 'icon-upper' },
        number: { regex: (p) => /[0-9]/.test(p), icon: 'icon-number' },
        special: { regex: (p) => /[^a-zA-Z0-9]/.test(p), icon: 'icon-special' },
    };

    const strengthLabels = ['Weak', 'Moderate', 'Strong', 'Very Strong', 'Excellent'];

    const GUESSES_PER_SECOND = 10_000_000_000;

    const crackTimeEl = document.getElementById('crackTime');

    function updateCriteria() {
        const password = passwordInput.value;
        document.querySelectorAll('.criterion').forEach((item) => {
            const key = item.getAttribute('data-criterion');
            const isValid = criteria[key].regex(password);
            item.classList.toggle('valid', isValid);
        });
    }

    function calculateEntropy(password) {
        if (!password) return 0;
        const pool = Math.pow(2, getCharsetSize(password));
        const entropy = Math.log2(Math.pow(pool, password.length));
        return Math.round(entropy);
    }

    function getCharsetSize(password) {
        let size = 0;
        if (/[a-z]/.test(password)) size += 26;
        if (/[A-Z]/.test(password)) size += 26;
        if (/[0-9]/.test(password)) size += 10;
        if (/[^a-zA-Z0-9]/.test(password)) size += 33;
        return size > 0 ? size : 1;
    }

    function getStrengthLevel(password) {
        if (!password) return -1;
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;
        if (password.length >= 12 && score >= 4) score++;
        return Math.min(score, 4);
    }

    function updateStrengthMeter() {
        const password = passwordInput.value;
        const level = getStrengthLevel(password);

        if (!password) {
            strengthFill.style.width = '0%';
            strengthScore.textContent = 'WEAK';
            strengthScore.className = 'strength-score weak';
            return;
        }

        const widthPercent = (level + 1) * 20;
        strengthFill.style.width = widthPercent + '%';
        strengthFill.className = 'strength-fill level-' + level;

        strengthScore.textContent = strengthLabels[level] || 'Weak';
        strengthScore.className = 'strength-score';

        if (level <= 1) {
            strengthScore.classList.add('weak');
        } else if (level === 2) {
            strengthScore.classList.add('moderate');
        } else if (level === 3) {
            strengthScore.classList.add('strong');
        } else {
            strengthScore.classList.add('very-strong');
        }
    }

    function updateCharCount() {
        const len = passwordInput.value.length;
        charCount.textContent = len;
    }

    function updateEntropy() {
        const password = passwordInput.value;
        const ent = calculateEntropy(password);
        entropyEl.textContent = password ? ent + ' bits' : '0 bits';
    }

    function formatCrackTime(seconds) {
        if (seconds < 1) {
            return { text: 'instant', level: 'critical' };
        }

        const SEC_PER_MIN = 60;
        const SEC_PER_HOUR = 60 * 60;
        const SEC_PER_DAY = 24 * SEC_PER_HOUR;
        const SEC_PER_MONTH = 30.44 * SEC_PER_DAY;
        const SEC_PER_YEAR = 365.25 * SEC_PER_DAY;

        if (seconds < SEC_PER_MIN) {
            return { text: Math.floor(seconds) + ' sec', level: 'critical' };
        }

        if (seconds < SEC_PER_HOUR) {
            return { text: Math.floor(seconds / SEC_PER_MIN) + ' min', level: 'critical' };
        }

        if (seconds < SEC_PER_DAY) {
            const hrs = Math.floor(seconds / SEC_PER_HOUR);
            const mins = Math.floor((seconds % SEC_PER_HOUR) / SEC_PER_MIN);
            return { text: hrs + 'h ' + mins + 'm', level: 'critical' };
        }

        if (seconds < SEC_PER_MONTH) {
            return { text: Math.floor(seconds / SEC_PER_DAY) + ' days', level: 'warning' };
        }

        if (seconds < SEC_PER_YEAR) {
            return { text: Math.floor(seconds / SEC_PER_MONTH) + ' months', level: 'warning' };
        }

        const years = seconds / SEC_PER_YEAR;
        if (years < 1000) {
            return { text: Math.floor(years).toLocaleString() + ' years', level: 'safe' };
        }

        const centuries = years / 100;
        if (centuries < 100) {
            return { text: Math.floor(centuries).toLocaleString() + ' centuries', level: 'safe' };
        }

        return { text: 'eons', level: 'safe' };
    }

    function updateCrackTime() {
        const password = passwordInput.value;

        if (!password) {
            crackTimeEl.textContent = '—';
            crackTimeEl.className = 'crack-time';
            return;
        }

        const charset = getCharsetSize(password);
        const searchSpace = Math.pow(charset, password.length);
        const avgSeconds = searchSpace / (2 * GUESSES_PER_SECOND);

        const result = formatCrackTime(avgSeconds);
        crackTimeEl.textContent = result.text;
        crackTimeEl.className = 'crack-time ' + result.level;
    }

    function checkPassword() {
        updateCriteria();
        updateStrengthMeter();
        updateCharCount();
        updateEntropy();
        updateCrackTime();
    }

    function togglePasswordVisibility() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        toggleBtn.classList.toggle('active', type === 'text');
    }

    function generatePassword() {
        const length = 16;
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        const array = new Uint8Array(length);
        window.crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }
        passwordInput.value = password;
        checkPassword();
    }

    toggleBtn.addEventListener('click', togglePasswordVisibility);
    generateBtn.addEventListener('click', generatePassword);
    passwordInput.addEventListener('input', checkPassword);
    passwordInput.addEventListener('paste', () => {
        setTimeout(checkPassword, 0);
    });

    checkPassword();
})();
