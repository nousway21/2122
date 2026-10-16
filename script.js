
// Vaqt hisoblagich
const startDate = new Date("2026-09-26T00:00:00");

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    if (diff > 0) {
        const seconds = Math.floor(diff / 1000) % 60;
        const minutes = Math.floor(diff / (1000 * 60)) % 60;
        const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24)) % 30;
        const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.436875)) % 12;
        const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

        document.getElementById('years').innerText = years;
        document.getElementById('months').innerText = months;
        document.getElementById('days').innerText = days;
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
}

setInterval(updateCounter, 1000);
updateCounter();


// Audio controller
const audio = document.getElementById('bg-audio');
const mainPlayBtn = document.getElementById('main-play-icon');
const vinylDisc = document.getElementById('vinyl-disc');
const playingWave = document.getElementById('playing-wave');

function togglePlay() {
    if (audio.paused) {
        audio.play().then(() => {
            mainPlayBtn.classList.remove('fa-play');
            mainPlayBtn.classList.add('fa-pause');
            vinylDisc.classList.add('animate-spin-slow');
            playingWave.classList.remove('hidden');
        }).catch(e => console.log("Audio error:", e));
    } else {
        audio.pause();
        mainPlayBtn.classList.remove('fa-pause');
        mainPlayBtn.classList.add('fa-play');
        vinylDisc.classList.remove('animate-spin-slow');
        playingWave.classList.add('hidden');
    }
}

audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = progressPercent + '%';

        let curM = Math.floor(audio.currentTime / 60);
        let curS = Math.floor(audio.currentTime % 60);

        document.getElementById('current-time').innerText =
            curM + ':' + (curS < 10 ? '0' : '') + curS;

        let durM = Math.floor(audio.duration / 60);
        let durS = Math.floor(audio.duration % 60);

        document.getElementById('duration-time').innerText =
            durM + ':' + (durS < 10 ? '0' : '') + durS;
    }
});

function setAudioProgress(event) {
    const container = document.getElementById('progress-container');

    if (audio.duration) {
        audio.currentTime =
            (event.offsetX / container.clientWidth) * audio.duration;
    }
}

function adjustVolume(val) {
    audio.volume = val;
}

function toggleCard(card) {
    const text = card.querySelector('.hidden-text');
    text.classList.toggle('line-clamp-3');
}


/* ===== LOCALSTORAGE SAQLASH LOGIKASI ===== */

// 1. Fotogalereya rasmlarini saqlash
function loadSavedImages() {
    const savedImages = JSON.parse(
        localStorage.getItem('user_gallery_images') || '[]'
    );

    const galleryGrid = document.getElementById('gallery-grid');

    savedImages.forEach(imgUrl => {
        const newDiv = document.createElement('div');

        newDiv.className =
            'glass-card rounded-2xl overflow-hidden group relative h-64 border border-rose-500/20';

        newDiv.innerHTML = `
            <img src="${imgUrl}" alt="Yangi Xotira" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
            <div class="absolute bottom-4 left-4 right-4">
                <span class="text-[10px] uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">Yangi Xotira</span>
                <h4 class="font-serif text-sm font-bold text-white mt-1">Bizning Lahza</h4>
                <p class="text-xs text-gray-300 font-light">Unutilmas kun</p>
            </div>
        `;

        galleryGrid.prepend(newDiv);
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgUrl = e.target.result;

            // Saqlash
            const savedImages = JSON.parse(
                localStorage.getItem('user_gallery_images') || '[]'
            );

            savedImages.push(imgUrl);

            localStorage.setItem(
                'user_gallery_images',
                JSON.stringify(savedImages)
            );

            // Ekran interfeysiga joylash
            const galleryGrid = document.getElementById('gallery-grid');
            const newDiv = document.createElement('div');

            newDiv.className =
                'glass-card rounded-2xl overflow-hidden group relative h-64 border border-rose-500/20';

            newDiv.innerHTML = `
                <img src="${imgUrl}" alt="Yangi Xotira" class="w-full h-full object-cover group-hover:scale-110 transition duration-500">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>
                <div class="absolute bottom-4 left-4 right-4">
                    <span class="text-[10px] uppercase tracking-wider text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800/50">Yangi Xotira</span>
                    <h4 class="font-serif text-sm font-bold text-white mt-1">Bizning Lahza</h4>
                    <p class="text-xs text-gray-300 font-light">Unutilmas kun</p>
                </div>
            `;

            galleryGrid.prepend(newDiv);
        };

        reader.readAsDataURL(file);
    }
}


