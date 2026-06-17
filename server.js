import express from 'express';
import { isAdmin } from './middlewares/authMiddleware.js'; // لاحظي إضافة .js في الآخر مهمة جداً هنا
//import { checkMedicineAvailability } from './medicineController.js'; // استيراد دالة الفحص السابقة للمهمة السابقة

const app = express();
const PORT = 3000;

// 1. مسار فحص الدواء (المهمة السابقة)
//app.get('/api/search-medicine', checkMedicineAvailability);

// 2. مسار لوحة التحكم المحمي (المهمة الجديدة SCRUM-23)
app.get('/api/dashboard', isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "أهلاً بكِ في لوحة التحكم المحمية لمشروع GazaPharma!",
        data: {
            stats: "إحصائيات الأدوية والصيدليات تظهر هنا بنجاح."
        }
    });
});

// تشغيل السيرفر المحلي
app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
    console.log(`لإجراء فحص الدواء: http://localhost:${PORT}/api/search-medicine?name=Panadol`);
    console.log(`لدخول لوحة التحكم: http://localhost:${PORT}/api/dashboard`);
});