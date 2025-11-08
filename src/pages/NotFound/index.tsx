export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Halaman tidak ditemukan</p>
      <a
        href="/"
        className="px-4 py-2 bg-primary text-white rounded-lg transition"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
