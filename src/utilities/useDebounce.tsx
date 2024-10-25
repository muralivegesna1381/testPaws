import { useState } from "react";

type Timer = ReturnType<typeof setTimeout>;
type SomeFunction = (...args: any[]) => void;

export function useDebounce<Func extends SomeFunction>(
    func: Func,
    delay = 500
) {
    const [timer, setTimer] = useState<Timer>();

    const debouncedFunction = ((...args) => {
        const newTimer = setTimeout(() => {
            func(...args);
        }, delay);
        clearTimeout(timer);
        setTimer(newTimer);
    }) as Func;

    return debouncedFunction;
}