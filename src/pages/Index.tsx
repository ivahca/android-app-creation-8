import { useState } from "react";
import Icon from "@/components/ui/icon";

// ─── Types ───────────────────────────────────────────────
type Category = { id: string; name: string; color: string };
type Task = { id: string; text: string; done: boolean; categoryId: string };
type Habit = { id: string; name: string; categoryId: string; streak: number; doneToday: boolean };
type Transaction = { id: string; label: string; amount: number; type: "income" | "expense"; categoryId: string };

const TASK_CATEGORIES: Category[] = [
  { id: "montazh", name: "Монтажные работы", color: "#2563eb" },
  { id: "office", name: "Офис", color: "#7c3aed" },
  { id: "personal", name: "Личное", color: "#059669" },
];

const HABIT_CATEGORIES: Category[] = [
  { id: "health", name: "Здоровье", color: "#dc2626" },
  { id: "develop", name: "Развитие", color: "#d97706" },
  { id: "routine", name: "Распорядок", color: "#0891b2" },
];

const FIN_CATEGORIES: Category[] = [
  { id: "work", name: "Работа", color: "#2563eb" },
  { id: "food", name: "Питание", color: "#16a34a" },
  { id: "transport", name: "Транспорт", color: "#d97706" },
  { id: "other", name: "Прочее", color: "#6b7280" },
];

const INIT_TASKS: Task[] = [
  { id: "t1", text: "Установка каркаса стен", done: true, categoryId: "montazh" },
  { id: "t2", text: "Прокладка электрокабеля", done: false, categoryId: "montazh" },
  { id: "t3", text: "Монтаж гипсокартона", done: false, categoryId: "montazh" },
  { id: "t4", text: "Подготовить смету", done: false, categoryId: "office" },
  { id: "t5", text: "Позвонить поставщику", done: true, categoryId: "office" },
  { id: "t6", text: "Купить стройматериалы", done: false, categoryId: "personal" },
];

const INIT_HABITS: Habit[] = [
  { id: "h1", name: "Зарядка 15 мин", categoryId: "health", streak: 5, doneToday: true },
  { id: "h2", name: "Читать книгу", categoryId: "develop", streak: 12, doneToday: false },
  { id: "h3", name: "Стакан воды утром", categoryId: "routine", streak: 3, doneToday: true },
  { id: "h4", name: "Планировать день", categoryId: "routine", streak: 7, doneToday: false },
];

const INIT_TRANSACTIONS: Transaction[] = [
  { id: "f1", label: "Оплата монтажных работ", amount: 85000, type: "income", categoryId: "work" },
  { id: "f2", label: "Материалы для объекта", amount: 23400, type: "expense", categoryId: "other" },
  { id: "f3", label: "Обед в кафе", amount: 640, type: "expense", categoryId: "food" },
  { id: "f4", label: "Проезд на объект", amount: 180, type: "expense", categoryId: "transport" },
  { id: "f5", label: "Аванс от заказчика", amount: 40000, type: "income", categoryId: "work" },
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function getCat(cats: Category[], id: string) {
  return cats.find((c) => c.id === id);
}

function CategoryDot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />;
}

