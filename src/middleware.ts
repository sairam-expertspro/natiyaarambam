import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Inbox", charset="UTF-8"',
    },
  });
}

export function middleware(request: NextRequest) {
  const username = process.env.ADMIN_BASIC_AUTH_USER || process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_BASIC_AUTH_PASSWORD || process.env.ADMIN_PASSWORD;

  if (!username || !password) {
    return NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  let decoded = "";
  try {
    decoded = atob(header.slice(6));
  } catch {
    return unauthorized();
  }

  const separator = decoded.indexOf(":");
  if (separator === -1) {
    return unauthorized();
  }

  const user = decoded.slice(0, separator);
  const pass = decoded.slice(separator + 1);

  if (user === username && pass === password) {
    return NextResponse.next();
  }

  return unauthorized();
}

export const config = {
  matcher: ["/admin/:path*"],
};
