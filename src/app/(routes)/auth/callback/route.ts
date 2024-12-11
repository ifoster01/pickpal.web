import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    
    // After exchanging the code, get the user
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.redirect(`${origin}/auth/login?error=Unable to verify authentication`);
    }

    // Successful authentication
    return NextResponse.redirect(`${origin}/authed/picks`);
  }

  // No code present in URL
  return NextResponse.redirect(`${origin}/auth/login?error=No authentication code present`);
}