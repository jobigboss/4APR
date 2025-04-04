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
    if (!search) return true;
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
      const updatedData = { checkedIn: true, timestamp_checkin: new Date() };

      const res = await fetch(`/api/checkin/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const fetchData = await fetch("/api/customer");
        const data = await fetchData.json();
        setCustomers(data);
      } else {
        alert(`ไม่สามารถเช็คอินได้`);
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเช็คอิน");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-6">
      {/* ปุ่มกลับไปหน้าหลัก */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-xs sm:text-sm">
            กลับสู่เมนูหลัก
          </button>
        </Link>
      </div>

      {/* กล่องเช็คอิน */}
      <div className="w-full max-w-6xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-center mb-4">เช็คอินเข้างาน</h1>

        {/* ช่องค้นหา */}
        <input
          type="text"
          placeholder="ค้นหาชื่อพนักงาน, บริษัท หรืออีเมล..."
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm sm:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* แสดงข้อมูล */}
        {loading ? (
          <div className="text-center text-gray-500 py-4 text-sm sm:text-base">กำลังโหลดข้อมูล...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base">Seat_No</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base">ชื่อ</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base">นามสกุล</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base hidden sm:table-cell">บริษัท</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base hidden md:table-cell">เบอร์โทร</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base hidden lg:table-cell">อีเมล</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base text-center">สถานะ</th>
                  <th className="py-3 px-4 text-xs sm:text-sm md:text-base text-center">เช็คอิน</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomer.map((cust) => (
                  <tr key={cust._id} className={`border-b ${cust.checkedIn ? "bg-green-100" : "bg-white"}`}>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base">{cust.Seat_No}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base">{cust.firstName}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base">{cust.lastName}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base hidden sm:table-cell">{cust.company}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base hidden md:table-cell">{cust.phone}</td>
                    <td className="py-3 px-4 text-xs sm:text-sm md:text-base hidden lg:table-cell">{cust.email}</td>
                    <td className="py-3 px-4 text-center text-xs sm:text-sm md:text-base">
                      {cust.checkedIn ? <span className="text-green-600 font-semibold">เช็คอินแล้ว</span> : <span className="text-gray-500">รอเช็คอิน</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {!cust.checkedIn && (
                        <button
                          onClick={() => handleCheckIn(cust._id)}
                          className="bg-blue-500 text-white text-xs sm:text-sm md:text-base px-3 py-1 rounded-lg hover:bg-blue-600"
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
