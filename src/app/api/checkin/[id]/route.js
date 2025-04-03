import { connectMongDB } from "../../../../../lib/mongodb"; // เชื่อมต่อกับฐานข้อมูล MongoDB
import Customer from "../../../../../models/customer"; // โมเดล MongoDB
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    // Destructure the id from params directly (no need for await)
    const { id } = params;

    // Connect to MongoDB
    await connectMongDB();

    // Get the data from the request body
    const { checkedIn } = await req.json();

    // Check if the checkedIn value is a boolean
    if (typeof checkedIn !== "boolean") {
      return NextResponse.json({ message: "'checkedIn' must be a boolean" }, { status: 400 });
    }

    // Find the customer by ID
    const customer = await Customer.findById(id);
    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    // Update the checkedIn field and timestamp_checkin
    customer.checkedIn = checkedIn;
    if (checkedIn) {
      const now = new Date();
      customer.timestamp_checkin = now;
    } else {
      customer.timestamp_checkin = null; // Set timestamp_checkin to null when not checked in
    }

    // Handle timestamp_activity1 and timestamp_activity2, set them to null if undefined
    customer.timestamp_activity1 = customer.timestamp_activity1 || null;
    customer.timestamp_activity2 = customer.timestamp_activity2 || null;

    // Save the updated customer data to the database
    await customer.save();

    // Respond with the updated customer data
    return NextResponse.json({ _id: customer._id, checkedIn: customer.checkedIn }, { status: 200 });

  } catch (error) {
    // Log the error details for debugging purposes
    console.error("Error updating customer:", error.message);
    console.error("Stack trace:", error.stack);

    // Return a 500 response with the error message
    return NextResponse.json({ message: "Error updating customer", error: error.message }, { status: 500 });
  }
}
