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
    transItems = relationship("TransItem", back_populates="product")
    stockLogs  = relationship("StockLog", back_populates="product")

    category   = relationship("Category", back_populates="products")

class Category(Base):
    __tablename__ = "Category"

    id       = Column(String, primary_key=True, default=gen_id)
    name     = Column(String, nullable=False)

    products = relationship("Product", back_populates="category")

class Customer(Base):
    __tablename__ = "Customer"

    id            = Column(String, primary_key=True, default=gen_id)
    name          = Column(String, nullable=False)
    phone         = Column(String, nullable=True)
    creditBalance = Column(Float, default=0)
    createdAt     = Column(DateTime, server_default=func.now())

    transactions  = relationship("Transaction", back_populates="customer")

class Transaction(Base):
    __tablename__ = "Transaction"

    id         = Column(String, primary_key=True, default=gen_id)
    customerId = Column(String, ForeignKey("Customer.id"), nullable=True)
    total      = Column(Float, nullable=False)
    paid       = Column(Float, nullable=False)
    createdAt  = Column(DateTime, server_default=func.now())

    customer   = relationship("Customer", back_populates="transactions")
    items      = relationship("TransItem", back_populates="transaction")

class TransItem(Base):
    __tablename__ = "TransItem"

    id            = Column(String, primary_key=True, default=gen_id)
    transactionId = Column(String, ForeignKey("Transaction.id"), nullable=False)
    productId     = Column(String, ForeignKey("Product.id"), nullable=False)
    qty           = Column(Integer, nullable=False)
    priceAtSale   = Column(Float, nullable=False)

    transaction   = relationship("Transaction", back_populates="items")
    product       = relationship("Product", back_populates="transItems")

class StockLog(Base):
    __tablename__ = "StockLog"

    id        = Column(String, primary_key=True, default=gen_id)
    productId = Column(String, ForeignKey("Product.id"), nullable=False)
    changeQty = Column(Integer, nullable=False)
    reason    = Column(String, nullable=False)
    createdAt = Column(DateTime, server_default=func.now())

    product   = relationship("Product", back_populates="stockLogs")