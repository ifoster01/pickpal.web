import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { useGraph } from "~/app/hooks/useGraph/useGraph";
import { Database } from "~/types/supabase";
import { driver } from "../neo4j/neo4j";

export const updateSession = async (request: NextRequest) => {
  // Create a new client with the cookies from the request
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  // DONT MODIFY ANYTHING ABOVE THIS LINE

  if (!user && request.nextUrl.pathname.startsWith("/authed")) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user) {
    // adding a user to neo4j if there isn't one already
    const session = driver.session();
    const userRes = await session.run(
      `MATCH (u:User {email: $email})
      RETURN u`,
      { email: user.email },
    );
    const userNode = userRes.records[0]?.get("u");
    if (!userNode) {
      await session.run(
        `CREATE (u:User {email: $email})
        RETURN u`,
        { email: user.email },
      );
    }
  }

  if (user && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/auth/signup" || request.nextUrl.pathname === "/auth/login")) {
    const url = request.nextUrl.clone();
    url.pathname = "/authed";
    return NextResponse.redirect(url);
  }

  return response;
};
