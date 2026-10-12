# UMF Expertenstandards &bull; Digitale Pflege-Pocketcards

Eine spezialisierte Web-Anwendung für die **Universitätsmedizin Frankfurt (UMF)** zur Darstellung und Bereitstellung der 4 Pflege-Expertenstandards mit interaktiven Kacheln, Schulungsvideos und scannbaren, dynamisch generierten QR-Codes.

---

## Die 4 Expertenstandards

1. 🟣 **Dekubitusprophylaxe in der Pflege** *(roXtra ID: 400139 / 400129)*
2. 🟢 **Sturzprophylaxe in der Pflege** *(roXtra ID: 138896 / 275545)*
3. 🟡 **Schmerzmanagement in der Pflege** *(roXtra ID: 399503 / 399486)*
4. 🔵 **Ernährungsmanagement in der Pflege** *(roXtra ID: 408310 / 408331)*

---

## Funktionen

- **4 Kacheln Übersicht (`#/`)**: Direkte Übersicht aller vier Standards mit offiziellen Illustrationen, roXtra IDs und generierten QR-Codes.
- **Dedizierte Einzelseiten**: Detailansicht jedes Standards mit:
  - Generiertem QR-Code in hoher Auflösung (zum Scannen oder als PNG-Download)
  - Eingebettetem YouTube-Schulungsvideo (16:9 responsive Player)
  - Offizieller klinischer Illustration
  - roXtra Dokumenten-IDs mit 1-Klick-Kopierfunktion
  - Strukturierter Pflegeprozess-Handlungsleitfaden (4 Phasen)
- **Pocketcards Druckansicht (`#/qrcodes`)**: Alle 4 Pocketcards mit QR-Codes auf einen Blick, optimiert für den Ausdruck (Kitteltasche).

---

## Starten der Anwendung

Doppelklick auf `start.cmd` oder in PowerShell:
```powershell
.\start.ps1
```
Die Anwendung öffnet sich unter: **`http://localhost:3000`**
