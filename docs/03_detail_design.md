# 詳細設計
この資料は、モバイルオーダーアプリの詳細設計として<br>
主なAPI一覧を整理したものです。

## 9. 主なAPI一覧
認証:
- POST /api/login
- POST /api/logout
- GET /api/auth/status
- POST /api/auth/login-check
- POST /api/signup
- POST /api/password-reset

商品:
- GET /api/products
- GET /api/admin/products
- POST /api/admin/products
- PUT /api/admin/products/{id}
- POST /api/admin/products/{id}/toggle-published
- DELETE /api/admin/products/{id}

注文:
- POST /api/orders
- GET /api/orders
- GET /api/orders/active
- POST /api/orders/{orderNumber}/received
- GET /api/admin/orders
- PUT /api/admin/orders/{orderNumber}/status

評価:
- GET /api/reviews
- POST /api/reviews
- GET /api/admin/reviews?period=all
- GET /api/admin/reviews?period=week
- GET /api/admin/reviews?period=month

注文分析:
- GET /api/admin/analytics

アカウント:
- GET /api/account
- PUT /api/account

ユーザー管理:
- GET /api/admin/users
- POST /api/admin/users/admin
- POST /api/admin/users/{id}/toggle-enabled
- DELETE /api/admin/users/{id}
- GET /api/admin/user-management-codes
- POST /api/admin/user-management-codes/user
- POST /api/admin/user-management-codes/admin
