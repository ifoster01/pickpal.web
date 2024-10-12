import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { Database } from "~/types/supabase";

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
    console.log("Redirecting to login");
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  if (user && (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/auth/signup" || request.nextUrl.pathname === "/auth/login")) {
    console.log("Redirecting to home page");
    const url = request.nextUrl.clone();
    url.pathname = "/authed";
    console.log(url);
    return NextResponse.redirect(url);
  }

  return response;
};
