import React, { useMemo, useState } from "react";
import MapComponent from "../components/MapComponent";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookMarked,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock,
  Cloud,
  Filter,
  HeartPulse,
  ListChecks,
  LoaderCircle,
  Map,
  MapPin,
  Package,
  Phone,
  Pill,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Wifi,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";

// ==========================================
// البيانات الثابتة المحاكية (Mock Data)
// ==========================================
const localMedicines = [
  { name: "Acamol", company: "بيرزيت", category: "مسكن آلام", price: "10 ILS", rx: false, status: "متوفر", pharmacy: "صيدلية الرمال", area: "الرمال" },
  { name: "Insulin", company: "شفا", category: "سكري", price: "45 ILS", rx: true, status: "مخزون منخفض", pharmacy: "صيدلية الشفاء", area: "وسط غزة" },
  { name: "Panadol", company: "القدس", category: "مسكن ومضاد", price: "12 ILS", rx: false, status: "غير متوفر", pharmacy: "صيدلية القدس", area: "النصر" }
];

const pharmacies = [
  { id: 1, pharmacyName: "صيدلية الشفاء", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 12, lastUpdatedMinutes: 15, area: "الرمال - غزة", neighborhood: "الرمال", distanceKm: 0.5, price: "15 شيكل", phone: "0599000001", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 8:00 م", mapPosition: { x: 44, y: 27 }, note: "يفضل الاتصال قبل الذهاب لأن حالة المخزون قد تتغير بسرعة." },
  { id: 2, pharmacyName: "صيدلية القدس", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "LOW_STOCK", quantity: 3, lastUpdatedMinutes: 35, area: "النصر - غزة", neighborhood: "النصر", distanceKm: 1.2, price: "16 شيكل", phone: "0599000002", trustLevel: "Verified", isStale: false, workingHours: "10:00 ص - 7:00 م", mapPosition: { x: 66, y: 42 }, note: "الكمية محدودة وقد تنفد خلال وقت قصير." },
  { id: 3, pharmacyName: "صيدلية الأمل", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "OUT_OF_STOCK", quantity: 0, lastUpdatedMinutes: 80, area: "تل الهوى - غزة", neighborhood: "تل الهوى", distanceKm: 2.1, price: "15 شيكل", phone: "0599000003", trustLevel: "Verified", isStale: false, workingHours: "8:00 ص - 6:00 م", mapPosition: { x: 36, y: 62 }, note: "الدواء غير متوفر حاليًا في هذه الصيدلية." },
  { id: 4, pharmacyName: "صيدلية النور", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 7, lastUpdatedMinutes: 50, area: "الشجاعية - غزة", neighborhood: "الشجاعية", distanceKm: 1.6, price: "15 شيكل", phone: "0599000004", trustLevel: "Verified", isStale: false, workingHours: "9:30 ص - 9:00 م", mapPosition: { x: 77, y: 64 }, note: "المخزون متوفر لكن يفضل الاتصال قبل الذهاب." },
  { id: 5, pharmacyName: "صيدلية العودة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 10, lastUpdatedMinutes: 20, area: "الصبرة - غزة", neighborhood: "الصبرة", distanceKm: 2.4, price: "15 شيكل", phone: "0599000005", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 10:00 م", mapPosition: { x: 53, y: 55 }, note: "الدواء متاح حاليًا." },
  { id: 6, pharmacyName: "صيدلية الحياة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 6, lastUpdatedMinutes: 190, area: "الشجاعية - غزة", neighborhood: "الشجاعية", distanceKm: 4.6, price: "16 شيكل", phone: "0599000006", trustLevel: "Needs Review", isStale: true, workingHours: "9:30 ص - 9:00 م", mapPosition: { x: 82, y: 50 }, note: "هذه البيانات قديمة وتحتاج إلى تأكيد من الصيدلية." },
  { id: 7, pharmacyName: "صيدلية فلسطين", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 5, lastUpdatedMinutes: 10, area: "الدرج - غزة", neighborhood: "الدرج", distanceKm: 2.8, price: "15 شيكل", phone: "0599000007", trustLevel: "Verified", isStale: false, workingHours: "8:30 ص - 9:30 م", mapPosition: { x: 61, y: 63 }, note: "متوفر حاليًا." },
  { id: 8, pharmacyName: "صيدلية الوفاء", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 9, lastUpdatedMinutes: 25, area: "الزيتون - غزة", neighborhood: "الزيتون", distanceKm: 3.2, price: "15 شيكل", phone: "0599000008", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 8:00 م", mapPosition: { x: 50, y: 72 }, note: "يفضل الاتصال للتأكيد." },
  { id: 9, pharmacyName: "صيدلية الكرامة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "LOW_STOCK", quantity: 2, lastUpdatedMinutes: 40, area: "الشيخ رضوان - غزة", neighborhood: "الشيخ رضوان", distanceKm: 3.6, price: "16 شيكل", phone: "0599000009", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 7:00 م", mapPosition: { x: 70, y: 33 }, note: "الكمية قليلة." },
  { id: 10, pharmacyName: "صيدلية السلام", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "LOW_STOCK", quantity: 1, lastUpdatedMinutes: 55, area: "تل الهوى - غزة", neighborhood: "تل الهوى", distanceKm: 4.1, price: "15 شيكل", phone: "0599000010", trustLevel: "Verified", isStale: false, workingHours: "10:00 ص - 8:00 م", mapPosition: { x: 39, y: 74 }, note: "اتصل قبل الذهاب." },
  { id: 11, pharmacyName: "صيدلية الرحمة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 4, lastUpdatedMinutes: 70, area: "الشيخ عجلين - غزة", neighborhood: "الشيخ عجلين", distanceKm: 4.8, price: "15 شيكل", phone: "0599000011", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 6:00 م", mapPosition: { x: 27, y: 66 }, note: "متوفر." },
  { id: 12, pharmacyName: "صيدلية المدينة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 6, lastUpdatedMinutes: 12, area: "غزة القديمة", neighborhood: "غزة", distanceKm: 3.9, price: "15 شيكل", phone: "0599000012", trustLevel: "Verified", isStale: false, workingHours: "8:00 ص - 11:00 م", mapPosition: { x: 58, y: 45 }, note: "متوفر حاليًا." },
  { id: 13, pharmacyName: "صيدلية البركة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "OUT_OF_STOCK", quantity: 0, lastUpdatedMinutes: 60, area: "النصيرات - غزة", neighborhood: "النصيرات", distanceKm: 5.4, price: "15 شيكل", phone: "0599000013", trustLevel: "Verified", isStale: false, workingHours: "9:00 ص - 5:00 م", mapPosition: { x: 17, y: 78 }, note: "غير متوفر حاليًا." },
];

const statusMap = {
  IN_STOCK: { label: "متوفر", className: "status-green", icon: <CheckCircle2 size={15} /> },
  LOW_STOCK: { label: "كمية قليلة", className: "status-orange", icon: <AlertTriangle size={15} /> },
  OUT_OF_STOCK: { label: "غير متوفر", className: "status-red", icon: <XCircle size={15} /> },
};

// ==========================================
// دالات المساعدة والمنطق (Helper Functions)
// ==========================================
function isAvailableMedicine(item) {
  return item.availabilityStatus === "IN_STOCK" || item.availabilityStatus === "LOW_STOCK";
}

function getFilteredResults(searchTerm, filterValue, sortValue) {
  const words = searchTerm.toLowerCase().trim().split(" ").filter(Boolean);

  const filteredBySearch = pharmacies.filter((item) => {
    const text = `
      ${item.medicineName}
      ${item.genericName}
      ${item.strength}
      ${item.dosageForm}
      ${item.pharmacyName}
      ${item.area}
      ${item.neighborhood}
    `.toLowerCase();

    return words.length === 0 || words.every((word) => text.includes(word));
  });

  const filteredByStatus = filteredBySearch.filter((item) => {
    if (filterValue === "available") return item.availabilityStatus === "IN_STOCK";
    if (filterValue === "low") return item.availabilityStatus === "LOW_STOCK";
    if (filterValue === "out") return item.availabilityStatus === "OUT_OF_STOCK";
    return true;
  });

  return [...filteredByStatus].sort((a, b) => {
    if (sortValue === "nearest") return a.distanceKm - b.distanceKm;
    if (sortValue === "quantity") return b.quantity - a.quantity;
    return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
  });
}

// ==========================================
// المكونات الفرعية المشتركة (UI Components)
// ==========================================
function AvailabilityBadge({ status, isStale }) {
  if (isStale) {
    return (
      <span className="badge status-gray">
        <AlertTriangle size={14} />
        بيانات قديمة
      </span>
    );
  }

  const current = statusMap[status] || statusMap.OUT_OF_STOCK;
  return (
    <span className={`badge ${current.className}`}>
      {current.icon}
      {current.label}
    </span>
  );
}

function AppShell({ screen, setScreen, isOffline, setIsOffline, onLogout, userName, children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems = [
    { key: "search", label: "البحث عن دواء", icon: <Search size={17} /> },
    { key: "availability", label: "نتائج التوفر", icon: <ListChecks size={17} /> },
    { key: "map", label: "الخريطة", icon: <Map size={17} /> },
    { key: "request", label: "طلب دواء", icon: <Plus size={17} /> },
    { key: "saved", label: "القوائم المحفوظة", icon: <Star size={17} /> },
    { key: "help", label: "المساعدة", icon: <CircleHelp size={17} /> },
  ];

  const safeNavigate = (key) => {
    if (key === "saved" || key === "help") {
      setScreen(key);
      return;
    }
    setScreen(key);
  };

  return (
    <main className={`shell ${isSidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`} dir="rtl">
      <button
        className="sidebar-toggle-btn"
        type="button"
        onClick={() => setIsSidebarOpen((current) => !current)}
        aria-label={isSidebarOpen ? "إخفاء الشريط الجانبي" : "إظهار الشريط الجانبي"}
      >
        <span>{isSidebarOpen ? "×" : "☰"}</span>
        {isSidebarOpen ? "إخفاء القائمة" : "القائمة"}
      </button>

      <div className="app-header-user-card" aria-label="المستخدم الحالي">
        <div className="header-avatar">{userName?.charAt(0) || "م"}</div>
        <div>
          <strong className="top-user-name">{userName}</strong>
          <span>بحث سريع عن توفر الدواء</span>
        </div>
      </div>

      {isSidebarOpen && (
        <aside className="side-menu">
          <div className="side-logo-box">
            <div className="side-logo">
              <HeartPulse size={34} />
            </div>
            <h2>GazaPharma</h2>
            <p>Medicine Finder</p>
          </div>

          <nav className="side-nav" aria-label="تنقل التطبيق">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className={screen === item.key ? "active" : ""}
                onClick={() => safeNavigate(item.key)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className={isOffline ? "connection-mini offline" : "connection-mini"}
            onClick={() => setIsOffline((current) => !current)}
          >
            <WifiOff size={17} />
            {isOffline ? "أنت الآن غير متصل" : "الاتصال مستقر"}
          </button>

          <button
            type="button"
            className="logout-button"
            onClick={onLogout}
          >
            تسجيل الخروج
            <span>↩</span>
          </button>
        </aside>
      )}

      <section className="main-workspace">
        {children}
      </section>
    </main>
  );
}

function TopHeader({ isOffline, setIsOffline }) {
  return (
    <header className="top-header clean-top-header">
      <div className="user-zone">
        <button className="round-btn" type="button">
          <ChevronDown size={17} />
        </button>

        <div className="user-avatar">م</div>

        <div>
          <strong>مستخدم غزة فارما</strong>
          <span>بحث سريع عن توفر الدواء</span>
        </div>
      </div>

      <button
        type="button"
        className={isOffline ? "status-pill-top offline" : "status-pill-top"}
        onClick={() => setIsOffline((current) => !current)}
      >
        {isOffline ? <WifiOff size={18} /> : <Wifi size={18} />}
        {isOffline ? "غير متصل" : "متصل"}
      </button>
    </header>
  );
}

// ==========================================
// شاشات التطبيق الأساسية (Screens)
// ==========================================
function SearchScreen({ query, setQuery, onSearch, isOffline }) {
  return (
    <section className="search-stage">
      <div className="search-card">
        <div className="search-main-icon">
          <Search size={46} />
        </div>

        <h2>ابحث عن اسم الدواء</h2>
        <p>اكتب اسم الدواء أو المادة الفعالة ثم اضغط بحث لعرض نتائج التوفر.</p>

        <div className="big-search">
          <input
            dir="ltr"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ex: Panadol 500mg"
            onKeyDown={(event) => {
              if (event.key === "Enter") onSearch();
            }}
          />
          <button className="search-submit-btn" type="button" onClick={onSearch}>
            بحث
            <Search size={17} />
          </button>
        </div>

        <div className={isOffline ? "offline-note visible" : "offline-note"}>
          <WifiOff size={18} />
          أنت الآن في وضع غير متصل. سيتم استخدام آخر نتائج محفوظة عند البحث.
        </div>
      </div>
    </section>
  );
}

function LoadingScreen({ isOffline }) {
  return (
    <section className="loading-stage">
      <div className="loading-card">
        <LoaderCircle size={58} className="loading-spinner" />
        <h2>جاري البحث عن الدواء...</h2>
        <p>
          {isOffline
            ? "يتم فحص آخر نتائج محفوظة لأن وضع Offline مفعل."
            : "يرجى الانتظار بينما نبحث في أقرب الصيدليات."}
        </p>

        {isOffline && (
          <div className="offline-note visible">
            <WifiOff size={18} />
            وضع Offline مفعل، قد تكون النتائج غير محدثة.
          </div>
        )}
      </div>
    </section>
  );
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
        <div className={`metric-icon ${tone}`}>{icon}</div>
      </div>

      <div className="sparkline" aria-hidden="true">
        {trend.map((height, index) => (
          <i key={index} style={{ height: `${height}%` }} />
        ))}
      </div>
    </article>
  );
}

function FilterBar({ count, statusFilter, setStatusFilter, sortType, setSortType }) {
  return (
    <div className="filters-row">
      <button type="button" className="filter-button">
        تصفية
        <Filter size={18} />
      </button>

      <select value={sortType} onChange={(event) => setSortType(event.target.value)}>
        <option value="recent">الأحدث تحديثًا</option>
        <option value="nearest">الأقرب</option>
        <option value="quantity">الأعلى كمية</option>
      </select>

      <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
        <option value="all">كل الحالات</option>
        <option value="available">متوفر فقط</option>
        <option value="low">كمية قليلة</option>
        <option value="out">غير متوفر</option>
      </select>

      <div className="results-count">تم العثور على {count} صيدليات</div>
    </div>
  );
}

function ResultsMetrics({ results }) {
  const total = results.length;
  const available = results.filter((item) => item.availabilityStatus === "IN_STOCK" && !item.isStale).length;
  const low = results.filter((item) => item.availabilityStatus === "LOW_STOCK").length;
  const out = results.filter((item) => item.availabilityStatus === "OUT_OF_STOCK").length;

  return (
    <section className="metrics-grid">
      <MetricCard title="إجمالي النتائج" value={total} unit="صيدليات" tone="blue" icon={<ListChecks size={25} />} trend={[20, 30, 28, 42, 36, 30, 39, 44, 34, 30, 45, 48, 36, 19]} />
      <MetricCard title="متوفر" value={available} unit="صيدليات" tone="green" icon={<CheckCircle2 size={25} />} trend={[12, 20, 26, 40, 30, 37, 44, 35, 22, 30, 39, 45, 26, 18]} />
      <MetricCard title="كمية قليلة" value={low} unit="صيدليات" tone="orange" icon={<AlertTriangle size={25} />} trend={[14, 25, 21, 32, 30, 23, 36, 26, 31, 28, 20, 15, 11, 8]} />
      <MetricCard title="غير متوفر" value={out} unit="صيدليات" tone="red" icon={<XCircle size={25} />} trend={[25, 16, 24, 18, 30, 22, 34, 25, 35, 38, 28, 18, 9, 6]} />
    </section>
  );
}

function ResultsTable({ results, onOpenMap, onRequestMedicine }) {
  return (
    <section className="results-cards-section">
      <div className="cards-section-header">
        <div>
          <h2>نتائج البحث</h2>
          <p>كل صيدلية تظهر كبطاقة مستقلة لتسهيل المقارنة والاختيار.</p>
        </div>
        <span>{results.length} صيدليات</span>
      </div>

      <div className="pharmacy-cards-list">
        {results.map((item) => (
          <article
            key={item.id}
            className={`pharmacy-card ${
              item.availabilityStatus === "OUT_OF_STOCK"
                ? "out-card"
                : item.availabilityStatus === "LOW_STOCK"
                ? "low-card"
                : "available-card"
            } ${item.isStale ? "stale-card" : ""}`}
          >
            <div className="pharmacy-card-status">
              <AvailabilityBadge
                status={item.availabilityStatus}
                isStale={item.isStale}
              />

              {item.isStale && (
                <span className="stale-mini-badge">بيانات قديمة</span>
              )}

              <span className="updated-time">
                <Clock size={14} />
                منذ {item.lastUpdatedMinutes} دقيقة
              </span>
            </div>

            <div className="pharmacy-card-main">
              <div className="pharmacy-icon-box">
                <Pill size={34} />
                <small>Rx</small>
              </div>

              <div className="pharmacy-title-area">
                <div className="title-line">
                  <h3>{item.pharmacyName}</h3>
                  <span
                    className={
                      item.trustLevel === "Verified"
                        ? "trust-chip verified-chip"
                        : "trust-chip review-chip"
                    }
                  >
                    {item.trustLevel}
                    <ShieldCheck size={14} />
                  </span>
                </div>

                <div className="location-line">
                  <MapPin size={16} />
                  <span>{item.area}</span>
                  <strong>{item.distanceKm} كم</strong>
                </div>

                <div className="medicine-strip">
                  <div>
                    <span>الدواء</span>
                    <strong dir="ltr">{item.medicineName} {item.strength}</strong>
                  </div>
                  <div>
                    <span>الشكل الدوائي</span>
                    <strong dir="ltr">{item.dosageForm}</strong>
                  </div>
                  <div>
                    <span>الكمية المتوفرة</span>
                    <strong>{item.quantity} عبوة</strong>
                  </div>
                  <div>
                    <span>السعر</span>
                    <strong>{item.price}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pharmacy-card-actions">
              <a className="call-btn card-action-btn" href={`tel:${item.phone}`}>
                اتصال
                <Phone size={16} />
              </a>

              <button
                className="outline-btn card-action-btn"
                type="button"
                onClick={() => onOpenMap(item)}
              >
                عرض التفاصيل والخريطة
                <MapPin size={16} />
              </button>

              {!isAvailableMedicine(item) && (
                <button
                  className="outline-btn card-action-btn request-alt-btn"
                  type="button"
                  onClick={onRequestMedicine}
                >
                  طلب بديل
                  <Send size={16} />
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <button className="load-more-btn" type="button">
        عرض المزيد
        <ChevronDown size={17} />
      </button>
    </section>
  );
}

function NearbyPanel({ results, onOpenMap }) {
  const nearest = [...results].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  return (
    <section className="side-card">
      <h3>أقرب الصيدليات</h3>
      {nearest.map((item) => (
        <button key={item.id} type="button" className="nearby-row" onClick={() => onOpenMap(item)}>
          <strong>{item.pharmacyName}</strong>
          <span>{item.distanceKm} كم</span>
        </button>
      ))}
      <button className="link-button" type="button">عرض المزيد</button>
    </section>
  );
}

function AlertsPanel({ results, onRequestMedicine }) {
  const hasUnavailable = results.some((item) => item.availabilityStatus === "OUT_OF_STOCK");
  const hasStale = results.some((item) => item.isStale);

  return (
    <section className="side-card alert-side-card">
      <h3>تنبيهات</h3>

      {hasUnavailable && (
        <div className="alert-box">
          <AlertTriangle size={18} />
          <div>
            <strong>الدواء غير متوفر في بعض الصيدليات</strong>
            <button type="button" onClick={onRequestMedicine}>عرض التفاصيل</button>
          </div>
        </div>
      )}

      {hasStale && (
        <div className="alert-box gray-alert">
          <AlertTriangle size={18} />
          <div>
            <strong>بعض البيانات قديمة وتحتاج تأكيد</strong>
            <button type="button">يفضل الاتصال قبل الذهاب</button>
          </div>
        </div>
      )}
    </section>
  );
}

function AvailabilityScreen({
  results,
  onOpenMap,
  onRequestMedicine,
  onBackToSearch,
  statusFilter,
  setStatusFilter,
  sortType,
  setSortType,
}) {
  return (
    <section className="content-screen results-screen improved-results-screen">
      <div className="results-top-bar compact-results-top">
        <button className="back-btn" type="button" onClick={onBackToSearch}>
          <ArrowRight size={17} />
          رجوع للبحث
        </button>
      </div>

      <FilterBar
        count={results.length}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortType={sortType}
        setSortType={setSortType}
      />

      <ResultsMetrics results={results} />

      <div className="results-layout">
        <aside className="results-aside">
          <NearbyPanel results={results} onOpenMap={onOpenMap} />
          <AlertsPanel results={results} onRequestMedicine={onRequestMedicine} />

          <section className="side-card request-side-card">
            <h3>لم تجد الدواء؟</h3>
            <p>اطلب الدواء وسنحاول توفيره لك عند عودة الاتصال أو توفره في الصيدليات.</p>
            <button className="primary-btn full" type="button" onClick={onRequestMedicine}>
              طلب دواء غير متوفر
              <Send size={16} />
            </button>
          </section>
        </aside>

        <div className="results-main">
          {results.length === 0 ? (
            <div className="empty-card">
              <XCircle size={44} />
              <h2>لا توجد نتائج مطابقة</h2>
              <p>جرّب كتابة اسم الدواء بشكل أبسط مثل Panadol أو Paracetamol.</p>

              <button className="primary-btn" onClick={onRequestMedicine} type="button">
                طلب دواء غير موجود
                <Send size={16} />
              </button>
            </div>
          ) : (
            <ResultsTable results={results} onOpenMap={onOpenMap} onRequestMedicine={onRequestMedicine} />
          )}
        </div>
      </div>
    </section>
  );
}

function PharmacyDetailsPanel({ pharmacy, onClose, onBackToAvailability }) {
  if (!pharmacy) return null;

  return (
    <aside className="details-panel">
      <div className="panel-top">
        <AvailabilityBadge status={pharmacy.availabilityStatus} isStale={pharmacy.isStale} />
        <div>
          <h3>{pharmacy.pharmacyName}</h3>
          <p>{pharmacy.area}</p>
        </div>
      </div>

      <div className="medicine-summary">
        <strong>تفاصيل الدواء</strong>
        <span>{pharmacy.medicineName} {pharmacy.strength}</span>
        <span>{pharmacy.dosageForm}</span>
      </div>

      <div className="detail-grid">
        <div><Package size={24} /><span>الكمية</span><strong>{pharmacy.quantity} عبوة</strong></div>
        <div><SlidersHorizontal size={24} /><span>السعر</span><strong>{pharmacy.price}</strong></div>
        <div><MapPin size={24} /><span>المسافة</span><strong>{pharmacy.distanceKm} كم</strong></div>
        <div><Clock size={24} /><span>تحديث</span><strong>منذ {pharmacy.lastUpdatedMinutes} دقيقة</strong></div>
        <div><ShieldCheck size={24} /><span>الثقة</span><strong>{pharmacy.trustLevel}</strong></div>
        <div><Phone size={24} /><span>الهاتف</span><strong>{pharmacy.phone}</strong></div>
      </div>

      <div className="warning-box">
        <AlertTriangle size={18} />
        {pharmacy.note}
      </div>

      <a className="primary-btn full" href={`tel:${pharmacy.phone}`}>
        اتصل الآن
        <Phone size={17} />
      </a>

      <button className="outline-btn full" type="button" onClick={onBackToAvailability}>
        رجوع للنتائج
        <ArrowRight size={17} />
      </button>

      <button type="button" className="close-panel" onClick={onClose} aria-label="إغلاق التفاصيل">
        <X size={18} />
      </button>
    </aside>
  );
}

function MapScreen({ query, results, selectedPharmacy, setSelectedPharmacy, onBackToAvailability }) {
  return (
    <section className="content-screen map-screen">
      <div className="map-page-header compact-results-top">
        <button className="back-btn" type="button" onClick={onBackToAvailability}>
          <ArrowRight size={17} />
          الرجوع للتوفر
        </button>

        <span className="query-chip" dir="ltr">{query || "—"}</span>
      </div>

      <div className="map-layout-full">
        <PharmacyDetailsPanel
          pharmacy={selectedPharmacy}
          onClose={() => setSelectedPharmacy(results[0] || pharmacies[0])}
          onBackToAvailability={onBackToAvailability}
        />

        <MapComponent
          pharmacies={results.length ? results : pharmacies}
          selectedPharmacy={selectedPharmacy}
          onSelectPharmacy={setSelectedPharmacy}
        />
      </div>
    </section>
  );
}

function RequestScreen({ query, onBackToAvailability }) {
  return (
    <section className="request-screen polished-request-screen">
      <div className="request-shell-card">
        <aside className="request-visual-panel">
          <div className="request-visual-top">
            <div className="request-icon">
              <Pill size={42} />
            </div>
            <span className="request-status-chip">طلب جديد</span>
          </div>

          <h2>طلب دواء غير متوفر</h2>
          <p>
            أرسل طلبك بطريقة واضحة، وسيتم حفظه ضمن الطلبات لمتابعة توفر الدواء لاحقًا.
          </p>

          <div className="request-help-list">
            <div>
              <MapPin size={18} />
              <span>اختر المنطقة الأقرب لك لتسهيل البحث.</span>
            </div>
            <div>
              <Phone size={18} />
              <span>أضف رقم هاتف صحيح حتى يتم التواصل معك.</span>
            </div>
            <div>
              <AlertTriangle size={18} />
              <span>لا تعتمد على الطلب في الحالات الإسعافية الطارئة.</span>
            </div>
          </div>
        </aside>

        <div className="request-form-card">
          <div className="request-form-heading">
            <div>
              <h3>بيانات الطلب</h3>
              <p>املأ المعلومات الأساسية لإرسال الطلب للصيدليات المناسبة.</p>
            </div>
            <span dir="ltr">{query || "Medicine request"}</span>
          </div>

          <div className="form-grid pro-form-grid">
            <label>
              اسم الدواء
              <input dir="ltr" value={query} readOnly />
            </label>

            <label>
              المنطقة
              <select defaultValue="gaza">
                <option value="gaza">غزة</option>
                <option value="north">الشمال</option>
                <option value="middle">الوسطى</option>
                <option value="khan">خانيونس</option>
                <option value="rafah">رفح</option>
              </select>
            </label>

            <label>
              رقم الهاتف
              <input dir="ltr" placeholder="05xxxxxxxx" />
            </label>

            <label>
              أولوية الطلب
              <select defaultValue="normal">
                <option value="normal">عادي</option>
                <option value="urgent">مهم</option>
                <option value="critical">حرج</option>
              </select>
            </label>

            <label className="wide">
              ملاحظة اختيارية
              <input placeholder="مثال: أحتاج الدواء اليوم أو خلال أقرب وقت" />
            </label>
          </div>

          <div className="request-actions-row">
            <button className="primary-btn full" type="button">
              إرسال الطلب
              <Send size={17} />
            </button>

            <button className="outline-btn full" onClick={onBackToAvailability} type="button">
              الرجوع إلى نتائج التوفر
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlaceholderScreen({ title }) {
  return (
    <section className="placeholder-screen">
      <div className="empty-card">
        <BookMarked size={44} />
        <h2>{title}</h2>
        <p>هذا القسم جاهز للتوسعة لاحقًا، ولم يتم تغيير حالات المشروع الأساسية.</p>
      </div>
    </section>
  );
}

function ConnectionStates({ isOffline }) {
  return (
    <section className="connection-states" aria-label="حالات الاتصال">
      <div className={!isOffline ? "online" : ""}>
        <Wifi size={20} />
        <strong>متصل بالإنترنت</strong>
        <span>يتم البحث وعرض النتائج مباشرة</span>
      </div>

      <div>
        <Wifi size={20} />
        <strong>ضعيف الاتصال</strong>
        <span>قد يستغرق البحث وقتًا أطول</span>
      </div>

      <div className={isOffline ? "offline" : ""}>
        <WifiOff size={20} />
        <strong>غير متصل بالإنترنت</strong>
        <span>يتم عرض النتائج من الذاكرة المحلية المخزنة</span>
      </div>
    </section>
  );
}

// ==========================================
// المكون الرئيسي الجاهز للتصدير (Main App)
// ==========================================
export default function GazaPharmaApp() {
  // إدارة حالات الشاشات والاتصال الرقمي لروان
  const [screen, setScreen] = useState("search"); 
  const [isOffline, setIsOffline] = useState(false);
  const [userName, setUserName] = useState("روان باقر");

  // إدارة حالات البحث والتصنيفات
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortType, setSortType] = useState("recent");
  
  // حالة إدارة تفاصيل خريطة الصيدلية المحددة
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacies[0]);

  // تحديث النتائج المفلترة بناءً على مدخلات البحث والتصفية
  const filteredResults = useMemo(() => {
    return getFilteredResults(query, statusFilter, sortType);
  }, [query, statusFilter, sortType]);

  // محاكاة تحويل البحث مع تأثير شاشة الانتظار
  const handleSearch = () => {
    setScreen("loading");
    setTimeout(() => {
      setScreen("availability");
    }, 800); 
  };

  const handleOpenMap = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setScreen("map");
  };

  return (
    <AppShell
      screen={screen}
      setScreen={setScreen}
      isOffline={isOffline}
      setIsOffline={setIsOffline}
      userName={userName}
      onLogout={() => console.log("تسجيل خروج...")}
    >
      {/* التوجيه والتبديل الديناميكي بين شاشات واجهة التطبيق */}
      {screen === "search" && (
        <SearchScreen
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          isOffline={isOffline}
        />
      )}

      {screen === "loading" && (
        <LoadingScreen isOffline={isOffline} />
      )}

      {screen === "availability" && (
        <AvailabilityScreen
          results={filteredResults}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortType={sortType}
          setSortType={setSortType}
          onOpenMap={handleOpenMap}
          onRequestMedicine={() => setScreen("request")}
          onBackToSearch={() => setScreen("search")}
        />
      )}

      {screen === "map" && (
        <MapScreen
          query={query}
          results={filteredResults}
          selectedPharmacy={selectedPharmacy}
          setSelectedPharmacy={setSelectedPharmacy}
          onBackToAvailability={() => setScreen("availability")}
        />
      )}

      {screen === "request" && (
        <RequestScreen
          query={query}
          onBackToAvailability={() => setScreen("availability")}
        />
      )}

      {(screen === "saved" || screen === "help") && (
        <PlaceholderScreen title={screen === "saved" ? "القوائم المحفوظة" : "مركز الدعم والمساعدة"} />
      )}
      
      {/* شريط المؤشر السفلي لحالة الشبكة */}
      <ConnectionStates isOffline={isOffline} />
    </AppShell>
  );
}
