"use client";
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';

// กำหนดสีสำหรับ "เช็คอินแล้ว" และ "ยังไม่เช็คอิน"
const CHECKED_IN_COLOR = "#00C49F";
const NOT_CHECKED_IN_COLOR = "#808080";

// ฟังก์ชัน custom label เพื่อแสดงเฉพาะตัวเลขภายในวงกลม
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={16}
    >
      {value}
    </text>
  );
};

// คอมโพเนนต์สำหรับการ์ดที่มี Pie Chart และ Legend อยู่ในกรอบเดียวกัน (300x300px)
const PieChartSection = ({ title, data }) => (
  <div className="bg-white shadow-lg rounded-xl p-4 w-[300px] h-[300px] flex flex-col items-center justify-between">
    {/* หัวข้อที่อยู่ในกรอบเดียวกับเนื้อหาภายใน */}
    <h3 className="text-center mb-2" style={{ fontSize: '16px' }}>{title}</h3>
    <div className="flex flex-1 w-full">
      {/* ส่วนสำหรับกราฟ */}
      <div className="flex items-center justify-center" style={{ width: '60%' }}>
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.name === "ยังไม่เช็คอิน" ? NOT_CHECKED_IN_COLOR : CHECKED_IN_COLOR}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
      {/* ส่วนสำหรับ Legend คำอธิบาย */}
      <div className="flex flex-col justify-center" style={{ width: '40%' }}>
        <p className="flex items-center text-sm" style={{ fontSize: '16px' }}>
          <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: CHECKED_IN_COLOR }}></span>
          เช็คอินแล้ว
        </p>
        <p className="flex items-center text-sm mt-2" style={{ fontSize: '16px' }}>
          <span className="inline-block w-3 h-3 mr-2" style={{ backgroundColor: NOT_CHECKED_IN_COLOR }}></span>
          ยังไม่เช็คอิน
        </p>
      </div>
    </div>
  </div>
);

function ReportPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  // ดึงข้อมูลจาก API เมื่อคอมโพเนนต์ mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/attendee');
        if (!res.ok) {
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }
        const fetchedData = await res.json();
        console.log('Fetched Data:', fetchedData);
        if (Array.isArray(fetchedData)) {
          setData(fetchedData);
        } else if (fetchedData.attendees) {
          setData(fetchedData.attendees);
        } else {
          throw new Error('Data structure is incorrect or empty');
        }
      } catch (error) {
        console.error('Error fetching attendees:', error);
        setError('เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  if (!data || data.length === 0) {
    return <div>กำลังโหลดข้อมูล...</div>;
  }

  // คำนวณจำนวนเช็คอินและยังไม่เช็คอิน
  const checkedInCount = data.filter((item) => item.checkedIn).length;
  const notCheckedInCount = data.filter((item) => !item.checkedIn).length;

  console.log("เช็คอินแล้ว:", checkedInCount);
  console.log("ยังไม่เช็คอิน:", notCheckedInCount);

  const pieData = [
    { name: 'เช็คอินแล้ว', value: checkedInCount },
    { name: 'ยังไม่เช็คอิน', value: notCheckedInCount },
  ];

  return (
    <div className="p-6 flex items-center justify-center">
      <div>
        <PieChartSection title="รายงานการเช็คอิน" data={pieData} />
      </div>
    </div>
  );
}

export default ReportPage;
