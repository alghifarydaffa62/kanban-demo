import { useState } from "react";
import Card from "./Card.jsx";

export default function Column({
  columnId,
  title,
  icon,
  tasks,
  onAddTask,
  onDeleteTask,
  onMoveTask,
}) {
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [dragOver, setDragOver] = useState(false);

  // ─── DRAG & DROP ──────────────────────────────────────

  function handleDragStart(e, taskId) {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ taskId, sourceColumnId: columnId })
    );
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      if (data.taskId && data.sourceColumnId !== columnId) {
        onMoveTask(data.taskId, columnId);
      }
    } catch {
      // data transfer invalid
    }
  }

  // ─── FORM ─────────────────────────────────────────────

  function handleSubmit(e) {
    e.preventDefault();
    if (!formTitle.trim()) return;

    onAddTask(columnId, {
      title: formTitle,
      description: formDesc,
      position: tasks.length + 1,
    });

    setFormTitle("");
    setFormDesc("");
    setShowForm(false);
  }

  return (
    <div
      className={`bg-blue-50/70 rounded-2xl p-4 min-h-96 transition-all ${
        dragOver ? "bg-indigo-100 ring-2 ring-indigo-300" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold">
          {icon} {title}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="border-none bg-transparent text-2xl cursor-pointer outline-none"
        >
          +
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-3.5 mb-3.5 space-y-2"
        >
          <input
            type="text"
            placeholder="Judul task"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="w-full text-sm font-bold border border-indigo-200 rounded-lg px-3 py-2 outline-none"
            required
          />
          <textarea
            placeholder="Deskripsi (opsional)"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            className="w-full text-xs border border-indigo-200 rounded-lg px-3 py-2 outline-none resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-indigo-950 text-white text-xs font-bold rounded-lg py-2 cursor-pointer"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-200 text-slate-600 text-xs font-bold rounded-lg py-2 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {tasks.length > 0 ? (
        tasks.map((task) => (
          <Card
            key={task.id}
            task={task}
            onDelete={onDeleteTask}
            onDragStart={handleDragStart}
          />
        ))
      ) : (
        <p className="text-sm text-slate-400">Belum ada task.</p>
      )}
    </div>
  );
}