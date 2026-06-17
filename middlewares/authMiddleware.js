// دالة الحارس للتحقق من الصلاحيات (Authorization)
const isAdmin = (req, res, next) => {
    // سنقرأ الدور حالياً من الـ Headers لتسهيل الاختبار والتأكد من عمل الكود
    const userRole = req.headers['role']; 

    if (userRole === 'admin') {
        next(); // الصلاحية صحيحة، مرر المستخدم للخطوة التالية (لوحة التحكم)
    } else {
        // إذا لم يكن أدمن، ارفض الطلب فوراً وأرجع كود المنع 403
        return res.status(403).json({ 
            success: false, 
            message: "عذراً، لا تمتلك الصلاحيات الكافية لدخول لوحة التحكم (Admin فقط)." 
        });
    }
};

export { isAdmin };