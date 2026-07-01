package com.gazapharma.pharma_search;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*") // لتسهيل ربط الـ Frontend لاحقاً دون قيود الحماية
public class MedicineController {

    private final MedicineRepository medicineRepository;

    // حقن المستودع برمجياً عبر الـ Constructor (أسلوب زملائك المعتمد)
    public MedicineController(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    // ==========================================
    // أولاً: كود البحث والموقع المكتوب مسبقاً (معدل لـ SCRUM-16)
    // ==========================================

    @GetMapping("/search")
    public List<Medicine> search(@RequestParam("query") String query) {
        List<Medicine> results = medicineRepository.searchMedication(query);

        if (results.isEmpty() || isAllOut(results)) {
            System.out.println("الدواء المطلوب غير متوفر حالياً، جاري جلب البدائل ذات نفس المادة الفعالة تلقائياً...");
            return medicineRepository.findSubstitutes(query);
        }
        return results;
    }

    private boolean isAllOut(List<Medicine> list) {
        return list.stream().allMatch(m -> "Out of Stock".equalsIgnoreCase(m.getStatus()));
    }

    @GetMapping("/location")
    public ResponseEntity<?> getPharmacyLocation(@RequestParam int pharmacyId) {
        try {
            Pharmacy pharmacy = medicineRepository.findPharmacyLocationData(pharmacyId);
            
            // محاكاة خطأ لغايات اختبار الـ Fallback أمام لجنة المناقشة إذا كانت الخريطة لا تعمل
            if (pharmacy == null || pharmacy.getLatitude() == null) {
                throw new RuntimeException("فشل الاتصال بنظام الإحداثيات الحية والخرائط.");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("pharmacyId", pharmacy.getId());
            response.put("pharmacyName", pharmacy.getName());
            
            String fullAddress = "Gaza, " + pharmacy.getDistrict() + " District, " + pharmacy.getStreetAddress();
            response.put("fullAddress", fullAddress);
            response.put("latitude", pharmacy.getLatitude());
            response.put("longitude", pharmacy.getLongitude());
            response.put("status", "Success");
            
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // 🔥 كود آلاء (SCRUM-16): معالجة أخطاء الموقع والانتقال للنص البديل حماية للسيستم
            System.out.println("خطأ في تحديد الموقع: " + e.getMessage() + " -> تفعيل آلية النص البديل (Fallback Mode).");
            
            Map<String, Object> fallbackResponse = new HashMap<>();
            fallbackResponse.put("pharmacyId", pharmacyId);
            fallbackResponse.put("status", "Fallback Mode Active (SCRUM-16)");
            
            // النص البديل الافتراضي اللي هيظهر ع الشاشة عشان الفرونت إند ما يعلقش
            fallbackResponse.put("fullAddress", "غزة - الرمال - امتداد شارع عمر المختار (العنوان المسجل افتراضياً نتيجة تعطل الخرائط الحية)");
            fallbackResponse.put("latitude", 31.5); // إحداثيات تقريبية لقطاع غزة كبديل
            fallbackResponse.put("longitude", 34.45);
            
            return ResponseEntity.ok(fallbackResponse); // بنرجع 200 OK مع بيانات النص البديل
        }
    }

    // ==========================================
    // ثانياً: العمليات الخاصة بكِ (SCRUM-22: Inventory CRUD & Real-time APIs)
    // ==========================================

    // 🔥 مهمة آلاء الإضافية: التحديث الفوري والآمن للمخزون لمنع تضارب البيانات عند المبيعات
    @PostMapping("/reduce-stock")
    public ResponseEntity<String> reduceStockRealTime(@RequestParam Long medicineId, @RequestParam Integer quantity) {
        int updatedRows = medicineRepository.reduceStockImmediately(medicineId, quantity);
        if (updatedRows > 0) {
            return ResponseEntity.ok("تم تحديث كمية المخزن فوراً بنجاح (Real-time update done).");
        } else {
            return ResponseEntity.badRequest().body("فشل التحديث الفوري: المخزون غير كافٍ أو معرف الدواء خاطئ.");
        }
    }

    // 1. READ ALL: جلب وعرض كل الأدوية بالمخزون للوحة التحكم
    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    // 2. CREATE: إضافة دواء جديد للمخزن
    @PostMapping
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        Medicine savedMedicine = medicineRepository.save(medicine);
        return new ResponseEntity<>(savedMedicine, HttpStatus.CREATED);
    }

    // 3. UPDATE: تعديل بيانات الدواء أو حالته (In Stock / Out of Stock)
    @PutMapping("/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable Long id, @RequestBody Medicine medicineDetails) {
        Optional<Medicine> medicineOptional = medicineRepository.findById(id);
        
        if (medicineOptional.isPresent()) {
            Medicine existingMedicine = medicineOptional.get();
            
            existingMedicine.setTradeName(medicineDetails.getTradeName());
            existingMedicine.setScientificName(medicineDetails.getScientificName());
            existingMedicine.setCategory(medicineDetails.getCategory());
            existingMedicine.setStatus(medicineDetails.getStatus()); // "In Stock" أو "Out of Stock"
            
            // في حال تم ربط حقل الـ quantity في الفرونت إند
            if(medicineDetails.getQuantity() != null) {
                existingMedicine.setQuantity(medicineDetails.getQuantity());
            }
            
            Medicine updatedMedicine = medicineRepository.save(existingMedicine);
            return ResponseEntity.ok(updatedMedicine);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 4. DELETE: حذف سجل دواء نهائياً من المخزون
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}