from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products, transactions, dashboard

app = FastAPI(title="MongkolShop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(transactions.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "MongkolShop API is running"}