// ─── Tasks ────────────────────────────────────────────────
function TasksSection() {
  const [tasks, setTasks] = useState<Task[]>(INIT_TASKS);
  const [newText, setNewText] = useState("");
  const [newCat, setNewCat] = useState(TASK_CATEGORIES[0].id);
  const [filterCat, setFilterCat] = useState<string>("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const grouped = TASK_CATEGORIES.filter((c) => filterCat === "all" || c.id === filterCat).map((cat) => ({
    cat,
    items: tasks.filter((t) => t.categoryId === cat.id),
  }));

  function addTask() {
    if (!newText.trim()) return;
    setTasks([...tasks, { id: uid(), text: newText.trim(), done: false, categoryId: newCat }]);
    setNewText("");
  }

  function toggleTask(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function startEdit(t: Task) {
    setEditId(t.id);
    setEditText(t.text);
  }

  function saveEdit(id: string) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: editText.trim() || t.text } : t)));
    setEditId(null);
  }

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="stat-card">
          <span className="stat-num">{tasks.length}</span>
          <span className="stat-label">Всего задач</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{ color: "#16a34a" }}>{done}</span>
          <span className="stat-label">Выполнено</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{ color: "#d97706" }}>{tasks.length - done}</span>
          <span className="stat-label">В работе</span>
        </div>
      </div>

      <div className="add-row">
        <input
          className="add-input"
          placeholder="Новая задача…"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <select className="add-select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
          {TASK_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="add-btn" onClick={addTask}>
          <Icon name="Plus" size={16} />
        </button>
      </div>

      <div className="filter-row">
        <button className={`filter-pill ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>Все</button>
        {TASK_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`filter-pill ${filterCat === c.id ? "active" : ""}`}
            style={filterCat === c.id ? { borderColor: c.color, color: c.color } : {}}
            onClick={() => setFilterCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {grouped.map(({ cat, items }) =>
          items.length === 0 ? null : (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <CategoryDot color={cat.color} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{cat.name}</span>
                <span className="ml-auto text-xs" style={{ color: "#d1d5db" }}>{items.filter(t => t.done).length}/{items.length}</span>
              </div>
              <div className="space-y-1">
                {items.map((task) => (
                  <div key={task.id} className={`task-row ${task.done ? "done" : ""}`}>
                    <button
                      className="check-box"
                      style={task.done ? { borderColor: cat.color, background: cat.color } : {}}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.done && <Icon name="Check" size={11} className="text-white" />}
                    </button>
                    {editId === task.id ? (
                      <input
                        autoFocus
                        className="task-edit-input"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onBlur={() => saveEdit(task.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(task.id);
                          if (e.key === "Escape") setEditId(null);
                        }}
                      />
                    ) : (
                      <span className="task-text" style={task.done ? { textDecoration: "line-through", color: "#d1d5db" } : {}}>
                        {task.text}
                      </span>
                    )}
                    <div className="task-actions">
                      <button className="icon-btn" onClick={() => startEdit(task)}>
                        <Icon name="Pencil" size={13} />
                      </button>
                      <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => deleteTask(task.id)}>
                        <Icon name="Trash2" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Habits ───────────────────────────────────────────────
function HabitsSection() {
  const [habits, setHabits] = useState<Habit[]>(INIT_HABITS);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState(HABIT_CATEGORIES[0].id);

  function toggleHabit(id: string) {
    setHabits(habits.map((h) =>
      h.id === id
        ? { ...h, doneToday: !h.doneToday, streak: h.doneToday ? Math.max(0, h.streak - 1) : h.streak + 1 }
        : h
    ));
  }

  function addHabit() {
    if (!newName.trim()) return;
    setHabits([...habits, { id: uid(), name: newName.trim(), categoryId: newCat, streak: 0, doneToday: false }]);
    setNewName("");
  }

  function deleteHabit(id: string) {
    setHabits(habits.filter((h) => h.id !== id));
  }

  const grouped = HABIT_CATEGORIES.map((cat) => ({
    cat,
    items: habits.filter((h) => h.categoryId === cat.id),
  }));

  const doneCount = habits.filter((h) => h.doneToday).length;

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <div className="stat-card">
          <span className="stat-num">{habits.length}</span>
          <span className="stat-label">Привычек</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{ color: "#16a34a" }}>{doneCount}</span>
          <span className="stat-label">Сегодня</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{ color: "#d97706" }}>
            {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
          </span>
          <span className="stat-label">Макс. серия</span>
        </div>
      </div>

      <div className="add-row">
        <input
          className="add-input"
          placeholder="Новая привычка…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <select className="add-select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
          {HABIT_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="add-btn" onClick={addHabit}>
          <Icon name="Plus" size={16} />
        </button>
      </div>

      <div className="space-y-5">
        {grouped.map(({ cat, items }) =>
          items.length === 0 ? null : (
            <div key={cat.id}>
              <div className="flex items-center gap-2 mb-2">
                <CategoryDot color={cat.color} />
                <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#9ca3af" }}>{cat.name}</span>
              </div>
              <div className="space-y-1">
                {items.map((h) => {
                  const hcat = getCat(HABIT_CATEGORIES, h.categoryId)!;
                  return (
                    <div key={h.id} className={`task-row ${h.doneToday ? "done" : ""}`}>
                      <button
                        className="check-box"
                        style={h.doneToday ? { borderColor: hcat.color, background: hcat.color } : {}}
                        onClick={() => toggleHabit(h.id)}
                      >
                        {h.doneToday && <Icon name="Check" size={11} className="text-white" />}
                      </button>
                      <span className="task-text" style={h.doneToday ? { textDecoration: "line-through", color: "#d1d5db" } : {}}>
                        {h.name}
                      </span>
                      <div className="task-actions">
                        <span className="streak-badge" style={{ color: hcat.color }}>
                          <Icon name="Flame" size={12} />
                          {h.streak}
                        </span>
                        <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => deleteHabit(h.id)}>
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ─── Finance ─────────────────────────────────────────────
function FinanceSection() {
  const [transactions, setTransactions] = useState<Transaction[]>(INIT_TRANSACTIONS);
  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<"income" | "expense">("expense");
  const [newCat, setNewCat] = useState(FIN_CATEGORIES[0].id);
  const [filterCat, setFilterCat] = useState<string>("all");

  const income = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const expense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const balance = income - expense;

  function addTx() {
    const a = parseFloat(newAmount);
    if (!newLabel.trim() || isNaN(a) || a <= 0) return;
    setTransactions([{ id: uid(), label: newLabel.trim(), amount: a, type: newType, categoryId: newCat }, ...transactions]);
    setNewLabel("");
    setNewAmount("");
  }

  function deleteTx(id: string) {
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  const filtered = filterCat === "all" ? transactions : transactions.filter((t) => t.categoryId === filterCat);

  function fmt(n: number) {
    return n.toLocaleString("ru-RU") + " ₽";
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <div className="fin-card fin-balance">
          <span className="fin-label">Баланс</span>
          <span className="fin-amount" style={{ color: balance >= 0 ? "#111827" : "#ef4444" }}>{fmt(balance)}</span>
        </div>
        <div className="fin-card">
          <span className="fin-label">Доходы</span>
          <span className="fin-amount" style={{ color: "#16a34a" }}>{fmt(income)}</span>
        </div>
        <div className="fin-card">
          <span className="fin-label">Расходы</span>
          <span className="fin-amount" style={{ color: "#ef4444" }}>{fmt(expense)}</span>
        </div>
      </div>

      <div className="add-row flex-wrap gap-2">
        <input
          className="add-input flex-1 min-w-32"
          placeholder="Описание…"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTx()}
        />
        <input
          className="add-input w-28"
          placeholder="Сумма"
          type="number"
          value={newAmount}
          onChange={(e) => setNewAmount(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTx()}
        />
        <select className="add-select" value={newType} onChange={(e) => setNewType(e.target.value as "income" | "expense")}>
          <option value="expense">Расход</option>
          <option value="income">Доход</option>
        </select>
        <select className="add-select" value={newCat} onChange={(e) => setNewCat(e.target.value)}>
          {FIN_CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button className="add-btn" onClick={addTx}>
          <Icon name="Plus" size={16} />
        </button>
      </div>

      <div className="filter-row">
        <button className={`filter-pill ${filterCat === "all" ? "active" : ""}`} onClick={() => setFilterCat("all")}>Все</button>
        {FIN_CATEGORIES.map((c) => (
          <button
            key={c.id}
            className={`filter-pill ${filterCat === c.id ? "active" : ""}`}
            style={filterCat === c.id ? { borderColor: c.color, color: c.color } : {}}
            onClick={() => setFilterCat(c.id)}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {filtered.map((tx) => {
          const cat = getCat(FIN_CATEGORIES, tx.categoryId);
          return (
            <div key={tx.id} className="task-row">
              <span className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: cat?.color }} />
              <span className="task-text">{tx.label}</span>
              <div className="task-actions">
                <span className="font-semibold text-sm" style={{ color: tx.type === "income" ? "#16a34a" : "#ef4444" }}>
                  {tx.type === "income" ? "+" : "−"}{fmt(tx.amount)}
                </span>
                <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => deleteTx(tx.id)}>
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────
type Tab = "tasks" | "habits" | "finance";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "tasks", label: "Задачи", icon: "CheckSquare" },
  { id: "habits", label: "Привычки", icon: "Repeat2" },
  { id: "finance", label: "Финансы", icon: "Wallet" },
];

export default function Index() {
  const [tab, setTab] = useState<Tab>("tasks");

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-logo">
          <Icon name="LayoutDashboard" size={20} style={{ color: "#2563eb" }} />
          <span>Мой планировщик</span>
        </div>
        <span className="app-date">
          {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
        </span>
      </header>

      <nav className="tab-nav">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            <Icon name={t.icon} size={16} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-content">
        {tab === "tasks" && <TasksSection />}
        {tab === "habits" && <HabitsSection />}
        {tab === "finance" && <FinanceSection />}
      </main>
    </div>
  );
}
