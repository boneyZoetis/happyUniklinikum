/**
 * Klinische Pflegestandards & Intensivpflege - Standalone React & Bootstrap Application
 * Evidenzbasierte klinische Standards für Intensivpflege & Notfallmedizin
 */

const { useState, useEffect, useRef, useMemo } = React;

const UMF_STANDARDS = window.QRParser ? window.QRParser.UMF_STANDARDS : {};

// Reusable QR Code Generator Component - Guaranteed Single Crisp Image with inline base64
function QrCodeCanvas({ value, size = 160, color = '#0f172a', className = '', id = '', style = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && value) {
      containerRef.current.innerHTML = '';
      if (window.QRCode) {
        try {
          const tempDiv = document.createElement('div');
          const renderResolution = Math.max(size * 2, 240);
          new window.QRCode(tempDiv, {
            text: value,
            width: renderResolution,
            height: renderResolution,
            colorDark: color,
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.M
          });

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

  const containerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
    maxHeight: '100%',
    boxSizing: 'border-box',
    ...(style.width ? {} : { width: `${size}px` }),
    ...(style.height ? {} : { height: `${size}px` }),
    ...style
  };

  return (
    <div
      id={id}
      ref={containerRef}
      className={`qr-display-container ${className}`}
      style={containerStyle}
    />
  );
}

// -------------------------------------------------------------
// Component: Login Page
// -------------------------------------------------------------
function LoginPage({ onLogin, targetRoute }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const targetStandardName = useMemo(() => {
    if (!targetRoute || targetRoute === 'home') return null;
    if (targetRoute === 'beatmung') return '1. Beatmungsgerät & Gerätecheck';
    if (targetRoute === 'befeuchtung-invasiv') return '2. Aktive Befeuchtung (Invasiv)';
    if (targetRoute === 'hfnc') return '3. High-Flow-Therapie (HFNC)';
    if (targetRoute === 'arterie') return '4. Invasives Druckmesssystem (Arterie)';
    if (targetRoute === 'evd') return '5. Externe Ventrikeldrainage (EVD)';
    if (targetRoute === 'quick-hub') return 'Schnellzugriff Hub';
    if (targetRoute === 'qrcodes') return 'Alle Pocketcards';
    if (targetRoute === 'universal-karte' || targetRoute === 'magic-card') return 'U-Card';
    return targetRoute;
  }, [targetRoute]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');

    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    if (cleanUser === 'happy' && cleanPass === '2208') {
      onLogin();
    } else {
      setError('Benutzername oder Passwort ist falsch. Bitte überprüfen Sie Ihre Eingaben.');
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card">
        <div className="text-center mb-3.5">
          <div className="login-logo-circle mx-auto mb-2.5 shadow-md">
            <i className="bi bi-heart-pulse-fill" style={{ fontSize: '1.75rem', color: '#ffffff' }}></i>
          </div>

          <span className="badge rounded-pill px-3 py-1 text-uppercase fw-bold mb-2 shadow-2xs" style={{ background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.22)', fontSize: '0.72rem', letterSpacing: '0.4px' }}>
            <i className="bi bi-shield-lock-fill me-1"></i> QM-Intensivportal
          </span>

          <h2 className="login-title fw-black mb-1">
            Klinische Pflegestandards
          </h2>

          <p className="login-subtitle mb-0">
            Digitale Pocketcards &bull; Intensivpflege &amp; Leitfäden
          </p>
        </div>

        {targetStandardName && (
          <div className="alert alert-primary py-2 px-3 rounded-3 mb-3 small d-flex align-items-center gap-2 border-0 shadow-2xs" style={{ background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)', color: '#0369a1' }}>
            <i className="bi bi-box-arrow-in-right fs-5 flex-shrink-0 text-primary"></i>
            <div>
              <div className="text-secondary" style={{ fontSize: '0.72rem' }}>Direktzugriff angefordert für:</div>
              <strong className="fw-bold">{targetStandardName}</strong>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 rounded-3 mb-3 small d-flex align-items-center gap-2 border-0 shadow-2xs">
            <i className="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-2.5">
            <label className="form-label small fw-bold text-dark mb-1" htmlFor="login-username">
              Benutzername
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary">
                <i className="bi bi-person-fill"></i>
              </span>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                className="form-control border-start-0 ps-1"
                placeholder="Benutzername eingeben"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold text-dark mb-1" htmlFor="login-password">
              Passwort
            </label>
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0 text-secondary">
                <i className="bi bi-key-fill"></i>
              </span>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                className="form-control border-start-0 border-end-0 px-1"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="input-group-text bg-white border-start-0 text-secondary"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash-fill' : 'bi-eye-fill'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill py-2.5 fw-bold shadow-md d-flex align-items-center justify-content-center gap-2 text-white"
            style={{ minHeight: '44px', fontSize: '0.92rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
          >
            <span>Anmelden</span>
            <i className="bi bi-arrow-right"></i>
          </button>
        </form>

        <div className="text-center mt-3 pt-2.5 border-top border-light">
          <small className="text-muted" style={{ fontSize: '0.74rem' }}>
            Geschütztes QM-System &bull; Klinische Evidenz
          </small>
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Component: App (Root Router & Shell with Main Top Header)
// -------------------------------------------------------------
function App() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [toast, setToast] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('umf_auth_session') === 'true';
    } catch (e) {
      return false;
    }
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    try {
      localStorage.setItem('umf_auth_session', 'true');
    } catch (e) {}
    setIsAuthenticated(true);
    showToast('Erfolgreich angemeldet!');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('umf_auth_session');
    } catch (e) {}
    setIsAuthenticated(false);
    showToast('Erfolgreich abgemeldet.');
  };

  // Sync hash routing & dynamic document.title
  useEffect(() => {
    const handleHashChange = () => {
      const hash = (window.location.hash || '#/').toLowerCase();

      if (hash.includes('beatmung') || hash.includes('ventilator')) {
        setCurrentRoute('beatmung');
        document.title = 'Beatmungsgerät & Check • Intensivstandard';
      } else if (hash.includes('befeucht') || hash.includes('humid')) {
        setCurrentRoute('befeuchtung-invasiv');
        document.title = 'Aktive Atemgasbefeuchtung • Invasive Beatmung';
      } else if (hash.includes('hfnc') || hash.includes('high-flow') || hash.includes('highflow')) {
        setCurrentRoute('hfnc');
        document.title = 'High-Flow-Therapie (HFNC) • ROX-Index & Monitoring';
      } else if (hash.includes('arterie') || hash.includes('arteriell') || hash.includes('art-line') || hash.includes('druckmessung')) {
        setCurrentRoute('arterie');
        document.title = 'Invasives arterielles Druckmesssystem • Nullabgleich';
      } else if (hash.includes('evd') || hash.includes('ventrikel') || hash.includes('drainage') || hash.includes('hirndruck')) {
        setCurrentRoute('evd');
        document.title = 'Externe Ventrikeldrainage (EVD) • Nivellierung & ICP';
      } else if (hash.includes('dekubitus')) {
        setCurrentRoute('beatmung');
      } else if (hash.includes('sturz')) {
        setCurrentRoute('befeuchtung-invasiv');
      } else if (hash.includes('schmerz')) {
        setCurrentRoute('hfnc');
      } else if (hash.includes('ernaehrung')) {
        setCurrentRoute('arterie');
      } else if (hash.includes('zvk') || hash.includes('isolation')) {
        setCurrentRoute('evd');
      } else if (
        hash.includes('qrcodes') ||
        hash.includes('pocketcards') ||
        hash.includes('pocketcard') ||
        hash.includes('alle-karten') ||
        hash.includes('all-cards')
      ) {
        const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
        setCurrentRoute(isMobileScreen ? 'quick-hub' : 'home');
        document.title = 'Klinische Intensivstandards • Digitale Pflege-Pocketcards';
      } else if (hash.includes('universal') || hash.includes('magic') || hash.includes('u-card') || hash.includes('ucard')) {
        setCurrentRoute('universal-karte');
        document.title = 'U-Card • Digitale Pocketcards';
      } else if (hash.includes('hub') || hash.includes('menu') || hash.includes('quick')) {
        setCurrentRoute('quick-hub');
        document.title = 'Schnellzugriff • Intensivpflege Standards';
      } else {
        const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
        if (isMobileScreen && (!hash || hash === '' || hash === '#/' || hash === '#')) {
          setCurrentRoute('quick-hub');
          document.title = 'Schnellzugriff • Intensivpflege Standards';
        } else {
          setCurrentRoute('home');
          document.title = 'Klinische Intensivstandards • Digitale Pflege-Pocketcards';
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
    return () => {
      window.removeEventListener('resize', handleOrientation);
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, []);

  const navigateTo = (route) => {
    let target = route;
    const isMobileScreen = typeof window !== 'undefined' && window.innerWidth < 768;
    if (route === 'pocketcard' || route === 'pocketcards' || route === 'pocket-cards' || route === 'cards' || route === 'qrcodes' || route === 'alle-pocketcards') {
      target = isMobileScreen ? 'quick-hub' : 'home';
    } else if (route === 'home') {
      target = isMobileScreen ? 'quick-hub' : 'home';
    }
    setCurrentRoute(target);
    window.location.hash = target === 'home' ? '#/' : `#/${target}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isStandardRoute = ['beatmung', 'befeuchtung-invasiv', 'hfnc', 'arterie', 'evd'].includes(currentRoute);
  const isMobileIsolatedRoute = isStandardRoute || currentRoute === 'universal-karte' || currentRoute === 'magic-card';
  const shouldHideMobileHeaders = isMobileIsolatedRoute || currentRoute === 'quick-hub';

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} targetRoute={currentRoute} />
        {toast && (
          <div className="copy-feedback-toast no-print" data-html2canvas-ignore="true">
            <div className="alert alert-dark shadow-lg d-flex align-items-center gap-2 mb-0 py-2 px-3 border-0">
              <i className="bi bi-info-circle-fill text-primary fs-5"></i>
              <span>{toast}</span>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Toast Feedback */}
      {toast && (
        <div className="copy-feedback-toast no-print" data-html2canvas-ignore="true">
          <div className="alert alert-dark shadow-lg d-flex align-items-center gap-2 mb-0 py-2 px-3 border-0">
            <i className="bi bi-check-circle-fill text-success fs-5"></i>
            <span>{toast}</span>
          </div>
        </div>
      )}

      {/* =========================================================
          MAIN TOP HEADER BANNER (Vibrant, Colorful & Perfectly Fitted)
          ========================================================= */}
      <header className={`hospital-banner shadow-sm no-print ${shouldHideMobileHeaders ? 'quick-hub-mobile-hide' : ''}`}>
        <div className="container d-flex flex-wrap align-items-center justify-content-between py-2 px-2 px-sm-3 gap-2.5">
          {/* Left: Brand Emblem & Large Vibrant Headings */}
          <div className="d-flex align-items-center gap-2.5 min-w-0">
            <a
              href="#/"
              className="text-decoration-none d-flex align-items-center rounded-3 p-1.5 shadow-sm border border-white border-opacity-30 flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 50%, #6366f1 100%)',
                boxShadow: '0 4px 14px rgba(56, 189, 248, 0.45)'
              }}
              title="Zur Startseite der Klinischen Intensivstandards"
            >
              <i className="bi bi-heart-pulse-fill text-white fs-4 px-0.5"></i>
            </a>

            <div className="border-start border-2 ps-2.5 ps-sm-3" style={{ borderColor: 'rgba(56, 189, 248, 0.65)' }}>
              <div className="d-flex align-items-center gap-1.5 mb-0.5">
                <span
                  className="badge rounded-pill fw-bold text-uppercase px-2 py-0.5 shadow-2xs"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.25)',
                    color: '#e0f2fe',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.4px'
                  }}
                >
                  <i className="bi bi-shield-check text-warning me-1"></i> QM-Geprüft 2026
                </span>
                <span
                  className="badge rounded-pill fw-bold text-uppercase d-none d-sm-inline-block shadow-2xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    fontSize: '0.65rem',
                    letterSpacing: '0.3px'
                  }}
                >
                  5 Intensiv-Standards
                </span>
              </div>

              <h1
                className="fw-black text-white text-uppercase mb-0 text-truncate"
                style={{
                  fontSize: 'clamp(1.02rem, 3.2vw, 1.45rem)',
                  lineHeight: 1.2,
                  letterSpacing: '0.3px',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.35)'
                }}
              >
                Klinische Intensivstandards &amp; Leitfäden
              </h1>

              <div
                className="text-truncate d-none d-md-block"
                style={{ fontSize: '0.74rem', color: '#bae6fd', fontWeight: 500 }}
              >
                Evidenzbasierte Leitfäden &bull; Intensivpflege &bull; Patientensicherheit &bull; Gerätekontrolle
              </div>
            </div>
          </div>

          {/* Right Action Buttons: U-Card & Alle Pocketcards */}
          <div className="d-flex align-items-center gap-2 flex-shrink-0 ms-auto ms-sm-0">
            <button
              type="button"
              className={`btn-ucard-stylish btn-sm-ucard ${currentRoute === 'universal-karte' || currentRoute === 'magic-card' ? 'active-ucard' : ''}`}
              onClick={() => navigateTo('universal-karte')}
              title="Universal-Karte (U-Card) öffnen"
            >
              <span className="ucard-icon-badge">
                <i className="bi bi-credit-card-2-front-fill"></i>
              </span>
              <span>U-Card</span>
              <i className="bi bi-stars ucard-sparkle"></i>
            </button>

            {currentRoute !== 'home' && currentRoute !== 'quick-hub' && (
              <button
                type="button"
                className="btn-pocketcard-stylish"
                onClick={() => navigateTo('home')}
                title="Zur Startseite der Klinischen Intensivstandards"
              >
                <span className="pocketcard-icon-badge">
                  <i className="bi bi-collection-fill"></i>
                </span>
                <span className="d-none d-sm-inline">Alle Pocketcards</span>
                <span className="d-inline d-sm-none">Karten</span>
                <span className="pocketcard-count-badge d-none d-sm-inline">5</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sticky Category Navbar with the 5 Procedures */}
      <nav className={`navbar navbar-expand-lg navbar-custom sticky-top py-1.5 px-2 px-sm-3 no-print ${shouldHideMobileHeaders ? 'quick-hub-mobile-hide' : ''}`}>
        <div className="container-fluid px-1 px-sm-2 d-flex flex-column flex-lg-row align-items-stretch align-items-lg-center justify-content-lg-end gap-2">
          {/* Mobile Controls: Logout only (Intensivstandards button removed as requested) */}
          <div className="d-flex d-lg-none align-items-center justify-content-end w-100">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-2.5 py-0.5 d-inline-flex align-items-center gap-1 shadow-2xs"
              style={{ minHeight: '30px', fontSize: '0.74rem' }}
              onClick={handleLogout}
              title="Abmelden"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Logout</span>
            </button>
          </div>

          {/* Horizontally Scrollable Category Ribbon on Mobile, Inline Pills on Desktop (Aligned to Right Side) */}
          <div className="nav-standards-scroll w-100 w-lg-auto ms-lg-auto d-flex justify-content-start justify-content-lg-end">
            <a
              href="#/beatmung"
              className={`nav-standard-link beatmung ${currentRoute === 'beatmung' ? 'active' : ''}`}
            >
              <i className="bi bi-lungs-fill"></i>
              <span>1. Beatmung</span>
            </a>

            <a
              href="#/befeuchtung-invasiv"
              className={`nav-standard-link befeuchtung-invasiv ${currentRoute === 'befeuchtung-invasiv' ? 'active' : ''}`}
            >
              <i className="bi bi-droplet-half"></i>
              <span>2. Befeuchtung</span>
            </a>

            <a
              href="#/hfnc"
              className={`nav-standard-link hfnc ${currentRoute === 'hfnc' ? 'active' : ''}`}
            >
              <i className="bi bi-wind"></i>
              <span>3. High-Flow</span>
            </a>

            <a
              href="#/arterie"
              className={`nav-standard-link arterie ${currentRoute === 'arterie' ? 'active' : ''}`}
            >
              <i className="bi bi-activity"></i>
              <span>4. Arterie</span>
            </a>

            <a
              href="#/evd"
              className={`nav-standard-link evd ${currentRoute === 'evd' ? 'active' : ''}`}
            >
              <i className="bi bi-diagram-3-fill"></i>
              <span>5. EVD</span>
            </a>
          </div>

          {/* Desktop Controls: Logout only (Scan completely removed) */}
          <div className="d-none d-lg-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 d-inline-flex align-items-center gap-1.5 fw-semibold shadow-2xs"
              style={{ minHeight: '36px', fontSize: '0.8rem' }}
              onClick={handleLogout}
              title="Vom QM-Portal abmelden"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className={(currentRoute === 'quick-hub' || currentRoute === 'universal-karte' || currentRoute === 'magic-card') ? "container flex-grow-1 d-flex flex-column justify-content-md-center px-3 px-sm-3.5 py-2 py-md-4" : "container px-3 px-sm-3.5 py-2.5 py-md-4"}>
        {/* VIEW: The 5 Main Tiles */}
        {currentRoute === 'home' && (
          <TilesOverview
            standards={UMF_STANDARDS}
            onSelectStandard={(id) => navigateTo(id)}
          />
        )}

        {/* VIEW: Dedicated Page for Beatmungsgerät & Gerätecheck */}
        {currentRoute === 'beatmung' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.beatmung}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Aktive Atemgasbefeuchtung invasiv */}
        {currentRoute === 'befeuchtung-invasiv' && (
          <StandardDetailPage
            standard={UMF_STANDARDS['befeuchtung-invasiv']}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Nasale High-Flow-Therapie (HFNC) */}
        {currentRoute === 'hfnc' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.hfnc}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Invasives arterielles Druckmesssystem */}
        {currentRoute === 'arterie' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.arterie}
            onNavigate={(id) => navigateTo(id)}
            showToast={showToast}
          />
        )}

        {/* VIEW: Dedicated Page for Externe Ventrikeldrainage (EVD) */}
        {currentRoute === 'evd' && (
          <StandardDetailPage
            standard={UMF_STANDARDS.evd}
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

        {/* VIEW: Universal-Karte (U-Card) */}
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
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* WhatsApp-Style Translucent Floating Mobile Navigation Dock: 1. Home, 2. U-Card, 3. Logout */}
      <footer className="mobile-transparent-footer d-flex d-md-none no-print" aria-label="Mobile Navigation">
        <div className="mobile-transparent-footer-inner">
          <button
            type="button"
            className={`mobile-footer-btn home-btn ${currentRoute === 'quick-hub' || currentRoute === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo('quick-hub')}
            title="Home"
          >
            <span className="mobile-footer-btn-icon">
              <i className="bi bi-house-door-fill"></i>
            </span>
            <span className="mobile-footer-btn-text">Home</span>
          </button>

          <button
            type="button"
            className={`mobile-footer-btn universal-btn ${currentRoute === 'universal-karte' || currentRoute === 'magic-card' ? 'active' : ''}`}
            onClick={() => navigateTo('universal-karte')}
            title="Zur U-Card (Universal-Karte)"
          >
            <span className="mobile-footer-btn-icon">
              <i className="bi bi-credit-card-2-front-fill"></i>
            </span>
            <span className="mobile-footer-btn-text">U-Card</span>
          </button>

          <button
            type="button"
            className="mobile-footer-btn logout-btn"
            onClick={handleLogout}
            title="Abmelden"
          >
            <span className="mobile-footer-btn-icon">
              <i className="bi bi-box-arrow-right"></i>
            </span>
            <span className="mobile-footer-btn-text">Logout</span>
          </button>
        </div>
      </footer>

      {/* Footer: on quick-hub show ONLY the colorful accent line; on standard tiles hide full footer on mobile */}
      {currentRoute === 'quick-hub' ? (
        <div className="footer-accent-bar d-flex mt-auto" style={{ height: '6px' }}>
          <div style={{ flex: 1, backgroundColor: 'var(--beatmung-color)' }} title="Beatmungsgerät & Check"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--befeuchtung-color)' }} title="Aktive Atemgasbefeuchtung"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--hfnc-color)' }} title="High-Flow (HFNC)"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--arterie-color)' }} title="Invasives Druckmesssystem"></div>
          <div style={{ flex: 1, backgroundColor: 'var(--evd-color)' }} title="Externe Ventrikeldrainage"></div>
        </div>
      ) : (
        <footer className={`modern-footer mt-auto text-white ${isMobileIsolatedRoute ? 'd-none d-md-block' : ''}`}>
          <div className="footer-accent-bar d-flex" style={{ height: '5px' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--beatmung-color)' }} title="Beatmungsgerät & Check"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--befeuchtung-color)' }} title="Aktive Atemgasbefeuchtung"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--hfnc-color)' }} title="High-Flow (HFNC)"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--arterie-color)' }} title="Invasives Druckmesssystem"></div>
            <div style={{ flex: 1, backgroundColor: 'var(--evd-color)' }} title="Externe Ventrikeldrainage"></div>
          </div>

          <div className="container py-4 py-md-5">
            <div className="row g-4 align-items-center">
              <div className="col-lg-5 col-md-6">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="rounded-3 p-2 shadow-sm d-inline-flex text-white" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', width: '42px', height: '42px', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-heart-pulse-fill fs-5"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-0 text-white" style={{ letterSpacing: '0.5px' }}>
                      KLINISCHE PFLEGESTANDARDS
                    </h6>
                    <small className="text-white-50" style={{ fontSize: '0.78rem' }}>
                      Intensivpflege &bull; Notfallmedizin &bull; Evidenzbasiert
                    </small>
                  </div>
                </div>
                <p className="small text-white-50 mb-0" style={{ lineHeight: '1.6', maxWidth: '420px' }}>
                  Standardisierte Verfahrensanweisungen und evidenzbasierte Leitfäden für Beatmung, Befeuchtung, High-Flow, invasive Druckmessung und Ventrikeldrainage.
                </p>
              </div>

              <div className="col-lg-4 col-md-6">
                <div className="small fw-bold text-uppercase text-white-50 mb-3" style={{ letterSpacing: '0.8px', fontSize: '0.72rem' }}>
                  <i className="bi bi-compass me-1 text-info"></i> Direkte Schnellnavigation
                </div>
                <div className="d-flex flex-wrap gap-2">
                  <a href="#/beatmung" className="footer-category-pill pill-beatmung">
                    <i className="bi bi-lungs-fill"></i> Beatmung
                  </a>
                  <a href="#/befeuchtung-invasiv" className="footer-category-pill pill-befeuchtung">
                    <i className="bi bi-droplet-half"></i> Befeuchtung
                  </a>
                  <a href="#/hfnc" className="footer-category-pill pill-hfnc">
                    <i className="bi bi-wind"></i> High-Flow
                  </a>
                  <a href="#/arterie" className="footer-category-pill pill-arterie">
                    <i className="bi bi-activity"></i> Arterie
                  </a>
                  <a href="#/evd" className="footer-category-pill pill-evd">
                    <i className="bi bi-diagram-3-fill"></i> EVD
                  </a>
                  <a href="#/universal-karte" className="footer-category-pill pill-magic">
                    <i className="bi bi-credit-card-2-front-fill text-warning"></i> U-Card
                  </a>
                  <a href="#/" className="footer-category-pill pill-hub">
                    <i className="bi bi-collection"></i> Alle Pocketcards
                  </a>
                </div>
              </div>

              <div className="col-lg-3 col-md-12 text-lg-end">
                <div className="footer-status-card p-3 rounded-3 text-start text-lg-end d-inline-block w-100 w-md-auto">
                  <div className="d-flex align-items-center gap-2 justify-content-lg-end mb-1">
                    <span className="live-status-dot"></span>
                    <span className="small fw-bold text-white">QM-Intensivsystem</span>
                  </div>
                  <div className="small text-white-50" style={{ fontSize: '0.75rem' }}>
                    Gültige klinische Standards 2026
                  </div>
                  <div className="mt-2 pt-2 border-top border-secondary border-opacity-25 d-flex justify-content-between align-items-center text-white-50" style={{ fontSize: '0.72rem' }}>
                    <span>Angemeldet als <strong>happy</strong></span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="btn btn-sm btn-outline-danger py-0.5 px-2 rounded-pill fw-semibold text-white border-danger"
                      style={{ fontSize: '0.7rem' }}
                      title="Abmelden"
                    >
                      <i className="bi bi-box-arrow-right me-1"></i>Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-top border-white border-opacity-10 mt-4 pt-3 d-flex flex-wrap justify-content-between align-items-center gap-2 text-white-50 small">
              <div>
                &copy; {new Date().getFullYear()} Klinische Pflegestandards &bull; Digitale Pflege-Pocketcards
              </div>
              <div className="d-flex gap-3">
                <a href="#/" className="text-white-50 text-decoration-none hover-white">Startseite</a>
                <span>&bull;</span>
                <a href="#/" className="text-white-50 text-decoration-none hover-white">Alle Pocketcards</a>
                <span>&bull;</span>
                <span className="text-white-50">Intensivpflege Praxis</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: TILE_ENHANCEMENTS Configuration
// -------------------------------------------------------------
const TILE_ENHANCEMENTS = {
  beatmung: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #f0f9ff 45%, #e0f2fe 100%)',
    borderColor: '#bae6fd',
    leftBorderColor: '#0284c7',
    shadowColor: 'rgba(2, 132, 199, 0.16)',
    iconGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 50%, #38bdf8 100%)',
    iconShadow: 'rgba(2, 132, 199, 0.38)',
    icon: 'bi-lungs-fill',
    badgeBg: '#e0f2fe',
    badgeColor: '#0369a1',
    badgeBorder: '#bae6fd',
    badgeText: 'Intensiv-Standard ITS',
    titleColor: '#0369a1',
    title: '1. Vorbereitung & Funktionsprüfung Beatmungsgerät (ELISA 600)',
    lead: 'Fachgerechter Aufbau des Doppelschlauchsystems (ELISA 600), Dichtigkeitsprüfung (Leckage < 100 ml/min) und präklinischer Gerätecheck vor Patientenkontakt.',
    image: 'assets/card-beatmung.jpg',
    imageOverlay: 'ELISA 600 & Gerätecheck',
    quickBadges: [
      { text: 'ELISA 600 SOP', icon: 'bi-shield-check', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Schulungsvideo', icon: 'bi-youtube', bg: '#fee2e2', color: '#dc2626', border: '#fca5a5' },
      { text: 'ZGV 3.0–4.5 bar', icon: 'bi-gauge', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    imageSubtitle: 'Aufbau Doppelschlauchsystem ELISA 600, Pre-Use Check & Notfallbereitschaft',
    goals: [
      { text: '🟢 Sicherheit', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: '🔴 Dichtigkeit', icon: 'bi-x-octagon-fill text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: '🔵 Compliance', icon: 'bi-activity text-primary', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: '🟠 Notfall bereit', icon: 'bi-bag-plus-fill text-warning', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' }
    ],
    actionSteps: [
      { text: 'Technische Defekte und Fehlfunktionen durch den Gerätecheck frühzeitig erkennen.', bold: '🟢 Patientensicherheit erhöhen:', icon: 'bi-shield-check', iconBg: '#16a34a' },
      { text: 'Dichtigkeit prüfen, um eine zuverlässige Druck- und Volumenapplikation zu unterstützen.', bold: '🔴 Leckagen & Druckverluste:', icon: 'bi-x-octagon-fill', iconBg: '#dc2626' },
      { text: 'Kompressionsverluste erfassen und geräteabhängig kompensieren (Beatmungsgenauigkeit).', bold: '🔵 Schlauch-Compliance & Widerstand:', icon: 'bi-activity', iconBg: '#0284c7' },
      { text: 'Beatmungsbeutel, Sauerstoffversorgung und funktionsfähige Absaugung bereithalten.', bold: '🟠 Notfallbereitschaft sicherstellen:', icon: 'bi-bag-plus-fill', iconBg: '#ea580c' }
    ],
    tagLabel: 'Patientensicherheit:',
    tagIcon: 'bi-shield-check',
    tagColor: '#0284c7',
    tagBorder: '#38bdf8',
    tags: ['Schulungsvideo', 'Patientensicherheit', 'Leckagetest', 'Schlauch-Compliance', 'Gerätecheck'],
    btnGradient: 'linear-gradient(90deg, #0369a1 0%, #0284c7 100%)',
    btnShadow: 'rgba(2, 132, 199, 0.28)'
  },
  'befeuchtung-invasiv': {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #f0fdf4 45%, #dcfce7 100%)',
    borderColor: '#bbf7d0',
    leftBorderColor: '#16a34a',
    shadowColor: 'rgba(22, 163, 74, 0.16)',
    iconGradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 50%, #4ade80 100%)',
    iconShadow: 'rgba(22, 163, 74, 0.38)',
    icon: 'bi-droplet-half',
    badgeBg: '#dcfce7',
    badgeColor: '#15803d',
    badgeBorder: '#bbf7d0',
    badgeText: 'Intensiv-Standard ITS',
    titleColor: '#15803d',
    title: '2. Aktive Atemgasbefeuchtung bei invasiver Beatmung',
    lead: 'Physiologische Konditionierung des Atemgases (37°C, 44 mg/L H₂O), Schutz des Flimmerepithels und gezielte Vermeidung von gefährlichem Schlauchkondensat.',
    image: 'assets/card-befeuchtung.jpg',
    imageOverlay: '37°C / 44 mg/L H2O',
    quickBadges: [
      { text: '37°C am Y-Stück', icon: 'bi-thermometer-high', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
      { text: '100% r.F. (44 mg/L)', icon: 'bi-droplet-fill', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    imageSubtitle: 'MR850/Aircon Befeuchterkammer unter Patientenniveau & beheizter Schlauch',
    goals: [
      { text: 'Flimmerepithel schützen', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: 'Tubusokklusion verhindern', icon: 'bi-slash-circle-fill text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Rainout vermeiden', icon: 'bi-droplet-half text-info', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    actionSteps: [
      { text: 'Befeuchterkammer unter Patientenniveau platzieren & mit Aqua dest. befüllen', bold: 'Kammer unter Patient:', icon: 'bi-droplet-half', iconBg: '#16a34a' },
      { text: 'Temperaturfühler an Kammer & Y-Stück korrekt und geschützt positionieren', bold: 'Temperatursensoren:', icon: 'bi-thermometer-sun', iconBg: '#0284c7' },
      { text: 'Inspirationsschenkel um +2°C überwärmen zur Vermeidung von Schlauchkondensat', bold: 'Kondensat-Schutz:', icon: 'bi-shield-shaded', iconBg: '#059669' }
    ],
    tagLabel: 'Kernschritte:',
    tagIcon: 'bi-thermometer-half',
    tagColor: '#16a34a',
    tagBorder: '#4ade80',
    tags: ['Schulungsvideo', 'AIRcon Gen2', 'Aqua dest.', 'Kammer unter Patient', 'Heizdrähte +2°C', '44 mg/L Feuchte'],
    btnGradient: 'linear-gradient(90deg, #15803d 0%, #16a34a 100%)',
    btnShadow: 'rgba(22, 163, 74, 0.28)'
  },
  hfnc: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #fff7ed 45%, #ffedd5 100%)',
    borderColor: '#fed7aa',
    leftBorderColor: '#ea580c',
    shadowColor: 'rgba(234, 88, 12, 0.16)',
    iconGradient: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #fb923c 100%)',
    iconShadow: 'rgba(234, 88, 12, 0.38)',
    icon: 'bi-wind',
    badgeBg: '#ffedd5',
    badgeColor: '#c2410c',
    badgeBorder: '#fed7aa',
    badgeText: 'Intensiv-Therapie',
    titleColor: '#c2410c',
    title: '3. Aktive Befeuchtung bei High-Flow-Therapie (HFNC)',
    lead: 'Hohe Flussraten (20–60 L/min) zur Auswaschung des Totraums und PEEP-Generierung. Kontinuierliche Risikoüberwachung mit dem ROX-Index.',
    image: 'assets/card-hfnc.jpg',
    imageOverlay: 'ROX-Index & 20–60 L/min',
    quickBadges: [
      { text: 'Flow 20–60 L/min', icon: 'bi-wind', bg: '#ffedd5', color: '#c2410c', border: '#fed7aa' },
      { text: 'ROX-Score ≥ 4.88', icon: 'bi-calculator-fill', bg: '#fef3c7', color: '#92400e', border: '#fde68a' }
    ],
    imageSubtitle: 'Auswahl passender Nasenprongs (< 50% der Naris) & kontinuierliches ROX-Monitoring',
    goals: [
      { text: 'Totraum auswaschen', icon: 'bi-wind text-warning', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
      { text: 'PEEP aufbauen', icon: 'bi-arrow-up-circle-fill text-primary', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: 'Intubation abwenden', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
    ],
    actionSteps: [
      { text: 'High-Flow-System mit passender Befeuchtereinstellung und Flow vorkonditionieren', bold: 'Systemaufbau & Flow:', icon: 'bi-wind', iconBg: '#ea580c' },
      { text: 'Nasenbrillengröße wählen: Maximal 50% der Nasenlöcher ausfüllen (Barotraumagefahr)', bold: 'Prong-Auswahl < 50%:', icon: 'bi-person-fill', iconBg: '#0284c7' },
      { text: 'ROX-Index nach 2h, 6h, 12h berechnen: Bei Score < 3.85 Intubationsbereitschaft', bold: 'ROX-Monitoring:', icon: 'bi-calculator-fill', iconBg: '#c2410c' }
    ],
    tagLabel: 'Kernschritte:',
    tagIcon: 'bi-calculator',
    tagColor: '#ea580c',
    tagBorder: '#fb923c',
    tags: ['Schulungsvideo', 'High-Flow', 'ROX-Index', 'Totraum-Washout', 'FiO2 21-100%', 'Nasenbrille < 50%'],
    btnGradient: 'linear-gradient(90deg, #c2410c 0%, #ea580c 100%)',
    btnShadow: 'rgba(234, 88, 12, 0.28)'
  },
  arterie: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #fff1f2 45%, #fee2e2 100%)',
    borderColor: '#fecdd3',
    leftBorderColor: '#dc2626',
    shadowColor: 'rgba(220, 38, 38, 0.16)',
    iconGradient: 'linear-gradient(135deg, #991b1b 0%, #dc2626 50%, #f87171 100%)',
    iconShadow: 'rgba(220, 38, 38, 0.38)',
    icon: 'bi-activity',
    badgeBg: '#fee2e2',
    badgeColor: '#991b1b',
    badgeBorder: '#fecdd3',
    badgeText: 'Hämodynamik & Anästhesie',
    titleColor: '#991b1b',
    title: '4. SOP Invasives Druckmesssystem (Combitrans®)',
    lead: 'Combitrans® (B. Braun) Gold-Standard: 15-Schritte-Befüllung (50 -> 300 mmHg), Reservoir-Entlüftung im Uhrzeigersinn, phlebostatischer Nullabgleich & Cave: Fingerischämie.',
    image: 'assets/card-arterie.jpg',
    imageOverlay: 'Combitrans® & 15-Schritte SOP',
    quickBadges: [
      { text: 'Combitrans® B. Braun', icon: 'bi-shield-check', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Initial max. 50 mmHg', icon: 'bi-speedometer', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' }
    ],
    imageSubtitle: '15-Schritte-Befüllung • Reservoir im Uhrzeigersinn entlüften • Cave: Fingerischämie',
    goals: [
      { text: '🟢 MAP & Druck', icon: 'bi-activity text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
      { text: '🔴 Hydrost. Höhe', icon: 'bi-arrow-down-up text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: '🔵 Fast-Flush', icon: 'bi-speedometer2 text-primary', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
      { text: '🟠 Luer-Lock dicht', icon: 'bi-wrench-adjustable text-warning', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' }
    ],
    actionSteps: [
      { text: 'Kontinuierliche Erfassung von systolischem, diastolischem und mittlerem arteriellem Druck (MAP).', bold: '🟢 Präzise Hämodynamik:', icon: 'bi-activity', iconBg: '#16a34a' },
      { text: 'Druckaufnehmer exakt nivellieren (bereits 1 cm Höhenabweichung verursacht ca. 0,74 mmHg Fehler).', bold: '🔴 Hydrostatische Fehler:', icon: 'bi-arrow-down-up', iconBg: '#dc2626' },
      { text: 'Kurvenqualität beurteilen und mittels Fast-Flush-Test dynamische Antwort des Systems sichern.', bold: '🔵 Dämpfung & Fast-Flush:', icon: 'bi-speedometer2', iconBg: '#0284c7' },
      { text: 'Luer-Lock-Verbindungen sichern, Anschlüsse regelmäßig prüfen & Punktionsstelle überwachen.', bold: '🟠 Blutungskomplikationen:', icon: 'bi-shield-check', iconBg: '#ea580c' }
    ],
    tagLabel: 'SOP-Kriterien:',
    tagIcon: 'bi-crosshair',
    tagColor: '#dc2626',
    tagBorder: '#f87171',
    tags: ['Schulungsvideo', 'Combitrans® B. Braun', '15-Schritte SOP', 'Initial max. 50 mmHg', 'Reservoir im Uhrzeigersinn', 'Enddruck 300 mmHg', 'Cave: Fingerischämie', 'Phlebostatischer Punkt'],
    btnGradient: 'linear-gradient(90deg, #b91c1c 0%, #dc2626 100%)',
    btnShadow: 'rgba(220, 38, 38, 0.28)'
  },
  evd: {
    bgGradient: 'linear-gradient(155deg, #ffffff 0%, #faf5ff 45%, #f3e8ff 100%)',
    borderColor: '#e9d5ff',
    leftBorderColor: '#7c3aed',
    shadowColor: 'rgba(124, 58, 237, 0.16)',
    iconGradient: 'linear-gradient(135deg, #581c87 0%, #7c3aed 50%, #c084fc 100%)',
    iconShadow: 'rgba(124, 58, 237, 0.38)',
    icon: 'bi-diagram-3-fill',
    badgeBg: '#f3e8ff',
    badgeColor: '#581c87',
    badgeBorder: '#e9d5ff',
    badgeText: 'Neurochirurgie & ITS',
    titleColor: '#581c87',
    title: '5. SOP Externe Ventrikeldrainage (EVD)',
    lead: 'SOP VentrEX®: Kontinuierliches ICP-Monitoring bei regulär GESCHLOSSENER Drainage. Exakte Tragus-Nivellierung (Foramen Monroi) & intermittierendes Ablassen (max. 5–10 ml).',
    image: 'assets/card-evd.jpg',
    imageOverlay: 'VentrEX® & Tragus-Nivellierung',
    quickBadges: [
      { text: 'Tragus = Foramen Monroi', icon: 'bi-crosshair2', bg: '#f3e8ff', color: '#581c87', border: '#e9d5ff' },
      { text: 'Drainage regulär GESCHLOSSEN', icon: 'bi-lock-fill', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' }
    ],
    imageSubtitle: 'Gelber Hahn (2) auf Tragus-Höhe • Nullen ohne Diskonnektion • Nur Arzt spült zum Kopf',
    goals: [
      { text: 'Fehlerfreie ICP-Messung', icon: 'bi-activity text-primary', bg: '#f3e8ff', color: '#581c87', border: '#e9d5ff' },
      { text: 'Überdrainage verhindern', icon: 'bi-shield-slash-fill text-danger', bg: '#fee2e2', color: '#991b1b', border: '#fecdd3' },
      { text: 'Ventrikulitisschutz', icon: 'bi-shield-check text-success', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' }
    ],
    actionSteps: [
      { text: 'Gelben Monitoring-Hahn (2) mit Laserpointer exakt auf den Tragus (äußerer Gehörgang) ausrichten – bei jeder Lagerung re-nivellieren!', bold: 'Laser-Nivellierung Tragus:', icon: 'bi-crosshair2', iconBg: '#7c3aed' },
      { text: 'Drainage ist regulär GESCHLOSSEN (Hahn 3)! Öffnen nur gezielt bei ICP-Überschreitung für max. 5–10 ml (bei offener EVD keine ICP-Messung!).', bold: 'Regulär GESCHLOSSEN:', icon: 'bi-lock-fill', iconBg: '#dc2626' },
      { text: 'Nullen ohne Diskonnektion über 0-cm-Skala; Spülen zum Kopf & Aspiration ist STRENG NUR ARZT gestattet!', bold: 'Nullen & Arzt-Kompetenz:', icon: 'bi-shield-exclamation', iconBg: '#0284c7' }
    ],
    tagLabel: 'SOP-Kriterien:',
    tagIcon: 'bi-exclamation-octagon',
    tagColor: '#7c3aed',
    tagBorder: '#c084fc',
    tags: ['Schulungsvideo', 'VentrEX® System', 'Tragus = Foramen Monroi', 'Drainage regulär ZU', 'Max. 5–10 ml Ablass', 'Sediert: 15/20 mmHg', 'Wach: 20/25 mmHg', 'Spülen z. Kopf: NUR ARZT'],
    btnGradient: 'linear-gradient(90deg, #6d28d9 0%, #7c3aed 100%)',
    btnShadow: 'rgba(124, 58, 237, 0.28)'
  }
};

// -------------------------------------------------------------
// Component: TilesOverview (Grid of the 5 Standards with Hero Header)
// -------------------------------------------------------------
function TilesOverview({ standards, onSelectStandard }) {
  const list = Object.values(standards);

  return (
    <div>
      {/* Modern Colorful Clinical Hero Header Banner */}
      <div
        className="rounded-4 p-3.5 p-md-4 mb-4 shadow-lg position-relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(135deg, #001a2e 0%, #003354 36%, #0369a1 72%, #0284c7 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.45)',
          boxShadow: '0 8px 28px rgba(0, 39, 61, 0.22)'
        }}
      >
        <div
          style={{
            height: '4px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(90deg, #0284c7 0%, #0891b2 25%, #16a34a 50%, #dc2626 75%, #7c3aed 100%)'
          }}
        />

        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 position-relative" style={{ zIndex: 1 }}>
          <div className="d-flex align-items-center gap-3 min-w-0">
            <div
              className="rounded-3 shadow-md d-flex align-items-center justify-content-center flex-shrink-0 text-white"
              style={{
                width: 'clamp(46px, 10vw, 54px)',
                height: 'clamp(46px, 10vw, 54px)',
                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                border: '2px solid rgba(255, 255, 255, 0.45)'
              }}
            >
              <i className="bi bi-hospital fs-3"></i>
            </div>
            <div>
              <div className="d-flex flex-wrap align-items-center gap-1.5 mb-1">
                <span
                  className="badge rounded-pill fw-bold text-uppercase shadow-2xs"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(6px)',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.35)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.4px',
                    padding: '3px 8px'
                  }}
                >
                  <i className="bi bi-shield-check text-warning me-1"></i> QM-Intensivstandards 2026
                </span>
                <span
                  className="badge rounded-pill fw-bold text-uppercase shadow-2xs"
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.25)',
                    color: '#e0f2fe',
                    border: '1px solid rgba(56, 189, 248, 0.45)',
                    fontSize: '0.68rem',
                    letterSpacing: '0.4px',
                    padding: '3px 8px'
                  }}
                >
                  5 Intensiv-Standards
                </span>
              </div>
              <h2
                className="fw-black text-white mb-0 text-truncate"
                style={{ fontSize: 'clamp(1.15rem, 3.8vw, 1.6rem)', letterSpacing: '0.2px' }}
              >
                Klinische Intensivpflege &amp; Gerätestandards
              </h2>
              <div className="text-white-50 small mt-0.5" style={{ fontSize: '0.82rem' }}>
                Evidenzbasierte Leitfäden &bull; Interaktive Kurvensimulatoren &bull; Schicht-Checklisten
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of the 5 Standard Cards */}
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
                <div className="p-3 ps-3.5 ps-sm-4 p-sm-4 d-flex flex-column h-100">
                  {/* Header: Gradient Icon & Category Badge */}
                  <div className="d-flex flex-wrap justify-content-between align-items-center mb-2.5 gap-2 ps-1 ps-sm-0">
                    <div className="d-flex align-items-center gap-2.5 min-w-0">
                      <div
                        className="rounded-4 d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0 ms-1 ms-sm-0"
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
                  </div>

                  {/* Title */}
                  <h4 className="fw-bold mb-1.5 ps-1 ps-sm-0" style={{ lineHeight: '1.3', fontSize: '1.14rem', color: enh.titleColor }}>
                    {enh.title}
                  </h4>

                  {/* Subtitle / Lead text */}
                  <p className="text-secondary small mb-2.5 ps-1 ps-sm-0" style={{ lineHeight: '1.45', fontSize: '0.84rem' }}>
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
                              className="badge px-2 py-1 rounded-pill fw-semibold d-inline-flex align-items-center gap-1"
                              style={{
                                backgroundColor: qb.bg,
                                color: qb.color,
                                border: `1px solid ${qb.border}`,
                                fontSize: '0.72rem'
                              }}
                            >
                              <i className={`bi ${qb.icon}`}></i>
                              <span>{qb.text}</span>
                            </span>
                          ))}
                        </div>
                        <div className="text-secondary small" style={{ fontSize: '0.75rem', lineHeight: '1.3' }}>
                          {enh.imageSubtitle}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Goals */}
                  <div className="row g-1.5 mb-2.5">
                    {enh.goals.map((goal, gi) => (
                      <div key={gi} className={enh.goals.length === 4 ? "col-3" : "col-4"}>
                        <div
                          className="text-center p-1.5 rounded-3 border h-100 d-flex flex-column align-items-center justify-content-center"
                          style={{
                            backgroundColor: goal.bg,
                            borderColor: goal.border,
                            color: goal.color
                          }}
                        >
                          <i className={`bi ${goal.icon} mb-1`} style={{ fontSize: '1.05rem' }}></i>
                          <span className="fw-semibold text-truncate w-100" style={{ fontSize: '0.7rem' }}>
                            {goal.text}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Action Steps */}
                  <div className="d-flex flex-column gap-1.5 mb-3 flex-grow-1">
                    {enh.actionSteps.map((step, si) => (
                      <div
                        key={si}
                        className="d-flex align-items-start gap-2 p-2 rounded-2 bg-white border small shadow-2xs"
                        style={{ fontSize: '0.82rem', lineHeight: '1.35', borderColor: enh.borderColor }}
                      >
                        <span
                          className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0 mt-0.5"
                          style={{ width: '20px', height: '20px', backgroundColor: step.iconBg, fontSize: '0.7rem' }}
                        >
                          <i className={`bi ${step.icon}`}></i>
                        </span>
                        <div>
                          <strong className="text-dark me-1">{step.bold}</strong>
                          <span className="text-secondary">{step.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Strip: Tags & Open Button */}
                  <div className="pt-2 border-top d-flex flex-wrap justify-content-between align-items-center gap-2 mt-auto ps-1 ps-sm-0" style={{ borderColor: enh.borderColor }}>
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      <span className="small fw-bold text-secondary me-1" style={{ fontSize: '0.74rem' }}>
                        <i className={`bi ${enh.tagIcon} me-1`} style={{ color: enh.tagColor }}></i>
                        {enh.tagLabel}
                      </span>
                      {enh.tags.map((t, ti) => (
                        <span
                          key={ti}
                          className="badge bg-white text-secondary rounded-pill border px-2 py-0.5"
                          style={{ fontSize: '0.68rem', borderColor: enh.tagBorder }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="btn-kachel-open ms-auto"
                      style={{
                        backgroundColor: '#ffffff',
                        color: enh.tagColor,
                        borderColor: enh.tagBorder,
                        boxShadow: `0 2px 10px ${enh.btnShadow}`
                      }}
                      title={`${std.title} öffnen`}
                    >
                      <span className="fw-bold">Details &amp; Kurven</span>
                      <span
                        className="kachel-arrow-badge"
                        style={{
                          backgroundColor: enh.tagColor,
                          color: '#ffffff'
                        }}
                      >
                        <i className="bi bi-arrow-right"></i>
                      </span>
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
// Component: Shift Safety Checklist (Interactive & Highly Visible)
// -------------------------------------------------------------
function ShiftChecklistSection({ checklist, standardTitle, accentColor, standardId = '' }) {
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    try {
      const storageKey = `shift_chk_${standardId || standardTitle}`;
      const saved = sessionStorage.getItem(storageKey);
      if (saved) {
        setCheckedItems(JSON.parse(saved));
      } else {
        setCheckedItems({});
      }
    } catch (e) {
      setCheckedItems({});
    }
  }, [standardId, standardTitle]);

  const toggleCheck = (idx) => {
    setCheckedItems(prev => {
      const updated = {
        ...prev,
        [idx]: !prev[idx]
      };
      try {
        const storageKey = `shift_chk_${standardId || standardTitle}`;
        sessionStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const checkAll = () => {
    const all = {};
    if (checklist) {
      checklist.forEach((_, i) => { all[i] = true; });
    }
    setCheckedItems(all);
    try {
      const storageKey = `shift_chk_${standardId || standardTitle}`;
      sessionStorage.setItem(storageKey, JSON.stringify(all));
    } catch (e) {}
  };

  const resetChecklist = () => {
    setCheckedItems({});
    try {
      const storageKey = `shift_chk_${standardId || standardTitle}`;
      sessionStorage.removeItem(storageKey);
    } catch (e) {}
  };

  const total = checklist ? checklist.length : 0;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  if (!checklist || checklist.length === 0) return null;

  return (
    <div className="card border shadow-sm rounded-4 p-3.5 p-md-4 bg-white mb-4" id="section-shift-checklist" style={{ borderColor: `${accentColor}35` }}>
      {/* Header Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div className="d-flex align-items-center gap-2.5">
          <div
            className="rounded-3 p-1.5 d-flex align-items-center justify-content-center text-white flex-shrink-0"
            style={{ width: '36px', height: '36px', backgroundColor: accentColor, boxShadow: `0 2px 8px ${accentColor}45` }}
          >
            <i className="bi bi-clipboard2-check-fill fs-5"></i>
          </div>
          <div>
            <span
              className="badge rounded-pill fw-bold text-uppercase px-2.5 py-0.5 mb-0.5 d-inline-flex align-items-center gap-1 shadow-2xs"
              style={{ backgroundColor: `${accentColor}18`, color: accentColor, border: `1px solid ${accentColor}35`, fontSize: '0.68rem' }}
            >
              <i className="bi bi-shield-check text-success"></i>
              <span>Schicht-Qualitätssicherung ITS</span>
            </span>
            <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
              Schicht-Sicherheits-Checkliste: {standardTitle}
            </h5>
          </div>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-2">
          <span
            className="badge px-3 py-1.5 rounded-pill fw-bold shadow-2xs d-inline-flex align-items-center gap-1.5"
            style={{
              backgroundColor: percent === 100 ? '#dcfce7' : '#f0f9ff',
              color: percent === 100 ? '#15803d' : '#0369a1',
              border: `1.5px solid ${percent === 100 ? '#86efac' : '#bae6fd'}`,
              fontSize: '0.8rem'
            }}
          >
            <i className={`bi ${percent === 100 ? 'bi-check-circle-fill text-success' : 'bi-hourglass-split text-primary'}`}></i>
            <span>{completed} von {total} erledigt ({percent}%)</span>
          </span>

          <button
            type="button"
            className="btn btn-sm btn-outline-success rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1 shadow-2xs"
            style={{ fontSize: '0.75rem', minHeight: '32px' }}
            onClick={checkAll}
            title="Alle Punkte auf einmal als erledigt markieren"
          >
            <i className="bi bi-check2-all"></i>
            <span>Alles abhaken</span>
          </button>

          {completed > 0 && (
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-2.5 py-1 fw-semibold d-inline-flex align-items-center gap-1 shadow-2xs"
              style={{ fontSize: '0.75rem', minHeight: '32px' }}
              onClick={resetChecklist}
              title="Alle Haken zurücksetzen"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
              <span>Zurücksetzen</span>
            </button>
          )}
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="progress mb-3 shadow-2xs" style={{ height: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{
            width: `${percent}%`,
            backgroundColor: percent === 100 ? '#16a34a' : accentColor,
            transition: 'width 0.35s ease'
          }}
          aria-valuenow={percent}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>

      {/* 100% Completion Celebration Banner */}
      {percent === 100 && (
        <div
          className="alert alert-success border-success rounded-3 p-2.5 mb-3 d-flex flex-wrap align-items-center justify-content-between gap-2 shadow-sm"
          style={{ backgroundColor: '#f0fdf4' }}
        >
          <div className="d-flex align-items-center gap-2">
            <i className="bi bi-patch-check-fill fs-4 text-success flex-shrink-0"></i>
            <div>
              <strong className="d-block text-dark small" style={{ fontSize: '0.85rem' }}>
                Vollständige Schichtprüfung abgeschlossen!
              </strong>
              <span className="text-secondary small" style={{ fontSize: '0.76rem' }}>
                Alle {total} Sicherheitskriterien für {standardTitle} wurden ordnungsgemäß verifiziert.
              </span>
            </div>
          </div>
          <span className="badge bg-success text-white px-3 py-1.5 rounded-pill fw-bold shadow-2xs" style={{ fontSize: '0.74rem' }}>
            <i className="bi bi-shield-fill-check me-1"></i>QM-Freigegeben
          </span>
        </div>
      )}

      {/* Checklist Items List */}
      <div className="d-flex flex-column gap-2">
        {checklist.map((item, idx) => {
          const isDone = !!checkedItems[idx];

          const rawText = typeof item === 'string' ? item : (item.text || '');
          let cat = typeof item === 'object' && item.cat ? item.cat : 'ITS-Sicherheit';
          let mainText = rawText;
          let isCritical = typeof item === 'object' ? !!item.critical : false;

          // Parse "Kategorie: Text" if string contains a colon
          if (typeof item === 'string' && item.includes(':')) {
            const colonIdx = item.indexOf(':');
            cat = item.substring(0, colonIdx).trim();
            mainText = item.substring(colonIdx + 1).trim();
          }

          // Safety trigger words
          const lower = rawText.toLowerCase();
          if (
            lower.includes('dichtig') ||
            lower.includes('pass') ||
            lower.includes('kritisch') ||
            lower.includes('alarm') ||
            lower.includes('abklemmen') ||
            lower.includes('notfall') ||
            lower.includes('300 mmhg') ||
            lower.includes('37 °c') ||
            lower.includes('monroi')
          ) {
            isCritical = true;
          }

          const getCategoryStyle = (catName, done) => {
            if (done) return { color: '#166534', bg: '#dcfce7', border: '#86efac', icon: 'bi-check-circle-fill' };
            const l = (catName || '').toLowerCase();
            if (l.includes('gerät') || l.includes('check') || l.includes('strom') || l.includes('test') || l.includes('kalibrier'))
              return { color: '#0284c7', bg: '#e0f2fe', border: '#bae6fd', icon: 'bi-gear-wide-connected' };
            if (l.includes('beatmung') || l.includes('atem') || l.includes('ox') || l.includes('peep') || l.includes('flow') || l.includes('tubus') || l.includes('trach'))
              return { color: '#0891b2', bg: '#cffafe', border: '#a5f3fc', icon: 'bi-lungs-fill' };
            if (l.includes('druck') || l.includes('arterie') || l.includes('kreislauf') || l.includes('mad') || l.includes('puls'))
              return { color: '#dc2626', bg: '#fee2e2', border: '#fecaca', icon: 'bi-activity' };
            if (l.includes('evd') || l.includes('neuro') || l.includes('icp') || l.includes('hirn') || l.includes('drainage') || l.includes('tragus'))
              return { color: '#7c3aed', bg: '#f3e8ff', border: '#ddd6fe', icon: 'bi-diagram-3-fill' };
            if (l.includes('alarm') || l.includes('grenze') || l.includes('notfall') || l.includes('kritisch') || l.includes('klemmen') || l.includes('beutel'))
              return { color: '#ea580c', bg: '#ffedd5', border: '#fed7aa', icon: 'bi-bell-fill' };
            if (l.includes('hygiene') || l.includes('steril') || l.includes('infektion') || l.includes('wasser') || l.includes('wechsel'))
              return { color: '#16a34a', bg: '#dcfce7', border: '#bbf7d0', icon: 'bi-droplet-half' };
            return { color: '#6366f1', bg: '#e0e7ff', border: '#c7d2fe', icon: 'bi-shield-check' };
          };
          const catStyle = getCategoryStyle(cat, isDone);

          return (
            <div
              key={idx}
              className={`p-2.5 p-sm-3 rounded-3 border d-flex align-items-start gap-2.5 gap-sm-3 transition-all ${
                isDone ? 'bg-success bg-opacity-10 border-success shadow-none' : 'bg-white shadow-2xs'
              }`}
              style={{
                cursor: 'pointer',
                borderLeft: isDone ? '5px solid #16a34a' : (isCritical ? '5px solid #dc2626' : `5px solid ${catStyle.color}`),
                transition: 'all 0.18s ease'
              }}
              onClick={() => toggleCheck(idx)}
              title="Klicken zum Abhaken / Abwählen"
            >
              {/* Custom Interactive High-Contrast Checkbox */}
              <div
                className={`rounded-2 d-flex align-items-center justify-content-center flex-shrink-0 mt-0.5 border ${
                  isDone
                    ? 'bg-success text-white border-success shadow-xs'
                    : 'bg-white border-secondary border-opacity-50'
                }`}
                style={{
                  width: '24px',
                  height: '24px',
                  fontSize: '0.95rem',
                  transition: 'all 0.15s ease'
                }}
              >
                {isDone && <i className="bi bi-check-lg fw-bold"></i>}
              </div>

              {/* Text and Badges */}
              <div className="flex-grow-1 min-w-0">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-1.5 mb-1">
                  <span
                    className="badge rounded-pill fw-bold text-uppercase shadow-2xs d-inline-flex align-items-center gap-1"
                    style={{
                      backgroundColor: catStyle.bg,
                      color: catStyle.color,
                      border: `1px solid ${catStyle.border}`,
                      fontSize: '0.68rem',
                      letterSpacing: '0.3px',
                      padding: '3px 8px'
                    }}
                  >
                    <i className={`bi ${catStyle.icon}`} style={{ fontSize: '0.65rem' }}></i>
                    {cat}
                  </span>

                  <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    {isCritical && !isDone && (
                      <span className="badge bg-danger text-white rounded-pill px-2 py-0.5 fw-bold shadow-2xs" style={{ fontSize: '0.64rem' }}>
                        <i className="bi bi-shield-exclamation me-1"></i>SICHERHEIT
                      </span>
                    )}
                    {isDone && (
                      <span className="badge bg-success text-white rounded-pill px-2 py-0.5 fw-bold shadow-2xs" style={{ fontSize: '0.64rem' }}>
                        <i className="bi bi-check2 me-1"></i>Erledigt
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`small ${isDone ? 'text-decoration-line-through text-muted' : 'text-dark fw-semibold'}`}
                  style={{ fontSize: '0.86rem', lineHeight: '1.42' }}
                >
                  {mainText}
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
// Component: Clinical Parameters Reference Table (Removed as Requested)
// -------------------------------------------------------------
function ClinicalParametersTable({ parameters, accentColor, standard }) {
  return null;
}

// -------------------------------------------------------------
// Component: Troubleshooting & Alarm Guide Section
// -------------------------------------------------------------
function TroubleshootingSection({ troubleshooting, accentColor }) {
  if (!troubleshooting || troubleshooting.length === 0) return null;

  const getTroubleStyle = (problem, idx) => {
    const l = (problem || '').toLowerCase();
    if (l.includes('diskonnektion') || l.includes('leckage') || l.includes('abfall') || l.includes('apnoe') || l.includes('stillstand'))
      return { icon: 'bi-exclamation-octagon-fill', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' };
    if (l.includes('druck') || l.includes('pmax') || l.includes('obstruktion') || l.includes('überdämpft'))
      return { icon: 'bi-exclamation-triangle-fill', color: '#ea580c', bg: '#fff7ed', border: '#fdba74' };
    if (l.includes('unterdämpft') || l.includes('kondensat') || l.includes('temp') || l.includes('kälte') || l.includes('hitze'))
      return { icon: 'bi-thermometer-high', color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
    if (l.includes('null') || l.includes('abgleich') || l.includes('kalibrier') || l.includes('fehler'))
      return { icon: 'bi-sliders', color: '#7c3aed', bg: '#faf5ff', border: '#d8b4fe' };
    const palette = [
      { icon: 'bi-bell-fill', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
      { icon: 'bi-exclamation-triangle-fill', color: '#ea580c', bg: '#fff7ed', border: '#fdba74' },
      { icon: 'bi-shield-exclamation', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
      { icon: 'bi-gear-wide-connected', color: '#7c3aed', bg: '#faf5ff', border: '#d8b4fe' }
    ];
    return palette[idx % palette.length];
  };

  return (
    <div className="card border shadow-sm rounded-4 p-3.5 p-md-4 bg-white mb-4" style={{ borderColor: '#fca5a5' }}>
      <div className="d-flex align-items-center gap-2.5 mb-3 pb-2 border-bottom">
        <div
          className="rounded-3 p-1.5 d-flex align-items-center justify-content-center text-white flex-shrink-0"
          style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', boxShadow: '0 2px 8px rgba(239, 68, 68, 0.45)' }}
        >
          <i className="bi bi-exclamation-octagon-fill fs-5"></i>
        </div>
        <div>
          <span className="badge rounded-pill fw-bold text-uppercase px-2.5 py-0.5 mb-0.5 d-inline-block shadow-2xs" style={{ backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.68rem', border: '1px solid #fca5a5' }}>
            Notfall &amp; Störungsbehebung
          </span>
          <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
            Alarm-Leitfaden &amp; Störungsbehebung (Troubleshooting)
          </h5>
        </div>
      </div>

      <div className="row g-2.5">
        {troubleshooting.map((t, idx) => {
          const tStyle = getTroubleStyle(t.problem, idx);
          return (
            <div key={idx} className="col-12 col-md-6">
              <div
                className="p-3 rounded-3 border h-100 shadow-2xs"
                style={{
                  borderLeft: `5px solid ${tStyle.color}`,
                  background: `linear-gradient(135deg, #ffffff 0%, ${tStyle.bg} 100%)`,
                  borderColor: tStyle.border
                }}
              >
                <div className="fw-bold d-flex align-items-center gap-1.5 mb-1.5" style={{ color: tStyle.color, fontSize: '0.88rem' }}>
                  <span
                    className="rounded-circle p-1 d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: '22px', height: '22px', backgroundColor: tStyle.color }}
                  >
                    <i className={`bi ${tStyle.icon}`} style={{ fontSize: '0.68rem' }}></i>
                  </span>
                  <span>{t.problem}</span>
                </div>
                <div className="small text-secondary mb-2 ps-1" style={{ fontSize: '0.78rem' }}>
                  <strong className="text-dark">Ursache:</strong> {t.cause}
                </div>
                <div
                  className="p-2.5 rounded-2 bg-white border small text-dark fw-medium shadow-2xs"
                  style={{ fontSize: '0.82rem', borderLeft: `3px solid #16a34a`, borderColor: '#e2e8f0' }}
                >
                  <i className="bi bi-check2-circle text-success me-1.5 fw-bold"></i>
                  <span>{t.action}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =============================================================
// INTERACTIVE CLINICAL COMPONENT 1: Beatmungsgerät & Dichtigkeit
// =============================================================
function VentilatorCircuitComponent({ standard }) {
  const [activeTab, setActiveTab] = useState('curves'); // 'curves' | 'circuit' | 'check'
  const [peep, setPeep] = useState(8);
  const [vt, setVt] = useState(460);
  const [checkRunning, setCheckRunning] = useState(false);
  const [checkResults, setCheckResults] = useState(null);

  const pPeak = peep + 16;
  const pPlat = peep + 10;
  const drivingPressure = pPlat - peep;

  const runCheck = () => {
    setCheckRunning(true);
    setCheckResults({ step: 1, text: 'Ventile & Dichtungen werden kalibriert...' });

    setTimeout(() => {
      setCheckResults({ step: 2, text: 'Dichtigkeitsprüfung bei 30 mbar Haltetest (Leckage < 100 ml/min)...' });
    }, 900);

    setTimeout(() => {
      setCheckResults({ step: 3, text: 'Bei ca. 94 %: Rote Verschlusskappe entfernen & wieder aufsetzen (Flow- & Compliance-Test)...' });
    }, 1800);

    setTimeout(() => {
      setCheckResults({
        step: 4,
        completed: true,
        passed: true,
        leakRate: '14 ml/min',
        compliance: '1.8 ml/mbar',
        o2Cell: '100% OK',
        alarms: 'Pmax & Diskonnektion aktiv'
      });
      setCheckRunning(false);
    }, 2600);
  };

  return (
    <div className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 bg-white mb-4" style={{ borderColor: `${standard.accentColor}35` }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 ps-1 ps-sm-0">
        <div className="d-flex align-items-center gap-2 ps-1 ps-sm-0">
          <span className="p-2 rounded-3 text-white d-inline-flex ms-1 ms-sm-0" style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' }}>
            <i className="bi bi-lungs-fill fs-5"></i>
          </span>
          <div>
            <h5 className="fw-bold mb-0 text-dark">
              Interaktiver Beatmungssimulator &amp; Gerätecheck
            </h5>
            <div className="text-secondary small" style={{ fontSize: '0.76rem' }}>
              Druck- &amp; Flowkurven, Doppelschlauch-Schema &amp; präklinischer Dichtigkeitstest
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border shadow-2xs" role="group">
          <button
            type="button"
            className={`btn rounded-pill px-3 py-1 fw-semibold ${activeTab === 'curves' ? 'btn-primary text-white shadow-xs' : 'btn-light border-0'}`}
            onClick={() => setActiveTab('curves')}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-activity me-1"></i>Beatmungskurven
          </button>
          <button
            type="button"
            className={`btn rounded-pill px-3 py-1 fw-semibold ${activeTab === 'circuit' ? 'btn-primary text-white shadow-xs' : 'btn-light border-0'}`}
            onClick={() => setActiveTab('circuit')}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-diagram-3 me-1"></i>Schlauchsystem
          </button>
          <button
            type="button"
            className={`btn rounded-pill px-3 py-1 fw-semibold ${activeTab === 'check' ? 'btn-primary text-white shadow-xs' : 'btn-light border-0'}`}
            onClick={() => setActiveTab('check')}
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-shield-check me-1"></i>Gerätecheck
          </button>
        </div>
      </div>

      {/* TAB 1: CURVES */}
      {activeTab === 'curves' && (
        <div>
          {/* Waveform Canvas / SVG Container */}
          <div className="rounded-4 p-3 mb-3 text-white position-relative overflow-hidden" style={{ backgroundColor: '#09131f', border: '1.5px solid #1e293b' }}>
            <div className="d-flex justify-content-between align-items-center mb-2 px-1">
              <span className="badge rounded-pill px-2.5 py-1 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.4)', fontSize: '0.68rem' }}>
                <i className="bi bi-activity me-1"></i>Echtzeit Druck-Zeit (Paw) &amp; Flow-Zeit Kurven
              </span>
              <span className="text-secondary small font-monospace" style={{ fontSize: '0.7rem' }}>
                Modus: PCV / VCV lungenprotektiv
              </span>
            </div>

            {/* SVG Waveforms */}
            <svg viewBox="0 0 600 210" className="w-100" style={{ maxHeight: '220px', display: 'block' }}>
              <defs>
                <linearGradient id="pawGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="flowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#4ade80" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="35" x2="600" y2="35" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="75" x2="600" y2="75" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="600" y2="120" stroke="#334155" strokeWidth="1" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Wave 1: Paw (Pressure) Curve */}
              <path
                d="M 10 100 L 40 100 L 50 35 L 120 48 L 135 100 L 230 100 L 240 35 L 310 48 L 325 100 L 420 100 L 430 35 L 500 48 L 515 100 L 590 100"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 40 100 L 50 35 L 120 48 L 135 100 Z"
                fill="url(#pawGrad)"
              />
              <path
                d="M 230 100 L 240 35 L 310 48 L 325 100 Z"
                fill="url(#pawGrad)"
              />

              {/* Labels for Pressure Curve */}
              <text x="55" y="30" fill="#38bdf8" fontSize="11" fontWeight="bold">Ppeak: {pPeak} mbar</text>
              <text x="125" y="44" fill="#93c5fd" fontSize="10">Pplat: {pPlat} mbar</text>
              <text x="145" y="96" fill="#38bdf8" fontSize="10">PEEP: {peep} mbar</text>

              {/* Wave 2: Flow (t) Curve */}
              <path
                d="M 10 160 L 40 160 L 45 130 L 120 160 L 125 185 L 160 160 L 230 160 L 235 130 L 310 160 L 315 185 L 350 160 L 420 160 L 425 130 L 500 160 L 505 185 L 540 160 L 590 160"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="48" y="125" fill="#4ade80" fontSize="10" fontWeight="bold">Insp. Flow 60 L/min</text>
              <text x="130" y="198" fill="#86efac" fontSize="9">Exp. Flow (Passiv)</text>
            </svg>

            {/* Readout Bar */}
            <div className="row g-2 pt-2 border-top border-secondary border-opacity-25 text-center">
              <div className="col-3">
                <span className="text-secondary small d-block" style={{ fontSize: '0.68rem' }}>Ppeak</span>
                <strong className="text-info fs-6">{pPeak} <small className="text-white-50" style={{ fontSize: '0.65rem' }}>mbar</small></strong>
              </div>
              <div className="col-3">
                <span className="text-secondary small d-block" style={{ fontSize: '0.68rem' }}>Pplat</span>
                <strong className="text-light fs-6">{pPlat} <small className="text-white-50" style={{ fontSize: '0.65rem' }}>mbar</small></strong>
              </div>
              <div className="col-3">
                <span className="text-secondary small d-block" style={{ fontSize: '0.68rem' }}>Driving Press. (&Delta;P)</span>
                <strong className={`fs-6 ${drivingPressure <= 14 ? 'text-success' : 'text-danger'}`}>{drivingPressure} <small className="text-white-50" style={{ fontSize: '0.65rem' }}>mbar</small></strong>
              </div>
              <div className="col-3">
                <span className="text-secondary small d-block" style={{ fontSize: '0.68rem' }}>PEEP</span>
                <strong className="text-primary fs-6">{peep} <small className="text-white-50" style={{ fontSize: '0.65rem' }}>mbar</small></strong>
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
                <span>PEEP (Positiv-endexspiratorischer Druck):</span>
                <span className="text-primary">{peep} mbar</span>
              </label>
              <input
                type="range"
                className="form-range"
                min="4"
                max="16"
                step="1"
                value={peep}
                onChange={(e) => setPeep(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
                <span>4 mbar (Min)</span>
                <span>8 mbar (Standard)</span>
                <span>16 mbar (ARDS)</span>
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
                <span>Tidalvolumen (Vt):</span>
                <span className="text-success">{vt} ml (6 ml/kg IBW)</span>
              </label>
              <input
                type="range"
                className="form-range"
                min="300"
                max="650"
                step="10"
                value={vt}
                onChange={(e) => setVt(Number(e.target.value))}
              />
              <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
                <span>300 ml (Protektiv)</span>
                <span>450 ml (Norm)</span>
                <span>650 ml</span>
              </div>
            </div>
          </div>

          {drivingPressure > 14 && (
            <div className="alert alert-danger py-2 px-3 rounded-3 mt-3 small d-flex align-items-center gap-2 mb-0">
              <i className="bi bi-exclamation-triangle-fill fs-5"></i>
              <span><strong>Achtung: Driving Pressure &gt; 14 mbar!</strong> Erhöhte Gefahr für Ventilator-Induced Lung Injury (VILI). Tidalvolumen senken oder PEEP optimieren!</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CIRCUIT SCHEMATIC */}
      {activeTab === 'circuit' && (
        <div className="p-3 bg-light rounded-4 border">
          <div className="fw-bold text-dark small text-uppercase mb-2.5 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center gap-1.5">
              <i className="bi bi-diagram-3-fill text-primary"></i>
              <span>FACHGERECHTER AUFBAU DES DOPPELSCHLAUCHSYSTEMS – ELISA 600:</span>
            </div>
            <span className="badge rounded-pill bg-white text-primary border px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
              6 Kernschritte
            </span>
          </div>

          <div className="row g-2">
            {[
              { num: '1', title: '🔵 1. Zentrale Gasversorgung (ZGV)', desc: 'O₂- und Druckluftschläuche sicher anschließen. Versorgungsdruck gemäß Herstellervorgaben kontrollieren.', icon: 'bi-plug-fill', color: '#0284c7' },
              { num: '2', title: '🟢 2. Doppelschlauchsystem', desc: 'Vormontiertes Doppelschlauchsystem mit integriertem Y-Stück auf Beschädigungen, Knicke und korrekten Sitz prüfen.', icon: 'bi-box-seam-fill', color: '#16a34a' },
              { num: '3', title: '🔵 3. Inspirationsschenkel', desc: 'Inspirationsschlauch am vorgesehenen Geräteausgang sicher anschließen.', icon: 'bi-arrow-right-circle-fill', color: '#0284c7' },
              { num: '4', title: '🟣 4. Exspirationsschenkel & Filter', desc: 'Exspirationsfilter am vorgesehenen Geräteanschluss einsetzen und Exspirationsschlauch sicher verbinden. Korrekten Sitz prüfen.', icon: 'bi-filter-circle-fill', color: '#7c3aed' },
              { num: '5', title: '🟠 5. Patientennaher HMEF & Gänsegurgel', desc: 'HMEF am Y-Stück anschließen und mit der Gänsegurgel verbinden. Patientenseitigen Anschluss mit roter Verschlusskappe verschließen.', icon: 'bi-shield-fill-plus', color: '#ea580c' },
              { num: '6', title: '🔴 6. Abschließende Systemkontrolle', desc: 'Alle Verbindungen auf festen Sitz, Knickfreiheit und sichtbare Beschädigungen prüfen.', icon: 'bi-check2-circle', color: '#dc2626' }
            ].map((s, idx) => (
              <div key={idx} className="col-sm-6 col-lg-4">
                <div className="p-2.5 bg-white rounded-3 border shadow-2xs h-100" style={{ borderLeft: `3.5px solid ${s.color}` }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px', backgroundColor: s.color, fontSize: '0.72rem' }}>
                      {s.num}
                    </span>
                    <strong className="text-dark small" style={{ fontSize: '0.80rem' }}>{s.title}</strong>
                  </div>
                  <div className="text-secondary small ps-4" style={{ fontSize: '0.76rem', lineHeight: '1.3' }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="alert alert-warning py-2 px-3 rounded-3 mt-3 small mb-0 d-flex align-items-center gap-2 border-warning" style={{ background: '#fffbeb' }}>
            <i className="bi bi-lightbulb-fill text-warning fs-5 flex-shrink-0"></i>
            <span><strong>💡 GOLDENE REGEL:</strong> Vor Patientenanschluss Geräte- und Dichtigkeitstest erfolgreich abschließen. Beatmungsbeutel mit Reservoir, ggf. PEEP-Ventil, passender Maske, O₂-Versorgung und funktionsfähige Absaugung bereithalten.</span>
          </div>
        </div>
      )}

      {/* TAB 3: PRE-USE CHECK SIMULATOR */}
      {activeTab === 'check' && (
        <div className="p-3 bg-light rounded-4 border">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
            <div>
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-success fs-5"></i>
                <span>Gerätecheck &amp; Dichtigkeitsprüfung (30 mbar Haltetest)</span>
              </h6>
              <div className="text-muted small" style={{ fontSize: '0.76rem' }}>
                Automatisierter Pre-Use-Check vor jedem Patientenwechsel
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-1.5"
              style={{ minHeight: '36px', fontSize: '0.82rem' }}
              onClick={runCheck}
              disabled={checkRunning}
            >
              {checkRunning ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Prüfung läuft...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-play-circle-fill"></i>
                  <span>Pre-Use Check starten</span>
                </>
              )}
            </button>
          </div>

          {checkRunning && (
            <div className="p-3 bg-white rounded-3 border mb-3 text-center">
              <div className="spinner-grow text-primary mb-2" role="status"></div>
              <div className="fw-bold text-dark small">{checkResults?.text}</div>
              <div className="progress mt-2" style={{ height: '5px' }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated bg-primary" style={{ width: `${(checkResults?.step || 1) * 25}%` }}></div>
              </div>
            </div>
          )}

          {checkResults?.completed && (
            <div className="p-3 bg-white rounded-3 border mb-3 shadow-2xs">
              <div className="d-flex align-items-center gap-2 text-success fw-bold mb-2">
                <i className="bi bi-check-circle-fill fs-5"></i>
                <span>Gerätecheck erfolgreich BESTANDEN • System einsatzbereit</span>
              </div>
              <div className="row g-2 small text-secondary">
                <div className="col-sm-6 col-lg-3">
                  <div className="p-2 bg-light rounded-2 border">
                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Leckage (30 mbar)</span>
                    <strong className="text-success">{checkResults.leakRate}</strong> <span className="text-muted">(&lt; 100 ml)</span>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-2 bg-light rounded-2 border">
                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Schlauch-Compliance</span>
                    <strong className="text-dark">{checkResults.compliance}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-2 bg-light rounded-2 border">
                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>O2-Sensorkalibrierung</span>
                    <strong className="text-success">{checkResults.o2Cell}</strong>
                  </div>
                </div>
                <div className="col-sm-6 col-lg-3">
                  <div className="p-2 bg-light rounded-2 border">
                    <span className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Sicherheitsalarme</span>
                    <strong className="text-dark">{checkResults.alarms}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4 Check Steps List */}
          <div className="d-flex flex-column gap-2 small">
            {[
              { title: '1. Dichtigkeitstest bei 30 mbar', desc: 'Y-Stück verschließen. Druck wird 10 Sek. gehalten. Maximale Leckrate < 100 ml/min.', passed: checkResults?.completed },
              { title: '2. Schlauch-Kompliance-Kompensation', desc: 'Gerät ermittelt Dehnbarkeit der Schläuche zur exakten Vt-Applikation.', passed: checkResults?.completed },
              { title: '3. Kalibrierung Flowsensor & O2-Messzelle', desc: 'Abgleich bei 21% Raumluft und 100% reinem Sauerstoff.', passed: checkResults?.completed },
              { title: '4. Alarm- und Batteriefunktionstest', desc: 'Netzausfall-Simulation: Akkubetrieb > 60 Minuten gewährleistet.', passed: checkResults?.completed }
            ].map((step, idx) => (
              <div key={idx} className="p-2 rounded-2 bg-white border d-flex align-items-center justify-content-between gap-2">
                <div>
                  <strong className="text-dark d-block">{step.title}</strong>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>{step.desc}</span>
                </div>
                {step.passed ? (
                  <span className="badge bg-success text-white rounded-pill px-2.5 py-1">
                    <i className="bi bi-check2 me-1"></i>OK
                  </span>
                ) : (
                  <span className="badge bg-light text-secondary border rounded-pill px-2 py-1">
                    Bereit
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================
// INTERACTIVE CLINICAL COMPONENT 2: Aktive Befeuchtung (Invasiv)
// =============================================================
function HumidifierComponent({ standard }) {
  const [ventMode, setVentMode] = useState('invasive'); // 'invasive' (37°C) | 'niv' (31°C)
  const [wireActive, setWireActive] = useState(true);

  const targetChamber = ventMode === 'invasive' ? 37.0 : 31.0;
  const targetWire = wireActive ? (ventMode === 'invasive' ? 39.0 : 33.0) : 23.5;
  const targetYPiece = wireActive ? (ventMode === 'invasive' ? 37.0 : 31.0) : 22.0;
  const absHumidity = ventMode === 'invasive' ? 44 : 32;

  return (
    <div className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 bg-white mb-4" style={{ borderColor: `${standard.accentColor}35` }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 ps-1 ps-sm-0">
        <div className="d-flex align-items-center gap-2 ps-1 ps-sm-0">
          <span className="p-2 rounded-3 text-white d-inline-flex ms-1 ms-sm-0" style={{ background: 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)' }}>
            <i className="bi bi-droplet-half fs-5"></i>
          </span>
          <div>
            <h5 className="fw-bold mb-0 text-dark">
              Thermo-Hygro Befeuchtungs-Gradient &amp; Kondensat-Monitor
            </h5>
            <div className="text-secondary small" style={{ fontSize: '0.76rem' }}>
              Physiologische Konditionierung (ISO 8185: 37°C, 44 mg/L H2O) &amp; Rainout-Schutz
            </div>
          </div>
        </div>

        {/* Mode selector */}
        <div className="btn-group btn-group-sm rounded-pill p-1 bg-light border" role="group">
          <button
            type="button"
            className={`btn rounded-pill px-3 py-1 fw-bold ${ventMode === 'invasive' ? 'btn-info text-white shadow-xs' : 'btn-light border-0'}`}
            onClick={() => setVentMode('invasive')}
            style={{ fontSize: '0.78rem' }}
          >
            Invasiv (37°C / 44 mg/L)
          </button>
          <button
            type="button"
            className={`btn rounded-pill px-3 py-1 fw-bold ${ventMode === 'niv' ? 'btn-info text-white shadow-xs' : 'btn-light border-0'}`}
            onClick={() => setVentMode('niv')}
            style={{ fontSize: '0.78rem' }}
          >
            NIV / Maske (31°C)
          </button>
        </div>
      </div>

      {/* 3 Temperature Checkpoint Stations */}
      <div className="row g-2.5 mb-3">
        <div className="col-md-4">
          <div className="p-3 rounded-4 border bg-light h-100 position-relative overflow-hidden" style={{ borderLeft: '4.5px solid #0891b2' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="badge rounded-pill bg-white text-secondary border px-2 py-0.5" style={{ fontSize: '0.68rem' }}>Station 1</span>
              <i className="bi bi-water text-info fs-5"></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">Befeuchterkammer</h6>
            <div className="display-6 fw-bold text-primary mb-1" style={{ fontSize: '1.6rem' }}>
              {targetChamber.toFixed(1)} <small className="fs-6 text-muted">°C</small>
            </div>
            <div className="small text-secondary" style={{ fontSize: '0.78rem' }}>
              Absolute Feuchte: <strong>{absHumidity} mg/L</strong> (100% r.F.)
            </div>
            <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
              Aqua dest. Dauerinfusion aktiv
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 rounded-4 border bg-light h-100 position-relative overflow-hidden" style={{ borderLeft: wireActive ? '4.5px solid #16a34a' : '4.5px solid #dc2626' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="badge rounded-pill bg-white text-secondary border px-2 py-0.5" style={{ fontSize: '0.68rem' }}>Station 2</span>
              <i className={`bi ${wireActive ? 'bi-fire text-warning' : 'bi-slash-circle text-danger'} fs-5`}></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">Beheizter Schlauch</h6>
            <div className={`display-6 fw-bold mb-1 ${wireActive ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.6rem' }}>
              {targetWire.toFixed(1)} <small className="fs-6 text-muted">°C</small>
            </div>
            <div className="small text-secondary" style={{ fontSize: '0.78rem' }}>
              Überwärmung: <strong>{wireActive ? '+2.0°C Gradient' : 'Ausgefallen!'}</strong>
            </div>
            <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
              {wireActive ? 'Schlauchheizdraht verhindert Rainout' : 'Gefahr: Massives Kondensat!'}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 rounded-4 border bg-light h-100 position-relative overflow-hidden" style={{ borderLeft: '4.5px solid #0284c7' }}>
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="badge rounded-pill bg-white text-secondary border px-2 py-0.5" style={{ fontSize: '0.68rem' }}>Station 3</span>
              <i className="bi bi-lungs text-primary fs-5"></i>
            </div>
            <h6 className="fw-bold text-dark mb-1">Y-Stück (Patient)</h6>
            <div className="display-6 fw-bold text-dark mb-1" style={{ fontSize: '1.6rem' }}>
              {targetYPiece.toFixed(1)} <small className="fs-6 text-muted">°C</small>
            </div>
            <div className="small text-secondary" style={{ fontSize: '0.78rem' }}>
              Epithel-Schutz: <strong>{wireActive ? 'Optimal (37°C)' : 'Unterkühlt'}</strong>
            </div>
            <div className="small text-muted mt-1" style={{ fontSize: '0.72rem' }}>
              Sensor misst patientennah
            </div>
          </div>
        </div>
      </div>

      {/* Rainout Simulator Interactive Toggle */}
      <div className="p-3 bg-light rounded-4 border mb-3">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <strong className="text-dark small d-block">Schlauchheizungs-Simulation (Rainout-Test):</strong>
            <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
              Testen Sie die Auswirkung eines getrennten oder defekten Schlauchheizdrahtes:
            </span>
          </div>

          <div className="form-check form-switch m-0">
            <input
              type="checkbox"
              className="form-check-input"
              role="switch"
              id="wireSwitch"
              checked={wireActive}
              onChange={(e) => setWireActive(e.target.checked)}
              style={{ width: '48px', height: '24px', cursor: 'pointer' }}
            />
            <label className="form-check-label fw-bold small ms-2 pt-1" htmlFor="wireSwitch">
              {wireActive ? 'Heizung AKTIV (+2°C)' : 'Heizung GETRENNT (Alarm!)'}
            </label>
          </div>
        </div>

        {!wireActive && (
          <div className="alert alert-danger py-2.5 px-3 rounded-3 mt-3 mb-0 small border-0 shadow-sm">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-exclamation-triangle-fill fs-5 flex-shrink-0 text-danger"></i>
              <div>
                <strong className="d-block">KRITISCHE GEFAHR: Schlauchkondensat (Rainout)!</strong>
                <span>Bei Temperaturabfall auf 22°C kondensieren bis zu 22 ml Wasser/Stunde im Schlauch. Bei jeder Patientenbewegung oder Lagerung droht massive Endotracheal-Aspiration von infektiösem Kondenswasser &amp; plötzliche Tubusokklusion!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Safety Rules Footnote */}
      <div className="row g-2 small text-secondary">
        <div className="col-sm-6 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Befeuchterkammer immer UNTER Patientenniveau anbringen</span>
        </div>
        <div className="col-sm-6 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Ausschließlich steriles Aqua dest. verwenden</span>
        </div>
        <div className="col-sm-6 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Keine HME-Filter (künstliche Nasen) parallel betreiben!</span>
        </div>
        <div className="col-sm-6 d-flex align-items-center gap-2">
          <i className="bi bi-check-circle-fill text-success"></i>
          <span>Kondensat niemals zurück in die Kammer leeren</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// INTERACTIVE CLINICAL COMPONENT 3: High-Flow & ROX-Index Rechner
// =============================================================
function RoxIndexCalculatorComponent({ standard }) {
  const [spo2, setSpo2] = useState(94);
  const [fio2, setFio2] = useState(50);
  const [rr, setRr] = useState(22);
  const [flow, setFlow] = useState(45);

  const fio2Fraction = fio2 / 100;
  const rox = (rr > 0 && fio2Fraction > 0) ? ((spo2 / fio2Fraction) / rr) : 0;
  const roxFormatted = rox.toFixed(2);

  const isSuccess = rox >= 4.88;
  const isWarning = rox >= 3.85 && rox < 4.88;
  const isCritical = rox < 3.85;

  return (
    <div className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 bg-white mb-4" style={{ borderColor: `${standard.accentColor}35` }}>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 ps-1 ps-sm-0">
        <div className="d-flex align-items-center gap-2 ps-1 ps-sm-0">
          <span className="p-2 rounded-3 text-white d-inline-flex ms-1 ms-sm-0" style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)' }}>
            <i className="bi bi-calculator-fill fs-5"></i>
          </span>
          <div>
            <h5 className="fw-bold mb-0 text-dark">
              ROX-Index Live-Rechner &amp; Therapieversagens-Prädiktor
            </h5>
            <div className="text-secondary small" style={{ fontSize: '0.76rem' }}>
              Evidenzbasierte Entscheidungshilfe für High-Flow-Therapie (HFNC)
            </div>
          </div>
        </div>

        <span className="badge rounded-pill bg-light text-secondary border px-2.5 py-1 small fw-semibold">
          Formel: (SpO2 / FiO2) / AF
        </span>
      </div>

      {/* Main Score Display Box */}
      <div
        className="rounded-4 p-3.5 mb-4 text-center border shadow-xs"
        style={{
          background: isSuccess
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            : (isWarning ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'),
          borderColor: isSuccess ? '#86efac' : (isWarning ? '#fde047' : '#fca5a5')
        }}
      >
        <span className="text-uppercase fw-bold small d-block mb-1" style={{ color: isSuccess ? '#166534' : (isWarning ? '#92400e' : '#991b1b'), letterSpacing: '0.5px' }}>
          Aktueller ROX-Index:
        </span>
        <div className="display-4 fw-black mb-1" style={{ color: isSuccess ? '#15803d' : (isWarning ? '#b45309' : '#dc2626') }}>
          {roxFormatted}
        </div>

        <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill fw-bold shadow-2xs mb-2" style={{ backgroundColor: '#ffffff', color: isSuccess ? '#166534' : (isWarning ? '#92400e' : '#b91c1c') }}>
          <i className={`bi ${isSuccess ? 'bi-check-circle-fill text-success' : (isWarning ? 'bi-exclamation-triangle-fill text-warning' : 'bi-x-circle-fill text-danger')}`}></i>
          <span>
            {isSuccess && 'ERFOLG WAHRSCHEINLICH (Score ≥ 4.88)'}
            {isWarning && 'GRAUBEREICH / WARNUNG (Score 3.85 – 4.87)'}
            {isCritical && 'HOHE INTUBATIONSGEFAHR! (Score < 3.85)'}
          </span>
        </div>

        <p className="small mb-0 mx-auto" style={{ maxWidth: '520px', color: isSuccess ? '#14532d' : (isWarning ? '#78350f' : '#7f1d1d'), lineHeight: '1.4' }}>
          {isSuccess && 'Geringes Risiko für Therapieversagen. High-Flow fortführen und Patienten nach 2h, 6h und 12h reevaluieren.'}
          {isWarning && 'Erhöhtes Risiko für Versagen. Engmaschige Kontrolle alle 1–2h. Flussrate und FiO2 optimieren, Arzt hinzuziehen.'}
          {isCritical && 'Kritisches Therapieversagen wahrscheinlich! Unverzüglich ITS-Arzt informieren und invasive Intubation vorbereiten!'}
        </p>
      </div>

      {/* 3 Interactive Sliders */}
      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
            <span>Sauerstoffsättigung (SpO2):</span>
            <span className="text-primary fw-extrabold">{spo2} %</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="70"
            max="100"
            step="1"
            value={spo2}
            onChange={(e) => setSpo2(Number(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
            <span>70%</span>
            <span>94% (Ziel)</span>
            <span>100%</span>
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
            <span>FiO2 (Sauerstoffanteil):</span>
            <span className="text-danger fw-extrabold">{fio2} %</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="21"
            max="100"
            step="1"
            value={fio2}
            onChange={(e) => setFio2(Number(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
            <span>21% (Raumluft)</span>
            <span>50%</span>
            <span>100% (Pure O2)</span>
          </div>
        </div>

        <div className="col-md-4">
          <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
            <span>Atemfrequenz (AF):</span>
            <span className="text-warning fw-extrabold">{rr} /min</span>
          </label>
          <input
            type="range"
            className="form-range"
            min="10"
            max="45"
            step="1"
            value={rr}
            onChange={(e) => setRr(Number(e.target.value))}
          />
          <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
            <span>10/min</span>
            <span>20/min</span>
            <span>45/min (Tachypnoe)</span>
          </div>
        </div>
      </div>

      {/* Flow Rate Setting & Practical Rules */}
      <div className="p-3 bg-light rounded-4 border">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <label className="form-label small fw-bold text-dark d-flex justify-content-between mb-1">
              <span>Flussrate (Flow):</span>
              <span className="text-success fw-bold">{flow} L/min</span>
            </label>
            <input
              type="range"
              className="form-range"
              min="20"
              max="60"
              step="5"
              value={flow}
              onChange={(e) => setFlow(Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.68rem' }}>
              <span>20 L/min</span>
              <span>45 L/min (Start)</span>
              <span>60 L/min (Max)</span>
            </div>
          </div>

          <div className="col-md-6 border-start-md ps-md-3">
            <div className="small text-secondary" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              <div className="mb-1">
                <i className="bi bi-shield-check text-success me-1"></i>
                <strong>PEEP-Effekt:</strong> Ca. +0.5 bis 1.0 mbar pro 10 L/min Flow bei geschlossenem Mund.
              </div>
              <div>
                <i className="bi bi-exclamation-triangle-fill text-danger me-1"></i>
                <strong>Prong-Regel:</strong> Nasenbrille darf max. 50% der Nasenöffnung ausfüllen! Luftaustritt zwingend nötig zur Barotraumaprävention.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// INTERACTIVE CLINICAL COMPONENT 4: Invasives arterielles System
// =============================================================
// INTERACTIVE CLINICAL COMPONENT 4: Invasives arterielles System
// Gold-Standard Combitrans® (Fa. B. Braun) – 15-Schritte-Befüllung,
// Reservoir-Entlüftung, Fast-Flush & Cave: Fingerischämie
// =============================================================
function ArterialWaveformComponent({ standard }) {
  const [damping, setDamping] = useState('optimal'); // 'optimal' | 'overdamped' | 'underdamped'
  const [isFlushing, setIsFlushing] = useState(false);
  const [activeTab, setActiveTab] = useState('steps'); // 'steps' | 'cave' | 'reservoir' | 'flush'
  const [sopStepPhase, setSopStepPhase] = useState(1); // 1: Vorbereitung | 2: 50 mmHg | 3: Reservoir | 4: 300 mmHg
  const [connectionCheck, setConnectionCheck] = useState(false);

  const triggerFlush = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
    }, 1200);
  };

  const readouts = {
    optimal: {
      sys: 124,
      dia: 74,
      map: 91,
      badge: 'Optimale Dämpfung',
      badgeClass: 'bg-success text-white',
      note: 'Reale Blutdruckwerte. 1,5 bis 2 Nachschwingungen nach Flush mit erhaltener dikroter Inzisur.'
    },
    overdamped: {
      sys: 104,
      dia: 84,
      map: 91,
      badge: 'Überdämpft (Luft / Koagel)',
      badgeClass: 'bg-warning text-dark',
      note: 'CAVE SOP: Systole FALSCH ZU TIEF (-20 mmHg), Diastole FALSCH ZU HOCH (+10 mmHg)! Pulsdruck künstlich verengt.'
    },
    underdamped: {
      sys: 152,
      dia: 62,
      map: 92,
      badge: 'Unterdämpft (Resonanz / Ringing)',
      badgeClass: 'bg-danger text-white',
      note: 'Systole FALSCH ZU HOCH (+28 mmHg), Diastole FALSCH ZU TIEF (-12 mmHg)! Überschießende Spitzenartefakte.'
    }
  }[damping];

  return (
    <div className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 bg-white mb-4" style={{ borderColor: `${standard.accentColor}35` }}>
      {/* 1. Header with System Badge */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 pb-2 border-bottom ps-1 ps-sm-0">
        <div className="d-flex align-items-center gap-2.5 ps-1 ps-sm-0">
          <span className="p-2.5 rounded-3 text-white d-inline-flex shadow-sm ms-1 ms-sm-0" style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}>
            <i className="bi bi-activity fs-4"></i>
          </span>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-black mb-0 text-dark">
                Combitrans® Arterieller Druck-Simulator &amp; SOP
              </h5>
              <span className="badge rounded-pill fw-bold text-uppercase" style={{ backgroundColor: 'rgba(220, 38, 38, 0.12)', color: '#dc2626', fontSize: '0.66rem', border: '1px solid rgba(220, 38, 38, 0.3)' }}>
                B. Braun Gold-Standard
              </span>
            </div>
            <div className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              15-Schritte-Befüllung (50 &rarr; 300 mmHg) • Reservoir im Uhrzeigersinn entlüften • Cave: Fingerischämie
            </div>
          </div>
        </div>

        {/* Connection Safety Verification Button */}
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-2 ${connectionCheck ? 'btn-success text-white' : 'btn-outline-danger'}`}
          style={{ minHeight: '36px', fontSize: '0.78rem' }}
          onClick={() => setConnectionCheck(!connectionCheck)}
        >
          <i className={`bi ${connectionCheck ? 'bi-check-all' : 'bi-wrench-adjustable'}`}></i>
          <span>{connectionCheck ? 'Alle Konnektionen fest nachgezogen' : 'Konnektionsstellen nachziehen!'}</span>
        </button>
      </div>

      {/* 2. Mandatory Pre-Use Warning: Connection Check & Priming Rule */}
      <div className={`p-3 rounded-4 mb-3 border d-flex align-items-start gap-2.5 ${connectionCheck ? 'bg-success bg-opacity-10 border-success' : 'bg-danger bg-opacity-10 border-danger'}`}>
        <i className={`bi ${connectionCheck ? 'bi-shield-check text-success' : 'bi-exclamation-octagon-fill text-danger'} fs-4 flex-shrink-0 mt-0.5`}></i>
        <div>
          <strong className={`d-block small ${connectionCheck ? 'text-success' : 'text-danger'}`}>
            {connectionCheck ? 'VORBEREITUNG KORREKT: ALLE KONNEKTIONSSTELLEN NACHGEZOGEN' : 'SICHERHEITS-PFLICHT VOR BEFÜLLUNG (SCHRITT 2 DER SOP)!'}
          </strong>
          <span className="small text-secondary" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
            Drucksystem aus der Verpackung entnehmen und <strong>ausnahmslos alle Konnektionsstellen fest nachziehen</strong>! Bei 300 mmHg Betriebsdruck droht sonst lebensgefährliche Leckage oder Blutaspiration. Befüllung initial nur bei <strong>max. 50 mmHg</strong> beginnen, um schaum- und blasenfreies Priming zu sichern!
          </span>
        </div>
      </div>

      {/* 3. Interactive Monitor Waveform Display */}
      <div className="rounded-4 p-3 mb-3 text-white position-relative overflow-hidden" style={{ backgroundColor: '#09131f', border: '1.5px solid #1e293b' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-1.5 px-1 gap-2">
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill px-2.5 py-1 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(239, 68, 68, 0.25)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.45)', fontSize: '0.68rem' }}>
              <i className="bi bi-activity me-1"></i>ART 1 (A. radialis)
            </span>
            <span className={`badge rounded-pill px-2.5 py-1 small fw-bold ${readouts.badgeClass}`} style={{ fontSize: '0.68rem' }}>
              {readouts.badge}
            </span>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary small font-monospace d-none d-sm-inline" style={{ fontSize: '0.72rem' }}>
              Druckbeutel: 300 mmHg • 3 ml/h Spülfluss
            </span>
            <button
              type="button"
              className="btn btn-danger btn-sm rounded-pill px-3 py-1 fw-bold shadow-xs d-flex align-items-center gap-1.5"
              style={{ fontSize: '0.76rem' }}
              onClick={triggerFlush}
              disabled={isFlushing}
            >
              <i className="bi bi-play-circle-fill"></i>
              <span>{isFlushing ? 'Flush wird gezogen...' : 'Fast-Flush auslösen'}</span>
            </button>
          </div>
        </div>

        {/* Live Pressure Numbers Readout */}
        <div className="d-flex align-items-baseline gap-3 mb-2 px-1">
          <div>
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>SYS / DIA (mmHg)</span>
            <div className="fw-black" style={{ fontSize: '1.6rem', color: damping === 'optimal' ? '#ef4444' : (damping === 'overdamped' ? '#f97316' : '#eab308'), lineHeight: 1 }}>
              {readouts.sys} / {readouts.dia}
            </div>
          </div>
          <div className="border-start border-secondary border-opacity-40 ps-3">
            <span className="text-muted small" style={{ fontSize: '0.7rem' }}>MAD (MAP)</span>
            <div className="fw-bold text-white" style={{ fontSize: '1.25rem', lineHeight: 1 }}>
              ({readouts.map})
            </div>
          </div>
          <div className="ms-auto text-end small text-muted d-none d-md-block" style={{ fontSize: '0.72rem', maxWidth: '320px' }}>
            {readouts.note}
          </div>
        </div>

        {/* SVG Dynamic Waveform Display */}
        <svg viewBox="0 0 600 150" className="w-100" style={{ maxHeight: '160px', display: 'block' }}>
          {/* Grid lines */}
          <line x1="0" y1="20" x2="600" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="55" x2="600" y2="55" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="95" x2="600" y2="95" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="0" y1="130" x2="600" y2="130" stroke="#334155" strokeWidth="1" />

          {isFlushing ? (
            /* Square Wave Signal during Fast Flush */
            <g>
              <path
                d="M 10 110 L 80 110 L 90 15 L 280 15 L 290 125 L 310 95 L 325 112 L 340 108 L 400 108 L 415 50 L 430 75 L 440 70 L 490 108 L 600 108"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x="130" y="38" fill="#fca5a5" fontSize="11" fontWeight="bold">300 mmHg Flush-Rechtecksignal &bull; 1,5–2 Oszillationen</text>
            </g>
          ) : (
            <g>
              {damping === 'optimal' && (
                <path
                  d="M 10 110 L 40 110 L 55 45 L 75 80 L 85 72 L 140 110 L 170 110 L 185 45 L 205 80 L 215 72 L 270 110 L 300 110 L 315 45 L 335 80 L 345 72 L 400 110 L 430 110 L 445 45 L 465 80 L 475 72 L 530 110 L 560 110"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {damping === 'overdamped' && (
                <path
                  d="M 10 110 L 40 110 L 60 65 L 140 110 L 170 110 L 190 65 L 270 110 L 300 110 L 320 65 L 400 110 L 430 110 L 450 65 L 530 110 L 560 110"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {damping === 'underdamped' && (
                <path
                  d="M 10 110 L 40 110 L 50 25 L 60 100 L 70 55 L 80 85 L 90 75 L 140 110 L 170 110 L 180 25 L 190 100 L 200 55 L 210 85 L 220 75 L 270 110 L 300 110 L 310 25 L 320 100 L 330 55 L 340 85 L 350 75 L 400 110 L 430 110 L 440 25 L 450 100 L 460 55 L 470 85 L 480 75 L 530 110"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </g>
          )}
        </svg>

        {/* Damping Selector Pills */}
        <div className="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-30 gap-2">
          <div className="d-flex align-items-center gap-1.5 small text-secondary" style={{ fontSize: '0.72rem' }}>
            <span>Kurvenzustand simulieren:</span>
          </div>

          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn btn-xs rounded-pill px-2.5 py-1 ${damping === 'optimal' ? 'btn-success text-white fw-bold' : 'btn-outline-secondary text-white'}`}
              style={{ fontSize: '0.72rem' }}
              onClick={() => setDamping('optimal')}
            >
              <i className="bi bi-check-circle me-1"></i>Optimal (1,5–2 Schwingungen)
            </button>
            <button
              type="button"
              className={`btn btn-xs rounded-pill px-2.5 py-1 ms-1 ${damping === 'overdamped' ? 'btn-warning text-dark fw-bold' : 'btn-outline-secondary text-white'}`}
              style={{ fontSize: '0.72rem' }}
              onClick={() => setDamping('overdamped')}
            >
              <i className="bi bi-water me-1"></i>Überdämpft (Luftblase!)
            </button>
            <button
              type="button"
              className={`btn btn-xs rounded-pill px-2.5 py-1 ms-1 ${damping === 'underdamped' ? 'btn-danger text-white fw-bold' : 'btn-outline-secondary text-white'}`}
              style={{ fontSize: '0.72rem' }}
              onClick={() => setDamping('underdamped')}
            >
              <i className="bi bi-soundwave me-1"></i>Unterdämpft (Ringing)
            </button>
          </div>
        </div>
      </div>

      {/* 4. Tab Navigation for Deep Combitrans® SOP Content */}
      <div className="d-flex flex-wrap gap-1.5 mb-3 p-1 rounded-3 bg-light border">
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'steps' ? 'btn-white bg-white text-danger shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('steps')}
        >
          <i className="bi bi-list-ol me-1"></i>1. 15-Schritte-Befüllung (SOP)
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'cave' ? 'btn-white bg-white text-danger shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('cave')}
        >
          <i className="bi bi-exclamation-triangle-fill me-1 text-warning"></i>2. Cave &amp; Risiken (Fingerischämie)
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'reservoir' ? 'btn-white bg-white text-danger shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('reservoir')}
        >
          <i className="bi bi-arrow-clockwise me-1"></i>3. Reservoir-Entlüftung
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'materials' ? 'btn-white bg-white text-danger shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('materials')}
        >
          <i className="bi bi-box-seam me-1"></i>4. Benötigte Materialien
        </button>
      </div>

      {/* TAB CONTENT 1: Der offizielle 15-Schritte-Befüllungsprozess */}
      {activeTab === 'steps' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <div className="d-flex justify-content-between align-items-center mb-2.5">
            <h6 className="fw-bold mb-0 text-dark small">
              <i className="bi bi-list-check me-1 text-danger"></i>Offizielle 15-Schritte-Befüllung (Combitrans® Fa. B. Braun)
            </h6>
            <span className="badge rounded-pill bg-white text-danger border border-danger small" style={{ fontSize: '0.68rem' }}>
              Phase {sopStepPhase} von 4
            </span>
          </div>

          {/* Phase Selector Tabs */}
          <div className="d-flex gap-1.5 mb-3">
            <button
              type="button"
              className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${sopStepPhase === 1 ? 'btn-danger text-white shadow-xs' : 'btn-outline-secondary bg-white text-muted'}`}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setSopStepPhase(1)}
            >
              Schritte 1–4: Vorbereitung
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${sopStepPhase === 2 ? 'btn-danger text-white shadow-xs' : 'btn-outline-secondary bg-white text-muted'}`}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setSopStepPhase(2)}
            >
              Schritte 5–9: 50 mmHg Priming
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${sopStepPhase === 3 ? 'btn-danger text-white shadow-xs' : 'btn-outline-secondary bg-white text-muted'}`}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setSopStepPhase(3)}
            >
              Schritte 10–14: Reservoir
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${sopStepPhase === 4 ? 'btn-danger text-white shadow-xs' : 'btn-outline-secondary bg-white text-muted'}`}
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
              onClick={() => setSopStepPhase(4)}
            >
              Schritt 15: 300 mmHg Enddruck
            </button>
          </div>

          {/* Phase Step Details */}
          <div className="card rounded-3 p-3 bg-white border shadow-2xs mb-2">
            {sopStepPhase === 1 && (
              <div>
                <span className="badge rounded-pill bg-secondary text-white mb-1.5 small">Phase 1: Vorbereitung &amp; Anschlüsse</span>
                <h6 className="fw-black text-dark mb-2">Vorbereitende Klemmen- &amp; Tropfkammerjustierung</h6>
                <ol className="small text-secondary ps-3 mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>
                  <li><strong>Rollenklemme schließen</strong>.</li>
                  <li><strong>Bei Vorhandensein von 3. Druckanschlussleitung</strong> &rarr; Klemme schließen.</li>
                  <li><strong>Konnektion mit NaCl-Beutel</strong> herstellen.</li>
                  <li><strong>Flüssigkeitsspiegel in der Tropfenkammer</strong> herstellen (ca. 1/3 bis 1/2 füllen).</li>
                </ol>
                <div className="p-2 rounded-2 bg-light border small text-muted">
                  <i className="bi bi-info-circle text-primary me-1"></i>SOP-Regel: NaCl-Beutel mit Druckbeutel am Infusionsständer aufhängen; Drucksystem auspacken und <strong>alle Konnektionsstellen nachziehen</strong>!
                </div>
              </div>
            )}

            {sopStepPhase === 2 && (
              <div>
                <span className="badge rounded-pill bg-primary text-white mb-1.5 small">Phase 2: Schonendes Befüllen bei max. 50 mmHg</span>
                <h6 className="fw-black text-dark mb-2">Sanftes Leitungspriming gegen Schaumbildung</h6>
                <ol className="small text-secondary ps-3 mb-2" start="5" style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>
                  <li><strong>Druckbeutel auf max. 50 mmHg aufpumpen</strong> (schützt vor Turbulenzen und Mikroblasen!).</li>
                  <li><strong>Transducer in die Halteplatte einhängen</strong> und Nullpunkthahn zur Atmosphäre öffnen.</li>
                  <li><strong>Rollenklemme langsam öffnen</strong> und Zuleitung zur 3. optionalen Druckmessung spülen, Klemme wieder schließen.</li>
                  <li><strong>Beide Druckmesssysteme vorsichtig spülen</strong>, bis NaCl am Nullpunkthahn austritt.</li>
                  <li><strong>Nullpunkthahn zur Atmosphäre schließen</strong> und Leitungen langsam spülen, bis Flüssigkeit am Leitungsende austritt.</li>
                </ol>
                <div className="p-2 rounded-2 bg-primary bg-opacity-10 border border-primary small text-primary">
                  <i className="bi bi-shield-check me-1"></i>Warum nur 50 mmHg? Hoher Druck (&gt; 50 mmHg) erzeugt Kavitation und Mikroblasen, die schwer entfernbar sind!
                </div>
              </div>
            )}

            {sopStepPhase === 3 && (
              <div>
                <span className="badge rounded-pill text-white mb-1.5 small" style={{ backgroundColor: '#c2410c' }}>Phase 3: Reservoir-Entlüftung &amp; Nachspülen</span>
                <h6 className="fw-black text-dark mb-2">Blasenfreie Kolbenführung im Uhrzeigersinn</h6>
                <ol className="small text-secondary ps-3 mb-2" start="10" style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>
                  <li><strong>Patient*innen-seitigen Hahn zur Atmosphäre schließen</strong>.</li>
                  <li><strong>Reservoir</strong> &ndash; unter Drehen und mit gleichzeitig leichtem Zug am Kolben &ndash; langsam mit Spülung füllen.</li>
                  <li><strong>Patient*innen-seitigen Hahn zur Atmosphäre öffnen</strong>.</li>
                  <li><strong>Danach durch Zurückdrehen</strong> &ndash; und mit leichtem Druck auf den Kolben &ndash; <strong>im Uhrzeigersinn</strong> das Reservoir entlüften.</li>
                  <li><strong>Wichtig: Nochmaliges Spülen</strong>, um Rest-Luft aus dem Reservoir und der Druckmessleitung restlos zu entfernen!</li>
                </ol>
                <div className="p-2 rounded-2 bg-danger bg-opacity-10 border border-danger small text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>Sicherheits-Schwerpunkt: Restluft im Reservoir wandert unbemerkt zum Patienten! Schritt 14 (Nochmaliges Spülen) ist zwingend!
                </div>
              </div>
            )}

            {sopStepPhase === 4 && (
              <div>
                <span className="badge rounded-pill bg-success text-white mb-1.5 small">Phase 4: Finaler Betriebsdruck &amp; Betriebsmodus</span>
                <h6 className="fw-black text-dark mb-2">Hähne querstellen &amp; 300 mmHg Betriebsdruck</h6>
                <ol className="small text-secondary ps-3 mb-2" start="15" style={{ fontSize: '0.78rem', lineHeight: '1.5' }}>
                  <li><strong>Beide Nullpunkthähne quer stellen</strong> (sicher verschließen).</li>
                  <li><strong>Alle Klemmen öffnen</strong> (mit Ausnahme der optionalen 3. Druckmessung).</li>
                  <li><strong>Druckbeutel auf exakt 300 mmHg aufpumpen</strong> (gewährleistet kontinuierliche Mikrodosierung von 3 ml/h zur Offenhaltung des Katheters).</li>
                </ol>
                <div className="p-2 rounded-2 bg-success bg-opacity-10 border border-success small text-success">
                  <i className="bi bi-check-circle-fill me-1"></i>System ist nun einsatzbereit für phlebostatischen Nullabgleich (4. ICR / mittlere Axillarlinie) und Fast-Flush-Test!
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1"
              disabled={sopStepPhase === 1}
              onClick={() => setSopStepPhase(Math.max(1, sopStepPhase - 1))}
              style={{ fontSize: '0.74rem' }}
            >
              <i className="bi bi-arrow-left me-1"></i>Vorherige Phase
            </button>
            <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Phase {sopStepPhase} von 4</span>
            <button
              type="button"
              className="btn btn-danger btn-sm rounded-pill px-3 py-1"
              disabled={sopStepPhase === 4}
              onClick={() => setSopStepPhase(Math.min(4, sopStepPhase + 1))}
              style={{ fontSize: '0.74rem' }}
            >
              Nächste Phase<i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Cave & Risikomanagement (Seite 2 der SOP) */}
      {activeTab === 'cave' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <div className="d-flex align-items-center gap-2 mb-2.5">
            <i className="bi bi-shield-exclamation text-danger fs-5"></i>
            <h6 className="fw-bold mb-0 text-dark small">
              Tipps, Tricks und Kniffe – Wo ist besondere Vorsicht geboten?! (Cave-Leitfaden)
            </h6>
          </div>

          <div className="row g-2 mb-2">
            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-danger h-100 shadow-2xs">
                <div className="d-flex align-items-center gap-1.5 mb-1.5">
                  <i className="bi bi-exclamation-octagon-fill text-danger fs-5"></i>
                  <strong className="text-danger small">Cave 1: Luft im System &amp; Fingerischämie</strong>
                </div>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                  <strong>Luft im System führt unter Umständen durch thromboembolische Geschehen bis hin zum Verschluss von kleinen Arterien im Endstromgebiet und somit zu Durchblutungsstörungen der Finger!</strong>
                </p>
                <div className="p-2 rounded-2 bg-light border small text-muted" style={{ fontSize: '0.72rem' }}>
                  <strong>Pflegemaßnahme:</strong> Stündliche Perfusionskontrolle der Hand (Fingerwärme, Hautkolorit, Rekapillarisierungszeit &lt; 2 s, Radialispuls). Bei Blässe oder Zyanose Spülung sofort stoppen und Dienstarzt alarmieren!
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-warning h-100 shadow-2xs">
                <div className="d-flex align-items-center gap-1.5 mb-1.5">
                  <i className="bi bi-water text-warning fs-5"></i>
                  <strong className="text-dark small">Cave 2: Dämpfung der Druckkurve</strong>
                </div>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.76rem', lineHeight: '1.4' }}>
                  <strong>Die Messung wird durch Dämpfung der Druckkurve ungenau: Die Systole wird zu niedrig und die Diastole zu hoch angezeigt!</strong>
                </p>
                <div className="p-2 rounded-2 bg-light border small text-muted" style={{ fontSize: '0.72rem' }}>
                  <strong>Konsequenz:</strong> Ein verengter Pulsdruck täuscht einen kardiogenen Schock vor oder verschleiert hypertensive Krisen. Fast-Flush-Test deckt Überdämpfung sofort auf!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Reservoir-Entlüftung im Detail */}
      {activeTab === 'reservoir' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <h6 className="fw-bold mb-2 text-dark small">
            <i className="bi bi-arrow-clockwise me-1 text-danger"></i>Combitrans® Reservoir-Führung &amp; Entlüftungstechnik
          </h6>
          <p className="small text-secondary mb-2" style={{ fontSize: '0.76rem' }}>
            Das integrierte Reservoir dient der blutfreien Spülung und aseptischen Blutentnahme. Falsches Befüllen ist die häufigste Ursache für persistierende Mikroblasen:
          </p>

          <div className="row g-2 mb-2">
            <div className="col-sm-4">
              <div className="p-2.5 rounded-3 bg-white border h-100 text-center">
                <span className="badge rounded-pill bg-danger text-white mb-1.5">Schritt A</span>
                <strong className="d-block small text-dark mb-1">Drehen + leichter Zug</strong>
                <p className="text-muted small mb-0" style={{ fontSize: '0.72rem' }}>
                  Patientenhahn zur Atmosphäre schließen. Kolben unter kontinuierlichem Drehen langsam zurückziehen.
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-2.5 rounded-3 bg-white border h-100 text-center">
                <span className="badge rounded-pill bg-warning text-dark mb-1.5">Schritt B</span>
                <strong className="d-block small text-dark mb-1">Im Uhrzeigersinn</strong>
                <p className="text-muted small mb-0" style={{ fontSize: '0.72rem' }}>
                  Patientenhahn öffnen. Kolben im Uhrzeigersinn unter leichtem Vorschub zurückdrehen (Luftausstoß).
                </p>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="p-2.5 rounded-3 bg-white border h-100 text-center">
                <span className="badge rounded-pill bg-success text-white mb-1.5">Schritt C</span>
                <strong className="d-block small text-dark mb-1">Nochmaliges Spülen</strong>
                <p className="text-muted small mb-0" style={{ fontSize: '0.72rem' }}>
                  Nochmals durchspülen, um letzte Restbläschen aus Leitung und Reservoir zu eliminieren!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Benötigte Materialien */}
      {activeTab === 'materials' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <h6 className="fw-bold mb-2 text-dark small">
            <i className="bi bi-box-seam me-1 text-danger"></i>Benötigte Materialien gemäß Gold-Standard
          </h6>
          <div className="row g-2 small">
            <div className="col-sm-6">
              <div className="p-2 rounded-2 bg-white border d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-success fs-5"></i>
                <span><strong>Infusionsstange / -ständer</strong> (stabil arretiert)</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-2 rounded-2 bg-white border d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-success fs-5"></i>
                <span><strong>500* oder 1000* ml NaCl 0,9%</strong> Beutel</span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-2 rounded-2 bg-white border d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-success fs-5"></i>
                <span><strong>Größen-adaptierter* Druckbeutel</strong></span>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="p-2 rounded-2 bg-white border d-flex align-items-center gap-2">
                <i className="bi bi-check2-circle text-success fs-5"></i>
                <span><strong>Combitrans® (Fa. B. Braun)</strong> Drucksystem</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Quick Reminder Pill */}
      <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2 small">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-speedometer2 text-danger fs-5"></i>
          <span><strong>Druckstufen:</strong> Initial max. 50 mmHg &bull; Betriebsdruck exakt 300 mmHg</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-crosshair text-primary fs-5"></i>
          <span><strong>Nivellierung:</strong> 4. ICR / mittlere Axillarlinie (phlebostatischer Punkt)</span>
        </div>
      </div>
    </div>
  );
}

// =============================================================
// INTERACTIVE CLINICAL COMPONENT 5: Externe Ventrikeldrainage (EVD)
// SOP VentrEX® System: Regulär geschlossenes ICP-Monitoring,
// Tragus-Nivellierung, Nullen ohne Diskonnektion & Druckgrenzen
// =============================================================
function EvdLevelingComponent({ standard }) {
  // Drainage State: 'closed' (SOP-Standard / ICP-Messung) vs. 'open' (Intermittierendes Ablassen)
  const [drainageMode, setDrainageMode] = useState('closed'); // 'closed' | 'open'

  // Safety Movement Interlock: Clamped before moving patient / bed
  const [isMovementSafe, setIsMovementSafe] = useState(false);

  // Patient Status & Lesion Selection for SOP Druckgrenzen Matrix
  const [patientStatus, setPatientStatus] = useState('sedated'); // 'sedated' | 'awake'
  const [lesionSite, setLesionSite] = useState('supratentorial'); // 'supratentorial' | 'infratentorial'

  // Waveform Compliance
  const [icpCurve, setIcpCurve] = useState('normal'); // 'normal' (P1 > P2 > P3) | 'high_icp' (P2 > P1)

  // Intermittent Drain Volume Simulator (0 to 15 ml, target 5-10 ml)
  const [drainVolume, setDrainVolume] = useState(6);

  // Interactive 4-Step Zeroing Stepper (1 to 4)
  const [zeroStep, setZeroStep] = useState(1);

  // Active Tab for Deep SOP Knowledge
  const [activeTab, setActiveTab] = useState('matrix'); // 'matrix' | 'zeroing' | 'valves' | 'competence'

  // SOP Target Matrix based on official procedural guideline
  const targetThresholds = {
    sedated: {
      supratentorial: {
        icp: 15,
        chamberCm: 10,
        label: 'Sediert / Intubiert – Supratentoriell',
        note: 'Ziel-ICP <= 15 mmHg. Abtropfkammer standardmäßig 10 cm über Tragus-Null-Linie einhängen.'
      },
      infratentorial: {
        icp: 20,
        chamberCm: 15,
        label: 'Sediert / Intubiert – Infratentoriell',
        note: 'Ziel-ICP <= 20 mmHg. Abtropfkammer 15 cm über Tragus-Null-Linie einhängen.'
      }
    },
    awake: {
      supratentorial: {
        icp: 20,
        chamberCm: 15,
        label: 'Wach / Kooperativ – Supratentoriell',
        note: 'Ziel-ICP <= 20 mmHg. Abtropfkammer 15 cm über Tragus. Höhere Stufe schützt vor Überdrainage bei Eigenbewegung!'
      },
      infratentorial: {
        icp: 25,
        chamberCm: 20,
        label: 'Wach / Kooperativ – Infratentoriell',
        note: 'Ziel-ICP <= 25 mmHg. Abtropfkammer 20 cm über Tragus. Engmaschige klinische Überwachung!'
      }
    }
  };

  const currentTarget = targetThresholds[patientStatus][lesionSite];

  return (
    <div className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 bg-white mb-4" style={{ borderColor: `${standard.accentColor}35` }}>
      {/* 1. Header with System Badge */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 pb-2 border-bottom ps-1 ps-sm-0">
        <div className="d-flex align-items-center gap-2.5 ps-1 ps-sm-0">
          <span className="p-2.5 rounded-3 text-white d-inline-flex shadow-sm ms-1 ms-sm-0" style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #581c87 100%)' }}>
            <i className="bi bi-diagram-3-fill fs-4"></i>
          </span>
          <div>
            <div className="d-flex align-items-center gap-2">
              <h5 className="fw-black mb-0 text-dark">
                VentrEX® EVD-Simulator &amp; ICP-Leitfaden
              </h5>
              <span className="badge rounded-pill fw-bold text-uppercase" style={{ backgroundColor: 'rgba(124, 58, 237, 0.12)', color: '#7c3aed', fontSize: '0.66rem', border: '1px solid rgba(124, 58, 237, 0.3)' }}>
                SOP-Standard
              </span>
            </div>
            <div className="text-secondary small" style={{ fontSize: '0.78rem' }}>
              Tragus-Nivellierung (Foramen Monroi) • Regulär geschlossenes System • Nullen ohne Diskonnektion
            </div>
          </div>
        </div>

        {/* Safety Movement Clamping Button */}
        <button
          type="button"
          className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center gap-2 ${isMovementSafe ? 'btn-success text-white' : 'btn-outline-danger'}`}
          style={{ minHeight: '36px', fontSize: '0.78rem' }}
          onClick={() => setIsMovementSafe(!isMovementSafe)}
        >
          <i className={`bi ${isMovementSafe ? 'bi-shield-fill-check' : 'bi-exclamation-triangle-fill'}`}></i>
          <span>{isMovementSafe ? 'Verriegelt für Bewegung' : 'Klemmpflicht vor Bewegung prüfen!'}</span>
        </button>
      </div>

      {/* 2. Critical Clamping Safety Interlock Alert */}
      <div className={`p-3 rounded-4 mb-3 border d-flex align-items-start gap-2.5 ${isMovementSafe ? 'bg-success bg-opacity-10 border-success' : 'bg-danger bg-opacity-10 border-danger'}`}>
        <i className={`bi ${isMovementSafe ? 'bi-shield-check text-success' : 'bi-exclamation-octagon-fill text-danger'} fs-4 flex-shrink-0 mt-0.5`}></i>
        <div>
          <strong className={`d-block small ${isMovementSafe ? 'text-success' : 'text-danger'}`}>
            {isMovementSafe ? 'SICHER: DRAINAGE VOR PATIENTENBEWEGUNG GESCHLOSSEN' : 'STRIKTE VERRIEGELUNGSPFLICHT VOR JEDER BEWEGUNG!'}
          </strong>
          <span className="small text-secondary" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
            Vor jeder Bett- oder Kopfteilverstellung, Umlagerung, Mobilisation, endotrachealem Absaugen oder Transport zwingend <strong>Drainage schließen</strong> (Schutz vor tödlichem Brückenvenenabriss / akutem Subduralhämatom durch Unterdruck)! Nach Abschluss der Bewegung: Gelben Hahn (2) mittels Laserwaage zwingend neu auf den <strong>Tragus des Ohres</strong> ausrichten!
          </span>
        </div>
      </div>

      {/* 3. Core Operational Mode: Closed ICP-Monitoring vs. Open Intermittent Drainage */}
      <div className="card rounded-4 p-3 mb-3 border" style={{ backgroundColor: drainageMode === 'closed' ? '#faf5ff' : '#fff7ed', borderColor: drainageMode === 'closed' ? '#ddd6fe' : '#fed7aa' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center mb-2.5 gap-2">
          <div>
            <span className="text-uppercase fw-bold small text-muted" style={{ fontSize: '0.68rem', letterSpacing: '0.5px' }}>
              Aktueller Betriebszustand (VentrEX® Hahn 3)
            </span>
            <h6 className="fw-black mb-0 text-dark">
              {drainageMode === 'closed' ? 'Drainage GESCHLOSSEN (SOP-Normalbetrieb)' : 'Drainage GEÖFFNET (Intermittierende Entlastung)'}
            </h6>
          </div>

          <div className="btn-group btn-group-sm p-1 rounded-pill bg-white border shadow-2xs" role="group">
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${drainageMode === 'closed' ? 'btn-primary text-white shadow-xs' : 'btn-light text-secondary'}`}
              style={{ fontSize: '0.76rem', backgroundColor: drainageMode === 'closed' ? '#7c3aed' : 'transparent', borderColor: 'transparent' }}
              onClick={() => setDrainageMode('closed')}
            >
              <i className="bi bi-lock-fill me-1"></i>Regulär GESCHLOSSEN
            </button>
            <button
              type="button"
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold ${drainageMode === 'open' ? 'btn-warning text-dark shadow-xs' : 'btn-light text-secondary'}`}
              style={{ fontSize: '0.76rem' }}
              onClick={() => setDrainageMode('open')}
            >
              <i className="bi bi-unlock-fill me-1"></i>GEÖFFNET (Entlastung)
            </button>
          </div>
        </div>

        {drainageMode === 'closed' ? (
          /* CLOSED STATE: Continuous ICP Monitoring Active */
          <div className="row g-3 align-items-center">
            <div className="col-lg-6">
              <div className="p-3 bg-white rounded-3 border">
                <div className="d-flex align-items-center justify-content-between mb-1.5">
                  <span className="badge rounded-pill px-2.5 py-1 text-uppercase fw-bold" style={{ backgroundColor: 'rgba(22, 163, 74, 0.12)', color: '#16a34a', border: '1px solid rgba(22, 163, 74, 0.25)', fontSize: '0.68rem' }}>
                    <i className="bi bi-check2-circle me-1"></i>ICP-Monitoring aktiv
                  </span>
                  <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Druckwandlerhahn (3) auf Messung</span>
                </div>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                  Die Drainage ist nach SOP <strong>regulär geschlossen</strong>. Der reale Hirndruck wird kontinuierlich über den Transducer erfasst. Öffnen erfolgt nur bei Überschreiten des Ziel-ICP.
                </p>
                <div className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light border small">
                  <span>Aktueller Hirndruck: <strong className="text-primary fs-6">12 mmHg</strong></span>
                  <span className="text-success fw-bold"><i className="bi bi-shield-check me-1"></i>Im Zielbereich</span>
                </div>
              </div>
            </div>

            {/* Live Waveform Box */}
            <div className="col-lg-6">
              <div className="rounded-3 p-3 text-white" style={{ backgroundColor: '#09131f', border: '1.5px solid #1e293b' }}>
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="badge rounded-pill px-2 py-0.5" style={{ backgroundColor: 'rgba(124, 58, 237, 0.25)', color: '#c084fc', fontSize: '0.68rem' }}>
                    <i className="bi bi-activity me-1"></i>ICP Wellenform
                  </span>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      type="button"
                      className={`btn btn-xs rounded-pill px-2 py-0.5 ${icpCurve === 'normal' ? 'btn-success text-white' : 'btn-outline-secondary'}`}
                      style={{ fontSize: '0.68rem' }}
                      onClick={() => setIcpCurve('normal')}
                    >
                      P1 &gt; P2 &gt; P3 (Normal)
                    </button>
                    <button
                      type="button"
                      className={`btn btn-xs rounded-pill px-2 py-0.5 ms-1 ${icpCurve === 'high_icp' ? 'btn-danger text-white' : 'btn-outline-secondary'}`}
                      style={{ fontSize: '0.68rem' }}
                      onClick={() => setIcpCurve('high_icp')}
                    >
                      P2 &gt; P1 (Erhöht)
                    </button>
                  </div>
                </div>

                <svg viewBox="0 0 320 80" className="w-100 my-1" style={{ maxHeight: '80px', display: 'block' }}>
                  {icpCurve === 'normal' ? (
                    <g>
                      <path
                        d="M 10 65 L 30 65 L 45 15 L 60 32 L 75 48 L 90 65 L 120 65 L 135 15 L 150 32 L 165 48 L 180 65 L 210 65 L 225 15 L 240 32 L 255 48 L 270 65 L 310 65"
                        fill="none"
                        stroke="#4ade80"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <text x="40" y="12" fill="#4ade80" fontSize="9" fontWeight="bold">P1</text>
                      <text x="60" y="28" fill="#86efac" fontSize="8">P2</text>
                      <text x="75" y="44" fill="#86efac" fontSize="8">P3</text>
                    </g>
                  ) : (
                    <g>
                      <path
                        d="M 10 65 L 30 65 L 45 35 L 60 12 L 75 38 L 90 65 L 120 65 L 135 35 L 150 12 L 165 38 L 180 65 L 210 65 L 225 35 L 240 12 L 255 38 L 270 65 L 310 65"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <text x="36" y="32" fill="#fca5a5" fontSize="8">P1</text>
                      <text x="56" y="10" fill="#ef4444" fontSize="10" fontWeight="bold">P2 &gt; P1!</text>
                      <text x="75" y="36" fill="#fca5a5" fontSize="8">P3</text>
                    </g>
                  )}
                </svg>

                <div className="pt-1 text-muted" style={{ fontSize: '0.72rem' }}>
                  {icpCurve === 'normal' ? (
                    <span className="text-success"><i className="bi bi-check-circle me-1"></i>Normale Hirn-Compliance (P1 Percussion &gt; P2 Tidal &gt; P3 Dicrotic)</span>
                  ) : (
                    <span className="text-danger fw-bold"><i className="bi bi-exclamation-triangle-fill me-1"></i>Compliance erschöpft! P2 Rundung weist auf akute Hirndruckkrise hin.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* OPEN STATE: Critical Warning + Intermittent Drainage Counter */
          <div className="p-3 bg-white rounded-3 border border-warning">
            <div className="alert alert-warning py-2.5 px-3 rounded-3 mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-exclamation-octagon-fill text-danger fs-4 flex-shrink-0"></i>
              <div>
                <strong className="text-danger d-block">ACHTUNG: Bei geöffneter EVD ist KEINE ICP-Messung möglich!</strong>
                <span className="small text-dark" style={{ fontSize: '0.76rem', lineHeight: '1.35' }}>
                  Der Transducer misst bei offener Drainage nur den hydrostatischen Tropfkammergegendruck. Gefahr falsch niedriger Werte! Nach Entlastung sofort wieder schließen.
                </span>
              </div>
            </div>

            <div className="row g-3 align-items-center">
              <div className="col-md-7">
                <div className="d-flex justify-content-between align-items-center mb-1.5">
                  <span className="small fw-bold text-dark">Abgelassene Liquormenge im Intervall:</span>
                  <span className={`badge rounded-pill fs-6 px-3 py-1 ${drainVolume > 10 ? 'bg-danger text-white' : 'bg-primary text-white'}`}>
                    {drainVolume} ml
                  </span>
                </div>

                <input
                  type="range"
                  className="form-range my-1"
                  min="0"
                  max="15"
                  step="1"
                  value={drainVolume}
                  onChange={(e) => setDrainVolume(Number(e.target.value))}
                />

                <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.7rem' }}>
                  <span>0 ml (Start)</span>
                  <span className="text-success fw-bold">5–10 ml (SOP-Zielbereich)</span>
                  <span className="text-danger fw-bold">&gt;10 ml (Überdrainagegefahr!)</span>
                </div>
              </div>

              <div className="col-md-5 d-flex flex-column gap-1.5">
                <button
                  type="button"
                  className="btn btn-danger btn-sm rounded-pill fw-bold py-2 shadow-xs d-flex align-items-center justify-content-center gap-1.5"
                  onClick={() => setDrainageMode('closed')}
                >
                  <i className="bi bi-lock-fill"></i>
                  <span>Entlastung beenden &amp; EVD SCHLIESSEN</span>
                </button>
                <span className="text-center text-muted" style={{ fontSize: '0.7rem' }}>
                  SOP: Nach max. 5–10 ml bzw. Sistieren sofort wieder schließen!
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Tab Navigation for Deep SOP Knowledge */}
      <div className="d-flex flex-wrap gap-1.5 mb-3 p-1 rounded-3 bg-light border">
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'matrix' ? 'btn-white bg-white text-primary shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('matrix')}
        >
          <i className="bi bi-table me-1"></i>1. Druckgrenzen-Matrix
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'zeroing' ? 'btn-white bg-white text-primary shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('zeroing')}
        >
          <i className="bi bi-sliders me-1"></i>2. Nullen ohne Diskonnektion
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'valves' ? 'btn-white bg-white text-primary shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('valves')}
        >
          <i className="bi bi-diagram-2 me-1"></i>3. Hahnschema (1–4)
        </button>
        <button
          type="button"
          className={`btn btn-sm rounded-2 flex-grow-1 fw-bold ${activeTab === 'competence' ? 'btn-white bg-white text-primary shadow-xs' : 'text-secondary'}`}
          style={{ fontSize: '0.74rem' }}
          onClick={() => setActiveTab('competence')}
        >
          <i className="bi bi-shield-shaded me-1"></i>4. Kompetenzgrenzen
        </button>
      </div>

      {/* TAB CONTENT 1: Offizielle SOP-Druckgrenzen Matrix */}
      {activeTab === 'matrix' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <div className="d-flex justify-content-between align-items-center mb-2.5">
            <h6 className="fw-bold mb-0 text-dark small">
              <i className="bi bi-crosshair me-1 text-primary"></i>Offizielle Druckgrenzen &amp; Tropfkammer-Niveaus
            </h6>
            <span className="badge rounded-pill bg-white text-dark border small" style={{ fontSize: '0.68rem' }}>
              Referenz = Tragus des Ohres
            </span>
          </div>

          {/* Selectors */}
          <div className="row g-2 mb-3">
            <div className="col-sm-6">
              <label className="form-label small fw-bold text-muted mb-1" style={{ fontSize: '0.72rem' }}>Patientenzustand:</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${patientStatus === 'sedated' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'}`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => setPatientStatus('sedated')}
                >
                  Intubiert &amp; Sediert
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${patientStatus === 'awake' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'}`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => setPatientStatus('awake')}
                >
                  Wach &amp; Kooperativ
                </button>
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form-label small fw-bold text-muted mb-1" style={{ fontSize: '0.72rem' }}>Läsionslokalisation:</label>
              <div className="btn-group w-100" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${lesionSite === 'supratentorial' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'}`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => setLesionSite('supratentorial')}
                >
                  Supratentoriell
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${lesionSite === 'infratentorial' ? 'btn-primary text-white fw-bold' : 'btn-outline-secondary bg-white'}`}
                  style={{ fontSize: '0.74rem' }}
                  onClick={() => setLesionSite('infratentorial')}
                >
                  Infratentoriell
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          <div className="card rounded-3 p-3 bg-white border border-primary shadow-2xs mb-2">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <span className="fw-bold text-primary small">{currentTarget.label}</span>
              <div className="d-flex gap-2">
                <span className="badge rounded-pill bg-danger text-white px-2.5 py-1">
                  Ziel-ICP: ≤ {currentTarget.icp} mmHg
                </span>
                <span className="badge rounded-pill bg-primary text-white px-2.5 py-1">
                  Abtropfkammer: +{currentTarget.chamberCm} cm ü. Tragus
                </span>
              </div>
            </div>
            <p className="small text-secondary mb-0" style={{ fontSize: '0.76rem', lineHeight: '1.35' }}>
              {currentTarget.note}
            </p>
          </div>

          <div className="small text-muted" style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>
            <i className="bi bi-info-circle me-1 text-primary"></i>
            <strong>SOP-Begründung für wache Patienten:</strong> Wache Patienten tolerieren physiologisch höhere Druckwerte bei Lagewechseln. Die höhere Einstellung schützt vor unkontrollierter Überdrainage bei selbstständiger Mobilisation oder Hustenstößen.
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: Nullen ohne Diskonnektion (4 SOP-Schritte) */}
      {activeTab === 'zeroing' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <div className="d-flex justify-content-between align-items-center mb-2.5">
            <h6 className="fw-bold mb-0 text-dark small">
              <i className="bi bi-sliders me-1 text-primary"></i>Nullpunktabgleich ohne Diskonnektion (VentrEX®)
            </h6>
            <span className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success small" style={{ fontSize: '0.68rem' }}>
              100% Steril • Kein Infektionsrisiko
            </span>
          </div>

          {/* Step Indicator Tabs */}
          <div className="d-flex gap-1.5 mb-3">
            {[1, 2, 3, 4].map((step) => (
              <button
                key={step}
                type="button"
                className={`btn btn-sm rounded-pill flex-grow-1 fw-bold ${zeroStep === step ? 'btn-primary text-white shadow-xs' : 'btn-outline-secondary bg-white text-muted'}`}
                style={{ fontSize: '0.72rem', padding: '4px 8px' }}
                onClick={() => setZeroStep(step)}
              >
                Schritt {step}
              </button>
            ))}
          </div>

          {/* Active Step Content */}
          <div className="card rounded-3 p-3 bg-white border shadow-2xs mb-2">
            {zeroStep === 1 && (
              <div>
                <span className="badge rounded-pill bg-danger text-white mb-1.5 small">Schritt 1 von 4</span>
                <h6 className="fw-black text-dark mb-1">Gelben Monitoring-Hahn (2) zum Patienten schließen</h6>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                  Der gelbe Dreiwegehahn (2) direkt proximal der Druckmesseinheit [E] wird in Richtung des Patienten gedreht (Pfeil / geschlossener Schenkel zum Kopf). Dadurch ist der Patient während der Kalibrierung sicher vom System entkoppelt.
                </p>
                <div className="p-2 rounded-2 bg-light border small text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i>Zweck: Druckwandler wird isoliert, kein Druckstoß zum Patienten möglich.
                </div>
              </div>
            )}

            {zeroStep === 2 && (
              <div>
                <span className="badge rounded-pill bg-primary text-white mb-1.5 small">Schritt 2 von 4</span>
                <h6 className="fw-black text-dark mb-1">Druckwandlerhahn (3) zur Abtropfkammer öffnen</h6>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                  Der Dreiwegehahn (3) am Druckaufnehmer wird so gestellt, dass der Transducer [E] in offener Flüssigkeitsverbindung mit dem Zuleitungsschlauch der Abtropfkammer [B] steht.
                </p>
                <div className="p-2 rounded-2 bg-light border small text-muted">
                  <i className="bi bi-info-circle text-primary me-1"></i>Zweck: Die Flüssigkeitssäule der Tropfkammer wird als hydrostatischer Null-Referenzpfad genutzt.
                </div>
              </div>
            )}

            {zeroStep === 3 && (
              <div>
                <span className="badge rounded-pill bg-success text-white mb-1.5 small">Schritt 3 von 4</span>
                <h6 className="fw-black text-dark mb-1">Abtropfbehälter [B] auf 0 cm hängen &amp; Monitor nullen</h6>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                  Abtropfbehälter [B] an der Aufhängevorrichtung [A] vorübergehend exakt auf die <strong>0-cm-Linie der Messskala</strong> absenken (befindet sich auf Höhe des Tragus). Am Intensivmonitor die Taste <strong>„Zero / Nullabgleich“</strong> drücken, bis 0 mmHg bestätigt wird.
                </p>
                <div className="p-2 rounded-2 bg-success bg-opacity-10 border border-success small text-success">
                  <i className="bi bi-check-circle-fill me-1"></i>Monitor ist nun exakt kalibriert – vollkommen steril ohne jede Diskonnektion!
                </div>
              </div>
            )}

            {zeroStep === 4 && (
              <div>
                <span className="badge rounded-pill bg-purple text-white mb-1.5 small" style={{ backgroundColor: '#7c3aed' }}>Schritt 4 von 4</span>
                <h6 className="fw-black text-dark mb-1">Abtropfkammer re-justieren &amp; Gelben Hahn (2) öffnen</h6>
                <p className="small text-secondary mb-2" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>
                  Abtropfbehälter [B] wieder auf die ärztlich verordnete Höhe (Standard: <strong>+10 cm</strong> über Tragus) arretieren. Druckwandlerhahn (3) auf geschlossene Drainage / ICP-Messung stellen. Gelben Monitoring-Hahn (2) wieder zum Patienten öffnen.
                </p>
                <div className="p-2 rounded-2 bg-light border small text-muted">
                  <i className="bi bi-activity text-primary me-1"></i>ICP-Monitoring läuft wieder regulär mit pulssynchroner Wellenform.
                </div>
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm rounded-pill px-3 py-1"
              disabled={zeroStep === 1}
              onClick={() => setZeroStep(Math.max(1, zeroStep - 1))}
              style={{ fontSize: '0.74rem' }}
            >
              <i className="bi bi-arrow-left me-1"></i>Zurück
            </button>
            <span className="small text-muted" style={{ fontSize: '0.72rem' }}>Schritt {zeroStep} von 4</span>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-pill px-3 py-1"
              disabled={zeroStep === 4}
              onClick={() => setZeroStep(Math.min(4, zeroStep + 1))}
              style={{ fontSize: '0.74rem' }}
            >
              Weiter<i className="bi bi-arrow-right ms-1"></i>
            </button>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: Hahnschema (1–4) & Systemkomponenten */}
      {activeTab === 'valves' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <h6 className="fw-bold mb-2.5 text-dark small">
            <i className="bi bi-diagram-2 me-1 text-primary"></i>VentrEX® Hahnschema &amp; Systemkomponenten
          </h6>

          <div className="row g-2 mb-2">
            <div className="col-sm-6">
              <div className="p-2.5 rounded-3 bg-white border h-100">
                <span className="badge rounded-pill bg-secondary text-white mb-1" style={{ fontSize: '0.66rem' }}>Hahn (1)</span>
                <strong className="d-block small text-dark">Systemport (Spülanschluss)</strong>
                <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>
                  Liegt vor der Druckmesseinheit. Nur zum Spülen <em>vom Kopf weg</em> zur Abtropfkammer (Einlass ≥ 30 s desinfizieren).
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-2.5 rounded-3 bg-white border h-100" style={{ borderColor: '#7c3aed' }}>
                <span className="badge rounded-pill text-white mb-1" style={{ backgroundColor: '#7c3aed', fontSize: '0.66rem' }}>Hahn (2) – GELB</span>
                <strong className="d-block small text-dark">Monitoring-3-Wege-Hahn</strong>
                <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>
                  Direkt vor Transducer [E]. Bildet den <strong>Nullpunkt</strong> auf Höhe <strong>Tragus = Foramen Monroi</strong>. Bei jeder Lagerung re-nivellieren!
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-2.5 rounded-3 bg-white border h-100">
                <span className="badge rounded-pill bg-primary text-white mb-1" style={{ fontSize: '0.66rem' }}>Hahn (3)</span>
                <strong className="d-block small text-dark">Druckwandlerhahn</strong>
                <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>
                  Schaltet zwischen <em>ICP-Messung</em> (Drainage geschlossen) und <em>intermittierender Entlastung</em> (Drainage offen) um.
                </p>
              </div>
            </div>

            <div className="col-sm-6">
              <div className="p-2.5 rounded-3 bg-white border h-100">
                <span className="badge rounded-pill bg-success text-white mb-1" style={{ fontSize: '0.66rem' }}>Hahn (4) &amp; Clip [C]</span>
                <strong className="d-block small text-dark">Kammerentleerung &amp; Beutel</strong>
                <p className="text-muted mb-0" style={{ fontSize: '0.72rem', lineHeight: '1.3' }}>
                  Hahn (4) leert Tropfkammer [B] stündlich in Ablaufbeutel [D] (nur bei Hahn 3 zu!). Klemme [C] ist Einweg-Clip (nur bei Beutelwechsel!).
                </p>
              </div>
            </div>
          </div>

          <div className="p-2 rounded-2 bg-white border small text-muted" style={{ fontSize: '0.72rem' }}>
            <strong>Komponenten:</strong> [A] Aufhängevorrichtung mit Skala • [B] Abtropfbehälter mit Filter • [C] Klemme • [D] Ablaufbeutel • [E] Integrierter VentrEX® Transducer
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: Kompetenzgrenzen (Pflege vs. Arzt) */}
      {activeTab === 'competence' && (
        <div className="p-3 bg-light rounded-4 border mb-2">
          <h6 className="fw-bold mb-2.5 text-dark small">
            <i className="bi bi-shield-shaded me-1 text-primary"></i>SOP-Kompetenzgrenzen &amp; Patientensicherheit
          </h6>

          <div className="row g-2">
            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-success h-100">
                <div className="d-flex align-items-center gap-1.5 mb-2">
                  <i className="bi bi-check-circle-fill text-success fs-5"></i>
                  <strong className="text-success small">Aufgaben der Intensivpflege</strong>
                </div>
                <ul className="mb-0 ps-3 small text-secondary" style={{ fontSize: '0.74rem', lineHeight: '1.4' }}>
                  <li>Exakte Tragus-Nivellierung des gelben Hahns (2) am Bettstativ</li>
                  <li>Re-Nivellierung nach JEDEM Positionswechsel des Patienten</li>
                  <li>Nullen ohne Diskonnektion über die 0-cm-Skala</li>
                  <li>Zwingendes Verriegeln vor Betten-/Kopfteilverstellung</li>
                  <li>Intermittierendes Ablassen bei ICP &gt; Grenze (max. 5–10 ml)</li>
                  <li>Stündliche PDMS-Dokumentation &amp; Kammerentleerung</li>
                  <li>Spülen ausschließlich <em>vom Kopf weg</em> zur Tropfkammer via Hahn (1)</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 rounded-3 bg-white border border-danger h-100">
                <div className="d-flex align-items-center gap-1.5 mb-2">
                  <i className="bi bi-slash-circle-fill text-danger fs-5"></i>
                  <strong className="text-danger small">STRENGSTENS NUR ARZT</strong>
                </div>
                <ul className="mb-0 ps-3 small text-secondary" style={{ fontSize: '0.74rem', lineHeight: '1.4' }}>
                  <li className="text-danger fw-bold">Spülen in Richtung Ventrikel (zum Kopf hin) ist PFLEGENDEN STRIKT UNTERSAGT!</li>
                  <li className="text-danger fw-bold">Aspirieren am EVD-System / Katheter ist PFLEGENDEN STRIKT UNTERSAGT!</li>
                  <li>Anordnung kontinuierlicher Drainage (nur im begründeten Ausnahmefall)</li>
                  <li>Festlegung und Änderung individueller ICP-Zielgrenzen</li>
                  <li>Sterile Liquorpunktion zur mikrobiologischen Diagnostik</li>
                  <li>Entscheidung über Katheterwechsel bei Okklusion</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Footer Quick Reminder Pill */}
      <div className="p-2.5 bg-light rounded-3 border d-flex align-items-center justify-content-between flex-wrap gap-2 small">
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-crosshair2 text-primary fs-5"></i>
          <span><strong>Landmarke:</strong> Tragus des Ohres = Foramen Monroi (Laserwaage am gelben Hahn 2)</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="bi bi-lock-fill text-danger fs-5"></i>
          <span><strong>Regel:</strong> Drainage regulär GESCHLOSSEN • Intermittierend max. 5–10 ml</span>
        </div>
      </div>
    </div>
  );
}



// -------------------------------------------------------------
// Component: Client-Side PDF Exporter (html2pdf integration)
// -------------------------------------------------------------
function exportStandardA4Pdf(std, showToast) {
  const printSheet = document.getElementById(`pocketcard-a4-print-${std.id}`);
  if (!printSheet) {
    window.print();
    return;
  }

  // Save all previous styles
  const prevDisplay = printSheet.style.display;
  const prevPosition = printSheet.style.position;
  const prevWidth = printSheet.style.width;
  const prevMaxWidth = printSheet.style.maxWidth;
  const prevMargin = printSheet.style.margin;
  const prevBackground = printSheet.style.background;

  // Render in normal document flow centered at exactly 794px width (prevents clipping & offsets)
  printSheet.style.display = 'block';
  printSheet.style.position = 'relative';
  printSheet.style.width = '794px';
  printSheet.style.maxWidth = '794px';
  printSheet.style.margin = '0 auto';
  printSheet.style.background = '#ffffff';

  const restoreStyles = () => {
    printSheet.style.display = prevDisplay;
    printSheet.style.position = prevPosition;
    printSheet.style.width = prevWidth;
    printSheet.style.maxWidth = prevMaxWidth;
    printSheet.style.margin = prevMargin;
    printSheet.style.background = prevBackground;
  };

  const opt = {
    margin: [0, 0, 0, 0],
    filename: `Intensivstandard_${std.shortTitle}_DIN_A4.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
      width: 794,
      windowWidth: 794
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: 'legacy' }
  };

  if (window.html2pdf) {
    window.html2pdf().set(opt).from(printSheet).save().then(() => {
      restoreStyles();
      if (showToast) showToast('PDF erfolgreich heruntergeladen!');
    }).catch((err) => {
      restoreStyles();
      console.error('PDF error:', err);
      window.print();
    });
  } else {
    restoreStyles();
    window.print();
  }
}

// -------------------------------------------------------------
// Component: Dedicated Printable DIN A4 Sheet (Enriched Clinical Points)
// -------------------------------------------------------------
function StandardA4PrintSheet({ standard }) {
  const baseOrigin = (typeof window !== 'undefined' && window.location && window.location.origin && !window.location.origin.includes('localhost'))
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://intensivpflege-standards.web.app/';
  const normalizedBase = baseOrigin.endsWith('/') ? baseOrigin : `${baseOrigin}/`;
  const websiteDirectUrl = `${normalizedBase}#/${standard.id}`;

  return (
    <div className="pocketcard-a4-print-sheet" id={`pocketcard-a4-print-${standard.id}`}>
      {/* PAGE 1: AUFBAU, KLINISCHE PHASEN & KERN-HANDLUNGSSCHRITTE */}
      <div className="a4-std-page a4-std-page-1" id={`pocketcard-a4-page1-${standard.id}`}>
        {/* Spectrum Top Accent Bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #dc2626 0%, #16a34a 20%, #ea580c 40%, #7c3aed 60%, #0284c7 80%, #facc15 100%)' }} />

        {/* Header Bar */}
        <div className="a4-std-header-bar" style={{ backgroundColor: '#002b47', padding: '6px 14px' }}>
          <div className="d-flex align-items-center gap-2">
            <div className="rounded p-1 d-flex align-items-center justify-content-center text-white" style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', width: '26px', height: '26px' }}>
              <i className="bi bi-heart-pulse-fill" style={{ fontSize: '0.8rem' }}></i>
            </div>
            <div>
              <div className="fw-bold text-white text-uppercase" style={{ fontSize: '0.78rem', letterSpacing: '0.3px' }}>
                Klinische Intensivstandards &amp; Leitfäden
              </div>
              <div className="text-white-50" style={{ fontSize: '0.64rem' }}>
                Evidenzbasierte Verfahrensanweisungen &bull; Digitale Pflege-Pocketcard (DIN A4)
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge rounded-pill text-white px-2 py-0.5 fw-bold" style={{ backgroundColor: standard.accentColor, fontSize: '0.72rem' }}>
              <i className={`bi ${standard.icon} me-1`}></i> {standard.shortTitle}
            </span>
            <span className="badge bg-white text-dark fw-bold px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
              Seite 1 / 2
            </span>
          </div>
        </div>

        <div className="a4-std-body">
          {/* Title & Lead Box */}
          <div className="a4-std-title-box" style={{ borderLeftColor: standard.accentColor, padding: '5px 10px' }}>
            <div className="d-flex justify-content-between align-items-center mb-0.5">
              <div className="text-uppercase fw-bold text-primary small" style={{ fontSize: '0.64rem' }}>
                Intensivmedizinischer Standard &bull; Verfahrensanweisung ITS
              </div>
              <span className="badge bg-light text-secondary border px-1.5 py-0.5" style={{ fontSize: '0.60rem' }}>
                Stand: 2026
              </span>
            </div>
            <h4 className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.94rem', lineHeight: '1.2' }}>
              {standard.topic}
            </h4>
            <div className="text-secondary small" style={{ fontSize: '0.68rem', lineHeight: '1.25' }}>
              {standard.leadText}
            </div>
          </div>

          {/* Rationale: Patientensicherheit ITS */}
          {standard.whyImportant && standard.whyImportant.length > 0 && (
            <div className="p-1.5 rounded border bg-light" style={{ fontSize: '0.68rem' }}>
              <strong className="text-success d-flex align-items-center gap-1 mb-0.5" style={{ fontSize: '0.70rem' }}>
                <i className="bi bi-shield-check"></i>
                <span>{standard.id === 'arterie' ? 'WARUM IST DAS WICHTIG? (PATIENTENSICHERHEIT ITS)' : 'Warum ist das wichtig? (Patientensicherheit ITS):'}</span>
              </strong>
              <div className="row g-1">
                {standard.whyImportant.map((item, idx) => {
                  const hasNl = typeof item === 'string' && item.includes(String.fromCharCode(10));
                  const title = hasNl ? item.split(String.fromCharCode(10))[0] : item;
                  const desc = hasNl ? item.split(String.fromCharCode(10)).slice(1).join(' ') : null;
                  return (
                    <div key={idx} className="col-6 d-flex align-items-start gap-1">
                      <i className="bi bi-check2 text-success flex-shrink-0 mt-0.5" style={{ fontSize: '0.68rem' }}></i>
                      <div className="text-secondary" style={{ lineHeight: '1.2' }}>
                        {desc ? (
                          <>
                            <strong className="text-dark d-block" style={{ fontSize: '0.68rem' }}>{title}</strong>
                            <span style={{ fontSize: '0.64rem' }}>{desc}</span>
                          </>
                        ) : (
                          <span>{item}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Media & Scannable QR Code Row */}
          <div className="row g-1.5 align-items-stretch">
            <div className="col-12">
              <div className="p-1 border rounded-3 bg-white h-100 d-flex flex-column align-items-center justify-content-center">
                <img
                  src={standard.image}
                  alt={standard.topic}
                  className="w-100 rounded-2 border"
                  style={{ maxHeight: '125px', objectFit: 'contain' }}
                />
                <div className="text-muted mt-0.5 text-center font-monospace" style={{ fontSize: '0.60rem' }}>
                  Gerätekonfiguration &amp; Praxisaufbau ({standard.shortTitle})
                </div>
              </div>
            </div>

            {(!['beatmung', 'befeuchtung-invasiv', 'arterie', 'evd', 'hfnc'].includes(standard.id)) && (
              <div className="col-5">
                <div className="p-1.5 border rounded-3 bg-light text-center h-100 d-flex flex-column align-items-center justify-content-center">
                  <div className="fw-bold text-dark small text-uppercase mb-0.5" style={{ fontSize: '0.62rem' }}>
                    <i className="bi bi-qr-code text-primary me-1"></i>Direkt-Simulator
                  </div>
                  <div className="p-1 bg-white border rounded shadow-2xs d-inline-flex align-items-center justify-content-center" style={{ maxWidth: '100%' }}>
                    <QrCodeCanvas
                      value={websiteDirectUrl}
                      size={80}
                      color={standard.accentColor}
                      className="mx-auto"
                      style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1 / 1' }}
                    />
                  </div>
                  <div className="text-muted font-monospace mt-0.5" style={{ fontSize: '0.59rem', lineHeight: '1.15' }}>
                    Mit Smartphone scannen &bull; Interaktive Ansicht &amp; Check
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Phasen / Aufbau des Doppelschlauchsystems (ELISA 600) */}
          {standard.clinicalFocus && standard.clinicalFocus.length > 0 && (
            <div className="p-1.5 border rounded-3 bg-white">
              <div className="fw-bold text-dark small text-uppercase mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.68rem' }}>
                <i className="bi bi-diagram-3-fill text-primary"></i>
                <span>{standard.id === 'beatmung' ? 'Aufbau Doppelschlauchsystem (ELISA 600):' : '4 Strukturierte Phasen der Verfahrensanweisung:'}</span>
              </div>
              <div className="row g-1">
                {standard.clinicalFocus.map((f, idx) => (
                  <div key={idx} className={standard.id === 'beatmung' ? 'col-4' : 'col-6'}>
                    <div className="p-1 rounded border bg-light h-100" style={{ fontSize: '0.66rem', borderLeft: `3px solid ${f.color || standard.accentColor}` }}>
                      <strong className="text-dark d-block text-truncate mb-0.5" style={{ fontSize: '0.68rem' }}>
                        <i className={`bi ${f.icon || 'bi-check-circle'} me-1 text-primary`}></i>
                        {f.phase}
                      </strong>
                      <span className="text-secondary" style={{ fontSize: '0.63rem', lineHeight: '1.15', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {f.detail}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {standard.id === 'beatmung' && standard.goldenRule && (
                <div className="mt-1 p-1 px-1.5 rounded border small d-flex align-items-center gap-1.5" style={{ background: '#fef3c7', borderColor: '#fde68a', fontSize: '0.64rem' }}>
                  <i className="bi bi-lightbulb-fill text-warning flex-shrink-0"></i>
                  <span className="text-dark"><strong>GOLDENE REGEL:</strong> {standard.goldenRule}</span>
                </div>
              )}
            </div>
          )}

          {/* Wichtigste Handlungsschritte (Minimal-Info) */}
          <div className="p-1.5 bg-light rounded-3 border">
            <div className="fw-bold text-dark small text-uppercase mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.68rem' }}>
              <i className="bi bi-list-check text-primary"></i>
              <span>{standard.id === 'arterie' || standard.id === 'beatmung' ? 'WICHTIGSTE HANDLUNGSSCHRITTE (MINIMAL-INFO)' : 'Wichtigste Handlungsschritte (Minimal-Info):'}</span>
            </div>
            <div className="d-flex flex-column gap-0.5">
              {standard.keyPoints && standard.keyPoints.slice(0, 6).map((pt, i) => {
                const hasNl = typeof pt === 'string' && pt.includes(String.fromCharCode(10));
                const title = hasNl ? pt.split(String.fromCharCode(10))[0] : null;
                const desc = hasNl ? pt.split(String.fromCharCode(10)).slice(1).join(' ') : pt;
                return (
                  <div key={i} className="p-0.5 px-1.5 rounded bg-white border small d-flex align-items-start gap-1" style={{ fontSize: '0.67rem' }}>
                    <span className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 mt-0.5" style={{ width: '15px', height: '15px', backgroundColor: standard.accentColor, fontSize: '0.58rem' }}>
                      {i + 1}
                    </span>
                    <div style={{ lineHeight: '1.2' }}>
                      {title ? (
                        <>
                          <strong className="text-dark d-block" style={{ fontSize: '0.68rem' }}>{title}</strong>
                          <span className="text-secondary" style={{ fontSize: '0.64rem' }}>{desc}</span>
                        </>
                      ) : (
                        <span>{pt}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {standard.id === 'arterie' && standard.goldenRule && (
              <div className="mt-1 p-1 px-1.5 rounded border small d-flex align-items-center gap-1.5" style={{ background: '#fffbeb', borderColor: '#fde68a', fontSize: '0.63rem' }}>
                <i className="bi bi-exclamation-triangle-fill text-danger flex-shrink-0"></i>
                <span className="text-dark"><strong>GOLDENE REGEL:</strong> {standard.goldenRule}</span>
              </div>
            )}
          </div>
        </div>

        {/* Page 1 Footer Bar */}
        <div className="a4-std-page-footer" style={{ padding: '5px 14px' }}>
          <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.64rem' }}>
            <span>Klinische Intensivpflege &bull; QM-System</span>
            <span>Gültiger Stand: 2026 &bull; Seite 1 / 2</span>
          </div>
        </div>
      </div>

      {/* Explicit Page Break for HTML2PDF & Print */}
      <div className="html2pdf__page-break" style={{ pageBreakAfter: 'always', breakAfter: 'page' }}></div>

      {/* PAGE 2: SICHERHEITS-CHECKLISTE, RICHTWERTE, TROUBLESHOOTING & QM-FREIGABE */}
      <div className="a4-std-page a4-std-page-2" id={`pocketcard-a4-page2-${standard.id}`}>
        {/* Spectrum Top Accent Bar */}
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #dc2626 0%, #16a34a 20%, #ea580c 40%, #7c3aed 60%, #0284c7 80%, #facc15 100%)' }} />

        {/* Header Bar */}
        <div className="a4-std-header-bar" style={{ backgroundColor: '#002b47', padding: '6px 14px' }}>
          <div className="fw-bold text-white small d-flex align-items-center gap-2" style={{ fontSize: '0.78rem' }}>
            <i className={`bi ${standard.icon}`}></i>
            <span>{standard.topic} (Fortsetzung &amp; Checkliste)</span>
          </div>
          <div className="d-flex align-items-center gap-1.5">
            <span className="badge rounded-pill text-white px-2 py-0.5 fw-bold" style={{ backgroundColor: standard.accentColor, fontSize: '0.68rem' }}>
              {standard.shortTitle}
            </span>
            <span className="badge bg-white text-dark fw-bold px-2 py-0.5" style={{ fontSize: '0.65rem' }}>
              Seite 2 / 2
            </span>
          </div>
        </div>

        <div className="a4-std-body">
          {/* 1. Schicht-Sicherheits-Checkliste */}
          <div className="p-1.5 bg-white border rounded-3">
            <div className="fw-bold text-dark small text-uppercase mb-1 d-flex align-items-center justify-content-between">
              <span><i className="bi bi-clipboard2-check text-success me-1"></i>Schicht-Sicherheits-Checkliste (ITS):</span>
              <span className="text-muted font-monospace" style={{ fontSize: '0.60rem' }}>Alle Punkte vor Freigabe prüfen</span>
            </div>
            <div className="row g-1">
              {standard.checklist && standard.checklist.map((item, idx) => (
                <div key={idx} className="col-6">
                  <div className="p-0.5 px-1 rounded border bg-light small d-flex align-items-center gap-1" style={{ fontSize: '0.65rem', minHeight: '22px' }}>
                    <span className="border rounded bg-white text-muted d-inline-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '12px', height: '12px', fontSize: '0.55rem' }}>
                      &#x25A2;
                    </span>
                    <span className="badge bg-secondary text-white py-0.5 px-1" style={{ fontSize: '0.55rem' }}>
                      {typeof item === 'object' ? (item.cat || 'ITS') : 'ITS'}
                    </span>
                    <span className="text-truncate" style={{ lineHeight: '1.15' }}>
                      {typeof item === 'object' ? item.text : item}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Troubleshooting, Alarme & Notfallmaßnahmen */}
          <div className="p-1.5 bg-white border rounded-3">
            <div className="fw-bold text-dark small text-uppercase mb-1 d-flex align-items-center gap-1" style={{ fontSize: '0.68rem' }}>
              <i className="bi bi-exclamation-triangle-fill text-danger"></i>
              <span>Troubleshooting &amp; Notfallmaßnahmen:</span>
            </div>
            <div className="d-flex flex-column gap-0.5">
              {standard.troubleshooting && standard.troubleshooting.map((t, idx) => (
                <div key={idx} className="p-1 px-1.5 border rounded bg-light small" style={{ fontSize: '0.66rem', borderLeft: '3px solid #dc2626' }}>
                  <div className="d-flex align-items-center justify-content-between mb-0.5">
                    <strong className="text-danger" style={{ fontSize: '0.67rem' }}>
                      <i className="bi bi-bell-fill me-1"></i>{t.problem}
                    </strong>
                    <span className="badge bg-danger bg-opacity-10 text-danger" style={{ fontSize: '0.58rem' }}>Alarm</span>
                  </div>
                  <div className="text-secondary mb-0.5" style={{ fontSize: '0.64rem', lineHeight: '1.2' }}>
                    <strong>Ursache:</strong> {t.cause}
                  </div>
                  <div className="text-dark" style={{ fontSize: '0.65rem', lineHeight: '1.2' }}>
                    <strong className="text-primary">&rarr; Sofortmaßnahme:</strong> {t.action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. QM-Schichtkontrolle & Dokumentationsfeld (Sign-off) */}
          <div className="p-1.5 rounded-3 border bg-light">
            <div className="fw-bold text-dark small text-uppercase mb-0.5" style={{ fontSize: '0.64rem' }}>
              <i className="bi bi-pen-fill text-secondary me-1"></i>QM-Dokumentation &amp; Schichtkontrolle (Handzeichen):
            </div>
            <div className="row g-1 small" style={{ fontSize: '0.65rem' }}>
              <div className="col-5">
                <div className="p-1 border rounded bg-white text-muted">
                  Prüfung durchgeführt: __________________
                </div>
              </div>
              <div className="col-4">
                <div className="p-1 border rounded bg-white text-muted">
                  Datum / Zeit: ___________________
                </div>
              </div>
              <div className="col-3">
                <div className="p-1 border rounded bg-white text-muted">
                  Visum: ___________
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page 2 Footer Bar */}
        <div className="a4-std-page-footer" style={{ padding: '5px 14px' }}>
          <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.64rem' }}>
            <span>QM-Dokumentation Intensivpflege &bull; Gültig für alle Intensivstationen</span>
            <span>Seite 2 / 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: BeautifiedPocketcard (Interactive Screen Pocketcard)
// -------------------------------------------------------------
function BeautifiedPocketcard({ standard, onCopy, onDownloadQr, onDownloadPdf }) {
  const [previewImage, setPreviewImage] = useState(null);

  const websiteDirectUrl = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? `${window.location.origin}${window.location.pathname}#/${standard.id}`
    : `https://intensivpflege-standards.web.app/#/${standard.id}`;

  return (
    <div className="mb-4">
      {/* Hidden dedicated print sheet */}
      <StandardA4PrintSheet standard={standard} />

      {/* Screen Pocketcard View */}
      <div className="pocketcard-printable-view pocketcard-screen-view shadow-md rounded-4 overflow-hidden border" id={`pocketcard-${standard.id}`} style={{ borderColor: `${standard.accentColor}40` }}>
        {/* Hospital Header Bar */}
        <div className="pocketcard-print-header flex-wrap gap-2 p-3 ps-3.5 ps-sm-3.5 p-sm-3.5" style={{ background: standard.bannerGradient || 'linear-gradient(135deg, #001a2e 0%, #0369a1 100%)' }}>
          <div className="d-flex align-items-center gap-2.5 gap-sm-3 min-w-0 ps-1 ps-sm-0">
            <div className="rounded-3 p-2 shadow-sm d-flex align-items-center justify-content-center text-white flex-shrink-0 ms-1 ms-sm-0" style={{ background: 'rgba(255, 255, 255, 0.22)', width: '42px', height: '42px', backdropFilter: 'blur(4px)' }}>
              <i className={`bi ${standard.icon || 'bi-heart-pulse-fill'} fs-5`}></i>
            </div>
            <div className="min-w-0">
              <div className="fw-black text-white text-uppercase text-truncate" style={{ fontSize: '0.92rem', letterSpacing: '0.4px' }}>
                Klinische Intensivstandards
              </div>
              <div className="text-white text-opacity-80 text-truncate" style={{ fontSize: '0.72rem' }}>
                Evidenzbasierte Leitfäden &bull; QM-Geprüft 2026
              </div>
            </div>
          </div>

          <div className="ms-auto flex-shrink-0">
            <span className="badge rounded-pill bg-white px-3 py-1.5 fw-bold shadow-2xs" style={{ color: standard.accentColor, fontSize: '0.82rem' }}>
              <i className={`bi ${standard.icon} me-1.5`}></i>{standard.shortTitle}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-3 ps-3.5 ps-sm-4 p-sm-4" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 pb-2 border-bottom gap-2 ps-1 ps-sm-0">
            <div>
              <span className="badge rounded-pill fw-bold text-uppercase px-2.5 py-1 mb-1 shadow-2xs d-inline-flex align-items-center gap-1" style={{ backgroundColor: `${standard.accentColor}18`, color: standard.accentColor, border: `1px solid ${standard.accentColor}38`, fontSize: '0.72rem' }}>
                <i className="bi bi-shield-check"></i>Verfahrensanweisung &amp; Gerätestandard
              </span>
              <h4 className="fw-black mb-0 text-dark" style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.45rem)', letterSpacing: '0.2px' }}>
                {standard.topic}
              </h4>
            </div>
            <span className="badge rounded-pill px-2.5 py-1 small fw-semibold shadow-2xs" style={{ backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>
              Version {standard.version || '004'} &bull; Gültig ITS
            </span>
          </div>

          {/* Photo Strip with Click-to-Zoom */}
          <div className="row g-3 mb-3">
            <div className="col-12">
              <div className="clinical-picture-card shadow-sm rounded-4 overflow-hidden border" style={{ borderColor: `${standard.accentColor}35` }}>
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom" style={{ background: `linear-gradient(135deg, ${standard.accentColor}12 0%, #ffffff 100%)` }}>
                  <span className="fw-bold text-dark d-flex align-items-center gap-2 small">
                    <span className="rounded-circle p-1 d-inline-flex align-items-center justify-content-center text-white" style={{ width: '22px', height: '22px', backgroundColor: standard.accentColor }}>
                      <i className="bi bi-camera-fill" style={{ fontSize: '0.68rem' }}></i>
                    </span>
                    <span>Klinische Geräteausstattung &amp; Praxisaufbau</span>
                  </span>
                  <span className="badge bg-white text-secondary border px-2.5 py-1 small rounded-pill shadow-2xs" style={{ cursor: 'pointer' }} onClick={() => setPreviewImage({ src: standard.image, title: standard.topic })}>
                    <i className="bi bi-zoom-in me-1 text-primary"></i>Vergrößern
                  </span>
                </div>

                <div
                  className="p-2 text-center bg-white d-flex align-items-center justify-content-center position-relative"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPreviewImage({ src: standard.image, title: standard.topic, subtitle: standard.leadText })}
                  title="Klicken für Vollbildansicht"
                >
                  <img
                    src={standard.image}
                    alt={standard.topic}
                    className="img-fluid rounded-3 shadow-xs"
                    style={{ maxHeight: '380px', width: '100%', objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 end-0 m-3 no-print">
                    <span className="badge text-white rounded-pill px-3 py-1.5 shadow-sm" style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', fontSize: '0.75rem' }}>
                      <i className="bi bi-arrows-fullscreen me-1.5"></i>Vollbild
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal-Info & QR-Code Row */}
          <div className="row g-3 align-items-stretch mb-3">
            <div className="col-12">
              <div
                className="p-3.5 rounded-4 border h-100 d-flex flex-column justify-content-between shadow-2xs"
                style={{
                  background: `linear-gradient(135deg, #ffffff 0%, ${standard.accentColor}06 50%, ${standard.accentColor}12 100%)`,
                  borderColor: `${standard.accentColor}35`
                }}
              >
                <div>
                  {standard.whyImportant && (
                    <div className="p-3 mb-2.5 rounded-3 border shadow-2xs" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', borderLeft: '5px solid #16a34a', borderColor: '#86efac' }}>
                      <div className="fw-bold text-success small mb-2 d-flex align-items-center gap-1.5">
                        <span className="rounded-circle p-1 d-inline-flex align-items-center justify-content-center text-white" style={{ width: '22px', height: '22px', backgroundColor: '#16a34a' }}>
                          <i className="bi bi-shield-check" style={{ fontSize: '0.75rem' }}></i>
                        </span>
                        <span style={{ fontSize: '0.86rem' }}>{standard.id === 'arterie' ? 'WARUM IST DAS WICHTIG? (PATIENTENSICHERHEIT ITS)' : 'Warum ist das wichtig? (Patientensicherheit ITS):'}</span>
                      </div>
                      <div className="row g-2 small text-dark">
                        {standard.whyImportant.map((why, wi) => {
                          const whyIcons = [
                            { icon: 'bi-shield-check', color: '#16a34a', bg: '#dcfce7', border: '#86efac' },
                            { icon: 'bi-heart-pulse-fill', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
                            { icon: 'bi-activity', color: '#0284c7', bg: '#e0f2fe', border: '#7dd3fc' },
                            { icon: 'bi-exclamation-triangle-fill', color: '#ea580c', bg: '#ffedd5', border: '#fdba74' },
                            { icon: 'bi-check2-all', color: '#7c3aed', bg: '#f3e8ff', border: '#d8b4fe' },
                            { icon: 'bi-droplet-half', color: '#0891b2', bg: '#cffafe', border: '#67e8f9' }
                          ];
                          const wStyle = whyIcons[wi % whyIcons.length];
                          const hasNl = typeof why === 'string' && why.includes(String.fromCharCode(10));
                          const title = hasNl ? why.split(String.fromCharCode(10))[0] : why;
                          const desc = hasNl ? why.split(String.fromCharCode(10)).slice(1).join(' ') : null;
                          return (
                            <div key={wi} className="col-12 col-sm-6">
                              <div
                                className="p-2 rounded-2 border d-flex align-items-start gap-2 h-100 shadow-2xs"
                                style={{ backgroundColor: wStyle.bg, borderColor: wStyle.border }}
                              >
                                <span
                                  className="rounded-circle p-1 d-inline-flex align-items-center justify-content-center text-white flex-shrink-0 mt-0.5"
                                  style={{ width: '22px', height: '22px', backgroundColor: wStyle.color, boxShadow: `0 2px 4px ${wStyle.color}45` }}
                                >
                                  <i className={`bi ${wStyle.icon}`} style={{ fontSize: '0.7rem' }}></i>
                                </span>
                                <div style={{ fontSize: '0.82rem', lineHeight: '1.35', color: '#1e293b' }}>
                                  {desc ? (
                                    <>
                                      <div className="fw-bold text-dark mb-0.5" style={{ fontSize: '0.84rem' }}>{title}</div>
                                      <div className="text-secondary small" style={{ fontSize: '0.78rem', lineHeight: '1.3' }}>{desc}</div>
                                    </>
                                  ) : (
                                    <span style={{ fontWeight: 600 }}>{why}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="fw-bold text-dark small text-uppercase mb-2 d-flex align-items-center gap-1.5">
                    <i className="bi bi-list-check" style={{ color: standard.accentColor, fontSize: '1.05rem' }}></i>
                    <span>{standard.id === 'arterie' || standard.id === 'beatmung' ? 'WICHTIGSTE HANDLUNGSSCHRITTE (MINIMAL-INFO)' : 'Wichtigste Handlungsschritte (Minimal-Info):'}</span>
                  </div>
                  <div className="d-flex flex-column gap-2 mb-2">
                    {standard.keyPoints && standard.keyPoints.map((pt, i) => {
                      const stepPalette = [
                        { color: '#0284c7', bg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', border: '#bae6fd', icon: 'bi-gear-wide-connected', tag: 'Vorbereitung' },
                        { color: '#16a34a', bg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '#bbf7d0', icon: 'bi-shield-check', tag: 'Sicherheit' },
                        { color: '#ea580c', bg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)', border: '#fed7aa', icon: 'bi-sliders', tag: 'Einstellung' },
                        { color: '#dc2626', bg: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)', border: '#fecaca', icon: 'bi-bell-fill', tag: 'Alarme' },
                        { color: '#7c3aed', bg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)', border: '#ddd6fe', icon: 'bi-check2-circle', tag: 'Verifikation' },
                        { color: '#0891b2', bg: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 100%)', border: '#a5f3fc', icon: 'bi-clipboard-pulse', tag: 'Monitoring' }
                      ];
                      const sStyle = stepPalette[i % stepPalette.length];
                      return (
                        <div
                          key={i}
                          className="keypoint-item p-2.5 rounded-3 border small d-flex align-items-start gap-2.5 shadow-2xs"
                          style={{
                            fontSize: '0.84rem',
                            background: sStyle.bg,
                            borderLeft: `5px solid ${sStyle.color}`,
                            borderColor: sStyle.border
                          }}
                        >
                          <span
                            className="badge rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 mt-0.5"
                            style={{
                              width: '24px',
                              height: '24px',
                              backgroundColor: sStyle.color,
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              boxShadow: `0 2px 6px ${sStyle.color}45`
                            }}
                          >
                            {i + 1}
                          </span>
                          <div className="flex-grow-1 min-w-0">
                            <div className="d-flex align-items-center gap-1.5 mb-0.5">
                              <span
                                className="badge rounded-pill fw-bold text-uppercase shadow-2xs"
                                style={{
                                  backgroundColor: '#ffffff',
                                  color: sStyle.color,
                                  border: `1px solid ${sStyle.border}`,
                                  fontSize: '0.62rem',
                                  padding: '2px 6px'
                                }}
                              >
                                <i className={`bi ${sStyle.icon} me-1`}></i>Schritt {i + 1}
                              </span>
                            </div>
                            {typeof pt === 'string' && pt.includes(String.fromCharCode(10)) ? (
                              <div>
                                <strong className="d-block text-dark fw-bold mb-1" style={{ fontSize: '0.88rem' }}>
                                  {pt.split(String.fromCharCode(10))[0]}
                                </strong>
                                <span className="text-secondary d-block" style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                                  {pt.split(String.fromCharCode(10)).slice(1).join(' ')}
                                </span>
                              </div>
                            ) : (
                              <span style={{ lineHeight: '1.4', fontWeight: 500 }} className="text-dark d-block">
                                {pt}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {standard.id === 'arterie' && standard.goldenRule && (
                    <div
                      className="p-3 rounded-3 border shadow-2xs mt-2.5"
                      style={{
                        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 45%, #ffedd5 100%)',
                        borderColor: '#f59e0b',
                        borderLeft: '5px solid #dc2626'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-2">
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                            style={{ width: '24px', height: '24px', backgroundColor: '#dc2626', boxShadow: '0 2px 4px rgba(220, 38, 38, 0.4)' }}
                          >
                            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '0.75rem' }}></i>
                          </span>
                          <strong className="text-dark text-uppercase fw-bold" style={{ fontSize: '0.88rem', letterSpacing: '0.4px' }}>
                            ⚠️ GOLDENE REGEL
                          </strong>
                        </div>
                        <span className="badge bg-warning text-dark fw-bold px-2 py-0.5 rounded-pill shadow-2xs" style={{ fontSize: '0.64rem' }}>
                          STRIKT EINHALTEN
                        </span>
                      </div>
                      <div className="text-dark fw-medium small ps-0.5" style={{ fontSize: '0.84rem', lineHeight: '1.45', color: '#1e293b' }}>
                        {standard.goldenRule}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2.5 border-top small text-muted d-flex align-items-center justify-content-between" style={{ fontSize: '0.72rem', borderColor: `${standard.accentColor}25` }}>
                  <span><i className="bi bi-info-circle me-1" style={{ color: standard.accentColor }}></i>QM-Verfahrensanweisung ITS</span>
                  <span className="fw-semibold text-dark">Evidenzbasierte Pflegepraxis</span>
                </div>
              </div>
            </div>

            {/* Right: Crisp Scannable Single QR Code (Hidden for all clinical standards) */}
            {(!['beatmung', 'befeuchtung-invasiv', 'arterie', 'evd', 'hfnc'].includes(standard.id)) && (
              <div className="col-lg-5 col-md-6">
                <div
                  className="p-3.5 rounded-4 border h-100 text-center d-flex flex-column align-items-center justify-content-between shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, #ffffff 0%, ${standard.accentColor}08 50%, ${standard.accentColor}15 100%)`,
                    borderColor: `${standard.accentColor}40`
                  }}
                >
                  <div className="small fw-bold text-uppercase mb-2 d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-white shadow-2xs border" style={{ color: standard.accentColor, borderColor: `${standard.accentColor}35` }}>
                    <i className="bi bi-qr-code"></i>
                    <span>Pocketcard scannen</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-3 border shadow-sm my-1 d-inline-flex align-items-center justify-content-center" style={{ borderColor: `${standard.accentColor}35`, maxWidth: '100%' }}>
                    <QrCodeCanvas
                      value={websiteDirectUrl}
                      size={130}
                      color={standard.accentColor}
                      className={`pocket-qr-${standard.id}`}
                      style={{ maxWidth: '100%', height: 'auto', aspectRatio: '1 / 1' }}
                    />
                  </div>

                  <div className="small text-muted font-monospace mt-1.5" style={{ fontSize: '0.72rem' }}>
                    <span><i className="bi bi-camera me-1"></i>Smartphone-Kamera auf QR-Code richten</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Toolbar: Colorful & Mobile-Optimized (Hidden for all clinical standards) */}
          {(!['beatmung', 'befeuchtung-invasiv', 'arterie', 'evd', 'hfnc'].includes(standard.id)) && (
            <div className="mt-3 pt-3 border-top no-print w-100 ps-1 ps-sm-0" data-html2canvas-ignore="true">
              <div className="row g-2 px-1 px-sm-0">
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-sm text-white rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ backgroundColor: standard.accentColor, borderColor: standard.accentColor, minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={() => onDownloadPdf(standard)}
                    title="Pocketcard als PDF-Datei speichern"
                  >
                    <i className="bi bi-file-earmark-arrow-down-fill"></i>
                    <span>PDF</span>
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-sm btn-dark rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem', backgroundColor: '#0f172a' }}
                    onClick={() => window.print()}
                    title="Drucken / Als PDF drucken"
                  >
                    <i className="bi bi-printer-fill"></i>
                    <span>Drucken</span>
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-sm rounded-pill py-2 px-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-1.5 bg-white w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem', borderColor: standard.accentColor, color: standard.accentColor }}
                    onClick={() => onDownloadQr(standard)}
                    title="QR-Code als Bilddatei speichern"
                  >
                    <i className="bi bi-qr-code"></i>
                    <span>QR-Bild</span>
                  </button>
                </div>
                <div className="col-6 col-sm-3">
                  <button
                    className="btn btn-sm btn-outline-secondary rounded-pill py-2 px-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-1.5 bg-white w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={() => onCopy(websiteDirectUrl, 'Link')}
                    title="Link kopieren"
                  >
                    <i className="bi bi-link-45deg fs-6 text-primary"></i>
                    <span>Link kopieren</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="modal show d-block no-print"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.85)', zIndex: 1080 }}
          onClick={() => setPreviewImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content border-0 rounded-4 overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header bg-dark text-white py-2 px-3">
                <h6 className="modal-title fw-bold mb-0 text-truncate">{previewImage.title}</h6>
                <button type="button" className="btn-close btn-close-white" onClick={() => setPreviewImage(null)}></button>
              </div>
              <div className="modal-body p-2 text-center bg-black">
                <img src={previewImage.src} alt={previewImage.title} className="img-fluid rounded-3" style={{ maxHeight: '80vh', objectFit: 'contain' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: StandardDetailPage (Assembles full interactive view)
// -------------------------------------------------------------
function StandardDetailPage({ standard, onNavigate, showToast }) {
  const allStandards = Object.values(UMF_STANDARDS);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  useEffect(() => {
    setActiveVideoIndex(0);
  }, [standard.id]);

  const hasMultipleVideos = Array.isArray(standard.videos) && standard.videos.length > 1;
  const currentVideo = hasMultipleVideos ? (standard.videos[activeVideoIndex] || standard.videos[0]) : null;

  const activeVideoUrl = (currentVideo && currentVideo.url) || standard.videoUrl;
  const activeVideoEmbedUrl = (currentVideo && currentVideo.embedUrl) || standard.videoEmbedUrl || (standard.id === 'hfnc' ? 'https://www.youtube.com/embed/4sgTiXiEaoI' : '');
  const activeVideoFile = (currentVideo && currentVideo.file) || standard.videoFile || null;
  const activeVideoTitle = (currentVideo && currentVideo.title) || standard.videoTitle;
  const activeVideoBadge = (currentVideo && currentVideo.deviceBadge) || standard.videoDeviceBadge || (standard.id === 'hfnc' ? 'Optiflow / HFNC • Intensivpflege' : '');

  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} kopiert!`);
    }).catch(() => {
      showToast('Kopieren fehlgeschlagen');
    });
  };

  const downloadQrImage = (std) => {
    const container = document.querySelector(`.pocket-qr-${std.id}`);
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
    a.download = `QR-Code-${std.shortTitle}-Intensivstandard.png`;
    a.click();
    showToast('QR-Code Bild heruntergeladen!');
  };

  const downloadPdf = (std) => {
    exportStandardA4Pdf(std, showToast);
  };

  return (
    <div>
      {/* Top Breadcrumb & Switcher (Desktop/Tablet Only) */}
      <div className="d-none d-md-flex flex-column gap-2.5 mb-3.5 no-print">
        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <a
            href="#/"
            className="btn-all-kacheln"
            title="Zurück zur Übersicht der 5 Intensivstandards"
          >
            <span className="icon-badge">
              <i className="bi bi-grid-fill"></i>
            </span>
            <span>Alle 5 Kacheln</span>
            <span className="back-arrow">
              <i className="bi bi-arrow-left"></i>
            </span>
          </a>

          {/* Grouped PDF & Print Button Pill */}
          <div className="btn-group shadow-sm rounded-pill overflow-hidden border border-primary border-opacity-25" role="group">
            <button
              className="btn btn-primary btn-sm px-3.5 py-1.5 fw-semibold d-flex align-items-center gap-1.5"
              style={{ minHeight: '42px', fontSize: '0.82rem' }}
              onClick={() => downloadPdf(standard)}
              title="Aktuelle Ansicht als PDF-Dokument herunterladen"
            >
              <i className="bi bi-file-earmark-arrow-down-fill"></i>
              <span>PDF herunterladen</span>
            </button>
            <button
              className="btn btn-dark btn-sm px-3.5 py-1.5 fw-semibold d-flex align-items-center gap-1.5 border-start border-white border-opacity-25"
              style={{ minHeight: '42px', fontSize: '0.82rem' }}
              onClick={() => window.print()}
              title="Drucken / Als PDF drucken"
            >
              <i className="bi bi-printer-fill"></i>
              <span>Drucken</span>
            </button>
          </div>
        </div>

        {/* Quick-switch pills for all 5 standards on desktop */}
        <div className="quick-switcher-bar w-100 py-1">
          {allStandards.map(s => {
            const isActive = s.id === standard.id;
            return (
              <button
                key={s.id}
                type="button"
                className={`quick-switcher-pill ${s.id} ${isActive ? 'active' : ''}`}
                style={
                  isActive
                    ? {
                        background: s.bannerGradient || s.accentColor,
                        borderColor: 'transparent',
                        color: '#ffffff',
                        boxShadow: `0 4px 14px ${s.accentColor}45`
                      }
                    : {
                        borderColor: `${s.accentColor}35`,
                        color: '#1e293b'
                      }
                }
                onClick={() => onNavigate(s.id)}
                title={isActive ? `${s.shortTitle} (Aktiv)` : `Zu ${s.shortTitle} wechseln`}
              >
                <span
                  className="icon-bubble"
                  style={{
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : (s.badgeBg || `${s.accentColor}15`),
                    color: isActive ? '#ffffff' : s.accentColor
                  }}
                >
                  <i className={`bi ${s.icon}`}></i>
                </span>
                <span>{s.shortTitle}</span>
                {isActive && (
                  <span
                    className="badge rounded-pill bg-white text-dark ms-1 shadow-2xs fw-bold text-uppercase"
                    style={{ fontSize: '0.62rem', padding: '2.5px 6.5px' }}
                  >
                    Aktiv
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. CLINICAL POCKETCARD SCREEN VIEW */}
      <BeautifiedPocketcard
        standard={standard}
        onCopy={copyToClipboard}
        onDownloadQr={downloadQrImage}
        onDownloadPdf={downloadPdf}
      />

      {/* 2. PRAXIS-SCHULUNGSVIDEO (WENN STANDARD EIN VIDEO BESITZT, Z.B. ELISA 600, AIRCON, COMBITRANS, VENTREX ODER OPTIFLOW) */}
      {(standard.videoUrl || hasMultipleVideos) && (
        <div
          className="card border shadow-sm rounded-4 p-3 ps-3.5 ps-sm-4 p-sm-4 pt-4 pt-sm-4 bg-white mb-4 no-print position-relative overflow-hidden"
          style={{ borderColor: 'rgba(220, 38, 38, 0.35)', boxShadow: '0 6px 24px rgba(220, 38, 38, 0.08)' }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #dc2626 0%, #ef4444 35%, #0284c7 100%)'
            }}
          />

          {/* Multiple Videos Segmented Selector Pill Bar */}
          {hasMultipleVideos && (
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3 pb-2.5 border-bottom flex-wrap ps-1 ps-sm-0">
              <div className="d-flex align-items-center gap-1.5">
                <span className="badge rounded-pill bg-danger text-white px-2.5 py-1 fw-bold shadow-2xs" style={{ fontSize: '0.70rem' }}>
                  <i className="bi bi-collection-play-fill me-1"></i>2 Schulungsvideos
                </span>
                <span className="small fw-bold text-dark" style={{ fontSize: '0.82rem' }}>
                  High-Flow / Optiflow Videoleitfaden:
                </span>
              </div>
              <div className="btn-group shadow-2xs rounded-pill p-0.5 bg-light border" role="group">
                {standard.videos.map((vid, vIdx) => (
                  <button
                    key={vIdx}
                    type="button"
                    className={`btn btn-sm rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5 transition-all ${
                      activeVideoIndex === vIdx
                        ? 'btn-danger text-white shadow-xs'
                        : 'btn-light text-dark border-0'
                    }`}
                    style={{ fontSize: '0.80rem' }}
                    onClick={() => setActiveVideoIndex(vIdx)}
                  >
                    <i className={activeVideoIndex === vIdx ? "bi bi-play-circle-fill" : "bi bi-play"}></i>
                    <span>{vid.tabTitle || `Video ${vIdx + 1}`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3.5 pb-3.5 border-bottom pt-2 pt-sm-1 ps-1 ps-sm-0">
            <div className="d-flex align-items-center gap-3 ps-1 ps-sm-0">
              <div
                className="rounded-3 p-2 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm ms-1 ms-sm-0"
                style={{
                  width: '42px',
                  height: '42px',
                  background: activeVideoFile ? `linear-gradient(135deg, ${standard.accentColor || '#0284c7'} 0%, ${standard.accentColor || '#0369a1'}dd 100%)` : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                  boxShadow: activeVideoFile ? `0 4px 12px ${standard.badgeBg || 'rgba(2, 132, 199, 0.35)'}` : '0 4px 12px rgba(220, 38, 38, 0.35)'
                }}
              >
                <i className={`bi ${activeVideoFile ? 'bi-play-circle-fill' : 'bi-youtube'} fs-4`}></i>
              </div>
              <div>
                <div className="d-flex align-items-center gap-2 flex-wrap mb-1 pt-1.5 pt-sm-0">
                  <span
                    className="badge rounded-pill fw-bold text-uppercase px-2.5 py-1 shadow-2xs"
                    style={{
                      backgroundColor: activeVideoFile ? (standard.badgeBg || '#e0f2fe') : '#fee2e2',
                      color: activeVideoFile ? (standard.accentColor || '#0369a1') : '#dc2626',
                      fontSize: '0.70rem',
                      border: activeVideoFile ? `1px solid ${standard.badgeBorder || '#bae6fd'}` : '1px solid #fecaca'
                    }}
                  >
                    <i className="bi bi-play-circle-fill me-1"></i>
                    {activeVideoFile ? 'Praxis-Lehrvideo' : 'Praxis-Schulungsvideo'}
                  </span>
                  <span className="badge rounded-pill fw-bold text-uppercase px-2.5 py-1 shadow-2xs bg-primary text-white" style={{ fontSize: '0.70rem' }}>
                    {activeVideoBadge || (standard.id === 'hfnc' ? 'Optiflow / HFNC • Intensivpflege' : (standard.id === 'evd' ? 'VentrEX® EVD • Intensivpflege' : (standard.id === 'arterie' ? 'Combitrans® • Intensivpflege' : (standard.id === 'befeuchtung-invasiv' ? 'AIRcon Gen2 • Intensivpflege' : 'elisa 600 • Intensivpflege'))))}
                  </span>
                </div>
                <h4 className="fw-black mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '1.2rem', letterSpacing: '0.2px' }}>
                  <span>{activeVideoTitle || (standard.id === 'hfnc' ? 'High-Flow (HFNC) | Geräteaufbau & Optiflow-Anwendung' : (standard.id === 'evd' ? 'Externe Ventrikeldrainage (EVD) | Nullabgleich & ICP-Monitoring' : (standard.id === 'arterie' ? 'Invasive arterielle Blutdruckmessung | Nullabgleich & Kurvenvalidierung' : (standard.id === 'befeuchtung-invasiv' ? 'AIRcon Atemgasbefeuchter | Geräteaufbau & Inbetriebnahme' : 'elisa 600 Beatmungsgerät: Geräteaufbau & Systemtest'))))}</span>
                </h4>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0 mb-2 mb-sm-0 ps-1 ps-sm-0">
              {activeVideoFile ? (
                <span className="badge rounded-pill px-3 py-1.5 fw-bold text-secondary bg-light border d-inline-flex align-items-center gap-1.5 shadow-2xs" style={{ fontSize: '0.78rem' }}>
                  <i className="bi bi-shield-check text-success"></i> Direkter HD-Stream
                </span>
              ) : (
                <a
                  href={activeVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm rounded-pill px-3.5 py-2 fw-bold d-inline-flex align-items-center gap-2 shadow-2xs transition-all ms-1 ms-sm-0"
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 100%)',
                    color: '#dc2626',
                    border: '1.5px solid #fca5a5',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.08)' ,
                    fontSize: '0.84rem',
                    letterSpacing: '0.2px'
                  }}
                >
                  <i className="bi bi-youtube fs-6 text-danger"></i>
                  <span className="text-danger fw-bold">In YouTube öffnen</span>
                  <i className="bi bi-box-arrow-up-right small text-danger opacity-75 ms-0.5" style={{ fontSize: '0.70rem' }}></i>
                </a>
              )}
            </div>
          </div>

          <div className="row g-3 align-items-stretch">
            <div className="col-12 col-lg-8">
              <div
                className="rounded-3 overflow-hidden shadow-sm border bg-black position-relative"
                style={{ aspectRatio: '16 / 9', width: '100%' }}
              >
                {activeVideoFile ? (
                  <video
                    key={activeVideoFile}
                    controls
                    playsInline
                    preload="metadata"
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000000', display: 'block' }}
                  >
                    <source src={activeVideoFile} type="video/mp4" />
                    Ihr Browser unterstützt das Video leider nicht.
                  </video>
                ) : (
                  <iframe
                    key={activeVideoEmbedUrl}
                    src={activeVideoEmbedUrl}
                    title={activeVideoTitle || 'High-Flow-Therapie Schulungsvideo'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ width: '100%', height: '100%', border: 'none' }}
                  ></iframe>
                )}
              </div>

              {/* Bottom Quick Switcher between the two videos */}
              {hasMultipleVideos && (
                <div className="mt-2.5 p-2 px-3 rounded-3 bg-light border d-flex align-items-center justify-content-between flex-wrap gap-2">
                  <span className="small text-secondary" style={{ fontSize: '0.78rem' }}>
                    <i className="bi bi-info-circle me-1" style={{ color: standard.accentColor || '#0284c7' }}></i>
                    Aktuell ausgewählt: <strong>{activeVideoIndex === 0 ? 'Teil 1: Aufbau & Schlauchsystem' : 'Teil 2: Optiflow-Nasenkanüle & Einstellung'}</strong>
                  </span>
                  <button
                    type="button"
                    className="btn btn-sm rounded-pill px-3 py-1 fw-bold d-inline-flex align-items-center gap-1.5 shadow-2xs transition-all"
                    style={{
                      fontSize: '0.76rem',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                      color: standard.accentColor || '#0284c7',
                      border: `1.5px solid ${standard.accentColor || '#0284c7'}`
                    }}
                    onClick={() => setActiveVideoIndex(activeVideoIndex === 0 ? 1 : 0)}
                  >
                    <span>{activeVideoIndex === 0 ? 'Zu Teil 2: Optiflow-Kanüle wechseln' : 'Zu Teil 1: Geräteaufbau wechseln'}</span>
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-4">
              <div
                className="p-3.5 p-sm-4 rounded-4 border h-100 d-flex flex-column justify-content-center shadow-sm"
                style={{
                  background: 'linear-gradient(160deg, #f0f9ff 0%, #ffffff 50%, #f1f5f9 100%)',
                  borderColor: '#bfdbfe',
                  boxShadow: '0 4px 20px rgba(37, 99, 235, 0.06)'
                }}
              >
                {/* Centered Stylish Header */}
                <div className="text-center mb-3">
                  <div className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-white border shadow-2xs mb-2" style={{ borderColor: '#bfdbfe' }}>
                    <i className="bi bi-play-circle-fill text-danger fs-6"></i>
                    <span className="fw-bold text-uppercase" style={{ fontSize: '0.72rem', letterSpacing: '0.5px', color: '#0369a1' }}>
                      Video-Leitfaden
                    </span>
                  </div>
                  <h5 className="fw-black text-dark mb-0.5" style={{ fontSize: '1.05rem', letterSpacing: '-0.2px' }}>
                    Schulungsschritte im Video
                  </h5>
                  <div className="text-secondary small" style={{ fontSize: '0.74rem' }}>
                    4 Kernschritte im Video-Ablauf
                  </div>
                </div>

                {/* Stylish Step Cards */}
                <div className="d-flex flex-column gap-2 justify-content-center my-auto">
                  {(standard.videoSteps || (standard.id === 'hfnc' ? [
                    { title: 'Befeuchterkammer & Aqua dest.', desc: 'Selbstfüllende Kammer einsetzen & Sterilwasser anschließen', color: '#ea580c' },
                    { title: 'Beheizter Atemschlauch', desc: 'AirSpiral™ Atemschlauch mit integrierter Heizung verbinden', color: '#0284c7' },
                    { title: 'Optiflow™ Nasenkanüle', desc: 'Größe wählen (max. 50 % der Nares verschließen), spannungsfrei anpassen', color: '#16a34a' },
                    { title: 'Fluss- & FiO₂-Titration', desc: 'Fluss (30–60 L/min) und Ziel-SpO₂ einstellen, ROX-Index nach 2/6/12 h berechnen', color: '#7c3aed' }
                  ] : (standard.id === 'evd' ? [
                    { title: 'Referenzpunkt Foramen Monroi', desc: 'Tragus / äußerer Gehörgang als Nullebene mit Laser-Nivellierer anvisieren', color: '#7c3aed' },
                    { title: 'Skaleneinstellung & Drainagehöhe', desc: 'Druckstufe in cmH₂O bzw. mmHg gemäß ärztlicher Anordnung arretieren', color: '#0284c7' },
                    { title: 'Tropfkammer & Dreiwegehahn', desc: 'Dreiwegehahn prüfen: Drainage regulär geöffnet oder zur ICP-Messung geschlossen', color: '#16a34a' },
                    { title: 'Liquormonitoring & Hygiene', desc: 'Abtropfmenge, Farbe dokumentieren & streng aseptischer Verbandswechsel', color: '#ea580c' }
                  ] : (standard.id === 'arterie' ? [
                    { title: 'Druckbeutel & Spülflasche', desc: 'NaCl 0,9 % blasenfrei entlüften, Manschette auf 300 mmHg aufpumpen', color: '#dc2626' },
                    { title: 'Druckaufnehmer entlüften', desc: 'Transducer & Dreiwegehähne im Uhrzeigersinn blasenfrei spülen', color: '#ea580c' },
                    { title: 'Phlebostatischer Nullpunkt', desc: 'Höhe 4. ICR / mittlerer Thoraxdurchmesser mit Laser/Wasserwaage nivellieren', color: '#0284c7' },
                    { title: 'Nullabgleich & Fast-Flush', desc: 'Dreiwegehahn öffnen, Nullabgleich am Monitor & Rechtecktest (Dämpfung)', color: '#16a34a' }
                  ] : (standard.id === 'befeuchtung-invasiv' ? [
                    { title: 'Befeuchterkammer & Wasserzufuhr', desc: 'Kammer einschieben, Sterilwasser-Infusion anschließen', color: '#0891b2' },
                    { title: 'Beheiztes Schlauchsystem', desc: 'Inspirations- & Exspirations-Heizdrähte anstecken', color: '#0284c7' },
                    { title: 'Temperaturfühler & Sonden', desc: 'Kammersensor & patientennahen Fühler korrekt platzieren', color: '#16a34a' },
                    { title: 'Inbetriebnahme & Invasiv-Modus', desc: 'Gerät einschalten, Modus „Invasiv (37°C)“ vorwärmen', color: '#7c3aed' }
                  ] : [
                    { title: 'ZGV-Anschluss (O₂ & Druckluft)', desc: 'Zentralgasversorgung & Stromanschluss prüfen', color: '#0284c7' },
                    { title: 'Aufbau Doppelschlauchsystem', desc: 'Inspirations- & Exspirationsfilter montieren', color: '#2563eb' },
                    { title: 'HMEF & Prüfstopfen', desc: 'Patientennahen Filter & roten Stopfen aufstecken', color: '#16a34a' },
                    { title: 'Pre-Use Gerätecheck', desc: 'Systemtest bis 100 % („bestanden“) abschließen', color: '#7c3aed' }
                  ]))))).map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 px-3 rounded-3 bg-white border shadow-2xs d-flex align-items-center gap-2.5"
                      style={{ borderLeft: `4px solid ${step.color}`, borderColor: '#e2e8f0' }}
                    >
                      <span
                        className="rounded-circle text-white d-inline-flex align-items-center justify-content-center flex-shrink-0 fw-bold shadow-2xs"
                        style={{ width: '26px', height: '26px', backgroundColor: step.color, fontSize: '0.76rem' }}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="fw-bold text-dark text-truncate" style={{ fontSize: '0.83rem', lineHeight: '1.25' }}>
                          {step.title}
                        </div>
                        <div className="text-secondary small text-truncate" style={{ fontSize: '0.74rem', lineHeight: '1.2' }}>
                          {step.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-3 pt-2 border-top text-muted small" style={{ fontSize: '0.70rem', borderColor: '#e2e8f0' }}>
                  <i className="bi bi-info-circle me-1 text-primary"></i>
                  <span>{standard.id === 'hfnc' ? 'Schritt-für-Schritt Aufbau & Optiflow-Anpassung vor Patientenkontakt' : (standard.id === 'evd' ? 'Schritt-für-Schritt Nivellierung & Liquormonitoring vor Patientenkontakt' : (standard.id === 'arterie' ? 'Schritt-für-Schritt Vorbereitung & Nullabgleich vor Patientenkontakt' : (standard.id === 'befeuchtung-invasiv' ? 'Schritt-für-Schritt Vorbereitung vor Patientenanschluss' : 'Schritt-für-Schritt Aufbau vor jedem Patientenkontakt')))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. STANDARD-SPECIFIC INTERACTIVE DIAGNOSTIC / SIMULATOR TOOL */}
      <div className="no-print">
        {standard.id === 'beatmung' && (
          <VentilatorCircuitComponent standard={standard} />
        )}

        {standard.id === 'befeuchtung-invasiv' && (
          <HumidifierComponent standard={standard} />
        )}

        {standard.id === 'hfnc' && (
          <RoxIndexCalculatorComponent standard={standard} />
        )}

        {standard.id === 'arterie' && (
          <ArterialWaveformComponent standard={standard} />
        )}

        {standard.id === 'evd' && (
          <EvdLevelingComponent standard={standard} />
        )}
      </div>

      {/* 3. INTERACTIVE SHIFT SAFETY CHECKLIST */}
      <div className="no-print">
        <ShiftChecklistSection
          checklist={standard.checklist}
          standardTitle={standard.shortTitle}
          accentColor={standard.accentColor}
          standardId={standard.id}
        />
      </div>

      {/* 4. TROUBLESHOOTING & ALARM GUIDE */}
      <div className="no-print">
        <TroubleshootingSection
          troubleshooting={standard.troubleshooting}
          accentColor={standard.accentColor}
        />
      </div>

      {/* 5. STRUCTURED HANDLUNGSSCHRITTE / FACHGERECHTER AUFBAU DES DOPPELSCHLAUCHSYSTEMS – ELISA 600 */}
      <div className="card border shadow-sm rounded-4 p-3 p-sm-4 bg-white mb-4 no-print" style={{ borderColor: `${standard.accentColor}35` }}>
        <div className="d-flex align-items-center gap-2.5 mb-3 pb-2 border-bottom">
          <div
            className="rounded-3 p-1.5 d-flex align-items-center justify-content-center text-white flex-shrink-0"
            style={{ width: '38px', height: '38px', backgroundColor: standard.accentColor, boxShadow: `0 2px 8px ${standard.accentColor}45` }}
          >
            <i className={`bi ${standard.id === 'beatmung' ? 'bi-lungs-fill' : 'bi-check2-circle'} fs-5`}></i>
          </div>
          <div>
            <span className="badge rounded-pill fw-bold text-uppercase px-2.5 py-0.5 mb-0.5 d-inline-block shadow-2xs" style={{ backgroundColor: `${standard.accentColor}18`, color: standard.accentColor, fontSize: '0.68rem', border: `1px solid ${standard.accentColor}35` }}>
              {standard.id === 'beatmung' ? 'Schlauchsystem-SOP • Elisa 600' : 'Praxis-Leitfaden'}
            </span>
            <h5 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.05rem' }}>
              {standard.id === 'beatmung'
                ? 'FACHGERECHTER AUFBAU DES DOPPELSCHLAUCHSYSTEMS – ELISA 600'
                : `Strukturierte Handlungsschritte im Pflegeprozess (${standard.shortTitle})`}
            </h5>
          </div>
        </div>

        <div className="d-flex flex-column gap-2.5">
          {standard.clinicalFocus && standard.clinicalFocus.map((item, idx) => {
            const phasePalette = [
              { color: '#0284c7', bg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', border: '#bae6fd', icon: 'bi-plug-fill', badgeBg: '#e0f2fe' },
              { color: '#16a34a', bg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', border: '#bbf7d0', icon: 'bi-box-seam-fill', badgeBg: '#dcfce7' },
              { color: '#0284c7', bg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', border: '#bae6fd', icon: 'bi-arrow-right-circle-fill', badgeBg: '#e0f2fe' },
              { color: '#7c3aed', bg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)', border: '#ddd6fe', icon: 'bi-filter-circle-fill', badgeBg: '#f3e8ff' },
              { color: '#ea580c', bg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 100%)', border: '#fed7aa', icon: 'bi-shield-fill-plus', badgeBg: '#ffedd5' },
              { color: '#dc2626', bg: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)', border: '#fecaca', icon: 'bi-check2-circle', badgeBg: '#fee2e2' }
            ];
            const pStyle = phasePalette[idx % phasePalette.length];
            const itemColor = item.color || pStyle.color;
            return (
              <div
                key={idx}
                className="p-3 rounded-3 border-start border-5 shadow-2xs"
                style={{
                  borderLeftColor: itemColor,
                  background: pStyle.bg,
                  borderTop: `1px solid ${pStyle.border}`,
                  borderRight: `1px solid ${pStyle.border}`,
                  borderBottom: `1px solid ${pStyle.border}`
                }}
              >
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-1.5">
                  <div className="d-flex align-items-center gap-2">
                    <span
                      className="rounded-3 p-1.5 d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ width: '28px', height: '28px', backgroundColor: itemColor, boxShadow: `0 2px 6px ${itemColor}45` }}
                    >
                      <i className={`bi ${item.icon || pStyle.icon}`} style={{ fontSize: '0.82rem' }}></i>
                    </span>
                    <strong className="text-dark small" style={{ fontSize: '0.94rem' }}>{item.phase}</strong>
                  </div>
                  <span
                    className="badge rounded-pill fw-bold text-uppercase shadow-2xs"
                    style={{ backgroundColor: pStyle.badgeBg, color: itemColor, border: `1px solid ${pStyle.border}`, fontSize: '0.67rem' }}
                  >
                    {standard.id === 'beatmung' ? `Schritt ${idx + 1}` : `Phase ${idx + 1}`}
                  </span>
                </div>
                <div className="text-secondary small ps-1" style={{ lineHeight: '1.5', fontSize: '0.85rem', color: '#334155' }}>
                  {item.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* GOLDENE REGEL Highlight Box (Beatmung) */}
        {standard.id === 'beatmung' && (
          <div
            className="p-3 p-sm-3.5 rounded-3 border shadow-sm position-relative overflow-hidden mt-3"
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 45%, #ffedd5 100%)',
              borderColor: '#f59e0b',
              borderLeft: '6px solid #d97706'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ width: '28px', height: '28px', backgroundColor: '#d97706', boxShadow: '0 2px 6px rgba(217, 119, 6, 0.4)' }}
                >
                  <i className="bi bi-lightbulb-fill" style={{ fontSize: '0.85rem' }}></i>
                </span>
                <strong className="text-dark text-uppercase fw-bold" style={{ fontSize: '0.94rem', letterSpacing: '0.5px' }}>
                  💡 GOLDENE REGEL
                </strong>
              </div>
              <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill shadow-2xs" style={{ fontSize: '0.68rem' }}>
                STRIKT EINHALTEN
              </span>
            </div>
            <p className="mb-0 text-dark fw-medium small ps-1" style={{ fontSize: '0.86rem', lineHeight: '1.45', color: '#1e293b' }}>
              Vor Patientenanschluss Geräte- und Dichtigkeitstest erfolgreich abschließen. Beatmungsbeutel mit Reservoir, ggf. PEEP-Ventil, passender Maske, O₂-Versorgung und funktionsfähige Absaugung bereithalten.
            </p>
          </div>
        )}

        {/* GOLDENE REGEL Highlight Box (Arterie) */}
        {standard.id === 'arterie' && standard.goldenRule && (
          <div
            className="p-3 p-sm-3.5 rounded-3 border shadow-sm position-relative overflow-hidden mt-3"
            style={{
              background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 45%, #ffedd5 100%)',
              borderColor: '#f59e0b',
              borderLeft: '6px solid #dc2626'
            }}
          >
            <div className="d-flex align-items-center justify-content-between mb-1.5 flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <span
                  className="rounded-circle d-inline-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ width: '28px', height: '28px', backgroundColor: '#dc2626', boxShadow: '0 2px 6px rgba(220, 38, 38, 0.4)' }}
                >
                  <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '0.85rem' }}></i>
                </span>
                <strong className="text-dark text-uppercase fw-bold" style={{ fontSize: '0.94rem', letterSpacing: '0.5px' }}>
                  ⚠️ GOLDENE REGEL
                </strong>
              </div>
              <span className="badge bg-warning text-dark fw-bold px-2.5 py-1 rounded-pill shadow-2xs" style={{ fontSize: '0.68rem' }}>
                STRIKT EINHALTEN
              </span>
            </div>
            <p className="mb-0 text-dark fw-medium small ps-1" style={{ fontSize: '0.86rem', lineHeight: '1.45', color: '#1e293b' }}>
              {standard.goldenRule}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Component: All 5 QR Codes Hub / Pocketcards Overview
// -------------------------------------------------------------
function AllQrCodesView({ standards, onSelectStandard, showToast }) {
  const list = Object.values(standards);

  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label} kopiert!`);
    });
  };

  const downloadQrImage = (std) => {
    const container = document.querySelector(`.pocket-qr-${std.id}`);
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
    a.download = `QR-Code-${std.shortTitle}-Intensivstandard.png`;
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
          <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.75rem)' }}>
            Alle 5 Klinischen Intensiv-Pocketcards
          </h2>
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

// -------------------------------------------------------------
// Component: UniversalCardInteractiveCard (12 × 8 cm Pocketcard)
// -------------------------------------------------------------
function UniversalCardInteractiveCard({ isAtm = true, onSelectStandard }) {
  const baseOrigin = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://intensivpflege-standards.web.app/';
  const normalizedBase = baseOrigin.endsWith('/') ? baseOrigin : `${baseOrigin}/`;
  const portalUrl = `${normalizedBase}#/quick-hub`;

  return (
    <div
      className="universal-card-interactive-box atm-size mx-auto position-relative"
      id="universal-card-interactive-card"
      style={{
        border: '1.5px solid #cbd5e1',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 38px -8px rgba(0, 39, 61, 0.22), 0 0 0 1px rgba(2, 132, 199, 0.12)',
        maxWidth: '640px',
        background: '#ffffff'
      }}
    >
      <div className="universal-card-inner position-relative w-100" style={{ lineHeight: 0 }}>
        {/* The Exact 12x8 cm Graphic - Master Ultra-HD 300 DPI Asset */}
        <img
          src="assets/universal-card-a4-hd.jpg?v=20261105-33"
          alt="Intensivkompass Digital – Digitale Pocketcard für die Intensivpflege (12 × 8 cm)"
          className="universal-card-img w-100 d-block"
          style={{ imageRendering: '-webkit-optimize-contrast', aspectRatio: '3508 / 2336' }}
        />

        {/* 1. Beatmung vorbereiten & Gerätecheck Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '26.2%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('beatmung')}
          title="1. Beatmung vorbereiten & Gerätecheck aufrufen"
        />

        {/* 2. Aktive Befeuchtung – invasive Beatmung Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '37.6%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('befeuchtung-invasiv')}
          title="2. Aktive Befeuchtung – invasive Beatmung aufrufen"
        />

        {/* 3. Aktive Befeuchtung – nasaler High-Flow Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '49.1%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('hfnc')}
          title="3. Aktive Befeuchtung – nasaler High-Flow aufrufen"
        />

        {/* 4. Arterielles Druckmesssystem Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '60.5%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('arterie')}
          title="4. Arterielles Druckmesssystem aufrufen"
        />

        {/* 5. Externe Ventrikeldrainage (EVD) Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '72.0%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('evd')}
          title="5. Externe Ventrikeldrainage (EVD) aufrufen"
        />

        {/* Right QR Portal & HIER SCANNEN Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '67.0%', top: '27.0%', width: '29.0%', height: '57.0%', borderRadius: '1.2rem' }}
          onClick={() => onSelectStandard('quick-hub')}
          title="Schnellzugriff auf digitale Pocketcards öffnen"
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: UniversalCardA4Native (DIN A4 Format - Same Pocketcard with Ultra-HD Clarity)
// -------------------------------------------------------------
function UniversalCardA4Native({ onSelectStandard }) {
  const baseOrigin = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? `${window.location.origin}${window.location.pathname}`
    : 'https://intensivpflege-standards.web.app/';
  const normalizedBase = baseOrigin.endsWith('/') ? baseOrigin : `${baseOrigin}/`;
  const portalUrl = `${normalizedBase}#/quick-hub`;

  return (
    <div
      className="universal-card-a4-hd-box position-relative w-100 mx-auto"
      id="universal-card-a4-sheet"
      style={{
        maxWidth: '960px',
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 16px 40px -8px rgba(0, 39, 61, 0.22), 0 0 0 1px rgba(2, 132, 199, 0.15)'
      }}
    >
      <div className="position-relative w-100" style={{ lineHeight: 0 }}>
        {/* Same Pocketcard Design - Master Ultra-HD 300 DPI Asset */}
        <img
          src="assets/universal-card-a4-hd.jpg?v=20261105-33"
          alt="Intensivkompass Digital – DIN A4 Pocketcard Übersicht (Ultra-HD)"
          className="w-100 d-block"
          style={{
            imageRendering: '-webkit-optimize-contrast',
            aspectRatio: '3508 / 2336',
            width: '100%',
            height: 'auto',
            display: 'block'
          }}
        />

        {/* 1. Beatmung vorbereiten & Gerätecheck Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '26.2%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('beatmung')}
          title="1. Beatmung vorbereiten & Gerätecheck aufrufen"
        />

        {/* 2. Aktive Befeuchtung – invasive Beatmung Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '37.6%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('befeuchtung-invasiv')}
          title="2. Aktive Befeuchtung – invasive Beatmung aufrufen"
        />

        {/* 3. Aktive Befeuchtung – nasaler High-Flow Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '49.1%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('hfnc')}
          title="3. Aktive Befeuchtung – nasaler High-Flow aufrufen"
        />

        {/* 4. Arterielles Druckmesssystem Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '60.5%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('arterie')}
          title="4. Arterielles Druckmesssystem aufrufen"
        />

        {/* 5. Externe Ventrikeldrainage (EVD) Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '1.5%', top: '72.0%', width: '61.0%', height: '10.8%', borderRadius: '50rem' }}
          onClick={() => onSelectStandard('evd')}
          title="5. Externe Ventrikeldrainage (EVD) aufrufen"
        />

        {/* Right QR Portal & HIER SCANNEN Hotspot */}
        <div
          className="universal-card-hotspot"
          style={{ left: '67.0%', top: '27.0%', width: '29.0%', height: '57.0%', borderRadius: '1.5rem' }}
          onClick={() => onSelectStandard('quick-hub')}
          title="Schnellzugriff auf digitale Pocketcards öffnen"
        />
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Component: UniversalCardView (U-Card Page)
// -------------------------------------------------------------
function UniversalCardView({ standards, onSelectStandard, showToast }) {
  const [cardFormat, setCardFormat] = useState('atm');
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveFormat = cardFormat;
  const list = Object.values(standards);

  const cardUrl = (typeof window !== 'undefined' && window.location)
    ? `${window.location.origin}${window.location.pathname}#/quick-hub`
    : 'https://intensivpflege-standards.web.app/#/quick-hub';
  const portalUrl = cardUrl;
  const isA4 = effectiveFormat === 'a4';
  const shareTitle = isA4
    ? 'Intensivkompass Digital – DIN A4 Übersicht für die Intensivpflege'
    : 'Intensivkompass Digital – Pocketcard für die Intensivpflege';
  const shareText = isA4
    ? `Intensivkompass Digital – DIN A4 Gesamt-Übersicht für die Intensivpflege (Standards & SOPs direkt öffnen): ${cardUrl}`
    : `Intensivkompass Digital – Pocketcard für die Intensivpflege (Standards & SOPs direkt öffnen): ${cardUrl}`;

  const handleShareCard = async () => {
    const shareFileName = isA4
      ? 'Intensivkompass-Digital-A4-Uebersicht.jpg'
      : 'Intensivkompass-Digital-Pocketcard-12x8.jpg';
    if (navigator.share) {
      try {
        try {
          const response = await fetch('assets/universal-card-a4-hd.jpg');
          const blob = await response.blob();
          const file = new File([blob], shareFileName, { type: 'image/jpeg' });
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
          // Fallback to text/URL share below
        }
        await navigator.share({
          title: shareTitle,
          text: 'Intensivkompass Digital – Klinische Intensivstandards & SOPs:',
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
        showToast('Link zur Übersicht in die Zwischenablage kopiert!');
      });
    } else {
      showToast('Link: ' + cardUrl);
    }
  };

  const handlePrint = (format) => {
    const isAtm = (format || cardFormat) === 'atm';

    // Inject dynamic @page style so browser uses exact orientation & margin
    const existing = document.getElementById('dynamic-print-page-style');
    if (existing) existing.remove();

    const style = document.createElement('style');
    style.id = 'dynamic-print-page-style';
    style.innerHTML = isAtm
      ? '@page { size: A4 portrait; margin: 8mm; }'
      : '@page { size: A4 landscape; margin: 8mm; }';
    document.head.appendChild(style);

    document.body.classList.remove('printing-a4', 'printing-atm', 'active-format-a4', 'active-format-atm');
    if (isAtm) {
      document.body.classList.add('printing-atm', 'active-format-atm');
    } else {
      document.body.classList.add('printing-a4', 'active-format-a4');
    }

    window.print();

    setTimeout(() => {
      document.body.classList.remove('printing-a4', 'printing-atm');
      const s = document.getElementById('dynamic-print-page-style');
      if (s) s.remove();
    }, 1500);
  };

  const downloadPdf = (formatOverride) => {
    const isAtm = (formatOverride || effectiveFormat) === 'atm';
    if (!window.html2pdf) {
      handlePrint(isAtm ? 'atm' : 'a4');
      return;
    }
    const targetId = isAtm ? 'universal-card-atm-a4-sheet' : 'universal-card-a4-sheet';
    const element = document.getElementById(targetId);
    if (!element) {
      handlePrint(isAtm ? 'atm' : 'a4');
      return;
    }
    showToast(isAtm ? 'Erstelle Pocketcard DIN A4 PDF (12 × 8 cm)...' : 'Erstelle DIN A4 Ultra-HD PDF...');

    if (isAtm) {
      const prevDisplay = element.style.display;
      const prevPosition = element.style.position;
      const prevWidth = element.style.width;
      const prevMaxWidth = element.style.maxWidth;
      const prevMargin = element.style.margin;
      const prevBackground = element.style.background;

      element.style.display = 'block';
      element.style.position = 'relative';
      element.style.width = '794px';
      element.style.maxWidth = '794px';
      element.style.margin = '0 auto';
      element.style.background = '#ffffff';

      const restoreStyles = () => {
        element.style.display = prevDisplay;
        element.style.position = prevPosition;
        element.style.width = prevWidth;
        element.style.maxWidth = prevMaxWidth;
        element.style.margin = prevMargin;
        element.style.background = prevBackground;
      };

      const opt = {
        margin: [0, 0, 0, 0],
        filename: 'Intensivkompass_Pocketcard_12x8_DIN_A4.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          width: 794,
          windowWidth: 794
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      window.html2pdf().set(opt).from(element).save().then(() => {
        restoreStyles();
        showToast('Pocketcard DIN A4 PDF erfolgreich heruntergeladen!');
      }).catch((err) => {
        restoreStyles();
        console.error('PDF error:', err);
        handlePrint('atm');
      });
    } else {
      const prevDisplay = element.style.display;
      const prevPosition = element.style.position;
      const prevWidth = element.style.width;
      const prevMaxWidth = element.style.maxWidth;
      const prevHeight = element.style.height;
      const prevMargin = element.style.margin;
      const prevBackground = element.style.background;
      const prevBoxShadow = element.style.boxShadow;

      element.style.display = 'block';
      element.style.position = 'relative';
      element.style.width = '1123px';
      element.style.maxWidth = '1123px';
      element.style.height = '748px';
      element.style.margin = '0 auto';
      element.style.background = '#ffffff';
      element.style.boxShadow = 'none';

      const restoreStyles = () => {
        element.style.display = prevDisplay;
        element.style.position = prevPosition;
        element.style.width = prevWidth;
        element.style.maxWidth = prevMaxWidth;
        element.style.height = prevHeight;
        element.style.margin = prevMargin;
        element.style.background = prevBackground;
        element.style.boxShadow = prevBoxShadow;
      };

      const opt = {
        margin: [0, 0, 0, 0],
        filename: 'Intensivkompass_Universal_A4_Uebersicht.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          width: 1123,
          windowWidth: 1123
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      window.html2pdf().set(opt).from(element).save().then(() => {
        restoreStyles();
        showToast('DIN A4 PDF erfolgreich heruntergeladen!');
      }).catch((err) => {
        restoreStyles();
        console.error('PDF error:', err);
        handlePrint('a4');
      });
    }
  };

  return (
    <div className="py-2 py-md-3">
      {/* Quick Hub Header Bar (in mobile view of Universal Card) */}
      <div
        className="quick-hub-top-header p-3 mb-2.5 rounded-4 shadow-sm text-white d-block d-lg-none no-print position-relative overflow-hidden w-100 mx-auto"
        style={{
          background: 'linear-gradient(135deg, #001a2e 0%, #003354 40%, #026ca8 75%, #0284c7 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 8px 24px -4px rgba(0, 31, 63, 0.3), 0 2px 8px rgba(56, 189, 248, 0.15)',
          maxWidth: effectiveFormat === 'a4' ? '960px' : '640px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3.5px',
            background: 'linear-gradient(90deg, #0284c7 0%, #16a34a 25%, #ea580c 50%, #dc2626 75%, #7c3aed 100%)'
          }}
        />
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-3 p-1.5 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm"
            style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.45)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <i className="bi bi-heart-pulse-fill fs-4"></i>
          </div>
          <div className="min-w-0 flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-1.5 mb-1">
              <span
                className="badge rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-1 shadow-2xs"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.32)',
                  fontSize: '0.67rem',
                  letterSpacing: '0.4px',
                  padding: '3px 8.5px'
                }}
              >
                <i className="bi bi-shield-check text-warning"></i>QM-GEPRÜFT 2026
              </span>
              <span
                className="badge rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-1 shadow-2xs"
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.22)',
                  color: '#e0f2fe',
                  border: '1px solid rgba(56, 189, 248, 0.42)',
                  fontSize: '0.67rem',
                  letterSpacing: '0.3px',
                  padding: '3px 8.5px'
                }}
              >
                <i className={`bi ${effectiveFormat === 'a4' ? 'bi-file-earmark-text text-warning' : 'bi-credit-card-2-front text-info'}`}></i>
                {effectiveFormat === 'a4' ? 'DIN A4 Format' : 'Pocketcard'}
              </span>
            </div>
            <h4
              className="fw-black text-white mb-0"
              style={{
                fontSize: 'clamp(1.05rem, 3.8vw, 1.32rem)',
                letterSpacing: '-0.2px',
                lineHeight: 1.25,
                textShadow: '0 2px 6px rgba(0, 26, 46, 0.35)'
              }}
            >
              {effectiveFormat === 'a4' ? 'Intensivkompass Digital (DIN A4)' : 'Intensivkompass Digital (Pocketcard)'}
            </h4>
          </div>
        </div>
      </div>

      {/* Top Format Switcher & Actions (Visible on Mobile + Desktop) */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2 no-print mx-auto" style={{ maxWidth: effectiveFormat === 'a4' ? '960px' : '640px' }}>
        <div className="btn-group shadow-sm rounded-pill p-1 bg-white border" role="group">
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'atm' ? 'btn-primary text-white shadow-sm fw-bold' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.78rem', minHeight: '36px', padding: '0.3rem 0.85rem' }}
            onClick={() => setCardFormat('atm')}
          >
            <i className="bi bi-credit-card-2-front me-1"></i>
            <span>Pocketcard (12 × 8 cm)</span>
          </button>
          <button
            type="button"
            className={`btn btn-sm ${cardFormat === 'a4' ? 'btn-primary text-white shadow-sm fw-bold' : 'btn-light border-0 text-secondary'}`}
            style={{ fontSize: '0.78rem', minHeight: '36px', padding: '0.3rem 0.85rem' }}
            onClick={() => setCardFormat('a4')}
          >
            <i className="bi bi-file-earmark-text me-1"></i>
            <span>DIN A4</span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-1.5 flex-wrap">
          <button
            className="btn btn-primary btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => handlePrint(cardFormat)}
          >
            <i className="bi bi-printer-fill"></i>
            <span>Drucken</span>
          </button>
          <button
            className="btn btn-outline-secondary rounded-pill px-3 py-1.5 shadow-sm btn-sm fw-semibold d-flex align-items-center justify-content-center gap-1 bg-white"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => downloadPdf(cardFormat)}
          >
            <i className="bi bi-file-earmark-pdf"></i>
            <span>PDF</span>
          </button>
          <button
            className="btn btn-warning text-dark fw-bold rounded-pill px-3 py-1.5 shadow-sm btn-sm d-flex align-items-center justify-content-center gap-1"
            style={{ minHeight: '36px', fontSize: '0.78rem' }}
            onClick={() => onSelectStandard('quick-hub')}
          >
            <i className="bi bi-box-arrow-up-right"></i>
            <span>Hub</span>
          </button>
        </div>
      </div>

      {/* Format Specification Hint Badge */}
      <div className="text-center no-print mb-2">
        <div className="badge rounded-pill bg-white text-secondary border shadow-2xs px-3 py-1.5 fw-medium d-inline-flex align-items-center gap-1.5">
          {effectiveFormat === 'atm' ? (
            <>
              <i className="bi bi-credit-card-2-front-fill text-primary"></i>
              <span className="text-dark fw-bold">Intensivkompass Digital – Pocketcard (120 × 80 mm)</span>
              <span className="text-muted d-none d-sm-inline">&bull; Doppelseitig laminiert &bull; Kitteltaschen-Standard &bull; Ultra-HD</span>
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf-fill text-danger"></i>
              <span className="text-dark fw-bold">Intensivkompass Digital – DIN A4 Format (Ultra-HD 300 DPI)</span>
              <span className="text-muted d-none d-sm-inline">&bull; Selbe Pocketcard-Systematik &bull; Maximale Schärfe &bull; Stationsaushang</span>
            </>
          )}
        </div>
      </div>

      {/* Card Presentation */}
      <div className="d-flex flex-column align-items-center justify-content-center my-2 gap-3">
        {effectiveFormat === 'a4' ? (
          <div className="w-100 p-2 p-sm-3 bg-white rounded-4 border shadow-sm d-flex flex-column align-items-center u-card-pedestal" style={{ maxWidth: '980px' }} id="universal-card-a4-printable">
            <UniversalCardA4Native onSelectStandard={onSelectStandard} />

            {/* Symmetrical Share & Action Buttons: WhatsApp, Teilen, Link, PDF */}
            <div className="w-100 mt-3 pt-2.5 border-top no-print" data-html2canvas-ignore="true">
              <div className="row g-2">
                {/* WhatsApp Share Button */}
                <div className="col-6 col-sm-3">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 text-white w-100 text-decoration-none"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', minHeight: '42px', fontSize: '0.82rem' }}
                    title="DIN A4 Karte per WhatsApp teilen"
                  >
                    <i className="bi bi-whatsapp fs-6"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Native Social Media / System Share */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ backgroundColor: '#004767', borderColor: '#004767', minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={handleShareCard}
                    title="Über Social Media oder andere Apps teilen"
                  >
                    <i className="bi bi-share-fill"></i>
                    <span>Teilen</span>
                  </button>
                </div>

                {/* Copy Link */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark rounded-pill py-2 px-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-1.5 bg-white w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={handleCopyShareLink}
                    title="Link in die Zwischenablage kopieren"
                  >
                    <i className="bi bi-link-45deg fs-5"></i>
                    <span>Link kopieren</span>
                  </button>
                </div>

                {/* PDF Download */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={() => downloadPdf('a4')}
                    title="DIN A4 Karte als PDF herunterladen"
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                    <span>PDF (DIN A4)</span>
                  </button>
                </div>
              </div>

              <div className="small text-muted text-center mt-2.5 pt-1" style={{ fontSize: '0.74rem' }}>
                <i className="bi bi-check2-circle text-success me-1"></i>
                DIN A4 Gesamt-Übersicht &bull; Ultra-HD 300 DPI &bull; 100% scannbar &bull; Stationsaushang
              </div>
            </div>
          </div>
        ) : (
          <div className="w-100 p-2 p-sm-3.5 rounded-4 border shadow-sm d-flex flex-column align-items-center u-card-pedestal" style={{ maxWidth: '640px' }} id="universal-card-atm-printable">
            <UniversalCardInteractiveCard isAtm={true} onSelectStandard={onSelectStandard} />

            {/* Symmetrical Share & Action Buttons: WhatsApp, Teilen, Link, PDF */}
            <div className="w-100 mt-3 pt-2.5 border-top no-print" data-html2canvas-ignore="true">
              <div className="row g-2">
                {/* WhatsApp Share Button */}
                <div className="col-6 col-sm-3">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 text-white w-100 text-decoration-none"
                    style={{ backgroundColor: '#25D366', borderColor: '#25D366', minHeight: '42px', fontSize: '0.82rem' }}
                    title="Pocketcard per WhatsApp teilen"
                  >
                    <i className="bi bi-whatsapp fs-6"></i>
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Native Social Media / System Share */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-primary rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ backgroundColor: '#004767', borderColor: '#004767', minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={handleShareCard}
                    title="Über Social Media oder andere Apps teilen"
                  >
                    <i className="bi bi-share-fill"></i>
                    <span>Teilen</span>
                  </button>
                </div>

                {/* Copy Link */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-dark rounded-pill py-2 px-2 fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-1.5 bg-white w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={handleCopyShareLink}
                    title="Link in die Zwischenablage kopieren"
                  >
                    <i className="bi bi-link-45deg fs-5"></i>
                    <span>Link kopieren</span>
                  </button>
                </div>

                {/* PDF Download */}
                <div className="col-6 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-sm btn-danger rounded-pill py-2 px-2 fw-bold shadow-sm d-flex align-items-center justify-content-center gap-1.5 w-100"
                    style={{ minHeight: '42px', fontSize: '0.82rem' }}
                    onClick={() => downloadPdf('atm')}
                    title="Pocketcard als DIN A4 PDF herunterladen"
                  >
                    <i className="bi bi-file-earmark-pdf-fill"></i>
                    <span>PDF (12×8 cm)</span>
                  </button>
                </div>
              </div>

              <div className="small text-muted text-center mt-2.5 pt-1" style={{ fontSize: '0.74rem' }}>
                <i className="bi bi-check2-circle text-success me-1"></i>
                Pocketcard (12 × 8 cm) &bull; 100% scannbar &bull; Kitteltaschen-Standard
              </div>
            </div>
          </div>
        )}

        {/* Hidden Fallback for A4 PDF Generation when Pocketcard is active */}
        {effectiveFormat !== 'a4' && (
          <div style={{ display: 'none' }} aria-hidden="true">
            <UniversalCardA4Native onSelectStandard={onSelectStandard} />
          </div>
        )}

        {/* Dedicated DIN A4 Sheet for Pocketcard (12 x 8 cm) Print & PDF Download (always present in DOM, hidden on screen) */}
        <div id="universal-card-atm-a4-sheet" className="pocketcard-atm-a4-sheet">
          <div className="a4-atm-print-page">
            {/* Top Brand / Cutout Header */}
            <div className="a4-atm-cutout-header">
              <div className="d-flex align-items-center justify-content-between mb-1 pb-1 border-bottom border-secondary border-opacity-25">
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-primary text-white px-2 py-0.5 fw-bold" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-scissors me-1"></i>Schnittmarke
                  </span>
                  <strong className="text-dark" style={{ fontSize: '0.85rem' }}>
                    Intensivkompass Digital – Pocketcard (12 × 8 cm)
                  </strong>
                </div>
                <span className="badge bg-light text-secondary border px-2 py-0.5 font-monospace" style={{ fontSize: '0.68rem' }}>
                  DIN A4 Ausdruck &bull; 100% Originalgröße
                </span>
              </div>
              <div className="text-secondary small d-flex align-items-center justify-content-between" style={{ fontSize: '0.72rem' }}>
                <span>
                  <i className="bi bi-info-circle text-primary me-1"></i>
                  Entlang der gestrichelten Linie ausschneiden (120 × 80 mm) und laminieren. Passt exakt in jede Kitteltasche.
                </span>
                <span className="fw-semibold text-primary">Stand: 2026</span>
              </div>
            </div>

            {/* The Exact 12 x 8 cm Card Box (Centered, with Scissor Cut Marks) */}
            <div className="pocketcard-atm-cutout-frame-wrapper position-relative">
              <div className="cut-corner cut-corner-tl">✂</div>
              <div className="cut-corner cut-corner-tr">✂</div>
              <div className="cut-corner cut-corner-bl">✂</div>
              <div className="cut-corner cut-corner-br">✂</div>

              <div className="pocketcard-atm-cutout-frame">
                <div className="position-relative w-100 h-100" style={{ lineHeight: 0 }}>
                  <img
                    src="assets/universal-card-a4-hd.jpg?v=20261105-33"
                    alt="Intensivkompass Digital – Pocketcard 12 × 8 cm"
                    className="w-100 h-100 d-block"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Clinical Reference Notes */}
            <div className="a4-atm-cutout-footer">
              <div className="d-flex justify-content-between align-items-center text-muted small" style={{ fontSize: '0.68rem' }}>
                <span>
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Klinische Intensivpflege &amp; Gerätestandards &bull; Evidenzbasierte Leitfäden
                </span>
                <span className="font-monospace">
                  120 mm × 80 mm &bull; DIN A4 Druckbogen
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct Quick Tap Grid of the 5 Standards (Desktop only, hidden on mobile view) */}
      <div className="mt-4 pt-3 border-top no-print d-none d-lg-block">
        <h6 className="fw-bold text-dark mb-2.5 d-flex align-items-center gap-2">
          <i className="bi bi-grid-fill text-primary"></i>
          <span>Direktzugriff auf alle 5 Intensivstandards:</span>
        </h6>
        <div className="row g-2">
          {list.map((std) => (
            <div key={std.id} className="col-sm-6 col-lg">
              <div
                className="p-2.5 bg-white rounded-3 border shadow-2xs h-100 d-flex align-items-center justify-content-between gap-2 standard-tile-tap"
                style={{
                  cursor: 'pointer',
                  borderLeft: `4px solid ${std.accentColor}`,
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onClick={() => onSelectStandard(std.id)}
                title={`Klicken für: ${std.title}`}
              >
                <div className="d-flex align-items-center gap-2 min-w-0">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: std.accentColor,
                      boxShadow: `0 2px 6px ${std.accentColor}44`
                    }}
                  >
                    <i className={`bi ${std.icon}`}></i>
                  </div>
                  <div className="min-w-0">
                    <div className="fw-bold small text-dark text-truncate" style={{ fontSize: '0.82rem' }}>
                      {std.shortTitle}
                    </div>
                    <div className="text-secondary small text-truncate" style={{ fontSize: '0.68rem' }}>
                      {std.version ? `Ver. ${std.version}` : 'Intensivstandard'}
                    </div>
                  </div>
                </div>
                <i className="bi bi-arrow-right-short text-muted fs-5"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// -------------------------------------------------------------
// Component: QuickHubView (Target of Universal Card QR Code)
// -------------------------------------------------------------
function QuickHubView({ standards, onSelectStandard, onLogout }) {
  const orderedIds = ['beatmung', 'befeuchtung-invasiv', 'hfnc', 'arterie', 'evd'];
  const list = orderedIds
    .map((id) => standards[id])
    .filter(Boolean);

  const cardThemeMap = {
    beatmung: {
      badgeText: 'RESPIRATION & BEATMUNG',
      badgeBg: '#e0f2fe',
      badgeColor: '#0284c7',
      displayTitle: '1. Beatmungsgerät & Gerätecheck',
      rightImg: 'assets/card-beatmung.jpg',
      icon: 'bi-lungs-fill',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 55%, #e0f2fe 100%)',
      cardBgSolid: '#f0f9ff',
      cardBorder: '#bae6fd',
      cardShadow: 'rgba(2, 132, 199, 0.2)',
      gradient: 'linear-gradient(135deg, #001f3f 0%, #0284c7 100%)'
    },
    'befeuchtung-invasiv': {
      badgeText: 'INVASIVE BEATMUNG',
      badgeBg: '#dcfce7',
      badgeColor: '#16a34a',
      displayTitle: '2. Aktive Befeuchtung (Invasiv)',
      rightImg: 'assets/card-befeuchtung.jpg',
      icon: 'bi-droplet-half',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 55%, #dcfce7 100%)',
      cardBgSolid: '#f0fdf4',
      cardBorder: '#bbf7d0',
      cardShadow: 'rgba(22, 163, 74, 0.2)',
      gradient: 'linear-gradient(135deg, #064e3b 0%, #16a34a 100%)'
    },
    hfnc: {
      badgeText: 'HIGH-FLOW THERAPIE',
      badgeBg: '#ffedd5',
      badgeColor: '#ea580c',
      displayTitle: '3. High-Flow (HFNC) & ROX',
      rightImg: 'assets/card-hfnc.jpg',
      icon: 'bi-wind',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff7ed 55%, #ffedd5 100%)',
      cardBgSolid: '#fff7ed',
      cardBorder: '#fed7aa',
      cardShadow: 'rgba(234, 88, 12, 0.2)',
      gradient: 'linear-gradient(135deg, #431407 0%, #ea580c 100%)'
    },
    arterie: {
      badgeText: 'HÄMODYNAMIK & ANÄSTHESIE',
      badgeBg: '#fee2e2',
      badgeColor: '#dc2626',
      displayTitle: '4. Arterielles Drucksystem (Combitrans®)',
      rightImg: 'assets/card-arterie.jpg',
      icon: 'bi-activity',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #fff1f2 55%, #fee2e2 100%)',
      cardBgSolid: '#fff1f2',
      cardBorder: '#fecaca',
      cardShadow: 'rgba(220, 38, 38, 0.2)',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)'
    },
    evd: {
      badgeText: 'NEURO-INTENSIV',
      badgeBg: '#f3e8ff',
      badgeColor: '#7c3aed',
      displayTitle: '5. Externe Ventrikeldrainage (EVD)',
      rightImg: 'assets/card-evd.jpg',
      icon: 'bi-diagram-3-fill',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 55%, #f3e8ff 100%)',
      cardBgSolid: '#faf5ff',
      cardBorder: '#ddd6fe',
      cardShadow: 'rgba(124, 58, 237, 0.2)',
      gradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)'
    }
  };

  return (
    <div className="quick-hub-screen-container d-flex flex-column justify-content-between w-100 mx-auto" style={{ maxWidth: '580px' }}>
      {/* Quick Hub Header Bar - Beautified with multi-color accent, glowing icon, and matching tile width */}
      <div
        className="quick-hub-top-header p-3 p-sm-3.5 mb-3 rounded-4 shadow-sm text-white position-relative overflow-hidden w-100 mx-auto"
        style={{
          background: 'linear-gradient(135deg, #001a2e 0%, #003354 40%, #026ca8 75%, #0284c7 100%)',
          border: '1.5px solid rgba(56, 189, 248, 0.4)',
          boxShadow: '0 8px 24px -4px rgba(0, 31, 63, 0.3), 0 2px 8px rgba(56, 189, 248, 0.15)',
          maxWidth: '580px'
        }}
      >
        {/* Top 5-Standard Multi-Color Accent Glow Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3.5px',
            background: 'linear-gradient(90deg, #0284c7 0%, #16a34a 25%, #ea580c 50%, #dc2626 75%, #7c3aed 100%)'
          }}
        />

        <div className="d-flex align-items-center gap-3">
          {/* Blue Glowing Heart-Pulse Icon */}
          <div
            className="rounded-3 p-1.5 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm"
            style={{
              width: '44px',
              height: '44px',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
              boxShadow: '0 4px 14px rgba(56, 189, 248, 0.45)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <i className="bi bi-heart-pulse-fill fs-4"></i>
          </div>

          <div className="min-w-0 flex-grow-1">
            <div className="d-flex flex-wrap align-items-center gap-1.5 mb-1">
              <span
                className="badge rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-1 shadow-2xs"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.18)',
                  backdropFilter: 'blur(8px)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.32)',
                  fontSize: '0.67rem',
                  letterSpacing: '0.4px',
                  padding: '3px 8.5px'
                }}
              >
                <i className="bi bi-shield-check text-warning"></i>QM-GEPRÜFT 2026
              </span>
              <span
                className="badge rounded-pill fw-bold text-uppercase d-inline-flex align-items-center gap-1 shadow-2xs"
                style={{
                  backgroundColor: 'rgba(56, 189, 248, 0.22)',
                  color: '#e0f2fe',
                  border: '1px solid rgba(56, 189, 248, 0.42)',
                  fontSize: '0.67rem',
                  letterSpacing: '0.3px',
                  padding: '3px 8.5px'
                }}
              >
                <i className="bi bi-check2-circle text-info"></i>5 Intensiv-Standards
              </span>
            </div>
            <h4
              className="fw-black text-white mb-0"
              style={{
                fontSize: 'clamp(1.05rem, 3.8vw, 1.32rem)',
                letterSpacing: '-0.2px',
                lineHeight: 1.25,
                textShadow: '0 2px 6px rgba(0, 26, 46, 0.35)'
              }}
            >
              Klinische Intensivstandards &amp; Leitfäden
            </h4>
          </div>
        </div>
      </div>

      {/* Cards List for All 5 Standards */}
      <div className="quick-hub-cards-wrapper d-flex flex-column gap-2.5 w-100 mx-auto" style={{ maxWidth: '580px' }}>
        {list.map((std) => {
          const theme = cardThemeMap[std.id] || {
            badgeText: 'INTENSIV-STANDARD',
            badgeBg: '#e0f2fe',
            badgeColor: '#0284c7',
            displayTitle: std.title,
            rightImg: std.image,
            icon: std.icon,
            cardBg: '#ffffff',
            cardBgSolid: '#ffffff',
            cardBorder: '#bae6fd',
            cardShadow: 'rgba(0, 0, 0, 0.05)',
            gradient: '#0284c7'
          };

          return (
            <div
              key={std.id}
              className="quick-hub-label-card rounded-4 d-flex align-items-center justify-content-between position-relative overflow-hidden mb-1"
              style={{
                cursor: 'pointer',
                background: theme.cardBg,
                border: `1.5px solid ${theme.cardBorder}`,
                borderLeft: `6px solid ${theme.badgeColor}`,
                boxShadow: `0 6px 20px -3px ${theme.cardShadow}`,
                minHeight: '88px',
                padding: '0.85rem 1.15rem',
                transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onClick={() => onSelectStandard(std.id)}
              title={`Klicken zum Öffnen: ${theme.displayTitle}`}
            >
              {/* Right-Hand Clinical Illustration with smooth gradient fade */}
              <div
                className="position-absolute top-0 end-0 bottom-0 pointer-events-none"
                style={{
                  width: '46%',
                  zIndex: 1,
                  overflow: 'hidden'
                }}
              >
                <img
                  src={theme.rightImg}
                  alt={theme.displayTitle}
                  className="w-100 h-100 d-block"
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center 40%'
                  }}
                />
                {/* Smooth blend from solid card color into the image */}
                <div
                  className="position-absolute top-0 start-0 bottom-0"
                  style={{
                    width: '60%',
                    background: `linear-gradient(90deg, ${theme.cardBgSolid} 0%, ${theme.cardBgSolid}e6 30%, transparent 100%)`
                  }}
                />
              </div>

              {/* Left Side: Icon + Title + Category Pill */}
              <div className="d-flex align-items-center gap-3 min-w-0 position-relative pe-2" style={{ zIndex: 2, maxWidth: '78%' }}>
                <div
                  className="quick-hub-icon-box rounded-3 d-flex align-items-center justify-content-center text-white flex-shrink-0 shadow-sm"
                  style={{
                    width: '52px',
                    height: '52px',
                    background: theme.gradient,
                    boxShadow: `0 4px 14px ${theme.badgeColor}55`
                  }}
                >
                  <i className={`bi ${theme.icon} fs-3`}></i>
                </div>

                <div className="min-w-0">
                  <span
                    className="badge rounded-pill fw-bold text-uppercase mb-1 d-inline-block shadow-2xs"
                    style={{
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeColor,
                      fontSize: '0.64rem',
                      letterSpacing: '0.4px',
                      padding: '3.5px 9px',
                      border: `1px solid ${theme.cardBorder}`
                    }}
                  >
                    {theme.badgeText}
                  </span>
                  <h5 className="fw-black text-dark mb-0 text-truncate" style={{ fontSize: 'clamp(0.96rem, 2.7vw, 1.2rem)', letterSpacing: '-0.2px' }}>
                    {theme.displayTitle}
                  </h5>
                </div>
              </div>

              {/* Right Side: Round White Chevron / Arrow Indicator */}
              <div
                className="quick-hub-arrow-btn rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0 position-relative"
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: theme.badgeColor,
                  zIndex: 2,
                  boxShadow: `0 3px 10px ${theme.badgeColor}66`
                }}
              >
                <i className="bi bi-arrow-right-short fs-4"></i>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seamless Ambient Monitor Illustration - Edgeless, borderless, blending directly into the page background */}
      <div
        className="quick-hub-monitor-ambient w-100 position-relative text-center mx-auto mt-1 mb-2"
        style={{
          maxWidth: '580px',
          background: 'transparent',
          border: 'none',
          boxShadow: 'none',
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <img
          src="assets/quick-hub-monitor.jpg"
          alt="Intensivpflege Patientenmonitor"
          className="quick-hub-monitor-ambient-img w-100 d-block"
          style={{
            objectFit: 'cover',
            maxHeight: '260px',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            background: 'transparent',
            maskImage: 'radial-gradient(ellipse 95% 75% at 50% 50%, black 35%, rgba(0, 0, 0, 0.8) 55%, rgba(0, 0, 0, 0.25) 78%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 95% 75% at 50% 50%, black 35%, rgba(0, 0, 0, 0.8) 55%, rgba(0, 0, 0, 0.25) 78%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Application Bootstrap & Mounting
// -------------------------------------------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
