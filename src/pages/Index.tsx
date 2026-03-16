import { useState, useEffect } from "react";
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

// ─── Смета ───────────────────────────────────────────────
type SmetaItem = { id: string; name: string; unit?: string; qty: number; price: number };

function fmt(n: number) {
  return n.toLocaleString("ru-RU") + " ₽";
}

function SmetaSection({ items, onDelete, onQtyChange, onPriceChange }: {
  items: SmetaItem[];
  onDelete: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  onPriceChange: (id: string, price: number) => void;
}) {
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  function startEditPrice(item: SmetaItem) {
    setEditingPrice(item.id);
    setEditPriceVal(item.price > 0 ? String(item.price) : "");
  }

  function savePrice(id: string) {
    const val = parseFloat(editPriceVal);
    if (!isNaN(val) && val >= 0) onPriceChange(id, val);
    setEditingPrice(null);
  }

  return (
    <div className="space-y-5">
      <div className="fin-card fin-balance">
        <span className="fin-label">Итого по смете</span>
        <span className="fin-amount" style={{ color: "#111827" }}>{fmt(total)}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          <Icon name="ClipboardList" size={32} style={{ color: "#e5e7eb", margin: "0 auto 10px" }} />
          <div>Смета пуста</div>
          <div className="text-xs mt-1">Добавьте услуги из раздела «Прайс»</div>
        </div>
      ) : (
        <div className="space-y-1">
          {items.map((item) => (
            <div key={item.id} className="task-row" style={{ alignItems: "flex-start", paddingTop: 10, paddingBottom: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="task-text" style={{ fontSize: 13 }}>{item.name}</div>
                {item.unit && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{item.unit}</div>}
              </div>
              <div className="task-actions" style={{ opacity: 1, alignItems: "center", gap: 6 }}>
                <div className="qty-stepper">
                  <button className="qty-btn" onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}>−</button>
                  <span className="qty-val">{item.qty}</span>
                  <button className="qty-btn" onClick={() => onQtyChange(item.id, item.qty + 1)}>+</button>
                </div>

                {item.price === 0 ? (
                  editingPrice === item.id ? (
                    <input
                      autoFocus
                      className="price-edit-input"
                      placeholder="Сумма"
                      type="number"
                      value={editPriceVal}
                      onChange={(e) => setEditPriceVal(e.target.value)}
                      onBlur={() => savePrice(item.id)}
                      onKeyDown={(e) => { if (e.key === "Enter") savePrice(item.id); if (e.key === "Escape") setEditingPrice(null); }}
                    />
                  ) : (
                    <button className="price-zero-btn" onClick={() => startEditPrice(item)}>
                      <Icon name="Pencil" size={11} />
                      Указать цену
                    </button>
                  )
                ) : (
                  <span
                    className="font-semibold text-sm"
                    style={{ color: "#2563eb", minWidth: 72, textAlign: "right", cursor: "pointer" }}
                    onClick={() => startEditPrice(item)}
                    title="Нажмите, чтобы изменить цену"
                  >
                    {fmt(item.price * item.qty)}
                  </span>
                )}

                <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => onDelete(item.id)}>
                  <Icon name="Trash2" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Price list ──────────────────────────────────────────
type PriceItem = { name: string; unit?: string; price: string };
type PriceGroup = { id: string; title: string; items: PriceItem[] };

const PRICE_DATA: PriceGroup[] = [
  {
    id: "rozetki",
    title: "Установка и замена розеток",
    items: [
      { name: "Замена розетки", price: "от 180 ₽" },
      { name: "Установка розетки скрытой установки", price: "от 190 ₽" },
      { name: "Установка розетки с заземляющим контактом", price: "от 195 ₽" },
      { name: "Установка розетки в блоке", price: "от 200 ₽" },
      { name: "Установка розетки в кабель-канал", price: "от 190 ₽" },
      { name: "Установка компьютерной розетки", price: "от 200 ₽" },
      { name: "Установка телевизионной розетки", price: "от 200 ₽" },
      { name: "Установка розетки (штробление гнезда, установка подрозетника и розетки) — гипсокартон", price: "от 250 ₽" },
      { name: "Установка розетки в кирпичную стену", price: "от 300 ₽" },
      { name: "Установка розетки в бетонную стену", price: "от 350 ₽" },
    ],
  },
  {
    id: "rozetki-open",
    title: "Монтаж розеток открытой установки (наружной)",
    items: [
      { name: "Установка розетки открытой установки", price: "от 180 ₽" },
      { name: "Установка розетки открытой с заземляющим контактом", price: "от 190 ₽" },
      { name: "Установка силовой розетки", price: "от 600 ₽" },
      { name: "Ремонт розетки", price: "от 100 ₽" },
    ],
  },
  {
    id: "vyklyuchateli",
    title: "Установка выключателей скрытой установки (внутренней)",
    items: [
      { name: "Замена выключателя", price: "от 190 ₽" },
      { name: "Установка одноклавишного выключателя", price: "от 190 ₽" },
      { name: "Установка двухклавишного выключателя", price: "от 200 ₽" },
      { name: "Установка выключателя в блоке", price: "от 250 ₽" },
      { name: "Установка проходного выключателя", price: "от 600 ₽" },
      { name: "Установка выключателя (штробление гнезда, установка подрозетника и выключателя) — гипсокартон", price: "от 300 ₽" },
      { name: "Установка выключателя в кирпичную стену", price: "от 350 ₽" },
      { name: "Установка выключателя в бетонную стену", price: "от 400 ₽" },
    ],
  },
  {
    id: "vyklyuchateli-open",
    title: "Монтаж выключателей открытой установки (наружной)",
    items: [
      { name: "Установка наружного выключателя", price: "от 190 ₽" },
      { name: "Установка одноклавишного выключателя открытой установки", price: "от 190 ₽" },
      { name: "Установка двухклавишного выключателя открытой установки", price: "от 200 ₽" },
    ],
  },
  {
    id: "lyustry",
    title: "Установка люстр, светильников, бра",
    items: [
      { name: "Установка светодиодной люстры", price: "от 1500 ₽" },
      { name: "Установка люстры на натяжной потолок", price: "от 1200 ₽" },
      { name: "Установка люстры с пультом", price: "от 1500 ₽" },
      { name: "Установка люстры на высоте более 4 метров или весом более 5 кг.", price: "от 2000 ₽" },
      { name: "Установка светильников", price: "от 300 ₽" },
      { name: "Установка бра", price: "от 400 ₽" },
      { name: "Замена бра", price: "от 300 ₽" },
      { name: "Сборка люстры", price: "от 400 ₽" },
      { name: "Ремонт люстры", price: "от 1000 ₽" },
      { name: "Ремонт люстры с пультом", price: "от 1500 ₽" },
      { name: "Ремонт светодиодной люстры", price: "от 1400 ₽" },
      { name: "Установка светодиодной панели в потолок Армстронг", price: "от 400 ₽" },
      { name: "Установка накладной светодиодной панели", price: "от 450 ₽" },
    ],
  },
  {
    id: "razvodka",
    title: "Полная замена проводки (черновая работа)",
    items: [
      { name: "Квартира 1-комнатная (гипс, кирпич)", price: "от 25 000 ₽" },
      { name: "Квартира 2-комнатная (гипс, кирпич)", price: "от 28 000 ₽" },
      { name: "Квартира 3-комнатная (гипс, кирпич)", price: "от 31 000 ₽" },
      { name: "Частный дом, коттедж (гипс, кирпич)", price: "индивидуально" },
      { name: "Другие объекты (гипс, кирпич)", price: "индивидуально" },
      { name: "Квартира 1-комнатная (бетон)", price: "от 28 000 ₽" },
      { name: "Квартира 2-комнатная (бетон)", price: "от 33 000 ₽" },
      { name: "Квартира 3-комнатная (бетон)", price: "от 37 000 ₽" },
      { name: "Другие объекты (бетон)", price: "индивидуально" },
    ],
  },
  {
    id: "kuhnya",
    title: "Электрика на кухне",
    items: [
      { name: "Перенос силовой розетки электроплиты", unit: "шт.", price: "от 2000 ₽" },
      { name: "Дополнительные розетки к существующим", price: "от 2000 ₽" },
      { name: "Полная разводка электрики под новый кухонный гарнитур", price: "от 5000 ₽" },
    ],
  },
  {
    id: "kz",
    title: "Устранение короткого замыкания",
    items: [
      { name: "Замыкание проводки", price: "от 1000 ₽" },
      { name: "Выбило автоматический выключатель, УЗО, пробки", price: "от 600 ₽" },
    ],
  },
  {
    id: "plita",
    title: "Подключение электроплиты",
    items: [
      { name: "Подключение электроплиты", price: "от 1500 ₽" },
      { name: "Подключение варочной панели", price: "от 1450 ₽" },
      { name: "Подключение индукционной варочной панели", price: "от 1520 ₽" },
      { name: "Подключение электрической варочной панели", price: "от 1500 ₽" },
      { name: "Подключение духового шкафа", price: "от 600 ₽" },
      { name: "Замена розетки для электроплиты", price: "от 1200 ₽" },
      { name: "Установка скрытой розетки для электроплиты", price: "от 1400 ₽" },
    ],
  },
  {
    id: "kabel",
    title: "Прокладка кабеля",
    items: [
      { name: "Прокладка кабеля сечением до 4 кв.мм. 220v", unit: "1 м", price: "от 70 ₽" },
      { name: "Прокладка кабеля сечением 4–10 кв.мм. 220v", unit: "1 м", price: "от 80 ₽" },
      { name: "Прокладка кабеля сечением до 4 кв.мм. 380v", unit: "1 м", price: "от 70 ₽" },
      { name: "Прокладка кабеля сечением 4–6 кв.мм. 380v", unit: "1 м", price: "от 80 ₽" },
      { name: "Прокладка кабеля сечением более 6 кв.мм. 380v", unit: "1 м", price: "от 90 ₽" },
    ],
  },
  {
    id: "gofra",
    title: "Прокладка кабеля в гофре",
    items: [
      { name: "Прокладка кабеля в гофре сечением до 4 кв.мм. 220v", unit: "1 м", price: "от 70 ₽" },
      { name: "Прокладка кабеля в гофре сечением 4–10 кв.мм. 220v", unit: "1 м", price: "от 80 ₽" },
      { name: "Прокладка кабеля в гофре сечением до 4 кв.мм. 380v", unit: "1 м", price: "от 90 ₽" },
      { name: "Прокладка кабеля в гофре сечением 4–6 кв.мм. 380v", unit: "1 м", price: "от 90 ₽" },
    ],
  },
  {
    id: "kabelkanal",
    title: "Прокладка кабеля в кабель-канале",
    items: [
      { name: "Прокладка кабеля в кабель-канале сечением до 4 кв.мм. 220v", unit: "1 м", price: "от 70 ₽" },
      { name: "Прокладка кабеля в кабель-канале сечением 4–10 кв.мм. 220v", unit: "1 м", price: "от 80 ₽" },
      { name: "Прокладка кабеля в кабель-канале сечением до 4 кв.мм. 380v", unit: "1 м", price: "от 80 ₽" },
      { name: "Прокладка кабеля в кабель-канале сечением 4–6 кв.мм. 380v", unit: "1 м", price: "от 90 ₽" },
    ],
  },
  {
    id: "prochiy-kabel",
    title: "Прочая прокладка кабеля",
    items: [
      { name: "Прокладка кабеля любого другого сечения (не вошедшая в прайс)", unit: "1 м", price: "индивидуально" },
      { name: "Прокладка интернет кабеля", unit: "1 м", price: "от 60 ₽" },
      { name: "Прокладка телевизионного кабеля", unit: "1 м", price: "от 60 ₽" },
      { name: "Прокладка оптического кабеля", unit: "1 м", price: "от 70 ₽" },
      { name: "Прокладка провода", unit: "1 м", price: "индивидуально" },
      { name: "Монтаж электропроводки", price: "индивидуально" },
    ],
  },
  {
    id: "avtomat",
    title: "Автоматические выключатели",
    items: [
      { name: "Установка автоматического выключателя однополюсного", price: "от 300 ₽" },
      { name: "Установка автоматического выключателя двухполюсного", price: "от 400 ₽" },
      { name: "Установка автоматического выключателя трёхполюсного", price: "от 500 ₽" },
      { name: "Установка УЗО, ДИФ двухполюсного", price: "от 400 ₽" },
      { name: "Установка УЗО, ДИФ четырёхполюсного", price: "от 700 ₽" },
      { name: "Установка реле напряжения", price: "от 1200 ₽" },
      { name: "Замена пакетного выключателя", price: "от 700 ₽" },
    ],
  },
  {
    id: "shtrob-steny",
    title: "Штробление стен",
    items: [
      { name: "Штробление гипса", unit: "1 м", price: "от 250 ₽" },
      { name: "Штробление кирпича", unit: "1 м", price: "от 300 ₽" },
      { name: "Штробление бетона", unit: "1 м", price: "от 350 ₽" },
    ],
  },
  {
    id: "shtrob-rozetki",
    title: "Штробление розеток",
    items: [
      { name: "Штробление гипса", unit: "1 шт", price: "от 250 ₽" },
      { name: "Штробление кирпича", unit: "1 шт", price: "от 300 ₽" },
      { name: "Штробление бетона", unit: "1 шт", price: "от 350 ₽" },
    ],
  },
  {
    id: "retro",
    title: "Ретро проводка",
    items: [
      { name: "Прокладка ретро провода до 4 мм", unit: "1 м", price: "от 100 ₽" },
      { name: "Установка и расключение распаячной коробки", unit: "1 м", price: "от 400 ₽" },
      { name: "Установка наружных розеток и выключателей", unit: "1 м", price: "от 400 ₽" },
    ],
  },
  {
    id: "shchit-vnutr",
    title: "Монтаж электрощита внутренний (штробление стены, крепление, расключение)",
    items: [
      { name: "До 12 модулей", price: "от 1500 ₽" },
      { name: "Более 12 и до 24 модулей", price: "от 2100 ₽" },
      { name: "Более 24 и до 36 модулей", price: "от 2600 ₽" },
      { name: "Более 36 модулей (крепление, расключение проводов по шинам земля/ноль)", price: "индивидуально" },
    ],
  },
  {
    id: "shchit",
    title: "Монтаж щита (наружный)",
    items: [
      { name: "До 12 модулей", price: "от 1000 ₽" },
      { name: "Более 12 и до 24 модулей", price: "от 1500 ₽" },
      { name: "Более 24 и до 36 модулей", price: "от 1900 ₽" },
      { name: "Более 36 модулей", price: "индивидуально" },
      { name: "Сборка щита", price: "от 3000 ₽" },
    ],
  },
  {
    id: "schetchik",
    title: "Установка электросчётчика",
    items: [
      { name: "Установка однофазного", price: "от 1000 ₽" },
      { name: "Установка трёхфазного электросчётчика", price: "от 1400 ₽" },
      { name: "Замена однофазного электросчётчика", price: "от 1200 ₽" },
      { name: "Замена трёхфазного электросчётчика", price: "от 1600 ₽" },
      { name: "Замена трансформаторов тока", price: "от 700 ₽" },
    ],
  },
  {
    id: "diagnostika",
    title: "Комплексная диагностика",
    items: [
      { name: "Диагностика одной комнаты или", price: "от 1500 ₽" },
      { name: "Диагностика любой квартиры до 80 кв.м", price: "от 3000 ₽" },
      { name: "Диагностика дома, коттеджа", price: "от 4000 ₽" },
      { name: "Диагностика офисов, промышленных помещений, складов", price: "от 2000 ₽" },
    ],
  },
  {
    id: "naprjazh",
    title: "Работа под напряжением",
    items: [
      { name: "Напряжение 220 В", price: "+ 50% от позиции" },
      { name: "Напряжение 380 В", price: "+ 100% от позиции" },
    ],
  },
  {
    id: "prochie",
    title: "Прочие услуги",
    items: [
      { name: "Установка звонка", price: "от 400 ₽" },
      { name: "Установка кнопки звонка", price: "от 400 ₽" },
      { name: "Подключить вытяжку", price: "от 550 ₽" },
      { name: "Сверление сквозного отверстия диаметр до 20 мм", price: "от 200 ₽" },
      { name: "Заменить лампу", price: "от 50 ₽" },
      { name: "Подключение терморегулятора", price: "от 600 ₽" },
      { name: "Контур защитного заземления", price: "от 5000 ₽" },
      { name: "Установка распределительной коробки открытой", price: "от 100 ₽" },
    ],
  },
  {
    id: "raskluchenie",
    title: "Расключение распределительной коробки",
    items: [
      { name: "Расключение кабелей сечением до 4 мм кв. (стоимость за один кабель)", price: "от 50 ₽" },
      { name: "Расключение кабелей сечением 4–10 мм кв. (стоимость за один кабель)", price: "от 80 ₽" },
      { name: "Позиции не вошедшие в прайс", price: "индивидуально" },
    ],
  },
];

function PriceSection({ onAdd, editMode }: { onAdd: (item: SmetaItem) => void; editMode: boolean }) {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["rozetki"]));
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [priceData, setPriceData] = useState<PriceGroup[]>(PRICE_DATA);

  // edit state
  const [editingItem, setEditingItem] = useState<{ groupId: string; idx: number } | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editingGroupTitle, setEditingGroupTitle] = useState<string | null>(null);
  const [editGroupTitle, setEditGroupTitle] = useState("");
  const [newItemGroupId, setNewItemGroupId] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");

  const query = search.toLowerCase().trim();

  const filtered = priceData.map((group) => ({
    ...group,
    items: query
      ? group.items.filter((item) => item.name.toLowerCase().includes(query))
      : group.items,
  })).filter((g) => g.items.length > 0 || editMode);

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function parsePrice(priceStr: string): number {
    const match = priceStr.replace(/\s/g, "").match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  function handleAdd(item: PriceItem, groupId: string) {
    const key = groupId + item.name;
    onAdd({ id: uid(), name: item.name, unit: item.unit, qty: 1, price: parsePrice(item.price) });
    setAdded((prev) => new Set(prev).add(key));
    setTimeout(() => setAdded((prev) => { const n = new Set(prev); n.delete(key); return n; }), 1500);
  }

  // ── Edit helpers ──
  function startEditItem(groupId: string, idx: number, item: PriceItem) {
    setEditingItem({ groupId, idx });
    setEditName(item.name);
    setEditPrice(item.price);
    setEditUnit(item.unit ?? "");
  }

  function saveEditItem() {
    if (!editingItem) return;
    setPriceData((prev) => prev.map((g) =>
      g.id !== editingItem.groupId ? g : {
        ...g,
        items: g.items.map((it, i) =>
          i !== editingItem.idx ? it : { name: editName, price: editPrice, unit: editUnit || undefined }
        ),
      }
    ));
    setEditingItem(null);
  }

  function deleteItem(groupId: string, idx: number) {
    setPriceData((prev) => prev.map((g) =>
      g.id !== groupId ? g : { ...g, items: g.items.filter((_, i) => i !== idx) }
    ));
  }

  function deleteGroup(groupId: string) {
    setPriceData((prev) => prev.filter((g) => g.id !== groupId));
  }

  function startEditGroupTitle(group: PriceGroup) {
    setEditingGroupTitle(group.id);
    setEditGroupTitle(group.title);
  }

  function saveGroupTitle(groupId: string) {
    setPriceData((prev) => prev.map((g) => g.id === groupId ? { ...g, title: editGroupTitle } : g));
    setEditingGroupTitle(null);
  }

  function addNewItem(groupId: string) {
    if (!newItemName.trim()) return;
    setPriceData((prev) => prev.map((g) =>
      g.id !== groupId ? g : {
        ...g,
        items: [...g.items, { name: newItemName.trim(), price: newItemPrice.trim() || "индивидуально", unit: newItemUnit.trim() || undefined }],
      }
    ));
    setNewItemName(""); setNewItemPrice(""); setNewItemUnit(""); setNewItemGroupId(null);
  }

  function addNewGroup() {
    const id = uid();
    setPriceData((prev) => [...prev, { id, title: "Новая категория", items: [] }]);
    setOpenGroups((prev) => new Set(prev).add(id));
    setEditingGroupTitle(id);
    setEditGroupTitle("Новая категория");
  }

  const totalServices = priceData.reduce((s, g) => s + g.items.length, 0);

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="stat-card">
          <span className="stat-num">{priceData.length}</span>
          <span className="stat-label">Категорий</span>
        </div>
        <div className="stat-card">
          <span className="stat-num" style={{ color: "#2563eb" }}>{totalServices}</span>
          <span className="stat-label">Услуг в прайсе</span>
        </div>
      </div>

      {!editMode && (
        <div className="add-row">
          <Icon name="Search" size={15} style={{ color: "#9ca3af", flexShrink: 0 }} />
          <input
            className="add-input"
            placeholder="Поиск услуги…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (e.target.value.trim()) setOpenGroups(new Set(priceData.map((g) => g.id)));
            }}
          />
          {search && <button className="icon-btn" onClick={() => setSearch("")}><Icon name="X" size={14} /></button>}
        </div>
      )}

      {editMode && (
        <div className="edit-mode-banner">
          <Icon name="Pencil" size={13} />
          Режим редактирования — изменяйте названия, цены, добавляйте и удаляйте позиции
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((group) => {
          const isOpen = openGroups.has(group.id) || !!query || editMode;
          return (
            <div key={group.id} className="price-group">
              <div className="price-group-header" style={{ cursor: editMode ? "default" : "pointer" }}
                onClick={() => !editMode && toggleGroup(group.id)}>
                {editMode && editingGroupTitle === group.id ? (
                  <input
                    autoFocus
                    className="edit-group-input"
                    value={editGroupTitle}
                    onChange={(e) => setEditGroupTitle(e.target.value)}
                    onBlur={() => saveGroupTitle(group.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveGroupTitle(group.id); }}
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span
                    className="price-group-title"
                    style={editMode ? { cursor: "text", flex: 1 } : {}}
                    onClick={editMode ? (e) => { e.stopPropagation(); startEditGroupTitle(group); } : undefined}
                  >
                    {group.title}
                    {editMode && <Icon name="Pencil" size={11} style={{ marginLeft: 6, color: "#9ca3af", display: "inline" }} />}
                  </span>
                )}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="price-count">{group.items.length}</span>
                  {editMode ? (
                    <button className="icon-btn" style={{ color: "#f87171" }}
                      onClick={(e) => { e.stopPropagation(); deleteGroup(group.id); }}
                      title="Удалить категорию">
                      <Icon name="Trash2" size={13} />
                    </button>
                  ) : (
                    <Icon name={isOpen ? "ChevronUp" : "ChevronDown"} size={14} style={{ color: "#9ca3af" }} />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="price-items">
                  {group.items.map((item, i) => {
                    const key = group.id + item.name;
                    const justAdded = added.has(key);
                    const isEditing = editingItem?.groupId === group.id && editingItem?.idx === i;
                    return (
                      <div key={i} className="price-row" style={editMode ? { background: "#fafafa" } : {}}>
                        {editMode && isEditing ? (
                          <div className="edit-item-form">
                            <input className="edit-field edit-field-name" placeholder="Название" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            <div className="edit-field-row">
                              <input className="edit-field edit-field-unit" placeholder="Ед. (1 м)" value={editUnit} onChange={(e) => setEditUnit(e.target.value)} />
                              <input className="edit-field edit-field-price" placeholder="Цена" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
                              <button className="add-btn" style={{ width: 28, height: 28 }} onClick={saveEditItem}><Icon name="Check" size={13} /></button>
                              <button className="icon-btn" onClick={() => setEditingItem(null)}><Icon name="X" size={13} /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="price-name">{item.name}</span>
                            <div className="price-right">
                              {item.unit && <span className="price-unit">{item.unit}</span>}
                              <span className="price-value">{item.price}</span>
                              {editMode ? (
                                <div className="flex gap-1">
                                  <button className="icon-btn" onClick={() => startEditItem(group.id, i, item)} title="Редактировать">
                                    <Icon name="Pencil" size={12} />
                                  </button>
                                  <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => deleteItem(group.id, i)} title="Удалить">
                                    <Icon name="Trash2" size={12} />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  className="price-add-btn"
                                  style={justAdded ? { background: "#16a34a", color: "#fff" } : {}}
                                  onClick={() => handleAdd(item, group.id)}
                                  title="Добавить в смету"
                                >
                                  <Icon name={justAdded ? "Check" : "Plus"} size={12} />
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                  {/* Add new item row */}
                  {editMode && (
                    newItemGroupId === group.id ? (
                      <div className="price-row" style={{ background: "#f0f9ff" }}>
                        <div className="edit-item-form">
                          <input autoFocus className="edit-field edit-field-name" placeholder="Название услуги" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNewItem(group.id)} />
                          <div className="edit-field-row">
                            <input className="edit-field edit-field-unit" placeholder="Ед. (1 м)" value={newItemUnit} onChange={(e) => setNewItemUnit(e.target.value)} />
                            <input className="edit-field edit-field-price" placeholder="Цена" value={newItemPrice} onChange={(e) => setNewItemPrice(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNewItem(group.id)} />
                            <button className="add-btn" style={{ width: 28, height: 28, background: "#2563eb" }} onClick={() => addNewItem(group.id)}><Icon name="Check" size={13} /></button>
                            <button className="icon-btn" onClick={() => { setNewItemGroupId(null); setNewItemName(""); setNewItemPrice(""); setNewItemUnit(""); }}><Icon name="X" size={13} /></button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button className="price-add-row-btn" onClick={() => { setNewItemGroupId(group.id); setOpenGroups((p) => new Set(p).add(group.id)); }}>
                        <Icon name="Plus" size={13} />
                        Добавить позицию
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && !editMode && (
          <div className="text-center py-10 text-gray-400 text-sm">Ничего не найдено</div>
        )}
        {editMode && (
          <button className="add-category-btn" onClick={addNewGroup}>
            <Icon name="FolderPlus" size={15} />
            Добавить категорию
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Clients ─────────────────────────────────────────────
type Client = { id: string; name: string; phone: string; address: string; note: string };

const INIT_CLIENTS: Client[] = [
  { id: "c1", name: "Иванов Сергей", phone: "+7 900 123-45-67", address: "ул. Ленина, 12, кв. 5", note: "Позвонить за день до выезда" },
  { id: "c2", name: "Петрова Анна", phone: "+7 911 987-65-43", address: "пр. Мира, 8, кв. 14", note: "" },
  { id: "c3", name: "Сидоров Михаил", phone: "+7 922 555-00-11", address: "ул. Садовая, 3, оф. 201", note: "" },
];

// ─── Orders ──────────────────────────────────────────────
type OrderStatus = "new" | "in_progress" | "done" | "cancelled";

type Order = {
  id: string;
  client: string;
  phone: string;
  address: string;
  status: OrderStatus;
  items: SmetaItem[];
  createdAt: string;
  note: string;
  discount: number;
};

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  new:         { label: "Новый",      color: "#2563eb", bg: "#eff6ff" },
  in_progress: { label: "В работе",   color: "#d97706", bg: "#fffbeb" },
  done:        { label: "Выполнен",   color: "#16a34a", bg: "#f0fdf4" },
  cancelled:   { label: "Отменён",    color: "#ef4444", bg: "#fef2f2" },
};

const INIT_ORDERS: Order[] = [
  {
    id: "o1", client: "Иванов Сергей", phone: "+7 900 123-45-67",
    address: "ул. Ленина, 12, кв. 5", status: "in_progress",
    items: [
      { id: "i1", name: "Замена розетки", qty: 3, price: 180 },
      { id: "i2", name: "Монтаж гипсокартона", qty: 1, price: 250 },
    ],
    createdAt: "2026-03-14", note: "Позвонить за день до выезда", discount: 10,
  },
  {
    id: "o2", client: "Петрова Анна", phone: "+7 911 987-65-43",
    address: "пр. Мира, 8, кв. 14", status: "new",
    items: [
      { id: "i3", name: "Установка автоматического выключателя", qty: 2, price: 300 },
    ],
    createdAt: "2026-03-15", note: "", discount: 0,
  },
  {
    id: "o3", client: "Сидоров Михаил", phone: "+7 922 555-00-11",
    address: "ул. Садовая, 3, оф. 201", status: "done",
    items: [
      { id: "i4", name: "Прокладка кабеля сечением до 4 кв.мм.", unit: "1 м", qty: 20, price: 70 },
      { id: "i5", name: "Установка распределительной коробки", qty: 1, price: 100 },
    ],
    createdAt: "2026-03-10", note: "", discount: 5,
  },
];

type OrdersView = "orders" | "clients";

// ─── ClientCard ───────────────────────────────────────────
function ClientCard({ client, clientOrders, clientTotal, editing,
  ecName, ecPhone, ecAddress, ecNote,
  setEcName, setEcPhone, setEcAddress, setEcNote,
  onEdit, onSave, onCancel, onDelete, onOpenOrder }: {
  client: Client;
  clientOrders: Order[];
  clientTotal: number;
  editing: boolean;
  ecName: string; ecPhone: string; ecAddress: string; ecNote: string;
  setEcName: (v: string) => void; setEcPhone: (v: string) => void;
  setEcAddress: (v: string) => void; setEcNote: (v: string) => void;
  onEdit: () => void; onSave: () => void; onCancel: () => void; onDelete: () => void;
  onOpenOrder: (o: Order) => void;
}) {
  const [histOpen, setHistOpen] = useState(false);
  const doneOrders = clientOrders.filter((o) => o.status === "done").length;

  return (
    <div className="client-card">
      {editing ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input className="add-field" placeholder="Имя Фамилия *" value={ecName} onChange={(e) => setEcName(e.target.value)} />
          <input className="add-field" placeholder="Телефон" value={ecPhone} onChange={(e) => setEcPhone(e.target.value)} />
          <input className="add-field" placeholder="Адрес" value={ecAddress} onChange={(e) => setEcAddress(e.target.value)} />
          <input className="add-field" placeholder="Заметка" value={ecNote} onChange={(e) => setEcNote(e.target.value)} />
          <div style={{ display: "flex", gap: 8 }}>
            <button className="pass-cancel" onClick={onCancel}>Отмена</button>
            <button className="pass-confirm" onClick={onSave}>Сохранить</button>
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
            <div>
              <div className="order-detail-name" style={{ fontSize: 15 }}>{client.name}</div>
              {client.phone && <div className="order-meta" style={{ marginTop: 3 }}><Icon name="Phone" size={12} style={{ color: "#9ca3af" }} />{client.phone}</div>}
              {client.address && <div className="order-meta"><Icon name="MapPin" size={12} style={{ color: "#9ca3af" }} />{client.address}</div>}
              {client.note && <div className="order-note" style={{ marginTop: 4 }}>{client.note}</div>}
            </div>
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              <button className="icon-btn" style={{ opacity: 1 }} onClick={onEdit}><Icon name="Pencil" size={13} /></button>
              <button className="icon-btn" style={{ color: "#f87171", opacity: 1 }} onClick={onDelete}><Icon name="Trash2" size={13} /></button>
            </div>
          </div>

          {/* Stats row */}
          <div className="client-stats-row">
            <div className="client-stat">
              <span className="client-stat-num">{clientOrders.length}</span>
              <span className="client-stat-label">заказов</span>
            </div>
            <div className="client-stat">
              <span className="client-stat-num" style={{ color: "#16a34a" }}>{doneOrders}</span>
              <span className="client-stat-label">выполнено</span>
            </div>
            <div className="client-stat" style={{ flex: 2 }}>
              <span className="client-stat-num" style={{ color: "#2563eb", fontSize: 15 }}>{fmt(clientTotal)}</span>
              <span className="client-stat-label">общая сумма</span>
            </div>
          </div>

          {/* History toggle */}
          {clientOrders.length > 0 && (
            <button className="client-hist-toggle" onClick={() => setHistOpen((v) => !v)}>
              <Icon name="History" size={13} />
              История заказов
              <Icon name={histOpen ? "ChevronUp" : "ChevronDown"} size={13} style={{ marginLeft: "auto" }} />
            </button>
          )}

          {histOpen && (
            <div className="client-hist-list">
              {clientOrders.map((o) => {
                const raw = o.items.reduce((s, i) => s + i.price * i.qty, 0);
                const total = raw * (1 - (o.discount || 0) / 100);
                const m = STATUS_META[o.status];
                return (
                  <div key={o.id} className="client-hist-item" onClick={() => onOpenOrder(o)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
                        {o.items.length > 0 ? o.items[0].name + (o.items.length > 1 ? ` +${o.items.length - 1}` : "") : "Без позиций"}
                      </div>
                      <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{o.createdAt}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, color: m.color, background: m.bg, padding: "2px 7px", borderRadius: 999 }}>{m.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#2563eb" }}>{fmt(total)}</span>
                      <Icon name="ChevronRight" size={13} style={{ color: "#d1d5db" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function OrdersSection({ onOpenOrder }: { onOpenOrder: (order: Order) => void }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    try { const s = localStorage.getItem("orders"); return s ? JSON.parse(s) : INIT_ORDERS; } catch { return INIT_ORDERS; }
  });
  const [clients, setClients] = useState<Client[]>(() => {
    try { const s = localStorage.getItem("clients"); return s ? JSON.parse(s) : INIT_CLIENTS; } catch { return INIT_CLIENTS; }
  });

  useEffect(() => { localStorage.setItem("orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("clients", JSON.stringify(clients)); }, [clients]);
  const [view, setView] = useState<OrdersView>("orders");
  const [showNew, setShowNew] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  // new order form
  const [newMode, setNewMode] = useState<"select" | "manual">("select");
  const [selectedClientId, setSelectedClientId] = useState("");
  const [inlineNewClient, setInlineNewClient] = useState(false);
  const [inNcName, setInNcName] = useState("");
  const [inNcPhone, setInNcPhone] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNote, setNewNote] = useState("");

  // new client form
  const [showNewClient, setShowNewClient] = useState(false);
  const [ncName, setNcName] = useState("");
  const [ncPhone, setNcPhone] = useState("");
  const [ncAddress, setNcAddress] = useState("");
  const [ncNote, setNcNote] = useState("");

  // edit client
  const [editClientId, setEditClientId] = useState<string | null>(null);
  const [ecName, setEcName] = useState("");
  const [ecPhone, setEcPhone] = useState("");
  const [ecAddress, setEcAddress] = useState("");
  const [ecNote, setEcNote] = useState("");

  const filtered = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);

  function createOrder() {
    let client = newClient.trim(), phone = newPhone.trim(), address = newAddress.trim(), note = newNote.trim();
    if (newMode === "select") {
      const c = clients.find((c) => c.id === selectedClientId);
      if (!c) return;
      client = c.name; phone = c.phone; address = c.address; note = c.note;
    }
    if (!client) return;
    const order: Order = {
      id: uid(), client, phone, address, status: "new", items: [],
      createdAt: new Date().toISOString().slice(0, 10), note, discount: 0,
    };
    setOrders([order, ...orders]);
    resetNewForm();
    setShowNew(false);
    onOpenOrder(order);
  }

  function resetNewForm() {
    setNewClient(""); setNewPhone(""); setNewAddress(""); setNewNote("");
    setSelectedClientId(""); setNewMode("select");
    setInlineNewClient(false); setInNcName(""); setInNcPhone("");
  }

  function deleteOrder(id: string) { setOrders(orders.filter((o) => o.id !== id)); }

  function addClient() {
    if (!ncName.trim()) return;
    setClients([...clients, { id: uid(), name: ncName.trim(), phone: ncPhone.trim(), address: ncAddress.trim(), note: ncNote.trim() }]);
    setNcName(""); setNcPhone(""); setNcAddress(""); setNcNote("");
    setShowNewClient(false);
  }

  function deleteClient(id: string) { setClients(clients.filter((c) => c.id !== id)); }

  function startEditClient(c: Client) {
    setEditClientId(c.id); setEcName(c.name); setEcPhone(c.phone); setEcAddress(c.address); setEcNote(c.note);
  }

  function saveEditClient() {
    setClients(clients.map((c) => c.id === editClientId ? { ...c, name: ecName, phone: ecPhone, address: ecAddress, note: ecNote } : c));
    setEditClientId(null);
  }

  const total = orders.reduce((s, o) => s + o.items.reduce((ss, i) => ss + i.price * i.qty, 0) * (1 - (o.discount || 0) / 100), 0);
  const inWork = orders.filter((o) => o.status === "in_progress").length;
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div className="space-y-5">

      {/* Sub-tabs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div className="sub-tabs" style={{ flex: 1 }}>
          <button className={`sub-tab ${view === "orders" ? "active" : ""}`} onClick={() => setView("orders")}>
            <Icon name="Briefcase" size={14} /> Заказы
          </button>
          <button className={`sub-tab ${view === "clients" ? "active" : ""}`} onClick={() => setView("clients")}>
            <Icon name="Users" size={14} /> Клиенты
            <span className="smeta-badge" style={{ background: "#6b7280" }}>{clients.length}</span>
          </button>
        </div>
        <button
          className="add-btn"
          style={{ flexShrink: 0 }}
          onClick={() => { if (view === "orders") setShowNew(true); else setShowNewClient(true); }}
          title={view === "orders" ? "Новый заказ" : "Новый клиент"}
        >
          <Icon name="Plus" size={16} />
        </button>
      </div>

      {/* ── ЗАКАЗЫ ── */}
      {view === "orders" && (<>
        <div className="flex gap-3">
          <div className="stat-card"><span className="stat-num">{orders.length}</span><span className="stat-label">Заказов</span></div>
          <div className="stat-card"><span className="stat-num" style={{ color: "#d97706" }}>{inWork}</span><span className="stat-label">В работе</span></div>
          <div className="stat-card"><span className="stat-num" style={{ color: "#2563eb" }}>{newCount}</span><span className="stat-label">Новых</span></div>
        </div>

        <div className="fin-card fin-balance">
          <span className="fin-label">Общая сумма заказов</span>
          <span className="fin-amount">{fmt(total)}</span>
        </div>

        <div className="filter-row">
          <button className={`filter-pill ${filterStatus === "all" ? "active" : ""}`} onClick={() => setFilterStatus("all")}>Все</button>
          {(Object.entries(STATUS_META) as [OrderStatus, typeof STATUS_META[OrderStatus]][]).map(([key, m]) => (
            <button key={key} className={`filter-pill ${filterStatus === key ? "active" : ""}`}
              style={filterStatus === key ? { borderColor: m.color, color: m.color, background: m.bg } : {}}
              onClick={() => setFilterStatus(key)}>{m.label}</button>
          ))}
        </div>

        {showNew && (
          <div className="order-new-form">
            <div className="order-new-title">Новый заказ</div>
            <div className="sub-tabs" style={{ marginBottom: 4 }}>
              <button className={`sub-tab ${newMode === "select" ? "active" : ""}`} onClick={() => setNewMode("select")}>Выбрать клиента</button>
              <button className={`sub-tab ${newMode === "manual" ? "active" : ""}`} onClick={() => setNewMode("manual")}>Ввести вручную</button>
            </div>
            {newMode === "select" ? (
              <>
                {clients.length > 0 && (
                  <div className="client-pick-list">
                    {clients.map((c) => (
                      <button key={c.id}
                        className={`client-pick-item ${selectedClientId === c.id ? "selected" : ""}`}
                        onClick={() => setSelectedClientId(c.id)}>
                        <span className="font-medium text-sm">{c.name}</span>
                        {c.phone && <span className="text-xs text-gray-400">{c.phone}</span>}
                      </button>
                    ))}
                  </div>
                )}
                {inlineNewClient ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                    <input autoFocus className="add-field" placeholder="Имя Фамилия *" value={inNcName} onChange={(e) => setInNcName(e.target.value)} />
                    <input className="add-field" placeholder="Телефон" value={inNcPhone} onChange={(e) => setInNcPhone(e.target.value)} />
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="pass-cancel" style={{ flex: 1 }} onClick={() => { setInlineNewClient(false); setInNcName(""); setInNcPhone(""); }}>Отмена</button>
                      <button className="pass-confirm" style={{ flex: 1 }} onClick={() => {
                        if (!inNcName.trim()) return;
                        const nc: Client = { id: uid(), name: inNcName.trim(), phone: inNcPhone.trim(), address: "", note: "" };
                        setClients((prev) => [...prev, nc]);
                        setSelectedClientId(nc.id);
                        setInlineNewClient(false); setInNcName(""); setInNcPhone("");
                      }}>Добавить</button>
                    </div>
                  </div>
                ) : (
                  <button style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#2563eb", background: "none", border: "none", cursor: "pointer", marginTop: 4, padding: "2px 0" }}
                    onClick={() => setInlineNewClient(true)}>
                    <Icon name="Plus" size={14} /> Новый клиент
                  </button>
                )}
              </>
            ) : (
              <>
                <input className="add-field" placeholder="Имя Фамилия *" value={newClient} onChange={(e) => setNewClient(e.target.value)} />
                <input className="add-field" placeholder="Телефон" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
                <input className="add-field" placeholder="Адрес объекта" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                <input className="add-field" placeholder="Заметка" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
              </>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button className="pass-cancel" onClick={() => { setShowNew(false); resetNewForm(); }}>Отмена</button>
              <button className="pass-confirm" onClick={createOrder}>Создать заказ</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {filtered.map((order) => {
            const m = STATUS_META[order.status];
            const rawTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
            const orderTotal = rawTotal * (1 - (order.discount || 0) / 100);
            return (
              <div key={order.id} className="order-card" onClick={() => onOpenOrder(order)}>
                <div className="order-card-top">
                  <div className="order-client">
                    <Icon name="User" size={14} style={{ color: "#9ca3af", flexShrink: 0 }} />
                    <span>{order.client}</span>
                  </div>
                  <span className="order-status-badge" style={{ color: m.color, background: m.bg }}>{m.label}</span>
                </div>
                {order.phone && <div className="order-meta"><Icon name="Phone" size={12} style={{ color: "#9ca3af" }} />{order.phone}</div>}
                {order.address && <div className="order-meta"><Icon name="MapPin" size={12} style={{ color: "#9ca3af" }} />{order.address}</div>}
                <div className="order-card-bottom">
                  <span className="order-items-count"><Icon name="Package" size={12} />{order.items.length} позиций</span>
                  {order.discount > 0 && <span className="discount-badge">−{order.discount}%</span>}
                  <span className="order-total">{fmt(orderTotal)}</span>
                  <button className="icon-btn" style={{ color: "#f87171", opacity: 1 }}
                    onClick={(e) => { e.stopPropagation(); deleteOrder(order.id); }}>
                    <Icon name="Trash2" size={13} />
                  </button>
                </div>
                {order.note && <div className="order-note">{order.note}</div>}
              </div>
            );
          })}
          {filtered.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Нет заказов</div>}
        </div>

        <button className="fab-btn" onClick={() => setShowNew(true)}>
          <Icon name="Plus" size={20} />
        </button>
      </>)}

      {/* ── КЛИЕНТЫ ── */}
      {view === "clients" && (<>
        {showNewClient && (
          <div className="order-new-form">
            <div className="order-new-title">Новый клиент</div>
            <input autoFocus className="add-field" placeholder="Имя Фамилия *" value={ncName} onChange={(e) => setNcName(e.target.value)} />
            <input className="add-field" placeholder="Телефон" value={ncPhone} onChange={(e) => setNcPhone(e.target.value)} />
            <input className="add-field" placeholder="Адрес" value={ncAddress} onChange={(e) => setNcAddress(e.target.value)} />
            <input className="add-field" placeholder="Заметка" value={ncNote} onChange={(e) => setNcNote(e.target.value)} />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="pass-cancel" onClick={() => setShowNewClient(false)}>Отмена</button>
              <button className="pass-confirm" onClick={addClient}>Добавить</button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {clients.map((c) => {
            const clientOrders = orders.filter((o) => o.client === c.name);
            const clientTotal = clientOrders.reduce((s, o) => {
              const raw = o.items.reduce((ss, i) => ss + i.price * i.qty, 0);
              return s + raw * (1 - (o.discount || 0) / 100);
            }, 0);
            const [histOpen, setHistOpen] = [false, () => {}]; // placeholder, handled below
            return (
              <ClientCard
                key={c.id}
                client={c}
                clientOrders={clientOrders}
                clientTotal={clientTotal}
                editing={editClientId === c.id}
                ecName={ecName} ecPhone={ecPhone} ecAddress={ecAddress} ecNote={ecNote}
                setEcName={setEcName} setEcPhone={setEcPhone} setEcAddress={setEcAddress} setEcNote={setEcNote}
                onEdit={() => startEditClient(c)}
                onSave={saveEditClient}
                onCancel={() => setEditClientId(null)}
                onDelete={() => deleteClient(c.id)}
                onOpenOrder={onOpenOrder}
              />
            );
          })}
          {clients.length === 0 && <div className="text-center py-10 text-gray-400 text-sm">Нет клиентов</div>}
        </div>

        <button className="fab-btn" onClick={() => setShowNewClient(true)}>
          <Icon name="Plus" size={20} />
        </button>
      </>)}
    </div>
  );
}

// ─── Order detail ─────────────────────────────────────────
function OrderDetail({ order, onBack, onAddFromPrice }: {
  order: Order;
  onBack: () => void;
  onAddFromPrice: () => void;
}) {
  const [items, setItems] = useState<SmetaItem[]>(order.items);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [discount, setDiscount] = useState(order.discount || 0);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceVal, setEditPriceVal] = useState("");

  // client edit
  const [editingClient, setEditingClient] = useState(false);
  const [editClient, setEditClient] = useState(order.client);
  const [editPhone, setEditPhone] = useState(order.phone);
  const [editAddress, setEditAddress] = useState(order.address);
  const [editNote, setEditNote] = useState(order.note);

  // sync mutations back to order object
  order.items = items;
  order.status = status;
  order.discount = discount;
  order.client = editClient;
  order.phone = editPhone;
  order.address = editAddress;
  order.note = editNote;

  const rawTotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = rawTotal * discount / 100;
  const total = rawTotal - discountAmt;

  function changeQty(id: string, qty: number) {
    setItems(items.map((i) => i.id === id ? { ...i, qty } : i));
  }

  function deleteItem(id: string) {
    setItems(items.filter((i) => i.id !== id));
  }

  function savePrice(id: string) {
    const val = parseFloat(editPriceVal);
    if (!isNaN(val) && val >= 0) setItems(items.map((i) => i.id === id ? { ...i, price: val } : i));
    setEditingPrice(null);
  }

  function editItemName(id: string, name: string) {
    setItems(items.map((i) => i.id === id ? { ...i, name } : i));
  }

  const statuses: OrderStatus[] = ["new", "in_progress", "done", "cancelled"];

  return (
    <div className="space-y-5">
      <button className="back-btn" onClick={onBack}>
        <Icon name="ArrowLeft" size={15} />
        Все заказы
      </button>

      {/* Client card */}
      <div className="order-detail-card">
        {editingClient ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <input className="add-field" placeholder="Имя Фамилия *" value={editClient} onChange={(e) => setEditClient(e.target.value)} />
            <input className="add-field" placeholder="Телефон" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
            <input className="add-field" placeholder="Адрес объекта" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} />
            <input className="add-field" placeholder="Заметка" value={editNote} onChange={(e) => setEditNote(e.target.value)} />
            <button className="pass-confirm" style={{ marginTop: 2 }} onClick={() => setEditingClient(false)}>
              Сохранить
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
              <div className="order-detail-name">{editClient || "—"}</div>
              <button className="icon-btn" style={{ opacity: 1, flexShrink: 0 }} onClick={() => setEditingClient(true)} title="Редактировать клиента">
                <Icon name="Pencil" size={14} />
              </button>
            </div>
            {editPhone && <div className="order-meta"><Icon name="Phone" size={13} style={{ color: "#9ca3af" }} />{editPhone}</div>}
            {editAddress && <div className="order-meta"><Icon name="MapPin" size={13} style={{ color: "#9ca3af" }} />{editAddress}</div>}
            {editNote && <div className="order-note" style={{ marginTop: 4 }}>{editNote}</div>}
          </>
        )}

        {/* Status */}
        <div className="status-row">
          {statuses.map((s) => {
            const sm = STATUS_META[s];
            return (
              <button key={s} className="status-btn"
                style={status === s ? { color: sm.color, background: sm.bg, borderColor: sm.color } : {}}
                onClick={() => setStatus(s)}>
                {sm.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discount */}
      <div className="discount-row">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="Tag" size={14} style={{ color: "#16a34a" }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>Скидка клиента</span>
        </div>
        <div className="discount-stepper">
          <button className="qty-btn" onClick={() => setDiscount(Math.max(0, discount - 1))}>−</button>
          <span className="discount-val">{discount}%</span>
          <button className="qty-btn" onClick={() => setDiscount(Math.min(100, discount + 1))}>+</button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 gap-3">
        <div className="fin-card">
          <span className="fin-label">Сумма без скидки</span>
          <span className="fin-amount" style={{ fontSize: 15, color: "#6b7280" }}>{fmt(rawTotal)}</span>
        </div>
        <div className="fin-card fin-balance">
          <span className="fin-label">Итого{discount > 0 ? ` (−${discount}%)` : ""}</span>
          <span className="fin-amount" style={{ color: "#111827" }}>{fmt(total)}</span>
        </div>
      </div>
      {discount > 0 && (
        <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 500, marginTop: -8, paddingLeft: 2 }}>
          Скидка: {fmt(discountAmt)}
        </div>
      )}

      {/* Items */}
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.id} className="task-row" style={{ alignItems: "flex-start", paddingTop: 10, paddingBottom: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <input
                className="item-name-input"
                value={item.name}
                onChange={(e) => editItemName(item.id, e.target.value)}
              />
              {item.unit && <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{item.unit}</div>}
            </div>
            <div className="task-actions" style={{ opacity: 1, alignItems: "center", gap: 6 }}>
              <div className="qty-stepper">
                <button className="qty-btn" onClick={() => changeQty(item.id, Math.max(1, item.qty - 1))}>−</button>
                <span className="qty-val">{item.qty}</span>
                <button className="qty-btn" onClick={() => changeQty(item.id, item.qty + 1)}>+</button>
              </div>
              {item.price === 0 ? (
                editingPrice === item.id ? (
                  <input autoFocus className="price-edit-input" placeholder="Сумма" type="number"
                    value={editPriceVal} onChange={(e) => setEditPriceVal(e.target.value)}
                    onBlur={() => savePrice(item.id)}
                    onKeyDown={(e) => { if (e.key === "Enter") savePrice(item.id); if (e.key === "Escape") setEditingPrice(null); }} />
                ) : (
                  <button className="price-zero-btn" onClick={() => { setEditingPrice(item.id); setEditPriceVal(""); }}>
                    <Icon name="Pencil" size={11} />Указать цену
                  </button>
                )
              ) : (
                <span className="font-semibold text-sm"
                  style={{ color: "#2563eb", minWidth: 72, textAlign: "right", cursor: "pointer" }}
                  onClick={() => { setEditingPrice(item.id); setEditPriceVal(String(item.price)); }}
                  title="Изменить цену">
                  {fmt(item.price * item.qty)}
                </span>
              )}
              <button className="icon-btn" style={{ color: "#f87171" }} onClick={() => deleteItem(item.id)}>
                <Icon name="Trash2" size={13} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            <Icon name="Package" size={28} style={{ color: "#e5e7eb", margin: "0 auto 8px" }} />
            Нет позиций — добавьте из прайса
          </div>
        )}
      </div>

      <button className="add-from-price-btn" onClick={onAddFromPrice}>
        <Icon name="ListOrdered" size={15} />
        Добавить из прайса
      </button>

      {/* Send invoice */}
      <SendInvoiceButton order={{ ...order, client: editClient, phone: editPhone, address: editAddress, items, discount }} />
    </div>
  );
}

// ─── Send Invoice ─────────────────────────────────────────
function SendInvoiceButton({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const rawTotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = rawTotal * (order.discount || 0) / 100;
  const total = rawTotal - discountAmt;

  function buildText() {
    const lines = [
      `📋 СЧЁТ НА ОПЛАТУ`,
      ``,
      `Клиент: ${order.client}`,
      order.phone ? `Телефон: ${order.phone}` : "",
      order.address ? `Адрес: ${order.address}` : "",
      `Дата: ${order.createdAt}`,
      ``,
      `─────────────────────`,
      ...order.items.map((i) => `• ${i.name}${i.unit ? ` (${i.unit})` : ""} × ${i.qty} = ${fmt(i.price * i.qty)}`),
      `─────────────────────`,
      order.discount > 0 ? `Сумма без скидки: ${fmt(rawTotal)}` : "",
      order.discount > 0 ? `Скидка ${order.discount}%: −${fmt(discountAmt)}` : "",
      ``,
      `💰 ИТОГО: ${fmt(total)}`,
    ].filter((l) => l !== "");
    return lines.join("\n");
  }

  function copyText() {
    navigator.clipboard.writeText(buildText()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function openWhatsApp() {
    const phone = order.phone.replace(/\D/g, "");
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
  }

  function openTelegram() {
    const url = `https://t.me/share/url?url=${encodeURIComponent(" ")}&text=${encodeURIComponent(buildText())}`;
    window.open(url, "_blank");
  }

  return (
    <>
      <button className="send-invoice-btn" onClick={() => setOpen(true)}>
        <Icon name="Send" size={15} />
        Отправить счёт клиенту
      </button>

      {open && (
        <div className="pass-overlay" onClick={() => setOpen(false)}>
          <div className="pass-modal" style={{ width: 320 }} onClick={(e) => e.stopPropagation()}>
            <div className="pass-title">
              <Icon name="Send" size={16} style={{ color: "#2563eb" }} />
              Отправить счёт
            </div>

            {/* Preview */}
            <div className="invoice-preview">
              {buildText().split("\n").map((l, i) => (
                <div key={i} style={{ fontWeight: l.startsWith("💰") ? 700 : 400 }}>{l || <br />}</div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="invoice-action-btn" style={{ background: "#25D366", color: "#fff" }} onClick={openWhatsApp}>
                <Icon name="MessageCircle" size={16} />
                Отправить в WhatsApp
              </button>
              <button className="invoice-action-btn" style={{ background: "#229ED9", color: "#fff" }} onClick={openTelegram}>
                <Icon name="Send" size={16} />
                Отправить в Telegram
              </button>
              <button className="invoice-action-btn" style={copied ? { background: "#16a34a", color: "#fff" } : { background: "#f3f4f6", color: "#374151" }} onClick={copyText}>
                <Icon name={copied ? "Check" : "Copy"} size={16} />
                {copied ? "Скопировано!" : "Скопировать текст"}
              </button>
            </div>

            <button className="pass-cancel" style={{ marginTop: 4 }} onClick={() => setOpen(false)}>Закрыть</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────
type Tab = "orders" | "smeta" | "price";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "orders", label: "Заказы", icon: "Briefcase" },
  { id: "smeta", label: "Стоимость услуг", icon: "ClipboardList" },
  { id: "price", label: "Прайс", icon: "ListOrdered" },
];

const EDIT_PASSWORD = "D4m0;6278@";

export default function Index() {
  const [tab, setTab] = useState<Tab>("orders");
  const [smetaItems, setSmetaItems] = useState<SmetaItem[]>([]);
  const [priceEditMode, setPriceEditMode] = useState(false);
  const [showPassPrompt, setShowPassPrompt] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);

  // Orders state
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [pendingPriceAdd, setPendingPriceAdd] = useState(false);

  function addToSmeta(item: SmetaItem) {
    if (activeOrder) {
      activeOrder.items = [{ ...item, id: uid() }, ...activeOrder.items];
      setActiveOrder({ ...activeOrder });
    } else {
      setSmetaItems((prev) => [{ ...item, id: uid() }, ...prev]);
    }
  }

  function deleteFromSmeta(id: string) {
    setSmetaItems((prev) => prev.filter((i) => i.id !== id));
  }

  function changeQty(id: string, qty: number) {
    setSmetaItems((prev) => prev.map((i) => i.id === id ? { ...i, qty } : i));
  }

  function changePrice(id: string, price: number) {
    setSmetaItems((prev) => prev.map((i) => i.id === id ? { ...i, price } : i));
  }

  function handleAddFromPrice() {
    setPendingPriceAdd(true);
    setTab("price");
  }

  function handlePriceAdd(item: SmetaItem) {
    addToSmeta(item);
  }

  return (
    <div className="app-root">
      <header className="app-header">
        <div className="app-logo">
          <Icon name="LayoutDashboard" size={20} style={{ color: "#2563eb" }} />
          <span>Мой планировщик</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="app-date">
            {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
          </span>
          {tab === "price" && (
            <>
              <button
                className={`gear-btn ${priceEditMode ? "active" : ""}`}
                onClick={() => {
                  if (priceEditMode) { setPriceEditMode(false); }
                  else { setShowPassPrompt(true); setPassInput(""); setPassError(false); }
                }}
                title={priceEditMode ? "Выйти из редактирования" : "Редактировать прайс"}
              >
                <Icon name={priceEditMode ? "X" : "Settings2"} size={16} />
              </button>

              {showPassPrompt && (
                <div className="pass-overlay" onClick={() => setShowPassPrompt(false)}>
                  <div className="pass-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="pass-title">
                      <Icon name="Lock" size={16} style={{ color: "#2563eb" }} />
                      Введите пароль
                    </div>
                    <input autoFocus type="password"
                      className={`pass-input ${passError ? "error" : ""}`}
                      placeholder="Пароль" value={passInput}
                      onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          if (passInput === EDIT_PASSWORD) { setPriceEditMode(true); setShowPassPrompt(false); }
                          else { setPassError(true); setPassInput(""); }
                        }
                        if (e.key === "Escape") setShowPassPrompt(false);
                      }}
                    />
                    {passError && <div className="pass-error">Неверный пароль</div>}
                    <div className="pass-actions">
                      <button className="pass-cancel" onClick={() => setShowPassPrompt(false)}>Отмена</button>
                      <button className="pass-confirm" onClick={() => {
                        if (passInput === EDIT_PASSWORD) { setPriceEditMode(true); setShowPassPrompt(false); }
                        else { setPassError(true); setPassInput(""); }
                      }}>Войти</button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </header>

      <nav className="tab-nav">
        {TABS.map((t) => (
          <button key={t.id}
            className={`tab-btn ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); if (t.id !== "orders") setActiveOrder(null); setPendingPriceAdd(false); }}
          >
            <Icon name={t.icon} size={16} />
            <span>{t.label}</span>
            {t.id === "smeta" && smetaItems.length > 0 && (
              <span className="smeta-badge">{smetaItems.length}</span>
            )}
          </button>
        ))}
      </nav>

      <main className="app-content">
        {tab === "orders" && !activeOrder && (
          <OrdersSection onOpenOrder={(o) => setActiveOrder(o)} />
        )}
        {tab === "orders" && activeOrder && (
          <OrderDetail
            order={activeOrder}
            onBack={() => setActiveOrder(null)}
            onAddFromPrice={handleAddFromPrice}
          />
        )}
        {tab === "smeta" && (
          <SmetaSection
            items={smetaItems}
            onDelete={deleteFromSmeta}
            onQtyChange={changeQty}
            onPriceChange={changePrice}
          />
        )}
        {tab === "price" && (
          <PriceSection
            onAdd={handlePriceAdd}
            editMode={priceEditMode}
          />
        )}
      </main>
    </div>
  );
}