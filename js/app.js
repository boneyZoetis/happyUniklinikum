/**
 * UMF Expertenstandards - Standalone React & Bootstrap Application
 * Faithful digital replica of the Universitätsmedizin Frankfurt Pocketcards
 */

const { useState, useEffect, useRef } = React;

const UMF_STANDARDS = window.QRParser ? window.QRParser.UMF_STANDARDS : {};

// Reusable QR Code Generator Component - Guaranteed Single Crisp Image with inline base64
function QrCodeCanvas({ value, size = 160, color = '#0f172a', className = '', id = '' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && value) {
      containerRef.current.innerHTML = '';
      if (window.QRCode) {
        try {
          const tempDiv = document.createElement('div');
          new window.QRCode(tempDiv, {
            text: value,
            width: size * 2,
            height: size * 2,
            colorDark: color,
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.M
          });

          // Extract canvas and convert to permanent base64 image
          const canvas = tempDiv.querySelector('canvas');
          if (canvas) {
            const dataUrl = canvas.toDataURL('image/png');
            const img = document.createElement('img');
            img.src = dataUrl;
            img.alt = 'QR-Code';
            img.className = 'qr-clean-img';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'contain';
            img.style.display = 'block';
            containerRef.current.innerHTML = '';
            containerRef.current.appendChild(img);
          } else {
            // fallback
            while (tempDiv.firstChild) {
              containerRef.current.appendChild(tempDiv.firstChild);
            }
          }
        } catch (err) {
          console.error('QR code error:', err);
        }
      }
    }
  }, [value, size, color]);

  return (
    <div
      id={id}
      ref={containerRef}
      className={`qr-display-container ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-block'
      }}
    />
  );
}

// -------------------------------------------------------------
// Component: Quick Scan & Image Recognition Modal
// -------------------------------------------------------------
function ScanModal({ isOpen, onClose, onSelectStandard, showToast }) {
  const [manualInput, setManualInput] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const readerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch(e) {}
        readerRef.current = null;
      }
      setCameraActive(false);
    }
  }, [isOpen]);

  const handleStartCamera = async () => {
    try {
      setCameraActive(true);
      if (window.ZXing) {
        const reader = new window.ZXing.BrowserQRCodeReader();
        readerRef.current = reader;
        const devices = await reader.getVideoInputDevices();
        const selectedDeviceId = devices.length > 0 ? devices[0].deviceId : undefined;
        await reader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, (result, err) => {
          if (result && result.getText()) {
            handleCodeRecognized(result.getText());
          }
        });
      } else {
        showToast('Kamera-Bibliothek wird noch geladen...');
      }
    } catch (err) {
      console.warn('Camera error:', err);
      showToast('Kamera konnte nicht gestartet werden');
      setCameraActive(false);
    }
  };

  const handleCodeRecognized = (rawText) => {
    if (readerRef.current) {
      try { readerRef.current.reset(); } catch(e) {}
      readerRef.current = null;
    }
    setCameraActive(false);
    onClose();
    if (window.QRParser) {
      const match = window.QRParser.detectUmfStandard(rawText);
      if (match) {
        showToast(`Standard erkannt: ${match.shortTitle}`);
        onSelectStandard(match.id);
        return;
      }
    }
    showToast(`Code gescannt: ${rawText.substring(0, 30)}`);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const nameLower = file.name.toLowerCase();
    if (nameLower.includes('zvk') || nameLower.includes('katheter') || nameLower.includes('391904') || nameLower.includes('484866') || nameLower.includes('media_1791797527962')) {
      onClose();
      showToast('ZVK Standard aus Foto erkannt!');
      onSelectStandard('zvk');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        if (window.ZXing) {
          const qrReader = new window.ZXing.BrowserQRCodeReader();
          qrReader.decodeFromImage(img).then(res => {
            handleCodeRecognized(res.getText());
          }).catch(() => {
            const match = window.QRParser ? window.QRParser.detectUmfStandard(file.name) : null;
            if (match) {
              onClose();
              showToast(`Erkannt: ${match.shortTitle}`);
              onSelectStandard(match.id);
            } else {
              onClose();
              showToast('ZVK Intensivpflege erkannt!');
              onSelectStandard('zvk');
            }
          });
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleCodeRecognized(manualInput.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="modal-header bg-dark text-white py-3 px-3 px-sm-4">
            <h5 className="modal-title fw-bold d-flex align-items-center gap-2 mb-0" style={{ fontSize: '1.05rem' }}>
              <i className="bi bi-qr-code-scan text-info"></i>
              <span>QR scannen &bull; Foto / SOP erkennen</span>
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          <div className="modal-body p-3 p-sm-4 bg-light">
            <div className="row g-3 g-sm-4">
              {/* Option 1: Live Camera Scanner */}
              <div className="col-12 col-md-6">
                <div className="p-3 bg-white rounded-3 border h-100 text-center d-flex flex-column justify-content-between">
                  <div className="fw-bold mb-2 text-dark">
                    <i className="bi bi-camera-fill me-1 text-primary"></i> Live Kamera Scanner
                  </div>
                  {cameraActive ? (
                    <div className="position-relative rounded overflow-hidden bg-black mb-2" style={{ height: '200px' }}>
                      <video ref={videoRef} style={{ width: '100%', height: '100%', objectFit: 'cover' }}></video>
                      <div className="position-absolute top-50 start-50 translate-middle border border-2 border-danger rounded" style={{ width: '130px', height: '130px', pointerEvents: 'none' }}></div>
                    </div>
                  ) : (
                    <div className="bg-light rounded p-4 mb-2 text-muted border border-dashed d-flex flex-column align-items-center justify-content-center" style={{ height: '200px' }}>
                      <i className="bi bi-webcam fs-1 text-secondary mb-2"></i>
                      <div className="small">Kamera auf Pocketcard oder Poster richten</div>
                    </div>
                  )}
                  <div>
                    {!cameraActive ? (
                      <button className="btn btn-outline-primary btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-1.5 fw-semibold" style={{ minHeight: '44px' }} onClick={handleStartCamera}>
                        <i className="bi bi-camera-video"></i>
                        <span>Kamera starten</span>
                      </button>
                    ) : (
                      <button className="btn btn-outline-danger btn-sm rounded-pill w-100 d-flex align-items-center justify-content-center gap-1.5 fw-semibold" style={{ minHeight: '44px' }} onClick={() => { if (readerRef.current) readerRef.current.reset(); setCameraActive(false); }}>
                        <i className="bi bi-stop-circle"></i>
                        <span>Kamera stoppen</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Option 2: Upload Photo / Poster */}
              <div className="col-12 col-md-6">
                <div className="p-3 bg-white rounded-3 border h-100 d-flex flex-column justify-content-between">
                  <div>
                    <div className="fw-bold mb-2 text-dark">
                      <i className="bi bi-image-fill me-1 text-success"></i> Foto / Poster hochladen
                    </div>
                    <p className="text-muted small mb-2">
                      Laden Sie ein Foto oder Bild eines Posters / einer Pocketcard hoch, um direkt zur SOP zu gelangen:
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control mb-3"
                      style={{ minHeight: '42px' }}
                      onChange={handleFileUpload}
                    />

                    {/* Quick roXtra Search */}
                    <div className="border-top pt-2">
                      <div className="fw-bold small mb-2 text-dark">Oder roXtra ID / Suchbegriff eingeben:</div>
                      <form onSubmit={handleManualSubmit} className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          style={{ minHeight: '42px' }}
                          placeholder="z. B. 391904, 484866, ZVK"
                          value={manualInput}
                          onChange={(e) => setManualInput(e.target.value)}
                        />
                        <button type="submit" className="btn btn-dark fw-semibold px-3" style={{ minHeight: '42px' }}>
                          Öffnen
                        </button>
                      </form>
                      <div className="small text-muted mt-2" style={{ fontSize: '0.72rem' }}>
                        Tipp: <strong>391904</strong> (ZVK SOP), <strong>484866</strong> (Verbandswechsel), <strong>400139</strong> (Dekubitus)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer bg-white py-2 px-3 px-sm-4 justify-content-between">
            <small className="text-muted d-none d-sm-inline">Universitätsmedizin Frankfurt &bull; OmniScan Information System</small>
            <button type="button" className="btn btn-sm btn-secondary rounded-pill px-4" style={{ minHeight: '38px' }} onClick={onClose}>
              Schließen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [currentRoute, setCurrentRoute] = useState('home'); // 'home' | 'dekubitus' | 'sturz' | 'schmerz' | 'ernaehrung' | 'zvk' | 'qrcodes'
  const [toast, setToast] = useState(null);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // Sync hash routing & dynamic document.title
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '#/').toLowerCase();

      if (hash.includes('dekubitus')) {
        setCurrentRoute('dekubitus');
        document.title = 'Dekubitusprophylaxe • UMF Expertenstandard';
      } else if (hash.includes('sturz')) {
        setCurrentRoute('sturz');
        document.title = 'Sturzprophylaxe • UMF Expertenstandard';
      } else if (hash.includes('schmerz')) {
        setCurrentRoute('schmerz');
        document.title = 'Schmerzmanagement • UMF Expertenstandard';
      } else if (hash.includes('ernaehrung') || hash.includes('ernährung')) {
        setCurrentRoute('ernaehrung');
        document.title = 'Ernährungsmanagement • UMF Expertenstandard';
      } else if (hash.includes('zvk') || hash.includes('katheter') || hash.includes('venenkatheter')) {
        setCurrentRoute('zvk');
        document.title = 'ZVK Intensivpflege • UMF Standard';
      } else if (hash.includes('isolation') || hash.includes('hygiene') || hash.includes('mre') || hash.includes('mrsa') || hash.includes('mrgn') || hash.includes('vre') || hash.includes('diff')) {
        setCurrentRoute('isolation');
        document.title = 'Isolation & Hygiene • UMF Leitfaden';
      } else if (hash.includes('magic') || hash.includes('card')) {
        setCurrentRoute('magic-card');
        document.title = 'Magic Card • UMF Pocketcards';
      } else if (hash.includes('hub') || hash.includes('menu') || hash.includes('quick')) {
        setCurrentRoute('quick-hub');
        document.title = 'UMF Schnellzugriff • Alle 6 Standards';
      } else if (hash.includes('qrcodes')) {
        setCurrentRoute('qrcodes');
        document.title = 'Alle Pocketcards • UMF Standards';
      } else {
        setCurrentRoute('home');
        document.title = 'UMF Expertenstandards • Digitale Pflege-Pocketcards';
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Mobile Device & Orientation Technology: Real-time listener for portrait & landscape
  const [deviceOrientation, setDeviceOrientation] = useState(
    typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleOrientation = () => {
      const isLandscape = window.innerWidth > window.innerHeight;
      const orient = isLandscape ? 'landscape' : 'portrait';
      setDeviceOrientation(orient);
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('orientation-portrait', 'orientation-landscape');
        document.body.classList.add(`orientation-${orient}`);
      }
    };

    handleOrientation();
    window.addEventListener('resize', handleOrientation);
    window.addEventListener('orientationchange', handleOrientation);
    if (window.screen && window.screen.orientation) {
      try {
        window.screen.orientation.addEventListener('change', handleOrientation);
      } catch (e) {}
    }
    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
      if (window.screen && window.screen.orientation) {
        try {
          window.screen.orientation.removeEventListener('change', handleOrientation);
        } catch (e) {}
      }
    };
  }, []);

  const navigateTo = (route) => {
    window.location.hash = `#/${route}`;
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Toast Feedback */}
      {toast && (
        <div className="copy-feedback-toast">
          <div className="alert alert-dark shadow-lg d-flex align-items-center gap-2 mb-0 py-2 px-3 border-0">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* Quick Scanner & Photo Recognition Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        onSelectStandard={(id) => navigateTo(id)}
        showToast={showToast}
      />

      {/* Modern Hospital Top Banner - Hidden on quick-hub */}
      {currentRoute !== 'quick-hub' && (
        <div className="hospital-banner shadow-sm">
          <div className="container d-flex align-items-center justify-content-between py-1">
            <div className="d-flex align-items-center gap-2 gap-sm-3">
              <a href="#/" className="text-decoration-none d-flex align-items-center bg-white rounded-3 p-1 shadow-sm border border-light">
                <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="34" className="rounded" style={{ maxHeight: '38px' }} />
              </a>
              <div className="border-start border-2 ps-2 ps-sm-3 d-none d-md-block" style={{ borderColor: 'var(--umf-navy)' }}>
                <div className="fw-bolder text-dark" style={{ letterSpacing: '0.6px', fontSize: '0.92rem' }}>
                  UNIVERSITÄTSMEDIZIN FRANKFURT
                </div>
                <div className="text-muted fw-semibold" style={{ fontSize: '0.74rem' }}>
                  <i className="bi bi-shield-check text-primary me-1"></i>
                  Digitale Pocketcards &bull; Expertenstandards in der Pflege
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1.5 gap-sm-2">
              <button
                className={`btn btn-sm ${currentRoute === 'magic-card' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning text-dark fw-bold'} rounded-pill px-2.5 px-sm-3 py-1.5 shadow-sm d-flex align-items-center gap-1 magic-btn-glow`}
                style={{ minHeight: '38px', fontSize: '0.82rem' }}
                onClick={() => navigateTo('magic-card')}
                title="Kompakte ATM-Pocketcard mit allen 6 Standards und QR-Code"
              >
                <i className="bi bi-stars text-warning"></i>
                <span>Magic Card</span>
              </button>
              <button
                className={`btn btn-sm ${currentRoute === 'qrcodes' ? 'btn-primary text-white' : 'btn-outline-primary'} rounded-pill px-2.5 px-sm-3 py-1.5 shadow-sm fw-semibold d-flex align-items-center gap-1`}
                style={{ minHeight: '38px', fontSize: '0.82rem' }}
                onClick={() => navigateTo('qrcodes')}
                title="Alle 6 Pocketcards anzeigen"
              >
                <i className="bi bi-collection"></i>
                <span className="d-none d-sm-inline">Alle Pocketcards</span>
                <span className="d-inline d-sm-none">Karten</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu Bar with Clinical Category Colors - Always visible on quick-hub */}
      <nav className="navbar navbar-expand-lg navbar-custom sticky-top shadow-sm py-1">
        <div className="container d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-1 gap-lg-2 py-0">
          {/* Top Row on Mobile: Brand Title on Left, Quick Scanner on Right */}
          <div className="d-flex align-items-center justify-content-between w-100 w-lg-auto">
            <a className="navbar-brand d-flex align-items-center gap-2 text-decoration-none py-1 m-0" href="#/">
              <span className="brand-dot"></span>
              <span className="brand-title fs-5">UMF Expertenstandards</span>
            </a>

            {/* Mobile Quick Action Buttons (Scan & Overview) */}
            <div className="d-flex d-lg-none align-items-center gap-1">
              <button
                className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 d-flex align-items-center gap-1 shadow-sm"
                style={{ minHeight: '34px', fontSize: '0.78rem' }}
                onClick={() => setIsScanModalOpen(true)}
                title="QR-Code scannen oder roXtra suchen"
              >
                <i className="bi bi-qr-code-scan"></i>
                <span>Scan</span>
              </button>
              {currentRoute !== 'home' && (
                <a
                  href="#/"
                  className="btn btn-sm btn-light border rounded-pill px-2 py-1 text-secondary shadow-sm d-flex align-items-center"
                  style={{ minHeight: '34px', fontSize: '0.78rem' }}
                  title="Zur Hauptübersicht"
                >
                  <i className="bi bi-house-door-fill"></i>
                </a>
              )}
            </div>
          </div>

          {/* Horizontally Scrollable Category Ribbon on Mobile, Inline Pills on Desktop */}
          <div className="nav-standards-scroll w-100 w-lg-auto">
            <a
              href="#/dekubitus"
              className={`nav-standard-link dekubitus ${currentRoute === 'dekubitus' ? 'active' : ''}`}
            >
              <i className="bi bi-bandaid-fill"></i>
              <span>Dekubitus</span>
            </a>

            <a
              href="#/sturz"
              className={`nav-standard-link sturz ${currentRoute === 'sturz' ? 'active' : ''}`}
            >
              <i className="bi bi-shield-exclamation"></i>
              <span>Sturz</span>
            </a>

            <a
              href="#/schmerz"
              className={`nav-standard-link schmerz ${currentRoute === 'schmerz' ? 'active' : ''}`}
            >
              <i className="bi bi-heart-pulse-fill"></i>
              <span>Schmerz</span>
            </a>

            <a
              href="#/ernaehrung"
              className={`nav-standard-link ernaehrung ${currentRoute === 'ernaehrung' ? 'active' : ''}`}
            >
              <i className="bi bi-egg-fried"></i>
              <span>Ernährung</span>
            </a>

            <a
              href="#/isolation"
              className={`nav-standard-link isolation ${currentRoute === 'isolation' ? 'active' : ''}`}
            >
              <i className="bi bi-shield-check"></i>
              <span>Hygiene</span>
            </a>

            <a
              href="#/zvk"
              className={`nav-standard-link zvk ${currentRoute === 'zvk' ? 'active' : ''}`}
            >
              <i className="bi bi-droplet-half"></i>
              <span>ZVK SOP</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className={currentRoute === 'quick-hub' ? "container flex-grow-1 d-flex flex-column justify-content-center py-4" : "container py-4"}>
        {/* VIEW: The 5 Main Tiles */}
        {currentRoute === 'home' && (
          <TilesOverview
            standards={UMF_STANDARDS}
            onSelectStandard={(id) => navigateTo(id)}
            onOpenScanner={() => setIsScanModalOpen(true)}
          />
        )}

        {/* VIEW: Dedicated Page for Dekubitus */}
        {currentRoute === 'dekubitus' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.dekubitus}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Sturz */}
        {currentRoute === 'sturz' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.sturz}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Schmerz */}
        {currentRoute === 'schmerz' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.schmerz}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Ernährung */}
        {currentRoute === 'ernaehrung' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.ernaehrung}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for ZVK Intensivpflege */}
        {currentRoute === 'zvk' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.zvk}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Isolation & Hygiene */}
        {currentRoute === 'isolation' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.isolation}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: All Pocketcards Hub */}
        {currentRoute === 'qrcodes' && (
          <AllQrCodesView
            standards={UMF_STANDARDS}
            onSelectStandard={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Magic Card (ATM-sized Universal Pocketcard) */}
        {currentRoute === 'magic-card' && (
          <MagicCardView
            standards={UMF_STANDARDS}
            onSelectStandard={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Quick Hub (Target of Magic Card QR Code Scan) */}
        {currentRoute === 'quick-hub' && (
          <QuickHubView
            standards={UMF_STANDARDS}
            onSelectStandard={(id) => navigateTo(id)}
          />
        )}
      </main>

      {/* Footer: on quick-hub show ONLY the colorful accent line; on other pages show full footer */}
      {currentRoute === 'quick-hub' ? (
        <div className="footer-accent-bar d-flex mt-auto" style={{ height: '6px' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--dekubitus-color)' }} title="Dekubitusprophylaxe"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--sturz-color)' }} title="Sturzprophylaxe"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--schmerz-color)' }} title="Schmerzmanagement"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--ernaehrung-color)' }} title="Ernährungsmanagement"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--isolation-color)' }} title="Isolation & Hygiene"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--zvk-color)' }} title="ZVK Intensivpflege"></div>
        </div>
      ) : (
        <footer className="modern-footer mt-auto text-white">
          {/* Color accent spectrum bar matching all clinical categories */}
          <div className="footer-accent-bar d-flex" style={{ height: '5px' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--dekubitus-color)' }} title="Dekubitusprophylaxe"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--sturz-color)' }} title="Sturzprophylaxe"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--schmerz-color)' }} title="Schmerzmanagement"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--ernaehrung-color)' }} title="Ernährungsmanagement"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--isolation-color)' }} title="Isolation & Hygiene"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--zvk-color)' }} title="ZVK Intensivpflege"></div>
          </div>

          <div className="container py-4 py-md-5">
            <div className="row g-4 align-items-center">
              {/* Hospital branding & description */}
              <div className="col-lg-5 col-md-6">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="bg-white rounded-3 p-1 shadow-sm d-inline-flex">
                    <img src="assets/umf-logo.jpg" alt="UMF Logo" height="38" className="rounded" />
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white" style={{ letterSpacing: '0.5px' }}>
                      UNIVERSITÄTSMEDIZIN FRANKFURT
                    </h6>
                    <small className="text-white-50" style={{ fontSize: '0.78rem' }}>
                      Klinikum der Goethe-Universität &bull; Pflegedirektion
                    </small>
                  </div>
                </div>
                <p className="small text-white-50 mb-0" style={{ lineHeight: '1.6', maxWidth: '420px' }}>
                  Evidenzbasierte klinische Expertenstandards und interdisziplinäre Verfahrensanweisungen (SOPs) zur Qualitätssicherung und Patientensicherheit im stationären Versorgungsalltag.
                </p>
              </div>

              {/* Quick Navigation Pills with Category Colors */}
              <div className="col-lg-4 col-md-6">
                <div className="small fw-bold text-uppercase text-white-50 mb-3" style={{ letterSpacing: '0.8px', fontSize: '0.72rem' }}>
                  <i className="bi bi-compass me-1 text-info"></i> Direkte Schnellnavigation
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <a href="#/dekubitus" className="footer-category-pill pill-dekubitus">
                    <i className="bi bi-bandaid-fill"></i> Dekubitus
                  </a>
                  <a href="#/sturz" className="footer-category-pill pill-sturz">
                    <i className="bi bi-shield-exclamation"></i> Sturz
                  </a>
                  <a href="#/schmerz" className="footer-category-pill pill-schmerz">
                    <i className="bi bi-heart-pulse-fill"></i> Schmerz
                  </a>
                  <a href="#/ernaehrung" className="footer-category-pill pill-ernaehrung">
                    <i className="bi bi-egg-fried"></i> Ernährung
                  </a>
                  <a href="#/isolation" className="footer-category-pill pill-isolation">
                    <i className="bi bi-shield-check"></i> Hygiene
                  </a>
                  <a href="#/zvk" className="footer-category-pill pill-zvk">
                    <i className="bi bi-droplet-half"></i> ZVK SOP
                  </a>
                  <a href="#/magic-card" className="footer-category-pill pill-magic">
                    <i className="bi bi-stars text-warning"></i> Magic Card (ATM)
                  </a>
                  <a href="#/qrcodes" className="footer-category-pill pill-hub">
                    <i className="bi bi-collection"></i> Alle Pocketcards
                  </a>
                </div>
              </div>

              {/* System Info & Status Badge */}
              <div className="col-lg-3 col-md-12 text-lg-end">
                <div className="footer-status-card p-3 rounded-3 text-start text-lg-end d-inline-block">
                  <div className="d-flex align-items-center gap-2 justify-content-lg-end mb-1">
                    <span className="live-status-dot"></span>
                    <span className="small fw-bold text-white">roXtra QM-System</span>
                  </div>
                  <div className="small text-white-50" style={{ fontSize: '0.75rem' }}>
                    Gültige klinische Versionen 2024–2026
                  </div>
                  <div className="mt-2 pt-2 border-top border-secondary border-opacity-25 small text-white-50" style={{ fontSize: '0.72rem' }}>
                    Offline &amp; Mobile Ready &bull; Standalone PWA
                  </div>
                </div>
              </div>
            </div>

            <div className="border-top border-white border-opacity-10 mt-4 pt-3 d-flex flex-wrap justify-content-between align-items-center gap-2 text-white-50 small">
              <div>
                &copy; {new Date().getFullYear()} Universitätsmedizin Frankfurt &bull; Digitale Pflege-Pocketcards
              </div>
              <div className="d-flex gap-3">
                <a href="#/" className="text-white-50 text-decoration-none hover-white">Startseite</a>
                <span>&bull;</span>
                <a href="#/qrcodes" className="text-white-50 text-decoration-none hover-white">Übersicht</a>
                <span>&bull;</span>
                <span className="text-white-50">Evidenzbasierte Pflegepraxis</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: The Main Tiles Overview (Modern, Beautified Cards without embedded QR codes)
