import React, { useMemo, useState } from "react";
import "./SearchResultsPage.css";
import {
  Search, Phone, MapPin, Clock, AlertTriangle, ArrowRight, ArrowLeft,
  Pill, ShieldCheck, WifiOff, Send, CheckCircle2, XCircle,
} from "lucide-react";

const pharmacies = [
  { id: 1, pharmacyName: "صيدلية الشفاء", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 12, lastUpdatedMinutes: 15, area: "الرمال - غزة", distanceKm: 1.2, phone: "0599000001", trustLevel: "Verified", isStale: false, workingHours: "9:00 صباحًا - 8:00 مساءً", note: "يفضل الاتصال قبل الذهاب لأن حالة المخزون قد تتغير بسرعة." },
  { id: 2, pharmacyName: "صيدلية العودة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "LOW_STOCK", quantity: 3, lastUpdatedMinutes: 35, area: "النصر - غزة", distanceKm: 2.4, phone: "0599000002", trustLevel: "Verified", isStale: false, workingHours: "10:00 صباحًا - 7:00 مساءً", note: "الكمية محدودة وقد تنفد خلال وقت قصير." },
  { id: 3, pharmacyName: "صيدلية القدس", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "OUT_OF_STOCK", quantity: 0, lastUpdatedMinutes: 80, area: "تل الهوى - غزة", distanceKm: 3.1, phone: "0599000003", trustLevel: "Verified", isStale: false, workingHours: "8:00 صباحًا - 6:00 مساءً", note: "الدواء غير متوفر حاليًا في هذه الصيدلية." },
  { id: 4, pharmacyName: "صيدلية الحياة", medicineName: "Panadol", genericName: "Paracetamol", strength: "500mg", dosageForm: "Tablets", availabilityStatus: "IN_STOCK", quantity: 7, lastUpdatedMinutes: 190, area: "الشجاعية - غزة", distanceKm: 4.6, phone: "0599000004", trustLevel: "Needs Review", isStale: true, workingHours: "9:30 صباحًا - 9:00 مساءً", note: "هذه البيانات قديمة وتحتاج إلى تأكيد من الصيدلية." },
];

const statusMap = {
  IN_STOCK: { label: "متوفر", className: "status-green", icon: <CheckCircle2 size={16} /> },
  LOW_STOCK: { label: "كمية قليلة", className: "status-orange", icon: <AlertTriangle size={16} /> },
  OUT_OF_STOCK: { label: "غير متوفر", className: "status-red", icon: <XCircle size={16} /> },
};

function AvailabilityBadge({ status, isStale }) {
  if (isStale) return <span className="badge status-gray">بيانات قديمة</span>;
  const current = statusMap[status] || statusMap.OUT_OF_STOCK;
  return <span className={`badge ${current.className}`}>{current.icon}{current.label}</span>;
}

function TopBar({ screen, onBack }) {
  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-icon"><Pill size={24} /></div>
        <div>
          <h1 style={{ direction: "ltr", textAlign: "left" }}>GazaPharma Link</h1>
          <p style={{ direction: "ltr", textAlign: "left" }}>Medicine availability search platform</p>
        </div>
      </div>
      {screen !== "search" && (
        <button className="ghost-btn" onClick={onBack}>
          <ArrowRight size={18} /> رجوع
        </button>
      )}
    </header>
  );
}

function SearchScreen({ query, setQuery, onSearch, isOffline, setIsOffline }) {
  return (
    <section className="screen search-screen">
      <div className="hero-card">
        <div className="hero-text" dir="rtl">
          <span className="eyebrow">GazaPharma Link</span>
          <h2>ابحث عن الدواء واعرف الصيدليات المتوفر فيها بسرعة</h2>
          <p>واجهة منظمة تعرض حالة توفر الدواء، آخر تحديث، اسم الصيدلية، المنطقة، ووسيلة التواصل.</p>
        </div>
        <div className="search-panel" dir="rtl">
          <label>اسم الدواء أو المادة الفعالة</label>
          <div className="search-input">
            <Search size={20} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="مثال: Panadol 500mg" onKeyDown={(e) => { if (e.key === "Enter") onSearch(); }} style={{ direction: "ltr" }} />
          </div>
          <button className="primary-btn full" onClick={onSearch}>بحث الآن <ArrowLeft size={18} /></button>
          <button className={isOffline ? "offline-btn active" : "offline-btn"} onClick={() => setIsOffline(v => !v)}>
            <WifiOff size={17} /> {isOffline ? "Offline مفعل" : "تجربة وضع Offline"}
          </button>
        </div>
      </div>
      <div className="feature-grid" dir="rtl">
        <div><ShieldCheck size={24} /><strong>صيدليات موثقة</strong><span>عرض حالة الثقة لكل صيدلية</span></div>
        <div><Clock size={24} /><strong>آخر تحديث</strong><span>توضيح حداثة بيانات المخزون</span></div>
        <div><MapPin size={24} /><strong>حسب المنطقة</strong><span>مناسب عند ضعف الموقع أو الاتصال</span></div>
      </div>
    </section>
  );
}

