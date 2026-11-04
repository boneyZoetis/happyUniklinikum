/**
 * Klinische Pflege- & Intensivstandards Data Layer
 * 5 Zentrale Intensivpflege-Verfahrensanweisungen & Standards:
 * 1. Vorbereitung und Funktionsprüfung eines Beatmungsgerätes
 * 2. Aktive Atemgasbefeuchtung bei invasiver Beatmung
 * 3. Aktive Atemgasbefeuchtung bei nasaler High-Flow-Therapie (HFNC)
 * 4. Invasives arterielles Druckmesssystem
 * 5. Externe Ventrikeldrainage (EVD)
 */

var root = typeof window !== 'undefined' ? window : global;
root.QRParser = (function () {
  'use strict';

  // =========================================================
  // 5 ACTIVE INTENSIVE CARE PROCEDURES & CLINICAL STANDARDS
  // =========================================================
  const ICU_STANDARDS = {
    beatmung: {
      id: 'beatmung',
      topic: 'Vorbereitung und Funktionsprüfung eines Beatmungsgerätes',
      title: 'Vorbereitung & Funktionsprüfung eines Beatmungsgerätes – Aufbau & Pre-Use Check',
      shortTitle: 'Beatmungsgerät',
      navTitle: 'Beatmung',
      category: 'Respiratorische Intensivtherapie',
      accentColor: '#0284c7',
      badgeBg: 'rgba(2, 132, 199, 0.12)',
      badgeBorder: '#38bdf8',
      bannerGradient: 'linear-gradient(135deg, #001f3f 0%, #003354 45%, #0284c7 100%)',
      icon: 'bi-lungs-fill',
      image: 'assets/card-beatmung.jpg',
      graphicImage: 'assets/card-beatmung.jpg',
      leadText: 'Standardisierter Aufbau des Beatmungssystems, geräteeigener Pre-Use Check (Dichtigkeits- und Kalibrierungstest) und Gewährleistung der Notfallausrüstung vor Anschluss des Patienten auf der Intensivstation.',
      instructions: 'Führen Sie vor jeder Patientenbelegung oder nach jedem Schlauchsystemwechsel die vollständige Funktionsprüfung durch. Schließen Sie erst nach erfolgreichem Test („Bestanden / Pass“) an den Patienten an.',
      whyImportant: [
        'Patientensicherheit garantieren (Ausschluss technischer Defekte und Ventilfehlfunktionen vor Beatmungsbeginn)',
        'Leckagen & Druckabfall verhindern (Verlässliche Druck- und Volumenapplikation im Beatmungskreislauf)',
        'Schlauch-Compliance & Widerstandskompensation (Präzise Volumengarantie ohne Kompressionsverlust)',
        'Sofortige Notfallbereitschaft (Funktionsbereiter Beatmungsbeutel und Absaugung am Bettplatz)'
      ],
      keyPoints: [
        'Sichtprüfung & STK: Gehäuse, Display und Netzkabel prüfen; Gerät an Notstromsteckdose (roter Punkt) anschließen und Akkuladung (100 %) verifizieren.',
        'Zentrale Gasversorgung (ZGV): Schläuche für O₂ (weiß) und Druckluft (schwarz-weiß) sicher einklinken; Betriebsdruck 3,0 bis 4,5 bar kontrollieren.',
        'Aufbau Beatmungskreislauf: Doppelschlauchsystem, Exspirationsventil, keimarmer Inspirationsfilter, patientennaher Flowsensor und Y-Stück faltenfrei montieren.',
        'Geräteeigener Pre-Use-Check: Y-Stück mit Prüfkonus luftdicht verschließen; Selbsttest starten (Dichtigkeits-, Kalibrier- und Ventiltest).',
        'Alarmgrenzen patientenspezifisch setzen: Pmax (Druckbegrenzung ca. 10 mbar über Ppeak), MV-Alarm (Minutenvolumen hoch/tief), Atemfrequenz und Apnoezeit (max. 15–20 s).',
        'Notfallequipment am Bettplatz: Manueller Beatmungsbeutel (mit Reservoir & PEEP-Ventil), passende Maske und funktionierende Absauganlage einsatzbereit bereithalten.'
      ],
      clinicalFocus: [
        {
          phase: '1. Fachgerechter Aufbau des Beatmungssystems',
          icon: 'bi-tools',
          detail: 'Montage des keimarmen Schlauchsystems (Inspirations- & Exspirationsschenkel), Einsetzen des Exspirationsventils mit Membran, patientennahe Konnektion des Flowsensors und der Atemgasfilter.'
        },
        {
          phase: '2. Durchführung des Gerätechecks (Selbsttest)',
          icon: 'bi-check-all',
          detail: 'Starten des geräteeigenen Prüfprogramms bei verschlossenem Y-Stück. Messung von Schlauch-Compliance, Strömungswiderstand und Dichtigkeit. Freigabe nur bei Testurteil „Bestanden“.'
        },
        {
          phase: '3. Beatmungsparameter & Alarmgrenzen',
          icon: 'bi-sliders',
          detail: 'Vorwahl des ärztlich verordneten Beatmungsmodus (z. B. BIPAP/PCV oder VCV), Einstellen von PEEP, Tidalvolumen / P-Insp, FiO₂ und enge Justierung aller kritischen Alarmgrenzen.'
        },
        {
          phase: '4. Notfallbereitschaft & Dokumentation',
          icon: 'bi-shield-fill-check',
          detail: 'Funktionsprüfung des Beatmungsbeutels und der Bettplatz-Absaugung. Dokumentation von Prüfzeitpunkt, Schlauchwechseldatum und Gerätestatus in der Patientenkurve / im PDMS.'
        }
      ],
      checklist: [
        'Sichtprüfung: Gerät sauber, unbeschädigt, STK-Plakette gültig',
        'Strom- & Notstromnetz: Grünes Ladesymbol leuchtet, Akku bei 100 %',
        'Zentrale Gasversorgung: O₂ und Druckluft (3,0–4,5 bar) arretiert',
        'Exspirationsventil: Membran intakt und fest eingerastet',
        'Schlauchsystem: Knick- und dehnungsfrei am Gerät montiert',
        'Filter & Flowsensor: Filter geräteseitig, Flowsensor patientennah montiert',
        'Selbsttest / Dichtigkeitstest: Bei verschlossenem Y-Stück erfolgreich durchlaufen („Pass“)',
        'Notfallmaterial: Beatmungsbeutel + Maske + O₂-Schlauch am Bettplatz',
        'Absaugung: Vakuum erzeugt min. -0,6 bar, Absaugkatheter griffbereit'
      ],
      parameters: [
        { label: 'ZGV-Eingangsdruck', target: '3,0 – 4,5 bar', note: 'Zentrale O₂- & Druckluft-Versorgung' },
        { label: 'Dichtigkeitsgrenze', target: '< 100 ml/min', note: 'Maximal zulässige Leckage bei 30 mbar' },
        { label: 'Pmax Alarmgrenze', target: '10 mbar über Ppeak', note: 'Schutz vor Barotrauma / Volutrauma' },
        { label: 'Apnoe-Alarmzeit', target: '15 – 20 Sekunden', note: 'Sicherheits-Backup bei Spontanatmung' }
      ],
      troubleshooting: [
        { problem: 'Gerätetest meldet „Leckage im System“', cause: 'Y-Stück nicht dicht verschlossen, Wasserfalle undicht, Exspirationsventil nicht fest eingerastet.', action: 'Prüfstopfen fest aufdrücken, alle Schraub- & Steckverbindungen nachziehen, Dichtungsringe prüfen und Test wiederholen.' },
        { problem: 'Flowsensor-Kalibrierung fehlgeschlagen', cause: 'Feuchtigkeit im Messschlauch, Sensor verkehrtherum montiert oder Membran defekt.', action: 'Messleitungen trockenblasen, Einbaurichtung (Flusspfeil zum Patienten) kontrollieren, Sensor austauschen.' },
        { problem: 'Druckluft- oder O₂-Alarm ertönt', cause: 'ZGV-Stecker nicht vollständig eingerastet oder Leitungsdruck unter 2,8 bar abgefallen.', action: 'Stecker fest in Wandkupplung drücken, Reservesauerstoffflasche zuschalten und Medizintechnik verständigen.' }
      ],
      interactiveType: 'ventilation-circuit'
    },

    'befeuchtung-invasiv': {
      id: 'befeuchtung-invasiv',
      topic: 'Aktive Atemgasbefeuchtung bei invasiver Beatmung',
      title: 'Aktive Atemgasbefeuchtung bei invasiver Beatmung – Vorbereitung & Temperaturkontrolle',
      shortTitle: 'Aktive Befeuchtung (Invasiv)',
      navTitle: 'Befeuchtung',
      category: 'Invasive Beatmung & Airway Care',
      accentColor: '#16a34a',
      badgeBg: 'rgba(22, 163, 74, 0.12)',
      badgeBorder: '#86efac',
      bannerGradient: 'linear-gradient(135deg, #064e3b 0%, #16a34a 100%)',
      icon: 'bi-droplet-half',
      image: 'assets/card-befeuchtung.jpg',
      graphicImage: 'assets/card-befeuchtung.jpg',
      leadText: 'Physiologische Atemgaskonditionierung bei intubierten und tracheotomierten Patienten: Gewährleistung von 37°C und 44 mg/L Feuchtigkeit, Verhinderung von Schleimhautschäden, Tubusokklusion und Kondenswasser-Aspiration.',
      instructions: 'Positionieren Sie den Befeuchter immer unterhalb des Patientenniveaus. Verwenden Sie beheizte Schläuche und überwachen Sie Temperaturfühler sowie Wasserfüllstand kontinuierlich.',
      whyImportant: [
        'Mukoziliäre Clearance schützen (Erhalt des Flimmerepithels und der Selbstreinigungskraft der Lunge)',
        'Tubusverlegung durch Borkenbildung verhindern (Sekretverflüssigung und Vermeidung von Schleimpfröpfen)',
        'Aspiration von Kondenswasser ausschließen (Keimübertragung und ventilator-assoziierte Pneumonie [VAP] verhindern)',
        'Optimale Gaskonditionierung (37°C Körpertemperatur und 100 % relative Feuchte = 44 mg/L H₂O am Tubuseingang)'
      ],
      keyPoints: [
        'Aufbau & Autofill-Kammer: Sterile Befeuchterkammer auf das Heizgerät (z. B. Fisher & Paykel MR850) schieben, Wasserbeutel mit sterilem Aqua dest. anschließen.',
        'Beheizter Atemschlauch: Doppel-Heizdraht-Schlauchsystem verwenden; Temperaturfühler am Befeuchterausgang und patientennah am Y-Stück fest einrasten.',
        'Betriebsmodus: Invasiver Modus aktivieren – Zieltemperatur am Y-Stück 37°C, Kammertemperatur ca. 36°C (Temperaturgradient zur Vermeidung von Rainout/Kondensat).',
        'Gefälle-Regel (Schwerkraft): Befeuchter MUSS stets unterhalb des Bettniveaus angebracht sein, damit Kondensat vom Patienten wegfließt.',
        'Kondenswasser-Management: Niemals Kondensat in den Befeuchter oder zum Patienten zurückschütten; Wasserfallen aseptisch in geschlossene Gefäße entleeren.',
        'Wassermangel-Alarm: Automatisches Nachfüllen überwachen; Trockenlaufen („Sahara-Effekt“) führt innerhalb kürzester Zeit zu schwersten Schleimhautschäden.'
      ],
      clinicalFocus: [
        {
          phase: '1. Vorbereitung und Aufbau des Befeuchtungssystems',
          icon: 'bi-box-seam',
          detail: 'Aufschieben der sterilen Befeuchterkammer auf die Heizplatte, Anschluss der sterilen Wasserflasche (Aqua dest.), Konnektion der beheizten Inspirations- und Exspirationsschläuche.'
        },
        {
          phase: '2. Sensor- & Heizkabel-Installation',
          icon: 'bi-cpu-fill',
          detail: 'Korrektes Einklicken des blauen Temperaturfühlers (Kammerausgang + Y-Stück) sowie des gelben Heizdrahtadapters. Sichtprüfung auf festen Sitz aller elektrischen Kontakte.'
        },
        {
          phase: '3. Durchführung der Funktionskontrolle',
          icon: 'bi-thermometer-half',
          detail: 'Einschalten im Invasiv-Modus (37°C). Vorwärmphase abwarten (ca. 15–20 Min.), Displayanzeigen für Kammertemperatur und Y-Stück-Temperatur auf Plausibilität prüfen.'
        },
        {
          phase: '4. Schlauchführung & Kondensat-Sicherheit',
          icon: 'bi-arrow-down-right-circle-fill',
          detail: 'Sicherstellung eines kontinuierlichen Schlauchgefälles weg vom Patienten. Regelmäßige Inspektion auf Kondenswasser; aseptisches Entleeren von Wasserfallen ohne Diskonnektion.'
        }
      ],
      checklist: [
        'Sterile Autofill-Kammer korrekt auf Heizplatte eingerastet',
        'Wasserzuleitung mit sterilem Aqua dest. entlüftet und angeschlossen',
        'Befeuchter unterhalb des Patientenniveaus positioniert',
        'Blauer Temperaturfühler am Kammerausgang UND am Y-Stück eingerastet',
        'Gelber Heizdraht-Adapter fest mit den Atemschläuchen verbunden',
        'Invasiv-Modus gewählt (37 °C Sollwert am Y-Stück)',
        'Vorwärmzeit (ca. 15 Min.) abgeschlossen, keine Temperatur-Fehlermeldung',
        'Kontinuierliches Schlauchgefälle ohne Durchhängen („Wassersäcke“) eingerichtet'
      ],
      parameters: [
        { label: 'Zieltemperatur Y-Stück', target: '36,5 – 37,5 °C', note: 'Körperkerntemperatur am Tubusanschluss' },
        { label: 'Absolute Feuchtigkeit', target: 'min. 33 mg/L (Soll: 44 mg/L)', note: '100 % relative Feuchte bei 37 °C' },
        { label: 'Kammertemperatur', target: 'ca. 35,5 – 36,0 °C', note: 'Gradient verhindert Rainout im Schlauch' },
        { label: 'Maximalabschaltung', target: '41,0 – 43,0 °C', note: 'Schutzabschaltung vor thermischem Schaden' }
      ],
      troubleshooting: [
        { problem: 'Kondenswasser sammelt sich im Schlauch („Rainout“)', cause: 'Zugluft von Klimaanlage kühlt Schlauch ab, Temperaturfühler nicht korrekt platziert.', action: 'Temperaturfühler am Y-Stück überprüfen, Schlauch nicht abdecken, Durchhänger beseitigen, Schlauchheizung kontrollieren.' },
        { problem: 'Alarm „Wasser nachfüllen“ / Kammer trocken', cause: 'Infusionsbeutel leer, Belüftungsdorn geschlossen oder Schwimmer klemmt.', action: 'Sterilen Aqua-Beutel erneuern, Belüftung öffnen, Kammer leicht antippen; bei Defekt Kammer sofort tauschen.' },
        { problem: 'Temperaturalarm > 41 °C', cause: 'Fühler herausgerutscht oder Kontakt korrodiert.', action: 'Sitz des patientennahen Fühlers kontrollieren; bei anhaltendem Alarm Gerät ausschalten und Ersatzbefeuchter anschließen.' }
      ],
      interactiveType: 'humidity-gradient'
    },

    hfnc: {
      id: 'hfnc',
      topic: 'Aktive Atemgasbefeuchtung bei nasaler High-Flow-Therapie (HFNC)',
      title: 'Aktive Atemgasbefeuchtung bei High-Flow-Therapie (HFNC / Optiflow) – Aufbau & ROX-Index',
      shortTitle: 'High-Flow (HFNC)',
      navTitle: 'High-Flow',
      category: 'Nicht-invasive Respiratortherapie',
      accentColor: '#ea580c',
      badgeBg: 'rgba(234, 88, 12, 0.12)',
      badgeBorder: '#fb923c',
      bannerGradient: 'linear-gradient(135deg, #431407 0%, #ea580c 100%)',
      icon: 'bi-wind',
      image: 'assets/card-hfnc.jpg',
      graphicImage: 'assets/card-hfnc.jpg',
      leadText: 'Applikation von erwärmtem, vollbefeuchtetem Sauerstoff-Gasgemisch mit hohem Fluss (20–60 L/min) über spezielle Nasenkanülen zur Totraumauswaschung, Atementlastung und PEEP-Unterstützung.',
      instructions: 'Wählen Sie die Kanülengröße so, dass maximal 50% des Nasenlochquerschnitts ausgefüllt sind. Erheben Sie den ROX-Index serialisiert nach 2, 6 und 12 Stunden, um ein Therapieversagen rechtzeitig zu erkennen.',
      whyImportant: [
        'Anatomische Totraumauswaschung (Effiziente CO2-Clearance im Nasopharynx durch kontinuierlichen Spülfluss)',
        'Dynamischer PEEP-Effekt (Aufbau eines leichten endexspiratorischen Drucks von ca. 2–5 mbar bei geschlossenem Mund)',
        'Reduktion der Atemarbeit (Entlastung der Atemmuskulatur und Besserung der Tachypnoe)',
        'Früherkennung von Therapieversagen (Objektive Risikobewertung mittels evidenzbasiertem ROX-Index)'
      ],
      keyPoints: [
        'Geräteaufbau: High-Flow-Gerät (z. B. Airvo 2 / Optiflow) auf Infusionsständer befestigen, Autofill-Kammer einrasten und steriles Aqua dest. anschließen.',
        'Beheizter Schlauch: Speziellen High-Flow-Atemschlauch mit integrierter Heizspirale konnektieren und Vorwärmen lassen (Standardtemperatur 37°C, bei Mundatmung ggf. 34°C).',
        'Kanülenauswahl (50%-Regel): Richtige Prongs-Größe (S, M, L) wählen. Die Stifte dürfen maximal 50% der Nares ausfüllen, um ein freies Exspirationsabströmen zu gewährleisten.',
        'Flow- & FiO2-Einstellung: Initial mit 25–30 L/min beginnen, schrittweise auf 40–60 L/min hochtitrieren; FiO2 anhand des SpO2-Ziels (92–96%, bei Hyperkapnie 88–92%) anpassen.',
        'Druckstellen- & Schleimhautprophylaxe: Nasensteg, Nasenflügel und Ohren regelmäßig auf Druckstellen inspizieren; Entlastungspolster einsetzen.',
        'ROX-Index Berechnung: ROX = (SpO2 / FiO2) / Atemfrequenz. Werte ≥ 4,88 = Erfolg; Werte < 3,85 (nach 2–6 Std.) = Hohes Versagensrisiko → sofortige ärztliche Rücksprache bezüglich Intubation!'
      ],
      clinicalFocus: [
        {
          phase: '1. Vorbereitung und Aufbau des High-Flow-Systems',
          icon: 'bi-gear-wide-connected',
          detail: 'Rüsten des Geräts mit steriler Befeuchterkammer, kontinuierlicher Zuleitung von sterilem Wasser und Konnektion des beheizten Atemschlauchs.'
        },
        {
          phase: '2. Durchführung des Gerätechecks & Funktionskontrolle',
          icon: 'bi-check2-circle',
          detail: 'Geräteselbsttest, Kontrolle des Gasflusses (20–60 L/min), Temperaturprüfung auf 37°C und Überprüfung der Alarmfunktionen bei Diskonnektion oder Wassermangel.'
        },
        {
          phase: '3. Patientengerechte Anlage der Nasenkanüle',
          icon: 'bi-person-bounding-box',
          detail: 'Prüfung der 50%-Regel an den Nares, druckfreie Fixierung der Kopfbebänderung, Polsterung gefährdeter Hautstellen (Nasensteg/Ohren), Instruktion zum geschlossenen Mund.'
        },
        {
          phase: '4. Monitoring & ROX-Index-Kalkulation',
          icon: 'bi-calculator-fill',
          detail: 'Engmaschige Erfassung von SpO2, Atemfrequenz und FiO2. Berechnung des ROX-Index nach 2, 6 und 12 Stunden; Vorbereitung einer Eskalation (NIV/Intubation) bei ROX < 3,85.'
        }
      ],
      checklist: [
        'Gerätestandfuß stabil, Netzkabel mit Zugentlastung arretiert',
        'Sterile Befeuchterkammer mit Aqua dest. automatisch befüllt',
        'Heizschlauch eingerastet, Vorwärmung auf 37 °C abgeschlossen',
        'Nasenkanüle passend gewählt: füllt max. 50 % der Nasenöffnung aus',
        'Initial-Flow auf 25–35 L/min eingestellt, dann an Atemarbeit adaptiert',
        'FiO₂ titriert auf SpO₂-Ziel (92–96 %; bzw. 88–92 % bei COPD)',
        'Druckstellen-Check an Septum und Ohren durchgeführt',
        'ROX-Index nach 2 Std., 6 Std. und 12 Std. berechnet und dokumentiert'
      ],
      parameters: [
        { label: 'Flow-Bereich', target: '20 – 60 L/min', note: 'Start meist 30–35 L/min, bei Dyspnoe steigern' },
        { label: 'Atemgastemperatur', target: '37,0 °C (alt. 34 °C)', note: 'Vollbefeuchtung; 34 °C bei Unverträglichkeit' },
        { label: 'FiO₂-Titration', target: '0,21 – 1,00 (21–100 %)', note: 'Anhand peripherer SpO₂ anpassen' },
        { label: 'ROX-Index Erfolg', target: '≥ 4,88', note: 'Geringes Intubationsrisiko, Therapie erfolgreich' },
        { label: 'ROX-Index Versagen', target: '< 3,85 (nach 2–6 Std.)', note: 'Alarmwert! Hohes Risiko für Intubationspflicht' }
      ],
      troubleshooting: [
        { problem: 'Patient empfindet Atemgas als zu heiß oder erdrückend', cause: 'Zu hohe Initialtemperatur oder sofortiger Maximalflow.', action: 'Temperatur vorübergehend auf 34 °C reduzieren, Flow kurzfristig auf 25 L/min senken und nach Gewöhnung schrittweise steigern.' },
        { problem: 'SpO₂ fällt trotz FiO₂-Erhöhung ab', cause: 'Mundatmung (Totraumauswaschung vermindert), Sekretverlegung oder fortschreitendes Lungenversagen.', action: 'Patient anleiten durch die Nase zu atmen, Sekret absaugen/abhusten lassen, ROX-Index berechnen und Arzt zwecks NIV/Intubation alarmieren.' },
        { problem: 'Druckstellen an Nasensteg oder Oberlippe', cause: 'Kopfband zu stramm angezogen, Kanülengröße zu groß.', action: 'Bänder lockern, Prongs-Größe reduzieren (< 50 % Nares), Hydrokolloid-Pflaster als Schutzunterlage anbringen.' }
      ],
      interactiveType: 'rox-calculator'
    },

    arterie: {
      id: 'arterie',
      topic: 'Invasives arterielles Druckmesssystem',
      title: 'Invasives arterielles Druckmesssystem – Vorbereitung, Nullabgleich & Fast-Flush-Test',
      shortTitle: 'Arterieller Druck',
      navTitle: 'Arterie',
      category: 'Hämodynamisches Monitoring',
      accentColor: '#dc2626',
      badgeBg: 'rgba(220, 38, 38, 0.12)',
      badgeBorder: '#f87171',
      bannerGradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
      icon: 'bi-activity',
      image: 'assets/card-arterie.jpg',
      graphicImage: 'assets/card-arterie.jpg',
      leadText: 'Kontinuierliche invasive Beat-to-Beat-Blutdruckmessung: Blasenfreier Aufbau des Drucksets, millimetergenaue Höhenausrichtung am phlebostatischen Punkt, Nullabgleich gegen Atmosphäre und dynamische Dämpfungsprüfung mittels Fast-Flush-Test.',
      instructions: 'Nivellieren Sie den Druckaufnehmer exakt auf den phlebostatischen Punkt (4. ICR / mittlere Axillarlinie). Führen Sie bei Schichtbeginn und nach jeder Lagerung einen Nullabgleich und Fast-Flush-Test durch.',
      whyImportant: [
        'Präzise Hämodynamik (Exakte Erfassung von MAP, systolischem und diastolischem Blutdruck in Echtzeit)',
        'Hydrostatische Messfehler eliminieren (1 cm Höhenabweichung des Sensors führt zu ca. 0,74 mmHg Messfehler)',
        'Fehltherapien durch Über-/Unterdämpfung vermeiden (Verifikation der Kurvenqualität mittels Fast-Flush-Test)',
        'Sicherheit vor Blutungskomplikationen (Sichere Luer-Lock-Verbindungen gegen unbemerktes Ausbluten)'
      ],
      keyPoints: [
        'Vorbereitung & Spüllösung: 500 ml NaCl 0.9% in die Druckmanschette einspannen; Druckbeutel auf exakt 300 mmHg aufpumpen (gewährleistet 3 ml/h Dauerspülfluss zur Thrombenprävention).',
        'Absolut blasenfreies Entlüften: Gesamtes System, Transducer und Dreiwegehähne langsam und ohne Schaumbildung spülen; selbst kleinste Mikroblasen führen zu starker Überdämpfung.',
        'Phlebostatischer Punkt (Referenzebene): Transducer am Infusionsständer auf Herzniveau positionieren (Kreuzungspunkt 4. ICR mit der mittleren Axillarlinie).',
        'Nullabgleich (Zeroing): Dreiwegehahn zum Patienten sperren, zur Atmosphäre öffnen, Kappe abnehmen, am Monitor „Zero / Null“ drücken, Bestätigung abwarten, steril rückschalten.',
        'Fast-Flush-Test (Square-Wave-Test): Spüllasche für 1–2 Sekunden betätigen. Ideale Dämpfung zeigt Rechtecksignal mit 1,5 bis 2 Nachschwingungen und erhaltener dikroter Inzisur (Aortenklappenschluss).',
        'Gefäß- & Perfusionskontrolle: Punktionsstelle (meist A. radialis) inspizieren; periphere Durchblutung (Puls, Rekapillarisierungszeit < 2s, Hautfarbe, Temperatur) stündlich dokumentieren.'
      ],
      clinicalFocus: [
        {
          phase: '1. Vorbereitung und fachgerechter Aufbau des Druckmesssystems',
          icon: 'bi-droplet-fill',
          detail: 'Einlegen des NaCl 0.9%-Beutels in die Druckmanschette, Aufbau des 300 mmHg Systemdrucks, blasenfreies Entlüften der Druckleitung, Transducer-Kabel mit Monitormodul verbinden.'
        },
        {
          phase: '2. Positionierung am phlebostatischen Punkt',
          icon: 'bi-geo-alt-fill',
          detail: 'Justieren des Druckaufnehmers am Stativ auf Herzniveau (4. ICR / mittlere Axillarlinie). Ausgleich bei jeder Verstellung des Kopfteils oder Betthöhe.'
        },
        {
          phase: '3. Nullabgleich gegen den Atmosphärendruck',
          icon: 'bi-bullseye',
          detail: 'Absperren der Patientenleitung, Öffnen der Entlüftungskappe zur Atmosphäre, Auslösen der Nullungsfunktion am Monitor, steriler Verschluss und Wiedereröffnung zum Patienten.'
        },
        {
          phase: '4. Fast-Flush-Test & Dämpfungskontrolle',
          icon: 'bi-graph-up',
          detail: 'Manuelle Betätigung des Flush-Mechanismus zur Erzeugung eines Rechtecksignals. Zählen der Nachschwingungen (optimal 1,5–2), Behebung von Überdämpfung (Blasen/Koagel) oder Unterdämpfung.'
        },
        {
          phase: '5. Patientensicherheit & Alarmgrenzen',
          icon: 'bi-shield-check',
          detail: 'Sichtbarmachen aller Luer-Lock-Verbindungen (keine Verdeckung durch Bettzeug), enge Alarmgrenzen für MAP, Sys und Dia, Kontrolle der distalen Extremitätenperfusion.'
        }
      ],
      checklist: [
        'Druckbeutel mit 500 ml NaCl 0.9% auf exakt 300 mmHg aufgepumpt',
        'Leitungssystem und Transducer absolut blasenfrei gespült',
        'Transducer-Platte am Infusionsständer auf Herzhöhe (4. ICR / mittlere Axillarlinie) montiert',
        'Nullabgleich zur Atmosphäre am Monitor erfolgreich durchgeführt („Zero OK“)',
        'Fast-Flush-Test ausgelöst: 1,5 bis 2 Nachschwingungen (Square-Wave-Signal)',
        'Dikrote Kerbe (Inzisur) in der arteriellen Pulskurve deutlich abgrenzbar',
        'Alle Luer-Lock-Verschraubungen fest und vollständig sichtbar gelagert',
        'Distale Perfusion der Hand/Extremität (Puls, Rekap < 2s, Wärme) intakt'
      ],
      parameters: [
        { label: 'Druckmanschette', target: '300 mmHg', note: 'Gewährleistet kontinuierlichen Mikrofluss von 3 ml/h' },
        { label: 'Referenzebene', target: '4. ICR / Mittlere Axillarlinie', note: 'Phlebostatischer Punkt (Niveau rechter Vorhof)' },
        { label: 'Nachschwingungen (Flush)', target: '1,5 – 2,0 Oszillationen', note: 'Optimale Dämpfung; < 1,5 = überdämpft, > 2 = unterdämpft' },
        { label: 'MAD / MAP Zielwert', target: '≥ 65 mmHg (organabhängig)', note: 'Mittlerer arterieller Perfusionsdruck' }
      ],
      troubleshooting: [
        { problem: 'Kurve ist überdämpft (flach, keine dikrote Inzisur, Sys zu tief)', cause: 'Mikroblasen im Schlauch/Transducer, Blutkoagel an der Katheterspitze, abgeknicktes Handgelenk.', action: 'System nach Bläschen absuchen und spülen, Handgelenk in Neutralposition lagern (Schiene), Katheter aspirieren/spülen.' },
        { problem: 'Kurve ist unterdämpft (überschießende Spitzen, Sys falsch hoch)', cause: 'Zu lange oder zu weiche Schläuche, zu viele Dreiwegehähne, Resonanzüberlagerung.', action: 'Schlauchverlängerungen entfernen, Hähne auf Minimum reduzieren, steife Druckleitungen verwenden.' },
        { problem: 'Plötzlicher Druckabfall oder Null-Linie', cause: 'Hahn versehentlich geschlossen, Diskonnektion oder Katheter disloziert.', action: 'Sofort Einstichstelle und Hähne prüfen, Diskonnektion ausschließen (Lebensgefahr durch Blutung!), Sensor prüfen.' }
      ],
      interactiveType: 'arterial-wave'
    },

    evd: {
      id: 'evd',
      topic: 'Externe Ventrikeldrainage (EVD)',
      title: 'Externe Ventrikeldrainage (EVD) – Aufbau, Foramen-Monroi-Nivellierung & Sicherheit',
      shortTitle: 'EVD (Ventrikeldrainage)',
      navTitle: 'EVD Drainage',
      category: 'Neurochirurgische Intensivpflege',
      accentColor: '#7c3aed',
      badgeBg: 'rgba(124, 58, 237, 0.12)',
      badgeBorder: '#c084fc',
      bannerGradient: 'linear-gradient(135deg, #2e1065 0%, #7c3aed 100%)',
      icon: 'bi-diagram-3-fill',
      image: 'assets/card-evd.jpg',
      graphicImage: 'assets/card-evd.jpg',
      leadText: 'Gezielte therapeutische Entlastung des Liquordrucks und kontinuierliches intrakranielles Druckmonitoring (ICP): Lasergestützte Nivellierung auf das Foramen Monroi (Tragus), hydrostatische Tropfkammerjustierung und strikte Aseptik.',
      instructions: 'Richten Sie den Nullpunkt exakt auf den Tragus des Ohres aus. Klemmen Sie die Drainage VOR JEDER Kopfteilverstellung, Umlagerung oder Transport zwingend ab, um eine tödliche Überdrainage zu verhindern!',
      whyImportant: [
        'Hirndrucksenkung & Einklemmungsschutz (Kontrollierte Drainage von Liquor cerebrospinalis bei erhöhtem ICP)',
        'Über- und Unterdrainage verhindern (Präzise Höheneinstellung der Tropfkammer in cmH2O / mmHg)',
        'ZNS-Infektionsschutz (Streng geschlossenes, steriles System zur Prävention von Ventrikulitis und Meningitis)',
        'Früherkennung von Nachblutungen (Kontinuierliche stündliche Dokumentation von Liquormenge, Farbe und Klarheit)'
      ],
      keyPoints: [
        'Referenzpunkt Foramen Monroi: Das Foramen interventriculare entspricht am liegenden Patienten dem Tragus des Ohres (äußerer Gehörgang). Hier liegt die Nullmarke der Messskala.',
        'Nivellierung mittels Laser/Wasserwaage: Skala des EVD-Systems am Stativ exakt horizontal auf Höhe des Tragus ausrichten; bei jeder Lageveränderung des Kopfes nachjustieren.',
        'Tropfkammer-Niveau: Drip-Chamber auf den ärztlich verordneten Druckwert (meist +10 bis +15 cmH2O oberhalb des Nullpunkts) arretieren.',
        'LEBENSWICHTIGE SICHERHEITSREGEL: Vor JEDER Kopfteilverstellung, Umlagerung, Mobilisation, Absaugen oder Transport MUSS die EVD abgeklemmt werden (Schutz vor Unterdruck und Brückenvenenabriss!).',
        'Pulsationskontrolle: Der Liquorspiegel in der Zuleitung muss atem- und pulsabhängig leicht schwanken („Pulsieren“); Fehlen weist auf Abknickung, Diskonnektion oder Lumenverschluss hin.',
        'Stündliche Liquordokumentation: Menge (ml/h) und Aspekt (normal klar, bernsteinfarben, blutig, trüb) protokollieren; bei plötzlicher Verfärbung oder Flussstopp sofort ärztlichen Dienst informieren.'
      ],
      clinicalFocus: [
        {
          phase: '1. Vorbereitung und fachgerechter Aufbau des EVD-Systems',
          icon: 'bi-shield-shaded',
          detail: 'Fixierung des sterilen EVD-Gestells am Stativ, Montage des graduierten Tropfkammer-Zylinders (cmH2O- und mmHg-Skala) und Anschluss des sterilen Drainagebeutels mit Bakterienfilter.'
        },
        {
          phase: '2. Lasergestützte Nivellierung auf das Foramen Monroi',
          icon: 'bi-crosshair',
          detail: 'Ausrichtung des integrierten Laserpointers auf den Tragus des Patientenohrs (äußerer Gehörgang). Horizontale Feinjustierung der Nullpunktmarkierung der Messskala.'
        },
        {
          phase: '3. Einstellung der Entlastungshöhe & ICP-Monitoring',
          icon: 'bi-sliders2',
          detail: 'Justieren der Tropfkammer auf das ärztlich verordnete Druckniveau (z. B. +12 cmH2O). Freigabe des Liquordurchflusses über die Dreiwegehähne.'
        },
        {
          phase: '4. Sicherheits- & Umlagerungsprotokoll',
          icon: 'bi-exclamation-triangle-fill',
          detail: 'Strikte Einhaltung der Klemmpflicht vor jeder Betten- oder Lageänderung. Sicherung des Katheters am Kopf gegen versehentlichen Zug, sterile Verbandskontrolle.'
        },
        {
          phase: '5. Funktions- & Liquorkontrolle',
          icon: 'bi-clipboard2-data-fill',
          detail: 'Überprüfung des atem- und pulssynchronen Mitschwingens der Liquorsäule. Stündliche Mengen- und Farbbewertung im PDMS/Kurve zur Früherkennung von Nachblutungen.'
        }
      ],
      checklist: [
        'EVD-Halterung fest am Bettstativ montiert (keine Wackelgefahr)',
        'Nullpunkt der Skala mit Laserpointer/Wasserwaage exakt auf Tragus ausgerichtet',
        'Tropfkammer-Höhe exakt nach ärztlicher Verordnung (z. B. +12 cmH₂O) fixiert',
        'Atem- und pulssynchrones Pulsieren des Liquorspiegels im Schlauch verifiziert',
        'Abklemm-Regel: EVD vor JEDER Lageveränderung oder Patiententransport geschlossen',
        'Kopfverband an Eintrittsstelle trocken, steril und fest fixiert',
        'Stündliche Dokumentation: Liquormenge (ml) und Farbe (klar/blutig/trüb)',
        'Drainagebeutel rechtzeitig unter aseptischen Kautelen entleert/gewechselt'
      ],
      parameters: [
        { label: 'Referenz-Nullpunkt', target: 'Tragus des Ohres', note: 'Entspricht anatomisch dem Foramen Monroi' },
        { label: 'Tropfkammer-Niveau', target: '+10 bis +15 cmH₂O (ärztl.)', note: 'Hydrostatischer Gegendruck gegen Überdrainage' },
        { label: 'ICP-Normbereich', target: '< 15 mmHg (Erwachsene)', note: 'Ab 20–22 mmHg behandlungsbedürftiger Hirndruck' },
        { label: 'ICP-Wellenform', target: 'P1 > P2 > P3', note: 'P2 > P1 weist auf erschöpfte intrakranielle Compliance hin' }
      ],
      troubleshooting: [
        { problem: 'Plötzlicher Abflussstopp / kein Liquorfluss', cause: 'Drainage abgeklemmt, Schlauch abgeknickt, Koagel/Gewebepfropf im Katheter oder Hirndruck unter Entlastungsniveau.', action: 'Knicke ausschließen, Klemmen prüfen, Pulsieren kontrollieren. Niemals eigenmächtig aspirieren/spülen! Sofort Neurochirurgen informieren.' },
        { problem: 'Liquor wird zunehmend blutig oder trüb', cause: 'Rezidivblutung, sekundäre Hämorrhagie oder aufsteigende Ventrikulitis/Meningitis.', action: 'Sofort ärztlichen Dienst alarmieren, Liquorprobe zur mikrobiologischen Diagnostik asservieren, CCT veranlassen.' },
        { problem: 'Ungewollt hohe Drainagemenge („Überdrainage“)', cause: 'Patient hat sich aufgesetzt ohne vorheriges Schließen der EVD, Tropfkammer zu tief.', action: 'EVD sofort schließen! Neu auf Tragus nivellieren, neurologischen Status (Pupillen/GCS) erheben, Arzt hinzuziehen (Gefahr des Subduralhämatoms).' }
      ],
      interactiveType: 'evd-leveling'
    }
  };

  // =========================================================
  // ARCHIVED LEGACY STANDARDS (KEPT FOR DATA PRESERVATION)
  // =========================================================
  const ARCHIVED_STANDARDS = {
    dekubitus: {
      id: 'dekubitus',
      topic: 'Dekubitusprophylaxe in der Pflege',
      title: 'Expertenstandard zur Dekubitusprophylaxe',
      shortTitle: 'Dekubitusprophylaxe',
      accentColor: '#be185d',
      icon: 'bi-bandaid-fill'
    },
    sturz: {
      id: 'sturz',
      topic: 'Sturzprophylaxe in der Pflege',
      title: 'Expertenstandard Sturzprophylaxe in der Pflege',
      shortTitle: 'Sturzprophylaxe',
      accentColor: '#4d7c0f',
      icon: 'bi-shield-exclamation'
    },
    schmerz: {
      id: 'schmerz',
      topic: 'Schmerzmanagement in der Pflege',
      title: 'Expertenstandard Schmerzmanagement in der Pflege',
      shortTitle: 'Schmerzmanagement',
      accentColor: '#b45309',
      icon: 'bi-heart-pulse-fill'
    },
    ernaehrung: {
      id: 'ernaehrung',
      topic: 'Ernährungsmanagement zur Sicherung und Förderung der oralen Ernährung',
      title: 'Expertenstandard Ernährungsmanagement in der Pflege',
      shortTitle: 'Ernährungsmanagement',
      accentColor: '#0284c7',
      icon: 'bi-egg-fried'
    },
    zvk: {
      id: 'zvk',
      topic: 'Zentraler Venenkatheter (ZVK) – Intensivpflege',
      title: 'Klinische Verfahrensanweisung: Zentraler Venenkatheter (ZVK)',
      shortTitle: 'ZVK Intensivpflege',
      accentColor: '#dc2626',
      icon: 'bi-droplet-half'
    },
    isolation: {
      id: 'isolation',
      topic: 'Hygiene & Isolierungsmaßnahmen bei Erregern mit besonderen Resistenzen (MRE)',
      title: 'Klinische Verfahrensanweisung: Isolation & Hygiene',
      shortTitle: 'Hygiene & Isolation',
      accentColor: '#0284c7',
      icon: 'bi-shield-check'
    }
  };

  // Map active standards
  const UMF_STANDARDS = ICU_STANDARDS;

  function detectUmfStandard(rawText) {
    if (!rawText) return null;
    const lower = rawText.toLowerCase();

    // 1. Beatmungsgerät
    if (lower.includes('beatmung') || lower.includes('ventilator') || lower.includes('respirator') || lower.includes('gerätecheck') || lower.includes('tubus') || lower.includes('pre-use')) {
      return ICU_STANDARDS.beatmung;
    }
    // 2. Aktive Befeuchtung (Invasiv)
    if (lower.includes('befeuchtung-invasiv') || lower.includes('befeuchtung') || lower.includes('mr850') || lower.includes('atemgasbefeuchtung') || lower.includes('rainout') || lower.includes('kondenswasser')) {
      return ICU_STANDARDS['befeuchtung-invasiv'];
    }
    // 3. High-Flow (HFNC)
    if (lower.includes('hfnc') || lower.includes('high-flow') || lower.includes('highflow') || lower.includes('optiflow') || lower.includes('airvo') || lower.includes('rox')) {
      return ICU_STANDARDS.hfnc;
    }
    // 4. Invasives arterielles Druckmesssystem
    if (lower.includes('arterie') || lower.includes('arteriell') || lower.includes('druckmessung') || lower.includes('transducer') || lower.includes('fast-flush') || lower.includes('square-wave') || lower.includes('phlebostatisch')) {
      return ICU_STANDARDS.arterie;
    }
    // 5. Externe Ventrikeldrainage (EVD)
    if (lower.includes('evd') || lower.includes('ventrikel') || lower.includes('ventrikeldrainage') || lower.includes('hirndruck') || lower.includes('icp') || lower.includes('foramen monroi') || lower.includes('tragus') || lower.includes('monroi')) {
      return ICU_STANDARDS.evd;
    }

    // Fallbacks for legacy links
    if (lower.includes('dekubitus')) return ICU_STANDARDS.beatmung;
    if (lower.includes('sturz')) return ICU_STANDARDS['befeuchtung-invasiv'];
    if (lower.includes('schmerz')) return ICU_STANDARDS.hfnc;
    if (lower.includes('ernaehrung')) return ICU_STANDARDS.arterie;
    if (lower.includes('zvk')) return ICU_STANDARDS.arterie;
    if (lower.includes('isolation')) return ICU_STANDARDS.evd;

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
    ICU_STANDARDS,
    ARCHIVED_STANDARDS,
    detectUmfStandard
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = exported;
  }

  return exported;
})();
