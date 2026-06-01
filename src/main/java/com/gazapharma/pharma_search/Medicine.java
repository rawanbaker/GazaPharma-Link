package com.gazapharma.pharma_search;

import jakarta.persistence.*;

@Entity
@Table(name = "medicines")
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "trade_name", nullable = false)
    private String tradeName;

    @Column(name = "scientific_name", nullable = false)
    private String scientificName;

    @Column(name = "category")
    private String category;

    @Column(name = "status")
    private String status;

    // 1. المِشيد الافتراضي (Default Constructor) - ضروري جداً لـ JPA
    public Medicine() {
    }

    // 2. مِشيد مخصص لسهولة إنشاء الكائنات (Parameterized Constructor)
    public Medicine(String tradeName, String scientificName, String category, String status) {
        this.tradeName = tradeName;
        this.scientificName = scientificName;
        this.category = category;
        this.status = status;
    }

    // 3. دالات الجلب والتعديل (Getters and Setters)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTradeName() {
        return tradeName;
    }

    public void setTradeName(String tradeName) {
        this.tradeName = tradeName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
<<<<<<< HEAD
}
=======
}
>>>>>>> d029d71ff7ea6fe51e9cd9cab62fa369e69beec3