function ResultCard({ item, onOpenDetails }) {
  const isAvailable = item.availabilityStatus === "IN_STOCK" || item.availabilityStatus === "LOW_STOCK";
  return (
    <article className={`result-card ${item.isStale ? "stale" : ""}`} dir="rtl">
      <div className="result-head">
        <div>
          <h3>{item.pharmacyName}</h3>
          <p><ShieldCheck size={15} />{item.trustLevel}</p>
        </div>
        <AvailabilityBadge status={item.availabilityStatus} isStale={item.isStale} />
      </div>
      <div className="medicine-box">
        <Pill size={20} />
        <div>
          <strong style={{ direction: "ltr", display: "block", textAlign: "left" }}>{item.medicineName} {item.strength}</strong>
          <span style={{ direction: "ltr", display: "block", textAlign: "left" }}>{item.genericName} - {item.dosageForm}</span>
        </div>
      </div>
      <div className="meta-grid">
        <span><MapPin size={15} />{item.area}</span>
        <span><Clock size={15} />منذ {item.lastUpdatedMinutes} دقيقة</span>
        <span>الكمية: {item.quantity} عبوة</span>
      </div>
      {item.isStale && <div className="soft-warning"><AlertTriangle size={16} />البيانات قديمة وتحتاج تأكيد</div>}
      <div className="result-actions">
        {isAvailable ? (
          <button className="primary-btn" onClick={() => onOpenDetails(item)}>تفاصيل التوفر <ArrowLeft size={16} /></button>
        ) : (
          <button className="secondary-btn" onClick={() => onOpenDetails(item)}>ماذا أفعل؟</button>
        )}
        <a className="call-btn" href={`tel:${item.phone}`}><Phone size={16} />اتصال</a>
      </div>
    </article>
  );
}

function ResultsScreen({ query, results, onOpenDetails, onUnavailableFlow }) {
  const availableResults = results.filter(i => i.availabilityStatus !== "OUT_OF_STOCK");
  const unavailableResults = results.filter(i => i.availabilityStatus === "OUT_OF_STOCK");
  return (
    <section className="screen results-screen" dir="rtl">
      <div className="page-title">
        <span className="eyebrow">Search Results</span>
        <h2>نتائج البحث عن: {query || "—"}</h2>
        <p>اختاري صيدلية متوفر فيها الدواء لعرض التفاصيل.</p>
      </div>
      <div className="stats-row">
        <div><strong>{results.length}</strong><span>كل النتائج</span></div>
        <div><strong>{availableResults.length}</strong><span>متوفر / كمية قليلة</span></div>
        <div><strong>{unavailableResults.length}</strong><span>غير متوفر</span></div>
      </div>
      {availableResults.length > 0 && (
        <div className="section-block">
          <div className="section-heading"><CheckCircle2 size={20} /><h3>الصيدليات المتوفر فيها الدواء</h3></div>
          <div className="cards-grid">{availableResults.map(i => <ResultCard key={i.id} item={i} onOpenDetails={onOpenDetails} />)}</div>
        </div>
      )}
      {unavailableResults.length > 0 && (
        <div className="section-block">
          <div className="section-heading unavailable-title"><XCircle size={20} /><h3>صيدليات لا يتوفر فيها الدواء</h3></div>
          <div className="cards-grid">{unavailableResults.map(i => <ResultCard key={i.id} item={i} onOpenDetails={onUnavailableFlow} />)}</div>
        </div>
      )}
    </section>
  );
}

