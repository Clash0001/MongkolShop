from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models import Product, Transaction, TransItem, StockLog
import uuid
from datetime import datetime

router = APIRouter(prefix="/transactions", tags=["Transactions"])

class CartItem(BaseModel):
    productId: str
    qty: int
    priceAtSale: float

class TransactionCreate(BaseModel):
    items: List[CartItem]
    paid: float
    customerId: Optional[str] = None

@router.post("/")
def create_transaction(data: TransactionCreate, db: Session = Depends(get_db)):
    # เช็คสต็อกก่อน
    for item in data.items:
        product = db.query(Product).filter(Product.id == item.productId).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.productId} not found")
        if product.stockQty < item.qty:
            raise HTTPException(status_code=400, detail=f"สินค้า {product.name} สต็อกไม่พอ")

    # คำนวณยอดรวม
    total = sum(item.qty * item.priceAtSale for item in data.items)

    # สร้าง transaction
    transaction = Transaction(
        id=str(uuid.uuid4()),
        total=total,
        paid=data.paid,
        customerId=data.customerId,
    )
    db.add(transaction)

    # สร้าง items และลด stock
    for item in data.items:
        product = db.query(Product).filter(Product.id == item.productId).first()

        trans_item = TransItem(
            id=str(uuid.uuid4()),
            transactionId=transaction.id,
            productId=item.productId,
            qty=item.qty,
            priceAtSale=item.priceAtSale,
        )
        db.add(trans_item)

        # ลด stock
        product.stockQty -= item.qty

        # บันทึก stock log
        log = StockLog(
            id=str(uuid.uuid4()),
            productId=item.productId,
            changeQty=-item.qty,
            reason=f"ขาย transaction {transaction.id[:8]}",
        )
        db.add(log)

    db.commit()
    db.refresh(transaction)
    return {"id": transaction.id, "total": total, "paid": data.paid, "change": data.paid - total}