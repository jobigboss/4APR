"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

function Activity01Page() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/customerAction");
        if (!res.ok) throw new Error(`Failed to fetch customers: ${res.statusText}`);
        
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleJoinActivity = async (id) => {
    try {
      const timestampNow = new Date().toISOString();
      const res = await fetch(`/api/action01/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activity1: true, timestamp_activity1: timestampNow }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || "Failed to update activity status");
      }

      setCustomers((prev) =>
        prev.map((cust) =>
          cust._id === id ? { ...cust, activity1: true, timestamp_activity1: timestampNow } : cust
        )
      );
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  const filteredCustomer = customers.filter((cust) =>
    [cust.firstName, cust.lastName, cust.phone].some(
      (field) => field && typeof field === "string" && field.includes(search)
    )
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 relative">
      <Link href="/" className="absolute top-2 left-2">
        <button className="bg-gray-600 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-700">
          กลับสู่เมนูหลัก
        </button>
      </Link>

      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-4">
        <h1 className="text-xl font-semibold text-center mb-4 text-gray-800">Activity 01</h1>

        <input
          type="text"
          placeholder="ค้นหาชื่อพนักงาน, บริษัท หรืออีเมล..."
          className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {loading && <div className="text-center py-2 text-sm">กำลังโหลดข้อมูล...</div>}
        {error && <div className="text-center text-red-500 py-2 text-sm">{error}</div>}

        <div className="overflow-x-auto rounded-md shadow-sm">
          <table className="min-w-full bg-white border-separate border-spacing-0 text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                {["ชื่อ", "นามสกุล", "เบอร์", "สถานะ", "เข้าร่วม", "เวลา"].map((header) => (
                  <th key={header} className="py-2 px-2 text-left">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredCustomer.map((cust, index) => (
                <tr key={cust._id || index} className="hover:bg-gray-50">
                  <td className="py-2 px-2">{cust.firstName}</td>
                  <td className="py-2 px-2">{cust.lastName}</td>
                  <td className="py-2 px-2">{cust.phone}</td>
                  <td className="py-2 px-2">
                    <span
                      className={`px-2 py-1 rounded-full text-white text-xs font-semibold ${cust.checkedIn ? "bg-green-500" : "bg-red-500"}`}
                    >
                      {cust.checkedIn ? "เช็คอินแล้ว" : "ยังไม่เช็คอิน"}
                    </span>
                  </td>
                  <td className="py-2 px-2">
                    {cust.checkedIn ? (
                      cust.activity1 ? (
                        <button className="bg-gray-400 text-white px-2 py-1 rounded-md text-xs cursor-not-allowed" disabled>
                          เข้าร่วมแล้ว
                        </button>
                      ) : (
                        <button
                          className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs hover:bg-blue-700"
                          onClick={() => handleJoinActivity(cust._id)}
                        >
                          เข้าร่วม
                        </button>
                      )
                    ) : (
                      <button className="text-gray-500 px-2 py-1 rounded-md text-xs cursor-not-allowed" disabled>
                        ต้องเช็คอินก่อน
                      </button>
                    )}
                  </td>
                  <td className="py-2 px-2">
                    {cust.timestamp_activity1
                      ? new Date(cust.timestamp_activity1).toLocaleString("th-TH", {
                          year: "2-digit",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
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
