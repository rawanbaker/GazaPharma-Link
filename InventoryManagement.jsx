import React, { useState } from 'react';

// المكون الرئيسي لإدارة المخزون (شغلكِ الأساسي SCRUM-21)
const InventoryManagement = ({ currentPharmacyId }) => {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({ name: '', quantity: '', price: '', substitute: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // 1. إضافة أو تحديث دواء (C/U)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setMedicines(medicines.map(med => med.id === editId ? { ...med, ...formData } : med));
      setIsEditing(false);
    } else {
      setMedicines([...medicines, { id: Date.now(), ...formData }]);
    }
    setFormData({ name: '', quantity: '', price: '', substitute: '' });
  };

  // 2. حذف دواء (D)
  const handleDelete = (id) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  return (
    <div className="inventory-container">
      <h3>إدارة مخزون الأدوية</h3>
      
      {/* نموذج الإضافة والتعديل */}
      <form onSubmit={handleSubmit} className="medicine-form">
        <input 
          type="text" 
          placeholder="اسم الدواء" 
          value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})} 
          required 
        />
        <input 
          type="number" 
          placeholder="الكمية المتوفرة" 
          value={formData.quantity} 
          onChange={(e) => setFormData({...formData, quantity: e.target.value})} 
          required 
        />
        <button type="submit">{isEditing ? "تحديث الدواء" : "إضافة للمخزون"}</button>
      </form>

      {/* جدول عرض الأدوية المتوفرة الحاليين */}
      <table className="medicine-table">
        <thead>
          <tr>
            <th>اسم الدواء</th>
            <th>الكمية</th>
            <th>العمليات</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((med) => (
            <tr key={med.id}>
              <td>{med.name}</td>
              <td>{med.quantity}</td>
              <td>
                <button onClick={() => { setIsEditing(true); setEditId(med.id); setFormData(med); }}>تعديل</button>
                <button onClick={() => handleDelete(med.id)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
