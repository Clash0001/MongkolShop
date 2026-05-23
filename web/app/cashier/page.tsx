"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  stockQty: number;
  unit: string;
  barcode: string | null;
};

type CartItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export default function CashierPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paid, setPaid] = useState("");
  const [done, setDone] = useState<null | { total: number; change: number }>(null);

  useEffect(() => {
    fetch("http://localhost:8000/products/")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: product.price, qty: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const change = parseFloat(paid) - total;

  const handleCheckout = async () => {
    const res = await fetch("http://localhost:8000/transactions/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({
          productId: i.productId,
          qty: i.qty,
          priceAtSale: i.price,
        })),
        paid: parseFloat(paid),
      }),
    });
    const data = await res.json();
    setDone({ total: data.total, change: data.change });
    setCart([]);
    setPaid("");
  };

  if (done) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">✓ ชำระเงินสำเร็จ</h1>
        <p className="text-xl mb-2">ยอดรวม: {done.total} บาท</p>
        <p className="text-xl mb-6">เงินทอน: {done.change} บาท</p>
        <button onClick={() => setDone(null)}
          className="bg-blue-600 text-white px-6 py-3 rounded text-lg">
          รายการถัดไป
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 flex gap-4 h-screen">
      {/* สินค้า */}
      <div className="flex-1">
        <h2 className="text-xl font-bold mb-4">สินค้า</h2>
        <div className="grid grid-cols-3 gap-3">
          {products.map((p) => (
            <button key={p.id} onClick={() => addToCart(p)}
              disabled={p.stockQty === 0}
              className="border rounded p-3 text-left hover:bg-blue-50 disabled:opacity-40">
              <div className="font-medium">{p.name}</div>
              <div className="text-blue-600">{p.price} บาท</div>
              <div className="text-sm text-gray-500">คงเหลือ {p.stockQty} {p.unit}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ตะกร้า */}
      <div className="w-80 flex flex-col border-l pl-4">
        <h2 className="text-xl font-bold mb-4">รายการ</h2>
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 && <p className="text-gray-400">ยังไม่มีสินค้า</p>}
          {cart.map((item) => (
            <div key={item.productId} className="flex justify-between items-center mb-2 border-b pb-2">
              <div>
                <div>{item.name}</div>
                <div className="text-sm text-gray-500">{item.price} x {item.qty}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{item.price * item.qty}</span>
                <button onClick={() => removeFromCart(item.productId)}
                  className="text-red-500 text-sm">ลบ</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between text-xl font-bold mb-3">
            <span>รวม</span>
            <span>{total} บาท</span>
          </div>
          <input
            type="number"
            placeholder="รับเงินมา"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
            className="w-full border rounded p-2 mb-2 text-lg"
          />
          {paid && parseFloat(paid) >= total && (
            <div className="text-green-600 mb-2">เงินทอน: {change.toFixed(2)} บาท</div>
          )}
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || !paid || parseFloat(paid) < total}
            className="w-full bg-green-600 text-white py-3 rounded text-lg font-bold disabled:opacity-40">
            ชำระเงิน
          </button>
        </div>
      </div>
    </div>
  );
}