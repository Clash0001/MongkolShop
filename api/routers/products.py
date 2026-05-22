from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Product
import uuid

router = APIRouter(prefix="/products", tags=["Products"])

# Schema
class ProductCreate(BaseModel):
    name: str
    barcode: Optional[str] = None
    price: float
    cost: float
    stockQty: int = 0
    minStock: int = 5
    unit: str = "ชิ้น"
    image: Optional[str] = None
    categoryId: Optional[str] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    barcode: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    minStock: Optional[int] = None
    unit: Optional[str] = None
    image: Optional[str] = None
    categoryId: Optional[str] = None

# Endpoints
@router.get("/")
def get_products(db: Session = Depends(get_db)):
    return db.query(Product).all()

@router.post("/")
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    product = Product(id=str(uuid.uuid4()), **data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.put("/{id}")
def update_product(id: str, data: ProductUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    for key, value in data.model_dump(exclude_none=True).items():
        setattr(product, key, value)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{id}")
def delete_product(id: str, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Deleted successfully"}