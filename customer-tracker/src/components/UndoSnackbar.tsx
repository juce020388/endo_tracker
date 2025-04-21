import React, { useEffect } from "react";

interface UndoSnackbarProps {
  open: boolean;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
}

const UndoSnackbar: React.FC<UndoSnackbarProps> = ({
  open,
  onUndo,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [open, onClose, duration]);

  if (!open) return null;
  return (
    <div
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg z-50 flex items-center gap-4 animate-fade-in"
      style={{ background: "var(--color-accent-dark)", color: "#fff" }}
    >
      <span>
        Data reset!{" "}
        <button
          style={{
            color: "var(--color-link)",
            textDecoration: "underline",
            fontWeight: 700,
            marginLeft: 8,
          }}
          onClick={onUndo}
        >
          Undo
        </button>
      </span>
      <button
        style={{ color: "#fff", marginLeft: 16 }}
        className="hover:text-[var(--color-error)]"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default UndoSnackbar;
