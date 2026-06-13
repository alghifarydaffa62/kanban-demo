import { Trash2 } from "lucide-react";

// Ubah "2026-06-30" jadi "30 Juni 2026"
function formatDeadline(isoDate) {
  if (!isoDate) return null;
  try {
    const date = new Date(isoDate + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

export default function Card({ task, onDelete, onDragStart }) {
  const taskTitle = task?.title || "(Tanpa judul)";
  const taskDesc = task?.description || "";
  const taskDeadline = formatDeadline(task?.deadline);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task?.id)}
      className="bg-white rounded-xl p-3.5 mb-3 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Deadline */}
      {taskDeadline && (
        <div className="flex justify-end mb-2">
          <span className="text-[10px] font-semibold text-slate-400">
            {taskDeadline}
          </span>
        </div>
      )}

      {/* Judul */}
      <h4 className="text-sm font-bold mb-1">{taskTitle}</h4>

      {/* Deskripsi */}
      {taskDesc && (
        <p className="text-xs text-slate-500 mb-2 leading-relaxed line-clamp-2">
          {taskDesc}
        </p>
      )}

      {/* Tombol hapus */}
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task?.id);
          }}
          className="text-red-300 hover:text-red-500 bg-transparent hover:bg-red-50 rounded-lg p-1.5 cursor-pointer border-none transition-colors"
          title="Hapus task"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
