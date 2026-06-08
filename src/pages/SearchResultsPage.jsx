import React, { useMemo, useState } from "react";
import "./SearchResultsPage.css";
import MapComponent from "../components/MapComponent";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  HeartPulse,
  ListChecks,
  Map,
  MapPin,
  Package,
  Phone,
  Pill,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  WifiOff,
  X,
  XCircle,
} from "lucide-react";

const pharmacies = [
  {
    id: 1,
    pharmacyName: "صيدلية الشفاء",
    medicineName: "Panadol",
    genericName: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablets",
    availabilityStatus: "IN_STOCK",
    quantity: 12,
    lastUpdatedMinutes: 15,
    area: "الرمال - غزة",
    neighborhood: "الرمال",
    distanceKm: 1.2,
    phone: "0599000001",
    trustLevel: "Verified",
    isStale: false,
    workingHours: "9:00 ص - 8:00 م",
    mapPosition: { x: 44, y: 27 },
    note: "يفضل الاتصال قبل الذهاب لأن حالة المخزون قد تتغير بسرعة.",
  },
  {
    id: 2,
    pharmacyName: "صيدلية العودة",
    medicineName: "Panadol",
    genericName: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablets",
    availabilityStatus: "LOW_STOCK",
    quantity: 3,
    lastUpdatedMinutes: 35,
    area: "النصر - غزة",
    neighborhood: "النصر",
    distanceKm: 2.4,
    phone: "0599000002",
    trustLevel: "Verified",
    isStale: false,
    workingHours: "10:00 ص - 7:00 م",
    mapPosition: { x: 66, y: 42 },
    note: "الكمية محدودة وقد تنفد خلال وقت قصير.",
  },
  {
    id: 3,
    pharmacyName: "صيدلية القدس",
    medicineName: "Panadol",
    genericName: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablets",
    availabilityStatus: "OUT_OF_STOCK",
    quantity: 0,
    lastUpdatedMinutes: 80,
    area: "تل الهوى - غزة",
    neighborhood: "تل الهوى",
    distanceKm: 3.1,
    phone: "0599000003",
    trustLevel: "Verified",
    isStale: false,
    workingHours: "8:00 ص - 6:00 م",
    mapPosition: { x: 36, y: 62 },
    note: "الدواء غير متوفر حاليًا في هذه الصيدلية.",
  },
  {
    id: 4,
    pharmacyName: "صيدلية الحياة",
    medicineName: "Panadol",
    genericName: "Paracetamol",
    strength: "500mg",
    dosageForm: "Tablets",
    availabilityStatus: "IN_STOCK",
    quantity: 7,
    lastUpdatedMinutes: 190,
    area: "الشجاعية - غزة",
    neighborhood: "الشجاعية",
    distanceKm: 4.6,
    phone: "0599000004",
    trustLevel: "Needs Review",
    isStale: true,
    workingHours: "9:30 ص - 9:00 م",
    mapPosition: { x: 77, y: 64 },
    note: "هذه البيانات قديمة وتحتاج إلى تأكيد من الصيدلية.",
  },
];

const statusMap = {
  IN_STOCK: {
    label: "متوفر",
    className: "status-green",
    icon: <CheckCircle2 size={15} />,
  },
  LOW_STOCK: {
    label: "كمية قليلة",
    className: "status-orange",
    icon: <AlertTriangle size={15} />,
  },
  OUT_OF_STOCK: {
    label: "غير متوفر",
    className: "status-red",
    icon: <XCircle size={15} />,
  },
};

function isAvailableMedicine(item) {
  return (
    item.availabilityStatus === "IN_STOCK" ||
    item.availabilityStatus === "LOW_STOCK"
  );
}

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

function TopHeader({ query, setQuery, onSearch, isOffline, setIsOffline }) {
  return (
    <header className="main-header">
      <button
        type="button"
        className={isOffline ? "offline-chip active" : "offline-chip"}
        onClick={() => setIsOffline((currentValue) => !currentValue)}
      >
        <WifiOff size={17} />
        {isOffline ? "Offline مفعل" : "تجربة وضع Offline"}
      </button>

      <div className="search-bar-main">
        <Search size={21} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="ابحث باسم الدواء..."
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch();
            }
          }}
        />
      </div>

      <button
        type="button"
        className="logo-button"
        onClick={() => window.location.reload()}
      >
        <span>GazaPharma Link</span>
        <span className="logo-mark">
          <HeartPulse size={20} />
        </span>
      </button>
    </header>
  );
}

function SearchScreen({ onSearch }) {
  return (
    <section className="search-only-screen">
      <div className="welcome-card">
        <div className="welcome-icon">
          <Pill size={46} />
        </div>

        <h1>ابحث عن توفر الدواء بسرعة</h1>
        <p>اكتب اسم الدواء في شريط البحث بالأعلى ثم انتقل لنتائج التوفر.</p>

        <button className="primary-btn big" onClick={onSearch} type="button">
          البحث عن الدواء
          <ArrowLeft size={19} />
        </button>
      </div>
    </section>
  );
}

