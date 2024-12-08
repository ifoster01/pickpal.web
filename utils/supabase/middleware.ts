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

    // Get the current pathname and search params
    const pathname = request.nextUrl.pathname;
    const searchParams = request.nextUrl.searchParams;

    // Get and refresh the session
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // First, handle auth callbacks - these should always redirect to /picks when successful
    if (pathname.startsWith('/auth/callback')) {
      if (user) {
        const redirectUrl = new URL('/picks', request.url);
        // Preserve the provider param for the client to handle
        if (searchParams.has('provider')) {
          redirectUrl.searchParams.set('provider', searchParams.get('provider')!);
        }
        return NextResponse.redirect(redirectUrl);
      }
      return response;
    }

    // Then, handle auth routes (login/signup)
    // Authenticated users should not be able to access these
    if (pathname.startsWith('/login') || pathname.startsWith('/signup')) {
      if (user) {
        return NextResponse.redirect(new URL('/picks', request.url));
      }
      return response;
    }

    // Handle protected routes
    const protectedRoutes = ['/picks', '/parlay', '/saved', '/profile'];
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
      return response;
    }

    // For all other routes (including the landing page '/'),
    // allow access regardless of authentication status
    return response;

  } catch (e) {
    console.error('Middleware error:', e);
    // If you are here, a Supabase client could not be created
    // Return the unmodified response
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