// 2. Rejalar va orzularni saqlash
const defaultPlans = [
    {
        text: "Tanishish va birinchi esda qolarli kunni o'tkazish (26.09.2026)",
        checked: true
    },
    {
        text: "Birgalikda sevimli kofemizni ichish",
        checked: false
    },
    {
        text: "Kechki shahar bo'ylab romantik sayr qilish",
        checked: false
    }
];

function loadPlans() {
    const plans =
        JSON.parse(localStorage.getItem('user_bucket_plans')) || defaultPlans;

    renderPlans(plans);
}

function savePlans(plans) {
    localStorage.setItem('user_bucket_plans', JSON.stringify(plans));
}

function renderPlans(plans) {
    const container = document.getElementById('bucket-list');
    container.innerHTML = '';

    plans.forEach((plan, index) => {
        const label = document.createElement('label');

        label.className =
            'flex items-center p-3 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 border border-rose-500/10 cursor-pointer transition';

        label.innerHTML = `
            <input type="checkbox" ${plan.checked ? 'checked' : ''} onchange="togglePlanCheck(${index})" class="w-4 h-4 text-rose-500 rounded border-gray-600 bg-slate-800">
            <span class="ml-3 text-sm ${plan.checked ? 'line-through text-rose-300/80' : 'text-gray-200'}">${plan.text}</span>
        `;

        container.appendChild(label);
    });
}

function togglePlanCheck(index) {
    const plans =
        JSON.parse(localStorage.getItem('user_bucket_plans')) || defaultPlans;

    plans[index].checked = !plans[index].checked;

    savePlans(plans);
    renderPlans(plans);
}

function addNewPlan() {
    const input = document.getElementById('new-plan-input');
    const text = input.value.trim();

    if (text) {
        const plans =
            JSON.parse(localStorage.getItem('user_bucket_plans')) || defaultPlans;

        plans.push({
            text: text,
            checked: false
        });

        savePlans(plans);
        renderPlans(plans);

        input.value = '';
    }
}


// Sahifa yuklanganda mavjud ma'lumotlarni o'qib olish
window.addEventListener('DOMContentLoaded', () => {
    loadSavedImages();
    loadPlans();
});


// Shahruza romantik sahna funksiyalari
function openLoveScene() {
    const scene = document.getElementById('love-scene');

    document.getElementById('love-start-card').style.display = 'block';
    document.getElementById('love-letter').hidden = true;
    document.getElementById('love-fireworks').innerHTML = '';

    scene.classList.add('love-scene-visible');
}

function closeLoveScene() {
    const scene = document.getElementById('love-scene');
    scene.classList.remove('love-scene-visible');
}

function startLoveFireworksAndLetter() {
    document.getElementById('love-start-card').style.display = 'none';
    document.getElementById('love-letter').hidden = false;

    const colors = [
        '#f43f5e',
        '#ec4899',
        '#a855f7',
        '#fbbf24',
        '#38bdf8',
        '#ffffff'
    ];

    const container = document.getElementById('love-fireworks');

    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const fx = Math.random() * 80 + 10;
            const fy = Math.random() * 60 + 20;

            const firework = document.createElement('div');
            firework.className = 'love-firework';

            firework.style.setProperty('--fx', fx + '%');
            firework.style.setProperty('--fy', fy + '%');

            for (let j = 0; j < 36; j++) {
                const spark = document.createElement('div');
                spark.className = 'spark';

                const angle = (j * 10) + 'deg';
                const distance = (Math.random() * 120 + 60) + 'px';
                const color = colors[
                    Math.floor(Math.random() * colors.length)
                ];

                spark.style.setProperty('--angle', angle);
                spark.style.setProperty('--distance', distance);
                spark.style.setProperty('--fc', color);
                spark.style.setProperty(
                    '--delay',
                    (Math.random() * 0.2) + 's'
                );

                firework.appendChild(spark);
            }

            container.appendChild(firework);
        }, i * 300);
    }
}


// Fon zarrachalari
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 1;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5
            ? 'rgba(244, 63, 94, '
            : 'rgba(236, 72, 153, ';
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;

        if (this.y < -20) {
            this.y = canvas.height + 20;
            this.x = Math.random() * canvas.width;
        }
    }

    draw() {
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();

        let d = this.size;

        ctx.moveTo(this.x, this.y);
        ctx.arc(this.x - d / 2, this.y - d / 2, d / 2, Math.PI, 0, false);
        ctx.arc(this.x + d / 2, this.y - d / 2, d / 2, Math.PI, 0, false);
        ctx.lineTo(this.x, this.y + d);
        ctx.closePath();
        ctx.fill();
    }
}

for (let i = 0; i < 25; i++) {
    hearts.push(new HeartParticle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    hearts.forEach(h => {
        h.update();
        h.draw();
    });

    requestAnimationFrame(animateCanvas);
}

animateCanvas();
