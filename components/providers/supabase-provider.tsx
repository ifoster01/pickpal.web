"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

type SupabaseContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const SupabaseContext = createContext<SupabaseContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === "SIGNED_IN") {
        if (pathname === "/" || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
          router.push("/picks");
        }
      }
      if (event === "SIGNED_OUT") {
        router.push("/");
      }
    });

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && pathname === "/") {
        router.push("/picks");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router, pathname]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SupabaseContext.Provider value={{ user, loading, signOut }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
}; 