# Getting Started with Film Script Maker

## Installation

1. Navigate to the project directory:
```bash
cd film-script-maker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Keyboard Shortcuts

- `Ctrl+1` - Action (Full width, left aligned)
- `Ctrl+2` - Character (Center aligned, bold, uppercase)
- `Ctrl+3` - Dialogue (Indented center zone)
- `Ctrl+4` - Right-aligned text
- `Ctrl+5` - Parenthetical (Indented, italic)
- `Ctrl+6` - Scene Heading (Bold, uppercase heading)

### File Operations

- **New**: Create a new document (File → New)
- **Open**: Open a `.fscript` file (File → Open)
- **Save**: Save the current document (File → Save)
- **Export PDF**: Export as PDF (File → Export as PDF)
- **Export DOCX**: Export as DOCX (File → Export as DOCX)

### Document Metadata

Click **Document → Document Info** to set:
- Title
- Author
- Contact
- Email
- Version
- Created/Modified dates

### Comments

1. Select text in the editor
2. Add a comment in the Comments panel
3. Comments are linked to the document and saved with the file

### Features

- ✅ A4 page layout with 10mm margins
- ✅ Realistic writing zone
- ✅ 6 formatting modes with keyboard shortcuts
- ✅ Save/Load `.fscript` files locally
- ✅ Export to PDF and DOCX
- ✅ Comments system
- ✅ Metadata management
- ✅ Auto-save to localStorage
- ✅ Fully offline
- ✅ PWA support (installable)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Browser Compatibility

This app uses the File System Access API which is supported in:
- Chrome/Edge (version 86+)
- Opera (version 72+)
- Safari (version 15.2+)

For browsers that don't support the File System Access API, the app falls back to download/upload dialogs.

## Notes

- Files are saved as JSON (`.fscript` format)
- Auto-save occurs every 30 seconds to localStorage
- All data is stored locally - no cloud services
- The app works fully offline after the initial load

