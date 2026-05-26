// Перетягування вікон
let activeWindow = null;
let offset = { x: 0, y: 0 };

document.querySelectorAll('.window').forEach(window => {
    const header = window.querySelector('.window-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('control')) return;

        activeWindow = window;
        offset.x = e.clientX - window.offsetLeft;
        offset.y = e.clientY - window.offsetTop;

        window.style.zIndex = 100;
        window.style.transition = 'none';
    });
});

document.addEventListener('mousemove', (e) => {
    if (activeWindow) {
        requestAnimationFrame(() => {
            activeWindow.style.left = (e.clientX - offset.x) + 'px';
            activeWindow.style.top = (e.clientY - offset.y) + 'px';
        });
    }
});

document.addEventListener('mouseup', () => {
    if (activeWindow) {
        activeWindow.style.zIndex = 10;
        activeWindow.style.transition = 'all 0.4s ease';
        activeWindow = null;
    }
});

// Кнопки управління вікнами
document.querySelectorAll('.control').forEach(control => {
    control.addEventListener('click', (e) => {
        const window = e.target.closest('.window');

        if (e.target.classList.contains('close')) {
            window.style.display = 'none';
        } else if (e.target.classList.contains('minimize')) {
            window.style.display = 'none';
        } else if (e.target.classList.contains('maximize')) {
            if (window.style.width === '100vw') {
                window.style.width = '';
                window.style.height = '';
                window.style.top = window.dataset.originalTop || '';
                window.style.left = window.dataset.originalLeft || '';
            } else {
                window.dataset.originalTop = window.style.top;
                window.dataset.originalLeft = window.style.left;
                window.style.width = '100vw';
                window.style.height = 'calc(100vh - 80px)';
                window.style.top = '32px';
                window.style.left = '0';
            }
        }
    });
});

// Оновлення часу
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.querySelector('.clock').textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 60000);

// Dock іконки
document.querySelectorAll('.dock-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        document.querySelectorAll('.dock-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const windows = document.querySelectorAll('.window');
        if (index === 0) {
            windows[1].style.display = 'block';
        } else if (index === 1) {
            windows[0].style.display = 'block';
        } else if (index === 2) {
            windows[2].style.display = 'block';
        } else if (index === 3) {
            windows[3].style.display = 'block';
        }
    });
});

const audio = document.getElementById('audio-player');
const playBtn = document.querySelector('.play-btn');
const progressFill = document.querySelector('.progress-fill');
const currentTimeEl = document.querySelector('.current-time');
const totalTimeEl = document.querySelector('.total-time');
const volumeFill = document.querySelector('.volume-fill');
const volumeBar = document.querySelector('.volume-bar');
const progressBar = document.querySelector('.progress-bar');


playBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play().catch(err => console.log("Кликни по странице, чтобы браузер разрешил звук"));
        playBtn.textContent = '⏸️';
        playBtn.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        audio.pause();
        playBtn.textContent = '▶️';
        playBtn.style.animation = 'none';
    }
});

audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        
       
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = formatTime(audio.duration);
    } else {
       
        currentTimeEl.textContent = formatTime(audio.currentTime);
        totalTimeEl.textContent = "Live";
    }
});


progressBar.addEventListener('click', (e) => {
    if (!isNaN(audio.duration) && isFinite(audio.duration)) {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    }
});


volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;
    
    audio.volume = percent;
    volumeFill.style.width = (percent * 100) + '%';
});


function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
