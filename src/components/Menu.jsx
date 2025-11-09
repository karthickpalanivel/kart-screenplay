import { FaFile, FaFolderOpen, FaSave, FaFileExport, FaInfo } from 'react-icons/fa';

export default function Menu({ 
  onNew, 
  onOpen, 
  onSave, 
  onExportPDF, 
  onExportDOCX, 
  onShowMetadata 
}) {
  return (
    <div className="menu-bar">
      <div className="menu-dropdown">
        <div className="menu-item">File</div>
        <div className="menu-dropdown-content">
          <div className="menu-dropdown-item" onClick={onNew}>
            <FaFile style={{ marginRight: '8px' }} />
            New
          </div>
          <div className="menu-dropdown-item" onClick={onOpen}>
            <FaFolderOpen style={{ marginRight: '8px' }} />
            Open...
          </div>
          <div className="menu-dropdown-item" onClick={onSave}>
            <FaSave style={{ marginRight: '8px' }} />
            Save
          </div>
          <div className="menu-dropdown-item" onClick={onSave}>
            <FaSave style={{ marginRight: '8px' }} />
            Save As...
          </div>
          <div style={{ borderTop: '1px solid #ddd', margin: '4px 0' }} />
          <div className="menu-dropdown-item" onClick={onExportPDF}>
            <FaFileExport style={{ marginRight: '8px' }} />
            Export as PDF...
          </div>
          <div className="menu-dropdown-item" onClick={onExportDOCX}>
            <FaFileExport style={{ marginRight: '8px' }} />
            Export as DOCX...
          </div>
        </div>
      </div>

      <div className="menu-dropdown">
        <div className="menu-item">Document</div>
        <div className="menu-dropdown-content">
          <div className="menu-dropdown-item" onClick={onShowMetadata}>
            <FaInfo style={{ marginRight: '8px' }} />
            Document Info
          </div>
        </div>
      </div>
    </div>
  );
}

