import { connectToDatabase } from "@/lib/mongodb";
import Todo from "@/models/todo";
import { NextRequest, NextResponse } from "next/server";


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


export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, description, status, duedate } = data;

  if (!name || !description || status == undefined || !duedate) {
    return NextResponse.json({
      status: 404,
      message: "Missing body require"
    });
  }

  const newTodo = new Todo(data);
  await newTodo.save();

  console.log(newTodo);

  return NextResponse.json({
    status: 200,
    message: "Added"
  })
}


export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  if (!id) {
    return NextResponse.json({
      status: 404,
      message: "Todo ID is required",
    });
  }
  try {
    await connectToDatabase();
    const todoToDelete = await Todo.findByIdAndDelete(id);

    if (!todoToDelete) {
      return NextResponse.json({
        status: 404,
        message: "Todo not found",
      });
    }
    return NextResponse.json({
      status: 200,
      message: "Todo deleted successfully",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Error deleting todo",
      error: err,
    });
  }
}

// Update Status  //
export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();

  if (!id || status === undefined) {
    return NextResponse.json({
      status: 404,
      message: "Todo ID and status are required",
    });
  }

  try {
    await connectToDatabase();
    const todoToUpdate = await Todo.findById(id);

    if (!todoToUpdate) {
      return NextResponse.json({
        status: 404,
        message: "Todo not found",
      });
    }

    todoToUpdate.status = status;
    await todoToUpdate.save();

    return NextResponse.json({
      status: 200,
      message: "Status updated successfully",
    });
  } catch (err) {
    return NextResponse.json({
      status: 500,
      message: "Error updating status",
      error: err,
    });
  }
}



