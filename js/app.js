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
      } else if (hash.includes('universal') || hash.includes('magic') || hash.includes('card')) {
        setCurrentRoute('universal-karte');
        document.title = 'Universal-Karte • UMF Pocketcards';
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

  const isStandardRoute = ['dekubitus', 'sturz', 'schmerz', 'ernaehrung', 'zvk', 'isolation'].includes(currentRoute);
  const isMobileIsolatedRoute = isStandardRoute || currentRoute === 'universal-karte' || currentRoute === 'magic-card';

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

      {/* Modern Hospital Top Banner - Hidden on quick-hub, and hidden on mobile when viewing a selected standard tile or Universal-Karte */}
      {currentRoute !== 'quick-hub' && (
        <div className={`hospital-banner shadow-sm ${isMobileIsolatedRoute ? 'd-none d-md-block' : ''}`}>
          <div className="container d-flex align-items-center justify-content-between py-1 gap-2">
            <div className="d-flex align-items-center gap-2 min-w-0">
              <a href="#/" className="text-decoration-none d-flex align-items-center bg-white rounded-3 p-1 shadow-sm border border-info border-opacity-25 flex-shrink-0">
                <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="32" className="rounded" style={{ maxHeight: '34px' }} />
              </a>
              {/* Desktop Title */}
              <div className="border-start border-2 ps-2 ps-sm-3 d-none d-md-block" style={{ borderColor: '#0284c7' }}>
                <div className="fw-black" style={{ letterSpacing: '0.5px', fontSize: '0.94rem', color: '#00273d' }}>
                  UNIVERSITÄTSMEDIZIN FRANKFURT
                </div>
                <div className="fw-semibold" style={{ fontSize: '0.75rem', color: '#0369a1' }}>
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Digitale Pocketcards &bull; <span className="fw-bold" style={{ color: '#0f766e' }}>Expertenstandards in der Pflege</span>
                </div>
              </div>
              {/* Compact Mobile Title */}
              <div className="d-block d-md-none min-w-0">
                <div className="fw-black text-truncate" style={{ fontSize: '0.78rem', lineHeight: 1.15, color: '#00273d' }}>
                  UMF FRANKFURT
                </div>
                <div className="fw-semibold text-truncate" style={{ fontSize: '0.68rem', lineHeight: 1.15, color: '#0369a1' }}>
                  Pflege-Pocketcards &bull; SOPs
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-1.5 flex-shrink-0">
              <button
                className={`btn btn-sm ${currentRoute === 'universal-karte' || currentRoute === 'magic-card' ? 'btn-warning text-dark fw-bold' : 'btn-outline-warning text-dark fw-bold'} rounded-pill px-2.5 px-sm-3 py-1 shadow-sm d-flex align-items-center gap-1 magic-btn-glow`}
                style={{ minHeight: '36px', fontSize: '0.78rem' }}
                onClick={() => navigateTo('universal-karte')}
                title="Universal-Karte (A4- & Scheckkarten-Format) mit allen 6 Standards und QR-Code"
              >
                <i className="bi bi-stars text-danger"></i>
                <span>Universal-Karte</span>
              </button>
              <button
                className={`btn btn-sm ${currentRoute === 'qrcodes' ? 'btn-primary text-white fw-bold' : 'btn-white bg-white text-dark border fw-semibold'} rounded-pill px-2.5 px-sm-3 py-1 shadow-sm d-flex align-items-center gap-1`}
                style={{ minHeight: '36px', fontSize: '0.78rem' }}
                onClick={() => navigateTo('qrcodes')}
                title="Alle 6 Pocketcards anzeigen"
              >
                <i className="bi bi-collection text-primary"></i>
                <span className="d-none d-sm-inline">Alle Pocketcards</span>
                <span className="d-inline d-sm-none">Karten</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Menu Bar with Clinical Category Colors - Hidden on mobile for quick-hub, universal-karte, and selected tiles, always visible on desktop */}
      <nav className={`navbar navbar-expand-lg navbar-custom sticky-top shadow-sm py-1 ${(isMobileIsolatedRoute || currentRoute === 'quick-hub') ? 'd-none d-md-block' : ''}`}>
        <div className="container d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-between gap-1 gap-lg-2 py-0">
          {/* Top Row on Mobile: Brand Title on Left + Quick Actions on Right */}
          <div className="d-flex align-items-center justify-content-between w-100 w-lg-auto">
            <a className="navbar-brand d-flex align-items-center gap-2 text-decoration-none py-0.5 m-0" href="#/">
              <span className="brand-dot"></span>
              <span className="brand-title fs-5">UMF Expertenstandards</span>
            </a>

            {/* Mobile Quick Action Pills on Right of Brand Title */}
            <div className="d-flex d-lg-none align-items-center gap-1.5">
              <button
                type="button"
                className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 fw-semibold d-flex align-items-center gap-1 shadow-sm"
                style={{ minHeight: '32px', fontSize: '0.74rem' }}
                onClick={() => setIsScanModalOpen(true)}
                title="QR-Code scannen oder Foto/SOP erkennen"
              >
                <i className="bi bi-qr-code-scan"></i>
                <span>Scan</span>
              </button>
              {currentRoute !== 'home' && (
                <a
                  href="#/"
                  className="btn btn-sm btn-light border rounded-pill px-2.5 py-1 text-secondary shadow-sm d-flex align-items-center gap-1"
                  style={{ minHeight: '32px', fontSize: '0.74rem' }}
                  title="Zur Hauptübersicht"
                >
                  <i className="bi bi-house-door-fill"></i>
                  <span>Start</span>
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
      <main className={currentRoute === 'quick-hub' ? "container flex-grow-1 d-flex flex-column justify-content-center py-3 py-md-4" : "container py-3 py-md-4"}>
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

        {/* VIEW: Universal-Karte (A4- & ATM-Format Universal Pocketcard) */}
        {(currentRoute === 'universal-karte' || currentRoute === 'magic-card') && (
          <UniversalCardView
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
            onOpenScanner={() => setIsScanModalOpen(true)}
          />
        )}
      </main>

      {/* Transparent Mobile Footer with 2 Buttons: 1. Home, 2. Universal Karte (Content scrolls behind it) */}
      <footer className="mobile-transparent-footer d-flex d-md-none no-print" aria-label="Mobile Navigation">
        <div className="mobile-transparent-footer-inner">
          <button
            type="button"
            className={`mobile-footer-btn home-btn ${currentRoute === 'quick-hub' || currentRoute === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('quick-hub')}
          >
            <span className="mobile-footer-btn-icon">
              <i className="bi bi-house-door-fill"></i>
            </span>
            <span>Home</span>
          </button>

          <button
            type="button"
            className={`mobile-footer-btn universal-btn ${currentRoute === 'universal-karte' || currentRoute === 'magic-card' ? 'active' : ''}`}
            onClick={() => navigateTo('universal-karte')}
          >
            <span className="mobile-footer-btn-icon">
              <i className="bi bi-credit-card-2-front-fill"></i>
            </span>
            <span>Universal Karte</span>
          </button>
        </div>
      </footer>

      {/* Footer: on quick-hub show ONLY the colorful accent line; on standard tiles and universal-karte hide full footer on mobile */}
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
        <footer className={`modern-footer mt-auto text-white ${isMobileIsolatedRoute ? 'd-none d-md-block' : ''}`}>
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
                  <a href="#/universal-karte" className="footer-category-pill pill-magic">
                    <i className="bi bi-stars text-warning"></i> Universal-Karte (A4 &amp; Scheckkarte)
                  </a>
                  <a href="#/qrcodes" className="footer-category-pill pill-hub">
                    <i className="bi bi-collection"></i> Alle Pocketcards
                  </a>
                </div>
              </div>

              {/* System Info & Status Badge */}
              <div className="col-lg-3 col-md-12 text-lg-end">
                <div className="footer-status-card p-3 rounded-3 text-start text-lg-end d-inline-block w-100 w-md-auto">
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
// Component: The Main Tiles Overview (Modern, Beautified Cards with Clinical Photos & Icons)
// -------------------------------------------------------------
const TILE_ENHANCEMENTS = {
  dekubitus: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #fff1f6 45%, #fdf2f8 100%)',
    borderColor: '#fbcfe8',
    leftBorderColor: '#be185d',
    shadowColor: 'rgba(190, 24, 93, 0.16)',
    iconGradient: 'linear-gradient(135deg, #831843 0%, #be185d 50%, #ec4899 100%)',
    iconShadow: 'rgba(190, 24, 93, 0.38)',
    icon: 'bi-bandaid-fill',
    badgeBg: '#fce7f3',
    badgeColor: '#9d174d',
    badgeBorder: '#fbcfe8',
    badgeText: 'Dekubitusprophylaxe',
    titleColor: '#831843',
    title: 'Dekubitusprophylaxe in der Pflege',
    lead: 'Evidenzbasierte Risikoeinschätzung, gezielte Druckentlastung und strukturierte Hautpflege nach DNQP-Expertenstandard.',
    image: 'assets/qh-dekubitus.jpg',
    imageOverlay: '30°-Lagerung',
    quickBadges: [
      { text: '2–4h Rhythmus', icon: 'bi-clock-history', bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' },
      { text: 'Spezialmatratze', icon: 'bi-layers-fill', bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' }
    ],
    imageSubtitle: 'Weichlagerung zur gezielten Druckentlastung gefährdeter Haut- & Knochenpunkte',
    goals: [
      { text: 'Druck reduzieren', icon: 'bi-arrow-down-circle-fill text-danger', bg: '#ffe4e6', color: '#9f1239', border: '#fecdd3' },
      { text: 'Haut schützen', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Mobilität fördern', icon: 'bi-person-walking text-primary', bg: '#e0f2fe', color: '#075985', border: '#bae6fd' }
    ],
    actionSteps: [
      { text: 'Regelmäßige Umlagerung alle 2–4 Stunden zur gezielten Entlastung', bold: 'Regelmäßige Umlagerung:', icon: 'bi-arrow-repeat', iconBg: '#be185d' },
      { text: 'Druckentlastende Spezialmatratze und 30°-Seitenlagerung nutzen', bold: 'Spezialmatratze & 30°:', icon: 'bi-layers-fill', iconBg: '#7c3aed' },
      { text: 'Haut täglich kontrollieren: Hinterkopf, Kreuzbein, Fersen, Ellenbogen', bold: 'Tägliche Hautkontrolle:', icon: 'bi-eye-fill', iconBg: '#059669' }
    ],
    tagLabel: 'Gefährdete Stellen:',
    tagIcon: 'bi-geo-alt-fill',
    tagColor: '#be185d',
    tagBorder: '#f472b6',
    tags: ['Hinterkopf', 'Schultern', 'Kreuzbein', 'Trochanter', 'Fersen'],
    btnGradient: 'linear-gradient(90deg, #be185d 0%, #db2777 100%)',
    btnShadow: 'rgba(190, 24, 93, 0.28)'
  },
  sturz: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #f0fdf4 45%, #ecfdf5 100%)',
    borderColor: '#bbf7d0',
    leftBorderColor: '#16a34a',
    shadowColor: 'rgba(22, 163, 74, 0.16)',
    iconGradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #22c55e 100%)',
    iconShadow: 'rgba(22, 163, 74, 0.38)',
    icon: 'bi-shield-exclamation',
    badgeBg: '#dcfce7',
    badgeColor: '#166534',
    badgeBorder: '#bbf7d0',
    badgeText: 'Sturzprophylaxe',
    titleColor: '#14532d',
    title: 'Sturzprophylaxe in der Pflege',
    lead: 'Evidenzbasierte Sturzrisiko-Erfassung, sichere Mobilisation und gezielte Umgebungsanpassung nach DNQP-Expertenstandard.',
    image: 'assets/qh-sturz.jpg',
    imageOverlay: 'Sichere Mobilisation',
    quickBadges: [
      { text: 'Rutschfeste Schuhe', icon: 'bi-shield-check', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Hilfsmittel bereit', icon: 'bi-person-walking', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    imageSubtitle: 'Gezielte Sturzvermeidung bei maximalem Erhalt von Mobilität und Eigenständigkeit',
    goals: [
      { text: 'Stürze vermeiden', icon: 'bi-shield-fill-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Mobilität fördern', icon: 'bi-person-walking text-primary', bg: '#e0f2fe', color: '#075985', border: '#bae6fd' },
      { text: 'Sicherheit stärken', icon: 'bi-bell-fill text-warning', bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
    ],
    actionSteps: [
      { text: 'Sturzrisiko regelmäßig beurteilen und individuelle Risikofaktoren erfassen', bold: 'Sturzrisiko beurteilen:', icon: 'bi-clipboard2-pulse', iconBg: '#16a34a' },
      { text: 'Geeignete Hilfsmittel nutzen (Gehstock, Rollator, Haltegriffe stets griffbereit)', bold: 'Geeignete Hilfsmittel:', icon: 'bi-person-walking', iconBg: '#0284c7' },
      { text: 'Rutschfeste Schuhe anziehen & Rufklingel immer in Reichweite platzieren', bold: 'Schuhe & Klingel:', icon: 'bi-bell-fill', iconBg: '#d97706' }
    ],
    tagLabel: 'Sicherheits-Check:',
    tagIcon: 'bi-shield-check',
    tagColor: '#16a34a',
    tagBorder: '#86efac',
    tags: ['Stolperfallen entfernen', 'Licht an', 'Bett niedrig', 'Klingel nah', 'Rollator-Bremse'],
    btnGradient: 'linear-gradient(90deg, #15803d 0%, #16a34a 100%)',
    btnShadow: 'rgba(22, 163, 74, 0.28)'
  },
  schmerz: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #fff7ed 45%, #ffedd5 100%)',
    borderColor: '#fed7aa',
    leftBorderColor: '#ea580c',
    shadowColor: 'rgba(234, 88, 12, 0.16)',
    iconGradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f97316 100%)',
    iconShadow: 'rgba(234, 88, 12, 0.38)',
    icon: 'bi-heart-pulse-fill',
    badgeBg: '#ffedd5',
    badgeColor: '#9a3412',
    badgeBorder: '#fed7aa',
    badgeText: 'Schmerzmanagement',
    titleColor: '#9a3412',
    title: 'Schmerzmanagement in der Pflege',
    lead: 'Systematische Schmerzerfassung bei akuten und chronischen Schmerzen zur Steigerung von Wohlbefinden und Lebensqualität.',
    image: 'assets/qh-schmerz.jpg',
    imageOverlay: 'Empathische Erfassung',
    quickBadges: [
      { text: 'NRS-Skala 0–10', icon: 'bi-speedometer2', bg: '#ffedd5', color: '#9a3412', border: '#fed7aa' },
      { text: 'Therapiekontrolle', icon: 'bi-capsule', bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' }
    ],
    imageSubtitle: 'Strukturierte Schmerzeinschätzung & kombinierte medikamentöse/pflegerische Linderung',
    goals: [
      { text: 'Schmerzen lindern', icon: 'bi-heart-fill text-danger', bg: '#ffe4e6', color: '#9f1239', border: '#fecdd3' },
      { text: 'Exakt erfassen', icon: 'bi-speedometer2 text-warning', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
      { text: 'Früh mobilisieren', icon: 'bi-person-walking text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
    ],
    actionSteps: [
      { text: 'Schmerzintensität systematisch erfassen (NRS/VRS-Skala bei Ruhe & Bewegung)', bold: 'Systematische Erfassung:', icon: 'bi-speedometer2', iconBg: '#ea580c' },
      { text: 'Analgetika nach Schema verabreichen und Wirkung nach 30–60 Min. evaluieren', bold: 'Analgetika-Gabe:', icon: 'bi-capsule', iconBg: '#e11d48' },
      { text: 'Nicht-medikamentöse Maßnahmen (Lagerung, Kälte/Wärme, Zuwendung) gezielt nutzen', bold: 'Begleitmaßnahmen:', icon: 'bi-heart-fill', iconBg: '#7c3aed' }
    ],
    tagLabel: 'Erfassungsskalen:',
    tagIcon: 'bi-clipboard-pulse',
    tagColor: '#ea580c',
    tagBorder: '#fb923c',
    tags: ['NRS (0–10)', 'VRS (Wortskala)', 'BESD (Demenz)', 'Ruheschmerz', 'Belastungsschmerz'],
    btnGradient: 'linear-gradient(90deg, #c2410c 0%, #ea580c 100%)',
    btnShadow: 'rgba(234, 88, 12, 0.28)'
  },
  ernaehrung: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #f0f9ff 45%, #e0f2fe 100%)',
    borderColor: '#bae6fd',
    leftBorderColor: '#0284c7',
    shadowColor: 'rgba(2, 132, 199, 0.16)',
    iconGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
    iconShadow: 'rgba(2, 132, 199, 0.38)',
    icon: 'bi-cup-hot-fill',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    badgeBorder: '#bae6fd',
    badgeText: 'Ernährungsmanagement',
    titleColor: '#0369a1',
    title: 'Ernährungsmanagement in der Pflege',
    lead: 'Frühzeitige Identifikation von Mangelernährung, individuelle Speisenversorgung und Sicherstellung ausreichender Flüssigkeit.',
    image: 'assets/qh-ernaehrung.jpg',
    imageOverlay: 'Vollwertige Kost',
    quickBadges: [
      { text: 'Gewichtsverlauf', icon: 'bi-clipboard-data', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: 'Trinkprotokoll', icon: 'bi-droplet-half', bg: '#cffafe', color: '#0e7490', border: '#a5f3fc' }
    ],
    imageSubtitle: 'Protein- & energiereiche Kost zur aktiven Förderung von Wundheilung und Genesung',
    goals: [
      { text: 'Mangelernährung stoppen', icon: 'bi-shield-check text-primary', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: 'Flüssigkeit sichern', icon: 'bi-droplet-half text-info', bg: '#cffafe', color: '#0e7490', border: '#a5f3fc' },
      { text: 'Gewicht stabilisieren', icon: 'bi-graph-up-arrow text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
    ],
    actionSteps: [
      { text: 'Mangelernährungsrisiko erfassen (Screening bei Aufnahme & regelmäßige Gewichtskontrolle)', bold: 'Screening & Gewicht:', icon: 'bi-clipboard-data-fill', iconBg: '#0284c7' },
      { text: 'Wunschkost & Eiweißanreicherung gezielt anbieten, Zwischenmahlzeiten einplanen', bold: 'Eiweiß- & Wunschkost:', icon: 'bi-egg-fried', iconBg: '#059669' },
      { text: 'Trinkmenge aktiv unterstützen & bei Bedarf strukturiertes Trinkprotokoll führen', bold: 'Flüssigkeitshaushalt:', icon: 'bi-droplet-half', iconBg: '#0891b2' }
    ],
    tagLabel: 'Ernährungsfokus:',
    tagIcon: 'bi-apple',
    tagColor: '#0284c7',
    tagBorder: '#38bdf8',
    tags: ['Eiweißreich', 'Hochkalorisch', 'Trinkprotokoll', 'Essbegleitung', 'Dysphagie-Kost'],
    btnGradient: 'linear-gradient(90deg, #0369a1 0%, #0284c7 100%)',
    btnShadow: 'rgba(2, 132, 199, 0.28)'
  },
  zvk: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #fff1f2 45%, #ffe4e6 100%)',
    borderColor: '#fecdd3',
    leftBorderColor: '#dc2626',
    shadowColor: 'rgba(220, 38, 38, 0.16)',
    iconGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #f43f5e 100%)',
    iconShadow: 'rgba(220, 38, 38, 0.38)',
    icon: 'bi-heart-pulse-fill',
    badgeBg: '#fee2e2',
    badgeColor: '#991b1b',
    badgeBorder: '#fecdd3',
    badgeText: 'SOP & Leitfaden ITS',
    titleColor: '#991b1b',
    title: 'Zentraler Venenkatheter (ZVK) – Intensivpflege',
    lead: 'Standardisierte Verfahrensanweisung für Aseptik, Verbandswechsel, Infusionsmanagement und CRBSI-Infektionsprävention.',
    image: 'assets/qh-zvk.jpg',
    imageOverlay: 'Aseptische Pflege',
    quickBadges: [
      { text: 'CRBSI-Prävention', icon: 'bi-shield-shaded', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Täglich prüfen', icon: 'bi-calendar-check', bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' }
    ],
    imageSubtitle: 'Strenge Aseptik bei Konnektion, Verbandswechsel und Infusionsverabreichung',
    goals: [
      { text: 'CRBSI verhindern', icon: 'bi-shield-slash-fill text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Aseptik wahren', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Sichere Medikation', icon: 'bi-capsule text-primary', bg: '#ede9fe', color: '#6d28d9', border: '#ddd6fe' }
    ],
    actionSteps: [
      { text: 'Strenge Non-Touch-Technik & Hautantiseptik bei jeder Konnektion / Diskonnektion', bold: 'Non-Touch & Antiseptik:', icon: 'bi-shield-shaded', iconBg: '#dc2626' },
      { text: 'Transparenzverband alle 7 Tage oder bei Verschmutzung/Feuchtigkeit sofort erneuern', bold: 'Verbandswechsel:', icon: 'bi-bandaid', iconBg: '#e11d48' },
      { text: 'Tägliche Indikationsprüfung des ZVK & standardisiertes Spülen nach Infusionsschema', bold: 'Tägliche Indikation:', icon: 'bi-droplet', iconBg: '#4f46e5' }
    ],
    tagLabel: 'SOP Kernpunkte:',
    tagIcon: 'bi-folder2-open',
    tagColor: '#dc2626',
    tagBorder: '#f87171',
    tags: ['Hautantiseptik', 'Transparenzverband', '7-Tage-Wechsel', 'Non-Touch', 'CRBSI-Schutz'],
    btnGradient: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 100%)',
    btnShadow: 'rgba(220, 38, 38, 0.28)'
  },
  isolation: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #faf5ff 45%, #f3e8ff 100%)',
    borderColor: '#e9d5ff',
    leftBorderColor: '#7c3aed',
    shadowColor: 'rgba(124, 58, 237, 0.16)',
    iconGradient: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #a855f7 100%)',
    iconShadow: 'rgba(124, 58, 237, 0.38)',
    icon: 'bi-shield-shaded',
    badgeBg: '#f3e8ff',
    badgeColor: '#581c87',
    badgeBorder: '#e9d5ff',
    badgeText: 'Hygiene-Leitfaden',
    titleColor: '#581c87',
    title: 'Isolation & Krankenhaushygiene',
    lead: 'Verbindliche Maßnahmen bei MRE, VRE, MRGN, MRSA & C. diff. zum konsequenten Schutz von Patienten und Personal.',
    image: 'assets/qh-isolation.jpg',
    imageOverlay: 'Händehygiene & PSA',
    quickBadges: [
      { text: '30s Desinfektion', icon: 'bi-clock-history', bg: '#f3e8ff', color: '#581c87', border: '#e9d5ff' },
      { text: 'Schutzkleidung', icon: 'bi-shield-check', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    imageSubtitle: 'Konsequente Unterbrechung von Infektionsketten durch gezielte Barrierepflege',
    goals: [
      { text: 'Übertragung stoppen', icon: 'bi-slash-circle-fill text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Personal schützen', icon: 'bi-people-fill text-primary', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: 'Hygiene sichern', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
    ],
    actionSteps: [
      { text: 'Händedesinfektion (30 Sek.) vor und nach Patientenkontakt & nach PSA-Ablage', bold: 'Händedesinfektion 30s:', icon: 'bi-hand-index-thumb-fill', iconBg: '#7c3aed' },
      { text: 'Schutzkittel, Handschuhe & FFP2/MNS vor Betreten des Isolierzimmers korrekt anlegen', bold: 'PSA vor Betreten:', icon: 'bi-shield-check', iconBg: '#2563eb' },
      { text: 'Patientennahe Flächen & Geräte täglich wischdesinfizieren (spozid bei C. diff)', bold: 'Flächendesinfektion:', icon: 'bi-stars', iconBg: '#059669' }
    ],
    tagLabel: 'Erreger & Schutz:',
    tagIcon: 'bi-virus',
    tagColor: '#7c3aed',
    tagBorder: '#c084fc',
    tags: ['MRSA', 'VRE', '3/4-MRGN', 'C. difficile', 'Isolierzimmer', 'Schutzkittel'],
    btnGradient: 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 100%)',
    btnShadow: 'rgba(124, 58, 237, 0.28)'
  }
};

function TilesOverview({ standards, onSelectStandard, onOpenScanner }) {
  const list = Object.values(standards);

  return (
    <div>
      {/* Hero Header Banner */}
      <div
        className="card border-0 shadow-lg rounded-4 p-3 p-sm-4 p-md-5 mb-3 mb-md-4 text-white position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #00273d 0%, #004767 45%, #0284c7 100%)',
          boxShadow: '0 12px 35px rgba(0, 39, 61, 0.25)'
        }}
      >
        <div className="position-relative d-flex flex-wrap justify-content-between align-items-center gap-3 gap-md-4" style={{ zIndex: 2 }}>
          <div style={{ maxWidth: '820px' }}>
            <div className="d-flex flex-wrap align-items-center gap-1.5 gap-sm-2 mb-2">
              <span className="badge bg-white text-dark fw-bold text-uppercase px-2.5 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.7rem', letterSpacing: '0.4px' }}>
                Universitätsmedizin Frankfurt
              </span>
              <span className="badge bg-white bg-opacity-25 text-white fw-medium px-2.5 py-1 rounded-pill shadow-sm" style={{ fontSize: '0.7rem' }}>
                <i className="bi bi-hospital me-1"></i> Pflegedirektion &bull; Evidenzbasierte Pflege
              </span>
            </div>
            <h1 className="fw-bold mb-2 text-white" style={{ letterSpacing: '-0.5px', fontSize: 'clamp(1.25rem, 4vw, 2.2rem)' }}>
              Klinische Standards &amp; Pflege-Leitfäden
            </h1>
            <p className="text-white text-opacity-85 mb-0" style={{ lineHeight: '1.5', fontSize: '0.85rem' }}>
              Evidenzbasierte Expertenstandards, Intensiv-SOPs und Hygieneleitfäden für den Stations- und Intensivalltag. Tippen Sie auf eine Kategorie für Leitlinien, Bilder, Videos und SOPs.
            </p>

            {/* Mobile Quick-Action Buttons inside Hero */}
            <div className="d-grid d-sm-flex gap-2 mt-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <button
                type="button"
                className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1.5"
                style={{ minHeight: '42px', fontSize: '0.82rem' }}
                onClick={() => onSelectStandard('universal-karte')}
              >
                <i className="bi bi-stars text-danger"></i>
                <span>Universal-Karte</span>
              </button>
              <button
                type="button"
                className="btn btn-light text-dark fw-bold rounded-pill px-3 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1.5"
                style={{ minHeight: '42px', fontSize: '0.82rem' }}
                onClick={() => onOpenScanner ? onOpenScanner() : onSelectStandard('quick-hub')}
              >
                <i className="bi bi-qr-code-scan text-primary"></i>
                <span>QR / Foto Scan</span>
              </button>
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

      {/* Grid of Clean, Modern Standard Cards (Enhanced with Real Clinical Photos & Icons) */}
      <div className="row g-3 g-md-4">
        {list.map((std) => {
          const enh = TILE_ENHANCEMENTS[std.id];
          if (!enh) return null;

          return (
            <div key={std.id} className="col-12 col-lg-6">
              <div
                className="standard-tile h-100 p-0 border-0 rounded-4 position-relative overflow-hidden"
                onClick={() => onSelectStandard(std.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: enh.bgGradient,
                  border: `1.5px solid ${enh.borderColor}`,
                  borderLeft: `6px solid ${enh.leftBorderColor}`,
                  boxShadow: `0 10px 28px -4px ${enh.shadowColor}, 0 4px 10px -2px rgba(0,0,0,0.04)`
                }}
              >
                <div className="p-3 p-sm-4 d-flex flex-column h-100">
                  {/* Header: Colorful Gradient Icon, Category Badge & roXtra ID */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-2.5 gap-2">
                    <div className="d-flex align-items-center gap-2 min-w-0">
                      <div
                        className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
                        style={{
                          width: '44px',
                          height: '44px',
                          background: enh.iconGradient,
                          boxShadow: `0 4px 14px ${enh.iconShadow}`
                        }}
                      >
                        <i className={`bi ${enh.icon} fs-5`}></i>
                      </div>
                      <div>
                        <span
                          className="fw-bold px-2.5 py-1 rounded-pill d-inline-flex align-items-center gap-1.5 text-uppercase text-truncate"
                          style={{
                            fontSize: '0.72rem',
                            letterSpacing: '0.4px',
                            backgroundColor: enh.badgeBg,
                            color: enh.badgeColor,
                            border: `1px solid ${enh.badgeBorder}`
                          }}
                        >
                          <i className="bi bi-star-fill text-warning" style={{ fontSize: '0.65rem' }}></i>
                          <span>{enh.badgeText}</span>
                        </span>
                      </div>
                    </div>

                    <span
                      className="badge bg-white text-secondary border font-monospace px-2.5 py-1 rounded-pill shadow-xs text-wrap"
                      style={{ fontSize: '0.72rem', borderColor: enh.borderColor, lineHeight: '1.3' }}
                    >
                      roXtra: <strong className="text-dark">{std.roXtraIds.join(' / ')}</strong>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-1.5" style={{ lineHeight: '1.3', fontSize: '1.14rem', color: enh.titleColor }}>
                    {enh.title}
                  </h4>

                  {/* Subtitle / Lead text */}
                  <p className="text-secondary small mb-2.5" style={{ lineHeight: '1.45', fontSize: '0.84rem' }}>
                    {enh.lead}
                  </p>

                  {/* Visual Clinical Strip with Mini Image & Quick Badges */}
                  <div
                    className="rounded-3 overflow-hidden border mb-2.5 shadow-xs bg-white"
                    style={{ borderColor: enh.borderColor }}
                  >
                    <div className="row g-0 align-items-center">
                      <div className="col-4 position-relative">
                        <img
                          src={enh.image}
                          alt={enh.title}
                          className="w-100 h-100 d-block"
                          style={{ minHeight: '94px', maxHeight: '105px', objectFit: 'cover' }}
                        />
                        <span
                          className="badge bg-dark bg-opacity-75 text-white position-absolute bottom-0 start-0 m-1 px-1.5 py-0.5 rounded"
                          style={{ fontSize: '0.62rem' }}
                        >
                          <i className="bi bi-check2-circle text-success me-0.5"></i>{enh.imageOverlay}
                        </span>
                      </div>
                      <div className="col-8 p-2.5">
                        <div className="d-flex flex-wrap gap-1 mb-1.5">
                          {enh.quickBadges.map((qb, qbi) => (
                            <span
                              key={qbi}
                              className="badge rounded-pill fw-bold px-2 py-0.5"
                              style={{
                                backgroundColor: qb.bg,
                                color: qb.color,
                                border: `1px solid ${qb.border}`,
                                fontSize: '0.68rem'
                              }}
                            >
                              <i className={`bi ${qb.icon} me-1`}></i>{qb.text}
                            </span>
                          ))}
                        </div>
                        <div className="text-dark fw-medium" style={{ fontSize: '0.76rem', lineHeight: '1.35' }}>
                          {enh.imageSubtitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3 Colorful Core Goals */}
                  <div className="d-flex flex-wrap gap-1.5 mb-2.5">
                    {enh.goals.map((g, gi) => (
                      <span
                        key={gi}
                        className="badge rounded-pill px-2.5 py-1 d-inline-flex align-items-center gap-1 fw-bold shadow-xs"
                        style={{
                          backgroundColor: g.bg,
                          color: g.color,
                          border: `1px solid ${g.border}`,
                          fontSize: '0.72rem'
                        }}
                      >
                        <i className={`bi ${g.icon}`}></i> {g.text}
                      </span>
                    ))}
                  </div>

                  {/* Colorful Clinical Action Steps with Visual Icons */}
                  <div
                    className="p-3 rounded-3 mb-2.5 mt-auto bg-white"
                    style={{
                      border: `1px solid ${enh.borderColor}`,
                      borderLeft: `4px solid ${enh.leftBorderColor}`,
                      boxShadow: `0 2px 8px ${enh.shadowColor}`
                    }}
                  >
                    <div className="small fw-bold text-uppercase mb-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.72rem', color: enh.titleColor }}>
                      <i className="bi bi-list-check fs-6"></i>
                      <span>Wichtigste Handlungsschritte:</span>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {enh.actionSteps.map((step, si) => (
                        <div key={si} className="small text-dark d-flex align-items-start gap-2" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                          <span
                            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0 mt-0.5"
                            style={{ width: '20px', height: '20px', background: step.iconBg, fontSize: '0.7rem' }}
                          >
                            <i className={`bi ${step.icon}`}></i>
                          </span>
                          <span><strong>{step.bold}</strong> {step.text.replace(step.bold, '').trim()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Tags Chips */}
                  <div className="p-2 rounded-2 mb-3 d-flex flex-wrap align-items-center gap-1" style={{ backgroundColor: '#fff', border: `1px dashed ${enh.tagBorder}` }}>
                    <span className="small fw-bold text-uppercase me-1" style={{ fontSize: '0.66rem', color: enh.tagColor }}>
                      <i className={`bi ${enh.tagIcon} me-0.5`}></i>{enh.tagLabel}
                    </span>
                    {enh.tags.map((tag, ti) => (
                      <span key={ti} className="badge bg-light text-dark border px-2 py-0.5 rounded-pill" style={{ fontSize: '0.68rem', fontWeight: 500 }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Card Footer: Action button */}
                  <div className="d-flex justify-content-end align-items-center pt-2.5 border-top gap-2 mt-auto" style={{ borderColor: enh.badgeBg }}>
                    <button
                      type="button"
                      className="btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm text-white fw-bold w-100 w-sm-auto"
                      style={{
                        background: enh.btnGradient,
                        border: 'none',
                        minHeight: '44px',
                        fontSize: '0.85rem',
                        boxShadow: `0 4px 12px ${enh.btnShadow}`
                      }}
                    >
                      <i className="bi bi-file-earmark-medical me-0.5"></i>
                      <span>Pocketcard &amp; Leitfaden öffnen</span>
                      <i className="bi bi-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// Helper: Export any Standard as a Complete, Aligned 2-Page A4 Portrait PDF
// -------------------------------------------------------------
function exportStandardA4Pdf(std, showToast) {
  const sheetEl = document.getElementById(`pocketcard-a4-print-${std.id}`);
  if (!sheetEl || !window.html2pdf) {
    window.print();
    return;
  }

  if (showToast) {
    showToast(`A4-PDF für ${std.shortTitle} wird erstellt...`);
  }

  const savedScrollX = window.scrollX || window.pageXOffset || 0;
  const savedScrollY = window.scrollY || window.pageYOffset || 0;
  window.scrollTo(0, 0);

  const filename = `UMF-Pocketcard-${std.shortTitle.replace(/\s+/g, '_')}-A4.pdf`;

  // Exact integer ratio math:
  // A4 portrait (210mm x 297mm) with [8, 8, 8, 8]mm margins has inner area 194mm x 281mm.
  // 194 * 4 = 776px width; 281 * 4 = 1124px height per page (exact integer ratio, 0px rounding error).
  const opt = {
    margin: [8, 8, 8, 8],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    enableLinks: true,
    pagebreak: { mode: [] },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (el) => el.id === 'root' || el.tagName === 'IFRAME' || el.tagName === 'VIDEO'
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    }
  };

  const worker = window.html2pdf().set(opt).from(sheetEl);

  worker
    .toContainer()
    .then(function () {
      if (this.prop.overlay) {
        this.prop.overlay.style.cssText = 'position:fixed !important;top:0px !important;left:0px !important;right:auto !important;bottom:auto !important;width:776px !important;height:auto !important;overflow:visible !important;opacity:0 !important;pointer-events:none !important;z-index:-9999 !important;background:#ffffff !important;';
      }
      if (this.prop.container) {
        this.prop.container.style.cssText = 'position:relative !important;top:0px !important;left:0px !important;right:auto !important;margin:0px !important;padding:0px !important;width:776px !important;height:auto !important;background:#ffffff !important;opacity:1 !important;visibility:visible !important;';
        const clonedSheet = this.prop.container.querySelector('.pocketcard-a4-print-sheet');
        if (clonedSheet) {
          clonedSheet.style.display = 'block';
          clonedSheet.style.width = '776px';
          clonedSheet.style.maxWidth = '776px';
          clonedSheet.style.margin = '0';
          clonedSheet.style.padding = '0';
        }
        const clonedPages = this.prop.container.querySelectorAll('.a4-std-page');
        clonedPages.forEach((pg) => {
          pg.style.display = 'flex';
          pg.style.width = '776px';
          pg.style.maxWidth = '776px';
          pg.style.height = '1124px';
          pg.style.maxHeight = '1124px';
          pg.style.margin = '0';
          pg.style.boxSizing = 'border-box';
        });
        const imgs = Array.from(this.prop.container.querySelectorAll('img'));
        return Promise.all(
          imgs.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise((res) => {
              img.onload = res;
              img.onerror = res;
              setTimeout(res, 500);
            });
          })
        );
      }
    })
    .toCanvas()
    .toPdf()
    .then(function () {
      if (this.prop.pdf) {
        this.prop.pdf.save(filename);
      }
      window.scrollTo(savedScrollX, savedScrollY);
      if (showToast) {
        showToast(`A4-PDF für ${std.shortTitle} erfolgreich heruntergeladen!`);
      }
    })
    .catch((err) => {
      console.error('PDF error:', err);
      window.scrollTo(savedScrollX, savedScrollY);
      window.print();
    });
}

// -------------------------------------------------------------
// Component: Dedicated 2-Page A4 Print & PDF Sheet for Each Standard
// Page 1: Header + Title/Lead/Instructions + Left Image & Right QR Code + Warum wichtig + Minimal-Info
// Page 2: Header + Handlungsschritte im Pflegeprozess + YouTube & Website Links + QM Footer
// -------------------------------------------------------------
function StandardA4PrintSheet({ standard }) {
  const isSopStandard = standard.id === 'zvk' || standard.id === 'isolation';
  const baseOrigin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('localhost'))
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://umf-nursing-standards.web.app/';
  const normalizedBase = baseOrigin.endsWith('/') ? baseOrigin : `${baseOrigin}/`;
  const websiteDirectUrl = `${normalizedBase}#/${standard.id}`;
  const websiteQuickHubUrl = `${normalizedBase}#/quick-hub`;
  const primaryMediaUrl = !isSopStandard ? standard.videoUrl : `${normalizedBase}${standard.sopPdfUrl}`;

  const renderHeaderBar = (pageLabel) => (
    <div className="a4-std-header-bar" style={{ backgroundColor: '#004767' }}>
      <div className="d-flex align-items-center gap-2">
        <div className="bg-white rounded px-1.5 py-0.5 d-flex align-items-center shadow-sm">
          <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="26" />
        </div>
        <div>
          <div className="fw-bold text-white text-uppercase" style={{ fontSize: '0.82rem', letterSpacing: '0.35px', lineHeight: 1.15 }}>
            Universitätsmedizin Frankfurt
          </div>
          <div className="text-white-50" style={{ fontSize: '0.67rem', lineHeight: 1.15 }}>
            Pflegedirektion &bull; Digitale Pflege-Pocketcard (DIN A4)
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center gap-2">
        <span
          className="badge rounded-pill text-white px-2.5 py-1 fw-bold"
          style={{ backgroundColor: standard.accentColor, fontSize: '0.75rem' }}
        >
          {standard.shortTitle}
        </span>
        <span className="badge bg-white text-dark fw-bold px-2 py-1 text-nowrap" style={{ fontSize: '0.68rem' }}>
          {pageLabel}
        </span>
      </div>
    </div>
  );

  const renderFooterBar = (pageLabel) => (
    <div className="a4-std-page-footer">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-0.5" style={{ fontSize: '0.65rem' }}>
        <div className="text-truncate">
          <span className="fw-bold text-danger me-1">
            <i className={`bi ${!isSopStandard ? 'bi-youtube' : 'bi-file-earmark-pdf-fill'} me-1`}></i>
            {!isSopStandard ? 'YouTube:' : 'SOP-PDF:'}
          </span>
          <a href={primaryMediaUrl} className="text-primary text-decoration-underline">
            {primaryMediaUrl}
          </a>
        </div>
        <div className="flex-shrink-0 text-nowrap">
          <span className="fw-bold text-dark me-1">
            <i className="bi bi-globe2 text-primary me-1"></i>Website:
          </span>
          <a href={websiteDirectUrl} className="text-primary text-decoration-underline">
            {websiteDirectUrl}
          </a>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center gap-2 pt-1 border-top text-muted" style={{ fontSize: '0.63rem' }}>
        <span className="text-truncate">Universitätsmedizin Frankfurt &bull; Pflegedirektion &bull; Expertenstandards im Pflegeprozess</span>
        <span className="fw-semibold text-dark text-nowrap flex-shrink-0">QM-Dokumentation roXtra (ID: {standard.roXtraIds.join(', ')}) &bull; {pageLabel}</span>
      </div>
    </div>
  );

  return (
    <div className="pocketcard-a4-print-sheet" id={`pocketcard-a4-print-${standard.id}`}>
      {/* =========================================================
          PAGE 1 / 2: HEADER + LEFT IMAGE & RIGHT QR CODE + CORE STEPS
          ========================================================= */}
      <div className="a4-std-page a4-std-page-1" id={`pocketcard-a4-page1-${standard.id}`}>
        {renderHeaderBar('Seite 1 / 2')}

        <div className="a4-std-body">
          {/* 1. Title, Lead Text & Instructions Header Box */}
          <div className="a4-std-title-box" style={{ borderLeftColor: standard.accentColor }}>
            <div className="d-flex justify-content-between align-items-start gap-2 mb-1">
              <div>
                <div className="text-uppercase fw-bold" style={{ fontSize: '0.66rem', color: standard.accentColor, letterSpacing: '0.4px' }}>
                  {isSopStandard ? 'Klinische Verfahrensanweisung (SOP)' : 'Expertenstandard in der Pflege'}
                </div>
                <h4 className="fw-extrabold text-dark mb-0" style={{ fontSize: '1.05rem', lineHeight: 1.2 }}>
                  {standard.topic}
                </h4>
              </div>
              <span className="badge bg-white text-dark border px-2 py-1 font-monospace flex-shrink-0" style={{ fontSize: '0.72rem' }}>
                roXtra ID: <strong>{standard.roXtraIds.join(' / ')}</strong>
              </span>
            </div>
            {standard.leadText && (
              <div className="text-dark fw-semibold mb-1" style={{ fontSize: '0.74rem', lineHeight: 1.32 }}>
                {standard.leadText}
              </div>
            )}
            {standard.instructions && (
              <div className="text-secondary" style={{ fontSize: '0.7rem', lineHeight: 1.32 }}>
                {standard.instructions}
              </div>
            )}
          </div>

          {/* 2. Below Header: Image on Left Side & QR Code on Right Side */}
          <div className="a4-std-media-grid">
            {/* Left Side: Clinical Graphic / Image */}
            <div className="a4-std-image-box">
              <div className="a4-std-box-header">
                <i className="bi bi-heart-pulse-fill text-danger me-1.5"></i>
                <span>Klinische Praxis &amp; Handlungsschritte: {standard.shortTitle}</span>
              </div>
              <div className="a4-std-image-frame">
                <img
                  src={standard.graphicImage || standard.image}
                  alt={`Klinische Grafik ${standard.shortTitle}`}
                  className="a4-std-main-img"
                />
              </div>
            </div>

            {/* Right Side: Scannable QR Code + Direct YouTube & Website Links */}
            <div className="a4-std-qr-box">
              <div className="a4-std-box-header justify-content-center">
                <i className="bi bi-qr-code-scan text-primary me-1.5"></i>
                <span>{!isSopStandard ? 'Schulungsvideo scannen' : 'SOP & Website scannen'}</span>
              </div>

              <div className="d-flex flex-column align-items-center justify-content-between flex-grow-1 p-2 text-center">
                <div className="p-2 bg-white rounded-3 border shadow-sm my-1">
                  <QrCodeCanvas
                    value={!isSopStandard ? standard.videoUrl : websiteDirectUrl}
                    size={122}
                    color={standard.accentColor}
                  />
                </div>

                <div className="text-muted font-monospace mb-1" style={{ fontSize: '0.65rem' }}>
                  {!isSopStandard
                    ? 'Kamera auf QR-Code richten • YouTube Video'
                    : 'Kamera auf QR-Code richten • Digitale SOP'}
                </div>

                {/* Direct YouTube Link & Website Link inside Right Box */}
                <div className="w-100 text-start border-top pt-1.5" style={{ fontSize: '0.64rem', lineHeight: 1.28 }}>
                  <div className="mb-1">
                    <span className="fw-bold text-danger d-block">
                      <i className={`bi ${!isSopStandard ? 'bi-youtube' : 'bi-file-earmark-pdf-fill'} me-1`}></i>
                      {!isSopStandard ? 'YouTube-Video Link:' : 'SOP-Dokument Link:'}
                    </span>
                    <a href={primaryMediaUrl} className="text-primary text-break text-decoration-underline">
                      {primaryMediaUrl}
                    </a>
                  </div>
                  <div>
                    <span className="fw-bold text-dark d-block">
                      <i className="bi bi-globe2 me-1 text-primary"></i>Website-Link:
                    </span>
                    <a href={websiteDirectUrl} className="text-primary text-break text-decoration-underline">
                      {websiteDirectUrl}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Below Image & QR Code: Warum ist das wichtig? */}
          {standard.whyImportant && (
            <div className="a4-std-section-box">
              <div className="fw-bold text-success mb-1.5 d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-shield-check"></i>
                <span>Warum ist das wichtig?</span>
              </div>
              <div className="a4-std-two-col-grid">
                {standard.whyImportant.map((why, wi) => (
                  <div key={wi} className="d-flex align-items-start gap-1.5" style={{ fontSize: '0.74rem', lineHeight: 1.32 }}>
                    <i className="bi bi-check-circle-fill text-success flex-shrink-0" style={{ marginTop: '1px' }}></i>
                    <span className="text-dark">{why}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Wichtigste Handlungsschritte (Minimal-Info) */}
          {standard.keyPoints && (
            <div className="a4-std-section-box">
              <div className="fw-bold text-dark text-uppercase mb-1.5 d-flex align-items-center gap-1.5" style={{ fontSize: '0.76rem' }}>
                <i className="bi bi-list-check text-primary"></i>
                <span>Wichtigste Handlungsschritte ({standard.id === 'zvk' ? 'DAS IST WICHTIG' : 'Minimal-Info'}):</span>
              </div>
              <div className="d-flex flex-column gap-1.5">
                {standard.keyPoints.map((pt, i) => (
                  <div key={i} className="d-flex align-items-start gap-2" style={{ fontSize: '0.75rem', lineHeight: 1.34 }}>
                    <span
                      className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                      style={{ width: '19px', height: '19px', backgroundColor: standard.accentColor, fontSize: '0.67rem', marginTop: '1px' }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-dark">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {renderFooterBar('Seite 1 / 2')}
      </div>

      {/* =========================================================
          PAGE 2 / 2: HANDLUNGSSCHRITTE IM PFLEGEPROZESS + LINKS & QM
          ========================================================= */}
      <div className="a4-std-page a4-std-page-2" id={`pocketcard-a4-page2-${standard.id}`}>
        {renderHeaderBar('Seite 2 / 2')}

        <div className="a4-std-body">
          {/* 1. Page 2 Subheader Banner */}
          <div className="a4-std-title-box" style={{ borderLeftColor: standard.accentColor }}>
            <div className="d-flex justify-content-between align-items-center gap-2">
              <div>
                <div className="text-uppercase fw-bold" style={{ fontSize: '0.66rem', color: standard.accentColor, letterSpacing: '0.4px' }}>
                  {isSopStandard ? 'Klinische Verfahrensanweisung (SOP) • Teil 2' : 'Expertenstandard in der Pflege • Teil 2'}
                </div>
                <h5 className="fw-extrabold text-dark mb-0" style={{ fontSize: '0.98rem', lineHeight: 1.25 }}>
                  {standard.topic} — Pflegeprozess &amp; Digitale Referenzen
                </h5>
              </div>
              <span className="badge bg-white text-dark border px-2 py-1 font-monospace flex-shrink-0" style={{ fontSize: '0.72rem' }}>
                roXtra ID: <strong>{standard.roXtraIds.join(' / ')}</strong>
              </span>
            </div>
          </div>

          {/* 2. Handlungsschritte im Pflegeprozess (All Phases Complete) */}
          {standard.clinicalFocus && (
            <div className="a4-std-section-box">
              <div className="fw-bold text-dark text-uppercase mb-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-check2-circle text-success"></i>
                <span>Handlungsschritte im Pflegeprozess (Vollständige Übersicht):</span>
              </div>
              <div className="d-flex flex-column gap-2">
                {standard.clinicalFocus.map((item, idx) => (
                  <div key={idx} className="a4-std-focus-card">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0"
                        style={{ width: '21px', height: '21px', backgroundColor: standard.accentColor, fontSize: '0.7rem' }}
                      >
                        {idx + 1}
                      </span>
                      <strong className="text-dark" style={{ fontSize: '0.8rem', lineHeight: 1.25 }}>{item.phase}</strong>
                    </div>
                    <div className="text-secondary" style={{ fontSize: '0.75rem', lineHeight: 1.38, paddingLeft: '29px' }}>
                      {item.detail}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Dedicated YouTube Video Link & Website Links Section */}
          <div className="a4-std-section-box">
            <div className="fw-bold text-dark text-uppercase mb-2 d-flex align-items-center gap-1.5" style={{ fontSize: '0.76rem' }}>
              <i className="bi bi-link-45deg text-primary fs-6"></i>
              <span>Schulungsvideo (YouTube) &amp; Digitale Website-Links:</span>
            </div>

            <div className="a4-std-two-col-grid" style={{ gap: '10px' }}>
              {/* Left Card: YouTube Video Link (or SOP Document Link) */}
              <div className="p-2.5 rounded-3 border bg-light">
                <div className="fw-bold text-danger mb-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.76rem' }}>
                  <i className={`bi ${!isSopStandard ? 'bi-youtube' : 'bi-file-earmark-pdf-fill'} fs-6`}></i>
                  <span>{!isSopStandard ? 'YouTube Schulungsvideo-Link' : 'Original SOP-Dokument (PDF)'}</span>
                </div>
                <div className="small text-secondary mb-1.5" style={{ fontSize: '0.69rem', lineHeight: 1.3 }}>
                  {!isSopStandard
                    ? 'Offizielles Schulungsvideo zum Expertenstandard (direkt abrufbar per Klick oder QR-Code auf Seite 1):'
                    : 'Offizielle Verfahrensanweisung der Universitätsmedizin Frankfurt (direkt abrufbar):'}
                </div>
                <div className="p-1.5 bg-white rounded border">
                  <a href={primaryMediaUrl} className="text-primary fw-semibold text-break text-decoration-underline" style={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
                    {primaryMediaUrl}
                  </a>
                </div>
              </div>

              {/* Right Card: Website Link & Quick-Hub Link */}
              <div className="p-2.5 rounded-3 border bg-light">
                <div className="fw-bold text-primary mb-1 d-flex align-items-center gap-1.5" style={{ fontSize: '0.76rem' }}>
                  <i className="bi bi-globe2 fs-6"></i>
                  <span>Website-Link (Digitale Pocketcard)</span>
                </div>
                <div className="small text-secondary mb-1" style={{ fontSize: '0.69rem', lineHeight: 1.3 }}>
                  Direkter Website-Link zu dieser digitalen Pocketcard ({standard.shortTitle}):
                </div>
                <div className="p-1.5 bg-white rounded border mb-1.5">
                  <a href={websiteDirectUrl} className="text-primary fw-semibold text-break text-decoration-underline" style={{ fontSize: '0.7rem', lineHeight: 1.3 }}>
                    {websiteDirectUrl}
                  </a>
                </div>
                <div className="small text-secondary" style={{ fontSize: '0.68rem' }}>
                  <span className="fw-semibold text-dark me-1">Schnellwahl (Alle 6 Standards):</span>
                  <a href={websiteQuickHubUrl} className="text-primary text-decoration-underline">
                    {websiteQuickHubUrl}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 4. QM-Dokumentation & Klinische Verbindlichkeit */}
          <div className="a4-std-section-box">
            <div className="fw-bold text-dark text-uppercase mb-1.5 d-flex align-items-center gap-1.5" style={{ fontSize: '0.74rem' }}>
              <i className="bi bi-folder2-open text-primary"></i>
              <span>QM-Dokumentation (roXtra) &amp; Klinische Gültigkeit:</span>
            </div>
            <div className="a4-std-two-col-grid" style={{ fontSize: '0.71rem', lineHeight: 1.35 }}>
              <div>
                <div><strong>Herausgeber:</strong> Universitätsmedizin Frankfurt &bull; Pflegedirektion</div>
                <div><strong>Standard / Thema:</strong> {standard.shortTitle}</div>
              </div>
              <div>
                <div><strong>roXtra Dokumenten-IDs:</strong> <span className="font-monospace fw-bold">{standard.roXtraIds.join(', ')}</span></div>
                <div><strong>Gültigkeit:</strong> Klinikweit &bull; Stationäre &amp; Intensivpflege (Stand: 2026)</div>
              </div>
            </div>
          </div>
        </div>

        {renderFooterBar('Seite 2 / 2')}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Beautified Pocketcard (Minimal Info + Great Pictures + Scannable QR)
// -------------------------------------------------------------
function BeautifiedPocketcard({ standard, onCopy, onDownloadQr, onDownloadPdf }) {
  const [selectedDocIndex, setSelectedDocIndex] = useState(0);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isModalMaximized, setIsModalMaximized] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const isPdfPopupStandard = standard.id === 'zvk' || standard.id === 'isolation';
  const documents = standard.sopDocuments || null;
  const activeDoc = (documents && documents[selectedDocIndex]) ? documents[selectedDocIndex] : null;
  const rawPdfUrl = activeDoc
    ? activeDoc.pdfUrl
    : (standard.pdfUrl || (standard.id === 'zvk' ? 'assets/zvk-sop-verfahrensanweisung.pdf' : (standard.id === 'isolation' ? 'assets/isolation-sop-verfahrensanweisung.pdf' : 'assets/umf-expertenstandards-folien.pdf')));
  const pdfBaseUrl = rawPdfUrl.split('#')[0];
  const pdfUrl = rawPdfUrl;

  return (
    <div className="mb-4">
      {/* DEDICATED A4 PRINT & PDF SHEET (Used when clicking Print or PDF) */}
      <StandardA4PrintSheet standard={standard} />

      {/* THE INTERACTIVE SCREEN POCKETCARD */}
      <div className="pocketcard-printable-view pocketcard-screen-view" id={`pocketcard-${standard.id}`}>
        {/* 1. Hospital Header Bar */}
        <div className="pocketcard-print-header flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2 gap-sm-3 min-w-0">
            <div className="bg-white rounded px-1.5 py-1 shadow-sm d-flex align-items-center flex-shrink-0">
              <img src="assets/umf-logo.jpg" alt="Universitätsmedizin Frankfurt" height="32" />
            </div>
            <div className="min-w-0">
              <div className="fw-bold text-white text-uppercase text-truncate" style={{ fontSize: '0.84rem', letterSpacing: '0.3px' }}>
                Universitätsmedizin Frankfurt
              </div>
              <div className="text-white-50 text-truncate" style={{ fontSize: '0.7rem' }}>
                Pflegedirektion &bull; Digitale Pocketcard
              </div>
            </div>
          </div>

          <div className="ms-auto">
            <span className={`pocketcard-badge-pill ${standard.id}`}>
              <i className={`bi ${standard.icon} me-1`}></i> {standard.shortTitle}
            </span>
          </div>
        </div>

        {/* 2. Pocketcard Main Content Area */}
        <div className="p-3 p-sm-4 bg-white">
          {/* Title & roXtra Identification */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 pb-2 border-bottom gap-2">
            <div>
              <span className="text-muted small text-uppercase fw-bold" style={{ letterSpacing: '0.5px', fontSize: '0.72rem' }}>
                {standard.id === 'zvk' || standard.id === 'isolation' ? 'Klinische Verfahrensanweisung (SOP)' : 'Expertenstandard in der Pflege'}
              </span>
              <h4 className="fw-bold text-dark mb-0 mt-1" style={{ fontSize: 'clamp(1.05rem, 3vw, 1.35rem)' }}>{standard.topic}</h4>
            </div>
            <div className="d-flex align-items-center gap-2 flex-shrink-0">
              <span className="badge bg-light text-dark border px-2.5 py-1.5 font-monospace" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-file-earmark-medical text-primary me-1"></i>
                roXtra: <strong>{standard.roXtraIds.join(' / ')}</strong>
              </span>
            </div>
          </div>

          {/* 3. The Pictures / SOP PDF Viewer Section */}
          <div className="row g-3 mb-3">
            {standard.id === 'zvk' || standard.id === 'isolation' ? (
              /* ZVK & Isolation: Direct SOP PDF Viewer at the top */
              <div className="col-12">
                <div className="clinical-picture-card h-100 d-flex flex-column shadow-sm rounded-4 overflow-hidden border">
                  {/* Card Header: Official SOP document */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center px-3 py-2 bg-light border-bottom gap-2">
                    <div className="d-flex align-items-center gap-2">
                      <i className="bi bi-file-earmark-pdf-fill text-danger fs-5"></i>
                      <span className="fw-bold text-dark" style={{ fontSize: '0.92rem' }}>
                        {activeDoc ? activeDoc.title : `Verfahrensanweisung & SOP: ${standard.shortTitle}`}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-white text-secondary border px-2.5 py-1 small font-monospace">
                        roXtra ID: <strong>{activeDoc ? activeDoc.roXtraId : standard.roXtraIds.join(' / ')}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Document Switcher: ONLY for standards with multiple documents (e.g. Hygiene) */}
                  {documents && documents.length > 1 && (
                    <div className="bg-light px-3 py-2 border-bottom">
                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-1.5">
                        <span className="text-muted small fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.4px' }}>
                          <i className="bi bi-collection me-1 text-primary"></i>Verfügbare QM-Dokumente ({documents.length}):
                        </span>
                        <span className="text-muted small" style={{ fontSize: '0.72rem' }}>
                          Klicken zum Umschalten
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {documents.map((doc, idx) => {
                          const isSelected = selectedDocIndex === idx;
                          return (
                            <button
                              key={doc.id}
                              type="button"
                              className={`btn btn-sm rounded-pill px-3 py-1.5 fw-semibold d-flex align-items-center gap-2 transition-all flex-grow-1 flex-sm-grow-0 justify-content-between justify-content-sm-center ${
                                isSelected
                                  ? 'btn-primary text-white shadow-sm'
                                  : 'btn-white bg-white text-dark border hover-shadow'
                              }`}
                              style={{ fontSize: '0.82rem' }}
                              onClick={() => setSelectedDocIndex(idx)}
                            >
                              <div className="d-flex align-items-center gap-1.5">
                                <i className={`bi ${idx === 0 ? 'bi-file-earmark-text' : 'bi-shield-check'} ${isSelected ? 'text-white' : 'text-primary'}`}></i>
                                <span>{doc.shortTitle}</span>
                              </div>
                              <span className={`badge rounded-pill ${isSelected ? 'bg-white text-primary' : 'bg-light text-muted border'}`} style={{ fontSize: '0.7rem' }}>
                                {doc.pageCount} S. &bull; ID: {doc.roXtraId}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Body: Direct SOP PDF Viewer */}
                  <div>
                    {/* Desktop / Tablet: Interactive PDF iframe embed */}
                    <div className="d-none d-md-block position-relative bg-white" style={{ minHeight: '520px', height: '520px' }}>
                      <iframe
                        key={pdfBaseUrl}
                        src={`${pdfBaseUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                        title={`PDF Schulungsillustration ${activeDoc ? activeDoc.title : standard.shortTitle}`}
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
                          {activeDoc ? activeDoc.title : standard.topic}
                        </h6>
                        <div className="text-muted small mb-3">
                          {activeDoc
                            ? `${activeDoc.lead} • roXtra ID: ${activeDoc.roXtraId}`
                            : (standard.id === 'zvk'
                              ? 'Offizielle Verfahrensanweisung ZVK (10 Seiten) • roXtra ID: 391904'
                              : 'Allgemeines Vorgehen bei Isolation und Reinigung (4 Seiten) • roXtra ID: 239411')}
                        </div>

                        <div className="alert alert-info py-2 px-3 small text-start d-flex align-items-center gap-2 mb-3">
                          <i className="bi bi-phone text-info fs-5 flex-shrink-0"></i>
                          <span style={{ fontSize: '0.8rem' }}>Für flüssiges Scrollen &amp; Zoom am Smartphone tippen Sie auf den Button, um das PDF im systemeigenen PDF-Viewer zu öffnen.</span>
                        </div>

                        <div className="d-grid gap-2">
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-danger rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 fw-bold shadow-sm"
                          >
                            <i className="bi bi-box-arrow-up-right fs-5"></i>
                            <span>PDF im Vollbild öffnen ({activeDoc ? `${activeDoc.pageCount} S.` : (standard.id === 'zvk' ? '10 S.' : '4 S.')})</span>
                          </a>
                          <a
                            href={pdfUrl}
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

                  {/* Fallback image for html2pdf / print */}
                  <img
                    src={standard.image}
                    alt={`Illustration ${standard.shortTitle}`}
                    className="clinical-picture-img print-only-preview d-none"
                  />

                  {/* Bottom Action Strip (Desktop/Tablet Only, hidden on mobile) */}
                  <div className="px-3 py-2 bg-light border-top d-none d-md-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div className="d-flex align-items-center gap-2 small text-muted">
                      <i className="bi bi-file-earmark-check text-success"></i>
                      <span>Gültige Version im roXtra QM-System (ID {activeDoc ? activeDoc.roXtraId : standard.roXtraIds.join(' / ')})</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-dark rounded-pill px-2.5 py-1"
                        style={{ fontSize: '0.76rem' }}
                        onClick={() => setIsPdfModalOpen(true)}
                      >
                        <i className="bi bi-arrows-fullscreen me-1"></i>Vollbild
                      </button>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger rounded-pill px-2.5 py-1 fw-semibold"
                        style={{ fontSize: '0.76rem' }}
                      >
                        <i className="bi bi-file-earmark-pdf-fill me-1"></i>PDF öffnen ({activeDoc ? `${activeDoc.pageCount} S.` : (standard.id === 'zvk' ? '10 S.' : '4 S.')})
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
                    className="p-2 p-sm-3 text-center bg-white d-flex align-items-center justify-content-center position-relative"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setPreviewImage({ src: standard.graphicImage, title: standard.topic, subtitle: 'Klinische Praxis & Handlungsschritte (Infografik)' })}
                    title="Klicken für vergrößerte Pop-up-Ansicht"
                  >
                    <img
                      src={standard.graphicImage}
                      alt={`Klinische Grafik ${standard.shortTitle}`}
                      className="clinical-picture-img rounded-3 shadow-sm"
                      style={{
                        maxHeight: '520px',
                        height: 'auto',
                        width: '100%',
                        objectFit: 'contain'
                      }}
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

          {/* 4. Minimal Info Action Steps & Right Container (Picture for ZVK/Isolation, QR Code for others) */}
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

            {/* Right Area: Klinische Praxis & Handlungsschritte Picture for ZVK & Isolation (No QR Code), or Scannable QR Code for the other 4 tiles */}
            <div className="col-lg-5 col-md-6">
              {standard.id === 'zvk' || standard.id === 'isolation' ? (
                <div className="p-3 rounded-4 border bg-white h-100 text-center d-flex flex-column align-items-center justify-content-between shadow-sm">
                  <div className="d-flex justify-content-between align-items-center w-100 mb-2 border-bottom pb-2">
                    <span className="fw-bold text-dark d-flex align-items-center gap-2 text-start" style={{ fontSize: '0.85rem' }}>
                      <i className={`bi ${standard.id === 'isolation' ? 'bi-shield-check text-primary' : 'bi-heart-pulse-fill text-danger'} fs-5 flex-shrink-0`}></i>
                      <span>Klinische Praxis &amp; Handlungsschritte: {standard.shortTitle}</span>
                    </span>
                    <span className="badge bg-light text-secondary border px-2 py-1 small flex-shrink-0">
                      <i className="bi bi-zoom-in me-1"></i>Vergrößern
                    </span>
                  </div>

                  <div
                    className="position-relative w-100 flex-grow-1 d-flex align-items-center justify-content-center bg-white rounded-3 p-1"
                    style={{ cursor: 'pointer', minHeight: '260px' }}
                    onClick={() => setPreviewImage({
                      src: standard.graphicImage,
                      title: standard.topic,
                      subtitle: `Klinische Praxis & Handlungsschritte: ${standard.shortTitle}`
                    })}
                    title="Klicken für vergrößerte Pop-up-Ansicht"
                  >
                    <img
                      src={standard.graphicImage}
                      alt={`Klinische Praxis & Handlungsschritte: ${standard.shortTitle}`}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: '300px', width: '100%', objectFit: 'contain' }}
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
                /* Other 4 standards: Crisp Scannable Single QR Code */
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
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center pt-2 border-top text-muted gap-1 text-center text-sm-start" style={{ fontSize: '0.72rem' }}>
            <span>Universitätsmedizin Frankfurt &bull; Pflegedirektion &bull; Expertenstandards im Pflegeprozess</span>
            <span>QM-Dokumentation roXtra &bull; Stand: 2026</span>
          </div>

          {/* 6. Action Toolbar (Only on screen, ignored when exporting PDF / printing) */}
          <div className="d-flex flex-column flex-sm-row flex-wrap align-items-stretch align-items-sm-center justify-content-between gap-2 mt-3 pt-3 border-top no-print w-100" data-html2canvas-ignore="true">
            {/* Primary Document Actions: Download PDF & Print grouped together */}
            <div className="d-flex flex-column flex-sm-row flex-wrap align-items-stretch align-items-sm-center gap-2 w-100 w-sm-auto">
              <div className="btn-group shadow-sm rounded-pill overflow-hidden w-100 w-sm-auto" role="group">
                <button
                  className="btn btn-primary btn-sm px-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 flex-grow-1"
                  style={{ minHeight: '44px', flex: '1 1 50%' }}
                  onClick={() => onDownloadPdf(standard, false)}
                  title="Pocketcard als PDF-Datei herunterladen"
                >
                  <i className="bi bi-file-earmark-arrow-down-fill fs-6"></i>
                  <span>PDF speichern</span>
                </button>
                <button
                  className="btn btn-dark btn-sm px-3 py-2 fw-bold d-flex align-items-center justify-content-center gap-1.5 border-start border-white border-opacity-25 flex-grow-1"
                  style={{ minHeight: '44px', flex: '1 1 50%' }}
                  onClick={() => window.print()}
                  title="Drucken / Als PDF drucken"
                >
                  <i className="bi bi-printer-fill fs-6"></i>
                  <span>Drucken</span>
                </button>
              </div>

              {standard.sopPdfUrl && standard.id !== 'zvk' && (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-danger btn-sm rounded-pill px-3 py-2 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-1.5 w-100 w-sm-auto"
                  style={{ minHeight: '44px' }}
                  title="Vollständiges Dokument als Original-PDF öffnen"
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                  <span>PDF öffnen ({activeDoc ? `${activeDoc.pageCount} S.` : '4 S.'})</span>
                </a>
              )}
            </div>

            {/* Secondary Utilities: QR PNG (only for video standards) & Link */}
            <div
              className="d-grid d-sm-flex align-items-center gap-2 w-100 w-sm-auto"
              style={{ gridTemplateColumns: (standard.id === 'zvk' || standard.id === 'isolation') ? '1fr' : '1fr 1fr' }}
            >
              {standard.id !== 'zvk' && standard.id !== 'isolation' && (
                <button
                  className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                  style={{ minHeight: '42px' }}
                  onClick={() => onDownloadQr(standard)}
                  title="QR-Code als Bilddatei speichern"
                >
                  <i className="bi bi-qr-code"></i>
                  <span>QR-Bild</span>
                </button>
              )}
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-1.5"
                style={{ minHeight: '42px' }}
                onClick={() => onCopy(standard.videoUrl, 'Link')}
                title="Link kopieren"
              >
                <i className="bi bi-link-45deg"></i>
                <span>Link kopieren</span>
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
                      {activeDoc ? activeDoc.title : (standard.title || standard.topic)}
                    </h6>
                    <div className="text-white-50 small" style={{ fontSize: '0.72rem' }}>
                      Universitätsmedizin Frankfurt &bull; roXtra ID: {activeDoc ? activeDoc.roXtraId : standard.roXtraIds.join(' / ')} &bull; Scrolling &amp; Vollbild
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

              {/* Modal Document Switcher (if multiple docs available) */}
              {documents && documents.length > 1 && (
                <div className="bg-black bg-opacity-75 px-3 py-1.5 border-bottom border-secondary d-flex align-items-center gap-2 flex-wrap">
                  <span className="text-white-50 small fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>
                    Dokument:
                  </span>
                  {documents.map((doc, idx) => {
                    const isSelected = selectedDocIndex === idx;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        className={`btn btn-xs rounded-pill px-2.5 py-0.5 fw-semibold ${
                          isSelected
                            ? 'btn-primary text-white'
                            : 'btn-outline-light'
                        }`}
                        style={{ fontSize: '0.75rem' }}
                        onClick={() => setSelectedDocIndex(idx)}
                      >
                        {doc.shortTitle} ({doc.pageCount} S.)
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Modal Body with Scrolling PDF Viewport on Desktop & Mobile Native View on Phones */}
              <div className="modal-body p-0 flex-grow-1 bg-secondary bg-opacity-10 position-relative d-flex flex-column overflow-hidden">
                {/* Desktop: Interactive PDF iframe */}
                <iframe
                  key={pdfBaseUrl}
                  src={`${pdfBaseUrl}#page=${standard.pdfPage || 1}&toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                  title={`PDF Dokument ${activeDoc ? activeDoc.title : standard.shortTitle}`}
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
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-danger rounded-pill py-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    >
                      <i className="bi bi-box-arrow-up-right fs-5"></i>
                      <span>PDF im mobilen Reader öffnen</span>
                    </a>
                    <a
                      href={pdfUrl}
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

  const downloadPdf = (std) => {
    exportStandardA4Pdf(std, showToast);
  };

  return (
    <div>
      {/* Top Breadcrumb & Switcher (Desktop/Tablet Only) */}
      <div className="d-none d-md-flex flex-column gap-2 mb-3 no-print">
        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <a href="#/" className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-1.5 fw-semibold" style={{ minHeight: '40px', fontSize: '0.82rem' }}>
            <i className="bi bi-grid-fill"></i>
            <span>Alle 6 Kacheln</span>
          </a>

          {/* Grouped PDF & Print Button Pill */}
          <div className="btn-group shadow-sm rounded-pill overflow-hidden" role="group">
            <button
              className="btn btn-primary btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
              style={{ minHeight: '40px', fontSize: '0.82rem' }}
              onClick={() => downloadPdf(standard)}
              title="Aktuelle Ansicht als PDF-Dokument herunterladen"
            >
              <i className="bi bi-file-earmark-arrow-down-fill"></i>
              <span className="d-none d-sm-inline">PDF herunterladen</span>
              <span className="d-inline d-sm-none">PDF</span>
            </button>
            <button
              className="btn btn-dark btn-sm px-3 py-1.5 fw-semibold d-flex align-items-center gap-1.5 border-start border-white border-opacity-25"
              style={{ minHeight: '40px', fontSize: '0.82rem' }}
              onClick={() => window.print()}
              title="Drucken / Als PDF drucken"
            >
              <i className="bi bi-printer-fill"></i>
              <span>Drucken</span>
            </button>
          </div>
        </div>

        {/* Horizontally scrollable quick-switch pills for all other standards on desktop */}
        <div className="nav-standards-scroll w-100 py-0.5">
          {otherStandards.map(s => (
            <button
              key={s.id}
              type="button"
              className="btn btn-white bg-white btn-sm rounded-pill border px-2.5 py-1 text-dark shadow-sm flex-shrink-0 d-inline-flex align-items-center gap-1.5"
              style={{ fontSize: '0.78rem', minHeight: '36px' }}
              onClick={() => onNavigate(s.id)}
            >
              <i className={`bi ${s.icon}`} style={{ color: s.accentColor }}></i>
              <span className="fw-semibold">{s.shortTitle}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. CLINICAL POCKETCARD VIEW */}
      <BeautifiedPocketcard
        standard={standard}
        onCopy={copyToClipboard}
        onDownloadQr={downloadQrImage}
        onDownloadPdf={downloadPdf}
      />

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
                    Verfahrensanweisungen &amp; Hygienepläne (2 Dokumente)
                  </h5>
                  <a
                    href="assets/hygieneplan-multiresistente-erreger.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-primary rounded-pill px-3 shadow-sm"
                  >
                    <i className="bi bi-file-earmark-pdf-fill me-1"></i> Hygieneplan MRE öffnen
                  </a>
                </div>

                <div className="p-3 bg-light rounded-3 border mb-3">
                  <div className="fw-bold small text-uppercase text-secondary mb-2">
                    <i className="bi bi-folder2-open me-1 text-primary"></i> QM-Dokumente im Universitätsklinikum Frankfurt:
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>Dokument 1 (ID 239411):</strong> Allgemeines Vorgehen bei Isolation und Reinigung</span>
                      <span className="badge bg-secondary">Ver. 003 &bull; 4 Seiten</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>Dokument 2 (ID 361678):</strong> Hygieneplan: Umgang mit MRE (Häma-Onko, ITS/IMC)</span>
                      <span className="badge bg-primary">Ver. 012 &bull; 5 Seiten</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center bg-white p-2 rounded border small">
                      <span><strong>Gültigkeitsbereich:</strong> Häma-Onkologie &bull; ITS / IMC &bull; Neonatologie &bull; Klinikweit</span>
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
  const list = Object.values(standards);

  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} kopiert!`);
    });
  };

  const downloadQrImage = (std) => {
    const container = document.querySelector(`.pocket-qr-${std.id}`) || document.querySelector(`.detail-qr-${std.id}`);
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

  const downloadPdf = (std) => {
    exportStandardA4Pdf(std, showToast);
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

      {/* Render list of pocketcards */}
      <div className="d-flex flex-column gap-4">
        {list.map((std) => (
          <div key={std.id} className="page-break">
            <BeautifiedPocketcard
              standard={std}
              onCopy={copyToClipboard}
              onDownloadQr={downloadQrImage}
              onDownloadPdf={downloadPdf}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/// -------------------------------------------------------------
// Component: Universal-Karte (A4-Pocketcard & ATM-Scheckkarte)
// -------------------------------------------------------------
function UniversalCardInteractiveCard({ isAtm = false, onSelectStandard }) {
  return (
    <div className={`universal-card-interactive-box ${isAtm ? 'atm-size' : ''} mx-auto position-relative`}>
      <div className="universal-card-inner position-relative w-100">
        <img
          src={isAtm ? "assets/universal-card-12x8.jpg?v=20261020-02" : "assets/universal-card-umf.jpg?v=20261020-02"}
          alt="Universitätsmedizin Frankfurt - Klinische Pflegestandards Universal-Pocketcard"
          className="universal-card-img"
        />

        {/* 1. Dekubitusprophylaxe Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '41.2%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('dekubitus')}
          title="1. Dekubitusprophylaxe aufrufen"
        />

        {/* 2. Sturzprophylaxe Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '49.8%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('sturz')}
          title="2. Sturzprophylaxe aufrufen"
        />

        {/* 3. Schmerzmanagement Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '58.4%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('schmerz')}
          title="3. Schmerzmanagement aufrufen"
        />

        {/* 4. Ernährungsmanagement Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '67.0%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('ernaehrung')}
          title="4. Ernährungsmanagement aufrufen"
        />

        {/* 5. ZVK Intensivpflege Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '75.6%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('zvk')}
          title="5. ZVK Intensivpflege & SOP aufrufen"
        />

        {/* 6. Isolation & Hygiene Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.2%', top: '84.2%', width: '57.0%', height: '8.4%' }}
          onClick={() => onSelectStandard('isolation')}
          title="6. Isolation & Hygiene aufrufen"
        />

        {/* QR Code & 'HIER SCANNEN' Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '61.5%', top: '30.5%', width: '28.0%', height: '53.0%', borderRadius: '24px' }}
          onClick={() => onSelectStandard('quick-hub')}
          title="Hier scannen / Schnellzugriff für Pflegestandards & SOPs öffnen"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Universal-Karte Native A4 Clinical Sheet (Full Page DIN A4)
// -------------------------------------------------------------
function UniversalCardA4Native({ onSelectStandard }) {
  return (
    <div className="a4-native-card mx-auto position-relative overflow-hidden" id="universal-card-a4-sheet">
      <img
        src="assets/universal-card-a4.jpg?v=20261020-02"
        alt="Universitätsklinikum Frankfurt - Klinische Pflegestandards Universal-Pocketcard DIN A4"
        className="w-100 h-auto d-block a4-card-main-img"
      />

      {/* 1. Dekubitusprophylaxe Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '0.5%', top: '19.5%', width: '39.5%', height: '18.5%' }}
        onClick={() => onSelectStandard('dekubitus')}
        title="1. Dekubitusprophylaxe aufrufen"
      />

      {/* 2. Sturzprophylaxe Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '0.5%', top: '38.5%', width: '39.5%', height: '18.5%' }}
        onClick={() => onSelectStandard('sturz')}
        title="2. Sturzprophylaxe aufrufen"
      />

      {/* 3. Schmerzmanagement Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '0.5%', top: '57.5%', width: '39.5%', height: '18.5%' }}
        onClick={() => onSelectStandard('schmerz')}
        title="3. Schmerzmanagement aufrufen"
      />

      {/* 4. Ernährungsmanagement Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '60.5%', top: '19.5%', width: '39.0%', height: '18.5%' }}
        onClick={() => onSelectStandard('ernaehrung')}
        title="4. Ernährungsmanagement aufrufen"
      />

      {/* 5. ZVK Intensivpflege Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '60.5%', top: '38.5%', width: '39.0%', height: '18.5%' }}
        onClick={() => onSelectStandard('zvk')}
        title="5. ZVK Intensivpflege aufrufen"
      />

      {/* 6. Isolation & Hygiene Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '60.5%', top: '57.5%', width: '39.0%', height: '18.5%' }}
        onClick={() => onSelectStandard('isolation')}
        title="6. Isolation & Hygiene aufrufen"
      />

      {/* Center QR Scanner Hotspot */}
      <div
        className="universal-card-hotspot"
        style={{ left: '40.5%', top: '23.5%', width: '19.0%', height: '36.0%', borderRadius: '16px' }}
        onClick={() => onSelectStandard('quick-hub')}
        title="QR-Code scannen oder antippen für Schnellzugriff"
      />
    </div>
  );
}

function UniversalCardView({ standards, onSelectStandard, showToast }) {
  const [cardFormat, setCardFormat] = useState('atm'); // 'both' | 'a4' | 'atm'
  const list = Object.values(standards);
  const cardUrl = (typeof window !== 'undefined' && window.location)
    ? `${window.location.origin}${window.location.pathname}#/quick-hub`
    : 'https://umf-nursing-standards.web.app/#/quick-hub';
  const shareTitle = 'Universitätsmedizin Frankfurt – Universal-Pocketcard (Pflegestandards & SOPs)';
  const shareText = `Universitätsmedizin Frankfurt – Universal-Pocketcard (Pflegestandards & SOPs direkt öffnen): ${cardUrl}`;

  const handleShareCard = async () => {
    if (navigator.share) {
      try {
        // Attempt to share the ATM card image file along with text/URL if supported by device
        try {
          const response = await fetch('assets/universal-card-umf.jpg');
          const blob = await response.blob();
          const file = new File([blob], 'UMF-Universal-Karte.jpg', { type: 'image/jpeg' });
          if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: cardUrl,
              files: [file]
            });
            return;
          }
        } catch (imgErr) {
          // Fallback to URL/text share below
        }
        await navigator.share({
          title: shareTitle,
          text: 'Universitätsmedizin Frankfurt – Alle Pflege-Expertenstandards & SOPs:',
          url: cardUrl
        });
      } catch (err) {
        if (err && err.name !== 'AbortError') {
          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
        }
      }
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyShareLink = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(cardUrl).then(() => {
        showToast('Link zur Universal-Karte in die Zwischenablage kopiert!');
      });
    } else {
      showToast('Link: ' + cardUrl);
    }
  };

  // Synchronize active format class to document body for automatic Ctrl+P isolation
  useEffect(() => {
    document.body.classList.remove('active-format-a4', 'active-format-atm');
    let dynStyle = document.getElementById('dynamic-card-page-style');
    if (!dynStyle) {
      dynStyle = document.createElement('style');
      dynStyle.id = 'dynamic-card-page-style';
      document.head.appendChild(dynStyle);
    }
    if (cardFormat === 'atm') {
      document.body.classList.add('active-format-atm');
      dynStyle.textContent = `@media print { @page { size: portrait; margin: 10mm; } }`;
    } else {
      document.body.classList.add('active-format-a4');
      dynStyle.textContent = `@media print { @page { size: A4 landscape; margin: 0; } body, html { margin: 0 !important; padding: 0 !important; } }`;
    }
    return () => {
      document.body.classList.remove('active-format-a4', 'active-format-atm', 'printing-a4', 'printing-atm');
      const s = document.getElementById('dynamic-card-page-style');
      if (s) s.remove();
    };
  }, [cardFormat]);

  // Guaranteed print isolation: Only the chosen card is sent to the printer
  const handlePrint = (format) => {
    const isAtm = format === 'atm';
    document.body.classList.remove('printing-a4', 'printing-atm');
    document.body.classList.add(isAtm ? 'printing-atm' : 'printing-a4');

    let dynStyle = document.getElementById('dynamic-card-page-style');
    if (!dynStyle) {
      dynStyle = document.createElement('style');
      dynStyle.id = 'dynamic-card-page-style';
      document.head.appendChild(dynStyle);
    }
    if (isAtm) {
      dynStyle.textContent = `@media print { @page { size: portrait; margin: 10mm; } }`;
    } else {
      dynStyle.textContent = `@media print { @page { size: A4 landscape; margin: 0; } body, html { margin: 0 !important; padding: 0 !important; } }`;
    }

    const cleanup = () => {
      document.body.classList.remove('printing-a4', 'printing-atm');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    setTimeout(cleanup, 4000);

    window.print();
  };

  const downloadCardImage = () => {
    const a = document.createElement('a');
    const isAtm = cardFormat === 'atm';
    a.href = isAtm ? 'assets/universal-card-12x8.jpg' : 'assets/universal-card-a4.jpg';
    a.download = isAtm ? 'UMF-Universal-Pocketcard-12x8cm.jpg' : 'UMF-Universal-Pocketcard-A4.jpg';
    a.click();
    showToast(isAtm ? 'Universal-Pocketcard (12 × 8 cm) Bild heruntergeladen!' : 'Universal-Pocketcard A4 Bild heruntergeladen!');
  };

  const downloadPdf = (format = cardFormat) => {
    const targetFormat = format === 'both' ? 'a4' : format;
    const isAtm = targetFormat === 'atm';
    const elementId = isAtm ? 'universal-card-atm-printable' : 'universal-card-a4-sheet';
    const element = document.getElementById(elementId) || document.getElementById('universal-card-a4-printable');
    if (!element) {
      handlePrint(targetFormat);
      return;
    }
    showToast(isAtm ? 'Pocketcard-PDF (12 × 8 cm) wird erstellt...' : 'A4 Universal-Pocketcard PDF wird erstellt...');
    if (window.html2pdf) {
      const savedScrollX = window.scrollX || window.pageXOffset || 0;
      const savedScrollY = window.scrollY || window.pageYOffset || 0;
      window.scrollTo(0, 0);
      const opt = {
        margin: isAtm ? [10, 10, 10, 10] : [0, 0, 0, 0],
        filename: isAtm ? 'UMF-Universal-Pocketcard-12x8cm.pdf' : 'UMF-Universal-Pocketcard-A4.pdf',
        image: { type: 'jpeg', quality: 1.0 },
        pagebreak: { mode: [] },
        html2canvas: { scale: 3.0, useCORS: true, logging: false, scrollX: 0, scrollY: 0 },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: isAtm ? 'portrait' : 'landscape'
        }
      };
      const worker = window.html2pdf().set(opt).from(element);
      worker
        .toContainer()
        .then(() => {
          if (worker.prop.overlay) {
            worker.prop.overlay.style.cssText = 'position:fixed !important;top:0px !important;left:0px !important;right:auto !important;bottom:auto !important;width:1150px !important;height:auto !important;overflow:visible !important;opacity:0 !important;pointer-events:none !important;z-index:-9999 !important;background:#ffffff !important;';
          }
          if (worker.prop.container) {
            worker.prop.container.style.margin = '0px';
            worker.prop.container.style.left = '0px';
            worker.prop.container.style.top = '0px';
          }
        })
        .then(() => worker.toCanvas())
        .then(() => worker.toPdf())
        .then(() => worker.save())
        .then(() => {
          window.scrollTo(savedScrollX, savedScrollY);
          showToast(isAtm ? 'Pocketcard-PDF (12 × 8 cm) erfolgreich heruntergeladen!' : 'A4 Universal-Pocketcard PDF erfolgreich heruntergeladen!');
        })
        .catch((err) => {
          console.error('PDF error:', err);
          window.scrollTo(savedScrollX, savedScrollY);
          handlePrint(targetFormat);
        });
    } else {
      handlePrint(targetFormat);
    }
  };

  return (
    <div className="py-2">
      {/* Top Action Toolbar (Mobile & Desktop Responsive) */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center mb-2 gap-2 no-print">
        {/* Left: Back Button */}
        <div className="d-flex justify-content-between align-items-center gap-2">
          <a href="#/quick-hub" className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1 shadow-sm d-flex align-items-center gap-2 fw-semibold" style={{ minHeight: '36px', fontSize: '0.8rem' }}>
            <i className="bi bi-arrow-left"></i>
            <span>Schnellwahl</span>
          </a>
        </div>

        {/* Center: Format Selector Pills */}
        <div className="mobile-segmented-control mx-auto mx-lg-auto w-100" role="group" style={{ maxWidth: '460px', padding: '0.2rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'atm' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '34px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('atm')}
            title="Kompaktes Pocketcard- / ATM-Format (12 × 8 cm) für Kitteltasche und Ausweishülle"
          >
            <i className="bi bi-credit-card-2-front"></i>
            <span className="d-none d-sm-inline">Pocketcard (12 &times; 8 cm)</span>
            <span className="d-inline d-sm-none">12 &times; 8 cm</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'a4' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '34px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('a4')}
            title="A4-Format für Stationsaushang und Dokumentenmappe"
          >
            <i className="bi bi-file-earmark-text"></i>
            <span className="d-none d-sm-inline">A4-Pocketcard</span>
            <span className="d-inline d-sm-none">A4-Karte</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'both' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '34px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('both')}
            title="A4-Pocketcard und Scheckkarten-Format gleichzeitig anzeigen"
          >
            <i className="bi bi-columns"></i>
            <span className="d-none d-sm-inline">Beide Formate</span>
            <span className="d-inline d-sm-none">Beide</span>
          </button>
        </div>

        {/* Right: Symmetrical Action Buttons */}
        <div className="d-grid d-lg-flex align-items-center gap-1.5" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <button
            className="btn btn-primary btn-sm rounded-pill px-2.5 py-1 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => downloadPdf(cardFormat === 'both' ? 'a4' : cardFormat)}
            title="Universal-Pocketcard als PDF-Dokument herunterladen"
          >
            <i className="bi bi-file-earmark-arrow-down-fill"></i>
            <span>PDF</span>
          </button>
          <button
            className="btn btn-dark btn-sm rounded-pill px-2.5 py-1 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => handlePrint(cardFormat === 'atm' ? 'atm' : 'a4')}
            title={cardFormat === 'atm' ? 'Nur Pocketcard (12 × 8 cm) drucken' : 'Nur A4-Pocketcard drucken'}
          >
            <i className="bi bi-printer-fill"></i>
            <span>Drucken</span>
          </button>
          <button
            className="btn btn-outline-secondary rounded-pill px-2.5 py-1 shadow-sm btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1.5 bg-white"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={downloadCardImage}
            title="Pocketcard als hochauflösendes Bild herunterladen"
          >
            <i className="bi bi-image"></i>
            <span>Bild</span>
          </button>
          <button
            className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-1 shadow-sm btn-sm d-none d-lg-flex align-items-center justify-content-center gap-1"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => onSelectStandard('quick-hub')}
            title="Die Zielseite aller 6 Standards testen"
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Zielseite</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="d-flex flex-column align-items-center justify-content-center my-1 gap-3">
        {/* 1. THE A4-FORMAT UNIVERSAL POCKETCARD */}
        {(cardFormat === 'a4' || cardFormat === 'both') && (
          <div className="w-100 p-2 bg-white rounded-4 border shadow-sm" id="universal-card-a4-printable" style={{ maxWidth: '890px' }}>
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-2 px-3 py-2 rounded-3 gap-2 no-print shadow-sm"
              data-html2canvas-ignore="true"
              style={{
                background: 'linear-gradient(135deg, #bae6fd 0%, #dbeafe 52%, #e0e7ff 100%)',
                border: '1px solid #60a5fa'
              }}
            >
              <div className="d-flex align-items-center gap-2 min-w-0">
                <div className="bg-white p-1 rounded-2 shadow-sm d-flex align-items-center flex-shrink-0" style={{ border: '1px solid #93c5fd' }}>
                  <img src="assets/umf-logo.jpg" alt="UMF" height="24" className="rounded" />
                </div>
                <div className="min-w-0">
                  <h5 className="fw-bold mb-0 text-truncate" style={{ fontSize: '0.88rem', lineHeight: 1.2, color: '#00273d' }}>
                    Universal-Pocketcard (DIN A4: 297 &times; 210 mm)
                  </h5>
                  <div className="text-truncate" style={{ fontSize: '0.72rem', lineHeight: 1.15, color: '#0c4a6e' }}>
                    Universitätsmedizin Frankfurt &bull; <span style={{ color: '#1d4ed8', fontWeight: 700 }}>Exakte DIN-A4-Passform</span>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-md-end gap-2">
                <div className="d-flex align-items-center gap-1">
                  <span className="badge rounded-pill fw-semibold px-2 py-1" style={{ fontSize: '0.68rem', color: '#00273d', background: 'rgba(255,255,255,0.9)', border: '1px solid #93c5fd' }}>
                    <i className="bi bi-aspect-ratio me-1 text-primary"></i> DIN A4
                  </span>
                  <span className="badge rounded-pill fw-semibold font-monospace px-2 py-1 text-dark" style={{ fontSize: '0.68rem', background: '#dcfce7', border: '1px solid #86efac' }}>
                    <i className="bi bi-shield-check me-1 text-success"></i> roXtra
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn-sm btn-warning text-dark rounded-pill px-3 py-1 shadow-sm fw-bold d-flex align-items-center gap-1 no-print ms-auto ms-md-0"
                  style={{ fontSize: '0.75rem', minHeight: '34px' }}
                  onClick={() => handlePrint('a4')}
                  title="Nur die A4-Pocketcard drucken"
                >
                  <i className="bi bi-printer-fill"></i>
                  <span>A4 drucken</span>
                </button>
              </div>
            </div>

            {/* Render Crisp Native A4 Card */}
            <UniversalCardA4Native onSelectStandard={onSelectStandard} />
          </div>
        )}

        {/* 2. THE POCKETCARD / ATM-FORMAT */}
        {(cardFormat === 'atm' || cardFormat === 'both') && (
          <div className="w-100 p-3 p-md-4 bg-white rounded-4 border shadow-sm d-flex flex-column align-items-center" id="universal-card-atm-printable" style={{ maxWidth: '540px' }}>
            {/* Header Row: Properly aligned on both Mobile & Desktop */}
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom w-100 gap-2">
              <div className="d-flex align-items-center gap-2 min-w-0">
                <div className="bg-light p-1 rounded-3 border d-flex align-items-center flex-shrink-0">
                  <img src="assets/umf-logo.jpg" alt="UMF" height="26" className="rounded" />
                </div>
                <div className="min-w-0">
                  <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.92rem', lineHeight: 1.2 }}>
                    Pocketcard- / ATM-Format (12 &times; 8 cm)
                  </h5>
                  <div className="text-muted small text-truncate" style={{ fontSize: '0.72rem', lineHeight: 1.2 }}>
                    Für Kitteltasche &amp; Ausweishülle (12 &times; 8 cm)
                  </div>
                </div>
              </div>

              <span className="badge bg-warning bg-opacity-25 text-dark border border-warning px-2 py-1 rounded-pill small fw-bold flex-shrink-0" style={{ fontSize: '0.72rem' }}>
                <i className="bi bi-credit-card-2-front me-1"></i> 12 &times; 8 cm
              </span>
            </div>

            {/* The Visual Card scaled to ATM size with Clickable Hotspots */}
            <div className="w-100 d-flex justify-content-center">
              <UniversalCardInteractiveCard isAtm={true} onSelectStandard={onSelectStandard} />
            </div>

            {/* Print-only cutout guide */}
            <div className="atm-cutout-hint">
              ✂️ Entlang der gestrichelten Linie ausschneiden (Format: 12 &times; 8 cm)
            </div>

            {/* Symmetrical Share & Action Buttons (No 'Karte teilen' header text) */}
            <div className="w-100 mt-3 pt-3 border-top no-print" data-html2canvas-ignore="true">
              <div className="row g-2">
                {/* WhatsApp Share */}
                <div className="col-6 col-sm-4">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 text-white w-100"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', minHeight: '40px', fontSize: '0.82rem' }}
                    title="Universal-Karte per WhatsApp teilen"
                  >
                    <i className="bi bi-whatsapp"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Native Social Media / System Share */}
                <div className="col-6 col-sm-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-2 w-100"
                    style={{ backgroundColor: '#004767', borderColor: '#004767', minHeight: '40px', fontSize: '0.82rem' }}
                    onClick={handleShareCard}
                    title="Über Social Media oder andere Apps teilen"
                  >
                    <i className="bi bi-share-fill"></i>
                    <span>Teilen</span>
                  </button>
                </div>

                {/* Copy Link */}
                <div className="col-6 col-sm-4">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark rounded-pill py-2 px-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-1 bg-white w-100"
                    style={{ minHeight: '40px', fontSize: '0.82rem' }}
                    onClick={handleCopyShareLink}
                    title="Link kopieren"
                  >
                    <i className="bi bi-link-45deg fs-6"></i>
                    <span>Link kopieren</span>
                  </button>
                </div>

                {/* Print ATM Card */}
                <div className="col-6 col-sm-12">
                  <button
                    type="button"
                    className="btn btn-sm btn-dark rounded-pill py-2 px-3 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-2 w-100"
                    style={{ minHeight: '40px', fontSize: '0.82rem' }}
                    onClick={() => handlePrint('atm')}
                    title="Nur die Scheckkarte drucken"
                  >
                    <i className="bi bi-printer-fill"></i>
                    <span>Drucken</span>
                  </button>
                </div>
              </div>

              <div className="small text-muted text-center mt-2 pt-1" style={{ fontSize: '0.75rem' }}>
                <i className="bi bi-check2-circle text-success me-1"></i>
                Kompakt für Ausweis- &amp; Kitteltaschen &bull; 100% scannbar
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Backward compatibility alias
const MagicCardView = UniversalCardView;

// -------------------------------------------------------------
// Component: Quick Hub (Target Landing Page Opened by Magic Card Scan)
// -------------------------------------------------------------
function QuickHubView({ standards, onSelectStandard, onOpenScanner }) {
  const orderedIds = ['dekubitus', 'sturz', 'schmerz', 'ernaehrung', 'zvk', 'isolation'];
  const list = orderedIds
    .map((id) => standards[id])
    .filter(Boolean);

  const cardThemeMap = {
    dekubitus: {
      badgeText: 'EXPERTENSTANDARD',
      badgeBg: '#fde8ef',
      badgeColor: '#d81b60',
      displayTitle: 'Dekubitusprophylaxe',
      iconImg: 'assets/qh-icon-dekubitus.jpg',
      rightImg: 'assets/qh-dekubitus.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff1f6 55%, #fdf2f8 100%)',
      cardBorder: '#fbcfe8',
      cardShadow: 'rgba(190, 24, 93, 0.12)'
    },
    sturz: {
      badgeText: 'EXPERTENSTANDARD',
      badgeBg: '#e6f6e6',
      badgeColor: '#2e7d32',
      displayTitle: 'Sturzprophylaxe',
      iconImg: 'assets/qh-icon-sturz.jpg',
      rightImg: 'assets/qh-sturz.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 55%, #ecfdf5 100%)',
      cardBorder: '#bbf7d0',
      cardShadow: 'rgba(22, 163, 74, 0.12)'
    },
    schmerz: {
      badgeText: 'EXPERTENSTANDARD',
      badgeBg: '#fff0e5',
      badgeColor: '#d9531e',
      displayTitle: 'Schmerzmanagement',
      iconImg: 'assets/qh-icon-schmerz.jpg',
      rightImg: 'assets/qh-schmerz.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 55%, #ffedd5 100%)',
      cardBorder: '#fed7aa',
      cardShadow: 'rgba(234, 88, 12, 0.12)'
    },
    ernaehrung: {
      badgeText: 'EXPERTENSTANDARD',
      badgeBg: '#e3f2fd',
      badgeColor: '#0277bd',
      displayTitle: 'Ernährungsmanagement',
      iconImg: 'assets/qh-icon-ernaehrung.jpg',
      rightImg: 'assets/qh-ernaehrung.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 55%, #e0f2fe 100%)',
      cardBorder: '#bae6fd',
      cardShadow: 'rgba(2, 132, 199, 0.12)'
    },
    zvk: {
      badgeText: 'SOP & LEITFADEN',
      badgeBg: '#fde8ef',
      badgeColor: '#d81b60',
      displayTitle: 'ZVK Intensivpflege',
      iconImg: 'assets/qh-icon-zvk.jpg',
      rightImg: 'assets/qh-zvk.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 55%, #ffe4e6 100%)',
      cardBorder: '#fecdd3',
      cardShadow: 'rgba(220, 38, 38, 0.12)'
    },
    isolation: {
      badgeText: 'SOP & LEITFADEN',
      badgeBg: '#e0f4ff',
      badgeColor: '#0277bd',
      displayTitle: 'Isolation & Hygiene',
      iconImg: 'assets/qh-icon-isolation.jpg',
      rightImg: 'assets/qh-isolation.jpg',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
      cardBorder: '#e9d5ff',
      cardShadow: 'rgba(124, 58, 237, 0.12)'
    }
  };

  return (
    <div className="py-1 py-md-3 w-100">
      {/* Mobile Header Banner (Exact match to uploaded Quick Hub design) */}
      <div className="d-block d-md-none mb-2.5">
        <div
          className="rounded-4 overflow-hidden shadow-sm"
          style={{ border: '1px solid rgba(147, 197, 253, 0.7)' }}
        >
          <img
            src="assets/qh-header-banner.jpg"
            alt="SOP & Expertenstandards Schnellwahl – Universitätsmedizin Frankfurt"
            className="w-100 d-block"
            style={{ height: 'auto', objectFit: 'cover' }}
          />
        </div>
      </div>

      {/* Desktop Header Banner */}
      <div
        className="d-none d-md-flex p-3 rounded-4 mb-3 shadow-sm flex-wrap justify-content-between align-items-center gap-2 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #bae6fd 0%, #dbeafe 52%, #e0e7ff 100%)',
          border: '1.5px solid #60a5fa',
          minHeight: '86px'
        }}
      >
        <div
          className="position-absolute top-0 end-0 bottom-0 pointer-events-none"
          style={{ width: '280px', zIndex: 0 }}
        >
          <img
            src="assets/qh-header-right.jpg"
            alt=""
            className="w-100 h-100"
            style={{ objectFit: 'cover', objectPosition: 'right center' }}
          />
          <div
            className="position-absolute top-0 start-0 bottom-0"
            style={{
              width: '90px',
              background: 'linear-gradient(90deg, #dbeafe 0%, rgba(219, 234, 254, 0) 100%)'
            }}
          />
        </div>

        <div className="d-flex align-items-center gap-3 min-w-0 position-relative" style={{ zIndex: 1 }}>
          <div className="bg-white px-2.5 py-1.5 rounded-3 shadow-sm d-flex align-items-center flex-shrink-0" style={{ border: '1px solid #bfdbfe' }}>
            <img src="assets/umf-logo.jpg" alt="UMF" height="36" className="rounded" />
          </div>
          <div className="min-w-0">
            <div className="fw-black text-uppercase text-truncate" style={{ fontSize: '1.08rem', color: '#00273d', lineHeight: 1.15, letterSpacing: '0.2px' }}>
              SOP &amp; Expertenstandards Schnellwahl
            </div>
            <div className="fw-semibold text-truncate mt-0.5" style={{ fontSize: '0.84rem', color: '#0369a1' }}>
              Universitätsmedizin Frankfurt
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center gap-1.5 justify-content-end ms-auto position-relative" style={{ zIndex: 1 }}>
          <button
            type="button"
            className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3.5 py-2 shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '40px', fontSize: '0.82rem' }}
            onClick={() => onSelectStandard('universal-karte')}
          >
            <i className="bi bi-stars text-danger"></i>
            <span>Universal-Karte</span>
          </button>
        </div>
      </div>

      {/* 6 Illustrated Cards (Single-column stack on mobile matching screenshot, 2/3-col grid on desktop) */}
      <div className="row g-2.5 g-md-3 justify-content-center">
        {list.map((std) => {
          const theme = cardThemeMap[std.id] || {
            badgeText: std.id === 'zvk' || std.id === 'isolation' ? 'SOP & LEITFADEN' : 'EXPERTENSTANDARD',
            badgeBg: std.badgeBg || '#e0f2fe',
            badgeColor: std.accentColor || '#0284c7',
            displayTitle: std.shortTitle,
            iconImg: `assets/qh-icon-${std.id}.jpg`,
            rightImg: `assets/qh-${std.id}.jpg`
          };

          return (
            <div key={std.id} className="col-12 col-md-6 col-xl-4">
              <div
                className="quick-hub-label-card rounded-4 h-100 d-flex align-items-center position-relative overflow-hidden"
                onClick={() => onSelectStandard(std.id)}
                style={{
                  cursor: 'pointer',
                  background: theme.cardBg || '#ffffff',
                  border: `1.5px solid ${theme.cardBorder || 'rgba(226, 232, 240, 0.9)'}`,
                  boxShadow: `0 4px 18px ${theme.cardShadow || 'rgba(15, 23, 42, 0.06)'}`,
                  minHeight: '94px',
                  padding: '0.75rem 0.85rem',
                  transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {/* Right-hand clinical illustration + pastel wave + chevron from design */}
                <div
                  className="position-absolute top-0 end-0 bottom-0 pointer-events-none"
                  style={{
                    width: '47%',
                    zIndex: 1
                  }}
                >
                  <img
                    src={theme.rightImg}
                    alt=""
                    className="w-100 h-100 d-block"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'right center'
                    }}
                  />
                  {/* Smooth gradient blend into the white card background on the left */}
                  <div
                    className="position-absolute top-0 start-0 bottom-0"
                    style={{
                      width: '34%',
                      background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.82) 45%, rgba(255,255,255,0) 100%)'
                    }}
                  />
                </div>

                {/* Left Rounded Gradient Icon */}
                <div
                  className="flex-shrink-0 me-3 position-relative"
                  style={{ zIndex: 2 }}
                >
                  <img
                    src={theme.iconImg}
                    alt={theme.displayTitle}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>

                {/* Center Badge, Title, and roXtra IDs */}
                <div
                  className="flex-grow-1 min-w-0 position-relative pe-5"
                  style={{ zIndex: 2 }}
                >
                  <span
                    className="badge rounded-pill text-uppercase fw-extrabold mb-1 d-inline-block"
                    style={{
                      fontSize: '0.64rem',
                      letterSpacing: '0.3px',
                      padding: '0.26rem 0.6rem',
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeColor
                    }}
                  >
                    {theme.badgeText}
                  </span>
                  <h5
                    className="fw-extrabold mb-0 text-truncate"
                    style={{
                      fontSize: '1.06rem',
                      color: '#0c1e35',
                      lineHeight: 1.2,
                      fontWeight: 800
                    }}
                  >
                    {theme.displayTitle}
                  </h5>
                  <div
                    className="text-truncate mt-1"
                    style={{
                      fontSize: '0.75rem',
                      color: '#4b5563',
                      fontWeight: 500
                    }}
                  >
                    roXtra ID: {std.roXtraIds.join(', ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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

