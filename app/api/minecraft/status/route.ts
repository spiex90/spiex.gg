import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  const host = "play.spiex.gg";
  const port = 25606;

  try {
    // mcsrvstat.us is simple + free for status checks
    const res = await fetch(`https://api.mcsrvstat.us/2/${host}:${port}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { online: false, error: "status_fetch_failed" },
        { status: 200 }
      );
    }

    const data = await res.json();

    return NextResponse.json(
      {
        online: Boolean(data?.online),
        host,
        port,
        ip: data?.ip,
        version: data?.version,
        players: data?.players ?? null, // { online, max, list? }
        motd: data?.motd ?? null,       // { clean?, raw? }
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { online: false, host, port, error: "status_unavailable" },
      { status: 200 }
    );
  }
}
