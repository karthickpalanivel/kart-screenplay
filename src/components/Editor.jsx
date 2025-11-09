import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useEffect, useRef } from 'react';

export default function Editor({ content, onUpdate, currentBlockType, onBlockTypeChange, onEditorReady }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your screenplay...',
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror writing-area',
      },
    },
  });

  const editorRef = useRef(null);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '');
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            applyBlockType('action');
            break;
          case '2':
            event.preventDefault();
            applyBlockType('character');
            break;
          case '3':
            event.preventDefault();
            applyBlockType('dialogue');
            break;
          case '4':
            event.preventDefault();
            applyBlockType('right');
            break;
          case '5':
            event.preventDefault();
            applyBlockType('parenthetical');
            break;
          case '6':
            event.preventDefault();
            applyBlockType('scene');
            break;
          default:
            return;
        }
      }
    };

    const applyBlockType = (type) => {
      if (onBlockTypeChange) {
        onBlockTypeChange(type);
      }

      // Get the current selection
      const { from, to, $from } = editor.state.selection;
      const currentNode = $from.node($from.depth);
      
      // Apply formatting based on block type
      switch (type) {
        case 'action':
          // Clear any heading, set left align, clear bold/italic
          editor.chain()
            .focus()
            .clearNodes()
            .setParagraph()
            .setTextAlign('left')
            .unsetBold()
            .unsetItalic()
            .run();
          break;
          
        case 'character':
          // Center align, bold, uppercase (via CSS)
          editor.chain()
            .focus()
            .clearNodes()
            .setParagraph()
            .setTextAlign('center')
            .toggleBold()
            .run();
          break;
          
        case 'dialogue':
          // Left align, normal weight - dialogue formatting applied via CSS
          editor.chain()
            .focus()
            .clearNodes()
            .setParagraph()
            .setTextAlign('left')
            .unsetBold()
            .unsetItalic()
            .run();
          // Mark as dialogue using a data attribute (handled in CSS)
          setTimeout(() => {
            const activePara = editor.view.dom.querySelector('p[style*="text-align: left"]');
            if (activePara && !activePara.style.fontStyle) {
              activePara.setAttribute('data-block-type', 'dialogue');
            }
          }, 0);
          break;
          
        case 'right':
          // Right align
          editor.chain()
            .focus()
            .clearNodes()
            .setParagraph()
            .setTextAlign('right')
            .run();
          break;
          
        case 'parenthetical':
          // Left align with indent, italic
          editor.chain()
            .focus()
            .clearNodes()
            .setParagraph()
            .setTextAlign('left')
            .toggleItalic()
            .run();
          // Mark as parenthetical
          setTimeout(() => {
            const activePara = editor.view.dom.querySelector('p[style*="font-style: italic"]');
            if (activePara) {
              activePara.setAttribute('data-block-type', 'parenthetical');
            }
          }, 0);
          break;
          
        case 'scene':
          // Bold, uppercase heading
          editor.chain()
            .focus()
            .clearNodes()
            .toggleHeading({ level: 2 })
            .setTextAlign('left')
            .toggleBold()
            .run();
          break;
      }
    };

    editor.view.dom.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.view.dom.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, onBlockTypeChange]);

  // Note: Block type classes are applied via keyboard shortcuts to individual paragraphs
  // The currentBlockType state is mainly for tracking the active mode

  if (!editor) {
    return null;
  }

  return (
    <div ref={editorRef} className="editor-content">
      <EditorContent editor={editor} />
    </div>
  );
}

