# MongkolShop

## ดูโครงสร้าง Database

เปิด Prisma Studio เพื่อดูตารางและข้อมูลทั้งหมดผ่าน GUI

```bash
cd web
npx prisma studio
```

จะเปิดหน้าต่าง browser ที่ `http://localhost:51212` อัตโนมัติ

## รัน API (Backend)

```bash
cd api
venv\Scripts\activate
uvicorn main:app --reload
```

API จะรันที่ `http://localhost:8000`  
ดู API docs ได้ที่ `http://localhost:8000/docs`