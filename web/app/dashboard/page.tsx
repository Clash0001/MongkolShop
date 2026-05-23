"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  todaySales: number;
  todayOrders: number;
  totalProducts: number;
  lowStock: {
    id: string;
    name: string;
    stockQty: number;
    minStock: number;
    unit: string;
  }[];
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/dashboard/")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <div className="p-8">กำลังโหลด...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* การ์ดสรุป */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500 mb-1">ยอดขายวันนี้</div>
          <div className="text-3xl font-bold text-blue-600">{data.todaySales} บาท</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500 mb-1">จำนวนบิลวันนี้</div>
          <div className="text-3xl font-bold text-green-600">{data.todayOrders} บิล</div>
        </div>
        <div className="border rounded p-4">
          <div className="text-sm text-gray-500 mb-1">สินค้าทั้งหมด</div>
          <div className="text-3xl font-bold">{data.totalProducts} รายการ</div>
        </div>
      </div>

      {/* สินค้าใกล้หมด */}
      <div>
        <h2 className="text-lg font-bold mb-3 text-red-600">⚠️ สินค้าใกล้หมด</h2>
        {data.lowStock.length === 0 ? (
          <p className="text-gray-500">ไม่มีสินค้าใกล้หมด</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-red-50">
                <th className="border border-gray-300 p-2 text-left">ชื่อสินค้า</th>
                <th className="border border-gray-300 p-2 text-right">คงเหลือ</th>
                <th className="border border-gray-300 p-2 text-right">ขั้นต่ำ</th>
              </tr>
            </thead>
            <tbody>
              {data.lowStock.map((p) => (
                <tr key={p.id} className="bg-red-50">
                  <td className="border border-gray-300 p-2">{p.name}</td>
                  <td className="border border-gray-300 p-2 text-right text-red-600 font-bold">
                    {p.stockQty} {p.unit}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">{p.minStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ลิงก์ด่วน */}
      <div className="mt-8 flex gap-3">
        <a href="/products" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          จัดการสินค้า
        </a>
        <a href="/cashier" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
          หน้าแคชเชียร์
        </a>
      </div>
    </div>
  );
}