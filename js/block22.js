// Перетягування вікон
let activeWindow = null;
let offset = { x: 0, y: 0 };
let highestZIndex = 10;

document.querySelectorAll('.window').forEach(window => {
    window.style.zIndex = highestZIndex++;

    const header = window.querySelector('.window-header');

    header.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('control')) return;

        activeWindow = window;
        offset.x = e.clientX - window.offsetLeft;
        offset.y = e.clientY - window.offsetTop;

        window.style.zIndex = ++highestZIndex;
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
            windows[1].style.display = 'block'; // Files
        } else if (index === 1) {
            windows[0].style.display = 'block'; // Terminal
        } else if (index === 2) {
            windows[2].style.display = 'block'; // Gmail
        } else if (index === 3) {
            windows[3].style.display = 'block'; // Player
        } else if (index === 4) {
            windows[6].style.display = 'block'; // Gallery
        } else if (index === 5) {
            windows[4].style.display = 'block'; // Settings
        } else if (index === 6) {
            windows[5].style.display = 'block'; // Browser
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
        playBtn.innerHTML = '<i data-lucide="pause"></i>';
        lucide.createIcons();
        playBtn.style.animation = 'pulse 1s ease-in-out infinite';
    } else {
        audio.pause();
        playBtn.innerHTML = '<i data-lucide="play"></i>';
        lucide.createIcons();
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


volumeBar.addEventListener('click', (e) => {
    const rect = volumeBar.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;

    audio.volume = percent;
    volumeFill.style.width = (percent * 100) + '%';
});

// Drag для слайдера громкости
let isDraggingVolume = false;

volumeBar.addEventListener('mousedown', (e) => {
    isDraggingVolume = true;
    const rect = volumeBar.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;

    audio.volume = percent;
    volumeFill.style.width = (percent * 100) + '%';
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) {
        const rect = volumeBar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        if (percent < 0) percent = 0;
        if (percent > 1) percent = 1;

        audio.volume = percent;
        volumeFill.style.width = (percent * 100) + '%';
    }
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});


function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}

// Настройки - слайдеры
const transparencySlider = document.querySelectorAll('.settings-slider')[0];
const blurSlider = document.querySelectorAll('.settings-slider')[1];
const sliderValues = document.querySelectorAll('.slider-value');

if (transparencySlider) {
    transparencySlider.addEventListener('input', (e) => {
        const value = e.target.value;
        sliderValues[0].textContent = value + '%';

        // Применяем прозрачность к окнам
        const opacity = value / 100;
        document.querySelectorAll('.window').forEach(window => {
            window.style.background = `rgba(255, 255, 255, ${0.15 * opacity})`;
        });
    });
}

if (blurSlider) {
    blurSlider.addEventListener('input', (e) => {
        const value = e.target.value;
        sliderValues[1].textContent = value + 'px';

        // Применяем размытие к окнам
        document.querySelectorAll('.window').forEach(window => {
            window.style.backdropFilter = `blur(${value}px) saturate(180%)`;
            window.style.webkitBackdropFilter = `blur(${value}px) saturate(180%)`;
        });
    });
}

// Настройки - переключатели
const toggles = document.querySelectorAll('.toggle input');

// Анимации
if (toggles[0]) {
    toggles[0].addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.style.setProperty('--transition-speed', '0.3s');
        } else {
            document.body.style.setProperty('--transition-speed', '0s');
        }
    });
}

// Розовые акценты
if (toggles[1]) {
    toggles[1].addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.style.setProperty('--accent-color', '#ff69b4');
            document.documentElement.style.setProperty('--accent-light', '#ffb6c1');
        } else {
            document.documentElement.style.setProperty('--accent-color', '#888');
            document.documentElement.style.setProperty('--accent-light', '#aaa');
        }
    });
}

// Эффекты при наведении
if (toggles[2]) {
    toggles[2].addEventListener('change', (e) => {
        document.body.classList.toggle('no-hover-effects', !e.target.checked);
    });
}

// Выбор темы
document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const themeName = card.querySelector('.theme-name').textContent;

        if (themeName === 'Dark Mode') {
            document.body.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d1b2e 100%)';
        } else if (themeName === 'Light Mode') {
            document.body.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)';
        } else {
            document.body.style.background = `linear-gradient(135deg, #ffffff0a 0%, hwb(0 100% 0% / 0.062) 0%, hwb(0 100% 0% / 0.096) 0%), url('https://4kwallpapers.com/images/walls/thumbs_3t/26436.jpg')`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            document.body.style.backgroundAttachment = 'fixed';
        }
    });
});

// Браузер - функционал
let browserTabs = [];
let activeBrowserTab = 0;

// Инициализация вкладок
function initBrowserTabs() {
    browserTabs = [
        { title: 'Главная', icon: 'home', url: 'about:home' },
        { title: 'GitHub', icon: 'github', url: 'https://github.com' }
    ];
    renderBrowserTabs();
}

