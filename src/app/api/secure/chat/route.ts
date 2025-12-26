import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("userId");
  const pageSize = searchParams.get("pageSize") ?? "5";
  const pageNumber = searchParams.get("pageNumber") ?? "1";

  if (!userId) {
    return NextResponse.json(
      { message: "userId is required" },
      { status: 400 }
    );
  }

  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(
      `http://localhost:5249/api/v1/chat/user-room/${userId}?page-size=${pageSize}&page-number=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch chat room" },
        { status: res.status }
      );
    }

    const data = await res.json();
    console.log("Fetched chat room data:", data);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { message: "Could not fetch chat room" },
      { status: 500 }
    );
  }
}