function FilterBar({
  count,
  statusFilter,
  setStatusFilter,
  sortType,
  setSortType,
}) {
  return (
    <div className="filters-row">
      <button type="button" className="filter-button">
        تصفية
        <Filter size={18} />
      </button>

      <select
        value={sortType}
        onChange={(event) => setSortType(event.target.value)}
      >
        <option value="recent">الأحدث تحديثًا</option>
        <option value="nearest">الأقرب</option>
        <option value="quantity">الأعلى كمية</option>
      </select>

      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="all">كل الحالات</option>
        <option value="available">متوفر فقط</option>
        <option value="low">كمية قليلة</option>
        <option value="out">غير متوفر</option>
      </select>

      <div className="results-count">تم العثور على {count} صيدليات</div>
    </div>
  );
}

function ResultCard({ item, onOpenMap, onRequestMedicine }) {
  return (
    <article className={`result-card ${item.isStale ? "stale" : ""}`}>
      <div className="card-status">
        <AvailabilityBadge
          status={item.availabilityStatus}
          isStale={item.isStale}
        />
      </div>

      <div className="result-content">
        <h3>{item.pharmacyName}</h3>

        <p className="medicine-name">
          {item.medicineName} {item.strength} - {item.dosageForm}
        </p>

        <div className="mini-info">
          <span>
            <MapPin size={15} /> {item.area}
          </span>

          <span>
            <MapPin size={15} /> {item.distanceKm} كم
          </span>

          <span>
            <Clock size={15} /> منذ {item.lastUpdatedMinutes} دقيقة
          </span>

          <span>
            <Package size={15} /> الكمية: {item.quantity} عبوة
          </span>
        </div>

        <div className="trust-line">
          {item.trustLevel === "Verified" ? (
            <ShieldCheck size={19} />
          ) : (
            <AlertTriangle size={19} />
          )}

          <strong
            className={item.trustLevel === "Verified" ? "verified" : "review"}
          >
            {item.trustLevel}
          </strong>
        </div>
      </div>

      <div className="result-actions">
        <a className="call-btn" href={`tel:${item.phone}`}>
          اتصال
          <Phone size={16} />
        </a>

        <button
          className="outline-btn details-map-btn"
          onClick={() => onOpenMap(item)}
          type="button"
        >
          عرض تفاصيل الدواء والخارطة
          <MapPin size={16} />
        </button>

        {!isAvailableMedicine(item) && (
          <button
            className="outline-btn"
            onClick={onRequestMedicine}
            type="button"
          >
            طلب بديل
            <Send size={16} />
          </button>
        )}
      </div>
    </article>
  );
}

function PharmacyDetailsPanel({ pharmacy, onClose }) {
  if (!pharmacy) {
    return null;
  }

  return (
    <aside className="details-panel">
      <button
        type="button"
        className="close-panel"
        onClick={onClose}
        aria-label="إغلاق التفاصيل"
      >
        <X size={18} />
      </button>

      <div className="panel-top">
        <AvailabilityBadge
          status={pharmacy.availabilityStatus}
          isStale={pharmacy.isStale}
        />

        <div>
          <h3>{pharmacy.pharmacyName}</h3>
          <p>آخر تحديث: منذ {pharmacy.lastUpdatedMinutes} دقيقة</p>
        </div>
      </div>

      <div className="detail-grid">
        <div>
          <MapPin size={26} />
          <span>الحي</span>
          <strong>{pharmacy.area}</strong>
        </div>

        <div>
          <SlidersHorizontal size={26} />
          <span>المسافة</span>
          <strong>{pharmacy.distanceKm} كم</strong>
        </div>

        <div>
          <Clock size={26} />
          <span>ساعات العمل</span>
          <strong>{pharmacy.workingHours}</strong>
        </div>

        <div>
          <Phone size={26} />
          <span>الهاتف</span>
          <strong>{pharmacy.phone}</strong>
        </div>

        <div>
          <ShieldCheck size={26} />
          <span>حالة الثقة</span>
          <strong>{pharmacy.trustLevel}</strong>
        </div>

        <div>
          <Package size={26} />
          <span>الكمية</span>
          <strong>{pharmacy.quantity} عبوة</strong>
        </div>
      </div>

      <div className="warning-box">
        <AlertTriangle size={18} />
        {pharmacy.note}
      </div>

      <a className="primary-btn full" href={`tel:${pharmacy.phone}`}>
        الاتصال بالصيدلية
        <Phone size={17} />
      </a>
    </aside>
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
    <section className="content-screen">
      <div className="screen-actions">
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

      <div className="availability-layout results-only-layout">
        <div className="results-column full-results-column">
          {results.length === 0 ? (
            <div className="empty-card">
              <XCircle size={44} />
              <h2>لا توجد نتائج مطابقة</h2>
              <p>جرّب كتابة اسم الدواء بشكل أبسط مثل Panadol أو Paracetamol.</p>

              <button
                className="primary-btn"
                onClick={onRequestMedicine}
                type="button"
              >
                طلب دواء غير موجود
                <Send size={16} />
              </button>
            </div>
          ) : (
            results.map((item) => (
              <ResultCard
                key={item.id}
                item={item}
                onOpenMap={onOpenMap}
                onRequestMedicine={onRequestMedicine}
              />
            ))
          )}

          <button
            className="request-footer"
            type="button"
            onClick={onRequestMedicine}
          >
            طلب دواء غير موجود
          </button>
        </div>
      </div>
    </section>
  );
}

