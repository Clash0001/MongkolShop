from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Product, Transaction, TransItem

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/")
def get_dashboard(db: Session = Depends(get_db)):
    # ยอดขายวันนี้
    from datetime import datetime, date
    today = date.today()
    today_sales = db.query(func.sum(Transaction.total)).filter(
        func.date(Transaction.createdAt) == today
    ).scalar() or 0

    # จำนวนบิลวันนี้
    today_orders = db.query(func.count(Transaction.id)).filter(
        func.date(Transaction.createdAt) == today
    ).scalar() or 0

    # สินค้าใกล้หมด
    low_stock = db.query(Product).filter(
        Product.stockQty <= Product.minStock
    ).all()

    # สินค้าทั้งหมด
    total_products = db.query(func.count(Product.id)).scalar() or 0

    return {
        "todaySales": today_sales,
        "todayOrders": today_orders,
        "totalProducts": total_products,
        "lowStock": [
            {
                "id": p.id,
                "name": p.name,
                "stockQty": p.stockQty,
                "minStock": p.minStock,
                "unit": p.unit,
            }
            for p in low_stock
        ],
    }