function renderBrowserTabs() {
    const tabsContainer = document.querySelector('.browser-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = '';

    browserTabs.forEach((tab, index) => {
        const tabEl = document.createElement('div');
        tabEl.className = 'browser-tab' + (index === activeBrowserTab ? ' active' : '');
        tabEl.innerHTML = `
            <i data-lucide="${tab.icon}"></i>
            <span>${tab.title}</span>
            <span class="tab-close">✕</span>
        `;

        tabEl.addEventListener('click', (e) => {
            if (!e.target.classList.contains('tab-close')) {
                activeBrowserTab = index;
                renderBrowserTabs();
                loadBrowserPage(tab.url);
            }
        });

        tabEl.querySelector('.tab-close').addEventListener('click', (e) => {
            e.stopPropagation();
            if (browserTabs.length > 1) {
                browserTabs.splice(index, 1);
                if (activeBrowserTab >= browserTabs.length) {
                    activeBrowserTab = browserTabs.length - 1;
                }
                renderBrowserTabs();
                loadBrowserPage(browserTabs[activeBrowserTab].url);
            }
        });

        tabsContainer.appendChild(tabEl);
    });

    // Кнопка новой вкладки
    const newTabBtn = document.createElement('div');
    newTabBtn.className = 'browser-tab-new';
    newTabBtn.innerHTML = '<i data-lucide="plus"></i>';
    newTabBtn.addEventListener('click', () => {
        browserTabs.push({ title: 'Новая вкладка', icon: 'file', url: 'about:home' });
        activeBrowserTab = browserTabs.length - 1;
        renderBrowserTabs();
        loadBrowserPage('about:home');
    });
    tabsContainer.appendChild(newTabBtn);

    lucide.createIcons();
}

function loadBrowserPage(url) {
    const viewport = document.querySelector('.browser-viewport');
    const urlInput = document.querySelector('.url-input');

    if (!viewport || !urlInput) return;

    urlInput.value = url;

    if (url === 'about:home') {
        viewport.innerHTML = `
            <div class="browser-page">
                <div class="page-hero">
                    <i data-lucide="heart" class="hero-icon"></i>
                    <h1>Добро пожаловать в Fbrowse</h1>
                    <p>Самый милый браузер в мире uwu</p>
                </div>
                <div class="quick-links">
                    <a href="#" class="quick-link" data-url="https://en.wikipedia.org">
                        <i data-lucide="book-open"></i>
                        <span>Wikipedia</span>
                    </a>
                    <a href="#" class="quick-link" data-url="https://archive.org">
                        <i data-lucide="archive"></i>
                        <span>Archive.org</span>
                    </a>
                    <a href="#" class="quick-link" data-url="https://example.com">
                        <i data-lucide="globe"></i>
                        <span>Example.com</span>
                    </a>
                    <a href="#" class="quick-link" data-url="https://github.com" data-external="true">
                        <i data-lucide="github"></i>
                        <span>GitHub</span>
                    </a>
                    <a href="#" class="quick-link" data-url="https://youtube.com" data-external="true">
                        <i data-lucide="youtube"></i>
                        <span>YouTube</span>
                    </a>
                    <a href="#" class="quick-link" data-url="https://twitter.com" data-external="true">
                        <i data-lucide="twitter"></i>
                        <span>Twitter</span>
                    </a>
                </div>
            </div>
        `;
        lucide.createIcons();

        // Добавляем обработчики для быстрых ссылок
        document.querySelectorAll('.quick-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.getAttribute('data-url');
                const isExternal = link.getAttribute('data-external') === 'true';

                if (isExternal) {
                    window.open(url, '_blank');
                } else {
                    browserTabs[activeBrowserTab].url = url;
                    browserTabs[activeBrowserTab].title = link.querySelector('span').textContent;
                    renderBrowserTabs();
                    loadBrowserPage(url);
                }
            });
        });
    } else {
        // Список сайтов, которые блокируют iframe
        const blockedSites = ['youtube.com', 'twitter.com', 'github.com', 'facebook.com', 'instagram.com', 'reddit.com'];
        const isBlocked = blockedSites.some(site => url.includes(site));

        if (isBlocked) {
            viewport.innerHTML = `
                <div class="browser-page">
                    <div class="page-hero">
                        <i data-lucide="shield-alert" class="hero-icon" style="color: #ff6b6b;"></i>
                        <h1>Сайт заблокирован</h1>
                        <p>Этот сайт не разрешает встраивание в iframe</p>
                        <button class="open-external-btn" onclick="window.open('${url}', '_blank')" style="
                            margin-top: 20px;
                            padding: 12px 32px;
                            background: linear-gradient(135deg, #ff69b4 0%, #ffb6c1 100%);
                            color: white;
                            border: none;
                            border-radius: 24px;
                            font-size: 16px;
                            font-weight: 600;
                            cursor: pointer;
                            box-shadow: 0 4px 12px rgba(255, 105, 180, 0.4);
                            transition: all 0.3s ease;
                        " onmouseover="this.style.transform='translateY(-2px) scale(1.05)'; this.style.boxShadow='0 6px 16px rgba(255, 105, 180, 0.6)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(255, 105, 180, 0.4)';">
                            <i data-lucide="external-link"></i> Открыть в новой вкладке
                        </button>
                    </div>
                </div>
            `;
            lucide.createIcons();
        } else {
            viewport.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none;"></iframe>`;
        }
    }
}

