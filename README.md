# UMF Expertenstandards &bull; Digitale Pflege-Pocketcards

Eine spezialisierte Web-Anwendung für die **Universitätsmedizin Frankfurt (UMF)** zur Darstellung und Bereitstellung der 4 Pflege-Expertenstandards mit interaktiven Kacheln, Schulungsvideos und scannbaren, dynamisch generierten QR-Codes.

---

## Die 4 Expertenstandards

1. 🟣 **Dekubitusprophylaxe in der Pflege**
2. 🟢 **Sturzprophylaxe in der Pflege**
3. 🟡 **Schmerzmanagement in der Pflege**
4. 🔵 **Ernährungsmanagement in der Pflege**

---

## Funktionen

- **4 Kacheln Übersicht (`#/`)**: Direkte Übersicht aller vier Standards mit offiziellen Illustrationen und generierten QR-Codes.
- **Dedizierte Einzelseiten**: Detailansicht jedes Standards mit:
  - Generiertem QR-Code in hoher Auflösung (zum Scannen oder als PNG-Download)
  - Eingebettetem YouTube-Schulungsvideo (16:9 responsive Player)
  - Offizieller klinischer Illustration
  - Direkter QM-Dokumentation & Handlungsschritten
  - Strukturierter Pflegeprozess-Handlungsleitfaden (4 Phasen)
- **Pocketcards Druckansicht (`#/qrcodes`)**: Alle 4 Pocketcards mit QR-Codes auf einen Blick, optimiert für den Ausdruck (Kitteltasche).

---

## Starten der Anwendung

Doppelklick auf `start.cmd` oder in PowerShell:
```powershell
.\start.ps1
```
Die Anwendung öffnet sich unter: **`http://localhost:3000`**
