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
      ],
      checklists: [
        {
          id: 'dek-positioning',
          title: '30°-Schräglagerung & Fersenfreilagerung',
          shortTitle: '30°-Lagerung',
          subtitle: 'Expertenstandard Dekubitusprophylaxe (ID: 400139 / 400129)',
          badge: 'Druckentlastung',
          docuSnippet: 'Dekubitusprophylaxe durchgeführt: Hautinspektion Prädilektionsstellen reizlos, Fingertest negativ. 30°-Schräglagerung durchgeführt. Fersen vollständig freigelagert (Schwebeferse). Mikrobewegungen unterstützt.',
          phases: [
            {
              name: 'Phase 1: Hautinspektion & Risikostatus',
              icon: 'bi-eye-fill',
              items: [
                { id: 'dek-1', text: 'Prädilektionsstellen inspizieren: Kreuzbein, Fersen, Trochanter, Schulterblätter, Ohren' },
                { id: 'dek-2', text: 'Fingertest bei jeder Rötung: Wegdrückbar = Grad 1 Risiko / Nicht wegdrückbar = Dekubitus Grad 1' },
                { id: 'dek-3', text: 'Hauttrockenheit & Inkontinenzstatus prüfen (Cavilon / Hautschutz auftragen)' }
              ]
            },
            {
              name: 'Phase 2: Durchführung 30°-Lagerung & Entlastung',
              icon: 'bi-person-lines-fill',
              items: [
                { id: 'dek-4', text: 'Patienten auf die Seite drehen, Lagerungskeil / großes Kissen unter Rücken & Becken platzieren' },
                { id: 'dek-5', text: 'Rückdrehung auf 30° Neigungswinkel: Sakralbereich & Steißbein vollständig druckentlastet' },
                { id: 'dek-6', text: 'Knie- und Knöchelbereich mit weichem Kissen abpuffern (kein direkter Knochenkontakt)' },
                { id: 'dek-7', text: 'Fersenfreilagerung: Kissen unter Unterschenkel, Fersen schweben frei ohne Matratzenkontakt' }
              ]
            },
            {
              name: 'Phase 3: Bettklima & Dokumentation',
              icon: 'bi-clipboard-check-fill',
              items: [
                { id: 'dek-8', text: 'Bettwäsche & Unterlagen glattziehen (Faltenbildung & Scherkräfte vermeiden)' },
                { id: 'dek-9', text: 'Umlagerungsintervall festlegen (alle 2–3 Std. bzw. individueller Bewegungsplan)' },
                { id: 'dek-10', text: 'Dokumentation im KIS / Kurve: Hautstatus, Lagerungsart & Uhrzeit eintragen' }
              ]
            }
          ]
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
      ],
      checklists: [
        {
          id: 'sturz-safety',
          title: 'Bedside-Sicherheits-Check Sturzprophylaxe',
          shortTitle: 'Sicherheits-Check',
          subtitle: 'Expertenstandard Sturzprophylaxe (ID: 138896 / 275545)',
          badge: 'Patientensicherheit',
          docuSnippet: 'Sturzprophylaxe Bedside-Check: Bett in niedrigster Position, Bremsen arretiert. Rufanlage & Lichtschalter in greifbarer Reichweite. Rutschfestes Schuhwerk bereitgestellt. Gehstütze am Bett fixiert.',
          phases: [
            {
              name: 'Phase 1: Bett- & Raumumgebung',
              icon: 'bi-building-check',
              items: [
                { id: 'sturz-1', text: 'Bett in niedrigste Position (Floor-Bed / Niederflurbett) gefahren' },
                { id: 'sturz-2', text: 'Bettbremsen beidseits fest arretiert & Funktionsprüfung' },
                { id: 'sturz-3', text: 'Laufwege frei: Kabel, Taschen, Infusionsschläuche & Stolperfallen beseitigt' },
                { id: 'sturz-4', text: 'Nachtbeleuchtung / Orientierungslicht eingeschaltet' }
              ]
            },
            {
              name: 'Phase 2: Patientennahe Hilfsmittel & Erreichbarkeit',
              icon: 'bi-bell-fill',
              items: [
                { id: 'sturz-5', text: 'Patientenrufklingel in direkter Griffweite am Bett oder am Körper fixiert' },
                { id: 'sturz-6', text: 'Sehhilfe (Brille) & Hörgerät griffbereit auf dem Nachttisch platziert' },
                { id: 'sturz-7', text: 'Individuelle Gehhilfen (Rollator, Unterarmgehstützen) griffbereit am Bett arretiert' },
                { id: 'sturz-8', text: 'Trinkbecher & persönliche Gegenstände ohne Vorbeugen erreichbar' }
              ]
            },
            {
              name: 'Phase 3: Kleidung & Transferabsprache',
              icon: 'bi-person-check-fill',
              items: [
                { id: 'sturz-9', text: 'Rutschfestes Schuhwerk mit Fersenhalt (oder ABS-Antirutschsocken) angezogen' },
                { id: 'sturz-10', text: 'Patient instruiert: Bei Aufstehwunsch immer Pflegeklingel betätigen' },
                { id: 'sturz-11', text: 'Sturzrisiko im KIS / Kurve aktualisiert & Übergabe an Team' }
              ]
            }
          ]
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
      ],
      checklists: [
        {
          id: 'schmerz-assessment',
          title: 'Akutschmerz-Erfassung & Re-Evaluation',
          shortTitle: 'Schmerzerfassung',
          subtitle: 'Expertenstandard Schmerzmanagement (ID: 399503 / 399486)',
          badge: 'Schmerztherapie',
          timerSeconds: 30,
          timerLabel: 'Händehygiene & Vorbereitung (30 Sek.)',
          docuSnippet: 'Schmerzerfassung: NRS in Ruhe: [ ] / bei Bewegung: [ ]. Lokalisation: [ ]. Schmerzcharakter: [stechend/dumpf/brennend]. Bedarfsmedikation nach WHO-Schema verabreicht. Re-Evaluation nach 30-60 Min. dokumentiert.',
          phases: [
            {
              name: 'Phase 1: Strukturierte Schmerzerfassung',
              icon: 'bi-heart-pulse-fill',
              items: [
                { id: 'schm-1', text: 'Schmerzintensität mit NRS (0–10) in Ruhe und bei Bewegung/Atmung erheben' },
                { id: 'schm-2', text: 'Schmerzlokalisation & Schmerzcharakter (brennend, stechend, dumpf, krampfartig) erfragen' },
                { id: 'schm-3', text: 'Ausstrahlung, zeitlicher Verlauf & Schmerzauslöser identifizieren' },
                { id: 'schm-4', text: 'Bei kognitiver Einschränkung: Fremdeinschätzung mit BESD-Skala (Mimik, Lautäußerung, Körpersprache)' }
              ]
            },
            {
              name: 'Phase 2: Maßnahmen & Analgetikagabe',
              icon: 'bi-capsule',
              items: [
                { id: 'schm-5', text: 'Ärztlich verordnete Bedarfsmedikation nach WHO-Stufenschema prüfen' },
                { id: 'schm-6', text: 'Nicht-medikamentöse Maßnahmen ergänzen (schonende Entlastungslagerung, Kälte/Wärme, Zuwendung)' },
                { id: 'schm-7', text: 'Patient über Wirkungszeitraum und mögliche Nebenwirkungen (Übelkeit, Sedierung) aufklären' }
              ]
            },
            {
              name: 'Phase 3: Re-Evaluation & Dokumentation',
              icon: 'bi-stopwatch-fill',
              items: [
                { id: 'schm-8', text: 'Re-Evaluation der Schmerzstärke nach 30 Min. (i.v.) bzw. 60 Min. (oral/subkutan)' },
                { id: 'schm-9', text: 'Dokumentation im Schmerzprotokoll / Kurve (Ausgangs-NRS, Maßnahme, Re-Evaluations-NRS)' },
                { id: 'schm-10', text: 'Bei persistierenden Schmerzen (NRS > 4): Rücksprache mit Stationsarzt / Schmerzdienst' }
              ]
            }
          ]
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
      ],
      checklists: [
        {
          id: 'ern-assessment',
          title: 'Mangelernährungs- & Schluck-Check',
          shortTitle: 'Ernährungs-Check',
          subtitle: 'Expertenstandard Ernährungsmanagement (ID: 408310 / 408331)',
          badge: 'Ernährung',
          docuSnippet: 'Ernährungsmanagement: Risikoscreening durchgeführt. Zahnprothese sitzt korrekt. Patient 90° aufrecht gelagert. Schluckakt unauffällig. Nahrungskonsistenz angepasst. Trink- & Tellermenge im Protokoll erfasst.',
          phases: [
            {
              name: 'Phase 1: Screening & Mundstatus',
              icon: 'bi-clipboard-check',
              items: [
                { id: 'ern-1', text: 'Screening auf Mangelernährung: Ungewollter Gewichtsverlust in letzten 3–6 Monaten? BMI prüfen' },
                { id: 'ern-2', text: 'Mund- und Zahnstatus kontrollieren: Schleimhaut intakt, Zahnprothesen gereinigt & fester Sitz' },
                { id: 'ern-3', text: 'Schluckvermögen prüfen: Schlucktest (Wasserprobe) bei Verdacht auf Dysphagie' }
              ]
            },
            {
              name: 'Phase 2: Essensumgebung & Vorbereitung',
              icon: 'bi-cup-straw',
              items: [
                { id: 'ern-4', text: 'Patientenvorbereitung: Hand- und Mundhygiene vor der Mahlzeit' },
                { id: 'ern-5', text: 'Optimale Sitzposition: 90° aufrecht im Stuhl oder im Bett mit angezogenen Knien' },
                { id: 'ern-6', text: 'Nahrungskonsistenz anpassen (püriert, flüssig eingedickt, weiche Kost)' },
                { id: 'ern-7', text: 'Hilfsmittel bereitstellen: Schnabelbecher, ergonomisches Besteck, Tellerranderhöhung' }
              ]
            },
            {
              name: 'Phase 3: Nahrungsaufnahme & Nachbereitung',
              icon: 'bi-check2-circle',
              items: [
                { id: 'ern-8', text: 'Angemessenes Reichentempo: Patient bestimmt Schluckrhythmus (keine Überforderung)' },
                { id: 'ern-9', text: 'Patient bleibt nach Mahlzeit mind. 20–30 Min. aufrecht sitzen (Aspirationsprophylaxe)' },
                { id: 'ern-10', text: 'Trinkmenge & Tellermenge (z. B. 1/4, 1/2, 3/4) im KIS-Ernährungsprotokoll erfassen' }
              ]
            }
          ]
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
      sopDocuments: [
        {
          id: 'zvk-sop',
          title: 'Verfahrensanweisung: Zentraler Venenkatheter (ZVK) – Intensivpflege',
          shortTitle: '1. SOP ZVK (Hauptdokument)',
          roXtraId: '391904',
          version: 'Ver. 002 / 09.2024',
          pageCount: 10,
          badge: 'SOP • 10 Seiten',
          icon: 'bi-file-earmark-medical-fill',
          themeColor: '#e11d48',
          pdfUrl: 'assets/zvk-sop-verfahrensanweisung.pdf',
          thumb: 'assets/zvk-sop-thumb.jpg',
          scope: 'Intensivstationen (ITS / IMC) • Zentrum der Chirurgie & Innere Medizin',
          description: 'Standardisierte Verfahrensanweisung für Aseptik, Verbandswechsel, Spültechnik und Infusionsfilter.',
          pages: [
            { pageNum: 1, label: 'S. 1: Deckblatt & SOP Übersicht', image: 'assets/zvk-sop-page-1.jpg' },
            { pageNum: 2, label: 'S. 2: Indikationen & Gefäßwahl', image: 'assets/zvk-sop-page-2.jpg' },
            { pageNum: 3, label: 'S. 3: Hygiene & Vorbereitung', image: 'assets/zvk-sop-page-3.jpg' },
            { pageNum: 4, label: 'S. 4: Aseptischer Verbandswechsel', image: 'assets/zvk-sop-page-4.jpg' },
            { pageNum: 5, label: 'S. 5: Konnektoren & Diskonnektion', image: 'assets/zvk-sop-page-5.jpg' },
            { pageNum: 6, label: 'S. 6: Spültechnik (Push-Pause)', image: 'assets/zvk-sop-page-6.jpg' },
            { pageNum: 7, label: 'S. 7: Infusionsfilter (0,2µm / 1,2µm)', image: 'assets/zvk-sop-page-7.jpg' },
            { pageNum: 8, label: 'S. 8: Blutentnahme & Katheterstilllegung', image: 'assets/zvk-sop-page-8.jpg' },
            { pageNum: 9, label: 'S. 9: Komplikationen & Entfernung', image: 'assets/zvk-sop-page-9.jpg' },
            { pageNum: 10, label: 'S. 10: Standard-Infusionsschema ITS', image: 'assets/zvk-sop-page-10.jpg' }
          ]
        },
        {
          id: 'zvk-hygieneplan',
          title: 'Hygieneplan: Umgang mit multiresistenten & hygienerelevanten Erregern',
          shortTitle: '2. Hygieneplan MRE (ITS/IMC)',
          roXtraId: '361678',
          version: 'Ver. 012 / 02.2026',
          pageCount: 5,
          badge: 'Hygieneplan • 5 Seiten • Neu',
          icon: 'bi-shield-shaded',
          themeColor: '#0284c7',
          pdfUrl: 'assets/zvk-hygieneplan-multiresistente-erreger.pdf',
          thumb: 'assets/zvk-hygieneplan-thumb.jpg',
          scope: 'Häma-Onko (Station+TK) • ITS / IMC • Neonatologie',
          description: 'Umgang mit multiresistenten Erregern (VRE+, 2/3/4MRGN, MRSA, C. diff, Noro, TBC, Covid-19, Auslands-Iso).',
          pages: [
            { pageNum: 1, label: 'S. 1: VRE / MRGN / Candida', image: 'assets/zvk-hygieneplan-page-1.jpg' },
            { pageNum: 2, label: 'S. 2: MRSA / C. diff / Noro', image: 'assets/zvk-hygieneplan-page-2.jpg' },
            { pageNum: 3, label: 'S. 3: Rota / TBC / Influenza', image: 'assets/zvk-hygieneplan-page-3.jpg' },
            { pageNum: 4, label: 'S. 4: Hep / Covid-19 / Auslands I', image: 'assets/zvk-hygieneplan-page-4.jpg' },
            { pageNum: 5, label: 'S. 5: Auslands-Iso II/III & Hinweise', image: 'assets/zvk-hygieneplan-page-5.jpg' }
          ],
          pathogens: [
            {
              id: 'vre',
              name: 'VRE (VRE+)',
              sub: 'Resistenz gg. Linezolid, Tigecyclin, Daptomycin',
              iso: 'Iso- / Einzelzimmer',
              ppe: 'Schutzkittel, Handschuhe am Patienten',
              cleaning: 'Perform Pro 2% Schlussdesinfektion',
              swab: 'Index: keine Entisolation; Kontakt: Entiso wenn 1x neg.',
              sheetPage: 1,
              badgeColor: '#db2777'
            },
            {
              id: 'mrgn',
              name: '3MRGN / 4MRGN',
              sub: 'Multiresistente gramnegative Stäbchen',
              iso: 'Iso- / Einzelzimmer',
              ppe: 'Schutzkittel, Handschuhe am Patienten',
              cleaning: 'Incidin Pro 0,5% (3 MRGN ACBA mit Perform Pro 2%)',
              swab: '3MRGN: 3x neg. (Abst. 1 Wo.) | 4MRGN: 3x neg. (Abst. 1 Mo.)',
              sheetPage: 1,
              badgeColor: '#dc2626'
            },
            {
              id: 'mrsa',
              name: 'MRSA',
              sub: 'Methicillin-resistenter S. aureus',
              iso: 'Iso- / Einzelzimmer, gelber Infektionswäsche-Sack',
              ppe: 'Schutzkittel, Handschuhe, MNS am Patienten',
              cleaning: 'Schlussdesinfektion Incidin Pro 0,5%',
              swab: 'Dekolonisation 5 Tage. Entisolation wenn 3x neg. (Abstand ≥ 24 h)',
              sheetPage: 2,
              badgeColor: '#ea580c'
            },
            {
              id: 'cdiff',
              name: 'C. diff',
              sub: 'Clostridioides difficile (Sporenbildner)',
              iso: 'Iso- / Einzelzimmer',
              ppe: 'Erst Hände waschen, dann desinfizieren! Schutzkittel, Handschuhe',
              cleaning: 'Schlussdesinfektion Perform Pro 2%',
              swab: 'Entisolation: > 48 h Symptomfreiheit',
              sheetPage: 2,
              badgeColor: '#b45309'
            },
            {
              id: 'noro',
              name: 'Norovirus',
              sub: 'Gastroenteritis (mit/ohne Erbrechen/Diarrhoe)',
              iso: 'Iso- / Einzelzimmer',
              ppe: 'Schutzkittel, Handschuhe, MNS vor Betreten des Zimmers',
              cleaning: 'Schlussdesinfektion Perform Pro 2%',
              swab: 'Entisolation: Bis 3 Tage nach Symptomfreiheit',
              sheetPage: 2,
              badgeColor: '#7c3aed'
            },
            {
              id: 'tbc',
              name: 'Offene TBC',
              sub: 'Tuberkulose (Aerosol-Übertragung)',
              iso: 'Iso- / Einzelzimmer, gelber Wäsche-Sack',
              ppe: 'Schutzkittel, Handschuhe, FFP2 vor Betreten des Zimmers!',
              cleaning: 'Schlussdesinfektion Perform Pro 2%',
              swab: 'Untersuchung von Kontaktpersonen gem. Leitlinie 03.2',
              sheetPage: 3,
              badgeColor: '#0284c7'
            },
            {
              id: 'covid',
              name: 'SARS-CoV-2',
              sub: 'Covid-19 Tröpfchen / Aerosol',
              iso: 'Iso- / Einzelzimmer',
              ppe: 'FFP2, Schutzbrille, Haube, Schutzkittel, Handschuhe vor Betreten',
              cleaning: 'Schlussdesinfektion Incidin Pro 0,5%',
              swab: 'Entisolation gem. 05.8 Isolationsmaßnahme',
              sheetPage: 4,
              badgeColor: '#059669'
            }
          ]
        }
      ],
      roXtraIds: ['391904', '361678', '484866', '456904', '414354', '414362'],
      roXtraDetails: {
        '391904': 'Verfahrensanweisung ZVK (Ver. 002/09.2024)',
        '361678': 'Hygieneplan: Multiresistente Erreger ITS/IMC (Ver. 012/02.2026)',
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
      ],
      checklists: [
        {
          id: 'zvk-dressing',
          title: 'Aseptischer ZVK-Verbandswechsel',
          shortTitle: 'Verbandswechsel',
          subtitle: 'Verfahrensanweisung ID: 391904 & OMW ID: 484866',
          badge: 'Aseptisch • 4 Phasen',
          timerSeconds: 60,
          timerLabel: 'Einwirkzeit Hautantiseptikum (mind. 60 Sek.)',
          docuSnippet: 'ZVK-Verbandswechsel aseptisch durchgeführt: Einstichstelle reizlos, trocken, keine Rötung/Schwellung/Sekretion. Hautantiseptik mind. 60 Sek. EWZ vollständig eingehalten. Steriler PU-Folienverband angelegt. Katheterlage unverändert. Nächster Wechsel in 7 Tagen oder bei Bedarf.',
          phases: [
            {
              name: 'Phase 1: Vorbereitung & Hygiene',
              icon: 'bi-box-seam-fill',
              items: [
                { id: 'zvk-d1', text: 'Patienten aufklären & informieren (Flachlagerung, Kopf zur Gegenseite gewandt)' },
                { id: 'zvk-d2', text: 'Hygienische Händedesinfektion (mind. 30 Sek.)' },
                { id: 'zvk-d3', text: 'Mund-Nasen-Schutz für Pflegekraft & Patient anlegen (oder Patient abwenden lassen)' },
                { id: 'zvk-d4', text: 'Steriles Verbandswechsel-Set, Hautantiseptikum (Octeniderm/Kodan) & steriler Folienverband griffbereit' }
              ]
            },
            {
              name: 'Phase 2: Verbandsentfernung & Einstichstellen-Inspektion',
              icon: 'bi-eye-fill',
              items: [
                { id: 'zvk-d5', text: 'Unsterile Handschuhe anlegen & alten Transparentverband vorsichtig von distal nach proximal lösen' },
                { id: 'zvk-d6', text: 'Katheter gegen Herausrutschen / Dislokation sichern (niemals mechanischen Zug ausüben)' },
                { id: 'zvk-d7', text: 'Alten Verband & Handschuhe verwerfen -> Erneute hygienische Händedesinfektion' },
                { id: 'zvk-d8', text: 'Einstichstelle inspizieren: Rötung, Schwellung, Druckschmerz, Sekret/Eiter? cm-Markierung an Haut prüfen' }
              ]
            },
            {
              name: 'Phase 3: Aseptische Desinfektion & Einwirkzeit',
              icon: 'bi-droplet-half',
              hasTimer: true,
              items: [
                { id: 'zvk-d9', text: 'Sterile Handschuhe anlegen oder strikte Non-Touch-Technik mit sterilen Klemmen/Tupfern' },
                { id: 'zvk-d10', text: 'Hautantiseptikum von der Einstichstelle zirkulär nach außen auftragen (Wisch- oder Sprühdesinfektion)' },
                { id: 'zvk-d11', text: 'STRIKTE EINWIRKZEIT: Mindestens 60 Sekunden vollständig an der Luft trocknen lassen (nicht fächern!)' }
              ]
            },
            {
              name: 'Phase 4: Neuer Verband & Dokumentation',
              icon: 'bi-clipboard-check-fill',
              items: [
                { id: 'zvk-d12', text: 'Sterilen PU-Transparentverband mittig, blasen- und spannungsfrei aufkleben' },
                { id: 'zvk-d13', text: 'Katheterflügel und Zuleitungen mit Zugentlastung spannungsfrei fixieren' },
                { id: 'zvk-d14', text: 'Dokumentationsetikett (Datum, Uhrzeit, Handzeichen) am Verbandsrand anbringen' },
                { id: 'zvk-d15', text: 'Dokumentation im KIS / Kurve: Einstichstellenbefund, cm-Markierung, Datum nächster Wechsel' }
              ]
            }
          ]
        },
        {
          id: 'zvk-flush',
          title: 'Konnektorenwechsel & Systemspülung (Push-Pause)',
          shortTitle: 'Konnektoren & Spülung',
          subtitle: 'Scrub the Hub & pulsatile Spültechnik (ID: 391904)',
          badge: 'Hygiene & Prävention',
          timerSeconds: 15,
          timerLabel: 'Scrub-the-Hub Desinfektion (15–30 Sek.)',
          docuSnippet: 'ZVK-Konnektorenwechsel durchgeführt: Scrub-the-Hub Wischdesinfektion 15–30 Sek. Neue nadelfreie Ventile konnektiert. Pulsatile Flush-Spülung (Stop-and-Go) mit je 10 ml NaCl 0,9 % ohne Widerstand. Refluxfreier Verschluss.',
          phases: [
            {
              name: 'Phase 1: Material & Spritzengröße',
              icon: 'bi-shield-check',
              items: [
                { id: 'zvk-f1', text: 'Ausschließlich Spritzen ≥ 10 ml verwenden (Vermeidung gefährlicher Druckspitzen / Berstdruck!)' },
                { id: 'zvk-f2', text: 'Sterile NaCl 0,9 % aufziehen & luftleer vorbereiten' },
                { id: 'zvk-f3', text: 'Neue desinfizierbare nadelfreie Ventile (z.B. Caresite / Bionector) steril bereitlegen' },
                { id: 'zvk-f4', text: 'Alkoholtupfer (70% Isopropanol / Octeniderm) zur Wischdesinfektion bereitlegen' }
              ]
            },
            {
              name: 'Phase 2: Scrub the Hub & Konnektorentausch',
              icon: 'bi-arrow-repeat',
              hasTimer: true,
              items: [
                { id: 'zvk-f5', text: 'Hygienische Händedesinfektion & unsterile Handschuhe anlegen' },
                { id: 'zvk-f6', text: 'SCRUB THE HUB: Konnektoransatz mit Alkoholtupfer 15–30 Sek. mechanisch mit Drehbewegung desinfizieren' },
                { id: 'zvk-f7', text: 'Vollständig an der Luft trocknen lassen' },
                { id: 'zvk-f8', text: 'Neuen Konnektor steril aufschrauben (Schenkelklemme vorher geschlossen halten)' }
              ]
            },
            {
              name: 'Phase 3: Pulsatiles Spülen (Stop-and-Go)',
              icon: 'bi-water',
              items: [
                { id: 'zvk-f9', text: 'Pulsatiles Spülen (Push-Pause-Technik): 6–10 kurze Stop-and-Go-Impulse mit 10 ml NaCl 0,9 %' },
                { id: 'zvk-f10', text: 'Niemals gewaltsam gegen Widerstand spülen oder aspirieren!' },
                { id: 'zvk-f11', text: 'Positiven Druck beim Abziehen halten (letzten 1 ml unter laufendem Druck spülen & Klemme schließen)' }
              ]
            }
          ]
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
      sopDocuments: [
        {
          id: 'iso-sop',
          title: 'Verfahrensanweisung: Allgemeines Vorgehen bei Isolation und Reinigung',
          shortTitle: '1. SOP Isolation & Reinigung',
          roXtraId: '239411',
          version: 'Ver. 003 / 08.2019',
          pageCount: 4,
          badge: 'SOP • 4 Seiten',
          icon: 'bi-shield-check',
          themeColor: '#0284c7',
          pdfUrl: 'assets/isolation-sop-verfahrensanweisung.pdf',
          thumb: 'assets/isolation-sop-thumb.jpg',
          scope: 'Klinikweit • Alle Pflegebereiche & Zentren',
          description: 'Allgemeine Isolationsformen, Desinfektion, Barrieremaßnahmen & Schutzkleidung.',
          pages: [
            { pageNum: 1, label: 'S. 1: Allgemeine Isolierungsformen & Farbleitsystem', image: 'assets/isolation-sop-page-1.jpg' },
            { pageNum: 2, label: 'S. 2: Schutzkleidung (PSA) & Desinfektionsmaßnahmen', image: 'assets/isolation-sop-page-2.jpg' }
          ]
        },
        {
          id: 'iso-hygieneplan',
          title: 'Hygieneplan: Umgang mit multiresistenten & hygienerelevanten Erregern',
          shortTitle: '2. Hygieneplan MRE (ITS/IMC)',
          roXtraId: '361678',
          version: 'Ver. 012 / 02.2026',
          pageCount: 5,
          badge: 'Hygieneplan • 5 Seiten • Neu',
          icon: 'bi-shield-shaded',
          themeColor: '#7c3aed',
          pdfUrl: 'assets/zvk-hygieneplan-multiresistente-erreger.pdf',
          thumb: 'assets/zvk-hygieneplan-thumb.jpg',
          scope: 'Häma-Onko (Station+TK) • ITS / IMC • Neonatologie',
          description: 'Detaillierter Leitfaden nach Erreger: VRE, MRGN, MRSA, C. diff, Norovirus, TBC, etc.'
        }
      ],
      roXtraIds: ['239411', '361678'],
      roXtraDetails: {
        '239411': 'Verfahrensanweisung Allgemeines Vorgehen bei Isolation und Reinigung (Ver. 003/08.2019)',
        '361678': 'Hygieneplan: Umgang mit multiresistenten Erregern (Ver. 012/02.2026)'
      },
      image: 'assets/isolation-poster.jpg',
      pdfUrl: 'assets/isolation-sop-verfahrensanweisung.pdf#page=1',
      pdfPage: 1,
      graphicImage: 'assets/graphic-isolation.jpg',
      leadText: 'Hygiene schützt – Gemeinsam für Patienten und Mitarbeitende. Schneller Zugriff auf den aktuellen Hygieneplan und alle wichtigen Handlungsleitfäden bei MRE- und Infektionsnachweis.',
      instructions: 'Scannen Sie den QR-Code, um die vollständige Verfahrensanweisung (SOP) sowie Hygienerichtlinien zur Isolation aufzurufen. Weiterführende Dokumente im QM-System unter ID-Nr.: 239411.',
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
      ],
      checklists: [
        {
          id: 'iso-ppe',
          title: 'MRE & Isolation: PSA An- und Ablegen',
          shortTitle: 'PSA An- & Ablegen',
          subtitle: 'Vermeidung von Eigenkontamination (ID: 361678 & 239411)',
          badge: 'Infektionsschutz',
          timerSeconds: 30,
          timerLabel: 'Händedesinfektion (mind. 30 Sek.)',
          docuSnippet: 'Isolationsmaßnahmen nach Hygieneplan ID: 361678 / 239411 umgesetzt: Schutzkleidung vor Betreten vollständig angelegt. Kontaminationsfreies Ablegen im Zimmer/Schleuse durchgeführt. Händedesinfektion vor/nach Patientenkontakt sowie nach PSA-Ablegen.',
          phases: [
            {
              name: 'Ablauf 1: Kontaminationsfreies Anlegen (VOR dem Zimmer)',
              icon: 'bi-box-arrow-in-right',
              items: [
                { id: 'iso-a1', text: 'Hygienische Händedesinfektion (mind. 30 Sek.) vor Berühren der PSA' },
                { id: 'iso-a2', text: 'Schutzkittel anlegen: Im Nacken und an der Taille vollständig schließen (Rücken bedeckt)' },
                { id: 'iso-a3', text: 'Mund-Nasen-Schutz bzw. FFP2-Maske anlegen: Nasenbügel fest anformen, Dichtsitz prüfen' },
                { id: 'iso-a4', text: 'Schutzbrille / Visier aufsetzen (bei Aerosolen, Absaugen, Tracheostoma oder Spritzgefahr)' },
                { id: 'iso-a5', text: 'Einmalhandschuhe anlegen: Bündchen der Handschuhe ÜBER die Kittelärmel ziehen' }
              ]
            },
            {
              name: 'Ablauf 2: Sicheres Ablegen (IM Zimmer an der Tür / Schleuse)',
              icon: 'bi-box-arrow-right',
              hasTimer: true,
              items: [
                { id: 'iso-b1', text: '1. Handschuhe kontaminationsfrei abstreifen (Handschuh-in-Handschuh) -> Abwurf im Gelben Müll' },
                { id: 'iso-b2', text: '2. Hygienische Händedesinfektion (mind. 30 Sek.)' },
                { id: 'iso-b3', text: '3. Schutzkittel öffnen, von den Schultern fassen, von innen nach außen abrollen & entsorgen' },
                { id: 'iso-b4', text: '4. Erneute hygienische Händedesinfektion vor dem Öffnen der Zimmertür' },
                { id: 'iso-b5', text: '5. Außerhalb des Zimmers: Schutzbrille und Maske an den Haltebändern abnehmen (Außenseite nicht berühren!)' },
                { id: 'iso-b6', text: '6. Abschließende Händedesinfektion (ACHTUNG C. diff.: Gründlich Händewaschen mit Wasser & Seife + Desinfektion)' }
              ]
            }
          ]
        },
        {
          id: 'iso-cleaning',
          title: 'Flächendesinfektion & Raumaufbereitung',
          shortTitle: 'Flächendesinfektion',
          subtitle: 'Mittelwahl nach Hygieneplan: Incidin Pro vs. Perform Pro (sporizid)',
          badge: 'Hygiene & Reinigung',
          timerSeconds: 60,
          timerLabel: 'Einwirkzeit Flächendesinfektion',
          docuSnippet: 'Flächendesinfektion gemäß Hygieneplan durchgeführt: Patientennahe Kontaktflächen (Bett, Nachtschrank, Monitore, Infusomaten) scheuernd gewischt. Desinfektionsmittel und Einwirkzeit beachtet.',
          phases: [
            {
              name: 'Phase 1: Desinfektionsmittel & PSA wählen',
              icon: 'bi-shield-check',
              items: [
                { id: 'iso-c1', text: 'Desinfektionsmittel prüfen: Standard MRE (VRE, MRGN, MRSA) = Incidin Pro 0,5 %' },
                { id: 'iso-c2', text: 'Sporenbildner prüfen: C. difficile / Norovirus = ZWINGEND Perform Pro 2 % (sporizid)' },
                { id: 'iso-c3', text: 'PSA für Reinigung anlegen: Feste Schutzhandschuhe & Schutzkittel' }
              ]
            },
            {
              name: 'Phase 2: Scheuer-Wisch-Desinfektion & Einwirkzeit',
              icon: 'bi-droplet-half',
              hasTimer: true,
              items: [
                { id: 'iso-c4', text: 'Patientennahe Flächen mit getränktem Einmaltuch nass wischen (Bett, Nachttisch, Ruftaster, Sanitärbereich)' },
                { id: 'iso-c5', text: 'Medizinische Geräte: Monitore, Spritzenpumpen & Infusomaten herstellerkonform desinfizieren' },
                { id: 'iso-c6', text: 'Nassfilm sichtbar auf der Fläche belassen & vollständige Einwirkzeit abwarten (nicht trockenreiben!)' },
                { id: 'iso-c7', text: 'Nach Verlegung / Entlassung: Schlussdesinfektion durchführen & Bettvorhänge tauschen' }
              ]
            }
          ]
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
    if (lower.includes('239411') || lower.includes('isolation') || lower.includes('hygiene') || lower.includes('mre') || lower.includes('mrsa') || lower.includes('mrgn') || lower.includes('vre') || lower.includes('difficile')) {
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
