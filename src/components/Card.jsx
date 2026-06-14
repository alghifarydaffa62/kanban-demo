import { Trash2 } from "lucide-react";

export default function Card({ task, onDelete, onDragStart }) {
  const taskTitle = task?.title || "(Tanpa judul)";
  const taskDesc = task?.description || "";

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task?.id)}
      className="bg-white rounded-xl p-3.5 mb-3 cursor-grab active:cursor-grabbing select-none"
    >
      <h4 className="text-sm font-bold mb-1">{taskTitle}</h4>

      {taskDesc && (
        <p className="text-xs text-slate-500 mb-2 leading-relaxed line-clamp-2">
          {taskDesc}
        </p>
      )}

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
