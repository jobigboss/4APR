import { connectMongDB } from "../../../../lib/mongodb"; // เชื่อมต่อฐานข้อมูล
import Customer from "../../../../models/customer"; // โมเดล MongoDB
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectMongDB(); // เชื่อมต่อฐานข้อมูล
    const customers = await Customer.find({}).sort({ id: 1 }) ; // ดึงข้อมูลจาก collection customer
    console.log("Fetched customers:", customers); // ตรวจสอบข้อมูลที่ดึงมาจาก MongoDB
    return NextResponse.json(customers); // ส่งข้อมูล JSON กลับ
  } catch (error) {
    console.error("Error fetching customers:", error); // ข้อผิดพลาดในการดึงข้อมูล
    return NextResponse.json({ message: "Error fetching customers", error }, { status: 500 });
  }
}