function UnavailableScreen({ query, onBackToResults }) {
  return (
    <section className="screen unavailable-screen" dir="rtl">
      <div className="empty-card professional-empty">
        <div className="empty-icon"><XCircle size={44} /></div>
        <span className="eyebrow">Unavailable Medicine Flow</span>
        <h2>الدواء غير متوفر حاليًا</h2>
        <p>يمكن إرسال طلب "دواء مطلوب" للصيدليات المطابقة.</p>
        <div className="request-box">
          <label>اسم الدواء المطلوب</label>
          <input value={query} readOnly style={{ direction: "ltr" }} />
          <label>المنطقة</label>
          <select defaultValue="gaza">
            <option value="gaza">غزة</option>
            <option value="north">الشمال</option>
            <option value="middle">الوسطى</option>
            <option value="khan">خانيونس</option>
            <option value="rafah">رفح</option>
          </select>
          <button className="primary-btn full"><Send size={16} />إرسال الطلب</button>
        </div>
        <button className="secondary-btn" onClick={onBackToResults}>الرجوع إلى النتائج</button>
      </div>
    </section>
  );
}

function DetailsScreen({ selected }) {
  return (
    <section className="screen details-screen" dir="rtl">
      <div className="details-layout">
        <div className="details-main-card">
          <AvailabilityBadge status={selected.availabilityStatus} isStale={selected.isStale} />
          <div className="pill-large"><Pill size={46} /></div>
          <h2 style={{ direction: "ltr" }}>{selected.medicineName} {selected.strength}</h2>
          <p style={{ direction: "ltr" }}>{selected.genericName} - {selected.dosageForm}</p>
          <div className="detail-grid">
            <div><span>الكمية</span><strong>{selected.quantity} عبوة</strong></div>
            <div><span>آخر تحديث</span><strong>منذ {selected.lastUpdatedMinutes} دقيقة</strong></div>
            <div><span>حالة التوثيق</span><strong style={{ direction: "ltr" }}>{selected.trustLevel}</strong></div>
            <div><span>المسافة</span><strong style={{ direction: "ltr" }}>{selected.distanceKm} km</strong></div>
          </div>
        </div>
        <div className="pharmacy-card">
          <h3>{selected.pharmacyName}</h3>
          <p><MapPin size={17} />{selected.area}</p>
          <p><Clock size={17} />{selected.workingHours}</p>
          <p><Phone size={17} /><span style={{ direction: "ltr" }}>{selected.phone}</span></p>
          <div className="note-box"><AlertTriangle size={18} />{selected.note}</div>
          <div className="map-card"><MapPin size={30} /><strong>موقع الصيدلية</strong><span>خريطة أو بديل نصي حسب المنطقة</span></div>
          <a className="primary-btn full" href={`tel:${selected.phone}`}><Phone size={16} />الاتصال بالصيدلية</a>
        </div>
      </div>
    </section>
  );
}

export default function SearchResultsPage() {
  const [screen, setScreen] = useState("search");
  const [query, setQuery] = useState("Panadol 500mg");
  const [selected, setSelected] = useState(null);
  const [isOffline, setIsOffline] = useState(false);

  const results = useMemo(() => {
    const words = query.toLowerCase().trim().split(" ").filter(Boolean);
    return pharmacies.filter(item => {
      const text = `${item.medicineName} ${item.genericName} ${item.strength} ${item.dosageForm} ${item.pharmacyName} ${item.area}`.toLowerCase();
      return words.length === 0 || words.every(word => text.includes(word));
    });
  }, [query]);

  const goBack = () => {
    if (screen === "details" || screen === "unavailable") { setScreen("results"); return; }
    setScreen("search");
  };

  const openDetails = (item) => {
    setSelected(item);
    if (item.availabilityStatus === "OUT_OF_STOCK") { setScreen("unavailable"); }
    else { setScreen("details"); }
  };

  return (
    <main className="app">
      <TopBar screen={screen} onBack={goBack} />
      {isOffline && <div className="offline-banner" dir="rtl"><WifiOff size={18} />أنت الآن غير متصل.</div>}
      {screen === "search" && <SearchScreen query={query} setQuery={setQuery} onSearch={() => setScreen("results")} isOffline={isOffline} setIsOffline={setIsOffline} />}
      {screen === "results" && <ResultsScreen query={query} results={results} onOpenDetails={openDetails} onUnavailableFlow={() => setScreen("unavailable")} />}
      {screen === "unavailable" && <UnavailableScreen query={query} onBackToResults={() => setScreen("results")} />}
      {screen === "details" && selected && <DetailsScreen selected={selected} />}
    </main>
  );
}