import { connectMongDB } from "../../../../../lib/mongodb"; // เชื่อมต่อกับฐานข้อมูล MongoDB
import Customer from "../../../../../models/customer"; // โมเดล MongoDB
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;  // ใช้ await กับ params เพื่อดึง id ออกมา
    await connectMongDB(); // เชื่อมต่อกับฐานข้อมูล MongoDB

    const { activity1 } = await req.json(); // รับข้อมูลจาก body ของคำขอ PATCH

    if (typeof activity1 !== "boolean") {
      // ถ้า activity1 ไม่ใช่ boolean จะส่งข้อความแสดงข้อผิดพลาดกลับไป
      return NextResponse.json({ message: "'activity1' ต้องเป็น boolean" }, { status: 400 });
    }

    // ค้นหาลูกค้าจากฐานข้อมูลตาม id ที่ได้รับ
    const customer = await Customer.findById(id);
    if (!customer) {
      // ถ้าหาลูกค้าไม่พบ ให้ส่งข้อผิดพลาดกลับไป
      return NextResponse.json({ message: "ไม่พบข้อมูลลูกค้า" }, { status: 404 });
    }

    // อัพเดทข้อมูลของลูกค้า
    customer.activity1 = activity1;
    if (activity1) {
      // ถ้าค่าของ activity1 เป็น true ให้บันทึกเวลาปัจจุบันลงใน timestamp_activity1
      const now = new Date();
      customer.timestamp_activity1 = now.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(",", ""); // เอาเครื่องหมาย , ออกให้เหลือแค่ช่องว่าง
    }

    // บันทึกข้อมูลลูกค้าใหม่
    await customer.save();

    // ส่งข้อมูลลูกค้ากลับไปพร้อมกับ status 200
    return NextResponse.json({ _id: customer._id, checkedIn: customer.checkedIn }, { status: 200 });
  } catch (error) {
    // ถ้ามีข้อผิดพลาดในขั้นตอนต่าง ๆ ให้ส่งข้อผิดพลาดกลับไป
    console.error("ข้อผิดพลาดในการอัพเดทข้อมูลลูกค้า:", error);  // ล็อกข้อความข้อผิดพลาดในเซิร์ฟเวอร์
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในการอัพเดทข้อมูลลูกค้า", error: error.message }, { status: 500 });
  }
}
