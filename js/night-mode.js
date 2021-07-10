
let nightMode = false;

const toggleNMButtons = () => { // toggle darkmode icon buttons
    if (nightMode) {
        document.querySelector('#night-mode-toggle i:first-of-type').style.display = 'none';
        document.querySelector('#night-mode-toggle i:last-of-type').style.display = 'block';
    } else {
        document.querySelector('#night-mode-toggle i:first-of-type').style.display = 'block';
        document.querySelector('#night-mode-toggle i:last-of-type').style.display = 'none';
    }
}

document.querySelector('#night-mode-toggle').addEventListener('click', function () {
    nightMode = !nightMode;
    if (nightMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    toggleNMButtons();
})
