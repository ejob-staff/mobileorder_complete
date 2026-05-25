package jp.co.mobileorder.config;

import java.time.LocalDateTime;
import jp.co.mobileorder.entity.AppUser;
import jp.co.mobileorder.entity.MobileOrder;
import jp.co.mobileorder.entity.OrderItem;
import jp.co.mobileorder.entity.OrderStatus;
import jp.co.mobileorder.entity.Product;
import jp.co.mobileorder.entity.ProductReview;
import jp.co.mobileorder.entity.Role;
import jp.co.mobileorder.entity.UserManagementCode;
import jp.co.mobileorder.repository.AppUserRepository;
import jp.co.mobileorder.repository.MobileOrderRepository;
import jp.co.mobileorder.repository.ProductRepository;
import jp.co.mobileorder.repository.ProductReviewRepository;
import jp.co.mobileorder.repository.UserManagementCodeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initData(
            AppUserRepository appUserRepository,
            ProductRepository productRepository,
            UserManagementCodeRepository userManagementCodeRepository,
            MobileOrderRepository mobileOrderRepository,
            ProductReviewRepository productReviewRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (appUserRepository.count() == 0) {
                appUserRepository.save(new AppUser("user", passwordEncoder.encode("password"), "一般ユーザー", Role.ROLE_USER));
                appUserRepository.save(new AppUser("admin", passwordEncoder.encode("password"), "管理者ユーザー", Role.ROLE_ADMIN));
            }

            if (userManagementCodeRepository.count() == 0) {
                appUserRepository.findAll().forEach(AppUser::enable);

                var userCode = new UserManagementCode("USER-CODE-BF92KDLS0QWE");
                userCode.markUsed("user");
                userManagementCodeRepository.save(userCode);

                var adminCode = new UserManagementCode("ADMIN-CODE-QW8XCV19PLKA");
                adminCode.markUsed("admin");
                userManagementCodeRepository.save(adminCode);
            }

            if (productRepository.count() == 0) {
                productRepository.save(new Product("いちごタピオカミルクティ", "もちもち食感のタピオカに、甘酸っぱいいちごミルクを合わせた人気ドリンクです。", "タピオカ", 620, 40, true, "berry"));
                productRepository.save(new Product("濃厚タピオカミルクティ", "コク深いミルクティに黒糖タピオカを合わせた定番ドリンクです。", "タピオカ", 520, 32, true, "honey"));
                productRepository.save(new Product("黒糖タピオカラテ", "香ばしい黒糖シロップとミルクを合わせた、満足感のあるタピオカドリンクです。", "タピオカ", 640, 28, true, "caramel"));
                productRepository.save(new Product("抹茶タピオカミルク", "香り高い抹茶とミルク、もちもちタピオカを合わせた和風ドリンクです。", "タピオカ", 660, 24, true, "matcha"));
                productRepository.save(new Product("マンゴータピオカヨーグルト", "マンゴーの甘さとヨーグルトの酸味を合わせた、爽やかなタピオカドリンクです。", "タピオカ", 680, 26, true, "honey"));
                productRepository.save(new Product("チョコタピオカミルク", "チョコレートの濃厚な甘さとタピオカの食感を楽しめるドリンクです。", "タピオカ", 650, 24, true, "cocoa"));
                productRepository.save(new Product("ピーチタピオカティー", "桃の香りが広がる紅茶にタピオカを合わせた、華やかなドリンクです。", "タピオカ", 640, 22, true, "berry"));
                productRepository.save(new Product("濃厚ショコラケーキ", "しっとり焼き上げた生地に濃厚チョコクリームを重ねた贅沢なケーキです。", "ケーキ", 680, 14, true, "cocoa"));
                productRepository.save(new Product("ふわふわベリーチーズケーキ", "ベリーの酸味とチーズのコクを楽しめる、華やかなケーキです。", "ケーキ", 720, 12, true, "berry"));
                productRepository.save(new Product("ロイヤルハニークッキー", "バターの香りが広がる生地に、やさしいはちみつの甘さを加えた焼き菓子です。", "焼き菓子", 380, 18, true, "honey"));
                productRepository.save(new Product("いちごマドレーヌ", "いちごの香りがふわっと広がる、やさしい甘さの焼き菓子です。", "焼き菓子", 340, 20, true, "berry"));
                productRepository.save(new Product("桜いちごミルク", "春らしい桜の香りといちごミルクを合わせた季節限定ドリンクです。", "季節限定", 690, 16, true, "berry"));
                productRepository.save(new Product("桃のクリームタルト", "みずみずしい桃と軽いクリームを合わせた季節限定スイーツです。", "季節限定", 780, 10, true, "caramel"));
                productRepository.save(new Product("抹茶クリーミーラテ", "香り高い抹茶とミルクを合わせた、ほどよい苦味が楽しめるクリーミーなラテです。", "ドリンク", 580, 22, true, "matcha"));
                productRepository.save(new Product("ローズベリーティー", "華やかなローズの香りとベリーの酸味が楽しめるすっきりした紅茶です。", "ドリンク", 560, 18, true, "berry"));
                productRepository.save(new Product("キャラメルバニラワッフル", "焼きたてワッフルに濃厚キャラメルソースをかけた人気スイーツです。", "その他", 720, 12, true, "caramel"));
                productRepository.save(new Product("ハートミニパフェ", "小さなグラスにクリームとフルーツを重ねた、見た目もかわいいミニパフェです。", "その他", 640, 15, true, "mint"));
            }

            if (mobileOrderRepository.count() == 0) {
                var products = productRepository.findAll();
                if (products.size() >= 10) {
                    var now = LocalDateTime.now();
                    var strawberry = products.stream().filter(product -> product.getName().equals("いちごタピオカミルクティ")).findFirst().orElse(products.get(0));
                    var milkTea = products.stream().filter(product -> product.getName().equals("濃厚タピオカミルクティ")).findFirst().orElse(products.get(1));
                    var cookie = products.stream().filter(product -> product.getName().equals("ロイヤルハニークッキー")).findFirst().orElse(products.get(2));
                    var cake = products.stream().filter(product -> product.getName().equals("濃厚ショコラケーキ")).findFirst().orElse(products.get(3));
                    var seasonal = products.stream().filter(product -> product.getCategory().equals("季節限定")).findFirst().orElse(products.get(4));

                    for (int i = 0; i < 20; i++) {
                        var createdAt = now.minusDays(i % 7).minusHours(i % 4);
                        var order = new MobileOrder("MOBILE-CODE-STRAW" + String.format("%02d", i + 1), "user", createdAt, createdAt.plusMinutes(30), strawberry.getPrice());
                        order.addItem(new OrderItem(strawberry.getId(), strawberry.getName(), strawberry.getPrice(), 1));
                        order.updateStatus(OrderStatus.SERVED, null, null);
                        order.markReceived(createdAt.plusMinutes(42));
                        mobileOrderRepository.save(order);
                    }

                    for (int i = 0; i < 8; i++) {
                        var createdAt = now.minusDays(i % 6).minusMinutes(20 * i);
                        var order = new MobileOrder("MOBILE-CODE-MILK" + String.format("%02d", i + 1), "user", createdAt, createdAt.plusMinutes(35), milkTea.getPrice() + cookie.getPrice());
                        order.addItem(new OrderItem(milkTea.getId(), milkTea.getName(), milkTea.getPrice(), 1));
                        order.addItem(new OrderItem(cookie.getId(), cookie.getName(), cookie.getPrice(), 1));
                        order.updateStatus(OrderStatus.SERVED, null, null);
                        order.markReceived(createdAt.plusMinutes(50));
                        mobileOrderRepository.save(order);
                    }

                    var cookingOrder = new MobileOrder("MOBILE-CODE-COOK01", "user", now.minusMinutes(18), now.plusMinutes(18), cake.getPrice());
                    cookingOrder.addItem(new OrderItem(cake.getId(), cake.getName(), cake.getPrice(), 1));
                    cookingOrder.updateStatus(OrderStatus.COOKING, null, null);
                    mobileOrderRepository.save(cookingOrder);

                    var pendingOrder = new MobileOrder("MOBILE-CODE-PEND01", "user", now.minusMinutes(8), now.plusMinutes(12), seasonal.getPrice());
                    pendingOrder.addItem(new OrderItem(seasonal.getId(), seasonal.getName(), seasonal.getPrice(), 1));
                    mobileOrderRepository.save(pendingOrder);
                }
            }

            if (productReviewRepository.count() == 0) {
                var products = productRepository.findAll();
                var strawberry = products.stream().filter(product -> product.getName().equals("いちごタピオカミルクティ")).findFirst();
                var milkTea = products.stream().filter(product -> product.getName().equals("濃厚タピオカミルクティ")).findFirst();
                var cookie = products.stream().filter(product -> product.getName().equals("ロイヤルハニークッキー")).findFirst();
                var cake = products.stream().filter(product -> product.getName().equals("濃厚ショコラケーキ")).findFirst();
                var now = LocalDateTime.now();

                strawberry.ifPresent(product -> {
                    for (int i = 0; i < 20; i++) {
                        productReviewRepository.save(new ProductReview("MOBILE-CODE-STRAW" + String.format("%02d", i + 1), product.getId(), product.getName(), "user", 5, "いちごの甘さとタピオカのもちもち感が最高でした。", now.minusDays(i % 7).plusMinutes(20)));
                    }
                });
                milkTea.ifPresent(product -> {
                    for (int i = 0; i < 8; i++) {
                        productReviewRepository.save(new ProductReview("MOBILE-CODE-MILK" + String.format("%02d", i + 1), product.getId(), product.getName(), "user", 4 + (i % 2), "ミルクティの味が濃くておいしかったです。", now.minusDays(i % 6).plusMinutes(30)));
                    }
                });
                cookie.ifPresent(product -> productReviewRepository.save(new ProductReview("MOBILE-CODE-MILK01", product.getId(), product.getName(), "user", 4, "焼き菓子も一緒に頼めてよかったです。", now.minusDays(2))));
                cake.ifPresent(product -> productReviewRepository.save(new ProductReview("MOBILE-CODE-CAKE01", product.getId(), product.getName(), "user", 4, "濃厚で満足感がありました。", now.minusDays(20))));
            }
        };
    }
}
