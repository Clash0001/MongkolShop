"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  stockQty: number;
  minStock: number;
  unit: string;
  barcode: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/products/")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">สินค้าทั้งหมด</h1>
      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">ชื่อสินค้า</th>
              <th className="border border-gray-300 p-2 text-right">ราคา</th>
              <th className="border border-gray-300 p-2 text-right">ต้นทุน</th>
              <th className="border border-gray-300 p-2 text-right">สต็อก</th>
              <th className="border border-gray-300 p-2 text-center">หน่วย</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className={p.stockQty <= p.minStock ? "bg-red-50" : ""}>
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2 text-right">{p.price}</td>
                <td className="border border-gray-300 p-2 text-right">{p.cost}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {p.stockQty <= p.minStock ? (
                    <span className="text-red-600 font-bold">{p.stockQty} ⚠️</span>
                  ) : (
                    p.stockQty
                  )}
                </td>
                <td className="border border-gray-300 p-2 text-center">{p.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}