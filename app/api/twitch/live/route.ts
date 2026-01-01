import { NextResponse } from "next/server";

export const runtime = "nodejs";

type TwitchTokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

type TwitchStreamsResponse = {
  data: Array<{
    id: string;
    user_login: string;
    user_name: string;
    game_name: string;
    title: string;
    viewer_count: number;
    started_at: string;
    language: string;
  }>;
};

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAppAccessToken() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET.");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now) return cachedToken.token;

  const params = new URLSearchParams();
  params.set("client_id", clientId);
  params.set("client_secret", clientSecret);
  params.set("grant_type", "client_credentials");

  const res = await fetch("https://id.twitch.tv/oauth2/token", {
    method: "POST",
    body: params,
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
  const json = (await res.json()) as TwitchTokenResponse;

  cachedToken = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };

  return cachedToken.token;
}

export async function GET() {
  try {
    const username = process.env.TWITCH_USERNAME || "spiex90";
    const clientId = process.env.TWITCH_CLIENT_ID;
    if (!clientId) throw new Error("Missing TWITCH_CLIENT_ID.");

    const token = await getAppAccessToken();

    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(username)}`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!res.ok) throw new Error(`Streams fetch failed: ${res.status}`);
    const json = (await res.json()) as TwitchStreamsResponse;
    const stream = json.data?.[0];

    const headers = {
      "Cache-Control": "s-maxage=60, stale-while-revalidate=60",
    };

    if (!stream) {
      return NextResponse.json({ live: false, username }, { headers });
    }

    return NextResponse.json(
      {
        live: true,
        username,
        title: stream.title,
        game: stream.game_name,
        viewers: stream.viewer_count,
        startedAt: stream.started_at,
      },
      { headers }
    );
  } catch (e: any) {
    // Return live=false on errors so the UI doesn't break
    return NextResponse.json(
      { live: false, error: e?.message || "Unknown error" },
      { status: 200 }
    );
  }
}