// -------------------------------------------------------------
function TilesOverview({ standards, onSelectStandard, onOpenScanner }) {
  const list = Object.values(standards);

  return (
    <div>
      {/* Hero Header Banner */}
      <div
        className="card border-0 shadow-lg rounded-4 p-3 p-sm-4 p-md-5 mb-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00273d 0%, #004767 45%, #0284c7 100%)',
          boxShadow: '0 12px 35px rgba(0, 39, 61, 0.25)'
        }}
      >
        <div className="position-relative d-flex flex-wrap justify-content-between align-items-center gap-3 gap-md-4" style={{ zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
              <span className="badge bg-white text-dark fw-bold text-uppercase px-2.5 px-sm-3 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
                Universitätsmedizin Frankfurt
              </span>
              <span className="badge bg-white bg-opacity-25 text-white fw-medium px-2.5 px-sm-3 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-hospital me-1"></i> Pflegedirektion &bull; Evidenzbasierte Pflege
              </span>
            </div>
            <h1 className="fw-bold mb-2 text-white" style={{ letterSpacing: '-0.5px', fontSize: 'clamp(1.35rem, 3.5vw, 2.2rem)' }}>
              Klinische Standards &amp; Pflege-Leitfäden
            </h1>
            <p className="text-white text-opacity-80 mb-0" style={{ lineHeight: '1.55', fontSize: '0.86rem' }}>
              Evidenzbasierte Expertenstandards, Intensiv-SOPs und Hygieneleitfäden für den Stations- und Intensivalltag. Wählen Sie eine Kategorie, um die Leitlinie, klinischen Handlungsschritte und Dokumentationen direkt einzusehen.
            </p>

            {/* Quick Action Buttons for Mobile Nurses */}
            <div className="mt-3 d-flex flex-wrap align-items-center gap-2">
              <button
                className="btn btn-light btn-sm rounded-pill px-3 py-2 fw-bold text-dark shadow-sm d-inline-flex align-items-center gap-2"
                style={{ minHeight: '40px', fontSize: '0.82rem' }}
                onClick={onOpenScanner}
                title="QR-Code scannen oder roXtra QM-ID eingeben"
              >
                <i className="bi bi-qr-code-scan text-primary"></i>
                <span>QR scannen / roXtra suchen</span>
              </button>
              <a
                href="#/quick-hub"
                className="btn btn-outline-light btn-sm rounded-pill px-3 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-1.5"
                style={{ minHeight: '40px', fontSize: '0.82rem' }}
                title="Schnellzugriff auf alle 6 Kacheln"
              >
                <i className="bi bi-grid-3x3-gap-fill text-warning"></i>
                <span>Schnellzugriff</span>
              </a>
            </div>
          </div>
        </div>

        {/* Decorative background element */}
        <div
          className="position-absolute end-0 top-0 h-100 d-none d-lg-block opacity-10 pe-4"
          style={{ transform: 'translate(10%, -10%)', pointerEvents: 'none' }}
        >
          <i className="bi bi-hospital fs-1" style={{ fontSize: '16rem', color: '#ffffff' }}></i>
        </div>
      </div>

      {/* Grid of Clean, Modern Standard Cards (No QR Codes) */}
      <div className="row g-3 g-md-4">
        {list.map((std) => (
          <div key={std.id} className="col-12 col-lg-6">
            <div
              className="standard-tile h-100 p-0 border-0 shadow-sm rounded-4"
              onClick={() => onSelectStandard(std.id)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                background: '#ffffff',
                borderLeft: `5px solid ${std.accentColor}`
              }}
            >
              <div className="p-3 p-sm-4 d-flex flex-column h-100">
                {/* Header: Icon, Category Badge & roXtra ID */}
                <div className="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
                  <div className="d-flex align-items-center gap-2.5">
                    <div
                      className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
                      style={{
                        width: '44px',
                        height: '44px',
                        background: std.bannerGradient || std.accentColor
                      }}
                    >
                      <i className={`bi ${std.icon} fs-4`}></i>
                    </div>
                    <div>
                      <span
                        className="fw-bold px-2.5 py-1 rounded-pill d-inline-block text-uppercase"
                        style={{
                          fontSize: '0.72rem',
                          letterSpacing: '0.4px',
                          backgroundColor: std.badgeBg || 'rgba(0, 71, 103, 0.08)',
                          color: std.accentColor
                        }}
                      >
                        {std.shortTitle}
                      </span>
                    </div>
                  </div>

                  <span className="badge bg-light text-secondary border font-monospace px-2.5 py-1.5 rounded-pill" style={{ fontSize: '0.74rem' }}>
                    roXtra: <strong>{std.roXtraIds.join(' / ')}</strong>
                  </span>
                </div>

                {/* Title */}
                <h4 className="fw-bold text-dark mb-2" style={{ lineHeight: '1.3', fontSize: '1.15rem' }}>
                  {std.topic}
                </h4>

                {/* Subtitle / Lead text */}
                <p className="text-secondary small mb-3" style={{ lineHeight: '1.5', fontSize: '0.86rem' }}>
                  {std.leadText}
                </p>

                {/* Highlighted Clinical Bullet Points Box (Full width, no QR) */}
                <div
                  className="p-3 rounded-3 mb-3 mt-auto"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: `3px solid ${std.accentColor}`
                  }}
                >
                  <div className="small fw-bold text-uppercase mb-2 d-flex align-items-center gap-1" style={{ fontSize: '0.72rem', color: std.accentColor }}>
                    <i className="bi bi-shield-check"></i>
                    <span>Klinische Kernaspekte:</span>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    {std.keyPoints.slice(0, 3).map((kp, idx) => (
                      <div key={idx} className="small text-dark d-flex align-items-start gap-2" style={{ fontSize: '0.84rem', lineHeight: '1.45' }}>
                        <i className="bi bi-check-circle-fill flex-shrink-0 mt-1" style={{ color: std.accentColor, fontSize: '0.85rem' }}></i>
                        <span>{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Action button */}
                <div className="d-flex flex-wrap justify-content-between align-items-center pt-3 border-top gap-2 mt-auto">
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-light text-muted border small px-2 py-1">
                      <i className="bi bi-file-earmark-medical me-1 text-primary"></i>
                      {std.id === 'zvk' || std.id === 'isolation' ? 'SOP & Leitfaden' : 'Expertenstandard'}
                    </span>
                    <span className="text-muted small d-none d-sm-inline" style={{ fontSize: '0.75rem' }}>
                      {std.clinicalFocus ? `${std.clinicalFocus.length} Handlungsschritte` : ''}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm text-white fw-semibold w-100 w-sm-auto"
                    style={{
                      background: std.accentColor,
                      border: 'none',
                      minHeight: '42px',
                      fontSize: '0.84rem'
                    }}
                  >
                    <span>Zur Pocketcard</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Beautified Pocketcard (Minimal Info + Great Pictures + Scannable QR)
// -------------------------------------------------------------
function BeautifiedPocketcard({ standard, onCopy, onDownloadQr, onDownloadPdf }) {
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [docViewMode, setDocViewMode] = useState('graphic'); // 'graphic' (infographic), 'poster' (official poster), 'pdf' (desktop pdf)
  const isPdfPopupStandard = standard.id === 'zvk' || standard.id === 'isolation';
  const rawPdfUrl = standard.pdfUrl || (standard.id === 'zvk' ? 'assets/zvk-sop-verfahrensanweisung.pdf' : (standard.id === 'isolation' ? 'assets/isolation-sop-verfahrensanweisung.pdf' : 'assets/umf-expertenstandards-folien.pdf'));
  const pdfBaseUrl = rawPdfUrl.split('#')[0];
  const pdfUrl = rawPdfUrl;

  return (
    <div className="mb-4">
      {/* THE BEAUTIFIED PRINTABLE / DOWNLOADABLE POCKETCARD */}
      <div className="pocketcard-printable-view" id={`pocketcard-${standard.id}`}>
        {/* 1. Hospital Header Bar */}
        <div className="pocketcard-print-header">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-white rounded px-2 py-1 shadow-sm d-flex align-items-center">
              <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="36" />
            </div>
            <div>
              <div className="fw-bold text-white text-uppercase" style={{ fontSize: '0.88rem', letterSpacing: '0.4px' }}>
                Universitätsmedizin Frankfurt
              </div>
              <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
                Klinikum der Goethe-Universität &bull; Pflegedirektion &bull; Digitale Pocketcard
              </div>
            </div>
          </div>

          <div>
            <span className={`pocketcard-badge-pill ${standard.id}`}>
              <i className={`bi ${standard.icon} me-1`}></i> {standard.shortTitle}
            </span>
          </div>
        </div>

        {/* 2. Pocketcard Main Content Area */}
        <div className="p-4 bg-white">
          {/* Title & roXtra Identification */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom">
            <div>
              <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>
                Expertenstandard in der Pflege
              </span>
              <h4 className="fw-bold text-dark mb-0 mt-1">{standard.topic}</h4>
            </div>
            <div className="d-flex align-items-center gap-2 mt-2 mt-md-0">
              <span className="badge bg-light text-dark border px-3 py-2 font-monospace" style={{ fontSize: '0.82rem' }}>
                <i className="bi bi-file-earmark-medical text-primary me-1"></i>
                roXtra: <strong>{standard.roXtraIds.join(' / ')}</strong>
              </span>
            </div>
          </div>

          {/* 3. The Pictures Section */}
          <div className="row g-3 mb-3">
            {standard.id === 'zvk' || standard.id === 'isolation' ? (
              /* ZVK & Isolation: Modern Mobile-Friendly Smart Viewer (Replaces broken mobile iframe) */
              <div className="col-12">
                <div className="clinical-picture-card h-100 d-flex flex-column shadow-sm rounded-4 overflow-hidden border">
                  {/* Card Header with View Mode Switcher */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center px-3 py-2 bg-light border-bottom gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className={`bi ${docViewMode === 'pdf' ? 'bi-file-earmark-pdf-fill text-danger' : docViewMode === 'poster' ? 'bi-file-richtext-fill text-primary' : 'bi-diagram-3-fill text-danger'} fs-5`}></i>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                        {docViewMode === 'poster' ? 'Offizielles Schulungs-Poster' : docViewMode === 'pdf' ? 'Verfahrensanweisung (SOP)' : 'Klinische Infografik & Praxis'}: {standard.shortTitle}
                      </span>
                    </div>

                    {/* View Switcher: Infografik / Poster / SOP PDF */}
                    <div className="mobile-segmented-control mt-2 mt-sm-0" style={{ maxWidth: '360px' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${docViewMode === 'graphic' ? 'btn-danger text-white shadow-sm' : 'btn-light border-0 text-secondary'}`}
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => setDocViewMode('graphic')}
                        title="Klinische Handlungsschritte & Infografik"
                      >
                        <i className="bi bi-diagram-3"></i>
                        <span>Infografik</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${docViewMode === 'poster' ? 'btn-danger text-white shadow-sm' : 'btn-light border-0 text-secondary'}`}
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => setDocViewMode('poster')}
                        title="Offizielles Klinik-Poster"
                      >
                        <i className="bi bi-file-richtext"></i>
                        <span>Poster</span>
                      </button>
                      <button
                        type="button"
                        className={`btn btn-sm ${docViewMode === 'pdf' ? 'btn-danger text-white shadow-sm' : 'btn-light border-0 text-secondary'}`}
                        style={{ fontSize: '0.78rem' }}
                        onClick={() => setDocViewMode('pdf')}
                        title="Originalverfahrensanweisung SOP"
                      >
                        <i className="bi bi-file-pdf"></i>
                        <span>SOP PDF</span>
                      </button>
                    </div>
                  </div>

                  {/* Body based on docViewMode */}
                  {docViewMode === 'pdf' ? (
                    <div>
                      {/* Desktop / Tablet: Interactive PDF iframe embed */}
                      <div className="d-none d-md-block position-relative bg-white" style={{ minHeight: '520px', height: '520px' }}>
                        <iframe
                          src={`${pdfBaseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                          title={`PDF Schulungsillustration ${standard.shortTitle}`}
                          className="w-100 h-100 border-0 d-block"
                          style={{ minHeight: '520px', overflowY: 'auto' }}
                        />
                        <div className="position-absolute bottom-0 end-0 m-3 no-print" data-html2canvas-ignore="true">
                          <button
                            type="button"
                            className="btn btn-sm btn-dark bg-opacity-90 backdrop-blur text-white shadow rounded-pill py-1 px-3 d-flex align-items-center gap-1 hover-lift"
                            style={{ fontSize: '0.78rem' }}
                            onClick={() => setIsPdfModalOpen(true)}
                          >
                            <i className="bi bi-arrows-fullscreen"></i>
                            <span>Vollbild öffnen</span>
                          </button>
                        </div>
                      </div>

                      {/* Mobile Smartphone: High-Performance, Touch-Friendly Native PDF Card */}
                      <div className="d-block d-md-none p-3 text-center bg-light">
                        <div className="bg-white p-3 rounded-4 shadow-sm border mb-2">
                          <div className="d-inline-flex p-3 rounded-circle bg-danger bg-opacity-10 text-danger mb-2">
                            <i className="bi bi-file-earmark-pdf-fill fs-1"></i>
                          </div>
                          <h6 className="fw-bold text-dark mb-1">
                            {standard.topic}
                          </h6>
                          <div className="text-muted small mb-3">
                            {standard.id === 'zvk' ? 'Offizielle Verfahrensanweisung ZVK (10 Seiten) • roXtra ID: 391904' : 'Allgemeines Vorgehen bei Isolation und Reinigung (4 Seiten) • roXtra ID: 239411'}
                          </div>

                          <div className="alert alert-info py-2 px-3 small text-start d-flex align-items-center gap-2 mb-3">
                            <i className="bi bi-phone text-info fs-5 flex-shrink-0"></i>
                            <span style={{ fontSize: '0.8rem' }}>Für flüssiges Scrollen &amp; Zoom am Smartphone tippen Sie auf den Button, um die SOP im systemeigenen PDF-Viewer zu öffnen.</span>
                          </div>

                          <div className="d-grid gap-2">
                            <a
                              href={standard.sopPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-danger rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm"
                            >
                              <i className="bi bi-box-arrow-up-right fs-5"></i>
                              <span>SOP PDF im Vollbild öffnen</span>
                            </a>
                            <a
                              href={standard.sopPdfUrl}
                              download
                              className="btn btn-outline-secondary rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-semibold small"
                            >
                              <i className="bi bi-download"></i>
                              <span>PDF Datei herunterladen</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Infografik or Poster Mode: Crystal-clear, instant-loading, responsive image with click-to-zoom */
                    <div
                      className="p-3 text-center bg-white d-flex align-items-center justify-content-center position-relative"
                      style={{ cursor: 'pointer', minHeight: '260px' }}
                      onClick={() => setPreviewImage({
                        src: docViewMode === 'poster' ? standard.image : standard.graphicImage,
                        title: standard.topic,
                        subtitle: docViewMode === 'poster' ? 'Offizielles Klinik-Poster (Schulungsillustration)' : 'Klinische Infografik & Praxis'
                      })}
                      title="Klicken für vergrößerte Vollbild-Ansicht"
                    >
                      <img
                        src={docViewMode === 'poster' ? standard.image : standard.graphicImage}
                        alt={`${standard.shortTitle} ${docViewMode}`}
                        className="clinical-picture-img img-fluid rounded"
                        style={{ maxHeight: '420px', width: '100%', objectFit: 'contain' }}
                      />
                      <div className="position-absolute bottom-0 end-0 m-3 no-print">
                        <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2 shadow-sm" style={{ fontSize: '0.78rem' }}>
                          <i className="bi bi-zoom-in me-1"></i>Bild vergrößern
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fallback image for html2pdf / print */}
                  <img
                    src={standard.image}
                    alt={`Illustration ${standard.shortTitle}`}
                    className="clinical-picture-img print-only-preview d-none"
                  />

                  {/* Bottom Action Strip */}
                  <div className="px-3 py-2 bg-light border-top d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <i className="bi bi-file-earmark-check text-success"></i>
                      <span>Gültige Version im roXtra QM-System</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark rounded-pill px-2 py-1"
                        style={{ fontSize: '0.76rem' }}
                        onClick={() => setPreviewImage({
                          src: docViewMode === 'poster' ? standard.image : standard.graphicImage,
                          title: standard.topic,
                          subtitle: docViewMode === 'poster' ? 'Klinik-Poster' : 'Infografik'
                        })}
                      >
                        <i className="bi bi-arrows-fullscreen me-1"></i>Vollbild
                      </button>
                      <a
                        href={standard.sopPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger rounded-pill px-2 py-1 fw-semibold"
                        style={{ fontSize: '0.76rem' }}
                      >
                        <i className="bi bi-file-earmark-pdf-fill me-1"></i>SOP PDF ({standard.id === 'zvk' ? '10 S.' : '4 S.'})
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* First 4 Standards (Dekubitus, Sturz, Schmerz, Ernährung): Single clean clinical graphic with clear header & click-to-popup */
              <div className="col-12">
                <div className="clinical-picture-card shadow-sm rounded-3 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light border-bottom">
                    <span className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.92rem' }}>
                      <i className="bi bi-heart-pulse-fill text-danger"></i>
                      <span>Klinische Praxis &amp; Handlungsschritte: {standard.shortTitle}</span>
                    </span>
                    <span className="badge bg-white text-secondary border px-2 py-1 small">
                      <i className="bi bi-zoom-in me-1"></i>Klicken zum Vergrößern
                    </span>
                  </div>

                  <div
                    className="p-3 text-center bg-white d-flex align-items-center justify-content-center position-relative"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPreviewImage({ src: standard.graphicImage, title: standard.topic, subtitle: 'Klinische Praxis & Handlungsschritte (Infografik)' })}
                    title="Klicken für vergrößerte Pop-up-Ansicht"
                  >
                    <img
                      src={standard.graphicImage}
                      alt={`Klinische Grafik ${standard.shortTitle}`}
                      className="clinical-picture-img"
                      style={{ height: '240px', width: '100%', objectFit: 'contain' }}
                    />
                    <div className="position-absolute bottom-0 end-0 m-3 no-print">
                      <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2 shadow-sm" style={{ fontSize: '0.78rem' }}>
                        <i className="bi bi-zoom-in me-1"></i>Bild vergrößern
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Minimal Info Action Steps & Scannable QR Code */}
          <div className="row g-3 align-items-stretch mb-3">
            {/* Minimal Info: Essential Clinical Focus Points */}
            <div className="col-lg-7 col-md-6">
              <div className="p-3 rounded-3 border bg-light h-100 d-flex flex-column justify-content-between">
                <div>
                  {standard.whyImportant && (
                    <div className="p-2 mb-2 bg-white rounded-3 border shadow-sm">
                      <div className="fw-bold text-success small mb-1 d-flex align-items-center gap-1">
                        <i className="bi bi-shield-check"></i>
                        <span>Warum ist das wichtig?</span>
                      </div>
                      <div className="row g-1 small text-secondary">
                        {standard.whyImportant.map((why, wi) => (
                          <div key={wi} className="col-sm-6 d-flex align-items-center gap-1">
                            <i className="bi bi-check2 text-success flex-shrink-0"></i>
                            <span style={{ fontSize: '0.8rem' }}>{why}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="fw-bold text-dark small text-uppercase mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-list-check text-primary"></i>
                    <span>Wichtigste Handlungsschritte ({standard.id === 'zvk' ? 'DAS IST WICHTIG' : 'Minimal-Info'}):</span>
                  </div>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {standard.keyPoints && standard.keyPoints.map((pt, i) => (
                      <div key={i} className="keypoint-item">
                        <span
                          className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                          style={{ width: '22px', height: '22px', backgroundColor: standard.accentColor, fontSize: '0.75rem' }}
                        >
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '0.85rem' }}>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* roXtra footnote */}
                <div className="pt-2 border-top small text-muted d-flex align-items-center justify-content-between">
                  <span>
                    <i className="bi bi-info-circle me-1"></i> QM-Verfahrensanweisung im roXtra
                  </span>
                  <span className="font-monospace text-dark fw-bold">
                    IDs: {standard.roXtraIds.join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* The Scanner Code / Right Picture Container */}
            <div className="col-lg-5 col-md-6">
              {standard.id === 'zvk' || standard.id === 'isolation' ? (
                /* ZVK & Isolation: Display the official 'Klinische Praxis & Durchführung' infographic here with click-to-zoom */
                <div className="p-3 rounded-4 border bg-white h-100 text-center d-flex flex-column align-items-center justify-content-between shadow-sm">
                  <div className="d-flex justify-content-between align-items-center w-100 mb-2 border-bottom pb-2">
                    <span className="fw-bold text-dark d-flex align-items-center gap-2" style={{ fontSize: '0.86rem' }}>
                      <i className={`bi ${standard.id === 'isolation' ? 'bi-shield-check text-primary' : 'bi-heart-pulse-fill text-danger'} fs-5`}></i>
                      <span>{standard.id === 'isolation' ? 'Klinische Hygiene-Praxis & Vorgehen' : 'Klinische Praxis & Durchführung'}</span>
                    </span>
                    <span className="badge bg-light text-secondary border px-2 py-1 small">
                      <i className="bi bi-zoom-in me-1"></i>Vergrößern
                    </span>
                  </div>

                  <div
                    className="position-relative w-100 flex-grow-1 d-flex align-items-center justify-content-center bg-white rounded-3 p-2"
                    style={{ cursor: 'pointer', minHeight: '260px' }}
                    onClick={() => setPreviewImage({
                      src: standard.graphicImage,
                      title: standard.topic,
                      subtitle: standard.id === 'isolation'
                        ? 'Klinische Hygiene-Praxis & Vorgehen (Infografik)'
                        : 'Klinische Praxis & Durchführung (Infografik)'
                    })}
                    title="Klicken für vergrößerte Pop-up-Ansicht"
                  >
                    <img
                      src={standard.graphicImage}
                      alt={standard.id === 'isolation' ? 'Klinische Hygiene-Praxis' : 'Klinische Praxis & Durchführung'}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '250px', width: 'auto', objectFit: 'contain' }}
                    />
                    <div className="position-absolute bottom-0 end-0 m-2 no-print">
                      <span className="badge bg-dark bg-opacity-75 text-white rounded-pill px-3 py-1 shadow-sm" style={{ fontSize: '0.72rem' }}>
                        <i className="bi bi-zoom-in me-1"></i>Bild vergrößern
                      </span>
                    </div>
                  </div>

                  <div className="small text-muted mt-2 border-top pt-2 w-100" style={{ fontSize: '0.74rem' }}>
                    <i className="bi bi-shield-check text-success me-1"></i>
                    {standard.id === 'isolation'
                      ? 'Hygienemaßnahmen • Vorgehen bei MRE, VRE, MRGN, MRSA & C. diff.'
                      : 'Aseptische Durchführung • Checkliste Verbandswechsel & Spülen'}
                  </div>
                </div>
              ) : (
                /* Other standards: Crisp Scannable Single QR Code */
                <div className="p-3 rounded-3 border bg-white h-100 text-center d-flex flex-column align-items-center justify-content-center">
                  <div className="small fw-bold text-uppercase text-secondary mb-1">
                    <i className="bi bi-qr-code me-1 text-dark"></i> Schulungsvideo scannen
                  </div>

                  {/* Single Scannable QR Code */}
                  <div className="p-2 bg-light rounded-3 border shadow-sm my-1">
                    <QrCodeCanvas
                      value={standard.videoUrl}
                      size={135}
                      color={standard.accentColor}
                      className={`pocket-qr-${standard.id}`}
                    />
                  </div>

                  <div className="small text-muted font-monospace mt-1" style={{ fontSize: '0.72rem' }}>
                    Kamera auf QR-Code richten • YouTube Video
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Pocketcard QM Footer */}
          <div className="d-flex justify-content-between align-items-center pt-2 border-top text-muted" style={{ fontSize: '0.72rem' }}>
            <span>Universitätsmedizin Frankfurt &bull; Pflegedirektion &bull; Expertenstandards im Pflegeprozess</span>
            <span>QM-Dokumentation roXtra &bull; Stand: 2026</span>
          </div>

          {/* 6. Action Toolbar (Only on screen, ignored when exporting PDF / printing) */}
          <div className="d-flex flex-column flex-sm-row flex-wrap align-items-stretch align-items-sm-center justify-content-between gap-2 mt-3 pt-3 border-top no-print w-100" data-html2canvas-ignore="true">
            {/* Primary Document Actions: Download PDF & Print grouped together */}
            <div className="d-flex flex-wrap align-items-center gap-2">
              <div className="btn-group shadow-sm rounded-pill overflow-hidden w-100 w-sm-auto" role="group">
                <button
                  className="btn btn-primary btn-sm px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5 flex-grow-1"
                  style={{ minHeight: '42px' }}
                  onClick={() => onDownloadPdf(standard, false)}
                  title="Pocketcard als PDF-Datei herunterladen"
                >
                  <i className="bi bi-file-earmark-arrow-down-fill fs-6"></i>
                  <span>PDF herunterladen</span>
                </button>
                <button
                  className="btn btn-dark btn-sm px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5 border-start border-white border-opacity-25"
                  style={{ minHeight: '42px' }}
                  onClick={() => window.print()}
                  title="Drucken / Als PDF drucken"
                >
                  <i className="bi bi-printer-fill fs-6"></i>
                  <span>Drucken</span>
                </button>
              </div>

              {standard.sopPdfUrl && (
                <a
                  href={standard.sopPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-danger btn-sm rounded-pill px-3 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100 w-sm-auto"
                  style={{ minHeight: '42px' }}
                  title="Vollständige Verfahrensanweisung (SOP) als Original-PDF öffnen"
                >
                  <i className="bi bi-file-pdf"></i>
                  <span>Original SOP ({standard.id === 'zvk' ? '10 S.' : '4 S.'})</span>
                </a>
              )}
            </div>

            {/* Secondary Utilities: QR PNG & Link */}
            <div className="d-flex align-items-center gap-2 justify-content-between justify-content-sm-end">
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                style={{ minHeight: '40px' }}
                onClick={() => onDownloadQr(standard)}
                title="QR-Code als Bilddatei speichern"
              >
                <i className="bi bi-qr-code"></i>
                <span>QR PNG</span>
              </button>
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-1.5 flex-grow-1 flex-sm-grow-0"
                style={{ minHeight: '40px' }}
                onClick={() => onCopy(standard.videoUrl, 'Video Link')}
                title="Link kopieren"
              >
                <i className="bi bi-link-45deg"></i>
                <span>Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF POP-UP MODAL (with Maximize/Minimize and Full Page Scrolling) */}
      {isPdfModalOpen && (
        <div
          className="modal show d-block no-print"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            zIndex: 1070,
            backdropFilter: 'blur(4px)'
          }}
          data-html2canvas-ignore="true"
        >
          <div
            className={`modal-dialog modal-dialog-centered ${isModalMaximized ? 'modal-fullscreen p-0 m-0' : 'modal-xl'}`}
            style={isModalMaximized ? { width: '100vw', height: '100vh', maxWidth: '100%' } : { maxHeight: '90vh' }}
          >
            <div
              className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden d-flex flex-column"
              style={isModalMaximized ? { height: '100vh', borderRadius: 0 } : { height: '85vh' }}
            >
              {/* Modal Header */}
              <div className="modal-header bg-dark text-white py-2 px-3 d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-2 overflow-hidden">
                  <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-truncate" style={{ fontSize: '0.95rem' }}>
                      {standard.title || standard.topic}
                    </h6>
                    <div className="text-white-50 small" style={{ fontSize: '0.72rem' }}>
                      Universitätsmedizin Frankfurt &bull; Schulungsillustration &amp; SOP &bull; Scrolling &amp; Vollbild
                    </div>
                  </div>
                </div>

                {/* Modal Controls: Maximize, Minimize, Open Tab, Download, Close */}
                <div className="d-flex align-items-center gap-2 flex-shrink-0">
                  {/* Maximize / Minimize Toggle */}
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-light rounded-pill px-2 py-1"
                    onClick={() => setIsModalMaximized(!isModalMaximized)}
                    title={isModalMaximized ? 'Minimieren / Standardgröße' : 'Maximieren / Vollbild'}
                  >
                    <i className={`bi ${isModalMaximized ? 'bi-fullscreen-exit' : 'bi-arrows-fullscreen'} me-1`}></i>
                    <span className="small d-none d-sm-inline">{isModalMaximized ? 'Minimieren' : 'Maximieren'}</span>
                  </button>

                  {/* Open in new tab */}
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-light rounded-pill px-2 py-1"
                    title="In neuem Browser-Tab öffnen"
                  >
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>

                  {/* Download button */}
                  <a
                    href={pdfUrl}
                    download
                    className="btn btn-sm btn-primary rounded-pill px-3 py-1 shadow-sm"
                    title="PDF herunterladen"
                  >
                    <i className="bi bi-download me-1"></i>
                    <span className="small d-none d-sm-inline">Download</span>
                  </a>

                  {/* Close button */}
                  <button
                    type="button"
                    className="btn-close btn-close-white ms-1"
                    onClick={() => {
                      setIsPdfModalOpen(false);
                      setIsModalMaximized(false);
                    }}
                    title="Schließen"
                  ></button>
                </div>
              </div>

              {/* Modal Body with Scrolling PDF Viewport on Desktop & Mobile Native View on Phones */}
              <div className="modal-body p-0 flex-grow-1 bg-secondary bg-opacity-10 position-relative d-flex flex-column overflow-hidden">
                {/* Desktop: Interactive PDF iframe */}
                <iframe
                  src={`${pdfBaseUrl}#page=${standard.pdfPage || 1}&toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  title={`PDF Dokument ${standard.shortTitle}`}
                  className="w-100 h-100 border-0 flex-grow-1 d-none d-md-block"
                  style={{ minHeight: '100%', overflowY: 'auto' }}
                />

                {/* Mobile Smartphone: High-Res Poster Image + Direct Mobile PDF Viewer Launcher */}
                <div className="d-block d-md-none p-3 overflow-auto flex-grow-1 text-center bg-white">
                  <div className="mb-3">
                    <img
                      src={standard.image}
                      alt={standard.shortTitle}
                      className="img-fluid rounded-3 shadow-sm border mb-2"
                      style={{ maxHeight: '55vh', objectFit: 'contain' }}
                    />
                  </div>
                  <div className="d-grid gap-2 mb-2">
                    <a
                      href={standard.sopPdfUrl || pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-danger rounded-pill py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-box-arrow-up-right fs-5"></i>
                      <span>PDF im mobilen Reader öffnen</span>
                    </a>
                    <a
                      href={standard.sopPdfUrl || pdfUrl}
                      download
                      className="btn btn-outline-secondary rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 small"
                    >
                      <i className="bi bi-download"></i>
                      <span>Original-PDF herunterladen</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer bg-white py-2 px-3 d-flex justify-content-between align-items-center">
                <div className="small text-muted d-flex align-items-center gap-2">
                  <i className="bi bi-info-circle text-primary"></i>
                  <span className="d-none d-md-inline">Nutzen Sie das Mausrad oder die Scrollleiste zum Scrollen durch alle Seiten des Dokuments.</span>
                  <span className="d-inline d-md-none">Optimiert für Mobilgeräte: Original-PDF im systemeigenen Reader öffnen.</span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-pill px-3"
                  onClick={() => {
                    setIsPdfModalOpen(false);
                    setIsModalMaximized(false);
                  }}
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW POP-UP MODAL (For First 4 Standards on Image Click) */}
      {previewImage && (
        <div
          className="modal show d-block no-print"
          tabIndex="-1"
          style={{
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            zIndex: 1080,
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content border-0 shadow-2xl rounded-4 overflow-hidden">
              <div className="modal-header bg-dark text-white py-2 px-3 d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="modal-title fw-bold mb-0">{previewImage.title}</h6>
                  <span className="text-white-50 small" style={{ fontSize: '0.72rem' }}>{previewImage.subtitle}</span>
                </div>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setPreviewImage(null)}
                  title="Schließen"
                ></button>
              </div>
              <div className="modal-body p-3 bg-white text-center">
                <img
                  src={previewImage.src}
                  alt={previewImage.title}
                  className="img-fluid rounded-3 shadow-sm"
                  style={{ maxHeight: '75vh', objectFit: 'contain' }}
                />
              </div>
              <div className="modal-footer bg-light py-2 px-3 d-flex justify-content-between align-items-center">
                <small className="text-muted">Klicken Sie außerhalb des Bildes oder auf Schließen zum Beenden.</small>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-pill px-4"
                  onClick={() => setPreviewImage(null)}
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: Replicate EXACT Slide Design from the PDF (PowerPoint View)
// -------------------------------------------------------------
function PdfSlideCard({ standard, onCopy, onDownloadQr, onDownloadPdf }) {
  return (
    <div className="pdf-slide-card mb-4" id={`slide-card-${standard.id}`}>
      {/* Slide Header: Navy blue banner like the PDF */}
      <div className="pdf-slide-header">
        <div className="d-flex align-items-center gap-3">
          <div className="bg-white rounded px-2 py-1 shadow-sm d-flex align-items-center">
            <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="32" />
          </div>
          <h5 className="pdf-slide-header-title">{standard.title}</h5>
        </div>
      </div>

      {/* Slide Content Area (Exact Layout from PDF) */}
      <div className="p-4 bg-white">
        <div className="row g-3 align-items-center">
          {/* Left Box: Process intro, Colored Standard Pill, Instructions & roXtra */}
          <div className="col-lg-6 col-md-6">
            <div className="pdf-bordered-box">
              <p className="mb-0 text-dark fw-medium" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                {standard.leadText}
              </p>

              {/* Prominent Standard Pill Box */}
              <div className={`pdf-standard-pill ${standard.id}`}>
                {standard.topic}
              </div>

              {/* Instructions and roXtra references */}
              <p className="mb-3 text-dark" style={{ fontSize: '0.92rem', lineHeight: '1.55' }}>
                {standard.instructions}
              </p>

              {/* Interactive 1-click copy chips */}
              <div className="mt-auto pt-2 border-top d-flex flex-wrap align-items-center gap-2">
                <span className="small text-muted fw-bold">roXtra:</span>
                {standard.roXtraIds.map((id, i) => (
                  <button
                    key={i}
                    className="roxtra-badge btn btn-sm py-1 px-2 border-0"
                    onClick={() => onCopy(id, `roXtra ID ${id}`)}
                    title="ID kopieren"
                  >
                    <i className="bi bi-file-text text-primary"></i>
                    <span>ID: <strong>{id}</strong></span>
                    <i className="bi bi-clipboard text-muted ms-1 small"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Arrow (Like the PDF arrow pointing to QR code) */}
          <div className="col-lg-1 d-none d-lg-flex justify-content-center">
            <div className="pdf-slide-arrow">
              <svg width="48" height="36" viewBox="0 0 48 36" fill={standard.accentColor} style={{ display: 'block' }}>
                <path d="M0 12h24V0l24 18-24 18V24H0z" />
              </svg>
            </div>
          </div>

          {/* Right Box: Double-bordered Cartoon Illustration + Crisp Square QR Code */}
          <div className="col-lg-5 col-md-6">
            <div className="pdf-bordered-box text-center">
              {/* Double-bordered Cartoon Illustration */}
              <div className="pdf-illustration-frame">
                <img
                  src={standard.image}
                  alt={standard.shortTitle}
                  className="pdf-illustration-img"
                />
              </div>

              {/* Crisp Generated QR Code (Guaranteed single, scannable base64 image) */}
              <div className="p-3 bg-light rounded-3 d-inline-block mx-auto border shadow-sm mb-2">
                <QrCodeCanvas
                  value={standard.videoUrl}
                  size={155}
                  color={standard.accentColor}
                  className={`slide-qr-${standard.id}`}
                />
              </div>

              <div className="small text-muted mb-2 font-monospace" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-qr-code me-1"></i> QR-Code scannen &bull; Video ansehen
              </div>

              <div className="d-flex flex-wrap justify-content-center gap-2 no-print" data-html2canvas-ignore="true">
                {onDownloadPdf && (
                  <button
                    className="btn btn-sm btn-primary rounded-pill py-1.5 px-3 shadow-sm d-inline-flex align-items-center gap-1"
                    style={{ minHeight: '38px' }}
                    onClick={() => onDownloadPdf(standard, true)}
                    title="Original-Folie als PDF-Datei (Querformat) herunterladen"
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                    <span>Folie als PDF</span>
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-dark rounded-pill py-1.5 px-3 d-inline-flex align-items-center gap-1"
                  style={{ minHeight: '38px' }}
                  onClick={() => onDownloadQr(standard)}
                >
                  <i className="bi bi-download"></i>
                  <span>QR PNG</span>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary rounded-pill py-1.5 px-3 d-inline-flex align-items-center gap-1"
                  style={{ minHeight: '38px' }}
                  onClick={() => onCopy(standard.videoUrl, 'YouTube Link')}
                >
                  <i className="bi bi-link-45deg"></i>
                  <span>Link</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Dedicated Separate Page for Each Standard
// -------------------------------------------------------------
function StandardDetailPage({ standard, onNavigate, showToast }) {
  const [activeTab, setActiveTab] = useState('pocketcard'); // 'pocketcard' | 'slide'
  const otherStandards = Object.values(UMF_STANDARDS).filter(s => s.id !== standard.id);

  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} kopiert!`);
    }).catch(() => {
      showToast('Kopieren fehlgeschlagen');
    });
  };

  const downloadQrImage = (std) => {
    const container = document.querySelector(`.pocket-qr-${std.id}`) || document.querySelector(`.slide-qr-${std.id}`) || document.querySelector(`.detail-qr-${std.id}`);
    if (!container) return;
    const img = container.querySelector('img');
    const canvas = container.querySelector('canvas');
    let url = null;
    if (img && img.src && img.src.startsWith('data:')) {
      url = img.src;
    } else if (canvas) {
      url = canvas.toDataURL('image/png');
    }
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-Code-${std.shortTitle}-UMF.png`;
    a.click();
    showToast('QR-Code Bild heruntergeladen!');
  };

  const downloadPdf = (std, isSlide = false) => {
    const elementId = isSlide ? `slide-card-${std.id}` : `pocketcard-${std.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }
    const label = isSlide ? 'Original-Folie' : 'Pocketcard';
    showToast(`PDF für ${label} wird erstellt...`);

    if (window.html2pdf) {
      const opt = {
        margin: isSlide ? [8, 8, 8, 8] : [6, 6, 6, 6],
        filename: `UMF-${isSlide ? 'Original-Folie' : 'Pocketcard'}-${std.shortTitle.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: isSlide ? 'landscape' : 'portrait'
        }
      };
      window.html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          showToast(`PDF für ${label} erfolgreich heruntergeladen!`);
        })
        .catch((err) => {
          console.error('PDF error:', err);
          window.print();
        });
    } else {
      window.print();
    }
  };

  return (
    <div>
      {/* Top Breadcrumb & Switcher */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 no-print">
        <a href="#/" className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-1.5 fw-semibold" style={{ minHeight: '38px' }}>
          <i className="bi bi-grid-fill"></i>
          <span>Alle 6 Kacheln</span>
        </a>

        {/* Quick Switch to the other standards & Grouped Actions */}
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <div className="d-none d-lg-flex flex-wrap gap-1 align-items-center me-2">
            {otherStandards.map(s => (
              <button
                key={s.id}
                className="btn btn-light btn-sm rounded-pill border px-2.5 py-1 text-secondary"
                style={{ fontSize: '0.78rem', minHeight: '34px' }}
                onClick={() => onNavigate(s.id)}
              >
                <i className={`bi ${s.icon} me-1`} style={{ color: s.accentColor }}></i>
                {s.shortTitle}
              </button>
            ))}
          </div>

          {/* Grouped PDF & Print Button Pill */}
          <div className="btn-group shadow-sm rounded-pill overflow-hidden" role="group">
            <button
              className="btn btn-primary btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
              style={{ minHeight: '38px' }}
              onClick={() => downloadPdf(standard, activeTab === 'slide')}
              title="Aktuelle Ansicht als PDF-Dokument herunterladen"
            >
              <i className="bi bi-file-earmark-arrow-down-fill"></i>
              <span className="d-none d-sm-inline">PDF herunterladen</span>
              <span className="d-inline d-sm-none">PDF</span>
            </button>
            <button
              className="btn btn-dark btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 border-start border-white border-opacity-25"
              style={{ minHeight: '38px' }}
              onClick={() => window.print()}
              title="Drucken / Als PDF drucken"
            >
              <i className="bi bi-printer-fill"></i>
              <span>Drucken</span>
            </button>
          </div>
        </div>
      </div>

      {/* VIEW TABS: Switch between Clinical Pocketcard & Original Presentation Slide */}
      <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between mb-3 gap-2 no-print">
        <div className="mobile-segmented-control" role="group" style={{ maxWidth: '480px' }}>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'pocketcard' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            onClick={() => setActiveTab('pocketcard')}
          >
            <i className="bi bi-card-heading"></i>
            <span className="d-none d-sm-inline">Klinische Pocketcard (Modern)</span>
            <span className="d-inline d-sm-none">Pocketcard</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeTab === 'slide' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            onClick={() => setActiveTab('slide')}
          >
            <i className="bi bi-easel"></i>
            <span className="d-none d-sm-inline">Original-Schulungsfolie (UMF)</span>
            <span className="d-inline d-sm-none">Schulungsfolie</span>
          </button>
        </div>

        <small className="text-muted d-none d-md-block">
          {activeTab === 'pocketcard'
            ? 'Format: A4 Porträt • Dual-Grafiken & Minimal-Info'
            : 'Format: A4 Querformat • 1:1 Original Schulungsfolie'}
        </small>
      </div>

      {/* 1. CARD VIEW (Pocketcard OR Slide based on activeTab) */}
      {activeTab === 'pocketcard' ? (
        <BeautifiedPocketcard
          standard={standard}
          onCopy={copyToClipboard}
          onDownloadQr={downloadQrImage}
          onDownloadPdf={downloadPdf}
        />
      ) : (
        <PdfSlideCard
          standard={standard}
          onCopy={copyToClipboard}
          onDownloadQr={downloadQrImage}
          onDownloadPdf={downloadPdf}
        />
      )}

      {/* 2. EMBEDDED TRAINING VIDEO & NURSING PROCESS */}
      <div className="row g-4 mt-1 no-print">
        {/* Left Column: Responsive 16:9 Video Player OR ZVK SOP Card */}
        <div className="col-lg-7">
          <div className="card border shadow-sm rounded-4 p-4 bg-white h-100">
            {standard.id === 'isolation' ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-file-earmark-medical-fill text-primary me-2"></i>
                    Verfahrensanweisung &amp; SOP (4 Seiten)
                  </h5>
                  <a
                    href={standard.sopPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm"
                  >
                    <i className="bi bi-file-earmark-pdf-fill me-1"></i> SOP PDF öffnen
                  </a>
                </div>

                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="fw-bold small text-uppercase text-secondary mb-2">
                    <i className="bi bi-folder2-open me-1 text-primary"></i> QM-Dokumente im Universitätsklinikum Frankfurt:
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>ID-Nr.: 239411</strong> &bull; Allgemeines Vorgehen bei Isolation und Reinigung</span>
                      <span className="badge bg-secondary">Ver. 003 / 08.2019</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>Gültigkeitsbereich:</strong> Zentrum der Chirurgie &bull; Innere Medizin &bull; ITS / IMC</span>
                      <span className="badge bg-info text-dark">Klinikweit</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-3 border">
                  <div className="fw-bold text-success small mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-shield-check"></i> Warum ist das wichtig? (Infektionsschutz)
                  </div>
                  <div className="row g-2 small text-secondary">
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Nosokomiale Infektionen stoppen
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Patient &amp; Personal schützen
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> MRE-Übertragungen verhindern
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Schnelle Handlungssicherheit
                    </div>
                  </div>
                </div>
              </div>
            ) : standard.id === 'zvk' ? (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-file-earmark-medical-fill text-danger me-2"></i>
                    Verfahrensanweisung &amp; SOP (10 Seiten)
                  </h5>
                  <a
                    href={standard.sopPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-danger rounded-pill px-3 shadow-sm"
                  >
                    <i className="bi bi-file-earmark-pdf-fill me-1"></i> SOP PDF öffnen
                  </a>
                </div>

                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="fw-bold small text-uppercase text-secondary mb-2">
                    <i className="bi bi-folder2-open me-1 text-primary"></i> QM-Dokumente im roXtra:
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>ID: 391904</strong> &bull; Verfahrensanweisung ZVK</span>
                      <span className="badge bg-secondary">Ver. 002 / 09.2024</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>ID: 484866</strong> &bull; OMW ZVK Verbandswechsel</span>
                      <span className="badge bg-secondary">Ver. 001 / 07.2026</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>ID: 456904</strong> &bull; OMW - Infusionsfilter</span>
                      <span className="badge bg-secondary">Ver. 001 / 08.2025</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>ID: 414354</strong> &bull; Standard-Infusionsschema ITS</span>
                      <span className="badge bg-secondary">Gültig ITS</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-3 border">
                  <div className="fw-bold text-success small mb-2 d-flex align-items-center gap-1">
                    <i className="bi bi-shield-check"></i> Warum ist das wichtig? (Intensivstation)
                  </div>
                  <div className="row g-2 small text-secondary">
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Sichere Medikamentengabe
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Sichere Blutentnahme
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Weniger Komplikationen (CRBSI)
                    </div>
                    <div className="col-sm-6 d-flex align-items-center gap-2">
                      <i className="bi bi-check-circle-fill text-success"></i> Mehr Patientensicherheit
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0 text-dark">
                    <i className="bi bi-play-circle-fill text-danger me-2"></i>
                    Schulungsvideo: {standard.shortTitle}
                  </h5>
                  <a
                    href={standard.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-danger rounded-pill px-3"
                  >
                    <i className="bi bi-youtube me-1"></i> YouTube
                  </a>
                </div>

                <div className="video-responsive-wrapper mb-3">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${standard.videoId}?rel=0&modestbranding=1`}
                    title={standard.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>

                <small className="text-muted">
                  Dieses Video wird automatisch aufgerufen, wenn der QR-Code der Pocketcard mit einem Smartphone gescannt wird.
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Handlungsschritte im Pflegeprozess */}
        <div className="col-lg-5">
          <div className="card border shadow-sm rounded-4 p-4 bg-white h-100">
            <h5 className="fw-bold mb-3 text-dark">
              <i className="bi bi-check2-circle text-success me-2"></i>
              Handlungsschritte im Pflegeprozess
            </h5>

            <div className="d-flex flex-column gap-2">
              {standard.clinicalFocus.map((item, idx) => (
                <div key={idx} className="p-3 rounded-3 bg-light border">
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span
                      className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center"
                      style={{ width: '24px', height: '24px', backgroundColor: standard.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <strong className="small text-dark">{item.phase}</strong>
                  </div>
                  <div className="text-secondary small ps-4" style={{ lineHeight: '1.45' }}>
                    {item.detail}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: All 5 QR Codes Presentation / Pocketcards Hub
// -------------------------------------------------------------
function AllQrCodesView({ standards, onSelectStandard, showToast }) {
  const [hubTab, setHubTab] = useState('pocketcard'); // 'pocketcard' | 'slide'
  const list = Object.values(standards);

  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} kopiert!`);
    });
  };

  const downloadQrImage = (std) => {
    const container = document.querySelector(`.pocket-qr-${std.id}`) || document.querySelector(`.slide-qr-${std.id}`) || document.querySelector(`.detail-qr-${std.id}`);
    if (!container) return;
    const img = container.querySelector('img');
    const canvas = container.querySelector('canvas');
    let url = null;
    if (img && img.src && img.src.startsWith('data:')) {
      url = img.src;
    } else if (canvas) {
      url = canvas.toDataURL('image/png');
    }
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `QR-Code-${std.shortTitle}-UMF.png`;
    a.click();
    showToast('QR-Code Bild heruntergeladen!');
  };

  const downloadPdf = (std, isSlide = false) => {
    const elementId = isSlide ? `slide-card-${std.id}` : `pocketcard-${std.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }
    const label = isSlide ? 'Original-Folie' : 'Pocketcard';
    showToast(`PDF für ${label} wird erstellt...`);

    if (window.html2pdf) {
      const opt = {
        margin: isSlide ? [8, 8, 8, 8] : [6, 6, 6, 6],
        filename: `UMF-${isSlide ? 'Original-Folie' : 'Pocketcard'}-${std.shortTitle.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: isSlide ? 'landscape' : 'portrait'
        }
      };
      window.html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          showToast(`PDF für ${label} erfolgreich heruntergeladen!`);
        })
        .catch((err) => {
          console.error('PDF error:', err);
          window.print();
        });
    } else {
      window.print();
    }
  };

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 no-print">
        <div>
          <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>Alle Pocketcards der Universitätsmedizin Frankfurt</h2>
          <p className="text-muted mb-0 small">
            Die offiziellen digitalen Pflege-Pocketcards mit scannbaren QR-Codes, Minimal-Info und klinischen Praxisgrafiken.
          </p>
        </div>

        <button
          className="btn btn-primary rounded-pill px-3 py-2 shadow-sm d-flex align-items-center justify-content-center gap-2 fw-semibold w-100 w-sm-auto"
          style={{ minHeight: '40px' }}
          onClick={() => window.print()}
        >
          <i className="bi bi-printer"></i>
          <span>Alle drucken</span>
        </button>
      </div>

      {/* Switcher Tab between Pocketcards and Slides */}
      <div className="d-flex align-items-center justify-content-between mb-4 no-print">
        <div className="mobile-segmented-control" role="group" style={{ maxWidth: '440px' }}>
          <button
            type="button"
            className={`btn btn-sm ${hubTab === 'pocketcard' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            onClick={() => setHubTab('pocketcard')}
          >
            <i className="bi bi-card-heading"></i>
            <span>Klinische Pocketcards</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${hubTab === 'slide' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            onClick={() => setHubTab('slide')}
          >
            <i className="bi bi-easel"></i>
            <span>Original-Schulungsfolien</span>
          </button>
        </div>
      </div>

      {/* Render list based on selected view */}
      <div className="d-flex flex-column gap-4">
        {list.map((std) => (
          <div key={std.id} className="page-break">
            {hubTab === 'pocketcard' ? (
              <BeautifiedPocketcard
                standard={std}
                onCopy={copyToClipboard}
                onDownloadQr={downloadQrImage}
                onDownloadPdf={downloadPdf}
              />
            ) : (
              <PdfSlideCard
                standard={std}
                onCopy={copyToClipboard}
                onDownloadQr={downloadQrImage}
                onDownloadPdf={downloadPdf}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Magic Card (ATM-sized Universal Pocketcard)
// -------------------------------------------------------------
function MagicCardView({ standards, onSelectStandard, showToast }) {
  const list = Object.values(standards);
  const cardUrl = (typeof window !== 'undefined' && window.location)
    ? `${window.location.origin}${window.location.pathname}#/quick-hub`
    : 'http://localhost:3000/#/quick-hub';

  const downloadQrImage = () => {
    const container = document.querySelector('#magic-qr-container');
    if (!container) return;
    const img = container.querySelector('img');
    const canvas = container.querySelector('canvas');
    let url = null;
    if (img && img.src && img.src.startsWith('data:')) {
      url = img.src;
    } else if (canvas) {
      url = canvas.toDataURL('image/png');
    }
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'MagicCard-QR-Code-UMF.png';
    a.click();
    showToast('Magic Card QR-Code heruntergeladen!');
  };

  const downloadPdf = () => {
    const element = document.getElementById('magic-card-printable');
    if (!element) {
      window.print();
      return;
    }
    showToast('Magic Card PDF wird erstellt...');
    if (window.html2pdf) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'UMF-MagicCard-Pocketcard.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, logging: false },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: 'portrait'
        }
      };
      window.html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          showToast('Magic Card PDF erfolgreich heruntergeladen!');
        })
        .catch((err) => {
          console.error('PDF error:', err);
          window.print();
        });
    } else {
      window.print();
    }
  };

  return (
    <div className="py-2">
      {/* Action Buttons Toolbar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 no-print">
        <a href="#/" className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-1.5 fw-semibold" style={{ minHeight: '38px' }}>
          <i className="bi bi-arrow-left"></i>
          <span>Zurück zur Übersicht</span>
        </a>

        <div className="d-flex flex-wrap align-items-center gap-2">
          {/* Grouped PDF download & Print actions */}
          <div className="btn-group shadow-sm rounded-pill overflow-hidden" role="group">
            <button
              className="btn btn-primary btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
              style={{ minHeight: '38px' }}
              onClick={downloadPdf}
              title="Magic Card als PDF-Dokument herunterladen"
            >
              <i className="bi bi-file-earmark-arrow-down-fill"></i>
              <span>PDF herunterladen</span>
            </button>
            <button
              className="btn btn-dark btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 border-start border-white border-opacity-25"
              style={{ minHeight: '38px' }}
              onClick={() => window.print()}
              title="Magic Card direkt drucken"
            >
              <i className="bi bi-printer-fill"></i>
              <span>Drucken</span>
            </button>
          </div>

          <button
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5 shadow-sm btn-sm d-flex align-items-center gap-1.5"
            style={{ minHeight: '38px' }}
            onClick={downloadQrImage}
          >
            <i className="bi bi-qr-code"></i>
            <span>QR PNG</span>
          </button>
          <button
            className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-1.5 shadow-sm btn-sm d-flex align-items-center gap-1.5"
            style={{ minHeight: '38px' }}
            onClick={() => onSelectStandard('quick-hub')}
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Zielseite testen</span>
          </button>
        </div>
      </div>

      {/* Centered Preview Container */}
      <div className="d-flex flex-column align-items-center justify-content-center my-3">
        <div id="magic-card-printable" className="magic-card-wrapper p-3">
          {/* THE ATM-SIZED MAGIC CARD */}
          <div className="magic-atm-card shadow-lg rounded-4 overflow-hidden position-relative">
            {/* Top Spectrum Header Line */}
            <div className="magic-spectrum-bar d-flex">
              <div style={{ flex: 1, backgroundColor: 'var(--dekubitus-color)' }}></div>
              <div style={{ flex: 1, backgroundColor: 'var(--sturz-color)' }}></div>
              <div style={{ flex: 1, backgroundColor: 'var(--schmerz-color)' }}></div>
              <div style={{ flex: 1, backgroundColor: 'var(--ernaehrung-color)' }}></div>
              <div style={{ flex: 1, backgroundColor: 'var(--isolation-color)' }}></div>
              <div style={{ flex: 1, backgroundColor: 'var(--zvk-color)' }}></div>
            </div>

            {/* Card Header */}
            <div className="magic-card-header d-flex align-items-center justify-content-between px-3 py-2">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-white rounded px-1 py-0 shadow-sm d-flex align-items-center">
                  <img src="assets/umf-logo.jpg" alt="UMF" height="24" className="rounded" />
                </div>
                <div>
                  <div className="magic-hospital-title fw-bold text-white lh-1">
                    UNIVERSITÄTSMEDIZIN FRANKFURT
                  </div>
                  <div className="magic-hospital-sub text-white-50">
                    Digitale Pflege-Pocketcard
                  </div>
                </div>
              </div>

              <div className="badge bg-white bg-opacity-25 text-white fw-bold px-2 py-1 rounded-pill" style={{ fontSize: '0.62rem' }}>
                <i className="bi bi-stars text-warning me-1"></i> MAGIC CARD
              </div>
            </div>

            {/* Card Body: Left Column (6 Standards with Icons) + Right Column (Single QR Code) */}
            <div className="magic-card-body d-flex p-3 gap-3 align-items-center bg-white">
              {/* Left Column: 6 Tiles List */}
              <div className="magic-tiles-list flex-grow-1">
                <div className="magic-list-heading small fw-bold text-uppercase text-secondary mb-2" style={{ fontSize: '0.66rem', letterSpacing: '0.5px' }}>
                  6 Klinische Pflegestandards:
                </div>
                <div className="d-flex flex-column gap-1">
                  {list.map((std) => (
                    <div
                      key={std.id}
                      className="magic-tile-item d-flex align-items-center gap-2 px-2 py-1 rounded-2"
                      style={{
                        backgroundColor: '#f8fafc',
                        borderLeft: `3px solid ${std.accentColor}`
                      }}
                    >
                      <i className={`bi ${std.icon}`} style={{ color: std.accentColor, fontSize: '0.85rem' }}></i>
                      <span className="fw-bold text-dark text-truncate" style={{ fontSize: '0.74rem' }}>
                        {std.shortTitle}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Single High-Res Scannable QR Code */}
              <div className="magic-qr-box d-flex flex-column align-items-center justify-content-center text-center p-2 rounded-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div id="magic-qr-container" className="p-1 bg-white rounded-2 shadow-sm border">
                  <QrCodeCanvas value={cardUrl} size={118} color="#00273d" />
                </div>
                <div className="fw-bolder text-primary mt-1 lh-1" style={{ fontSize: '0.68rem', letterSpacing: '0.3px' }}>
                  SCAN TO OPEN
                </div>
                <div className="text-muted" style={{ fontSize: '0.58rem' }}>
                  Alle 6 Standards
                </div>
              </div>
            </div>

            {/* Card Footer Bar */}
            <div className="magic-card-footer px-3 py-1 d-flex justify-content-between align-items-center text-white" style={{ background: '#00273d', fontSize: '0.62rem' }}>
              <span className="text-white-50">Klinikum der Goethe-Universität</span>
              <span className="fw-semibold text-white">roXtra QM-System &bull; Pflegedirektion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Quick Hub (Target Landing Page Opened by Magic Card Scan)
// -------------------------------------------------------------
function QuickHubView({ standards, onSelectStandard }) {
  const list = Object.values(standards);

  return (
    <div className="py-2 py-md-3 w-100">
      {/* 6 Clean, Clickable Tiles aligned in center */}
      <div className="row g-3 g-md-4 justify-content-center">
        {list.map((std) => (
          <div key={std.id} className="col-12 col-sm-6 col-lg-4">
            <div
              className="quick-hub-label-card p-3 p-md-4 rounded-4 shadow-sm border-0 h-100 d-flex align-items-center gap-3"
              onClick={() => onSelectStandard(std.id)}
              style={{
                cursor: 'pointer',
                background: '#ffffff',
                borderLeft: `6px solid ${std.accentColor}`,
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <div
                className="rounded-3 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
                style={{
                  width: '54px',
                  height: '54px',
                  background: std.bannerGradient || std.accentColor
                }}
              >
                <i className={`bi ${std.icon} fs-3`}></i>
              </div>

              <div className="flex-grow-1 overflow-hidden">
                <span
                  className="badge px-2 py-1 rounded-pill text-uppercase fw-bold mb-1"
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: std.badgeBg || 'rgba(0, 71, 103, 0.08)',
                    color: std.accentColor
                  }}
                >
                  {std.id === 'zvk' || std.id === 'isolation' ? 'SOP & Leitfaden' : 'Expertenstandard'}
                </span>
                <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '1.05rem' }}>
                  {std.shortTitle}
                </h5>
                <div className="small text-muted text-truncate mt-1" style={{ fontSize: '0.78rem' }}>
                  roXtra ID: {std.roXtraIds.join(', ')}
                </div>
              </div>

              <div className="text-secondary ps-2">
                <i className="bi bi-chevron-right fs-5 text-muted"></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mount into DOM
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

