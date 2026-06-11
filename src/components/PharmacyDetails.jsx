function PharmacyDetails({ pharmacy, onBack }) {
  return (
    <div style={{ minHeight: "100vh", background: "#f3f6fb", fontFamily: "Tahoma, Arial", padding: "22px" }}>

      {/* Header */}
      <div style={{ background: "white", borderRadius: "20px", padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
        <button onClick={onBack} style={{ background: "#edf8fb", border: "none", borderRadius: "12px", padding: "8px 16px", color: "#176b87", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial" }}>
          → رجوع
        </button>
        <h2 style={{ margin: 0, color: "#176b87", fontSize: "18px" }}>تفاصيل الصيدلية</h2>
        <div style={{ width: "60px" }}></div>
      </div>

      {/* بطاقة الصيدلية */}
      <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div style={{ width: "60px", height: "60px", background: "#edf8fb", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px" }}>
            🏥
          </div>
          <div>
            <h2 style={{ margin: "0 0 4px", color: "#0f2942", fontSize: "20px" }}>{pharmacy.name}</h2>
            <span style={{ background: pharmacy.available ? "#e7f8ef" : "#feeceb", color: pharmacy.available ? "#087443" : "#b42318", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
              {pharmacy.available ? "✓ متوفر" : "✗ غير متوفر"}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ background: "#f8fbff", borderRadius: "14px", padding: "14px" }}>
            <span style={{ color: "#667085", fontSize: "12px", display: "block", marginBottom: "4px" }}>العنوان</span>
            <strong style={{ color: "#0f2942" }}>📍 {pharmacy.address}</strong>
          </div>
          <div style={{ background: "#f8fbff", borderRadius: "14px", padding: "14px" }}>
            <span style={{ color: "#667085", fontSize: "12px", display: "block", marginBottom: "4px" }}>ساعات العمل</span>
            <strong style={{ color: "#0f2942" }}>🕐 {pharmacy.hours}</strong>
          </div>
          <div style={{ background: "#f8fbff", borderRadius: "14px", padding: "14px" }}>
            <span style={{ color: "#667085", fontSize: "12px", display: "block", marginBottom: "4px" }}>رقم الهاتف</span>
            <strong style={{ color: "#0f2942" }}>📞 {pharmacy.phone}</strong>
          </div>
          <div style={{ background: "#f8fbff", borderRadius: "14px", padding: "14px" }}>
            <span style={{ color: "#667085", fontSize: "12px", display: "block", marginBottom: "4px" }}>المسافة</span>
            <strong style={{ color: "#0f2942" }}>🚶 {pharmacy.distance}</strong>
          </div>
        </div>
      </div>

      {/* خريطة */}
      <div style={{ background: "white", borderRadius: "20px", padding: "24px", marginBottom: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ color: "#176b87", margin: "0 0 12px" }}>📍 موقع الصيدلية</h3>
        <div style={{ background: "#f3fbfd", border: "1px dashed #9db8c3", borderRadius: "16px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "8px", color: "#176b87" }}>
          <span style={{ fontSize: "36px" }}>🗺️</span>
          <span style={{ fontWeight: "bold" }}>خريطة الموقع</span>
          <span style={{ fontSize: "13px", color: "#667085" }}>سيتم ربطها مع Google Maps</span>
        </div>
      </div>

      {/* زر الاتصال */}
      <button style={{ width: "100%", padding: "16px", background: "#176b87", color: "white", border: "none", borderRadius: "16px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", fontFamily: "Tahoma, Arial" }}>
        📞 الاتصال بالصيدلية
      </button>

    </div>
  )
}

export default PharmacyDetails