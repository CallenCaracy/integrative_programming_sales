import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ productId: string }> }
) {
  const token = req.cookies.get("access_token")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  }

  const { productId } = await context.params;

  try {
    const backendUrl = `http://localhost:5249/api/v1/products/${productId}`;

    const res = await fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch product", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error in /api/secure/products/[productId]:", err);
    return NextResponse.json(
      { message: "Server error", error: String(err) },
      { status: 500 }
    );
  }
}
