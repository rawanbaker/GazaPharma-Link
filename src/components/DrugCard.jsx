function DrugCard({ drug, onDetails }) {
  return (
    <div className="result-card">
      <div className="medicine-box">
        <span style={{ fontSize: "22px" }}>💊</span>
        <div>
          <strong>{drug.name}</strong>
          <span>{drug.company} — {drug.category}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
        <span className={`badge ${drug.rx ? "status-orange" : "status-green"}`}>
          {drug.rx ? "يستلزم وصفة" : "بدون وصفة"}
        </span>
        <strong style={{ color: "#176b87" }}>₪{drug.price}</strong>
      </div>
      <div className="result-actions">
        <button className="primary-btn full" onClick={() => onDetails(drug)}>
          عرض التفاصيل
        </button>
      </div>
    </div>
  )
}

export default DrugCard