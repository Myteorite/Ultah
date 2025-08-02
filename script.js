// Ambil elemen-elemen dari HTML
const blowCandlesButton = document.getElementById('blowCandlesButton');
const candlesArea = document.getElementById('candlesArea');
const birthdayNameText = document.getElementById('birthdayNameText');
const birthdayAgeText = document.getElementById('birthdayAgeText');
const messageArea = document.getElementById('messageArea');
const cakeSectionContainer = document.querySelector('.cake-section-container');
const bookView = document.getElementById('bookView');
const backToCakeButton = document.getElementById('backToCakeButton');

const initialCardView = document.getElementById('initialCardView');
const birthdayCard = document.querySelector('.birthday-card');
const switchToBookButton = document.getElementById('switchToBookButton');

// Variabel untuk state
let candleCount = 0;
let candlesBlown = false;
let audioPlayer;
let isBookInitialized = false;
let bookLeaves = [];
let currentLeafIndex = 0;

// Fungsi untuk membuat satu lilin
function createCandle() {
    const candle = document.createElement('div');
    candle.className = 'candle';
    const flame = document.createElement('div');
    flame.className = 'flame';
    candle.appendChild(flame);
    const smoke = document.createElement('div');
    smoke.className = 'smoke';
    candle.appendChild(smoke);
    return candle;
}

// Fungsi untuk inisialisasi tampilan kue
function initializeCake() {
    const name = "Sayangkuu";
    const age = 20;

    candleCount = age;
    candlesBlown = false;
    blowCandlesButton.disabled = false;
    blowCandlesButton.style.display = 'block';
    candlesArea.innerHTML = '';

    if (isBookInitialized) {
        const totalLeaves = bookLeaves.length;
        bookLeaves.forEach((leaf, index) => {
            leaf.classList.remove('flipped');
            leaf.style.zIndex = totalLeaves - index;
        });
        currentLeafIndex = 0;
    }

    for (let i = 0; i < candleCount; i++) {
        candlesArea.appendChild(createCandle());
    }

    birthdayNameText.textContent = `HBD ${name}!`;
    birthdayAgeText.textContent = `Ke-${age}`;
    
    messageArea.textContent = ""; 
    
    bookView.classList.add('hidden');
    backToCakeButton.classList.add('hidden');
    cakeSectionContainer.classList.remove('hidden');
    initialCardView.classList.add('hidden');
    birthdayCard.classList.remove('flipped');

    if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
    }
    isBookInitialized = false;
}

// Fungsi untuk memutar musik
function playMusicFromUrl() {
    const musicUrl = "https://github.com/Myteorite/Ultah/blob/0d729e84f9e3664ace03c5f92e5b9710613f16b8/Media/Musik/Sal_Priadi_Serta_Mulia.mp3?raw=true";
    if (musicUrl) {
        if (audioPlayer) {
            audioPlayer.pause();
        }
        audioPlayer = new Audio(musicUrl);
        audioPlayer.play().catch(error => {
            console.error("Error memainkan musik:", error);
            messageArea.textContent = "Gagal memutar musik.";
            messageArea.style.color = "#ef4444";
        });
    }
}

// Fungsi yang dijalankan saat tombol "Tiup Lilin" ditekan
function proceedWithBlowingCandles() {
    if (candlesBlown) return;

    const flames = candlesArea.querySelectorAll('.flame');
    const smokes = candlesArea.querySelectorAll('.smoke');

    if (flames.length > 0) {
        flames.forEach(flame => flame.classList.add('out'));
        smokes.forEach(smoke => smoke.classList.add('visible'));

        candlesBlown = true;
        blowCandlesButton.disabled = true;
        blowCandlesButton.style.display = 'none'; 

        messageArea.textContent = `Selamat Ulang Tahun, ${birthdayNameText.textContent.replace("HBD ", "").replace("!", "")}! 🎉🎂`;
        messageArea.style.color = "#ffff";

        setTimeout(() => {
            playMusicFromUrl();
            setTimeout(() => {
                initialCardView.classList.remove('hidden');
                messageArea.textContent = "Ada kejutan lain untukmu! Sentuh kartu di atas.";
                messageArea.style.color = "#ffff";
            }, 1000);
        }, 700);
    }
}

// Fungsi untuk inisialisasi tampilan buku
function initializeBookView() {
    if (isBookInitialized || !bookView) return;
    bookLeaves = Array.from(bookView.querySelectorAll('.book .book-leaf'));
    const totalLeaves = bookLeaves.length;

    bookLeaves.forEach((leaf, index) => {
        leaf.classList.remove('flipped');
        leaf.style.zIndex = totalLeaves - index;

        const frontFace = leaf.querySelector('.page-front');
        const backFace = leaf.querySelector('.page-back');

        if (frontFace) {
            frontFace.addEventListener('click', function(event) {
                if (event.target.closest('.action-button')) return;
                if (index === currentLeafIndex && !leaf.classList.contains('flipped')) {
                    if (currentLeafIndex < totalLeaves - 1) {
                        leaf.classList.add('flipped');
                        leaf.style.zIndex = totalLeaves + index;
                        currentLeafIndex++;
                    }
                }
            });
        }
        if (backFace) {
            backFace.addEventListener('click', function(event) {
                if (event.target.closest('.action-button')) return;
                if (index === (currentLeafIndex - 1) && leaf.classList.contains('flipped')) {
                    const leafToUnflip = bookLeaves[currentLeafIndex - 1];
                    leafToUnflip.classList.remove('flipped');
                    leafToUnflip.style.zIndex = totalLeaves - (currentLeafIndex - 1);
                    currentLeafIndex--;
                }
            });
        }
    });
    isBookInitialized = true;
}

// Event Listeners untuk tombol-tombol
blowCandlesButton.addEventListener('click', proceedWithBlowingCandles);

backToCakeButton.addEventListener('click', () => {
    bookView.classList.add('hidden');
    backToCakeButton.classList.add('hidden');
    initializeCake();
});

// Event Listener untuk Kartu
birthdayCard.addEventListener('click', (event) => {
    if (!event.target.closest('#switchToBookButton')) {
        birthdayCard.classList.toggle('flipped');
    }
});

switchToBookButton.addEventListener('click', () => {
    cakeSectionContainer.classList.add('hidden');
    bookView.classList.remove('hidden');
    backToCakeButton.classList.remove('hidden');
    initializeBookView();
});

// Pastikan kue diinisialisasi saat halaman selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    initializeCake();

});

