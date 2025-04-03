"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

function CheckinPage() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await fetch("/api/customer");
      const data = await res.json();
      setCustomers(data);
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const filteredCustomer = customers.filter((cust) => {
    if (!search) return true; // ถ้าไม่มีการค้นหาให้แสดงทั้งหมด

    // ตรวจสอบว่า field มีค่าที่ไม่เป็น undefined, null หรือไม่ใช่ string
    return (
      (cust.firstName && typeof cust.firstName === "string" && cust.firstName.includes(search)) ||
      (cust.lastName && typeof cust.lastName === "string" && cust.lastName.includes(search)) ||
      (cust.company && typeof cust.company === "string" && cust.company.includes(search)) ||
      (cust.phone && typeof cust.phone === "string" && cust.phone.includes(search)) ||
      (cust.email && typeof cust.email === "string" && cust.email.includes(search))
    );
  });

  const handleCheckIn = async (id) => {
    try {
      const currentDate = new Date();
  
      // Ensure only valid date values are passed
      const updatedData = {
        checkedIn: true,
        timestamp_checkin: currentDate,  // Use a valid date for checkin
        timestamp_activity1: null,       // Or set to currentDate if needed
        timestamp_activity2: null        // Or set to currentDate if needed
      };
  
      const res = await fetch(`/api/checkin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (res.ok) {
        const fetchData = await fetch("/api/customer");
        const data = await fetchData.json();
        setCustomers(data);
      } else {
        const errorMessage = await res.json();
        console.error(`ไม่สามารถเช็คอินได้: ${errorMessage.message}`);
        alert(`ไม่สามารถเช็คอินได้: ${errorMessage.message}`);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเช็คอิน", error);
      alert("เกิดข้อผิดพลาดในการเช็คอิน");
    }
  };
  
  
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6 relative">
      <div className="absolute top-4 left-4">
        <Link href="/">
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
            กลับสู่เมนูหลัก
          </button>
        </Link>
      </div>

      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6 flex flex-col">
        <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">เช็คอินเข้างาน</h1>

        <input
          type="text"
          placeholder="ค้นหาชื่อพนักงาน, บริษัท หรืออีเมล..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading ? (
          <div className="text-center text-gray-500 py-4">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="overflow-x-auto rounded-lg shadow-lg mb-6 flex-1">
            <table className="min-w-full bg-white border-separate border-spacing-0">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">ชื่อ</th>
                  <th className="py-3 px-4 text-left">นามสกุล</th>
                  <th className="py-3 px-4 text-left">บริษัท</th>
                  <th className="py-3 px-4 text-left">เบอร์โทรศัพท์</th>
                  <th className="py-3 px-4 text-left">อีเมล</th>
                  <th className="py-3 px-4">สถานะ</th>
                  <th className="py-3 px-4">เช็คอิน</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomer.map((cust) => (
                  <tr key={cust._id} className={`${cust.checkedIn ? "bg-green-100" : "bg-white"}`}>
                    <td className="py-3 px-4 text-left">{cust.firstName}</td>
                    <td className="py-3 px-4 text-left">{cust.lastName}</td>
                    <td className="py-3 px-4 text-left">{cust.company}</td>
                    <td className="py-3 px-4 text-left">{cust.phone}</td>
                    <td className="py-3 px-4 text-left">{cust.email}</td>
                    <td className="py-3 px-4 text-center">
                      {cust.checkedIn ? (
                        <span className="text-green-600 font-semibold">เช็คอินแล้ว</span>
                      ) : (
                        <span className="text-gray-500">รอเช็คอิน</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!cust.checkedIn && (
                        <button
                        onClick={() => handleCheckIn(cust._id)}
                        className="bg-blue-500 text-white text-sm px-3 py-1 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        เช็คอิน
                      </button>
                      
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckinPage;
