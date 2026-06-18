import React, { useMemo, useState } from "react";
import "./PharmacistDashboard.css";

const statusMap = {
  IN_STOCK: {
    ar: "متوفر",
    en: "In Stock",
    className: "status-available",
    dot: "dot-green",
  },
  LOW_STOCK: {
    ar: "كمية قليلة",
    en: "Low Stock",
    className: "status-low",
    dot: "dot-orange",
  },
  OUT_OF_STOCK: {
    ar: "غير متوفر",
    en: "Out of Stock",
    className: "status-out",
    dot: "dot-red",
  },
};

const initialMedicines = [
  {
    id: 1,
    name: "Panadol Extra",
    generic: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablets",
    quantity: 12,
    status: "IN_STOCK",
    critical: false,
    lastUpdated: "قبل 10 دقائق",
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: "Amoxicillin",
    generic: "Amoxicillin",
    strength: "500mg",
    dosageForm: "Capsules",
    quantity: 2,
    status: "LOW_STOCK",
    critical: true,
    lastUpdated: "قبل 30 دقيقة",
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: "Augmentin",
    generic: "Amoxicillin + Clavulanic Acid",
    strength: "625mg",
    dosageForm: "Tablets",
    quantity: 0,
    status: "OUT_OF_STOCK",
    critical: false,
    lastUpdated: "قبل 1 ساعة",
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 4,
    name: "Ventolin Inhaler",
    generic: "Salbutamol",
    strength: "100mcg",
    dosageForm: "Inhaler",
    quantity: 7,
    status: "LOW_STOCK",
    critical: true,
    lastUpdated: "قبل 2 ساعة",
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 5,
    name: "Insulin Pen",
    generic: "Insulin Glargine",
    strength: "100 IU/ml",
    dosageForm: "Injection",
    quantity: 0,
    status: "OUT_OF_STOCK",
    critical: true,
    lastUpdated: "قبل 30 ساعة",
    updatedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
  },
];

const initialRequests = [
  {
    id: 1,
    medicine: "Paracetamol Syrup",
    area: "منطقة الرمال",
    time: "قبل 10 دقائق",
    status: "pending",
    matched: true,
  },
  {
    id: 2,
    medicine: "Ventolin Inhaler",
    area: "منطقة الشجاعية",
    time: "قبل 25 دقيقة",
    status: "pending",
    matched: true,
  },
  {
    id: 3,
    medicine: "Augmentin 625mg",
    area: "منطقة النصيرات",
    time: "قبل 1 ساعة",
    status: "pending",
    matched: false,
  },
];

function isStale(item) {
  const updatedAt = new Date(item.updatedAt).getTime();
  const hours = (Date.now() - updatedAt) / (1000 * 60 * 60);
  return hours >= 24;
}

function StatusBadge({ status, stale }) {
  if (stale) {
    return (
      <span className="status-pill status-stale">
        <span className="status-dot dot-gray" />
        بيانات قديمة
      </span>
    );
  }

  const current = statusMap[status] || statusMap.OUT_OF_STOCK;
  return (
    <span className={`status-pill ${current.className}`}>
      <span className={`status-dot ${current.dot}`} />
      {current.ar}
    </span>
  );
}

function MiniIcon({ children, tone = "blue" }) {
  return <span className={`mini-icon ${tone}`}>{children}</span>;
}

function MetricCard({ title, value, unit, tone, icon, trend }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-header">
        <div>
          <span>{title}</span>
          <strong>{value}</strong>
          <small>{unit}</small>
        </div>
        <MiniIcon tone={tone}>{icon}</MiniIcon>
      </div>
      <div className="sparkline" aria-hidden="true">
        {trend.map((height, index) => (
          <i key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
    </article>
  );
}

function Sidebar({ activePage, setActivePage, onLogout, pharmacistName }) {
  const items = [
    { key: "dashboard", label: "لوحة التحكم", icon: "⌂" },
    { key: "inventory", label: "إدارة الأدوية", icon: "◇" },
    { key: "requests", label: "الطلبات الواردة", icon: "▱" },
    { key: "profile", label: "ملف الصيدلية", icon: "▤" },
    { key: "audit", label: "سجل التعديلات", icon: "□" },
    { key: "alerts", label: "التنبيهات", icon: "◌" },
    { key: "settings", label: "الإعدادات", icon: "⚙" },
  ];

  return (
    <aside className="sidebar">
      <div className="brand-panel">
        <div className="brand-logo">
          <span>✚</span>
        </div>
        <h2>صيدليتي</h2>
        <p>Pharmacy System</p>
      </div>

      <nav className="side-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={activePage === item.key ? "active" : ""}
            type="button"
            onClick={() => setActivePage(item.key)}
          >
            <span>{item.icon}</span>
            {item.label}
            {item.key === "requests" && <em>5</em>}
          </button>
        ))}
      </nav>

      {onLogout && (
        <button className="logout-button" type="button" onClick={onLogout}>
          تسجيل الخروج
          <span>↩</span>
        </button>
      )}

</aside>
  );
}

