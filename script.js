document.addEventListener('DOMContentLoaded', function() {
    // --- Seleksi Elemen ---
    const giftView = document.getElementById('giftView');
    const giftIconClickable = document.getElementById('giftIconClickable');
    const initialCardView = document.getElementById('initialCardView');
    const bookView = document.getElementById('bookView');
    
    const birthdaySong = document.getElementById('birthdaySong');
    const birthdayCard = document.querySelector('.birthday-card'); // Target untuk flip kartu
    const switchToBookButton = document.getElementById('switchToBookButton');
    
    let isBookInitialized = false;
    let bookLeaves = [];
    let currentLeafIndex = 0;

    // --- Pemeriksaan Elemen Awal (untuk debugging jika ada masalah) ---
    if (!giftView) console.error("Elemen #giftView tidak ditemukan!");
    if (!giftIconClickable) console.error("Elemen #giftIconClickable tidak ditemukan!");
    if (!initialCardView) console.error("Elemen #initialCardView tidak ditemukan!");
    if (!bookView) console.error("Elemen #bookView tidak ditemukan!");
    if (!birthdaySong) console.error("Elemen audio #birthdaySong tidak ditemukan!");
    if (!birthdayCard) console.error("Elemen .birthday-card tidak ditemukan!");
    if (!switchToBookButton) console.error("Elemen #switchToBookButton tidak ditemukan!");


    // --- Event Listener untuk Ikon Kado (Memulai Aplikasi) ---
    if (giftIconClickable) {
        giftIconClickable.addEventListener('click', function() {
            // 1. Putar musik
            if (birthdaySong) {
                birthdaySong.currentTime = 0; // Pastikan mulai dari awal
                birthdaySong.play().catch(error => {
                    console.warn("Gagal memulai musik setelah klik kado:", error);
                });
            }

            // 2. Sembunyikan tampilan kado & tampilkan kartu ucapan
            if (giftView) giftView.classList.remove('active-view');
            if (initialCardView) initialCardView.classList.add('active-view');
        });
    }

    // --- Event Listener untuk Flip Kartu Ucapan ---
    if (birthdayCard) {
        // Menggunakan parent dari card-front/card-inside untuk event listener flip
        // agar tidak terpicu oleh tombol di dalamnya.
        birthdayCard.addEventListener('click', function(event) {
            // Pastikan yang diklik bukan tombol action di dalam kartu
            if (!event.target.classList.contains('action-button') && 
                !event.target.parentElement.classList.contains('action-button')) {
                this.classList.toggle('flipped');
            }
        });
    }

    // --- Event Listener untuk Tombol Pindah ke Buku ---
    if (switchToBookButton) {
        switchToBookButton.addEventListener('click', function(event) {
            event.stopPropagation(); // Hentikan event agar tidak trigger flip kartu

            if (initialCardView) initialCardView.classList.remove('active-view');
            if (bookView) bookView.classList.add('active-view');
            
            if (!isBookInitialized) {
                initializeBookView();
            }
        });
    }

    // --- Fungsi Inisialisasi dan Logika Buku ---
    function initializeBookView() {
        if (isBookInitialized || !bookView) return;

        bookLeaves = Array.from(bookView.querySelectorAll('.book .book-leaf'));
        const totalLeaves = bookLeaves.length;

        bookLeaves.forEach((leaf, index) => {
            leaf.classList.remove('flipped'); 
            leaf.style.zIndex = totalLeaves - index; // Daun teratas (kanan) punya z-index tertinggi
        });
        
        currentLeafIndex = 0; // Mulai dari sampul (leaf-0 adalah yang paling kanan/atas)

        bookLeaves.forEach((leaf, index) => {
            const frontFace = leaf.querySelector('.page-front');
            const backFace = leaf.querySelector('.page-back');

            if (frontFace) {
                frontFace.addEventListener('click', function() {
                    // Hanya flip jika ini adalah halaman kanan yang aktif dan belum di-flip
                    if (index === currentLeafIndex && !leaf.classList.contains('flipped')) {
                        // Jangan flip halaman terakhir (sampul belakang) sebagai halaman "maju"
                        if (currentLeafIndex < totalLeaves - 1) { 
                            leaf.classList.add('flipped');
                            leaf.style.zIndex = totalLeaves + index + 1; // Pindahkan ke tumpukan kiri dengan z-index tinggi
                            currentLeafIndex++;
                        }
                    }
                });
            }

            if (backFace) {
                backFace.addEventListener('click', function() {
                    // Hanya un-flip jika ini adalah halaman kiri yang aktif (sudah di-flip)
                    // `index` di sini adalah leaf yang diklik (yang sisi kirinya adalah backFace ini)
                    // `currentLeafIndex` menunjuk ke *next* leaf yang akan di-flip (di sisi kanan)
                    // Jadi, leaf yang sisi kirinya diklik adalah `bookLeaves[currentLeafIndex - 1]`
                    if (index === (currentLeafIndex - 1) && leaf.classList.contains('flipped')) {
                        currentLeafIndex--; // Mundur ke leaf sebelumnya
                        const leafToUnflip = bookLeaves[currentLeafIndex]; // Ini adalah leaf yang sama dengan `leaf`
                        leafToUnflip.classList.remove('flipped');
                        leafToUnflip.style.zIndex = totalLeaves - currentLeafIndex; // Kembalikan ke tumpukan kanan
                    }
                });
            }
        });
        
        isBookInitialized = true;
    }
});