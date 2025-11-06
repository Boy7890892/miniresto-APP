// app.js

// 3. Deklarasi array & ambil elemen DOM
// Array menyimpan daftar menu
let daftarMenu = [];
// Array menyimpan daftar pesanan
// Item: { id, nama, harga, deskripsi, foto, jumlah }
let daftarPesanan = [];

// Ambil elemen DOM Form
const formMenu = document.getElementById('formMenu');
const inputNama = document.getElementById('nama');
const inputHarga = document.getElementById('harga');
const inputDeskripsi = document.getElementById('deskripsi');
const inputFoto = document.getElementById('foto');

// Ambil elemen DOM Daftar Menu dan Pesanan
const menuList = document.getElementById('menuList');
const orderList = document.getElementById('orderList');
const totalHarga = document.getElementById('totalHarga');
const checkoutButton = document.getElementById('checkoutButton');
const clearCartButton = document.getElementById('clearCartButton');

// Ambil elemen DOM Modal
const alertModal = document.getElementById('alertModal');
const modalMessage = document.getElementById('modalMessage');
const modalCloseButton = document.getElementById('modalCloseButton');

/**
 * Fungsi untuk menampilkan Modal (pengganti alert())
 * @param {string} message - Pesan yang akan ditampilkan
 */
function showAlert(message) {
    modalMessage.textContent = message;
    alertModal.classList.remove('hidden');
    alertModal.classList.add('flex');
}

modalCloseButton.addEventListener('click', () => {
    alertModal.classList.add('hidden');
    alertModal.classList.remove('flex');
});

// Fungsi untuk format harga ke Rupiah
const formatRupiah = (harga) => {
    return harga.toLocaleString('id-ID');
};

// 3. Tangani submit form & buat object makanan
formMenu.addEventListener('submit', function(e) {
    e.preventDefault(); // agar halaman tidak reload

    const nama = inputNama.value.trim();
    const harga = parseInt(inputHarga.value);
    const deskripsi = inputDeskripsi.value.trim();
    const foto = inputFoto.value.trim() ||
        'https://placehold.co/400x300/e0e0e0/505050?text=No+Image';

    // Validasi sederhana
    if (!nama || isNaN(harga) || harga <= 0) {
        showAlert('Nama dan harga harus diisi dengan benar! Pastikan harga lebih dari Rp 0.');
        return;
    }

    // Buat object makanan
    const makanan = {
        id: Date.now(), // id sederhana unik
        nama,
        harga,
        deskripsi,
        foto
    };

    // Tambahkan ke array
    daftarMenu.push(makanan);

    // Reset form
    formMenu.reset();

    // Panggil fungsi render
    renderMenu();
});

// 4. Tampilkan Daftar Menu di DOM (renderMenu)
function renderMenu() {
    menuList.innerHTML = ''; // kosongkan dahulu
    if (daftarMenu.length === 0) {
         menuList.innerHTML = '<p class="text-gray-500 italic lg:col-span-3">Belum ada menu yang ditambahkan.</p>';
    }

    daftarMenu.forEach(makanan => {
        const card = document.createElement('div');
        card.className = 'bg-gray-50 rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition duration-200 border border-gray-100';
        card.innerHTML = `
            <img src="${makanan.foto}" alt="${makanan.nama}" onerror="this.onerror=null; this.src='https://placehold.co/400x300/e0e0e0/505050?text=Image+Error';"
                class="h-40 w-full object-cover">
            <div class="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 class="font-bold text-lg text-gray-900">${makanan.nama}</h3>
                    <p class="text-sm text-gray-500 h-10 overflow-hidden">${makanan.deskripsi || 'Tidak ada deskripsi.'}</p>
                </div>
                <p class="font-extrabold text-xl text-indigo-600 mt-2">Rp ${formatRupiah(makanan.harga)}</p>
            </div>
            <button data-id="${makanan.id}"
                class="btn-add-order bg-green-500 text-white font-semibold py-3 hover:bg-green-600 transition duration-200">
                Tambah ke Pesanan
            </button>
        `;

        // Tambahkan event listener pada tombol "Tambah ke Pesanan"
        const btn = card.querySelector('.btn-add-order');
        btn.addEventListener('click', () => tambahPesanan(makanan));

        menuList.appendChild(card);
    });
    renderPesanan(); // Pastikan pesanan juga terupdate jika ada perubahan menu
}

