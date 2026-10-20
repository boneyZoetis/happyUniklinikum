/**
 * UMF Expertenstandards QR Parser
 * Dedicated parser for the 4 Universitätsmedizin Frankfurt (UMF) nursing standards
 */

var root = typeof window !== 'undefined' ? window : global;
root.QRParser = (function () {
  'use strict';

  const UMF_STANDARDS = {
    dekubitus: {
      id: 'dekubitus',
      topic: 'Dekubitusprophylaxe in der Pflege',
      title: 'Expertenstandard zur Dekubitusprophylaxe – Umsetzung an der Universitätsmedizin Frankfurt (UMF)',
      shortTitle: 'Dekubitusprophylaxe',
      accentColor: '#be185d',
      badgeBg: 'rgba(190, 24, 93, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)',
      icon: 'bi-bandaid-fill',
      videoUrl: 'https://www.youtube.com/watch?v=loeE8KFPa_s&list=PLMSXl89VJ21rD1MgfqWltS0pyd-JElfNc&index=20',
      videoId: 'loeE8KFPa_s',
      roXtraIds: ['400139', '400129'],
      image: 'assets/umf-dekubitus.jpg',
      pdfUrl: 'assets/umf-expertenstandards-folien.pdf#page=1',
      pdfPage: 1,
      graphicImage: 'assets/graphic-dekubitus.jpg',
      leadText: 'An der UMF werden verschiedene Expertenstandards umgesetzt. Die Anwendung orientiert sich immer am Pflegeprozess.',
      instructions: 'Erfahren Sie mehr über den Expertenstandard Dekubitusprophylaxe, in dem Sie den QR – Code scannen und sich das Video anschauen. Weiterführende Informationen zu diesem Expertenstandard finden Sie auch im roXtra unter der ID: 400139 sowie der ID: 400129.',
      whyImportant: [
        'Druck gezielt reduzieren & Gewebeschäden vermeiden',
        'Haut schützen & gefährdete Körperstellen entlasten',
        'Eigenbewegung und Mobilität aktiv fördern',
        'Frühzeitig Risiko erkennen & interprofessionell handeln'
      ],
      keyPoints: [
        'Regelmäßige Umlagerung (alle 2–4 Stunden) zur gezielten Entlastung',
        'Druckentlastende Spezialmatratze und Weichlagerungskissen verwenden',
        '30°-Seitenlagerung zur effektiven Druckentlastung gefährdeter Stellen',
        'Haut täglich kontrollieren (Hinterkopf, Schulter, Ellenbogen, Hüfte, Knie, Ferse)',
        'Systematische Risikoeinschätzung und Pflegemaßnahmen lückenlos dokumentieren',
        'Ausreichende Flüssigkeitszufuhr und bedarfsgerechte Ernährung beachten'
      ],
      clinicalFocus: [
        {
          phase: '1. Risikoeinschätzung (Assessment)',
          icon: 'bi-clipboard2-pulse',
          detail: 'Systematische Beurteilung des Dekubitusrisikos bei Aufnahme und bei jeder Veränderung des Gesundheitszustands mittels klinischer Beobachtung und Fingertest.'
        },
        {
          phase: '2. Bewegungsförderung & Druckentlastung',
          icon: 'bi-person-walking',
          detail: 'Individuelle Bewegungspläne, regelmäßige Umlagerung (z. B. 30°-Schräglagerung, Mikrolagerungen) und Einsatz druckentlastender Spezialmatratzen.'
        },
        {
          phase: '3. Hautpflege & Inspektion',
          icon: 'bi-eye-fill',
          detail: 'Kontinuierliche Inspektion gefährdeter Knochenpunkte (Kreuzbein, Fersen, Trochanter major). Schutz vor Feuchtigkeit (Inkontinenz) und Scherkräften.'
        },
        {
          phase: '4. Schulung & Beratung',
          icon: 'bi-chat-heart-fill',
          detail: 'Aktive Information und Einbindung von Patienten sowie Angehörigen bezüglich Eigenbewegung und frühzeitiger Entlastungstechniken.'
        }
      ]
    },
    sturz: {
      id: 'sturz',
      topic: 'Sturzprophylaxe in der Pflege',
      title: 'Expertenstandard Sturzprophylaxe in der Pflege – Umsetzung an der Universitätsmedizin Frankfurt (UMF)',
      shortTitle: 'Sturzprophylaxe',
      accentColor: '#4d7c0f',
      badgeBg: 'rgba(77, 124, 15, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #365314 0%, #65a30d 100%)',
      icon: 'bi-shield-exclamation',
      videoUrl: 'https://www.youtube.com/watch?v=yURnsfEGEZc&list=PLMSXl89VJ21rD1MgfqWltS0pyd-JElfNc&index=22',
      videoId: 'yURnsfEGEZc',
      roXtraIds: ['138896', '275545'],
      image: 'assets/umf-sturz.jpg',
      pdfUrl: 'assets/umf-expertenstandards-folien.pdf#page=2',
      pdfPage: 2,
      graphicImage: 'assets/graphic-sturz.jpg',
      leadText: 'Sichere Maßnahmen zur Vermeidung von Stürzen – Sicherheit, Mobilität und Lebensqualität in der Pflege an der Universitätsmedizin Frankfurt.',
      instructions: 'Erfahren Sie mehr über den Expertenstandard Sturzprophylaxe in der Pflege, in dem Sie den QR – Code scannen und sich das Video anschauen. Weiterführende Informationen zu diesem Expertenstandard finden Sie auch im roXtra unter der ID: 138896 sowie der ID: 275545.',
      whyImportant: [
        'Stürze vermeiden (Verletzungen & Sturzfolgen wirksam verhindern)',
        'Mobilität fördern (Regelmäßige Mobilisation sicher unterstützen)',
        'Sicherheit stärken (Stolperfallen vermeiden & Hilfsmittel nutzen)',
        'Lebensqualität & Eigenständigkeit im Klinikalltag erhalten'
      ],
      keyPoints: [
        'Sturzrisiko einschätzen: Regelmäßig beurteilen (z. B. mit validierten Assessment-Instrumenten) und individuelle Risikofaktoren beachten.',
        'Geeignete Hilfsmittel nutzen: z. B. Gehstock, Rollator oder Haltegriffe passend auswählen und sicher anwenden.',
        'Rutschfeste Schuhe anziehen: Geschlossenes, gut sitzendes Schuhwerk oder Socken mit rutschfester Sohle verwenden.',
        'Klingel erreichbar platzieren: Rufklingel sowie persönliche Gegenstände stets in direkter Reichweite des Patienten positionieren.',
        'Bett in niedriger Position: Bett auf eine sichere, niedrige Höhe einstellen und bei Bedarf Seitengitter nutzen.',
        'Umgebung sichern und Stolperfallen vermeiden: Für einen aufgeräumten, gut beleuchteten, rutschfreien und hindernisfreien Bereich sorgen.'
      ],
      clinicalFocus: [
        {
          phase: '1. Sturzrisiko-Identifikation',
          icon: 'bi-search',
          detail: 'Ganzheitliche Erfassung von personenbezogenen Risikofaktoren (Gangbild, Muskelschwäche, Sehschärfe, sedierende Medikation, Delir).'
        },
        {
          phase: '2. Umgebungsgestaltung & Sicherheit',
          icon: 'bi-building-check',
          detail: 'Beseitigung von Stolperfallen, adäquate Ausleuchtung bei Tag und Nacht, Bereitstellung von rutschfestem Schuhwerk und Niedrigbetten.'
        },
        {
          phase: '3. Hilfsmittel & Mobilisation',
          icon: 'bi-person-arms-up',
          detail: 'Sorgfältige Anpassung und Einübung von Gehhilfen (Rollatoren, Unterarmgehstützen), Förderung des sicheren Aufstehens und Transfers.'
        },
        {
          phase: '4. Post-Sturz-Management',
          icon: 'bi-journal-medical',
          detail: 'Unverzügliche ärztliche Abklärung, Vitalparameter-Check, strukturierte Sturzprotokollierung und Ursachenanalyse zur Rezidivvermeidung.'
        }
      ]
    },
    schmerz: {
      id: 'schmerz',
      topic: 'Schmerzmanagement in der Pflege',
      title: 'Expertenstandard Schmerzmanagement in der Pflege – Umsetzung an der Universitätsmedizin Frankfurt (UMF)',
      shortTitle: 'Schmerzmanagement',
      accentColor: '#b45309',
      badgeBg: 'rgba(180, 83, 9, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
      icon: 'bi-heart-pulse-fill',
      videoUrl: 'https://www.youtube.com/watch?v=SDqDYqx5OEc&list=PLMSXl89VJ21rD1MgfqWltS0pyd-JElfNc&index=23',
      videoId: 'SDqDYqx5OEc',
      roXtraIds: ['399503', '399486'],
      image: 'assets/umf-schmerz.jpg',
      pdfUrl: 'assets/umf-expertenstandards-folien.pdf#page=3',
      pdfPage: 3,
      graphicImage: 'assets/graphic-schmerz.jpg',
      leadText: 'Schmerzen erkennen, einschätzen und wirksam lindern – Wissen, Sicherheit und Qualität in der Pflege an der Universitätsmedizin Frankfurt.',
      instructions: 'Erfahren Sie mehr über den Expertenstandard Schmerzmanagement in der Pflege, in dem Sie den QR – Code scannen und sich das Video anschauen. Weiterführende Informationen zu diesem Expertenstandard finden Sie auch im roXtra unter der ID: 399503 sowie der ID: 399486.',
      whyImportant: [
        'Schmerzen lindern (Gezielte & zeitgerechte Schmerztherapie)',
        'Komfort fördern (Wohlbefinden, Ruhe & Mobilität unterstützen)',
        'Sicherheit gewährleisten (Komplikationen & Chronifizierung vermeiden)',
        'Individuelle Schmerzäußerung ernst nehmen (Subjektives Empfinden)'
      ],
      keyPoints: [
        'Schmerzen systematisch erfassen: Regelmäßig erheben – spezifische Schmerzqualität, Lokalisation, Dauer, Auslöser und bisherige Maßnahmen.',
        'Schmerzskalen anwenden: z. B. Numerische Rating Skala (NRS 0–10 von kein Schmerz bis stärkster Schmerz) regelmäßig nutzen.',
        'Patienten beobachten und befragen: Körpersprache, verbale Äußerungen, Mimik, Unruhe und Schonhaltungen beachten und ernst nehmen.',
        'Maßnahmen umsetzen: Ärztliche Verordnung durchführen sowie nicht-medikamentöse Maßnahmen (Lagerung, Wärme/Kälte, Entspannung, Ablenkung) kombinieren.',
        'Wirkung kontrollieren: Schmerzintensität erneut beurteilen, Wirksamkeit überprüfen und bei unzureichender Wirkung frühzeitig Rücksprache halten.',
        'Dokumentation und Weitergabe: Schmerzerfassung, Verlauf, durchgeführte Maßnahmen und Wirkung dokumentieren sowie im Team weitergeben.'
      ],
      clinicalFocus: [
        {
          phase: '1. Schmerzerfassung („Haben Sie Schmerzen?“)',
          icon: 'bi-emoji-frown-fill',
          detail: 'Initiale und wiederkehrende strukturierte Schmerzerfassung mittels Numerischer Ratingskala (NRS 0-10), VAS oder Verhaltensskalen bei kognitiver Einschränkung.'
        },
        {
          phase: '2. Medikamentöse Analgesie',
          icon: 'bi-capsule',
          detail: 'Zeitgerechte und präventive Verabreichung verordneter Schmerzmittel vor schmerzhaften Eingriffen, Überwachung von Wirkung und Nebenwirkungen.'
        },
        {
          phase: '3. Nicht-medikamentöse Interventionen',
          icon: 'bi-hand-thumbs-up-fill',
          detail: 'Entlastende Lagerungsmethoden, Kälte- oder Wärmeanwendungen, begleitende Zuwendung, Atem- und Entspannungstechniken.'
        },
        {
          phase: '4. Kontinuierliche Re-Evaluation',
          icon: 'bi-graph-up-arrow',
          detail: 'Laufende Überprüfung des Therapieerfolgs bei Ruhe und Belastung sowie lückenlose Dokumentation im Pflegebericht.'
        }
      ]
    },
    ernaehrung: {
      id: 'ernaehrung',
      topic: 'Expertenstandard Ernährungsmanagement zur Sicherung der oralen Ernährung in der Pflege',
      title: 'Expertenstandard Ernährungsmanagement zur Sicherung der oralen Ernährung in der Pflege – Umsetzung an der Universitätsmedizin Frankfurt (UMF)',
      shortTitle: 'Ernährungsmanagement',
      accentColor: '#0369a1',
      badgeBg: 'rgba(3, 105, 161, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%)',
      icon: 'bi-egg-fried',
      videoUrl: 'https://www.youtube.com/watch?v=2lgBPbIrICc&list=PLMSXl89VJ21rD1MgfqWltS0pyd-JElfNc&index=21',
      videoId: '2lgBPbIrICc',
      roXtraIds: ['408310', '408331'],
      image: 'assets/umf-ernaehrung.jpg',
      pdfUrl: 'assets/umf-expertenstandards-folien.pdf#page=4',
      pdfPage: 4,
      graphicImage: 'assets/graphic-ernaehrung.jpg',
      leadText: 'Sicherung der oralen Ernährung in der Pflege – Gut ernährt, mehr Lebensqualität! Wissen, Sicherheit und Qualität an der Universitätsmedizin Frankfurt.',
      instructions: 'Erfahren Sie mehr über den Expertenstandard Ernährungsmanagement zur Sicherung der oralen Ernährung in der Pflege, in dem Sie den QR – Code scannen und sich das Video anschauen. Weiterführende Informationen zu diesem Expertenstandard finden Sie auch im roXtra unter der ID: 408310 sowie der ID: 408331.',
      whyImportant: [
        'Mangelernährung vermeiden (Früherkennung & bedarfsgerechte Kost)',
        'Selbstständigkeit fördern (Individuelle Hilfe & Hilfsmittel bereitstellen)',
        'Flüssigkeitszufuhr sichern (Trinkmenge beobachten & motivieren)',
        'Lebensqualität & Genuss beim Essen erhalten'
      ],
      keyPoints: [
        'Ernährungszustand einschätzen: Gewicht (BMI) und Verlauf beobachten, Essverhalten erfassen und Risiko für Mangelernährung erkennen (z. B. MNA).',
        'Essbiografie und Vorlieben beachten: Persönliche Essgewohnheiten, kulturelle/religiöse Aspekte, Abneigungen und Lieblingsspeisen einbeziehen.',
        'Beim Essen unterstützen: Individuelle Hilfe anbieten, angemessene Sitzposition sichern, Zeit und Geduld geben sowie Eigenständigkeit fördern.',
        'Ausreichend trinken fördern: Trinkmenge beobachten, Lieblingsgetränke anbieten, regelmäßig zum Trinken motivieren und Trinkhilfen nutzen.',
        'Mahlzeiten ansprechend anbieten: Appetitliche Zubereitung, kleine bedarfsgerechte Portionen, angenehme Essatmosphäre sowie Temperatur & Konsistenz beachten.',
        'Nahrungsaufnahme dokumentieren: Menge und Art im Ess-/Trinkprotokoll erfassen, Flüssigkeitsbilanz führen und Auffälligkeiten im Team weitergeben.'
      ],
      clinicalFocus: [
        {
          phase: '1. Screening auf Mangelernährung',
          icon: 'bi-clipboard-check',
          detail: 'Erfassung von unbeabsichtigtem Gewichtsverlust, reduziertem Appetit, verminderter Nahrungsaufnahme und Dysphagie bei Aufnahme.'
        },
        {
          phase: '2. Gestaltung der Essumgebung & Hilfestellung',
          icon: 'bi-cup-straw',
          detail: 'Ruhige Atmosphäre, adäquate Sitzposition (90° Aufrichtung), ansprechende Darreichung, angepasste Kostkonsistenz und Hilfsmittel.'
        },
        {
          phase: '3. Nährstoff- & Flüssigkeitsoptimierung',
          icon: 'bi-water',
          detail: 'Führung von Trink- und Ernährungsprotokollen, energiereiche Zwischenmahlzeiten und kontinuierliches Angebot bevorzugter Getränke.'
        },
        {
          phase: '4. Interprofessionelle Zusammenarbeit',
          icon: 'bi-people-fill',
          detail: 'Bedarfsgerechter Einbezug von Logopädie, Diätassistenten und Ärzten zur gemeinsamen Anpassung der Ernährungsstrategie.'
        }
      ]
    },
    zvk: {
      id: 'zvk',
      topic: 'Zentraler Venenkatheter (ZVK) – Sicherer Umgang auf der Intensivstation',
      title: 'Zentraler Venenkatheter (ZVK) – Sicherer Umgang auf der Intensivstation',
      shortTitle: 'ZVK Intensivpflege',
      accentColor: '#e11d48',
      badgeBg: 'rgba(225, 29, 72, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #881337 0%, #e11d48 100%)',
      icon: 'bi-droplet-half',
      videoUrl: (typeof window !== 'undefined' && window.location ? window.location.origin + window.location.pathname + '#/zvk' : 'http://localhost:3000/#/zvk'),
      videoId: 'zvk_poster',
      sopPdfUrl: 'assets/zvk-sop-verfahrensanweisung.pdf',
      roXtraIds: ['391904', '484866', '456904', '414354', '414362'],
      roXtraDetails: {
        '391904': 'Verfahrensanweisung ZVK (Ver. 002/09.2024)',
        '484866': 'OMW ZVK Verbandswechsel (Ver. 001/07.2026)',
        '456904': 'OMW - Infusionsfilter (Ver. 001/08.2025)',
        '414354': 'Standard-Infusionsschema ITS (Ver. 001/05.2024)',
        '414362': 'Meldeformular für Inkompatibilitäten'
      },
      image: 'assets/zvk-poster.jpg',
      pdfUrl: 'assets/zvk-sop-verfahrensanweisung.pdf#page=1',
      pdfPage: 1,
      sopPdfUrl: 'assets/zvk-sop-verfahrensanweisung.pdf',
      infusionsschemaImage: 'assets/zvk-standard-infusionsschema.jpg',
      infusionsschemaPdfUrl: 'assets/zvk-sop-verfahrensanweisung.pdf#page=10',
      graphicImage: 'assets/graphic-zvk.jpg',
      leadText: 'Einsatz von SOPs auf der Intensivstation – Schnell. Sicher. Gemeinsam. Ein ZVK dient der sicheren zentralvenösen Therapie. Ein aseptischer Umgang hilft, Infektionen und Komplikationen zu vermeiden.',
      instructions: 'Scannen Sie den QR-Code, um die vollständige Verfahrensanweisung (SOP) sowie klinische Checklisten zum ZVK aufzurufen. Weiterführende Dokumente im roXtra unter ID: 391904, ID: 484866, ID: 456904 und ID: 414354.',
      whyImportant: [
        'Infektionen vermeiden (Katheter-assoziierte Infektionen / CLABSI verhindern)',
        'Durchgängigkeit sichern (Okklusion, Verschluss & Thrombose vermeiden)',
        'Sichere Anwendung (Aseptisches Arbeiten & Händedesinfektion vor jedem Kontakt)',
        'Früherkennung von Komplikationen & lückenlose Dokumentation'
      ],
      keyPoints: [
        'Lage und Zugänge verstehen: Lage und Verlauf kennen (V. jugularis interna, V. subclavia, V. femoralis), Einlageort prüfen und Anzahl der Lumen erkennen.',
        'Verband steril und trocken halten: Sterilen Verband erhalten, täglich auf Sitz und Dichtigkeit kontrollieren; bei Feuchtigkeit, Verschmutzung oder Ablösung sofort wechseln.',
        'Lumen korrekt nutzen: Distales, mediales und proximales Lumen eindeutig kennzeichnen und bestimmungsgemäß nutzen; vor/nach Gabe spülen & Kompatibilität beachten.',
        'Pulsatile Spültechnik anwenden: Mit 10 ml NaCl 0,9 % spülen (Spritze ≥ 10 ml), pulsierend spülen (Druck-Pause), um Verschluss durch Blutreste/Medikamente zu verhindern.',
        'Filter und Infusionswege beachten: 1,2 µm Filter für fetthaltige Lösungen (Propofol, TPN), 0,2 µm Filter für wässrige Lösungen; Systeme prüfen & Wechsel gemäß Standard.',
        'Infektionszeichen früh erkennen: Auf Rötung, Schwellung, Überwärmung, Schmerzen, Fieber & Entzündungswerte achten; bei Verdacht sofort melden & ärztliche Maßnahme einleiten.'
      ],
      clinicalFocus: [
        {
          phase: '1. Einstichstellen-Inspektion & Infektionskontrolle',
          icon: 'bi-eye-fill',
          detail: 'Tägliche Kontrolle auf Rötung, Druckschmerz, Induration und eitrige Sekretion. Sofortige Händedesinfektion vor jeder Berührung. Konsequente Non-Touch-Technik.'
        },
        {
          phase: '2. Aseptischer Verbandswechsel & Hautschutz',
          icon: 'bi-bandaid-fill',
          detail: 'Hautantiseptik mit Octenidin (60 Sek. EWZ). Vollständiges Trocknen abwarten. Hautschutz mit Cavilon®. Zugentlastung anbringen. KMT-Besonderheit: Fixierung mit steriler Kompresse & Fixomull auf dem Hemd.'
        },
        {
          phase: '3. Pulsatile Spültechnik & Druckbegrenzung',
          icon: 'bi-droplet-fill',
          detail: 'Ausschließlich Spritzen ≥ 10 ml verwenden zur Vermeidung schädlicher Druckspitzen. Pulsatile Flush-Methode mit 10 ml NaCl 0,9 % (6–10 kurze Stop-and-Go-Impulse). Vor und nach Medikamenten spülen.'
        },
        {
          phase: '4. Infusionsfilter & Systemhygiene',
          icon: 'bi-diagram-3-fill',
          detail: '0,2 µm Partikelfilter (Intrapur Plus) für 96 h; 1,2 µm Lipidfilter (Intrapur Lipid) für 24 h. 3-Wege-Hähne alle 96 h wechseln (nach Blut- oder Fettlösungen nach 24 h). Klemmen unbenutzter Schenkel schließen.'
        },
        {
          phase: '5. Kurvendokumentation & Liegedauer-Indikation',
          icon: 'bi-journal-check',
          detail: 'Tägliche Dokumentation unter „Zugänge“ in der Kurve (im ITS-Setting pro Schicht). Tägliche kritische Re-Evaluation der ZVK-Notwendigkeit zur frühzeitigen Entfernung (CRBSI-Prävention).'
        }
      ]
    },
    isolation: {
      id: 'isolation',
      topic: 'Isolation & Hygiene – Vorgehen bei MRE, VRE, MRGN, MRSA & C. diff.',
      title: 'Isolation & Hygiene – Allgemeines Vorgehen bei Isolation und Reinigung',
      shortTitle: 'Isolation & Hygiene',
      accentColor: '#0284c7',
      badgeBg: 'rgba(2, 132, 199, 0.12)',
      bannerGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
      icon: 'bi-shield-check',
      videoUrl: (typeof window !== 'undefined' && window.location ? window.location.origin + window.location.pathname + '#/isolation' : 'http://localhost:3000/#/isolation'),
      videoId: 'isolation_poster',
      sopPdfUrl: 'assets/isolation-sop-verfahrensanweisung.pdf',
      roXtraIds: ['239411', '361678'],
      roXtraDetails: {
        '239411': 'Verfahrensanweisung Allgemeines Vorgehen bei Isolation und Reinigung (Ver. 003/08.2019, 4 Seiten)',
        '361678': 'Hygieneplan: Umgang mit multiresistenten und anderen hygienerelevanten Erregern (Häma-Onko, ITS/IMC, Neonat., Ver. 012/02.2026, 5 Seiten)'
      },
      sopDocuments: [
        {
          id: 'iso-sop',
          title: 'Verfahrensanweisung: Allgemeines Vorgehen bei Isolation und Reinigung',
          shortTitle: '1. SOP Isolation & Reinigung',
          roXtraId: '239411',
          version: '003',
          date: '19.08.2019',
          dateLabel: 'Stand: 19.08.2019',
          pageCount: 4,
          pdfUrl: 'assets/isolation-sop-verfahrensanweisung.pdf',
          lead: 'Offizielle UKF Verfahrensanweisung (ID 239411 • Freigabe: 19.08.2019 • Ver. 003) – 4 Seiten. Isolationsformen, PSA-Vorgaben, Meldewege und Schlussdesinfektion.'
        },
        {
          id: 'iso-hygieneplan',
          title: 'Hygieneplan: Umgang mit multiresistenten & hygienerelevanten Erregern',
          shortTitle: '2. Hygieneplan MRE (ITS/IMC)',
          roXtraId: '361678',
          version: '012',
          date: '02.2026',
          dateLabel: 'Stand: 02.2026',
          pageCount: 5,
          pdfUrl: 'assets/hygieneplan-multiresistente-erreger.pdf',
          lead: 'Offizieller UKF Hygieneplan (ID 361678 • Stand: 02.2026 • Ver. 012) – 5 Seiten. Häma-Onko (Station+TK), ITS/IMC, Neonatologie.'
        }
      ],
      image: 'assets/isolation-poster.jpg',
      pdfUrl: 'assets/isolation-sop-verfahrensanweisung.pdf#page=1',
      pdfPage: 1,
      graphicImage: 'assets/graphic-isolation.jpg',
      leadText: 'Hygiene schützt – Gemeinsam für Patienten und Mitarbeitende. Schneller Zugriff auf den aktuellen Hygieneplan und alle wichtigen Handlungsleitfäden bei MRE- und Infektionsnachweis.',
      instructions: 'Scannen Sie den QR-Code, um die vollständige Verfahrensanweisung (SOP) sowie Hygienerichtlinien zur Isolation aufzurufen. Weiterführende Dokumente im QM-System unter ID-Nr.: 239411 und ID-Nr.: 361678.',
      whyImportant: [
        'Übertragung verhindern (Infektionsketten konsequent unterbrechen)',
        'Patienten schützen (Schutz vor nosokomialen Infektionen & MRE)',
        'Team sicher arbeiten lassen (Konsequente PSA & Händehygiene)',
        'Zielgerichtete Flächendesinfektion & sachgerechte Entsorgung'
      ],
      keyPoints: [
        'Indikation zur Isolation prüfen: Bei Nachweis oder begründetem Verdacht auf übertragbare Erreger (VRE, MRGN, MRSA, C. diff.) Schutzmaßnahmen sofort einleiten.',
        'Schutzkleidung richtig anlegen: Je nach Übertragungsweg Schutzkittel, Handschuhe, Mund-Nasen-Schutz / FFP2 bei Bedarf und ggf. Schutzbrille tragen.',
        'Händedesinfektion konsequent durchführen: Vor und nach Patientenkontakt, nach Kontakt mit kontaminierten Flächen sowie nach dem Ablegen der Schutzkleidung.',
        'Patientennahe Flächen desinfizieren: Bett, Nachttisch, Türgriffe, Rufanlage und häufig berührte Flächen regelmäßig nach Hygieneplan aufbereiten.',
        'Material patientenbezogen verwenden: Pflegeutensilien und Medizinprodukte möglichst nur für diesen Patienten nutzen oder direkt sachgerecht aufbereiten.',
        'Abfall und Wäsche korrekt entsorgen: Kontaminierte Materialien und Wäsche im Zimmer nach den geltenden Hygienevorgaben sicher sammeln und entsorgen.'
      ],
      clinicalFocus: [
        {
          phase: '1. Isolationsform & Farbleitsystem',
          icon: 'bi-door-closed-fill',
          detail: 'Festlegung der Isolationsform (Zimmer vs. Bettplatz) gemäß Erregernachweis. Anbringen der offiziellen UKF-Türbeschilderung (Farbleitsystem außen gelb / innen pink).'
        },
        {
          phase: '2. Persönliche Schutzausrüstung (PSA)',
          icon: 'bi-person-badge-fill',
          detail: 'Konsequentes Anlegen von Schutzkittel und Einmalhandschuhen vor Betreten des Patientenzimmers. Bei Aerosol- oder Tröpfchenrisiko zusätzlich FFP2-/Mund-Nasen-Schutz.'
        },
        {
          phase: '3. Händehygiene (Besonderheit C. difficile)',
          icon: 'bi-hand-index-thumb-fill',
          detail: 'Händedesinfektion vor und nach jedem Patientenkontakt. ACHTUNG C. diff: Sporen sind alkoholfest – zwingend ERST gründlich Händewaschen mit Seife, danach Desinfektion!'
        },
        {
          phase: '4. Gezieltes Abrüsten & Materialentsorgung',
          icon: 'bi-trash3-fill',
          detail: 'Nur Tagesbedarf im Patientenzimmer lagern. Materialien mit direktem Patientenkontakt verwerfen (bei ACBA 4MRGN alles verwerfen). Vorhänge bei Schlussdesinfektion austauschen.'
        },
        {
          phase: '5. Verlegung & Schlussdesinfektion',
          icon: 'bi-stars',
          detail: 'Nach Entlassung oder Verlegung: Vollständige Wisch-Schlussdesinfektion aller patientennahen Kontaktflächen. Bei VRE/MRGN/ACBA Information an die Hygienefachkraft für Umweltabstriche.'
        }
      ]
    }
  };

  function detectUmfStandard(rawText) {
    if (!rawText) return null;
    const lower = rawText.toLowerCase();

    if (lower.includes('loee8kfpa_s') || lower.includes('400139') || lower.includes('400129') || lower.includes('dekubitus')) {
      return UMF_STANDARDS.dekubitus;
    }
    if (lower.includes('yurnsfegezc') || lower.includes('138896') || lower.includes('275545') || lower.includes('sturz')) {
      return UMF_STANDARDS.sturz;
    }
    if (lower.includes('sdqdyqx5oec') || lower.includes('sqdyqx5oec') || lower.includes('399503') || lower.includes('399486') || lower.includes('schmerz')) {
      return UMF_STANDARDS.schmerz;
    }
    if (lower.includes('2lgbpbiricc') || lower.includes('408310') || lower.includes('408331') || lower.includes('ernährung') || lower.includes('ernaehrung')) {
      return UMF_STANDARDS.ernaehrung;
    }
    if (lower.includes('391904') || lower.includes('484866') || lower.includes('456904') || lower.includes('414354') || lower.includes('zvk') || lower.includes('katheter') || lower.includes('venenkatheter') || lower.includes('zentraler')) {
      return UMF_STANDARDS.zvk;
    }
    if (lower.includes('239411') || lower.includes('361678') || lower.includes('isolation') || lower.includes('hygiene') || lower.includes('mre') || lower.includes('mrsa') || lower.includes('mrgn') || lower.includes('vre') || lower.includes('difficile')) {
      return UMF_STANDARDS.isolation;
    }

    return null;
  }

  function parse(rawText) {
    if (!rawText || typeof rawText !== 'string') {
      return { type: 'unknown', title: 'Unbekannter Code', raw: '' };
    }

    const trimmed = rawText.trim();
    const matched = detectUmfStandard(trimmed);

    if (matched) {
      return {
        type: 'umf_standard',
        standard: matched,
        raw: trimmed
      };
    }

    return {
      type: 'unknown',
      title: 'Unbekannter QR-Code',
      raw: trimmed
    };
  }

  const exported = {
    parse,
    UMF_STANDARDS,
    detectUmfStandard
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  return exported;
})();
