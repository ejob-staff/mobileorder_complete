package jp.co.mobileorder.repository;

import java.util.List;
import jp.co.mobileorder.entity.MobileOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MobileOrderRepository extends JpaRepository<MobileOrder, Long> {
    List<MobileOrder> findByUsernameOrderByIdDesc(String username);

    List<MobileOrder> findAllByOrderByIdDesc();

    MobileOrder findByOrderNumber(String orderNumber);
}