// Адресная строка
const urlInput = document.querySelector('.url-input');
const goBtn = document.querySelector('.go-btn');

if (urlInput && goBtn) {
    const navigateToUrl = () => {
        let url = urlInput.value.trim();
        if (!url.startsWith('http://') && !url.startsWith('https://') && url !== 'about:home') {
            url = 'https://' + url;
        }
        browserTabs[activeBrowserTab].url = url;
        try {
            browserTabs[activeBrowserTab].title = new URL(url).hostname;
        } catch (e) {
            browserTabs[activeBrowserTab].title = 'Новая вкладка';
        }
        renderBrowserTabs();
        loadBrowserPage(url);
    };

    goBtn.addEventListener('click', navigateToUrl);
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToUrl();
        }
    });
}

// Навигационные кнопки
const navBtns = document.querySelectorAll('.nav-btn');
if (navBtns.length >= 3) {
    // Назад
    navBtns[0].addEventListener('click', () => {
        console.log('Назад');
    });

    // Вперед
    navBtns[1].addEventListener('click', () => {
        console.log('Вперед');
    });

    // Обновить
    navBtns[2].addEventListener('click', () => {
        loadBrowserPage(browserTabs[activeBrowserTab].url);
    });
}

// Инициализация браузера
initBrowserTabs();
loadBrowserPage('about:home');

// Dock - перетаскивание иконок
let draggedDockItem = null;
let dockItems = Array.from(document.querySelectorAll('.dock-item'));

dockItems.forEach((item, index) => {
    item.draggable = true;
    item.dataset.index = index;

    item.addEventListener('dragstart', (e) => {
        draggedDockItem = item;
        item.style.opacity = '0.5';
        e.dataTransfer.effectAllowed = 'move';
    });

    item.addEventListener('dragend', (e) => {
        item.style.opacity = '1';
        draggedDockItem = null;

        // Убираем все placeholder классы
        dockItems.forEach(i => i.classList.remove('dock-placeholder'));
    });

    item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedDockItem && draggedDockItem !== item) {
            const dock = document.querySelector('.dock');
            const allItems = Array.from(dock.children);
            const draggedIndex = allItems.indexOf(draggedDockItem);
            const targetIndex = allItems.indexOf(item);

            if (draggedIndex < targetIndex) {
                dock.insertBefore(draggedDockItem, item.nextSibling);
            } else {
                dock.insertBefore(draggedDockItem, item);
            }

            // Анимация прыжка
            item.style.animation = 'dockBounce 0.3s ease';
            setTimeout(() => {
                item.style.animation = '';
            }, 300);
        }
    });

    item.addEventListener('drop', (e) => {
        e.preventDefault();
    });
});

// Галерея - lightbox
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxCounter = document.querySelector('.lightbox-counter');

let currentImageIndex = 0;
const images = Array.from(galleryItems).map(item => item.dataset.img);

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox();
    });
});

function openLightbox() {
    lightbox.classList.add('active');
    updateLightboxImage();
    lucide.createIcons();
}

function closeLightbox() {
    lightbox.classList.remove('active');
}

function updateLightboxImage() {
    lightboxImg.src = images[currentImageIndex];
    lightboxCounter.textContent = `${currentImageIndex + 1} / ${images.length}`;
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', nextImage);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', prevImage);
}

// Закрытие по клику на фон
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Навигация стрелками клавиатуры
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'ArrowRight') {
            nextImage();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'Escape') {
            closeLightbox();
        }
    }
});

// Файловый менеджер - двойной клик по файлам
document.querySelectorAll('.file-item').forEach(item => {
    item.addEventListener('dblclick', () => {
        const fileType = item.dataset.type;
        const fileSrc = item.dataset.src;

        if (fileType === 'image' && fileSrc) {
            // Открываем просмотрщик изображений
            openImageViewer(fileSrc);
        }
    });
});

// Просмотрщик изображений
function openImageViewer(imageSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxCounter = document.querySelector('.lightbox-counter');

    if (lightbox && lightboxImg) {
        lightboxImg.src = imageSrc;
        lightboxCounter.textContent = '1 / 1';
        lightbox.classList.add('active');

        // Скрываем кнопки навигации для одиночного изображения
        document.querySelector('.lightbox-prev').style.display = 'none';
        document.querySelector('.lightbox-next').style.display = 'none';

        lucide.createIcons();
    }
}

// Модифицируем функцию закрытия lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');

    // Возвращаем кнопки навигации
    document.querySelector('.lightbox-prev').style.display = 'flex';
    document.querySelector('.lightbox-next').style.display = 'flex';
}
