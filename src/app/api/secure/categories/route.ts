import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const cookie = req.cookies.get("access_token")?.value;

    if (!cookie) {
        return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

      try {
        const res = await fetch("http://localhost:5249/api/v1/category", {
            headers: { "Authorization": `Bearer ${cookie}` },
        });

        if (!res.ok) {
        return NextResponse.json(
            { message: "Failed to fetch categories", status: res.status },
            { status: res.status }
        );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json(
        { message: "Server error", error: String(err) },
        { status: 500 }
        );
    }
}