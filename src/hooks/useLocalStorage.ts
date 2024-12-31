import {Dispatch, SetStateAction, useEffect} from "react";
import {useState} from "react";

const useLocalStorage = <S>(key: string, initialValue: S): [S, Dispatch<SetStateAction<S>>] => {
    const [value, setValue] = useState<S>(() => {
        const storedValue: string | null = localStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : initialValue;
    });

    useEffect((): void => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
}

export default useLocalStorage;