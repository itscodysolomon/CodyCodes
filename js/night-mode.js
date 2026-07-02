const THEME_STORAGE_KEY = 'codycodes-theme';

const toggleNMButtons = () => {
    const moonIcon = document.querySelector('#night-mode-toggle i:first-of-type');
    const sunIcon = document.querySelector('#night-mode-toggle i:last-of-type');

    if (nightMode) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    }
};

const persistTheme = (theme) => {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
        // Ignore storage failures (private browsing, blocked storage, etc.)
    }
};

const applyTheme = (isDark) => {
    nightMode = isDark;
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    persistTheme(theme);
    toggleNMButtons();
};

let nightMode = document.documentElement.getAttribute('data-theme') === 'dark';
toggleNMButtons();

document.querySelector('#night-mode-toggle').addEventListener('click', function () {
    applyTheme(!nightMode);
});
