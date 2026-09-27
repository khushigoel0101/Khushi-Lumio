import React, { useEffect, useRef, useState } from "react";

const VARIANT_STYLES = {
  danger: {
    confirmClasses:
      "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-300",
    spinnerClasses: "border-white/40 border-t-white",
  },
  default: {
    confirmClasses:
      "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-300",
    spinnerClasses: "border-white/40 border-t-white",
  },
};

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loadingLabel = "Working...",
  variant = "danger",
  isLoading = false,
  errorText = "",
  onConfirm,
  onCancel,
}) => {
  const confirmButtonRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEntered(false);
      return;
    }

    // Trigger the enter transition on the next frame so the
    // opacity/scale change actually animates instead of snapping in.
    const raf = requestAnimationFrame(() => setEntered(true));
    confirmButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const styles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;

  const handleBackdropClick = () => {
    if (!isLoading) onCancel();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 transition-opacity duration-150 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleBackdropClick}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200 transition-all duration-150 ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <h3
          id="confirm-dialog-title"
          className="text-base font-semibold text-slate-900"
        >
          {title}
        </h3>

        <p
          id="confirm-dialog-message"
          className="mt-2 text-sm leading-6 text-slate-600"
        >
          {message}
        </p>

        {errorText && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 ring-1 ring-red-200">
            {errorText}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-70 ${styles.confirmClasses}`}
          >
            {isLoading && (
              <span
                className={`h-3.5 w-3.5 animate-spin rounded-full border-2 ${styles.spinnerClasses}`}
              />
            )}
            {isLoading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;