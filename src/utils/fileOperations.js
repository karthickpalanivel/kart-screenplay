/**
 * File operations using File System Access API
 */

/**
 * Save content to disk as .fscript file
 */
export async function saveToDisk(content, suggestedName = 'MyScript.fscript') {
  try {
    if (!window.showSaveFilePicker) {
      // Fallback for browsers that don't support File System Access API
      return saveFileFallback(content, suggestedName);
    }

    const handle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: 'Film Script Files',
          accept: { 'application/json': ['.fscript'] }
        }
      ]
    });

    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(content, null, 2));
    await writable.close();

    return { success: true, filename: suggestedName };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'User cancelled' };
    }
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Open file from disk
 */
export async function openFromDisk() {
  try {
    if (!window.showOpenFilePicker) {
      // Fallback for browsers that don't support File System Access API
      return openFileFallback();
    }

    const [fileHandle] = await window.showOpenFilePicker({
      types: [
        {
          description: 'Film Script Files',
          accept: { 'application/json': ['.fscript'] }
        }
      ],
      multiple: false
    });

    const file = await fileHandle.getFile();
    const text = await file.text();
    const content = JSON.parse(text);

    return { success: true, content, filename: file.name };
  } catch (error) {
    if (error.name === 'AbortError') {
      return { success: false, error: 'User cancelled' };
    }
    console.error('Error opening file:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fallback save method using download
 */
function saveFileFallback(content, filename) {
  try {
    const blob = new Blob([JSON.stringify(content, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return { success: true, filename };
  } catch (error) {
    console.error('Error in fallback save:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fallback open method using file input
 */
function openFileFallback() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.fscript,application/json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const text = await file.text();
          const content = JSON.parse(text);
          resolve({ success: true, content, filename: file.name });
        } catch (error) {
          resolve({ success: false, error: error.message });
        }
      } else {
        resolve({ success: false, error: 'No file selected' });
      }
    };
    input.click();
  });
}

/**
 * Auto-save to localStorage
 */
export function autoSaveToLocalStorage(content) {
  try {
    localStorage.setItem('filmScript_autosave', JSON.stringify(content));
    localStorage.setItem('filmScript_autosave_timestamp', Date.now().toString());
    return true;
  } catch (error) {
    console.error('Error auto-saving to localStorage:', error);
    return false;
  }
}

/**
 * Load from localStorage autosave
 */
export function loadFromLocalStorage() {
  try {
    const saved = localStorage.getItem('filmScript_autosave');
    if (saved) {
      return { success: true, content: JSON.parse(saved) };
    }
    return { success: false, error: 'No autosave found' };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Clear autosave from localStorage
 */
export function clearAutoSave() {
  try {
    localStorage.removeItem('filmScript_autosave');
    localStorage.removeItem('filmScript_autosave_timestamp');
    return true;
  } catch (error) {
    console.error('Error clearing autosave:', error);
    return false;
  }
}

