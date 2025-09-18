// pages/api/my-bookings/[id].js
import { authOptions } from "@/lib/authOptions";
import { collectionNamesObj, dbConnect } from "@/lib/dbconnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;

    const { id } =await params;
    const bookingCollection =await dbConnect(collectionNamesObj.bookingCollection);

    const booking = await bookingCollection.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Validate that the booking belongs to the logged-in user
    if (booking.email !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PATCH = async (req, { params }) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userEmail = session.user.email;

    const { id } =await params;
    const body = await req.json();
    const bookingCollection = await dbConnect(collectionNamesObj.bookingCollection);

    const booking = await bookingCollection.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Validate ownership
    if (booking.email !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData = {};
    if (body.phone !== undefined) updateData.phone = body.phone;
    if (body.paymentMethod !== undefined) updateData.paymentMethod = body.paymentMethod;

    const result = await bookingCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ message: "Booking updated successfully" });
    } else {
      return NextResponse.json({ message: "No changes made" });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