// 5. Fungsi tambahPesanan
function tambahPesanan(makanan) {
    // cek apakah sudah ada di daftarPesanan (berdasarkan id)
    const foundIndex = daftarPesanan.findIndex(item => item.id === makanan.id);

    if (foundIndex > -1) {
        // Jika sudah ada, tambahkan jumlah
        daftarPesanan[foundIndex].jumlah += 1;
    } else {
        // Jika belum ada, tambahkan object baru dengan properti 'jumlah'
        daftarPesanan.push({ ...makanan, jumlah: 1 });
    }
    renderPesanan();
}

// 6. Render Daftar Pesanan & Hapus Pesanan
function renderPesanan() {
    orderList.innerHTML = '';
    let total = 0;

    if (daftarPesanan.length === 0) {
        orderList.innerHTML = '<li class="text-gray-500 italic py-2">Keranjang pesanan kosong.</li>';
        checkoutButton.disabled = true;
        clearCartButton.disabled = true;
        totalHarga.textContent = `Total: Rp 0`;
        return;
    }

    daftarPesanan.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'flex justify-between items-center py-3';

        // Class untuk tombol aksi
        const btnClass = 'text-white px-2 py-1 rounded-md text-sm font-semibold transition duration-150';

        li.innerHTML = `
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-gray-900 truncate">${item.nama}</p>
                <p class="text-xs text-gray-500">Rp ${formatRupiah(item.harga)}</p>
            </div>
            <div class="flex items-center gap-2">
                <p class="font-bold text-gray-800 w-16 text-center">x${item.jumlah}</p>
                <button class="bg-yellow-500 hover:bg-yellow-600 ${btnClass} decrease" data-id="${item.id}">-</button>
                <button class="bg-yellow-500 hover:bg-yellow-600 ${btnClass} increase" data-id="${item.id}">+</button>
                <button class="bg-red-500 hover:bg-red-600 ${btnClass} delete" data-id="${item.id}">Hapus</button>
            </div>
        `;

        // Event Listeners dinamis untuk setiap item pesanan
        li.querySelector('.delete').addEventListener('click', () => hapusPesanan(item.id));
        li.querySelector('.increase').addEventListener('click', () => ubahJumlah(item.id, 1));
        li.querySelector('.decrease').addEventListener('click', () => ubahJumlah(item.id, -1));

        total += item.harga * item.jumlah;
        orderList.appendChild(li);
    });

    // Update total dan status tombol
    totalHarga.textContent = `Total: Rp ${formatRupiah(total)}`;
    checkoutButton.disabled = false;
    clearCartButton.disabled = false;
}

// Fungsi hapus & ubah jumlah
function hapusPesanan(id) {
    // Menghapus item dari array
    daftarPesanan = daftarPesanan.filter(item => item.id !== id);
    renderPesanan();
}

function ubahJumlah(id, delta) {
    const item = daftarPesanan.find(i => i.id === id);
    if (!item) return;

    item.jumlah += delta;

    if (item.jumlah <= 0) {
        // jika jumlah 0 atau kurang, hapus item
        hapusPesanan(id);
    } else {
        renderPesanan();
    }
}

// Listener untuk tombol "Selesaikan Pesanan"
checkoutButton.addEventListener('click', () => {
    const total = daftarPesanan.reduce((sum, item) => sum + item.harga * item.jumlah, 0);
    if (total > 0) {
        showAlert(`Pesanan Anda telah diproses! Total yang harus dibayar: Rp ${formatRupiah(total)}. Terima kasih!`);
        // Reset pesanan setelah checkout
        daftarPesanan = [];
        renderPesanan();
        renderMenu(); 
    }
});

// Listener untuk tombol "Kosongkan Keranjang"
clearCartButton.addEventListener('click', () => {
    if (daftarPesanan.length > 0) {
        daftarPesanan = [];
        showAlert('Keranjang pesanan telah dikosongkan.');
        renderPesanan();
    }
});

// Inisialisasi: panggil renderMenu dan renderPesanan saat halaman dimuat
window.onload = () => {
    renderMenu();
    renderPesanan();
};
