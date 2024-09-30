import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the SSR package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  const supabase = createClient();
  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  // If the user is signing up, create a new user in the database
  const { data: user, error: error2 } = await supabase.auth.getUser();

  if (error2) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { data: newUser, error: error1 } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.user?.id);

  if (error1) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (newUser?.length === 0) {
    const { error: error3 } = await supabase
      .from("users")
      .insert([{
        id: user?.user?.id,
        first_name: user?.user?.user_metadata?.full_name?.split(" ")[0],
        last_name: user?.user?.user_metadata?.full_name?.split(" ")[1]
    }]);

    if (error3) {
      return NextResponse.redirect(`${origin}/login`);
    }
  }

  return NextResponse.redirect(`${origin}/authed`);
}