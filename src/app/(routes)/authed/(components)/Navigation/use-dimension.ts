import { useEffect, useRef } from "react";

// Naive implementation - in reality would want to attach
// a window or resize listener. Also use state/layoutEffect instead of ref/effect
// if this is important to know on initial client render.
// It would be safer to  return null for unmeasured states.
export const useDimensions = (ref: HTMLElement | null) => {
    const dimensions = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (!ref) return;

        dimensions.current.width = ref.offsetWidth;
        dimensions.current.height = ref.offsetHeight;
    }, []);

    return dimensions.current;
};
