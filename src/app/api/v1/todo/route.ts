import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const todoResult = await Todo.find({});
    return NextResponse.json({ data: todoResult });
  } catch (err) {
    return NextResponse.json({
      error: err,
    });
  }
}
