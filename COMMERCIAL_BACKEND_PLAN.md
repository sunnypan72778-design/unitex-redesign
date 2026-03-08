# Unitex 商用版后端架构（Vercel + Supabase）

## 1. 目标范围（对应你确认的 1-5）
1) 询价自动回复
2) 船期自动查询
3) 货物状态自动查询
4) 客户线上下单
5) 客户自助订单追踪

---

## 2. 技术架构
- **前端**：当前静态站（可升级 Next.js）
- **后端 API**：Vercel Functions (`/api/*`)
- **数据库**：Supabase Postgres
- **认证**：Supabase Auth (email magic link / password)
- **文件存储**：Supabase Storage（后续做“递交资料”）
- **通知**：Resend/SendGrid + WhatsApp API（后续）

---

## 3. 数据库表（核心）
- `profiles`：用户档案（角色、公司）
- `companies`：客户公司
- `inquiries`：询价记录
- `schedules`：船期数据
- `orders`：订单主表
- `order_events`：订单状态时间线
- `tracking_refs`：提单/箱号映射

SQL 在：`supabase/schema.sql`

---

## 4. API 设计（Vercel）
- `POST /api/inquiry`：提交询价 + 自动回复
- `GET /api/schedule?origin=&destination=`：船期查询
- `GET /api/track?id=`：货态查询
- `POST /api/orders`：创建订单（需登录）
- `GET /api/orders/:id`：查询指定订单（鉴权）
- `GET /api/my-orders`：当前客户订单列表

---

## 5. 权限模型（RLS）
- 客户：仅可看自己公司订单/询价
- 运营：可看全部订单，可更新状态
- 管理员：全量权限

RLS 示例在：`supabase/rls.sql`

---

## 6. 部署步骤
1. 在 Supabase 创建项目，执行 `schema.sql` + `rls.sql`
2. 在 Vercel 配环境变量：
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`（仅服务端）
3. 部署 Vercel
4. 前端将 portal 表单改为调用 `/api/*`

---

## 7. 下一步（我可以继续做）
- 直接帮你写好 Vercel API 文件（可跑）
- 把 portal.html 真实接到 Supabase（替换 localStorage）
- 接入邮件自动回复模板
