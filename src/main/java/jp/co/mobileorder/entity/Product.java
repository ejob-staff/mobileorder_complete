package jp.co.mobileorder.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    private String category;
    private Integer price;
    private Integer stock;
    private boolean published;
    private String accent;

    protected Product() {
    }

    public Product(String name, String description, String category, Integer price, Integer stock, boolean published, String accent) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.published = published;
        this.accent = accent;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public Integer getPrice() {
        return price;
    }

    public Integer getStock() {
        return stock;
    }

    public boolean isPublished() {
        return published;
    }

    public String getAccent() {
        return accent;
    }

    public void update(String name, String description, String category, Integer price, Integer stock, boolean published, String accent) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.published = published;
        this.accent = accent;
    }

    public void togglePublished() {
        this.published = !this.published;
    }

    public void decreaseStock(int quantity) {
        this.stock -= quantity;
    }
}
