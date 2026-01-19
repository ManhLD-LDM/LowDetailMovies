# Hướng dẫn chạy Backend + Frontend để share

## Cách hoạt động
- Frontend (port 3000) sẽ proxy tất cả requests `/api/*` đến Backend (port 5000)
- Bạn chỉ cần share Frontend qua Ngrok, Backend sẽ tự động hoạt động thông qua proxy

## Bước 1: Chạy Backend (Terminal 1)

```bash
cd backend
npm install
npm start
```

Backend sẽ chạy tại: `http://localhost:5000`

## Bước 2: Chạy Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

## Bước 3: Share với Ngrok (Terminal 3 - Optional)

```bash
# Share frontend qua Ngrok
ngrok http 3000
```

Ngrok sẽ tạo URL dạng: `https://abc-def-ghi.ngrok-free.app`

cloudflared tunnel --config config.yml run

## Bước 4: Test

### Local test:
- Mở: `http://localhost:3000`
- API sẽ tự động proxy đến `http://localhost:5000/api`

### Share với bạn:
- Gửi URL Ngrok cho bạn: `https://abc-def-ghi.ngrok-free.app`
- Bạn của bạn truy cập URL này
- Frontend sẽ load, và API requests sẽ tự động proxy qua Ngrok đến backend local của bạn

## Lưu ý quan trọng

✅ **Đúng:** Chỉ cần share 1 port frontend (3000) qua Ngrok
✅ Backend chạy local ở port 5000, không cần expose
✅ Vite proxy sẽ tự động chuyển `/api/*` requests từ frontend đến backend

## Troubleshooting

### Nếu API không hoạt động:
1. Kiểm tra backend đang chạy: `http://localhost:5000`
2. Test API trực tiếp: `http://localhost:5000/api/auth/me` (hoặc endpoint khác)
3. Kiểm tra console trong frontend xem có lỗi CORS không
4. Restart cả frontend và backend

### Nếu Ngrok báo lỗi:
- Đảm bảo chỉ chạy 1 Ngrok instance (kill các process cũ)
- Sử dụng: `ngrok http 3000 --region=ap` (Asia Pacific region)

## Cấu trúc

```
Frontend (Port 3000) → Ngrok → Internet
    ↓ (proxy /api/*)
Backend (Port 5000) → MongoDB
```

Bạn bè của bạn truy cập Ngrok URL → Frontend serve → API calls được proxy đến backend local
