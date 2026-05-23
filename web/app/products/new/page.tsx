"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    barcode: "",
    price: "",
    cost: "",
    stockQty: "",
    minStock: "5",
    unit: "ชิ้น",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    await fetch("http://localhost:8000/products/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        barcode: form.barcode || null,
        price: parseFloat(form.price),
        cost: parseFloat(form.cost),
        stockQty: parseInt(form.stockQty) || 0,
        minStock: parseInt(form.minStock) || 5,
        unit: form.unit,
      }),
    });
    setLoading(false);
    router.push("/products");
  };

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6">เพิ่มสินค้า</h1>

      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">ชื่อสินค้า *</label>
          <input name="name" value={form.name} onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">บาร์โค้ด</label>
          <input name="barcode" value={form.barcode} onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">ราคาขาย *</label>
            <input name="price" type="number" value={form.price} onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">ต้นทุน *</label>
            <input name="cost" type="number" value={form.cost} onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">จำนวนเริ่มต้น</label>
            <input name="stockQty" type="number" value={form.stockQty} onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">แจ้งเตือนเมื่อเหลือ</label>
            <input name="minStock" type="number" value={form.minStock} onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">หน่วย</label>
          <input name="unit" value={form.unit} onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2" />
        </div>

        <div className="flex gap-3 mt-2">
          <button onClick={handleSubmit} disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          <button onClick={() => router.push("/products")}
            className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}