package com.gazapharma.pharma_search;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

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
    // أولاً: كود البحث والموقع المكتوب مسبقاً (لا نلمسه)
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
            
            if (pharmacy != null) {
                java.util.Map<String, Object> response = new java.util.HashMap<>();
                response.put("pharmacyId", pharmacy.getId());
                response.put("pharmacyName", pharmacy.getName());
                
                String fullAddress = "Gaza, " + pharmacy.getDistrict() + " District, " + pharmacy.getStreetAddress();
                response.put("fullAddress", fullAddress);
                
                response.put("latitude", pharmacy.getLatitude());
                response.put("longitude", pharmacy.getLongitude());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(404).body("Location not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    // ==========================================
    // ثانياً: العمليات الخاصة بكِ (SCRUM-22: Inventory CRUD APIs)
    // ==========================================

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