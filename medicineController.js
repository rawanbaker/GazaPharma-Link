// مصفوفة وهمية للأدوية المتوفرة حالياً (Mock Data) لمحاكاة قاعدة البيانات
const availableMedicines = [
    { id: 1, name: "Panadol", price: 15, available: true },
    { id: 2, name: "Aspirin", price: 10, available: true },
    { id: 3, name: "Amoxicillin", price: 25, available: false } // دواء مسجل بالسيستم لكنه غير متوفر بصيدليات غزة حالياً
];

// الدالة الخاصة بملاك: التحقق من توفر الدواء وإرسال الرسائل (SCRUM-10)
const checkMedicineAvailability = (req, res) => {
    // 1. استقبال اسم الدواء المراد البحث عنه من الـ Request
    const medicineName = req.query.name;

    if (!medicineName) {
        return res.status(400).json({
            status: "error",
            message: "يرجى إدخال اسم الدواء لبدء عملية البحث."
        });
    }

    // 2. محاكاة البحث في قاعدة البيانات (البحث عن الدواء بالاسم)
    // ملاحظة: هان سيتم الربط لاحقاً مع كود (كاملة وآلاء)
    const foundMedicine = availableMedicines.find(med => med.name.toLowerCase() === medicineName.toLowerCase());

    // 3. نظام التحقق والرسائل في حال عدم توفر الدواء (SCRUM-10)
    
    // الحالة أ: الدواء غير مسجل نهائياً في السيستم
    if (!foundMedicine) {
        return res.status(404).json({
            status: "not_found",
            message: `عذراً، الدواء "${medicineName}" غير مسجل في منظومة GazaPharma حالياً. تم إرسال تنبيه للإدارة لتحديث القوائم.`,
            suggestions: ["تأكد من كتابة الاسم بشكل صحيح", "ابحث باستخدام الاسم العلمي للدواء"]
        });
    }

    // الحالة ب: الدواء مسجل ولكنه غير متوفر في أي صيدلية حالياً
    if (foundMedicine.available === false) {
        return res.status(200).json({
            status: "out_of_stock",
            message: `الدواء "${medicineName}" مسجل لدينا، ولكنه غير متوفر حالياً في أي صidلية مشاركة في الوقت الحالي بسبب نقص الإمدادات.`,
            alternativeAction: "يمكنك تفعيل زر 'نبهني عند التوفر' ليصلك إشعار فور وصوله."
        });
    }

    // الحالة ج: الدواء متوفر (سيتم معالجتها بالكامل في واجهة سجى لاحقاً)
    return res.status(200).json({
        status: "available",
        message: `الدواء "${medicineName}" متوفر!`,
        data: foundMedicine
    });
};

module.exports = { checkMedicineAvailability };