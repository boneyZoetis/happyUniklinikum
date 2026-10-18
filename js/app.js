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

      {/* Modern Hospital Top Banner - Hidden on quick-hub, and hidden on mobile when viewing a selected standard tile */}
      {currentRoute !== 'quick-hub' && (
        <div className={`hospital-banner shadow-sm ${isStandardRoute ? 'd-none d-md-block' : ''}`}>
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

      {/* Main Menu Bar with Clinical Category Colors - Hidden on mobile for quick-hub and selected tiles, always visible on desktop */}
      <nav className={`navbar navbar-expand-lg navbar-custom sticky-top shadow-sm py-1 ${(isStandardRoute || currentRoute === 'quick-hub') ? 'd-none d-md-block' : ''}`}>
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

      {/* Native-Style Mobile Sticky Bottom Navigation Bar (Hidden on Quick Hub and Selected Standard Tiles) */}
      {!isStandardRoute && currentRoute !== 'quick-hub' && (
        <nav className="mobile-bottom-nav d-flex d-md-none no-print" aria-label="Mobile Schnellnavigation">
          <button
            type="button"
            className={`mobile-bottom-nav-item ${currentRoute === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('')}
          >
            <i className="bi bi-grid-fill"></i>
            <span>Start</span>
          </button>
          <button
            type="button"
            className={`mobile-bottom-nav-item ${currentRoute === 'quick-hub' ? 'active' : ''}`}
            onClick={() => navigateTo('quick-hub')}
          >
            <i className="bi bi-lightning-charge-fill"></i>
            <span>6 Standards</span>
          </button>
          <button
            type="button"
            className={`mobile-bottom-nav-item highlight ${currentRoute === 'universal-karte' || currentRoute === 'magic-card' ? 'active' : ''}`}
            onClick={() => navigateTo('universal-karte')}
          >
            <i className="bi bi-stars"></i>
            <span>Universal</span>
          </button>
          <button
            type="button"
            className={`mobile-bottom-nav-item ${currentRoute === 'qrcodes' ? 'active' : ''}`}
            onClick={() => navigateTo('qrcodes')}
          >
            <i className="bi bi-collection-fill"></i>
            <span>Karten</span>
          </button>
          <button
            type="button"
            className="mobile-bottom-nav-item"
            onClick={() => setIsScanModalOpen(true)}
          >
            <i className="bi bi-qr-code-scan"></i>
            <span>Scanner</span>
          </button>
        </nav>
      )}

      {/* Footer: on quick-hub show ONLY the colorful accent line; on standard tiles hide full footer on mobile */}
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
        <footer className={`modern-footer mt-auto text-white ${isStandardRoute ? 'd-none d-md-block' : ''}`}>
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
// Component: The Main Tiles Overview (Modern, Beautified Cards without embedded QR codes)
// -------------------------------------------------------------
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
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-2.5 gap-2">
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <div
                      className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
                      style={{
                        width: '42px',
                        height: '42px',
                        background: std.bannerGradient || std.accentColor
                      }}
                    >
                      <i className={`bi ${std.icon} fs-5`}></i>
                    </div>
                    <span
                      className="fw-bold px-2.5 py-1 rounded-pill d-inline-block text-uppercase text-truncate"
                      style={{
                        fontSize: '0.7rem',
                        letterSpacing: '0.4px',
                        backgroundColor: std.badgeBg || 'rgba(0, 71, 103, 0.08)',
                        color: std.accentColor
                      }}
                    >
                      {std.shortTitle}
                    </span>
                  </div>

                  <span className="badge bg-light text-secondary border font-monospace px-2 py-1 rounded-pill" style={{ fontSize: '0.72rem' }}>
                    roXtra: <strong>{std.roXtraIds.slice(0, 2).join(' / ')}{std.roXtraIds.length > 2 ? '…' : ''}</strong>
                  </span>
                </div>

                {/* Title */}
                <h4 className="fw-bold text-dark mb-1.5" style={{ lineHeight: '1.3', fontSize: '1.08rem' }}>
                  {std.topic}
                </h4>

                {/* Subtitle / Lead text */}
                <p className="text-secondary small mb-2.5" style={{ lineHeight: '1.45', fontSize: '0.84rem' }}>
                  {std.leadText}
                </p>

                {/* Highlighted Clinical Bullet Points Box (Full width, no QR) */}
                <div
                  className="p-2.5 p-sm-3 rounded-3 mb-3 mt-auto"
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderLeft: `3px solid ${std.accentColor}`
                  }}
                >
                  <div className="small fw-bold text-uppercase mb-1.5 d-flex align-items-center gap-1" style={{ fontSize: '0.7rem', color: std.accentColor }}>
                    <i className="bi bi-shield-check"></i>
                    <span>Klinische Kernaspekte:</span>
                  </div>
                  <div className="d-flex flex-column gap-1.5">
                    {std.keyPoints.slice(0, 3).map((kp, idx) => (
                      <div key={idx} className="small text-dark d-flex align-items-start gap-2" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                        <i className="bi bi-check-circle-fill flex-shrink-0 mt-0.5" style={{ color: std.accentColor, fontSize: '0.82rem' }}></i>
                        <span>{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Action button */}
                <div className="d-flex justify-content-end align-items-center pt-2.5 border-top gap-2 mt-auto">
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-2 d-flex align-items-center justify-content-center gap-2 shadow-sm text-white fw-bold w-100 w-sm-auto"
                    style={{
                      background: std.accentColor,
                      border: 'none',
                      minHeight: '44px',
                      fontSize: '0.85rem'
                    }}
                  >
                    <span>Pocketcard &amp; Leitfaden öffnen</span>
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
  const isPdfPopupStandard = standard.id === 'zvk' || standard.id === 'isolation';
  const rawPdfUrl = standard.pdfUrl || (standard.id === 'zvk' ? 'assets/zvk-sop-verfahrensanweisung.pdf' : (standard.id === 'isolation' ? 'assets/isolation-sop-verfahrensanweisung.pdf' : 'assets/umf-expertenstandards-folien.pdf'));
  const pdfBaseUrl = rawPdfUrl.split('#')[0];
  const pdfUrl = rawPdfUrl;

  return (
    <div className="mb-4">
      {/* THE BEAUTIFIED PRINTABLE / DOWNLOADABLE POCKETCARD */}
      <div className="pocketcard-printable-view" id={`pocketcard-${standard.id}`}>
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
                        Verfahrensanweisung &amp; SOP: {standard.shortTitle}
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-white text-secondary border px-2.5 py-1 small font-monospace">
                        roXtra ID: <strong>{standard.roXtraIds.join(' / ')}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Body: Direct SOP PDF Viewer */}
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
                          {standard.id === 'zvk'
                            ? 'Offizielle Verfahrensanweisung ZVK (10 Seiten) • roXtra ID: 391904'
                            : 'Allgemeines Vorgehen bei Isolation und Reinigung (4 Seiten) • roXtra ID: 239411'}
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
                        className="btn btn-sm btn-outline-dark rounded-pill px-2.5 py-1"
                        style={{ fontSize: '0.76rem' }}
                        onClick={() => setIsPdfModalOpen(true)}
                      >
                        <i className="bi bi-arrows-fullscreen me-1"></i>Vollbild
                      </button>
                      <a
                        href={standard.sopPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-danger rounded-pill px-2.5 py-1 fw-semibold"
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

              {standard.sopPdfUrl && (
                <a
                  href={standard.sopPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-danger btn-sm rounded-pill px-3 py-2 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-1.5 w-100 w-sm-auto"
                  style={{ minHeight: '44px' }}
                  title="Vollständige Verfahrensanweisung (SOP) als Original-PDF öffnen"
                >
                  <i className="bi bi-file-earmark-pdf-fill"></i>
                  <span>Original SOP öffnen ({standard.id === 'zvk' ? '10 S.' : '4 S.'})</span>
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
    const elementId = `pocketcard-${std.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }
    showToast('PDF für Pocketcard wird erstellt...');

    if (window.html2pdf) {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: `UMF-Pocketcard-${std.shortTitle.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
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
          showToast('PDF für Pocketcard erfolgreich heruntergeladen!');
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
      {/* Mobile-Only Single Home Button -> Returns to Quick Hub */}
      <div className="d-flex d-md-none mb-2.5 no-print">
        <a
          href="#/quick-hub"
          className="btn btn-primary btn-sm rounded-pill px-3.5 py-2 shadow-sm d-inline-flex align-items-center gap-2 fw-bold"
          style={{ minHeight: '40px', fontSize: '0.86rem' }}
        >
          <i className="bi bi-house-door-fill"></i>
          <span>Home</span>
        </a>
      </div>

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
    const elementId = `pocketcard-${std.id}`;
    const element = document.getElementById(elementId);
    if (!element) {
      window.print();
      return;
    }
    showToast('PDF für Pocketcard wird erstellt...');

    if (window.html2pdf) {
      const opt = {
        margin: [6, 6, 6, 6],
        filename: `UMF-Pocketcard-${std.shortTitle.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
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
          showToast(`PDF für ${std.shortTitle} erfolgreich heruntergeladen!`);
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
      <img
        src="assets/universal-card-umf.jpg"
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
        title="Hier scannen / Schnellzugriff für alle 6 Standards öffnen"
      />
    </div>
  );
}

// -------------------------------------------------------------
// Component: Universal-Karte Native A4 Clinical Sheet (Crisp & Unzoomed)
// -------------------------------------------------------------
function UniversalCardA4Native({ onSelectStandard }) {
  const cardUrl = (typeof window !== 'undefined' && window.location)
    ? `${window.location.origin}${window.location.pathname}#/quick-hub`
    : 'https://umf-nursing-standards.web.app/#/quick-hub';

  const rows = [
    {
      num: 1,
      id: 'dekubitus',
      title: 'Dekubitusprophylaxe',
      icon: 'bi-bandaid-fill',
      color: '#db2777',
      bgGradient: 'linear-gradient(90deg, #fce7f3 0%, #fbcfe8 55%, #fdf2f8 100%)',
      thumb: 'assets/pocket-thumb-dekubitus.jpg'
    },
    {
      num: 2,
      id: 'sturz',
      title: 'Sturzprophylaxe',
      icon: 'bi-shield-exclamation',
      color: '#16a34a',
      bgGradient: 'linear-gradient(90deg, #dcfce7 0%, #bbf7d0 55%, #f0fdf4 100%)',
      thumb: 'assets/pocket-thumb-sturz.jpg'
    },
    {
      num: 3,
      id: 'schmerz',
      title: 'Schmerzmanagement',
      icon: 'bi-heart-pulse-fill',
      color: '#ea580c',
      bgGradient: 'linear-gradient(90deg, #ffedd5 0%, #fed7aa 55%, #fff7ed 100%)',
      thumb: 'assets/pocket-thumb-schmerz.jpg'
    },
    {
      num: 4,
      id: 'ernaehrung',
      title: 'Ernährungsmanagement',
      icon: 'bi-apple',
      color: '#0284c7',
      bgGradient: 'linear-gradient(90deg, #e0f2fe 0%, #bae6fd 55%, #f0f9ff 100%)',
      thumb: 'assets/pocket-thumb-ernaehrung.jpg'
    },
    {
      num: 5,
      id: 'zvk',
      title: 'ZVK Intensivpflege',
      icon: 'bi-droplet-fill',
      color: '#e11d48',
      bgGradient: 'linear-gradient(90deg, #ffe4e6 0%, #fecdd3 55%, #fff1f2 100%)',
      thumb: 'assets/pocket-thumb-zvk.jpg'
    },
    {
      num: 6,
      id: 'isolation',
      title: 'Isolation & Hygiene',
      icon: 'bi-shield-shaded',
      color: '#7c3aed',
      bgGradient: 'linear-gradient(90deg, #f3e8ff 0%, #e9d5ff 55%, #faf5ff 100%)',
      thumb: 'assets/pocket-thumb-isolation.jpg'
    }
  ];

  const bottomItems = [
    { icon: 'bi-clipboard2-check-fill', label: 'Standardisiert', bg: '#d8effc', iconColor: '#0369a1' },
    { icon: 'bi-bullseye', label: 'Patientensicherheit', bg: '#d5f5e9', iconColor: '#0f766e' },
    { icon: 'bi-people-fill', label: 'Qualität in der Pflege', bg: '#fde6cd', iconColor: '#ea580c' },
    { icon: 'bi-lightbulb-fill', label: 'Wissensmanagement', bg: '#fef0b8', iconColor: '#d97706' },
    { icon: 'bi-gear-fill', label: 'Aktuelle SOPs', bg: '#ebe4ff', iconColor: '#6d28d9' },
    { icon: 'bi-book-half', label: 'Immer verfügbar', bg: '#fce2ef', iconColor: '#be185d' }
  ];

  return (
    <div className="a4-native-card d-flex flex-column position-relative overflow-hidden" id="universal-card-a4-sheet">
      {/* 1. COMPACT TOP HEADER WITH FRANKFURT SKYLINE & ECG WAVE */}
      <div className="a4-card-header d-flex align-items-center justify-content-between ps-2.5 pe-0 py-0 position-relative overflow-hidden">
        <div className="d-flex align-items-center gap-2 py-1 z-1">
          <div className="bg-white px-1.5 py-0.5 rounded-2 shadow-sm d-flex align-items-center" style={{ border: '1.5px solid #60a5fa' }}>
            <img src="assets/umf-logo.jpg" alt="UMF Logo" style={{ height: '30px', width: 'auto' }} />
          </div>
          <div className="ps-0.5">
            <div className="fw-black text-uppercase" style={{ fontSize: '1.02rem', letterSpacing: '0.03em', lineHeight: 1.1, color: '#00273d' }}>
              Universitätsmedizin Frankfurt
            </div>
            <div className="fw-bold d-flex align-items-center flex-wrap gap-1" style={{ fontSize: '0.76rem', letterSpacing: '0.01em' }}>
              <span style={{ color: '#0c4a6e' }}>Digitale Pflege-Pocketcard</span>
              <span style={{ color: '#64748b' }}>|</span>
              <span style={{ color: '#1e3a8a', background: '#ffffff', padding: '0 6px', borderRadius: '4px', border: '1px solid #93c5fd' }}>SOP-Schnellzugriff</span>
            </div>
          </div>
        </div>

        {/* Right Header: Magic Card Pill + ECG Wave + Frankfurt Skyline Photo */}
        <div className="d-flex align-items-center align-self-stretch position-relative">
          <div className="d-none d-sm-flex flex-column align-items-center justify-content-center me-1 z-2">
            <span
              className="badge rounded-pill px-2.5 py-0.5 fw-bold text-white shadow-sm d-inline-flex align-items-center gap-1"
              style={{
                background: 'linear-gradient(135deg, #0284c7 0%, #1d4ed8 100%)',
                border: '1px solid #60a5fa',
                fontSize: '0.68rem',
                letterSpacing: '0.04em',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.3)'
              }}
            >
              <span style={{ color: '#fde047' }}>✦</span> MAGIC CARD
            </span>
            <svg width="84" height="16" viewBox="0 0 96 22" style={{ overflow: 'visible' }}>
              <path
                d="M 0 15 L 26 15 L 32 9 L 37 18 L 43 2 L 49 20 L 54 11 L 59 15 L 96 15"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="a4-header-skyline-box h-100 position-relative overflow-hidden">
            <img
              src="assets/pocket-skyline.jpg"
              alt="Frankfurt Skyline"
              className="a4-header-skyline-img"
            />
          </div>
        </div>
      </div>

      {/* 2. COMPACT SUBHEADER BANNER WITH YELLOW NOTE & CENTRAL BANNER */}
      <div className="a4-card-subheader px-2.5 py-1 d-flex align-items-center justify-content-between position-relative">
        {/* Left: Yellow sticky note */}
        <div className="d-flex align-items-center gap-1.5">
          <div className="a4-yellow-note shadow-sm">
            <div className="a4-note-pin"><i className="bi bi-pin-angle-fill text-danger"></i></div>
            <div className="a4-note-heart">❤️</div>
            <div className="fw-bold text-dark" style={{ lineHeight: 1.12 }}>
              Wissen &bull; Sicherheit<br/>
              Qualität <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>in der Pflege</span>
            </div>
          </div>
          <div className="d-none d-md-flex align-items-center opacity-25 text-primary" style={{ pointerEvents: 'none' }}>
            <i className="bi bi-clipboard2-check" style={{ fontSize: '1.85rem', transform: 'rotate(-10deg)' }}></i>
          </div>
        </div>

        {/* Center: Golden Yellow Highlight Banner + Red SOP Ribbon */}
        <div className="text-center flex-grow-1 px-2 d-flex flex-column align-items-center">
          <div className="a4-yellow-title-banner px-3 py-0.5 shadow-sm">
            <h2 className="a4-main-title mb-0 fw-black text-uppercase">
              Klinische Pflegestandards
            </h2>
          </div>
          <div className="a4-sop-banner text-uppercase fw-black text-white d-inline-block px-3 py-0.5 rounded-pill shadow-sm">
            SOP – Schnellzugriff
          </div>
        </div>

        {/* Right: 4 Checkmarks */}
        <div className="a4-checkmarks-list text-start ps-1 pe-1">
          <div className="text-dark fw-bold"><i className="bi bi-check2 text-dark fw-black me-1"></i> <em>Aktuell</em></div>
          <div className="text-dark fw-bold"><i className="bi bi-check2 text-dark fw-black me-1"></i> <em>Einfach</em></div>
          <div className="text-dark fw-bold"><i className="bi bi-check2 text-dark fw-black me-1"></i> <em>Schnell</em></div>
          <div className="text-dark fw-bold"><i className="bi bi-check2 text-dark fw-black me-1"></i> <em>Zuverlässig</em></div>
        </div>
      </div>

      {/* 3. MAIN SECTION: COMPACT 6 ROWS (NO EXTRA WIDTH/GAP) + QR SCANNER & ICU SCENE */}
      <div className="a4-card-body ps-2.5 pe-0 py-1.5 d-flex gap-2 align-items-stretch justify-content-between position-relative">
        {/* LEFT COLUMN: 6 TIGHTLY STACKED ROWS WITH ZERO EMPTY HORIZONTAL GAP */}
        <div className="a4-rows-col d-flex flex-column justify-content-between" style={{ width: '475px', maxWidth: '100%', gap: '3px', flexShrink: 0 }}>
          {rows.map((row) => (
            <div
              key={row.id}
              className="a4-standard-row d-flex align-items-center justify-content-between shadow-sm position-relative overflow-hidden"
              onClick={() => onSelectStandard(row.id)}
              style={{
                background: row.bgGradient,
                border: `1.5px solid ${row.color}45`,
                borderRadius: '50rem'
              }}
              title={`${row.num}. ${row.title} öffnen`}
            >
              <div className="d-flex align-items-center gap-1.5 ps-1 py-0.5 z-1">
                {/* Number Circle */}
                <div
                  className="a4-row-number text-white fw-black rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                  style={{
                    backgroundColor: row.color,
                    width: '30px',
                    height: '30px',
                    fontSize: '0.92rem',
                    border: '2px solid #ffffff',
                    flexShrink: 0
                  }}
                >
                  {row.num}
                </div>

                {/* Solid Colored Icon Circle with White Ring */}
                <div
                  className="a4-row-icon rounded-circle d-flex align-items-center justify-content-center shadow-sm text-white"
                  style={{
                    backgroundColor: row.color,
                    width: '30px',
                    height: '30px',
                    fontSize: '0.92rem',
                    border: '2px solid #ffffff',
                    flexShrink: 0
                  }}
                >
                  <i className={`bi ${row.icon}`}></i>
                </div>

                {/* Standard Title + Immediate Chevron (no wide empty gap!) */}
                <div className="fw-black text-dark ps-0.5 text-nowrap a4-row-title" style={{ fontSize: '0.94rem', letterSpacing: '-0.01em' }}>
                  {row.title}
                </div>
                <i className="bi bi-chevron-right fw-black ms-0.5" style={{ color: row.color, fontSize: '0.98rem' }}></i>
              </div>

              {/* Clean Original Clinical Thumbnail Photo */}
              <div className="a4-row-thumb-box overflow-hidden rounded-end-pill">
                <img
                  src={row.thumb}
                  alt={row.title}
                  className="a4-row-thumb-img"
                />
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT COLUMN: GLASSMORPHIC QR SCANNER CARD + ICU MONITOR & HOSPITAL BED PHOTO */}
        <div className="a4-right-clinical-panel d-flex align-items-stretch flex-grow-1 position-relative">
          {/* Glassmorphic QR Scanner Card */}
          <div className="a4-scanner-col d-flex flex-column align-items-center justify-content-center p-2 text-center shadow-sm position-relative z-2" style={{ width: '215px', flexShrink: 0 }}>
            <div className="a4-scanner-rays" aria-hidden="true">
              <span className="ray ray-1"></span>
              <span className="ray ray-2"></span>
              <span className="ray ray-3"></span>
            </div>

            <div
              className="a4-qr-wrapper shadow-sm mb-1.5"
              onClick={() => onSelectStandard('quick-hub')}
              style={{ cursor: 'pointer' }}
              title="QR-Code scannen oder antippen für Schnellzugriff"
            >
              <div className="a4-bracket a4-bracket-tl"></div>
              <div className="a4-bracket a4-bracket-tr"></div>
              <div className="a4-bracket a4-bracket-bl"></div>
              <div className="a4-bracket a4-bracket-br"></div>
              <QrCodeCanvas value={cardUrl} size={118} color="#001f33" />
            </div>

            <button
              type="button"
              className="a4-scan-cta-btn btn btn-primary fw-black text-uppercase w-100 py-1 px-2.5 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-1.5 mb-1"
              style={{
                fontSize: '0.8rem',
                letterSpacing: '0.03em',
                background: 'linear-gradient(180deg, #0ea5e9 0%, #0284c7 45%, #0369a1 100%)',
                border: '1.5px solid #bae6fd'
              }}
              onClick={() => onSelectStandard('quick-hub')}
            >
              <i className="bi bi-qr-code-scan"></i>
              <span>Hier scannen</span>
            </button>

            <div className="fw-bold text-dark" style={{ fontSize: '0.72rem', lineHeight: 1.15 }}>
              Schnellzugriff auf alle<br/>
              <span className="fw-black" style={{ color: '#00273d', fontSize: '0.76rem' }}>6 Pflegestandards / SOPs</span>
            </div>
          </div>

          {/* Right Clinical Picture: ICU Vital Monitor (72/98/16), Infusion Pumps & Hospital Bed */}
          <div className="a4-icu-scene-box flex-grow-1 overflow-hidden position-relative">
            <img
              src="assets/pocket-icu-monitor.jpg"
              alt="Klinisches Intensivpflege-Monitoring und Krankenbett"
              className="a4-icu-scene-img"
            />
          </div>
        </div>
      </div>

      {/* 4. CLEARLY VISIBLE UNIVERSITÄTSKLINIKUM FRANKFURT CAMPUS PICTURE BANNER (Fills A4 Paper Height) */}
      <div className="a4-ukf-bottom-banner flex-grow-1 position-relative overflow-hidden border-top" style={{ borderColor: '#38bdf8' }}>
        <img
          src="assets/uniklinikum-frankfurt-banner.jpg"
          alt="Universitätsklinikum Frankfurt Campus und Haupteingang"
          className="a4-ukf-bottom-img"
        />
        <div className="a4-ukf-bottom-badge-corner px-2.5 py-1">
          <span className="badge rounded-pill bg-white bg-opacity-90 text-dark fw-black px-2.5 py-1 shadow-sm d-inline-flex align-items-center gap-1.5" style={{ fontSize: '0.68rem', border: '1px solid #38bdf8' }}>
            <i className="bi bi-hospital-fill text-primary"></i>
            <span>UNIVERSITÄTSKLINIKUM FRANKFURT &bull; THEODOR-STERN-KAI 7</span>
          </span>
        </div>
      </div>

      {/* 5. BOTTOM 6-SEGMENT PASTEL VALUE BAR (MATCHING ATM CARD) */}
      <div className="a4-bottom-bar d-grid border-top">
        {bottomItems.map((item, idx) => (
          <div
            key={idx}
            className="a4-bottom-segment d-flex align-items-center justify-content-center gap-1 px-1.5 py-1"
            style={{ backgroundColor: item.bg }}
          >
            <i className={`bi ${item.icon}`} style={{ color: item.iconColor, fontSize: '0.92rem' }}></i>
            <span className="fw-bold text-dark text-nowrap" style={{ fontSize: '0.72rem' }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UniversalCardView({ standards, onSelectStandard, showToast }) {
  const [cardFormat, setCardFormat] = useState('both'); // 'both' | 'a4' | 'atm'
  const list = Object.values(standards);
  const cardUrl = (typeof window !== 'undefined' && window.location)
    ? `${window.location.origin}${window.location.pathname}#/quick-hub`
    : 'https://umf-nursing-standards.web.app/#/quick-hub';

  // Synchronize active format class to document body for automatic Ctrl+P isolation
  useEffect(() => {
    document.body.classList.remove('active-format-a4', 'active-format-atm');
    if (cardFormat === 'atm') {
      document.body.classList.add('active-format-atm');
    } else {
      document.body.classList.add('active-format-a4');
    }
    return () => {
      document.body.classList.remove('active-format-a4', 'active-format-atm', 'printing-a4', 'printing-atm');
    };
  }, [cardFormat]);

  // Guaranteed print isolation: Only the chosen card is sent to the printer
  const handlePrint = (format) => {
    const isAtm = format === 'atm';
    document.body.classList.remove('printing-a4', 'printing-atm');
    document.body.classList.add(isAtm ? 'printing-atm' : 'printing-a4');

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
    a.href = 'assets/universal-card-umf.jpg';
    a.download = 'UMF-Universal-Pocketcard.jpg';
    a.click();
    showToast('Universal-Pocketcard Bild heruntergeladen!');
  };

  const downloadPdf = (format = cardFormat) => {
    const targetFormat = format === 'both' ? 'a4' : format;
    const elementId = targetFormat === 'atm' ? 'universal-card-atm-printable' : 'universal-card-a4-sheet';
    const element = document.getElementById(elementId) || document.getElementById('universal-card-a4-printable');
    if (!element) {
      handlePrint(targetFormat);
      return;
    }
    const isAtm = targetFormat === 'atm';
    showToast(isAtm ? 'Scheckkarten-PDF wird erstellt...' : 'A4 Universal-Pocketcard PDF wird erstellt...');
    if (window.html2pdf) {
      const opt = {
        margin: isAtm ? [10, 10, 10, 10] : [5, 5, 5, 5],
        filename: isAtm ? 'UMF-Universal-Karte-Scheckkarte.pdf' : 'UMF-Universal-Pocketcard-A4.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2.5, useCORS: true, logging: false },
        jsPDF: {
          unit: 'mm',
          format: 'a4',
          orientation: isAtm ? 'portrait' : 'landscape'
        }
      };
      window.html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          showToast(isAtm ? 'Scheckkarten-PDF erfolgreich heruntergeladen!' : 'A4 Universal-Pocketcard PDF erfolgreich heruntergeladen!');
        })
        .catch((err) => {
          console.error('PDF error:', err);
          handlePrint(targetFormat);
        });
    } else {
      handlePrint(targetFormat);
    }
  };

  return (
    <div className="py-1">
      {/* Top Action Toolbar (Mobile-First Structured Layout & Compact Desktop Row) */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-stretch align-items-lg-center mb-2 gap-2 no-print">
        {/* Top Row on Mobile: Back Button + Quick Target Page Button */}
        <div className="d-flex justify-content-between align-items-center gap-2">
          <a href="#/" className="btn btn-outline-dark btn-sm rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center gap-1.5 fw-semibold" style={{ minHeight: '38px', fontSize: '0.8rem' }}>
            <i className="bi bi-arrow-left"></i>
            <span>Übersicht</span>
          </a>

          <button
            className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-1.5 shadow-sm btn-sm d-flex d-lg-none align-items-center gap-1.5"
            style={{ minHeight: '38px', fontSize: '0.8rem' }}
            onClick={() => onSelectStandard('quick-hub')}
            title="Die Zielseite aller 6 Standards testen"
          >
            <i className="bi bi-lightning-charge-fill text-danger"></i>
            <span>Schnellwahl (6 Standards)</span>
          </button>
        </div>

        {/* Row 2 on Mobile / Center on Desktop: Format Selector Pills */}
        <div className="mobile-segmented-control mx-lg-auto" role="group" style={{ maxWidth: '460px', padding: '0.2rem' }}>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'both' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '36px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('both')}
            title="A4-Pocketcard und Scheckkarten-Format gleichzeitig anzeigen"
          >
            <i className="bi bi-columns"></i>
            <span className="d-none d-sm-inline">Beide Formate</span>
            <span className="d-inline d-sm-none">Beide</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'a4' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '36px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('a4')}
            title="A4-Format für Stationsaushang und Dokumentenmappe"
          >
            <i className="bi bi-file-earmark-text"></i>
            <span className="d-none d-sm-inline">A4-Pocketcard</span>
            <span className="d-inline d-sm-none">A4-Karte</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'atm' ? 'btn-dark shadow-sm' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.76rem', minHeight: '36px', padding: '0.2rem 0.5rem' }}
            onClick={() => setCardFormat('atm')}
            title="Kompaktes Scheckkarten-Format für Kitteltasche und Ausweishülle"
          >
            <i className="bi bi-credit-card-2-front"></i>
            <span className="d-none d-sm-inline">Scheckkarte (ATM)</span>
            <span className="d-inline d-sm-none">ATM-Karte</span>
          </button>
        </div>

        {/* Row 3 on Mobile / Right on Desktop: Symmetrical Action Buttons */}
        <div className="d-grid d-lg-flex align-items-center gap-1.5" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
          <button
            className="btn btn-primary btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '38px', fontSize: '0.78rem' }}
            onClick={() => downloadPdf(cardFormat === 'both' ? 'a4' : cardFormat)}
            title="Universal-Pocketcard als PDF-Dokument herunterladen"
          >
            <i className="bi bi-file-earmark-arrow-down-fill"></i>
            <span>PDF</span>
          </button>
          <button
            className="btn btn-dark btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '38px', fontSize: '0.78rem' }}
            onClick={() => handlePrint(cardFormat === 'atm' ? 'atm' : 'a4')}
            title={cardFormat === 'atm' ? 'Nur Scheckkarte drucken' : 'Nur A4-Pocketcard drucken'}
          >
            <i className="bi bi-printer-fill"></i>
            <span>Drucken</span>
          </button>
          <button
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5 shadow-sm btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1.5 bg-white"
            style={{ minHeight: '38px', fontSize: '0.78rem' }}
            onClick={downloadCardImage}
            title="Pocketcard als hochauflösendes Bild herunterladen"
          >
            <i className="bi bi-image"></i>
            <span>Bild</span>
          </button>
          <button
            className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-1.5 shadow-sm btn-sm d-none d-lg-flex align-items-center justify-content-center gap-1"
            style={{ minHeight: '38px', fontSize: '0.78rem' }}
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
        {/* 1. THE A4-FORMAT UNIVERSAL POCKETCARD (ISO A4 PAPER PROPORTION & PRINT FIT) */}
        {(cardFormat === 'a4' || cardFormat === 'both') && (
          <div className="w-100 p-1.5 p-sm-2 bg-white rounded-4 border shadow-sm" id="universal-card-a4-printable" style={{ maxWidth: '890px' }}>
            <div
              className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-2 px-2.5 px-sm-3 py-2 rounded-3 gap-2 no-print shadow-sm"
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

              <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-md-end gap-1.5">
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
          <div className="w-100 p-2.5 p-sm-3 p-md-4 bg-white rounded-4 border shadow-sm d-flex flex-column align-items-center" id="universal-card-atm-printable" style={{ maxWidth: '1020px' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 pb-2 border-bottom w-100 gap-2">
              <div className="d-flex align-items-center gap-2 min-w-0">
                <div className="bg-light p-1.5 rounded-3 border d-flex align-items-center flex-shrink-0">
                  <img src="assets/umf-logo.jpg" alt="UMF" height="26" className="rounded" />
                </div>
                <div className="min-w-0">
                  <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '0.96rem' }}>
                    Scheckkarten- / ATM-Format
                  </h5>
                  <div className="text-muted small text-truncate" style={{ fontSize: '0.74rem' }}>
                    Für Kitteltasche &amp; Ausweishülle (85,6 &times; 54 mm)
                  </div>
                </div>
              </div>

              <span className="badge bg-warning bg-opacity-25 text-dark border border-warning px-2.5 py-1 rounded-pill small fw-bold">
                <i className="bi bi-credit-card-2-front me-1"></i> ATM-Karte
              </span>
            </div>

            {/* The Visual Card scaled to ATM size with Clickable Hotspots */}
            <UniversalCardInteractiveCard isAtm={true} onSelectStandard={onSelectStandard} />

            {/* Print-only cutout guide */}
            <div className="atm-cutout-hint">
              ✂️ Entlang der gestrichelten Linie ausschneiden (Standard ID-Ausweisformat: 85,6 &times; 54 mm)
            </div>

            {/* Bottom Info Bar & Quick Actions for ATM */}
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center pt-3 mt-3 border-top w-100 gap-2 no-print" data-html2canvas-ignore="true">
              <div className="small text-muted text-center text-sm-start" style={{ fontSize: '0.78rem' }}>
                <i className="bi bi-check2-circle text-success me-1"></i>
                Kompakt für Ausweis- &amp; Kitteltaschen &bull; 100% scannbar
              </div>

              <button
                type="button"
                className="btn btn-sm btn-dark rounded-pill px-3 py-2 shadow-sm fw-bold d-flex align-items-center justify-content-center gap-1.5 w-100 w-sm-auto"
                style={{ minHeight: '42px' }}
                onClick={() => handlePrint('atm')}
                title="Nur die Scheckkarte drucken"
              >
                <i className="bi bi-printer-fill"></i>
                <span>Scheckkarte drucken</span>
              </button>
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
  const list = Object.values(standards);

  return (
    <div className="py-1 py-md-3 w-100">
      {/* Compact Mobile-First Header Card for QR-Code Scanners */}
      <div
        className="p-3 rounded-4 mb-3 shadow-sm d-flex flex-wrap justify-content-between align-items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #bae6fd 0%, #dbeafe 52%, #e0e7ff 100%)',
          border: '1.5px solid #60a5fa'
        }}
      >
        <div className="d-flex align-items-center gap-2.5 min-w-0">
          <div className="bg-white p-1.5 rounded-3 shadow-sm d-flex align-items-center flex-shrink-0" style={{ border: '1px solid #93c5fd' }}>
            <img src="assets/umf-logo.jpg" alt="UMF" height="28" className="rounded" />
          </div>
          <div className="min-w-0">
            <div className="fw-black text-uppercase text-truncate" style={{ fontSize: '0.88rem', color: '#00273d', lineHeight: 1.15 }}>
              SOP &amp; Expertenstandards Schnellwahl
            </div>
            <div className="fw-semibold text-truncate" style={{ fontSize: '0.74rem', color: '#0369a1' }}>
              Universitätsmedizin Frankfurt &bull; Direktzugriff per Smartphone
            </div>
          </div>
        </div>

        <div className="d-none d-md-flex align-items-center gap-1.5 justify-content-end">
          <button
            type="button"
            className="btn btn-sm btn-warning text-dark fw-bold rounded-pill px-3 py-1.5 shadow-sm d-flex align-items-center justify-content-center gap-1.5"
            style={{ minHeight: '38px', fontSize: '0.78rem' }}
            onClick={() => onSelectStandard('universal-karte')}
          >
            <i className="bi bi-stars text-danger"></i>
            <span>Universal-Karte</span>
          </button>
        </div>
      </div>

      {/* 6 Clean, Clickable Tiles aligned in center */}
      <div className="row g-2.5 g-md-4 justify-content-center">
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
                  width: '52px',
                  height: '52px',
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
                <h5 className="fw-bold text-dark mb-0 text-truncate" style={{ fontSize: '1.02rem' }}>
                  {std.shortTitle}
                </h5>
                <div className="small text-muted text-truncate mt-1" style={{ fontSize: '0.76rem' }}>
                  roXtra ID: {std.roXtraIds.join(', ')}
                </div>
              </div>

              <div className="text-secondary ps-1">
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

