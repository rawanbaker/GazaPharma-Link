package com.gazapharma.pharma_search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    // 1. استعلام البحث المتعدد (بالاسم التجاري، العلمي، أو التصنيف)
    @Query("SELECT m FROM Medicine m WHERE " +
           "LOWER(m.tradeName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.scientificName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(m.category) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Medicine> searchMedication(@Param("query") String query);

    // 2. استعلام جلب البدائل المتوفرة (نفس الاسم العلمي وحالة المخزون ليست نفاذ)
    @Query("SELECT m FROM Medicine m WHERE LOWER(m.scientificName) = LOWER(:scientificName) AND m.status != 'Out of Stock'")
    List<Medicine> findSubstitutes(@Param("scientificName") String scientificName);
   // 3. استعلام جلب تفاصيل الموقع الجغرافي والعنوان للصيدلية بناءً على المعرّف (SCRUM-15)
    @Query(value = "SELECT id, name, district, street_address as streetAddress, latitude, longitude FROM pharmacies WHERE id = :pharmacyId", nativeQuery = true)
    Pharmacy findPharmacyLocationData(@Param("pharmacyId") int pharmacyId);
}