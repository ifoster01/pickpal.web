import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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

// Protected routes that require authentication
const PROTECTED_ROUTES = [
    '/authed',  // This will match all routes under /authed/
];

// Check if the current path is a protected route
const isProtectedRoute = (path: string): boolean => {
    return PROTECTED_ROUTES.some(route => path.startsWith(route));
};

export default function AuthProvider({ children }: PropsWithChildren) {
    const router = useRouter();
    const pathname = usePathname();
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSigningOut, setIsSigningOut] = useState(false);

    useEffect(() => {
        setLoading(true);

        const supabase = createClient();
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            
            // Only redirect if on a protected route without a session
            if (!session && isProtectedRoute(pathname)) {
                router.push("/auth/login");
            }
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            
            // Only redirect on session loss if we're on a protected route
            // or if we're explicitly signing out
            if (!session && (isProtectedRoute(pathname) || isSigningOut)) {
                router.push("/auth/login");
            }
        });

        setLoading(false);

        return () => {
            subscription.unsubscribe();
        };
    }, [router, pathname]);

    const signOut = async () => {
        try {
            const supabase = createClient();
            
            // Set signing out flag to true
            setIsSigningOut(true);
            
            // Clear the session from context
            setSession(null);
            
            // Sign out from Supabase
            await supabase.auth.signOut();
            
            // Force a hard redirect to login page
            window.location.href = "/auth/login";
        } catch (error) {
            console.error("Error signing out:", error);
            // Still redirect even if there's an error
            window.location.href = "/auth/login";
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);