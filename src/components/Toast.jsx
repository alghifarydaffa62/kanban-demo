import { useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

export default function Toast({ message, type = "error", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${
          type === "error"
            ? "bg-red-50 text-red-700 border-red-200"
            : "bg-green-50 text-green-700 border-green-200"
        }`}
      >
        {type === "error" ? (
          <AlertCircle size={18} className="shrink-0" />
        ) : (
          <CheckCircle size={18} className="shrink-0" />
        )}
        <span className="text-sm font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 cursor-pointer border-none bg-transparent opacity-50 hover:opacity-100 transition-opacity shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
