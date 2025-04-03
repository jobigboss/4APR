"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Activity01Page() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      const res = await fetch("/api/customerAction");
      const data = await res.json();
      setCustomers(data);
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const handleJoinActivity = async (id) => {
    try {
      console.log("Sending request to update activity for ID:", id);

      const timestampNow = new Date().toISOString();
      const res = await fetch(`/api/action01/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity1: true, timestamp_activity1: timestampNow }),
      });

      const responseData = await res.json();
      console.log("Response Status:", res.status);
      console.log("Response Data:", responseData);

      if (res.ok) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((cust) =>
            cust._id === id
              ? { ...cust, activity1: true, timestamp_activity1: timestampNow }
              : cust
          )
        );
      } else {
        console.error("Failed to update activity status:", responseData);
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
          <button className="bg-gray-600 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 text-xs sm:px-4 sm:py-2 sm:text-sm">
            กลับสู่เมนูหลัก
          </button>
        </Link>
      </div>
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-xl p-4 sm:p-6">
        <h1 className="text-lg sm:text-2xl font-semibold text-center mb-4 sm:mb-6 text-gray-800">Activity 01</h1>

        <input
          type="text"
          placeholder="ค้นหาชื่อพนักงาน, บริษัท หรืออีเมล..."
          className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg mb-4 sm:mb-6 text-xs sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="overflow-x-auto rounded-lg shadow-lg mb-4 sm:mb-6">
          <table className="min-w-full w-full bg-white border-separate border-spacing-0">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">ชื่อ</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">นามสกุล</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">เบอร์โทรศัพท์</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">สถานะ</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">เข้าร่วมกิจกรรม</th>
                <th className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">เวลาเข้าร่วมกิจกรรม</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomer.map((cust, index) => (
                <tr key={cust._id || index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">{cust.firstName}</td>
                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">{cust.lastName}</td>
                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">{cust.phone}</td>
                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">
                    <span
                      className={`px-2 sm:px-3 py-1 sm:py-2 rounded-full text-white text-xs sm:text-sm font-semibold ${
                        cust.checkedIn ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {cust.checkedIn ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"}
                    </span>
                  </td>
                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">
                    {cust.checkedIn ? (
                      cust.activity1 === false ? (
                        <button
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition text-xs sm:text-sm"
                          onClick={() => handleJoinActivity(cust._id)}
                        >
                          เข้าร่วมกิจกรรม
                        </button>
                      ) : (
                        <button
                          className="bg-gray-400 text-white px-3 py-1.5 rounded-lg cursor-not-allowed text-xs sm:text-sm"
                          disabled
                        >
                          เข้าร่วมกิจกรรมแล้ว
                        </button>
                      )
                    ) : (
                      <button className="text-gray-500 px-3 py-1.5 rounded-lg cursor-not-allowed text-xs sm:text-sm" disabled>
                        ต้องเช็คอินก่อน
                      </button>
                    )}
                  </td>

                  <td className="py-1.5 sm:py-2 px-2 sm:px-4 text-left text-xs sm:text-sm">
                    {cust.timestamp_activity1
                      ? (() => {
                          const date = new Date(cust.timestamp_activity1);
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

export default Activity01Page;