function MapScreen({
  query,
  results,
  selectedPharmacy,
  setSelectedPharmacy,
  onBackToAvailability,
}) {
  return (
    <section className="content-screen">
      <div className="map-page-header">
        <button className="back-btn" type="button" onClick={onBackToAvailability}>
          <ArrowRight size={17} />
          الرجوع للتوفر
        </button>

        <h2>تفاصيل الدواء والخارطة</h2>
        <p>{query || "—"}</p>
      </div>

      <div className="map-layout-full">
        <MapComponent
          pharmacies={results.length ? results : pharmacies}
          selectedPharmacy={selectedPharmacy}
          onSelectPharmacy={setSelectedPharmacy}
        />

        <PharmacyDetailsPanel
          pharmacy={selectedPharmacy}
          onClose={() => setSelectedPharmacy(results[0] || pharmacies[0])}
        />
      </div>
    </section>
  );
}

function RequestScreen({ query, onBackToAvailability }) {
  return (
    <section className="request-screen">
      <div className="request-card">
        <div className="request-icon">
          <XCircle size={44} />
        </div>

        <h2>طلب دواء غير متوفر</h2>
        <p>املأ البيانات التالية لإرسال طلب الدواء المطلوب.</p>

        <div className="form-grid">
          <label>
            اسم الدواء
            <input value={query} readOnly />
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

          <label className="wide">
            ملاحظة اختيارية
            <input placeholder="مثال: أحتاج الدواء اليوم" />
          </label>
        </div>

        <button className="primary-btn full" type="button">
          إرسال الطلب
          <Send size={17} />
        </button>

        <button
          className="outline-btn full"
          onClick={onBackToAvailability}
          type="button"
        >
          الرجوع إلى نتائج التوفر
        </button>
      </div>
    </section>
  );
}

export default function SearchResultsPage() {
  const [screen, setScreen] = useState("search");
  const [query, setQuery] = useState("Panadol 500mg");
  const [selectedPharmacy, setSelectedPharmacy] = useState(pharmacies[0]);
  const [isOffline, setIsOffline] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortType, setSortType] = useState("recent");

  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(" ").filter(Boolean);

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
      if (statusFilter === "available") {
        return item.availabilityStatus === "IN_STOCK";
      }

      if (statusFilter === "low") {
        return item.availabilityStatus === "LOW_STOCK";
      }

      if (statusFilter === "out") {
        return item.availabilityStatus === "OUT_OF_STOCK";
      }

      return true;
    });

    return [...filteredByStatus].sort((a, b) => {
      if (sortType === "nearest") {
        return a.distanceKm - b.distanceKm;
      }

      if (sortType === "quantity") {
        return b.quantity - a.quantity;
      }

      return a.lastUpdatedMinutes - b.lastUpdatedMinutes;
    });
  }, [query, statusFilter, sortType]);

  const firstAvailableResult =
    results.find(isAvailableMedicine) || results[0] || pharmacies[0];

  const handleSearch = () => {
    setSelectedPharmacy(firstAvailableResult);
    setScreen("availability");
  };

  const openMap = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setScreen("map");
  };

  return (
    <main className="app" dir="rtl">
      <TopHeader
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
      />

      {isOffline && (
        <div className="offline-banner">
          <WifiOff size={18} />
          يتم عرض آخر نتائج محفوظة.
        </div>
      )}

      <nav className="stepper" aria-label="تدفق الشاشات">
        <span className={screen === "search" ? "active" : "done"}>
          <Search size={16} />
          البحث
        </span>

        <span
          className={
            screen === "availability" || screen === "request"
              ? "active"
              : screen === "map"
              ? "done"
              : ""
          }
        >
          <ListChecks size={16} />
          التوفر
        </span>

        <span className={screen === "map" ? "active" : ""}>
          <Map size={16} />
          الخريطة
        </span>
      </nav>

      {screen === "search" && <SearchScreen onSearch={handleSearch} />}

      {screen === "availability" && (
        <AvailabilityScreen
          results={results}
          onOpenMap={openMap}
          onRequestMedicine={() => setScreen("request")}
          onBackToSearch={() => setScreen("search")}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          sortType={sortType}
          setSortType={setSortType}
        />
      )}

      {screen === "map" && (
        <MapScreen
          query={query}
          results={results}
          selectedPharmacy={selectedPharmacy || firstAvailableResult}
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
    </main>
  );
}
