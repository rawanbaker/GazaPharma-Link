package com.gazapharma.pharma_search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@CrossOrigin(origins = "*")
public class MedicineController {

    @Autowired
    private MedicineRepository medicineRepository;

    @GetMapping
    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    @GetMapping("/search")
    public List<Medicine> searchMedicines(
        @RequestParam(required = false) String tradeName,
        @RequestParam(required = false) String scientificName,
        @RequestParam(required = false) String activeIngredient,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String stockStatus,
        @RequestParam(required = false) Boolean available) {

        if (tradeName != null)
            return medicineRepository.findByTradeNameContainingIgnoreCase(tradeName);
        if (scientificName != null)
            return medicineRepository.findByScientificNameContainingIgnoreCase(scientificName);
        if (activeIngredient != null)
            return medicineRepository.findByActiveIngredientContainingIgnoreCase(activeIngredient);
        if (category != null)
            return medicineRepository.findByCategoryContainingIgnoreCase(category);
        if (stockStatus != null)
            return medicineRepository.findByStockStatus(stockStatus);
        if (available != null)
            return medicineRepository.findByAvailable(available);

        return medicineRepository.findAll();
    }
}

