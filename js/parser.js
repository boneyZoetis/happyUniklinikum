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
      image: 'assets/card-beatmung.jpg?v=20261111',
      graphicImage: 'assets/card-beatmung.jpg?v=20261111',
      videoUrl: 'https://www.youtube.com/watch?v=b1lDSxzUgKM',
      videoEmbedUrl: 'https://www.youtube.com/embed/b1lDSxzUgKM',
      videoFile: 'assets/videos/beatmung-elisa600.mp4',
      videoTitle: 'elisa 600 Beatmungsgerät | Geräteaufbau & Systemtest einfach erklärt',
      videoSubtitle: 'Schritt-für-Schritt Aufbau des Doppelschlauchsystems & Pre-Use Systemtest vor Patientenkontakt',
      videoDeviceBadge: 'elisa 600 • Intensivpflege',
      videoSteps: [
        { title: 'ZGV-Anschluss (O₂ & Druckluft)', desc: 'Zentralgasversorgung & Stromanschluss prüfen', color: '#0284c7' },
        { title: 'Aufbau Doppelschlauchsystem', desc: 'Inspirations- & Exspirationsfilter montieren', color: '#2563eb' },
        { title: 'HMEF & Prüfstopfen', desc: 'Patientennahen Filter & roten Stopfen aufstecken', color: '#16a34a' },
        { title: 'Pre-Use Gerätecheck', desc: 'Systemtest bis 100 % („bestanden“) abschließen', color: '#7c3aed' }
      ],
      leadText: 'Standardisierter Aufbau des Beatmungssystems, geräteeigener Pre-Use Check (Dichtigkeits- und Kalibrierungstest) und Gewährleistung der Notfallausrüstung vor Anschluss des Patienten auf der Intensivstation.',
      instructions: 'Führen Sie vor jeder Patientenbelegung oder nach jedem Schlauchsystemwechsel die vollständige Funktionsprüfung durch. Schließen Sie erst nach erfolgreichem Test („Bestanden / Pass“) an den Patienten an.',
      whyImportant: [
        '🟢 Patientensicherheit erhöhen\nTechnische Defekte und Fehlfunktionen durch den Gerätecheck frühzeitig erkennen.',
        '🔴 Leckagen und Druckverluste erkennen\nDichtigkeit prüfen, um eine zuverlässige Druck- und Volumenapplikation zu unterstützen.',
        '🔵 Schlauch-Compliance und Widerstand berücksichtigen\nKompressionsverluste erfassen und geräteabhängig kompensieren, um die Beatmungsgenauigkeit zu verbessern.',
        '🟠 Notfallbereitschaft sicherstellen\nBeatmungsbeutel, Sauerstoffversorgung und funktionsfähige Absaugung bereithalten.'
      ],
      keyPoints: [
        '🔵 SCHRITT 1 – Sichtprüfung & Stromversorgung\nGehäuse, Display, Netzkabel und STK-Status prüfen. Netz-/Notstromversorgung und Akkustatus kontrollieren.',
        '🟢 SCHRITT 2 – Gasversorgung\nO₂- und Druckluftanschlüsse sicher verbinden. Versorgungsdruck gemäß Herstellervorgaben kontrollieren.',
        '🟠 SCHRITT 3 – Beatmungssystem aufbauen\nDoppelschlauchsystem mit vormontiertem Y-Stück und Exspirationsfilter korrekt anschließen. HMEF mit Gänsegurgel verbinden und deren patientenseitigen Anschluss mit roter Verschlusskappe verschließen. Alle Verbindungen auf festen Sitz und Knickfreiheit prüfen.',
        '🔴 SCHRITT 4 – Gerätecheck durchführen\nSelbsttest mit verschlossenem patientenseitigem Anschluss starten. Bei Displayaufforderung (ca. 94 %) rote Verschlusskappe entfernen und bei erneuter Aufforderung wieder aufsetzen. Test bis 100 % durchführen und Ergebnis „bestanden“ kontrollieren.',
        '🟣 SCHRITT 5 – Alarmgrenzen einstellen\nDruck-, Minutenvolumen-, Atemfrequenz- und Apnoealarme patienten- und situationsgerecht einstellen. Alarmbereitschaft sicherstellen.',
        '🔵 SCHRITT 6 – Notfallequipment prüfen\nNotfallequipment am Bettplatz: Manuellen Beatmungsbeutel (mit Reservoir und ggf. PEEP-Ventil), passende Maske, O₂-Versorgung und funktionsfähige Absaugung einsatzbereit bereithalten.'
      ],
      clinicalFocus: [
        {
          phase: '1. Zentrale Gasversorgung (ZGV)',
          icon: 'bi-plug-fill',
          color: '#0284c7',
          detail: 'O₂- und Druckluftschläuche sicher anschließen. Versorgungsdruck gemäß Herstellervorgaben kontrollieren.'
        },
        {
          phase: '2. Doppelschlauchsystem',
          icon: 'bi-box-seam-fill',
          color: '#16a34a',
          detail: 'Vormontiertes Doppelschlauchsystem mit integriertem Y-Stück auf Beschädigungen, Knicke und korrekten Sitz prüfen.'
        },
        {
          phase: '3. Inspirationsschenkel',
          icon: 'bi-arrow-right-circle-fill',
          color: '#0284c7',
          detail: 'Inspirationsschlauch am vorgesehenen Geräteausgang sicher anschließen.'
        },
        {
          phase: '4. Exspirationsschenkel & Filter',
          icon: 'bi-filter-circle-fill',
          color: '#7c3aed',
          detail: 'Exspirationsfilter am vorgesehenen Geräteanschluss einsetzen und Exspirationsschlauch sicher verbinden. Korrekten Sitz prüfen.'
        },
        {
          phase: '5. Patientennaher HMEF & Gänsegurgel',
          icon: 'bi-shield-fill-plus',
          color: '#ea580c',
          detail: 'HMEF am Y-Stück anschließen und mit der Gänsegurgel verbinden. Patientenseitigen Anschluss mit roter Verschlusskappe verschließen.'
        },
        {
          phase: '6. Abschließende Systemkontrolle',
          icon: 'bi-check2-circle',
          color: '#dc2626',
          detail: 'Alle Verbindungen auf festen Sitz, Knickfreiheit und sichtbare Beschädigungen prüfen.'
        }
      ],
      goldenRule: 'Vor Patientenanschluss Geräte- und Dichtigkeitstest erfolgreich abschließen. Beatmungsbeutel mit Reservoir, ggf. PEEP-Ventil, passender Maske, O₂-Versorgung und funktionsfähige Absaugung bereithalten.',
      checklist: [
        'Schritt 1: Gehäuse, Display, Netzkabel, STK-Status und Notstrom-/Akkubetrieb geprüft',
        'Schritt 2: O₂- und Druckluftanschlüsse sicher verbunden, Versorgungsdruck normgerecht',
        'Schritt 3: Doppelschlauchsystem & Exspirationsfilter montiert, HMEF mit Gänsegurgel & roter Kappe verschlossen',
        'Schritt 4: Selbsttest gestartet, bei ca. 94 % Kappe entfernt/wieder aufgesetzt, Ergebnis „bestanden“ (100 %)',
        'Schritt 5: Druck-, Minutenvolumen-, Atemfrequenz- und Apnoealarme patientengerecht eingestellt',
        'Schritt 6: Notfallbeatmungsbeutel (mit Reservoir/PEEP) & Maske am Bettplatz griffbereit',
        'Absaugung: Bettplatz-Absauganlage funktionsfähig mit passenden Kathetern einsatzbereit'
      ],
      parameters: [
        {
          label: 'ZGV-Eingangsdruck',
          target: 'O₂- und AIR-Versorgung müssen innerhalb des für die konkrete Geräteausführung freigegebenen Eingangsdruckbereichs liegen; Systemtest ohne Versorgungsfehler.',
          val: 'O₂- und AIR-Versorgung müssen innerhalb des für die konkrete Geräteausführung freigegebenen Eingangsdruckbereichs liegen; Systemtest ohne Versorgungsfehler.',
          note: 'Anschlüsse, Schläuche und Anzeige für Zentralgasversorgung prüfen. Kein verbindlicher bar-Grenzwert ohne die zugehörige elisa-Gebrauchsanweisung/Softwareversion. [1]',
          desc: 'Anschlüsse, Schläuche und Anzeige für Zentralgasversorgung prüfen. Kein verbindlicher bar-Grenzwert ohne die zugehörige elisa-Gebrauchsanweisung/Softwareversion. [1]'
        },
        {
          label: 'Dichtigkeitsgrenze',
          target: 'Geräte- und Schlauchsystemtest: „bestanden“. Der zulässige Leckagewert wird geräte-/testabhängig beurteilt.',
          val: 'Geräte- und Schlauchsystemtest: „bestanden“. Der zulässige Leckagewert wird geräte-/testabhängig beurteilt.',
          note: 'Schlauchsystem vor dem Test korrekt verschließen, Exspirationsventil/Membran/Filter und Steckverbindungen prüfen. Bei nicht bestandenem Test kein Einsatz am Patienten. [1]',
          desc: 'Schlauchsystem vor dem Test korrekt verschließen, Exspirationsventil/Membran/Filter und Steckverbindungen prüfen. Bei nicht bestandenem Test kein Einsatz am Patienten. [1]'
        },
        {
          label: 'Pmax-Alarmgrenze',
          target: 'Patienten- und modusabhängig; eine einheitliche sichere Zahl in mbar existiert nicht. Spitzendruckgrenze oberhalb des erwarteten Bedarfs und gemäß Therapieziel festlegen.',
          val: 'Patienten- und modusabhängig; eine einheitliche sichere Zahl in mbar existiert nicht. Spitzendruckgrenze oberhalb des erwarteten Bedarfs und gemäß Therapieziel festlegen.',
          note: 'Bei elisa kann Pmax in bestimmten Modi ein regelnder Begrenzungsparameter sein, nicht nur ein Alarm. Druck, Plateau/Driving Pressure und Kurven gemeinsam beurteilen. [1]',
          desc: 'Bei elisa kann Pmax in bestimmten Modi ein regelnder Begrenzungsparameter sein, nicht nur ein Alarm. Druck, Plateau/Driving Pressure und Kurven gemeinsam beurteilen. [1]'
        },
        {
          label: 'Apnoe-Alarmzeit',
          target: 'An den Beatmungsmodus, die Spontanatmung und das klinische Risiko anpassen; keine universelle Sekundenvorgabe.',
          val: 'An den Beatmungsmodus, die Spontanatmung und das klinische Risiko anpassen; keine universelle Sekundenvorgabe.',
          note: 'Apnoe-Überwachung und gegebenenfalls Backup-Beatmung auf korrekte Aktivierung prüfen. Alarmgrenzen nicht routinemäßig deaktivieren; Patientensituation beachten. [1]',
          desc: 'Apnoe-Überwachung und gegebenenfalls Backup-Beatmung auf korrekte Aktivierung prüfen. Alarmgrenzen nicht routinemäßig deaktivieren; Patientensituation beachten. [1]'
        }
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
      image: 'assets/card-befeuchtung.jpg?v=20261111-3',
      graphicImage: 'assets/card-befeuchtung.jpg?v=20261111-3',
      videoUrl: 'https://www.youtube.com/watch?v=Xa3uZiq8d40',
      videoEmbedUrl: 'https://www.youtube.com/embed/Xa3uZiq8d40',
      videoFile: 'assets/videos/befeuchtung-aircon.mp4',
      videoTitle: 'AIRcon Atemgasbefeuchter | Geräteaufbau & Inbetriebnahme',
      videoSubtitle: 'Schritt-für-Schritt Vorbereitung der Befeuchterkammer, Schlauchheizung & Temperaturkontrolle',
      videoDeviceBadge: 'AIRcon Gen2 • Intensivpflege',
      videoSteps: [
        { title: 'Befeuchterkammer & Wasserzufuhr', desc: 'Kammer einschieben, Sterilwasser-Infusion anschließen', color: '#0891b2' },
        { title: 'Beheiztes Schlauchsystem', desc: 'Inspirations- & Exspirations-Heizdrähte anstecken', color: '#0284c7' },
        { title: 'Temperaturfühler & Sonden', desc: 'Kammersensor & patientennahen Fühler korrekt platzieren', color: '#16a34a' },
        { title: 'Inbetriebnahme & Invasiv-Modus', desc: 'Gerät einschalten, Modus „Invasiv (37°C)“ vorwärmen', color: '#7c3aed' }
      ],
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
      image: 'assets/card-hfnc.jpg?v=20261111',
      graphicImage: 'assets/card-hfnc.jpg?v=20261111',
      videos: [
        {
          id: '4sgTiXiEaoI',
          url: 'https://www.youtube.com/watch?v=4sgTiXiEaoI',
          embedUrl: 'https://www.youtube.com/embed/4sgTiXiEaoI',
          file: 'assets/videos/hfnc-teil1-aufbau.mp4',
          tabTitle: 'Teil 1: Aufbau & Schlauch',
          title: 'High-Flow (HFNC) | Teil 1: Geräteaufbau & Befeuchterkammer',
          subtitle: 'Schritt-für-Schritt Vorbereitung des myAIRVO 2 / Optiflow-Systems & Schlauchheizung',
          deviceBadge: 'Optiflow / HFNC • Aufbau'
        },
        {
          id: 'Zt8k7JxuPc8',
          url: 'https://www.youtube.com/watch?v=Zt8k7JxuPc8',
          embedUrl: 'https://www.youtube.com/embed/Zt8k7JxuPc8',
          file: 'assets/videos/hfnc-teil2-nasenkanuele.mp4',
          tabTitle: 'Teil 2: Optiflow-Kanüle',
          title: 'High-Flow (HFNC) | Teil 2: Optiflow-Nasenkanüle & Patienteneinstellung',
          subtitle: 'Korrektes Anpassen der Nasenbrille (< 50 % Nasenloch-Okklusion), Fluss- und FiO₂-Titration',
          deviceBadge: 'Optiflow / HFNC • Praxis'
        }
      ],
      videoUrl: 'https://www.youtube.com/watch?v=4sgTiXiEaoI',
      videoEmbedUrl: 'https://www.youtube.com/embed/4sgTiXiEaoI',
      videoFile: 'assets/videos/hfnc-teil1-aufbau.mp4',
      videoTitle: 'High-Flow-Therapie (HFNC / Optiflow) | Praxis-Schulungsvideo',
      videoSubtitle: 'Schritt-für-Schritt Vorbereitung der Befeuchterkammer, Schlauchheizung & Nasenkanülen-Anpassung',
      videoDeviceBadge: 'Optiflow / HFNC • Intensivpflege',
      videoSteps: [
        { title: 'Befeuchterkammer & Aqua dest.', desc: 'Selbstfüllende Kammer einsetzen & Sterilwasser anschließen', color: '#ea580c' },
        { title: 'Beheizter Atemschlauch', desc: 'AirSpiral™ Atemschlauch mit integrierter Heizung verbinden', color: '#0284c7' },
        { title: 'Optiflow™ Nasenkanüle', desc: 'Größe wählen (max. 50 % der Nares verschließen), spannungsfrei anpassen', color: '#16a34a' },
        { title: 'Fluss- & FiO₂-Titration', desc: 'Fluss (30–60 L/min) und Ziel-SpO₂ einstellen, ROX-Index nach 2/6/12 h berechnen', color: '#7c3aed' }
      ],
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
      title: 'SOP Arterielles Druckmesssystem (Combitrans®) – Vorbereitung, 15-Schritte-Befüllung & Sicherheit',
      shortTitle: 'Arterieller Druck (Combitrans®)',
      navTitle: 'Arterie',
      category: 'Hämodynamisches Monitoring & Anästhesiepflege',
      accentColor: '#dc2626',
      badgeBg: 'rgba(220, 38, 38, 0.12)',
      badgeBorder: '#f87171',
      bannerGradient: 'linear-gradient(135deg, #450a0a 0%, #dc2626 100%)',
      icon: 'bi-activity',
      image: 'assets/card-arterie.jpg',
      graphicImage: 'assets/card-arterie.jpg',
      videoUrl: 'https://www.youtube.com/watch?v=Hyoeowu7SJU',
      videoEmbedUrl: 'https://www.youtube.com/embed/Hyoeowu7SJU',
      videoFile: 'assets/videos/arterie-blutdruckmessung.mp4',
      videoTitle: 'Invasive arterielle Blutdruckmessung | Nullabgleich & Kurvenvalidierung',
      videoSubtitle: 'Schritt-für-Schritt Vorbereitung des Druckmesssystems, 300 mmHg Druckbeutel, Phlebostatischer Nullpunkt & Fast-Flush-Test',
      videoDeviceBadge: 'Combitrans® • Intensivpflege',
      videoSteps: [
        { title: 'Druckbeutel & Spülflasche', desc: 'NaCl 0,9 % blasenfrei entlüften, Manschette auf 300 mmHg aufpumpen', color: '#dc2626' },
        { title: 'Druckaufnehmer entlüften', desc: 'Transducer & Dreiwegehähne im Uhrzeigersinn blasenfrei spülen', color: '#ea580c' },
        { title: 'Phlebostatischer Nullpunkt', desc: 'Höhe 4. ICR / mittlerer Thoraxdurchmesser mit Laser/Wasserwaage nivellieren', color: '#0284c7' },
        { title: 'Nullabgleich & Fast-Flush', desc: 'Dreiwegehahn öffnen, Nullabgleich am Monitor & Rechtecktest (Dämpfung)', color: '#16a34a' }
      ],
      leadText: 'Gold-Standard für das Combitrans® (Fa. B. Braun) Druckmesssystem gemäß Leitlinie: Standardisierter 15-Schritte-Befüllungsprozess (initial max. 50 mmHg -> final 300 mmHg), Reservoir-Entlüftung im Uhrzeigersinn, Phlebostatischer Nullabgleich und strikte Vermeidung von Luftembolien im peripheren Endstromgebiet.',
      instructions: 'WICHTIG: Drucksystem auspacken und VOR Befüllung ALLE Konnektionsstellen nachziehen! Befüllen Sie das System initial mit max. 50 mmHg Druckbeutel, um Blasenbildung zu verhindern. Erst nach vollständiger Entlüftung von Reservoir und Leitungen auf 300 mmHg aufpumpen und beide Nullpunkthähne querstellen!',
      whyImportant: [
        '🟢 Präzise hämodynamische Überwachung\nKontinuierliche Erfassung von systolischem, diastolischem und mittlerem arteriellem Druck (MAP).',
        '🔴 Hydrostatistische Messfehler vermeiden\nDruckaufnehmer auf korrekter Referenzhöhe positionieren. Bereits 1 cm Höhenabweichung verursacht ca. 0,74 mmHg Messfehler.',
        '🔵 Über- und Unterdämpfung erkennen\nKurvenqualität beurteilen und bei Bedarf mittels Fast-Flush-Test die dynamische Antwort des Messsystems überprüfen.',
        '🟠 Blutungskomplikationen vorbeugen\nLuer-Lock-Verbindungen sichern, Anschlüsse regelmäßig kontrollieren und Punktionsstelle auf Blutungen überwachen.'
      ],
      keyPoints: [
        '🔵 SCHRITT 1 – Vorbereitung & Drucksystem\nNaCl 0,9 % (500 oder 1000 ml) mit Druckbeutel vorbereiten. Combitrans-Druckmesssystem auspacken, Verbindungen kontrollieren und Rollenklemmen schließen.',
        '🟢 SCHRITT 2 – System blasenfrei befüllen\nDruckmesssystem gemäß Befüllungsstandard vollständig und aseptisch entlüften. Transducer, Dreiwegehähne, Druckleitungen und Reservoir blasenfrei befüllen. Anschließend Druckbeutel auf 300 mmHg aufpumpen.',
        '🟠 SCHRITT 3 – Referenzhöhe einstellen\nTransducer auf Höhe des rechten Herzvorhofs (phlebostatische Achse: 4. ICR, mittlere Axillarlinie) positionieren. Nach Lageänderungen erneut nivellieren.',
        '🔴 SCHRITT 4 – Nullabgleich durchführen\nDreiwegehahn zum Patienten schließen und zur Atmosphäre öffnen. Nullabgleich am Monitor durchführen. Anschließend zur Atmosphäre schließen, zum Patienten öffnen und Druckkurve kontrollieren.',
        '🟣 SCHRITT 5 – Fast-Flush-Test\nSpülfunktion kurz betätigen und loslassen. Rechtecksignal und Nachschwingungen beurteilen (typisch ca. 1–2). Druckkurve auf Über- oder Unterdämpfung prüfen.',
        '🔵 SCHRITT 6 – Gefäß- & Perfusionskontrolle\nPunktionsstelle auf Blutung, Hämatom und Infektionszeichen kontrollieren. Distale Durchblutung (Puls, Hautfarbe, Temperatur, Rekapillarisierung) regelmäßig prüfen und dokumentieren.'
      ],
      goldenRule: 'Luftblasen vermeiden, Transducer korrekt nivellieren und nullen. Druckkurve und Anschlüsse regelmäßig kontrollieren. Bei auffälligen Messwerten Patientenzustand und Messsystem überprüfen.',
      clinicalFocus: [
        {
          phase: '1. Vorbereitung & Konnektionskontrolle (Combitrans®)',
          icon: 'bi-wrench-adjustable',
          detail: 'Bereitstellung von Infusionsständer, 500/1000 ml NaCl 0.9%, Druckbeutel und Combitrans® (B. Braun) System. NaCl-Beutel einhängen, Drucksystem entnehmen und ALLE Konnektionsstellen vor Inbetriebnahme fest nachziehen.'
        },
        {
          phase: '2. Schonendes Befüllen bei max. 50 mmHg',
          icon: 'bi-droplet-half',
          detail: 'Rollenklemme schließen (bei 3. optionaler Leitung Klemme schließen). NaCl-Beutel konnektieren, Tropfkammer halb füllen. Druckbeutel auf maximal 50 mmHg aufpumpen. Transducer in Halteplatte einhängen, Nullpunkthahn zur Atmosphäre öffnen, Rollenklemme langsam öffnen und Systeme spülen, bis NaCl austritt.'
        },
        {
          phase: '3. Reservoir-Befüllung & Entlüftung im Uhrzeigersinn',
          icon: 'bi-arrow-clockwise',
          detail: 'Nullpunkthahn zur Atmosphäre schließen, Leitungen spülen. Patientenhahn zur Atmosphäre schließen: Reservoir unter Drehen und gleichzeitigem leichten Zug am Kolben langsam mit Spüllösung füllen. Patientenhahn öffnen, durch Zurückdrehen mit leichtem Druck im Uhrzeigersinn entlüften. Wichtig: Nochmaliges Spülen zur Restluftentfernung!'
        },
        {
          phase: '4. Enddruck 300 mmHg & Phlebostatische Nivellierung',
          icon: 'bi-speedometer2',
          detail: 'Beide Nullpunkthähne quer stellen, alle Klemmen öffnen und Druckbeutel auf 300 mmHg aufpumpen. Transducer am Infusionsständer auf Herzhöhe (phlebostatischer Punkt: 4. ICR / mittlere Axillarlinie) nivellieren und Monitor-Nullabgleich durchführen.'
        },
        {
          phase: '5. Fast-Flush-Test & Cave: Fingerischämie-Prävention',
          icon: 'bi-shield-exclamation',
          detail: 'Fast-Flush-Test auslösen (1,5–2 Nachschwingungen, erhaltene dikrote Kerbe). CAVE: Luft im System führt zu Thromboembolien im Endstromgebiet und Fingerischämie! Dämpfung verfälscht die Werte (Systole falsch zu tief, Diastole falsch zu hoch).'
        }
      ],
      checklist: [
        'Combitrans®-Drucksystem: Alle Konnektionsstellen vorab fest nachgezogen',
        'Befüllung initial schonend bei max. 50 mmHg durchgeführt',
        'Zuleitung zur 3. optionalen Druckmessung gespült und abgeklemmt',
        'Reservoir unter Drehen blasenfrei gefüllt und im Uhrzeigersinn entlüftet',
        'Nochmaliges Spülen zur vollständigen Elimination von Rest-Luft erfolgt',
        'Beide Nullpunkthähne quer gestellt und Druckbeutel auf exakt 300 mmHg aufgepumpt',
        'Transducer auf Herzniveau (4. ICR / mittlere Axillarlinie) nivelliert & genullt',
        'Fast-Flush-Test: Sauberes Rechtecksignal & Fingerperfusion (Rekap < 2s) intakt'
      ],
      parameters: [
        { label: 'Initialer Befülldruck', target: 'Max. 50 mmHg', note: 'Schonendes, mikroblasenfreies Priming' },
        { label: 'Betriebsdruck (Druckbeutel)', target: '300 mmHg', note: 'Gewährleistet 3 ml/h kontinuierlichen Spülfluss' },
        { label: 'Referenzebene', target: '4. ICR / Mittlere Axillarlinie', note: 'Phlebostatischer Punkt (rechter Vorhof)' },
        { label: 'Reservoir-Entlüftung', target: 'Im Uhrzeigersinn', note: 'Drehen mit leichtem Druck auf den Kolben' },
        { label: 'Flush-Oszillationen', target: '1,5 – 2,0 Nachschwingungen', note: 'Optimale Dämpfung; < 1,5 = überdämpft, > 2 = unterdämpft' },
        { label: 'Cave: Dämpfungseffekt', target: 'Sys falsch tief / Dia falsch hoch', note: 'Luftblasen dämpfen das Messsignal physikalisch' }
      ],
      troubleshooting: [
        {
          problem: 'Überdämpfte Druckkurve (flache Amplitude, keine dikrote Inzisur, Sys falsch tief, Dia falsch hoch)',
          cause: 'Mikroblasen im Transducer oder Schlauchsystem, Blutkoagel am Katheter, abgeknicktes Handgelenk oder unzureichender Druck im Beutel (< 300 mmHg).',
          action: 'Druckbeutel auf 300 mmHg prüfen. System sorgfältig auf Mikroblasen absuchen: Transducer und Reservoir nach SOP entlüften und spülen. Handgelenk in Neutralstellung schienen. Koagel aspirieren, niemals mit Hochdruck einspülen!'
        },
        {
          problem: 'Unterdämpfte Druckkurve (überschießende Systolenspitzen / Ringing, Sys falsch hoch, Dia falsch tief)',
          cause: 'Zu lange oder zu weiche Verlängerungsleitungen, überzählige Dreiwegehähne, Resonanzartefakte.',
          action: 'Unnötige Hähne und Verlängerungen sofort entfernen. Kurze, starre Original-Druckschläuche verwenden. Fast-Flush wiederholen.'
        },
        {
          problem: 'Cave: Blässe, Kälte oder Zyanose der Finger (Endstromgebiet-Ischämie)',
          cause: 'Thromboembolischer Verschluss kleiner Arterien durch Luftblasen oder Katheterthromben, Gefäßspasmus oder Hämatomkompression.',
          action: 'NOTFALL! Spülung sofort stoppen! Periphere Pulse und Rekapillarisierungszeit an allen Fingern prüfen. Sofort ärztlichen Dienst / Operateur informieren. Vorbereitung zur Katheterentfernung oder Gefäßdiagnostik (Doppler/Duplex).'
        },
        {
          problem: 'Nullpunkt-Drift oder unplausible Druckwerte',
          cause: 'Veränderung der Patientenlagerung (Bett verstellt) ohne Neujustierung des Transducers, Kabelzug oder lockere Konnektion.',
          action: 'Transducer-Höhe am Stativ exakt auf den phlebostatischen Punkt (4. ICR / MAL) re-justieren. Alle Konnektionen nachziehen. Nullabgleich zur Atmosphäre am Monitor wiederholen.'
        }
      ],
      interactiveType: 'arterial-wave'
    },

    evd: {
      id: 'evd',
      topic: 'Externe Ventrikeldrainage (EVD)',
      title: 'SOP Externe Ventrikeldrainage (EVD) – VentrEX®-System, ICP-Monitoring & Druckgrenzen',
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
      videoUrl: 'https://youtube.com/shorts/32eHLvVZ4w0',
      videoEmbedUrl: 'https://www.youtube.com/embed/32eHLvVZ4w0',
      videoFile: 'assets/videos/evd-ventrex.mp4',
      videoTitle: 'Externe Ventrikeldrainage (EVD) | Nullabgleich & ICP-Monitoring',
      videoSubtitle: 'Schritt-für-Schritt Nivellierung auf Foramen Monroi (Tragus), Drainagehöhe & Spülungs-SOP',
      videoDeviceBadge: 'VentrEX® EVD • Intensivpflege',
      videoSteps: [
        { title: 'Referenzpunkt Foramen Monroi', desc: 'Tragus / äußerer Gehörgang als Nullebene mit Laser-Nivellierer anvisieren', color: '#7c3aed' },
        { title: 'Skaleneinstellung & Drainagehöhe', desc: 'Druckstufe in cmH₂O bzw. mmHg gemäß ärztlicher Anordnung arretieren', color: '#0284c7' },
        { title: 'Tropfkammer & Dreiwegehahn', desc: 'Dreiwegehahn prüfen: Drainage regulär geöffnet oder zur ICP-Messung geschlossen', color: '#16a34a' },
        { title: 'Liquormonitoring & Hygiene', desc: 'Abtropfmenge, Farbe dokumentieren & streng aseptischer Verbandswechsel', color: '#ea580c' }
      ],
      leadText: 'Standard Operating Procedure (SOP) für das NeuroMedex® VentrEX®-System: Kontinuierliches intrakranielles Druckmonitoring (ICP) bei regulär GESCHLOSSENER Drainage. Exakte Tragus-Nivellierung (Foramen Monroi), Nullen ohne Diskonnektion, differenzierte Druckgrenzen (sediert vs. wach) und striktes Verbot des pflegerischen Spülens zum Kopf hin.',
      instructions: 'WICHTIG: Die EVD ist regulär GESCHLOSSEN zu halten! Bei geöffneter Drainage ist KEINE Hirndruckmessung möglich (Gefahr falsch niedriger Werte). Öffnen nur bei Überschreiten verordneter Druckgrenzen für max. 5–10 ml bzw. bis zum Sistieren. Bei JEDEM Positionswechsel des Patienten gelben Monitoring-Hahn (2) zwingend neu auf den Tragus ausrichten!',
      whyImportant: [
        'Exakte ICP-Messung: Bei offener Drainage ist keine Hirndruckmessung möglich – Gefahr von Fehlmessungen und unbemerktem Hirnödem.',
        'Überdrainageschutz: Unkontrollierter Liquorabfluss führt zu Ventrikelkollaps und tödlichem Brückenvenenabriss (akutes Subduralhämatom).',
        'Nullen ohne Kontamination: Das VentrEX®-System erlaubt Nullen über die 0-cm-Skala ohne Diskonnektion oder Sterilitätsbruch.',
        'Strikte Patientensicherheit: Spülen in Richtung Ventrikel sowie Aspiration an der EVD sind ausnahmslos Ärzten vorbehalten!'
      ],
      keyPoints: [
        'Drainage regulär GESCHLOSSEN: Drainagehahn (3) steht auf Messung. Öffnen nur gezielt bei Überschreiten des Ziel-ICP zur Entlastung von max. 5–10 ml.',
        'Referenzpunkt Tragus = Foramen Monroi: Der gelbe Monitoring-3-Wege-Hahn (2) direkt proximal der Messeinheit [E] wird exakt horizontal auf Höhe des Tragus (äußerer Gehörgang) nivelliert.',
        'Re-Nivellierungspflicht: Bei JEDER Kopfteilverstellung, Umlagerung, Mobilisation oder Bettentransport zwingend vorab schließen und danach am Tragus neu ausrichten.',
        'Druckgrenzen sediert/intubiert: Supratentoriell 15 mmHg (Tropfkammer +10 cm über Tragus) | Infratentoriell 20 mmHg (+15 cm über Tragus).',
        'Druckgrenzen wach/kooperativ: Supratentoriell 20 mmHg (+15 cm über Tragus) | Infratentoriell 25 mmHg (+20 cm über Tragus) – Schutz vor Überdrainage bei Eigenbewegung.',
        'Nullen ohne Diskonnektion: 1. Gelben Hahn (2) zum Kopf sperren, 2. Hahn (3) zur Tropfkammer öffnen, 3. Kammer [B] auf 0 cm hängen und Monitor nullen, 4. Kammer wieder auf Anordnungshöhe (+10 cm) hängen.',
        'Obstruktion & Kompetenzgrenzen: Pflegerisches Spülen ausschließlich "vom Kopf weg" zur Tropfkammer via Hahn (1). Spülen "zum Kopf hin" & Aspirieren sind STRENGSTENS NUR ARZT erlaubt!',
        'Stündliche Bilanzierung: Tropfkammerinhalt stündlich im PDMS dokumentieren und bei geschlossenem Druckwandlerhahn (3) über Hahn (4) in den Beutel entleeren.'
      ],
      clinicalFocus: [
        {
          phase: '1. Systemaufbau & Tragus-Nivellierung (VentrEX®)',
          icon: 'bi-crosshair2',
          detail: 'Montage der Aufhängevorrichtung [A] am Bettstativ. Gelben Monitoring-3-Wege-Hahn (2) direkt proximal der Druckmesseinheit [E] mit Laserpointer exakt auf Höhe des Tragus (Foramen Monroi) ausrichten. Tropfkammer [B] standardmäßig auf +10 cm Skalenmarke einhängen.'
        },
        {
          phase: '2. Nullen des ICP-Druckwandlers ohne Diskonnektion',
          icon: 'bi-sliders2',
          detail: 'Steriles 4-Schritte-Verfahren: 1. Gelben Hahn (2) zum Patienten hin absperren. 2. Druckwandlerhahn (3) zur Abtropfkammer öffnen. 3. Abtropfbehälter [B] auf 0 cm der Messskala hängen und Monitor-Nullabgleich drücken. 4. Behälter wieder auf Sollhöhe (+10 cm) arretieren und Hahn (2) zum Patienten öffnen.'
        },
        {
          phase: '3. ICP-Monitoring & Handhabung der Druckgrenzen',
          icon: 'bi-activity',
          detail: 'EVD ist regulär GESCHLOSSEN (Hahn 3 auf Messung). Bei Erreichen der Druckgrenze (Sediert: 15 mmHg supratentoriell / 20 mmHg infratentoriell; Wach: 20 mmHg supratentoriell / 25 mmHg infratentoriell) Drainage öffnen. Wichtig: Bei offener EVD keine ICP-Messung! Nach 5–10 ml bzw. Sistieren sofort wieder schließen.'
        },
        {
          phase: '4. Sicherheitsregeln bei Mobilisation & Umlagerung',
          icon: 'bi-exclamation-triangle-fill',
          detail: 'Vor JEDER Bettenverstellung, Kopfteiländerung, Lagerung, endotrachealem Absaugen oder Transport EVD zwingend verriegeln! Nach Abschluss der Lageveränderung Nullpunkt am Tragus mittels Laserwaage kontrollieren und re-justieren.'
        },
        {
          phase: '5. Stündliche Dokumentation & Kammerentleerung',
          icon: 'bi-clipboard2-data-fill',
          detail: 'Stündliche Ablesung von Liquormenge (ml) und Farbe/Transparenz im PDMS. Entleerung des Abtropfbehälters [B] in den Ablaufbeutel: Zuvor Druckwandlerhahn (3) auf Messung schließen. Hahn (4) öffnen, Liquor ablaufen lassen, fest verschließen. Klemme [C] nur bei Beutelwechsel nutzen (irreversibel!).'
        },
        {
          phase: '6. Obstruktionsmanagement & Klare Kompetenzgrenzen',
          icon: 'bi-shield-shaded',
          detail: 'Bei Verstopfung: Systemport-Hahn (1) zum Patienten absperren, Port mit Desinfektionsmittel einsprühen (Einwirkzeit >= 30 s), steril mit 5-10 ml NaCl 0.9% in die Tropfkammer spülen (Menge verwerfen!). ACHTUNG: Spülen zum Kopf hin und Aspiration an der EVD sind STRENG NUR DEM ARZT vorbehalten!'
        }
      ],
      checklist: [
        'VentrEX®-Halterung fest und senkrecht am Bettstativ arretiert',
        'Gelber Monitoring-Hahn (2) mit Laserpointer exakt auf Höhe des Tragus (äußerer Gehörgang) ausgerichtet',
        'Nullpunktabgleich ohne Diskonnektion über 0-cm-Skala erfolgreich durchgeführt',
        'Druckgrenzen nach Verordnung eingestellt (Sediert: 15/20 mmHg | Wach: 20/25 mmHg)',
        'Drainage regulär GESCHLOSSEN (Hahn 3 auf Messung – ICP-Monitoring aktiv)',
        'Klemmpflicht: EVD vor jeder Bettenbewegung, Umlagerung und Absaugen sicher gesperrt',
        'Stündliche Dokumentation: Liquormenge (ml/h) und Aspekt (klar/bernsteinfarben/blutig/trüb) erfasst',
        'Kompetenzgrenze gewahrt: Niemals eigenmächtig aspirieren oder in Richtung Ventrikel spülen (NUR ARZT)'
      ],
      parameters: [
        { label: 'Physiologischer ICP (Normwert)', target: '5 – 15 mmHg', note: 'Normaler Ruhedruck im Liegen; pathologisch & interventionspflichtig bei ICP > 20 mmHg' },
        { label: 'Zerebraler Perfusionsdruck (CPP)', target: '≥ 60 – 70 mmHg', note: 'Formel: CPP = MAP – ICP; kritische Minderperfusion & Ischämiegefahr bei CPP < 50 mmHg' },
        { label: 'Referenz-Nullpunkt (Landmarke)', target: 'Tragus des Ohres', note: 'Gelber Hahn (2) auf Höhe Foramen Monroi; zwingende Re-Justierung bei JEDER Lageänderung' },
        { label: 'Drainage-Status (Grundregel)', target: 'Regulär GESCHLOSSEN', note: 'ICP-Monitoring aktiv; bei offener EVD KEINE Hirndruckmessung möglich (Messfehler!)' },
        { label: 'Ablassmenge bei ICP-Anstieg', target: 'Max. 5 – 10 ml / Sistieren', note: 'Intermittierendes Ablassen; nach spätestens 5–10 ml oder Sistieren sofort wieder schließen' },
        { label: 'Sediert: Supratentoriell', target: '15 mmHg (+10 cm ü. Tragus)', note: 'Intubierte & sedierte Patienten; Ziel-ICP ≤ 15 mmHg, Abtropfkammer standardmäßig auf +10 cm' },
        { label: 'Sediert: Infratentoriell', target: '20 mmHg (+15 cm ü. Tragus)', note: 'Intubierte & sedierte Patienten; Ziel-ICP ≤ 20 mmHg, Abtropfkammer auf +15 cm' },
        { label: 'Wach: Supratentoriell', target: '20 mmHg (+15 cm ü. Tragus)', note: 'Kooperative/wache Patienten; höhere Schwelle schützt vor Überdrainage bei Eigenbewegung' },
        { label: 'Wach: Infratentoriell', target: '25 mmHg (+20 cm ü. Tragus)', note: 'Kooperative/wache Patienten; Ziel-ICP ≤ 25 mmHg, Abtropfkammer auf +20 cm' },
        { label: 'Standard-Abtropfhöhe', target: '+10 cm über Null-Linie', note: 'Standard-Rastposition der Messskala [A] (ca. 7,4 mmHg hydrostatischer Gegendruck)' },
        { label: 'Nullabgleich-Position', target: '0 cm an der Messskala', note: 'Abtropfbehälter [B] temporär auf 0 cm hängen und am Monitor nullen (kein Sterilitätsbruch)' },
        { label: 'Stündliche Liquordokumentation', target: 'ca. 10 – 20 ml/h (500 ml/d)', note: 'Stündliche Erfassung im PDMS; CAVE Überdrainage/Ventrikelkollaps bei unkontrolliertem Fluss' },
        { label: 'Desinfektion Systemport', target: 'Mind. 30 Sekunden', note: 'Aseptische Einwirkzeit an Einlassstutzen (Hahn 1) vor jeder Spülung zur Tropfkammer' },
        { label: 'Spülvolumen Obstruktion (Pflege)', target: 'Max. 5 – 10 ml NaCl 0,9 %', note: 'Ausschließlich "vom Kopf weg" zur Tropfkammer; Spülen zum Kopf & Aspiration STRENG NUR ARZT!' }
      ],
      troubleshooting: [
        {
          problem: 'Kein Liquorabfluss trotz hohem ICP',
          cause: 'Knickstelle im Ableitungsschlauch, Zuleitungsfilter/Rückschlagventil feucht geworden oder Koagel/Fibrin im Katheter.',
          action: '[PFLEGE] Gesamtes Schlauchsystem dekonnektionsfrei auf Knicke und Durchgängigkeit prüfen. Verband kontrollieren. Systemport (1) zum Kopf schließen, Port desinfizieren (>= 30 s) und steril mit NaCl 0.9% ZUR TROPFKAMMER ("vom Kopf weg") spülen. [NUR ARZT] Spülen in Richtung Ventrikel oder Aspiration darf ausschließlich durch den Arzt erfolgen!'
        },
        {
          problem: 'Keine ICP-Pulsation / flache Nulllinie am Monitor',
          cause: 'Hahn (3) fälschlicherweise auf Drainage statt Messung gestellt, Messkabel lose oder Luftblase im Transducer.',
          action: '[PFLEGE] Hahnstellung prüfen: Hahn (3) muss zur Abtropfkammer geschlossen sein, damit der Druckwandler [E] den Patientendruck misst. Kabelverbindungen zum Monitor und Nullpunkt (Tragus) überprüfen. Bei Diskonnektion oder Defekt sofort ärztlichen Dienst verständigen.'
        },
        {
          problem: 'Anhaltender ICP-Anstieg über die Zielgrenze',
          cause: 'Hirnödem, Liquorzirkulationsstörung, Nachblutung oder Verlegung des Ventrikelkatheters.',
          action: '[PFLEGE] Neurologischen Status sofort prüfen (Pupillenreaktion, GCS/RASS). Ausschließen von Husten, Pressen oder Kopfknickung. Drainage nach Verordnung gezielt öffnen, bis max. 5–10 ml abgelaufen sind oder Fluss sistiert – dann sofort wieder schließen! Bleibt ICP > Grenze: Unverzüglich Dienstarzt alarmieren (Notfall-CCT erwägen).'
        },
        {
          problem: 'Liquor zunehmend blutig, trüb oder sedimentiert',
          cause: 'Akute Nachblutung, sekundäre Hämorrhagie oder aufsteigende Katheterinfektion (Ventrikulitis/Meningitis).',
          action: '[PFLEGE] Ärztlichen Dienst sofort hinzuziehen. Liquorfarbe und -aspekt präzise im PDMS dokumentieren. [NUR ARZT / NACH ANORDNUNG] Sterile Liquorprobenentnahme unter aseptischen Bedingungen zur Mikrobiologie (Zellzahl, Eiweiß, Kultur). Niemals Beutelinhalt für Proben nutzen!'
        },
        {
          problem: 'Überdrainage / unkontrollierter massiver Liquorfluss',
          cause: 'Drainage unbeabsichtigt offen gelassen, Mobilisation ohne Abklemmen oder Tropfkammer zu tief fixiert.',
          action: '[PFLEGE] EVD SOFORT VOLLSTÄNDIG SCHLIESSEN! Patient flach lagern. Vitalzeichen, Pupillen und Vigilanz prüfen. Sofort Arzt kontaktieren (Gefahr des Ventrikelkollapses und Subduralhämatoms). Nullpunkt und Tropfkammerhöhe neu überprüfen.'
        }
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
    if (lower.includes('arterie') || lower.includes('combitrans') || lower.includes('arteriell') || lower.includes('druckmessung') || lower.includes('transducer') || lower.includes('fast-flush') || lower.includes('square-wave') || lower.includes('phlebostatisch')) {
      return ICU_STANDARDS.arterie;
    }
    // 5. Externe Ventrikeldrainage (EVD)
    if (lower.includes('evd') || lower.includes('ventrex') || lower.includes('ventrikel') || lower.includes('ventrikeldrainage') || lower.includes('hirndruck') || lower.includes('icp') || lower.includes('foramen monroi') || lower.includes('tragus') || lower.includes('monroi')) {
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
