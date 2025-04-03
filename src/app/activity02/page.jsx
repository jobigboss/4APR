"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Activity02Page() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // สำหรับจัดการข้อผิดพลาด

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null); // รีเซ็ตข้อผิดพลาดก่อนทำการดึงข้อมูลใหม่
      try {
        const res = await fetch("/api/customarAction2");

        // ถ้าไม่สำเร็จให้โยนข้อผิดพลาด
        if (!res.ok) {
          throw new Error(`Failed to fetch customers: ${res.statusText}`);
        }

        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        setError(error.message); // เก็บข้อความข้อผิดพลาด
      } finally {
        setLoading(false); // จบการโหลด
      }
    };

    fetchCustomers();
  }, []); // ดึงข้อมูลเมื่อโหลดคอมโพเนนต์ครั้งแรก

  const handleJoinActivity = async (id) => {
    try {
      console.log("Sending request to update activity for ID:", id);
  
      const timestampNow = new Date().toISOString();
      const res = await fetch(`/api/action02/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity2: true, timestamp_activity2: timestampNow }),
      });
  
      // ตรวจสอบการตอบกลับจากเซิร์ฟเวอร์
      const responseData = await res.json();
  
      if (res.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) =>
            cust._id === id
              ? { ...cust, activity2: true, timestamp_activity2: timestampNow }
              : cust
          )
        );
        console.log("Updated Customers:", customers);
      } else {
        // ตรวจสอบว่าค่าที่ได้รับจาก responseData ถูกต้องหรือไม่
        const errorMessage = responseData?.message || "Unknown error";
        console.error("Failed to update activity status:", errorMessage);
      }
    } catch (error) {
      console.error("Error during the request:", error);
    }
  };
  
  

  const filteredCustomer = customers.filter((cust) => {
    if (!search) return true;
    return (
      (cust.firstName && typeof cust.firstName === "string" && cust.firstName.includes(search)) ||
      (cust.lastName && typeof cust.lastName === "string" && cust.lastName.includes(search)) ||
      (cust.phone && typeof cust.phone === "string" && cust.phone.includes(search))
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            กลับสู่เมนูหลัก
          </button>
        </Link>
      </div>
      <div className="w-full max-w-5xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">Activity 02</h1>

        <input
          type="text"
          placeholder="ค้นหาชื่อพนักงาน, บริษัท หรืออีเมล..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* แสดงสถานะการโหลด */}
        {loading && <div className="text-center py-4">กำลังโหลดข้อมูล...</div>}

        {/* แสดงข้อผิดพลาดหากมี */}
        {error && <div className="text-center text-red-500 py-4">{error}</div>}

        <div className="overflow-x-auto rounded-lg shadow-lg mb-6">
          <table className="min-w-full bg-white border-separate border-spacing-0">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ชื่อ</th>
                <th className="py-3 px-4 text-left">นามสกุล</th>
                <th className="py-3 px-4 text-left">เบอร์โทรศัพท์</th>
                <th className="py-3 px-4 text-left">สถานะ</th>
                <th className="py-3 px-4 text-left">เข้าร่วมกิจกรรม</th>
                <th className="py-3 px-4 text-left">เวลาเข้าร่วมกิจกรรม</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomer.map((cust, index) => (
                <tr key={cust._id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-left">{cust.firstName}</td>
                  <td className="py-3 px-4 text-left">{cust.lastName}</td>
                  <td className="py-3 px-4 text-left">{cust.phone}</td>
                  <td className="py-3 px-4 text-left">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                        cust.checkedIn ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {cust.checkedIn ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-left">
                    {cust.checkedIn ? (
                      cust.activity2 === false ? (
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                          onClick={() => handleJoinActivity(cust._id)}
                        >
                          เข้าร่วมกิจกรรม
                        </button>
                      ) : (
                        <button
                          className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
                          disabled
                        >
                          เข้าร่วมกิจกรรมแล้ว
                        </button>
                      )
                    ) : (
                      <button className="text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed" disabled>
                        ต้องเช็คอินก่อน
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-left">
                    {cust.timestamp_activity2
                      ? (() => {
                          const date = new Date(cust.timestamp_activity2);
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const day = String(date.getDate()).padStart(2, "0");
                          const hours = String(date.getHours()).padStart(2, "0");
                          const minutes = String(date.getMinutes()).padStart(2, "0");
                          return `${year}-${month}-${day} ${hours}:${minutes}`;
                        })()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Activity02Page;
