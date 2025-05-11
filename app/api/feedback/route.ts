import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb/connection";
import { Feedback } from "@/lib/mongodb/models/feedback";

export async function POST(req: NextRequest) {
  try {
    const { message, email } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Pesan feedback tidak boleh kosong" }, { status: 400 });
    }

    await connectToDatabase();

    await Feedback.create({ message, email });

    return NextResponse.json({ message: "Terima kasih atas masukan Anda!" }, { status: 201 });
  } catch (error) {
    console.error("Feedback error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengirim feedback" }, { status: 500 });
  }
}