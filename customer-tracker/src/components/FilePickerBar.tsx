import React, { useRef } from 'react';
import { CustomerVisit } from '../types';

interface FilePickerBarProps {
  visits: CustomerVisit[];
  setVisits: (visits: CustomerVisit[]) => void;
  defaultFilename?: string;
}

const FilePickerBar: React.FC<FilePickerBarProps> = ({ visits, setVisits, defaultFilename = 'customer-visits.json' }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open file dialog and load JSON
  const handleOpen = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const raw = JSON.parse(reader.result as string);
        const visits = Array.isArray(raw) ? raw : (raw.data ?? []);
        setVisits(visits);
      } catch {
        alert('Invalid or corrupted JSON file.');
      }
    };
    reader.readAsText(file);
    // Reset value so same file can be picked again
    e.target.value = '';
  };

  // Save as: always prompts for filename/location
  const handleSaveAs = () => {
    const exportObj = { type: 'customer-visits', exportedAt: new Date().toISOString(), data: visits };
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = defaultFilename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Save: uses File System Access API if available, else fallback to Save As
  const handleSave = async () => {
    // @ts-ignore: File System Access API is not yet in TS lib
    if ('showSaveFilePicker' in window) {
      try {
        // @ts-ignore
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultFilename,
          types: [{
            description: 'JSON Files',
            accept: { 'application/json': ['.json'] },
          }],
        });
        const writable = await handle.createWritable();
        const exportObj = { type: 'customer-visits', exportedAt: new Date().toISOString(), data: visits };
        await writable.write(JSON.stringify(exportObj, null, 2));
        await writable.close();
        alert('File saved successfully!');
      } catch (e) {
        // User cancelled or error; do nothing (do NOT fallback to Save As)
      }
      return;
    }
    handleSaveAs();
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 justify-end items-center">
      <button style={{ background: 'var(--color-accent)', color: 'var(--color-accent-dark)', border: '1px solid var(--color-border)' }} className="px-3 py-1 rounded" onClick={handleOpen}>
        Open File
      </button>
      <input
        type="file"
        accept=".json,application/json"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <button style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid var(--color-border)' }} className="px-3 py-1 rounded" onClick={handleSave}>
        Save
      </button>
      <button style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid var(--color-border)' }} className="px-3 py-1 rounded" onClick={handleSaveAs}>
        Save As
      </button>
    </div>
  );
};

export default FilePickerBar;