function TopBar({ activePage, pharmacistName }) {
  const titles = {
    dashboard: ["لوحة تحكم الصيدلي", "نظرة عامة على المخزون والطلبات"],
    inventory: ["إدارة الأدوية", "تحديث توفر الأدوية والكميات"],
    requests: ["الطلبات الواردة", "متابعة طلبات الأدوية غير المتوفرة"],
    profile: ["ملف الصيدلية", "بيانات الصيدلية وحالة التوثيق"],
    audit: ["سجل التعديلات", "متابعة آخر العمليات على المخزون"],
    alerts: ["التنبيهات", "أدوية تحتاج مراجعة أو تحديث"],
    settings: ["الإعدادات", "تخصيص إعدادات النظام"],
  };

  const [title, subtitle] = titles[activePage] || titles.dashboard;

  return (
    <header className="topbar clean-pharmacist-topbar">
      <div className="app-header-user-card" aria-label="المستخدم الحالي">
        <div className="header-avatar">{pharmacistName?.charAt(0) || "ص"}</div>
        <div>
          <strong className="top-user-name">{pharmacistName}</strong>
          <span>صيدلي موثّق</span>
        </div>
      </div>
      <div className="page-heading">
        <MiniIcon>🛡</MiniIcon>
        <div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    </header>
  );
}

function AlertsPanel({ medicines, setActivePage }) {
  const alerts = medicines.filter((item) => item.status !== "IN_STOCK" || item.critical);

  return (
    <section className="side-card">
      <div className="card-title">
        <h3>أدوية تحتاج انتباه</h3>
        <MiniIcon tone="red">!</MiniIcon>
      </div>

      <div className="attention-list">
        {alerts.slice(0, 4).map((item) => (
          <button key={item.id} type="button" onClick={() => setActivePage("inventory")}>
            <span dir="ltr">{item.name}</span>
            <StatusBadge status={item.status} stale={isStale(item)} />
          </button>
        ))}
      </div>

      <button className="link-button" type="button" onClick={() => setActivePage("alerts")}>
        عرض جميع التنبيهات
      </button>
    </section>
  );
}

function RequestsPanel({ requests, setActivePage }) {
  return (
    <section className="side-card">
      <div className="card-title">
        <h3>طلبات جديدة</h3>
        <MiniIcon>▱</MiniIcon>
      </div>

      <div className="small-request-list">
        {requests.slice(0, 3).map((request) => (
          <button key={request.id} type="button" onClick={() => setActivePage("requests")}>
            <strong dir="ltr">{request.medicine}</strong>
            <span>{request.area} · {request.time}</span>
            <i className={request.matched ? "match" : "no-match"}>
              {request.matched ? "مطابق" : "قيد التحقق"}
            </i>
          </button>
        ))}
      </div>

      <button className="link-button" type="button" onClick={() => setActivePage("requests")}>
        عرض جميع الطلبات
      </button>
    </section>
  );
}

function AddMedicineModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "",
    generic: "",
    strength: "",
    dosageForm: "Tablets",
    quantity: "",
    status: "IN_STOCK",
    critical: false,
  });

  const submit = () => {
    if (!form.name.trim() || !form.generic.trim()) {
      alert("يرجى إدخال اسم الدواء والاسم الجنيس.");
      return;
    }

    onAdd({
      ...form,
      id: Date.now(),
      name: form.name.trim(),
      generic: form.generic.trim(),
      quantity: Number(form.quantity || 0),
      lastUpdated: "الآن",
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="medicine-modal professional-medicine-modal">
        <aside className="modal-side-info">
          <div className="modal-side-icon">✚</div>
          <span>Stock Update</span>
          <h3>إضافة دواء جديد</h3>
          <p>
            أضف بيانات الدواء بشكل واضح حتى تظهر للمستخدمين والصيدلية بحالة دقيقة.
          </p>

          <div className="modal-side-checklist">
            <div>✓ الاسم التجاري والجنيس</div>
            <div>✓ التركيز والشكل الدوائي</div>
            <div>✓ الكمية وحالة التوفر</div>
          </div>
        </aside>

        <section className="modal-form-panel">
          <div className="modal-header">
            <div>
              <h3>بيانات الدواء</h3>
              <p>املأ الحقول الأساسية لتحديث المخزون.</p>
            </div>
            <button type="button" onClick={onClose} aria-label="إغلاق">×</button>
          </div>

          <div className="modal-grid professional-modal-grid">
            <label>
              اسم الدواء
              <input
                dir="ltr"
                placeholder="ex: Panadol 500mg"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </label>

            <label>
              الاسم الجنيس
              <input
                dir="ltr"
                placeholder="ex: Paracetamol"
                value={form.generic}
                onChange={(e) => setForm((prev) => ({ ...prev, generic: e.target.value }))}
              />
            </label>

            <label>
              التركيز
              <input
                dir="ltr"
                placeholder="ex: 500mg"
                value={form.strength}
                onChange={(e) => setForm((prev) => ({ ...prev, strength: e.target.value }))}
              />
            </label>

            <label>
              الشكل الدوائي
              <select
                value={form.dosageForm}
                onChange={(e) => setForm((prev) => ({ ...prev, dosageForm: e.target.value }))}
              >
                <option value="Tablets">Tablets</option>
                <option value="Capsules">Capsules</option>
                <option value="Syrup">Syrup</option>
                <option value="Injection">Injection</option>
                <option value="Inhaler">Inhaler</option>
              </select>
            </label>

            <label>
              الكمية
              <input
                type="number"
                min="0"
                dir="ltr"
                placeholder="ex: 12"
                value={form.quantity}
                onChange={(e) => setForm((prev) => ({ ...prev, quantity: e.target.value }))}
              />
            </label>

            <label>
              الحالة
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
              >
                <option value="IN_STOCK">متوفر</option>
                <option value="LOW_STOCK">كمية قليلة</option>
                <option value="OUT_OF_STOCK">غير متوفر</option>
              </select>
            </label>
          </div>

          <label className="critical-check professional-critical-check">
            <input
              type="checkbox"
              checked={form.critical}
              onChange={(e) => setForm((prev) => ({ ...prev, critical: e.target.checked }))}
            />
            <span>
              <strong>دواء حرج</strong>
              <small>سيظهر ضمن الأدوية التي تحتاج متابعة أعلى.</small>
            </span>
          </label>

          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>إلغاء</button>
            <button className="primary-button" type="button" onClick={submit}>إضافة الدواء</button>
          </div>
        </section>
      </div>
    </div>
  );
}

function InventoryTable({ medicines, onStatusChange, onDelete, onEditClick }) {
  return (
    <section className="table-card">
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>الدواء</th>
              <th>الاسم الجنيس</th>
              <th>التركيز</th>
              <th>الكمية</th>
              <th>الحالة</th>
              <th>آخر تحديث</th>
              <th>الإجراءات</th>
            </tr>
          </thead>

          <tbody>
            {medicines.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="medicine-name">
                    <span className={item.status === "OUT_OF_STOCK" ? "pill-red" : item.status === "LOW_STOCK" ? "pill-orange" : "pill-blue"}>
                      ◆
                    </span>
                    <strong dir="ltr">{item.name}</strong>
                  </div>
                </td>
                <td dir="ltr">{item.generic}</td>
                <td dir="ltr">{item.strength}</td>
                <td>{item.quantity}</td>
                <td>
                  <StatusBadge status={item.status} stale={isStale(item)} />
                </td>
                <td>{item.lastUpdated}</td>
                <td>
                  <div className="action-buttons">
                    <button type="button" onClick={() => onEditClick(item)}>✎</button>
                    <select value={item.status} onChange={(e) => onStatusChange(item.id, e.target.value)}>
                      <option value="IN_STOCK">متوفر</option>
                      <option value="LOW_STOCK">كمية قليلة</option>
                      <option value="OUT_OF_STOCK">غير متوفر</option>
                    </select>
                    <button type="button" onClick={() => onDelete(item.id)}>⋮</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function DashboardHome({
  medicines,
  requests,
  setActivePage,
  onAddClick,
  onStatusChange,
  onDelete,
  onEditClick,
}) {
  const totals = {
    total: medicines.length,
    available: medicines.filter((item) => item.status === "IN_STOCK").length,
    low: medicines.filter((item) => item.status === "LOW_STOCK").length,
    out: medicines.filter((item) => item.status === "OUT_OF_STOCK").length,
  };

  const visibleMedicines = medicines.slice(0, 5);

  return (
    <div className="dashboard-home">
      <div className="sync-chip">
        <span />
        آخر مزامنة: قبل 2 دقيقة
      </div>

      <section className="metrics-grid">
        <MetricCard title="إجمالي الأدوية" value={124} unit="دواء" icon="💊" tone="blue" trend={[25, 38, 30, 44, 36, 32, 38, 20, 28, 36, 42, 45, 44, 22, 10]} />
        <MetricCard title="متوفر" value={113} unit="دواء" icon="✓" tone="green" trend={[15, 25, 42, 33, 45, 35, 24, 14, 25, 28, 16, 28, 26, 10, 6]} />
        <MetricCard title="كمية قليلة" value={8} unit="أدوية" icon="!" tone="orange" trend={[18, 30, 22, 36, 35, 26, 38, 26, 32, 28, 30, 24, 12, 8, 4]} />
        <MetricCard title="غير متوفر" value={3} unit="دواء" icon="×" tone="red" trend={[25, 20, 35, 30, 32, 18, 28, 31, 35, 38, 36, 24, 12, 7, 4]} />
      </section>

      <div className="main-grid">
        <div className="left-column">
          <AlertsPanel medicines={medicines} setActivePage={setActivePage} />
          <RequestsPanel requests={requests} setActivePage={setActivePage} />
        </div>

        <section className="inventory-card">
          <div className="card-header">
            <div>
              <h2>قائمة الأدوية</h2>
            </div>

            <div className="inventory-tools">
              <button className="primary-button" type="button" onClick={onAddClick}>
                + إضافة دواء جديد
              </button>
              <select>
                <option>جميع الحالات</option>
                <option>متوفر</option>
                <option>كمية قليلة</option>
                <option>غير متوفر</option>
              </select>
              <div className="search-box">
                <span>⌕</span>
                <input placeholder="بحث عن دواء أو اسم جنيس..." />
              </div>
            </div>
          </div>

          <InventoryTable
            medicines={visibleMedicines}
            onStatusChange={onStatusChange}
            onDelete={onDelete}
            onEditClick={onEditClick}
          />

          <div className="table-footer">
            <span>عرض 5 من 124 دواء</span>
            <div className="pagination">
              <button>‹</button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <span>...</span>
              <button>25</button>
              <button>›</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InventoryPage({ medicines, onStatusChange, onDelete, onAddClick, onEditClick }) {
  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <h2>إدارة الأدوية</h2>
          <p>تحديث حالة المخزون والكمية بسرعة وبشكل واضح.</p>
        </div>
        <button className="primary-button" onClick={onAddClick} type="button">+ إضافة دواء</button>
      </div>

      <InventoryTable
        medicines={medicines}
        onStatusChange={onStatusChange}
        onDelete={onDelete}
        onEditClick={onEditClick}
      />
    </section>
  );
}

function RequestsPage({ requests, onRespond }) {
  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <h2>الطلبات الواردة</h2>
          <p>طلبات الأدوية غير المتوفرة من المستخدمين.</p>
        </div>
      </div>

      <div className="request-grid">
        {requests.map((request) => (
          <article className="request-card" key={request.id}>
            <div>
              <strong dir="ltr">{request.medicine}</strong>
              <span>{request.area}</span>
              <small>{request.time}</small>
              {request.matched && <em>يوجد دواء مطابق في مخزونك</em>}
            </div>

            {request.status === "pending" ? (
              <button type="button" onClick={() => onRespond(request.id)}>
                الرد على الطلب
              </button>
            ) : (
              <StatusBadge status="IN_STOCK" />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function AuditPage({ logs }) {
  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <h2>سجل التعديلات</h2>
          <p>تتبع تغييرات المخزون والطلبات داخل الواجهة.</p>
        </div>
      </div>

      <div className="audit-list">
        {logs.map((log) => (
          <article key={log.id}>
            <div>
              <strong>{log.action}</strong>
              <span dir="ltr">{log.target}</span>
              <small>{log.time}</small>
            </div>
            <p dir="ltr">{log.from} → {log.to}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfilePage() {
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: "صيدلية الشفاء",
    address: "الرمال - غزة",
    phone: "0599000001",
    hours: "9:00 ص - 8:00 م",
  });

  const fields = [
    { label: "اسم الصيدلية", key: "name" },
    { label: "العنوان", key: "address" },
    { label: "رقم الهاتف", key: "phone" },
    { label: "ساعات العمل", key: "hours" },
  ];

  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <h2>ملف الصيدلية</h2>
          <p>تحديث بيانات الصيدلية الظاهرة للمستخدمين.</p>
        </div>
      </div>

      <div className="profile-form">
        {fields.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              value={profile[field.key]}
              onChange={(e) => setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))}
            />
          </label>
        ))}

        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2200);
          }}
        >
          حفظ التغييرات
        </button>

        {saved && <div className="saved-message">تم حفظ المعلومات بنجاح</div>}
      </div>
    </section>
  );
}

function PlaceholderPage({ title }) {
  return (
    <section className="page-panel">
      <div className="page-panel-header">
        <div>
          <h2>{title}</h2>
          <p>هذا القسم جاهز للتوسعة لاحقًا حسب متطلبات الفريق.</p>
        </div>
      </div>
    </section>
  );
}

export default function PharmacistDashboard({ onLogout, pharmacistName = "صيدلي غزة فارما" }) {
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [medicines, setMedicines] = useState(initialMedicines);
  const [requests, setRequests] = useState(initialRequests);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState([
    {
      id: 1,
      action: "Stock status updated",
      target: "Panadol Extra",
      from: "LOW_STOCK",
      to: "IN_STOCK",
      time: "قبل 10 دقائق",
    },
    {
      id: 2,
      action: "Medicine request responded",
      target: "Ventolin Inhaler",
      from: "pending",
      to: "responded",
      time: "قبل 35 دقيقة",
    },
  ]);

  const addAuditLog = (action, target, from, to) => {
    setAuditLogs((prev) => [
      {
        id: Date.now(),
        action,
        target,
        from,
        to,
        time: "الآن",
      },
      ...prev,
    ]);
  };

  const handleAddMedicine = (medicine) => {
    setMedicines((prev) => [medicine, ...prev]);
    addAuditLog("Medicine added", medicine.name, "Not existing", medicine.status);
  };

  const handleStatusChange = (id, newStatus) => {
    const target = medicines.find((item) => item.id === id);
    if (!target) return;

    setMedicines((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              lastUpdated: "الآن",
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    addAuditLog("Stock status updated", target.name, target.status, newStatus);

    if (newStatus === "IN_STOCK") {
      setRequests((prev) =>
        prev.map((request) => {
          const req = request.medicine.toLowerCase();
          const med = target.name.toLowerCase();
          const generic = target.generic.toLowerCase();

          if (request.status === "pending" && (med.includes(req) || req.includes(med) || req.includes(generic))) {
            return { ...request, matched: true };
          }

          return request;
        })
      );
    }
  };

  const handleDelete = (id) => {
    const target = medicines.find((item) => item.id === id);
    if (!target) return;

    const confirmed = window.confirm("هل تريد حذف هذا الدواء؟");
    if (!confirmed) return;

    setMedicines((prev) => prev.filter((item) => item.id !== id));
    addAuditLog("Medicine deleted", target.name, target.status, "Deleted");
  };

  const handleRespond = (id) => {
    const target = requests.find((item) => item.id === id);
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "responded" } : request
      )
    );

    if (target) {
      addAuditLog("Medicine request responded", target.medicine, "pending", "responded");
    }
  };

  return (
    <main className={`app-shell ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`} dir="rtl">
      <button
        className="sidebar-toggle-btn"
        type="button"
        onClick={() => setIsSidebarOpen((current) => !current)}
        aria-label={isSidebarOpen ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
      >
        <span>{isSidebarOpen ? "×" : "☰"}</span>
        {isSidebarOpen ? "إخفاء القائمة" : "القائمة"}
      </button>

      {isSidebarOpen && <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} pharmacistName={pharmacistName} />}

      <section className="workspace">
        <TopBar activePage={activePage} pharmacistName={pharmacistName} />

        <div className="content-area">
          {activePage === "dashboard" && (
            <DashboardHome
              medicines={medicines}
              requests={requests}
              setActivePage={setActivePage}
              onAddClick={() => setIsModalOpen(true)}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onEditClick={() => setIsModalOpen(true)}
            />
          )}

          {activePage === "inventory" && (
            <InventoryPage
              medicines={medicines}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
              onAddClick={() => setIsModalOpen(true)}
              onEditClick={() => setIsModalOpen(true)}
            />
          )}

          {activePage === "requests" && (
            <RequestsPage requests={requests} onRespond={handleRespond} />
          )}

          {activePage === "profile" && <ProfilePage />}
          {activePage === "audit" && <AuditPage logs={auditLogs} />}
          {activePage === "alerts" && <PlaceholderPage title="التنبيهات" />}
          {activePage === "settings" && <PlaceholderPage title="الإعدادات" />}
        </div>
      </section>

      {isModalOpen && (
        <AddMedicineModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddMedicine}
        />
      )}
    </main>
  );
}
