package jp.co.mobileorder.repository;

import java.util.List;
import jp.co.mobileorder.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByPublishedTrueOrderByIdDesc();

    List<Product> findAllByOrderByIdDesc();
}
