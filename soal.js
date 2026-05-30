const questions = [
  // Soal 1
  {
    question: "Struktur dasar dokumen HTML diawali dengan...",
    options: { 
      A: "&lt;body&gt;", 
      B: "&lt;head&gt;", 
      C: "&lt;!DOCTYPE html&gt;", 
      D: "&lt;title&gt;", 
      E: "&lt;script&gt;" },
    answer: "C"
  },
  // Soal 2
  {
    question: "Tag untuk membuat hyperlink pada HTML adalah...",
    options: { 
      A: "&lt;img&gt;", 
      B: "&lt;table&gt;", 
      C: "&lt;link&gt;", 
      D: "&lt;a&gt;", 
      E: "&lt;href&gt;" },
    answer: "D"
  },
  // Soal 3
  {
    question: "Tag yang digunakan untuk menampilkan gambar pada HTML adalah...",
    options: { 
      A: "&lt;image&gt;", 
      B: "&lt;img&gt;", 
      C: "&lt;picture&gt;", 
      D: "&lt;src&gt;", 
      E: "&lt;media&gt;" },
    answer: "B"
  },
  // Soal 4
  {
    question: "Properti CSS untuk mengubah warna latar belakang adalah...",
    options: { 
      A: "bgcolor", 
      B: "background-color", 
      C: "color-background", 
      D: "background-image", 
      E: "bg-image" },
    answer: "B"
  },
  // Soal 5
  {
    question: "Penulisan output JavaScript yang benar adalah...",
    options: { 
      A: 'echo("Halo")', 
      B: 'print("Halo")', 
      C: 'console.log("Halo")', 
      D: 'System.out.println("Halo")', 
      E: 'cout &lt;&lt; "Halo"' },
    answer: "C"
  },
  // Soal 6
  {
    question: "Query SQL untuk menampilkan seluruh data dari tabel siswa adalah...",
    options: { 
      A: "SHOW * FROM siswa;", 
      B: "GET * FROM siswa;", 
      C: "SELECT * FROM siswa;", 
      D: "DISPLAY * FROM siswa;", 
      E: "OPEN * siswa;" },
    answer: "C"
  },
  // Soal 7
  {
    question: "Server lokal yang sering digunakan untuk menjalankan PHP dan MySQL adalah...",
    options: { 
      A: "Photoshop", 
      B: "XAMPP", 
      C: "Android Studio", 
      D: "Figma", 
      E: "Laravel" },
    answer: "B"
  },
  // Soal 8
  {
    question: "Bahasa PHP dijalankan di sisi...",
    options: { 
      A: "Client", 
      B: "Browser", 
      C: "Server", 
      D: "User", 
      E: "Front-end" },
    answer: "C"
  },
  // Soal 9
  {
    question: "Fungsi echo pada PHP digunakan untuk...",
    options: { 
      A: "menghapus data", 
      B: "menampilkan output", 
      C: "membuat tabel", 
      D: "menghubungkan database", 
      E: "menjalankan server" },
    answer: "B"
  },
  // Soal 10
  {
    question: "Variabel dalam PHP diawali dengan simbol...",
    options: { 
      A: "#", 
      B: "v", 
      C: "%", 
      D: "$", 
      E: "@" },
    answer: "D"
  },
  // Soal 11
  {
    question: "Atribut src pada HTML digunakan untuk...",
    options: { 
      A: "menentukan warna", 
      B: "menentukan tujuan link", 
      C: "menentukan sumber file", 
      D: "menentukan ukuran font", 
      E: "menentukan tabel" },
    answer: "C"
  },
  // Soal 12
  {
    question: "Ekstensi file PHP adalah...",
    options: { 
      A: ".html", 
      B: ".css", 
      C: ".js", 
      D: ".sql", 
      E: ".php" },
    answer: "E"
  },
  // Soal 13
  {
    question: "Fungsi date() pada PHP digunakan untuk...",
    options: { 
      A: "menghapus data", 
      B: "menampilkan tanggal dan waktu", 
      C: "membuat tabel", 
      D: "menjalankan query", 
      E: "menutup koneksi" },
    answer: "B"
  },
  // Soal 14
  {
    question: "Bahasa yang digunakan untuk mempercantik tampilan website adalah...",
    options: { 
      A: "SQL", 
      B: "PHP", 
      C: "CSS", 
      D: "MySQL", 
      E: "Python" },
    answer: "C"
  },
  // Soal 15
  {
    question: "Tag HTML untuk membuat heading terbesar adalah...",
    options: { 
      A: "&lt;h1&gt;", 
      B: "&lt;head&gt;", 
      C: "&lt;title&gt;", 
      D: "&lt;h6&gt;", 
      E: "&lt;header&gt;" },
    answer: "A"
  },
  // Soal 16
  {
    question: "Query SQL untuk menghapus data adalah...",
    options: { 
      A: "REMOVE", 
      B: "ERASE", 
      C: "DELETE", 
      D: "DROP", 
      E: "CLEAR" },
    answer: "C"
  },
  // Soal 17
  {
    question: "Query SQL untuk mengubah data adalah...",
    options: { 
      A: "CHANGE", 
      B: "ALTER", 
      C: "MODIFY", 
      D: "UPDATE", 
      E: "EDIT" },
    answer: "D"
  },
  // Soal 18
  {
    question: "phpMyAdmin digunakan untuk...",
    options: { 
      A: "Mendesain tampilan web", 
      B: "Mengelola database MySQL melalui browser", 
      C: "Membuat animasi", 
      D: "Menjalankan JavaScript", 
      E: "Membuat game" },
    answer: "B"
  },
  // Soal 19
  {
    question: "Untuk membuka phpMyAdmin melalui browser biasanya menggunakan alamat...",
    options: { 
      A: "localhost/phpmyadmin", 
      B: "php/admin", 
      C: "localhost/database", 
      D: "127.0.0.1/mysql", 
      E: "xampp/php" },
    answer: "A"
  },
  // Soal 20
  {
    question: "Tag HTML untuk membuat input teks adalah...",
    options: { 
      A: "&lt;text&gt;", 
      B: "&lt;textbox&gt;", 
      C: '&lt;input type="text"&gt;', 
      D: '&lt;textarea type="text"&gt;', 
      E: "&lt;table&gt;" },
    answer: "C"
  }
];