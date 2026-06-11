import { useState } from "react"
import "../SearchResultsPage.css"

const statusLabels = {
  IN_STOCK: { label: "متوفر", className: "status-green" },
  LOW_STOCK: { label: "كمية قليلة", className: "status-orange" },
  OUT_OF_STOCK: { label: "غير متوفر", className: "status-red" },
}

function PharmacistDashboard({ onLogout }) {
  const [medicines, setMedicines] = useState([])
  const [activeTab, setActiveTab] = useState("stock")
  const [newMed, setNewMed] = useState({ name: "", generic: "", status: "IN_STOCK" })
  const [requests, setRequests] = useState([
    { id: 1, medicine: "Insulin 100IU", area: "الرمال - غزة", time: "منذ 30 دقيقة", status: "pending" },
    { id: 2, medicine: "Ventolin Inhaler", area: "النصر - غزة", time: "منذ ساعة", status: "pending" },
  ])
  const [pharmacyInfo, setPharmacyInfo] = useState({
    name: "", address: "", phone: "", hours: ""
  })
  const [saved, setSaved] = useState(false)

  const addMedicine = () => {
    if (!newMed.name.trim()) return
    setMedicines(prev => [...prev, { id: Date.now(), ...newMed, lastUpdate: "الآن" }])
    setNewMed({ name: "", generic: "", status: "IN_STOCK" })
  }

  const updateStatus = (id, newStatus) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, status: newStatus, lastUpdate: "الآن" } : m))
  }

  const deleteMedicine = (id) => {
    setMedicines(prev => prev.filter(m => m.id !== id))
  }

  const saveProfile = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="app">

      {/* Header */}
      <div className="topbar">
        <div className="brand">
          <div className="brand-icon">💊</div>
          <div>
            <h1 style={{ direction: "ltr", textAlign: "left" }}>GazaPharma Link</h1>
            <p style={{ direction: "ltr", textAlign: "left" }}>Pharmacist Dashboard</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: "#176b87", fontWeight: "bold", fontSize: "14px" }} dir="rtl">
            💊 {pharmacyInfo.name || "الصيدلي"}
          </span>
          <button onClick={onLogout} className="ghost-btn" style={{ color: "#b42318", background: "#feeceb" }}>
            تسجيل خروج
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div dir = "rtl" style={{ background: "white", padding: "0 18px", display: "flex", gap: "4px", borderBottom: "1px solid #e4e7ec", marginBottom: "16px" }}>
        {[
          { key: "stock", label: "📦 تحديث المخزون" },
          { key: "requests", label: "📋 الطلبات الواردة" },
          { key: "profile", label: "🏥 ملف الصيدلية" },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: "14px 20px", border: "none", background: "transparent", cursor: "pointer", fontFamily: "Tahoma, Arial", fontSize: "14px", fontWeight: activeTab === tab.key ? "bold" : "normal", color: activeTab === tab.key ? "#176b87" : "#667085", borderBottom: activeTab === tab.key ? "3px solid #176b87" : "3px solid transparent" }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div dir="rtl">

        {/* تحديث المخزون */}
        {activeTab === "stock" && (
          <div>
            <div className="page-title">
              <span className="eyebrow" style={{ direction: "ltr", display: "block", textAlign: "left" }}>Inventory Management</span>
              <h2>تحديث المخزون</h2>
              <p>أضف أدوية صيدليتك وحدّث حالة توفرها</p>
            </div>

            {/* إضافة دواء جديد */}
            <div className="section-block">
              <div className="section-heading" style={{ marginBottom: "16px" }}>
                <h3>➕ إضافة دواء جديد</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>اسم الدواء</label>
                  <div className="search-input">
                    <input
                      placeholder="مثال: Panadol 500mg"
                      value={newMed.name}
                      onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                      style={{ width: "100%", direction: "ltr" }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>الاسم الجنيس</label>
                  <div className="search-input">
                    <input
                      placeholder="مثال: Paracetamol"
                      value={newMed.generic}
                      onChange={(e) => setNewMed(prev => ({ ...prev, generic: e.target.value }))}
                      style={{ width: "100%", direction: "ltr" }}
                    />
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>الحالة</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {Object.entries(statusLabels).map(([key, val]) => (
                    <button key={key} onClick={() => setNewMed(prev => ({ ...prev, status: key }))} className={newMed.status === key ? "primary-btn" : "ghost-btn"} style={{ fontSize: "13px" }}>
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
              <button className="primary-btn full" onClick={addMedicine}>
                ✓ إضافة الدواء
              </button>
            </div>

            {/* قائمة الأدوية */}
            {medicines.length > 0 && (
              <div className="section-block">
                <div className="section-heading" style={{ marginBottom: "16px" }}>
                  <h3>قائمة الأدوية ({medicines.length})</h3>
                </div>
                {medicines.map(med => (
                  <div key={med.id} className="result-card" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "#f8fbff", padding: "10px", borderRadius: "12px" }}>
                        <span style={{ fontSize: "20px" }}>💊</span>
                        <div>
                          <strong style={{ direction: "ltr", display: "block", textAlign: "left" }}>{med.name}</strong>
                          <span style={{ direction: "ltr", display: "block", textAlign: "left", color: "#667085", fontSize: "13px" }}>{med.generic}</span>
                        </div>
                      </div>
                      <div style={{ marginTop: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className={`badge ${statusLabels[med.status].className}`}>{statusLabels[med.status].label}</span>
                        <span style={{ color: "#aaa", fontSize: "12px" }}>آخر تحديث: {med.lastUpdate}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => updateStatus(med.id, "IN_STOCK")} className={med.status === "IN_STOCK" ? "primary-btn" : "ghost-btn"} style={{ fontSize: "13px", padding: "8px 14px" }}>متوفر</button>
                      <button onClick={() => updateStatus(med.id, "LOW_STOCK")} className={med.status === "LOW_STOCK" ? "primary-btn" : "ghost-btn"} style={{ fontSize: "13px", padding: "8px 14px" }}>كمية قليلة</button>
                      <button onClick={() => updateStatus(med.id, "OUT_OF_STOCK")} style={{ fontSize: "13px", padding: "8px 14px", border: "none", borderRadius: "15px", cursor: "pointer", fontFamily: "Tahoma, Arial", fontWeight: "800", background: med.status === "OUT_OF_STOCK" ? "#b42318" : "#feeceb", color: med.status === "OUT_OF_STOCK" ? "white" : "#b42318" }}>غير متوفر</button>
                      <button onClick={() => deleteMedicine(med.id)} style={{ fontSize: "13px", padding: "8px 14px", border: "none", borderRadius: "15px", cursor: "pointer", fontFamily: "Tahoma, Arial", fontWeight: "800", background: "#feeceb", color: "#b42318" }}>🗑 حذف</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {medicines.length === 0 && (
              <div className="section-block" style={{ textAlign: "center", color: "#667085" }}>
                <p>لا توجد أدوية مضافة بعد — أضف أول دواء من الأعلى 💊</p>
              </div>
            )}
          </div>
        )}

        {/* الطلبات الواردة */}
        {activeTab === "requests" && (
          <div>
            <div className="page-title">
              <span className="eyebrow" style={{ direction: "ltr", display: "block", textAlign: "left" }}>Medicine Requests</span>
              <h2>الطلبات الواردة</h2>
              <p>طلبات المرضى للأدوية غير المتوفرة</p>
            </div>
            <div className="section-block">
              <div className="stats-row" style={{ marginTop: 0, marginBottom: "16px" }}>
                <div><strong>{requests.filter(r => r.status === "pending").length}</strong><span>طلب معلق</span></div>
                <div><strong>{requests.filter(r => r.status === "responded").length}</strong><span>تم الرد</span></div>
                <div><strong>{requests.length}</strong><span>إجمالي الطلبات</span></div>
              </div>
              {requests.map(req => (
                <div key={req.id} className="result-card" style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 4px", direction: "ltr", textAlign: "left" }}>{req.medicine}</h3>
                    <p style={{ margin: "0 0 4px", color: "#667085", fontSize: "13px" }}>📍 {req.area}</p>
                    <p style={{ margin: 0, color: "#aaa", fontSize: "12px" }}>🕐 {req.time}</p>
                  </div>
                  <div>
                    {req.status === "pending" ? (
                      <button className="primary-btn" onClick={() => setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "responded" } : r))}>
                        الرد على الطلب
                      </button>
                    ) : (
                      <span className="badge status-green">✓ تم الرد</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ملف الصيدلية */}
        {activeTab === "profile" && (
          <div>
            <div className="page-title">
              <span className="eyebrow" style={{ direction: "ltr", display: "block", textAlign: "left" }}>Pharmacy Profile</span>
              <h2>ملف الصيدلية</h2>
              <p>أدخل معلومات صيدليتك</p>
            </div>
            <div className="section-block">
              {[
                { label: "اسم الصيدلية", key: "name", placeholder: "مثال: صيدلية الشفاء" },
                { label: "العنوان", key: "address", placeholder: "مثال: الرمال - غزة" },
                { label: "رقم الهاتف", key: "phone", placeholder: "مثال: 0599000001" },
                { label: "ساعات العمل", key: "hours", placeholder: "مثال: 9:00 صباحًا - 8:00 مساءً" },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", color: "#344054", fontWeight: "bold", marginBottom: "6px", fontSize: "14px" }}>{field.label}</label>
                  <div className="search-input">
                    <input
                      placeholder={field.placeholder}
                      value={pharmacyInfo[field.key]}
                      onChange={(e) => setPharmacyInfo(prev => ({ ...prev, [field.key]: e.target.value }))}
                      style={{ width: "100%", fontSize: "15px" }}
                    />
                  </div>
                </div>
              ))}
              <button className="primary-btn full" onClick={saveProfile}>
                حفظ التغييرات ✓
              </button>
              {saved && (
                <div className="badge status-green" style={{ marginTop: "12px", width: "100%", justifyContent: "center", padding: "12px" }}>
                  ✓ تم حفظ المعلومات بنجاح!
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default PharmacistDashboard