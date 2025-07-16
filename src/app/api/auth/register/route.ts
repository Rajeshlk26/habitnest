import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { createToken } from "@/utils/createToken";
import { hashPassword } from "@/utils/hashPassword";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📦 Received body:", body);

    const { username, email, password } = body;
    if (!username || !email || !password)
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );

    await connectDB();

    //uniqueness check
    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json(
        { error: "Emaol already registered" },
        { status: 409 }
      );

    //hash & create user
    const hashed = await hashPassword(password);
    const newUser = await User.create({ username, email, password: hashed });

    //Sign JWT
    const token = createToken(newUser._id.toString());

    //Return safe payload
    return NextResponse.json(
      {
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
  console.error("❌ Register error:", err);
  if (err.name === "ValidationError") {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

}
