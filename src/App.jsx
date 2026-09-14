import { useRef, useState } from "react";
import { removeBackground } from "@imgly/background-removal";

function App() {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [originalUrl, setOriginalUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState(1);

  const chooseFile = () => inputRef.current?.click();

  const handleFile = (selectedFile) => {
    setError("");
    setResultUrl("");
    setSelectedOption(1);
    if (!selectedFile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Format tidak didukung. Gunakan JPG, PNG, atau WEBP.");
      return;
    }

    const maxSize = 15 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError("Ukuran foto terlalu besar. Maksimal 15 MB.");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
reader.onload = () => setOriginalUrl(reader.result);
reader.readAsDataURL(selectedFile);

  const handleInputChange = (event) => handleFile(event.target.files?.[0]);

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const processImage = async () => {
    if (!file) return;
    setProcessing(true);
    setError("");
    setProgress(0);
    setResultUrl("");

    try {
      const resultBlob = await removeBackground(file, {
        output: { format: "image/png", quality: 1 },
        progress: (_key, current, total) => {
          if (total > 0) setProgress(Math.round((current / total) * 100));
        }
      });

      setResultUrl(URL.createObjectURL(resultBlob));
      setProgress(100);
    } catch (err) {
  console.error(err);
  setError(`Gagal: ${err?.message || err}`);
  }
    } finally {
      setProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!resultUrl) return;
    const link = document.createElement("a");
    link.href = resultUrl;
    link.download = "fototanpabg.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const reset = () => {
    setFile(null);
    setOriginalUrl("");
    setResultUrl("");
    setError("");
    setProgress(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo"><span className="logo-icon">✦</span>FotoTanpaBG</div>
        <nav>
          <a href="#beranda">Beranda</a>
          <a href="#cara">Cara Pakai</a>
          <a href="#tentang">Tentang</a>
        </nav>
      </header>

      <main>
        <section className="hero" id="beranda">
          <div className="hero-text">
            <div className="badge">AI Background Removal</div>
            <h1>Ubah Foto Menjadi<span> Tanpa Background</span></h1>
            <p>Hapus background foto dengan mudah untuk membuat figur, profil, avatar, presentasi, poster, dan berbagai kebutuhan kreatif.</p>
          </div>

          {!file && (
            <div className="upload-card" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
              <div className="upload-icon">↑</div>
              <h2>Upload Foto Anda</h2>
              <p>Seret dan lepas foto di sini, atau pilih dari perangkat Anda.</p>
              <button className="primary-button" onClick={chooseFile}>Pilih Foto</button>
              <small>JPG, PNG, atau WEBP • Maks. 15 MB</small>
              <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleInputChange} hidden />
            </div>
          )}

          {file && (
            <section className="workspace">
              <div className="workspace-grid">
                <div className="preview-card">
                  <div className="card-title">Foto Asli</div>
                  <div className="image-preview"><img src={originalUrl} alt="Foto asli" /></div>
                </div>

                <div className="preview-card">
                  <div className="card-title">Hasil</div>
                  <div className="image-preview checkerboard">
                    {resultUrl ? (
                      <img src={resultUrl} alt="Foto tanpa background" />
                    ) : (
                      <div className="empty-result">
                        {processing ? (
                          <>
                            <div className="spinner"></div>
                            <strong>Sedang memproses...</strong>
                            <span>{progress}%</span>
                          </>
                        ) : (
                          <>
                            <div className="empty-icon">✦</div>
                            <span>Hasil akan muncul di sini</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {!resultUrl && !processing && (
                <button className="primary-button process-button" onClick={processImage}>Hapus Background</button>
              )}

              {processing && (
                <div className="progress-box">
                  <div className="progress-track"><div className="progress-bar" style={{ width: `${progress}%` }} /></div>
                  <span>AI sedang memproses foto...</span>
                </div>
              )}

              {resultUrl && (
                <div className="result-section">
                  <h2>Pilih Hasil Foto</h2>
                  <p className="result-description">Foto Anda sudah memiliki background transparan.</p>

                  <div className="options">
                    {[["Natural", 1], ["Detail", 2], ["Avatar", 3]].map(([label, num]) => (
                      <button
                        key={num}
                        className={selectedOption === num ? "option active" : "option"}
                        onClick={() => setSelectedOption(num)}
                      >
                        <img src={resultUrl} alt={`Opsi ${num}`} />
                        <strong>Opsi {num}</strong>
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>

                  <button className="download-button" onClick={downloadImage}>↓ Unduh PNG Transparan</button>
                </div>
              )}

              <button className="secondary-button" onClick={reset}>← Proses Foto Lain</button>
            </section>
          )}

          {error && <div className="error">{error}</div>}
        </section>

        <section className="features">
          <div><span>⚡</span><h3>Cepat & Mudah</h3><p>Hapus background hanya dengan beberapa klik.</p></div>
          <div><span>✦</span><h3>Berbasis AI</h3><p>Sistem mengenali objek utama secara otomatis.</p></div>
          <div><span>▣</span><h3>PNG Transparan</h3><p>Hasil dapat langsung digunakan untuk desain.</p></div>
          <div><span>🔒</span><h3>Privat</h3><p>Pemrosesan dilakukan langsung di browser.</p></div>
        </section>

        <section className="how" id="cara">
          <h2>Cara Pakai</h2>
          <div className="steps">
            <div><b>01</b><h3>Upload Foto</h3><p>Pilih foto dari perangkat Anda.</p></div>
            <div><b>02</b><h3>Hapus Background</h3><p>AI akan memisahkan objek dari background.</p></div>
            <div><b>03</b><h3>Unduh</h3><p>Download hasil dalam format PNG transparan.</p></div>
          </div>
        </section>
      </main>

      <footer id="tentang">
        <strong>FotoTanpaBG</strong>
        <p>Alat sederhana untuk membuat foto tanpa background.</p>
        <small>© 2026 FotoTanpaBG</small>
      </footer>
    </div>
  );
}

export default App;
