package com.gazapharma.pharma_search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine, Long> {

    List<Medicine> findByTradeNameContainingIgnoreCase(String tradeName);

    List<Medicine> findByScientificNameContainingIgnoreCase(String scientificName);

    List<Medicine> findByActiveIngredientContainingIgnoreCase(String activeIngredient);

    List<Medicine> findByAvailable(boolean available);

    List<Medicine> findByStockStatus(String stockStatus);

    List<Medicine> findByCategoryContainingIgnoreCase(String category);
}
