package com.gazapharma.pharma_search;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*") // لتسهيل ربط الـ Frontend لاحقاً دون قيود الحماية
public class MedicineController {

    private final MedicineRepository medicineRepository;

    // حقن المستودع برمجياً للوصول للدوال
    public MedicineController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    @GetMapping("/search")
    public List<Medicine> search(@RequestParam("query") String query) {
        // أولاً: نقوم بالبحث بالكلمة التي أدخلها المستخدم
        List<Medicine> results = medicineRepository.searchMedication(query);

        // ثانياً: منطق البدائل الذكي في غزة - إذا لم نجد الدواء أو وجدناه ولكن حالته "غير متوفر" في المخزن
        if (results.isEmpty() || isAllOut(results)) {
            System.out.println("الدواء المطلوب غير متوفر حالياً، جاري جلب البدائل ذات نفس المادة الفعالة تلقائياً...");
            
            // نستخدم دالة البحث عن البدائل بناءً على الكلمة المكتوبة (الاسم العلمي)
            return medicineRepository.findSubstitutes(query);
        }

        // إذا كان متوفراً، نرجعه للمستخدم مباشرة
        return results;
    }

    // دالة مساعدة لفحص ما إذا كانت جميع نتائج الدواء المبحوث عنه "غير متوفرة"
    private boolean isAllOut(List<Medicine> list) {
        return list.stream().allMatch(m -> "Out of Stock".equalsIgnoreCase(m.getStatus()));
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d029d71ff7ea6fe51e9cd9cab62fa369e69beec3
