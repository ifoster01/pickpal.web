import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
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

    // This will refresh session if expired - required for Server Components
    const { data: { user } } = await supabase.auth.getUser();

    // Protected routes
    if ((request.nextUrl.pathname.startsWith("/picks") ||
        request.nextUrl.pathname.startsWith("/parlay") ||
        request.nextUrl.pathname.startsWith("/saved") ||
        request.nextUrl.pathname.startsWith("/profile")) &&
        !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Auth routes (when already logged in)
    if ((request.nextUrl.pathname.startsWith("/login") || 
         request.nextUrl.pathname.startsWith("/signup")) && 
        user) {
      return NextResponse.redirect(new URL("/picks", request.url));
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
