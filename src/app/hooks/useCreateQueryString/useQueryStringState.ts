import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"


export const useQueryStringState = ({
    stateKey,
    defaultValue
}: {
    defaultValue?: string
    stateKey: string
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateState = useCallback((value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (value === null) {
            params.delete(stateKey);
        } else {
            params.set(stateKey, value);
        }

        const newSearch = params.toString();
        const query = newSearch ? `?${newSearch}` : '';
        router.push(`${pathname}${query}`);
    }, [searchParams, router, pathname, stateKey]);

    const activeState = searchParams.get(stateKey) ?? defaultValue ?? null;

    return useMemo(() => [activeState, updateState] as const, [activeState, updateState]);
};