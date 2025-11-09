import { 
  FaBold, 
  FaItalic, 
  FaAlignLeft, 
  FaAlignCenter, 
  FaAlignRight,
  FaHeading,
  FaListUl,
  FaListOl,
  FaImage,
  FaLink
} from 'react-icons/fa';

export default function Toolbar({ editor }) {
  if (!editor) {
    return null;
  }

  return (
    <div className="toolbar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`toolbar-button ${editor.isActive('bold') ? 'active' : ''}`}
        title="Bold (Ctrl+B)"
      >
        <FaBold />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`toolbar-button ${editor.isActive('italic') ? 'active' : ''}`}
        title="Italic (Ctrl+I)"
      >
        <FaItalic />
      </button>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 8px' }} />

      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
        title="Align Left"
      >
        <FaAlignLeft />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
        title="Align Center"
      >
        <FaAlignCenter />
      </button>

      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`toolbar-button ${editor.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
        title="Align Right"
      >
        <FaAlignRight />
      </button>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 8px' }} />

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`toolbar-button ${editor.isActive('heading', { level: 2 }) ? 'active' : ''}`}
        title="Heading"
      >
        <FaHeading />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`toolbar-button ${editor.isActive('bulletList') ? 'active' : ''}`}
        title="Bullet List"
      >
        <FaListUl />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`toolbar-button ${editor.isActive('orderedList') ? 'active' : ''}`}
        title="Numbered List"
      >
        <FaListOl />
      </button>

      <div className="toolbar-divider" style={{ width: '1px', height: '24px', background: '#ddd', margin: '0 8px' }} />

      <button
        onClick={() => {
          const url = window.prompt('Enter image URL:');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
        className="toolbar-button"
        title="Insert Image"
      >
        <FaImage />
      </button>

      <button
        onClick={() => {
          const url = window.prompt('Enter URL:');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`toolbar-button ${editor.isActive('link') ? 'active' : ''}`}
        title="Insert Link"
      >
        <FaLink />
      </button>

      <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#666', padding: '6px 12px' }}>
        <span style={{ marginRight: '16px' }}>Ctrl+1: Action</span>
        <span style={{ marginRight: '16px' }}>Ctrl+2: Character</span>
        <span style={{ marginRight: '16px' }}>Ctrl+3: Dialogue</span>
        <span style={{ marginRight: '16px' }}>Ctrl+4: Right</span>
        <span style={{ marginRight: '16px' }}>Ctrl+5: Parenthetical</span>
        <span>Ctrl+6: Scene</span>
      </div>
    </div>
  );
}

