import { Item } from "@/models/Items";
import { NextResponse } from "next/server";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
        const changeStream = Item.watch();
        changeStream.on("change", (change) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(change)}\n\n`)
        );
      });

      changeStream.on("error", (err) => {
        console.error("ChangeStream error:", err);
        controller.close();
      });
       return () => {
        changeStream.close();
        controller.close();
      };
    },
    cancel() {
      console.log("SSE connection closed by client");
    },
  });
  

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}