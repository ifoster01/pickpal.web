import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Session, User } from "@supabase/supabase-js";

type AuthContext = {
    session: Session | null;
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContext>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            
            // If session is null (signed out), redirect to login
            if (!session) {
                router.push("/auth/login");
            }
        });

        setLoading(false);

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const signOut = async () => {
        try {
            const supabase = createClient();
            
            // First, clear the session from context to prevent middleware race
            setSession(null);
            
            // Then sign out from Supabase
            await supabase.auth.signOut();
            
            // Force a hard redirect to login page
            window.location.href = "/auth/login";
        } catch (error) {
            console.error("Error signing out:", error);
            // Still redirect even if there's an error
            window.location.href = "/auth/login";
        }
    };

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);