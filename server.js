const express = require('express');
const app = express();
const PORT = 3000;

// استيراد الدالة الخاصة بملاك
const { checkMedicineAvailability } = require('./medicineController');

// إنشاء الـ Endpoint (المسار) الخاص بفحص الدواء
app.get('/api/search-medicine', checkMedicineAvailability);

// تشغيل السيرفر المحلي
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
    console.log(`لإجراء فحص: http://localhost:${PORT}/api/search-medicine?name=Panadol`);
});