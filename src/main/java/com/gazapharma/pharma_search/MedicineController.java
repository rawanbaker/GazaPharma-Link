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
    // 3. (SCRUM-15) الخاص بجلب موقع الصيدلية وتنسيق العنوان الجغرافي API مسار 
    @GetMapping("/location")
    public org.springframework.http.ResponseEntity<?> getPharmacyLocation(@RequestParam int pharmacyId) {
        try {
            Pharmacy pharmacy = medicineRepository.findPharmacyLocationData(pharmacyId);
            
            if (pharmacy != null) {
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("pharmacyId", pharmacy.getId());
                response.put("pharmacyName", pharmacy.getName());
                
                // صياغة تفصيلية مطابقة تماماً للمعيار المطلوب
                String fullAddress = "Gaza, " + pharmacy.getDistrict() + " District, " + pharmacy.getStreetAddress();
                response.put("fullAddress", fullAddress);
                
                response.put("latitude", pharmacy.getLatitude());
                response.put("longitude", pharmacy.getLongitude());
                
                return org.springframework.http.ResponseEntity.ok(response);
            } else {
                return org.springframework.http.ResponseEntity.status(404).body("Location not found");
            }
        } catch (Exception e) {
            return org.springframework.http.ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}