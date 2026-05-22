from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import uuid

def gen_id():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = "Product"

    id         = Column(String, primary_key=True, default=gen_id)
    name       = Column(String, nullable=False)
    barcode    = Column(String, unique=True, nullable=True)
    price      = Column(Float, nullable=False)
    cost       = Column(Float, nullable=False)
    stockQty   = Column(Integer, default=0)
    minStock   = Column(Integer, default=5)
    unit       = Column(String, default="ชิ้น")
    image      = Column(String, nullable=True)
    categoryId = Column(String, ForeignKey("Category.id"), nullable=True)
    createdAt  = Column(DateTime, server_default=func.now())
    updatedAt  = Column(DateTime, nullable=True, onupdate=func.now())

    category   = relationship("Category", back_populates="products")

class Category(Base):
    __tablename__ = "Category"

    id       = Column(String, primary_key=True, default=gen_id)
    name     = Column(String, nullable=False)

    products = relationship("Product", back_populates="category")