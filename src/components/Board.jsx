import { useEffect, useState, useMemo } from "react";
import { Search, Moon } from "lucide-react";
import Column from "./Column.jsx";
import Toast from "./Toast.jsx";
import { getTasks, createTask, updateTask, deleteTask } from "../api.js";

function getColumnIcon(column) {
  const icons = ["▣", "☰", "◷", "✓"];
  return icons[(column.position - 1) % icons.length] || "☐";
}

const defaultColumns = [
  { id: 1, name: "To-do", position: 1 },
  { id: 2, name: "In Progress", position: 2 },
  { id: 3, name: "Review", position: 3 },
  { id: 4, name: "Done", position: 4 },
];

export default function Board() {
  const [boardTitle, setBoardTitle] = useState("Board Saya");
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  const [toast, setToast] = useState(null);
  function showToast(message, type = "error") { setToast({ message, type }); }
  function closeToast() { setToast(null); }

  // ─── AMBIL DATA ─────────────────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // TODO: implementasi fungsi get task

        if (!Array.isArray(tasksData) || tasksData.length === 0) {
          setBoardTitle("Main Board");
          setColumns(defaultColumns);
          setTasks([]);
          return;
        }

        const boardName = tasksData[0]?.column?.board?.name || "Main Board";
        setBoardTitle(boardName);

        setColumns(defaultColumns);

        const allTasks = tasksData.map((task) => ({
          ...task,
          status: task.column_id,
        }));
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
        setError("Gagal ambil data. Jalankan backend dulu di http://127.0.0.1:3000");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // ─── CRUD ───────────────────────────────────────────

  async function handleAddTask(columnId, formData) {
    try {
      // TODO: implementasi fungsi create task

      setTasks((prev) => [...prev, { ...taskBaru, status: columnId }]);
      showToast("Task berhasil ditambahkan!", "success");
    } catch {
      showToast("Gagal nambah task. Coba lagi ya.");
    }
  }

  async function handleDeleteTask(taskId) {
    try {
      // TODO: implementasi fungsi untuk delete task
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast("Task berhasil dihapus!", "success");
    } catch {
      showToast("Gagal hapus task. Coba lagi ya.");
    }
  }

  async function handleMoveTask(taskId, newColumnId) {
    try {
      // TODO: implementasi fungsi update task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newColumnId } : t
        )
      );
      showToast("Task berhasil dipindahkan!", "success");
    } catch {
      showToast("Gagal pindahin task.");
    }
  }

  // ─── FILTER ─────────────────────────────────────────

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus =
        activeStatus === "all" || task.status === activeStatus;
      const keyword = search.toLowerCase();
      const matchSearch =
        (task.title && task.title.toLowerCase().includes(keyword)) ||
        (task.description && task.description.toLowerCase().includes(keyword));
      return matchStatus && matchSearch;
    });
  }, [tasks, activeStatus, search]);

  const visibleColumns =
    activeStatus === "all"
      ? columns
      : columns.filter((col) => col.id === activeStatus);

  // ─── LOADING ────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-indigo-950">Memuat data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-lg text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-950 text-white text-sm font-bold px-6 py-2 rounded-full cursor-pointer"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // ─── RENDER ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white text-indigo-950 font-sans">
      <header className="h-16 px-16 max-md:px-5 bg-blue-50 flex items-center justify-between">
        <div className="flex items-center gap-7 font-bold">
          <Moon size={18} />
          <span>INDIGO</span>
        </div>
        <nav className="flex items-center gap-7 font-bold">
          <a className="cursor-pointer">Project</a>
          <a className="cursor-pointer">People</a>
          <a className="cursor-pointer">Setting</a>
        </nav>
      </header>

      <main className="py-8 px-16 max-md:px-5">
        <section className="flex flex-wrap items-center gap-3 mb-6">
          <select className="w-40 h-10 px-4 border-none rounded-full bg-indigo-50/50 text-indigo-900 font-bold outline-none cursor-pointer">
            <option>{boardTitle}</option>
          </select>

          <div className="flex gap-2 max-md:overflow-x-auto">
            <button
              className={`h-10 px-4 border-none rounded-full font-bold cursor-pointer outline-none whitespace-nowrap ${
                activeStatus === "all"
                  ? "bg-indigo-950 text-white"
                  : "bg-indigo-50/50 text-indigo-900"
              }`}
              onClick={() => setActiveStatus("all")}
            >
              All
            </button>

            {columns.map((column) => (
              <button
                key={column.id}
                className={`h-10 px-4 border-none rounded-full font-bold cursor-pointer outline-none whitespace-nowrap ${
                  activeStatus === column.id
                    ? "bg-indigo-950 text-white"
                    : "bg-indigo-50/50 text-indigo-900"
                }`}
                onClick={() => setActiveStatus(column.id)}
              >
                {getColumnIcon(column)} {column.name}
              </button>
            ))}
          </div>

          <div className="flex-1 h-10 px-3 flex items-center border-none rounded-full bg-indigo-50/50 text-indigo-900 font-bold">
            <input
              type="text"
              placeholder="Search task..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-none outline-none bg-transparent text-indigo-900 font-bold placeholder-indigo-900/50"
            />
            <Search size={18} className="text-indigo-900" />
          </div>
        </section>

        <section
          className={`grid gap-4 max-md:grid-cols-1 ${
            activeStatus !== "all" ? "grid-cols-1 max-w-sm" : "grid-cols-4"
          }`}
        >
          {visibleColumns.map((column) => (
            <Column
              key={column.id}
              columnId={column.id}
              title={column.name}
              icon={getColumnIcon(column)}
              tasks={filteredTasks.filter((task) => task.status === column.id)}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onMoveTask={handleMoveTask}
            />
          ))}
        </section>
      </main>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
