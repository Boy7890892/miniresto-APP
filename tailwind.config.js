// Konfigurasi Tailwind untuk CDN (harus diakses secara global oleh CDN script)
// Jika menggunakan versi CDN non-CLI, objek ini harus diakses oleh script Tailwind.
tailwind.config = {
    theme: {
        extend: {
            // Karena kita menggunakan Inter dari CDN, ini opsional
            // fontFamily: {
            //     sans: ['Inter', 'sans-serif'],
            // },
            colors: {
                // Contoh warna kustom jika ingin ditambahkan
            }
        }
    }
};
