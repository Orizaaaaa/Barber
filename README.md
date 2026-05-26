# BarberShop Backend API

Aplikasi backend manajemen barbershop lengkap dengan fitur booking, pembayaran, inventory, laporan, payroll, dan CRM.

## Tech Stack

- **Node.js** + **Express** + **TypeScript**
- **Prisma ORM** + **SQLite** (dev)
- **JWT** authentication + role-based access

## Struktur Folder

```
src/
  config/        # Prisma client, env
  middleware/    # Auth, validation
  routes/        # API routes
  controllers/   # Request handlers
  services/      # Business logic
  utils/         # Helpers (jwt, password, response)
  types/         # Type declarations
prisma/
  schema.prisma  # Database schema
  seed.ts        # Seed data
```

## Cara Menjalankan

1. Install dependencies:
   ```bash
   npm install
   ```

2. Jalankan database migration (sudah dilakukan, jika perlu reset):
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. Seed data awal:
   ```bash
   npx tsx prisma/seed.ts
   ```

4. Jalankan server development:
   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:3000`.

## Endpoint API Utama

### Auth
- `POST /api/auth/register` - Register customer
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Profile saya

### Users & Customers
- `GET /api/users` - List users (admin)
- `GET /api/customers` - List customers (admin)
- `GET /api/customers/me/data` - Data customer saya
- `GET /api/customers/me/points` - Poin loyalty saya

### Barbers
- `GET /api/barbers` - List barber
- `GET /api/barbers/:id` - Detail barber
- `GET /api/barbers/:id/availability?date=YYYY-MM-DD` - Cek slot kosong
- `POST /api/barbers/:id/schedule` - Atur jadwal (admin)
- `POST /api/barbers/:id/portfolio` - Tambah portfolio

### Services
- `GET /api/services` - List layanan
- `POST /api/services` - Tambah layanan (admin)

### Bookings
- `POST /api/bookings` - Buat booking
- `GET /api/bookings` - List booking (dengan filter)
- `PATCH /api/bookings/:id/status` - Update status
- `PATCH /api/bookings/:id/reschedule` - Reschedule
- `PATCH /api/bookings/:id/cancel` - Cancel

### Payments
- `GET /api/payments` - List payments
- `POST /api/payments/:bookingId` - Record payment

### Inventory
- `GET /api/inventory` - List item
- `POST /api/inventory` - Tambah item
- `POST /api/inventory/:id/stock` - Tambah stock

### Resources (Kursi/Station)
- `GET /api/resources` - List resource
- `POST /api/resources` - Tambah resource

### Reports
- `GET /api/reports/dashboard` - Overview dashboard
- `GET /api/reports/revenue` - Laporan pendapatan
- `GET /api/reports/bookings` - Laporan booking

### Payroll
- `GET /api/payrolls` - List payroll
- `POST /api/payrolls` - Buat payroll
- `GET /api/payrolls/calculate/:barberId` - Hitung komisi

### Reviews
- `POST /api/reviews` - Buat review
- `GET /api/reviews` - List review

### Promos
- `GET /api/promos` - List promo
- `POST /api/promos/validate` - Validasi kode promo

### Settings
- `GET /api/settings` - Pengaturan bisnis
- `PATCH /api/settings` - Update pengaturan

## Data Login Default (dari seed)

- **Admin**: `admin@barber.com` / `admin123`
- **Barber**: `barber1@barber.com` / `barber123`
- **Barber**: `barber2@barber.com` / `barber123`

## Fitur Lengkap

- ✅ Booking & reservasi online
- ✅ Manajemen antrian real-time (cek ketersediaan barber/resource)
- ✅ Notifikasi (push/email/sms/whatsapp placeholder)
- ✅ Pembayaran DP / Full Payment (QRIS, Transfer, Cash, Wallet)
- ✅ Katalog barber & portfolio
- ✅ Review & rating
- ✅ Dashboard kalender terpusat
- ✅ Manajemen kursi & resource (tidak bentrok)
- ✅ Inventory / stock management (auto deduct saat booking selesai)
- ✅ Laporan & analitik bisnis
- ✅ Payroll & komisi barber
- ✅ CRM (data pelanggan, preferensi, riwayat)
- ✅ Loyalty points otomatis
- ✅ Promo & diskon
