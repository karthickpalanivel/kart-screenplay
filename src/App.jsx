import { useState, useEffect, useRef } from 'react';

import Menu from './components/Menu';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Ruler from './components/Ruler';
import CommentsPanel from './components/CommentsPanel';
import MetadataModal from './components/MetadataModal';

import { 
  saveToDisk, 
  openFromDisk, 
  autoSaveToLocalStorage, 
  loadFromLocalStorage 
} from './utils/fileOperations';
import { exportToPDF, exportToDOCX } from './utils/exportUtils';

function App() {
  const [content, setContent] = useState('');
  const [currentBlockType, setCurrentBlockType] = useState('action');
  const [comments, setComments] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    author: '',
    contact: '',
    email: '',
    version: '1.0',
    createdAt: new Date().toISOString(),
    lastModified: new Date().toISOString()
  });
  const [showMetadataModal, setShowMetadataModal] = useState(false);
  const [currentFilename, setCurrentFilename] = useState('Untitled.fscript');
  const [showComments, setShowComments] = useState(true);
  const [editor, setEditor] = useState(null);

  const pageRef = useRef(null);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (content) {
        const documentData = {
          content,
          comments,
          metadata: {
            ...metadata,
            lastModified: new Date().toISOString()
          }
        };
        autoSaveToLocalStorage(documentData);
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(interval);
  }, [content, comments, metadata]);

  const handleEditorReady = (editorInstance) => {
    setEditor(editorInstance);
    // Load autosave content if available
    const autosave = loadFromLocalStorage();
    if (autosave.success && autosave.content && autosave.content.content) {
      // Don't prompt here, just load silently on editor ready
      editorInstance.commands.setContent(autosave.content.content);
      setContent(autosave.content.content);
      if (autosave.content.comments) {
        setComments(autosave.content.comments);
      }
      if (autosave.content.metadata) {
        setMetadata(autosave.content.metadata);
      }
    }
  };

  const handleNew = () => {
    if (window.confirm('Create a new document? Unsaved changes will be lost.')) {
      setContent('');
      setComments([]);
      setMetadata({
        title: '',
        author: '',
        contact: '',
        email: '',
        version: '1.0',
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString()
      });
      setCurrentFilename('Untitled.fscript');
      if (editor) {
        editor.commands.clearContent();
      }
    }
  };

  const handleOpen = async () => {
    const result = await openFromDisk();
    if (result.success) {
      setContent(result.content.content || '');
      setComments(result.content.comments || []);
      if (result.content.metadata) {
        setMetadata(result.content.metadata);
      }
      setCurrentFilename(result.filename || 'Untitled.fscript');
      if (editor) {
        editor.commands.setContent(result.content.content || '');
      }
    } else if (result.error && result.error !== 'User cancelled') {
      alert(`Error opening file: ${result.error}`);
    }
  };

  const handleSave = async () => {
    const documentData = {
      content,
      comments,
      metadata: {
        ...metadata,
        lastModified: new Date().toISOString()
      }
    };

    const result = await saveToDisk(documentData, currentFilename);
    if (result.success) {
      setCurrentFilename(result.filename);
      alert('File saved successfully!');
    } else if (result.error && result.error !== 'User cancelled') {
      alert(`Error saving file: ${result.error}`);
    }
  };

  const handleExportPDF = async () => {
    if (!pageRef.current) {
      alert('Error: Page element not found');
      return;
    }

    const filename = metadata.title 
      ? `${metadata.title}.pdf` 
      : currentFilename.replace('.fscript', '.pdf');

    const result = await exportToPDF(pageRef.current, filename);
    if (!result.success) {
      alert(`Error exporting PDF: ${result.error}`);
    }
  };

  const handleExportDOCX = async () => {
    // Convert HTML content to blocks for DOCX export
    const blocks = parseContentToBlocks(content);
    
    const documentData = {
      blocks,
      content
    };

    const filename = metadata.title 
      ? `${metadata.title}.docx` 
      : currentFilename.replace('.fscript', '.docx');

    const result = await exportToDOCX(documentData, metadata, filename);
    if (!result.success) {
      alert(`Error exporting DOCX: ${result.error}`);
    }
  };

  const parseContentToBlocks = (html) => {
    // Simple parser to convert HTML to blocks
    // This is a basic implementation - you might want to enhance this
    const div = document.createElement('div');
    div.innerHTML = html;
    const blocks = [];
    
    div.querySelectorAll('p, h1, h2, h3').forEach((el, index) => {
      const text = el.textContent || '';
      if (text.trim()) {
        let type = 'action';
        
        // Determine block type based on styling/classes
        if (el.style.textAlign === 'center' || el.classList.contains('block-character')) {
          type = 'character';
        } else if (el.classList.contains('block-dialogue')) {
          type = 'dialogue';
        } else if (el.style.textAlign === 'right' || el.classList.contains('block-right')) {
          type = 'right';
        } else if (el.classList.contains('block-parenthetical')) {
          type = 'parenthetical';
        } else if (el.tagName.match(/^H[1-6]$/) || el.classList.contains('block-scene')) {
          type = 'scene';
        }
        
        blocks.push({
          id: `block-${index}`,
          type,
          text: text.trim(),
          content: html
        });
      }
    });
    
    return blocks;
  };

  const handleAddComment = (comment) => {
    setComments(prev => [...prev, comment]);
  };

  const handleDeleteComment = (index) => {
    setComments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveMetadata = (newMetadata) => {
    setMetadata({
      ...newMetadata,
      lastModified: new Date().toISOString()
    });
  };

  const handleContentUpdate = (newContent) => {
    setContent(newContent);
  };

  const handleBlockTypeChange = (type) => {
    setCurrentBlockType(type);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Menu
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onExportPDF={handleExportPDF}
        onExportDOCX={handleExportDOCX}
        onShowMetadata={() => setShowMetadataModal(true)}
      />

      <Toolbar editor={editor} />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto' }}>
          <div className="editor-container">
            <div ref={pageRef} className="page">
              {metadata.title && (
                <div style={{ 
                  textAlign: 'center', 
                  marginBottom: '20px',
                  fontWeight: 'bold',
                  fontSize: '16pt'
                }}>
                  {metadata.title}
                </div>
              )}
              <Ruler />
              <Editor
                content={content}
                onUpdate={handleContentUpdate}
                currentBlockType={currentBlockType}
                onBlockTypeChange={handleBlockTypeChange}
                onEditorReady={handleEditorReady}
              />
            </div>
          </div>
        </div>

        {showComments && (
          <CommentsPanel
            comments={comments}
            onAddComment={handleAddComment}
            onDeleteComment={handleDeleteComment}
            selectedBlockId={selectedBlockId}
          />
        )}
      </div>

      <MetadataModal
        isOpen={showMetadataModal}
        onClose={() => setShowMetadataModal(false)}
        metadata={metadata}
        onSave={handleSaveMetadata}
      />

      <div style={{ 
        position: 'fixed', 
        bottom: '10px', 
        right: '10px', 
        background: 'white', 
        padding: '8px 12px', 
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        fontSize: '12px',
        color: '#666'
      }}>
        {currentFilename} • {metadata.author || 'Untitled'}
      </div>
    </div>
  );
}

export default App;

