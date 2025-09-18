 
import RegisterInstructor from "@/app/actions/auth/RegisterInstructor";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const payload = await req.json();
    const result = await RegisterInstructor(payload);
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
