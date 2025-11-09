import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import html2pdf from 'html2pdf.js';

/**
 * Export document to PDF
 */
export async function exportToPDF(pageElement, filename = 'MyScript.pdf') {
  try {
    const opt = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    await html2pdf().set(opt).from(pageElement).save();
    return { success: true };
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Export document to DOCX
 */
export async function exportToDOCX(content, metadata, filename = 'MyScript.docx') {
  try {
    const children = [];

    // Add title if metadata exists
    if (metadata && metadata.title) {
      children.push(
        new Paragraph({
          text: metadata.title,
          heading: HeadingLevel.TITLE,
          spacing: { after: 400 }
        })
      );
    }

    // Add metadata if available
    if (metadata && metadata.author) {
      children.push(
        new Paragraph({
          text: `Written by: ${metadata.author}`,
          spacing: { after: 200 }
        })
      );
    }

    // Process blocks
    if (content.blocks && Array.isArray(content.blocks)) {
      content.blocks.forEach(block => {
        const runs = [];
        
        // Handle text content (could be HTML or plain text)
        let text = '';
        if (typeof block.text === 'string') {
          text = block.text.replace(/<[^>]*>/g, ''); // Strip HTML tags
        } else if (block.content) {
          text = extractTextFromContent(block.content);
        }

        if (text.trim()) {
          runs.push(new TextRun(text));
        }

        if (runs.length > 0) {
          const paragraphOptions = {
            children: runs,
            spacing: { after: block.type === 'dialogue' || block.type === 'action' ? 240 : 120 }
          };

          // Apply alignment based on block type
          switch (block.type) {
            case 'character':
            case 'scene':
              paragraphOptions.alignment = AlignmentType.CENTER;
              if (block.type === 'character') {
                runs[0].bold = true;
                runs[0].allCaps = true;
              }
              if (block.type === 'scene') {
                runs[0].bold = true;
                runs[0].allCaps = true;
              }
              break;
            case 'dialogue':
              paragraphOptions.indent = { left: 2540 }; // ~1 inch
              paragraphOptions.spacing = { after: 240 };
              break;
            case 'parenthetical':
              paragraphOptions.indent = { left: 3810 }; // ~1.5 inches
              runs[0].italics = true;
              break;
            case 'right':
              paragraphOptions.alignment = AlignmentType.RIGHT;
              break;
            default:
              paragraphOptions.alignment = AlignmentType.LEFT;
          }

          children.push(new Paragraph(paragraphOptions));
        }
      });
    } else if (content.html) {
      // Fallback: if content is HTML, extract text
      const div = document.createElement('div');
      div.innerHTML = content.html;
      const text = div.textContent || div.innerText || '';
      if (text.trim()) {
        text.split('\n').forEach(line => {
          if (line.trim()) {
            children.push(new Paragraph({ text: line.trim() }));
          }
        });
      }
    }

    const doc = new Document({
      sections: [
        {
          properties: {},
          children
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
    return { success: true };
  } catch (error) {
    console.error('Error exporting to DOCX:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Extract text from TipTap content JSON
 */
function extractTextFromContent(content) {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content.map(item => {
      if (typeof item === 'string') {
        return item;
      }
      if (item.type === 'text' && item.text) {
        return item.text;
      }
      if (item.content) {
        return extractTextFromContent(item.content);
      }
      return '';
    }).join('');
  }

  if (content && content.content) {
    return extractTextFromContent(content.content);
  }

  return '';
}

