# Script Maker

A professional film script writing application that runs fully offline. Write screenplays with A4 page layout, custom formatting modes, comments, and export to PDF/DOCX.

## Features

- ✅ A4 page layout with 10mm margins
- ✅ 6 formatting modes with keyboard shortcuts (Ctrl+1-6)
- ✅ Save/Load .fscript files locally
- ✅ Export to PDF and DOCX
- ✅ Comments panel with block linking
- ✅ Metadata management (author, version, dates)
- ✅ Fully offline - no cloud dependencies
- ✅ PWA support - installable as desktop app

## Keyboard Shortcuts

- `Ctrl+1` - Action (Full width, left aligned)
- `Ctrl+2` - Character (Center aligned)
- `Ctrl+3` - Dialogue (Limited center zone)
- `Ctrl+4` - Right-aligned text
- `Ctrl+5` - Parenthetical (Indented)
- `Ctrl+6` - Scene Heading (Bold uppercase)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Technology Stack

- React + Vite
- TipTap (Rich text editor)
- TailwindCSS
- File System Access API
- html2pdf.js (PDF export)
- docx (DOCX export)
- PWA (Progressive Web App)

