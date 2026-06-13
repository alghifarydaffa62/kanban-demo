import { useEffect, useState, useMemo } from "react";
import { Search, Moon } from "lucide-react";
import Column from "./Column.jsx";
import Toast from "./Toast.jsx";
import { getBoards, getBoard, getColumnsByBoard, createTask, deleteTask, moveTask } from "../api.js";

// Ikon berdasarkan urutan posisi kolom dari backend
function getColumnIcon(column) {
  const icons = ["▣", "☰", "◷", "✓"];
  return icons[(column.position - 1) % icons.length] || "☐";
}

export default function Board() {
  // State utama
  const [boardTitle, setBoardTitle] = useState("Board Saya");
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State filter
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");

  // State toast notifikasi
  const [toast, setToast] = useState(null);

  function showToast(message, type = "error") {
    setToast({ message, type });
  }

  function closeToast() {
    setToast(null);
  }

  // ─── AMBIL DATA DARI BACKEND ──────────────────────────
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // Dapatkan daftar semua board


        // Pastikan data boards adalah array
        if (!Array.isArray(boards) || boards.length === 0) {
          setBoardTitle("Belum ada board");
          setColumns([]);
          setTasks([]);
          return;
        }

        // Ambil board pertama + seluruh kolom + task nya
        const boardId = boards[0]?.id;
        if (!boardId) {
          setError("Data board tidak valid.");
          return;
        }

        // TODO: Ambil detail board

        setBoardTitle(boardData?.name || "Board Saya");

        // TODO: Ambil kolom + tasks — backend pake "Columns" (capital C) dan "Tasks" (capital T)
        let cols = [];
        try {
            
          // TODO: gunakan function get columns by board
          cols = columnsRes.data;
        } catch {
          cols = boardData?.Columns || boardData?.columns || [];
        }

        if (!Array.isArray(cols)) cols = [];

        setColumns(cols);

        // Gabung semua task dari tiap kolom, tambah field "status" biar gampang difilter
        const allTasks = [];
        cols.forEach((col) => {
          const tasksList = col.Tasks || col.tasks || [];
          tasksList.forEach((task) => {
            allTasks.push({ ...task, status: col.id });
          });
        });
        setTasks(allTasks);
      } catch (err) {
        console.error(err);
        setError("Gagal ambil data. Jalankan backend dulu di http://localhost:5000");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // TODO: lengkapi function handle add task
  async function handleAddTask(columnId, formData) {
    try {
      // TODO: gunakan function createTask
      setTasks((prev) => [...prev, { ...taskBaru, status: columnId }]);
      showToast("Task berhasil ditambahkan!", "success");
    } catch {
      showToast("Gagal nambah task. Coba lagi ya.");
    }
  }

  // TODO: lengkapi function handle delete
  async function handleDeleteTask(taskId) {
    try {
      // TODO: gunakan function delete task
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      showToast("Task berhasil dihapus!", "success");
    } catch {
      showToast("Gagal hapus task. Coba lagi ya.");
    }
  }

  // TODO: lengkapi function handle move task
  async function handleMoveTask(taskId, newColumnId) {
    try {
      // TODO: gunakan function move task
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, status: newColumnId } : t
        )
      );
      showToast("Task berhasil dipindahkan!", "success");
    } catch {
      showToast("WIP limit! Selesaikan task dulu.");
    }
  }

  // ─── FILTER TASK ──────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus = activeStatus === "all" || task.status === activeStatus;
      const keyword = search.toLowerCase();
      const matchSearch =
        (task.title && task.title.toLowerCase().includes(keyword)) ||
        (task.description && task.description.toLowerCase().includes(keyword));
      return matchStatus && matchSearch;
    });
  }, [tasks, activeStatus, search]);

  // Kolom yang tampil (semua atau hanya satu)
  const visibleColumns =
    activeStatus === "all"
      ? columns
      : columns.filter((col) => col.id === activeStatus);

  // ─── LOADING ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-lg text-indigo-950">Memuat data...</p>
      </div>
    );
  }

  // ─── ERROR ────────────────────────────────────────────
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

  // ─── KOSONG (BELUM ADA BOARD) ─────────────────────────
  if (columns.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <p className="text-lg text-indigo-950 font-bold">
          {boardTitle}
        </p>
        <p className="text-sm text-slate-400">
          Buat board dulu lewat backend, atau pastikan backend sudah jalan.
        </p>
      </div>
    );
  }

  // ─── RENDER UTAMA ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-white text-indigo-950 font-sans">
      {/* ─── HEADER ─── */}
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

      {/* ─── KONTEN UTAMA ─── */}
      <main className="py-8 px-16 max-md:px-5">
        <section className="flex flex-wrap items-center gap-3 mb-6">
          {/* Pilih Project */}
          <select className="w-40 h-10 px-4 border-none rounded-full bg-indigo-50/50 text-indigo-900 font-bold outline-none cursor-pointer">
            <option>{boardTitle}</option>
          </select>

          {/* Tombol filter status */}
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

          {/* Input Pencarian */}
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

        {/* Daftar Kolom */}
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

      {/* Toast notifikasi */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </div>
  );
}
