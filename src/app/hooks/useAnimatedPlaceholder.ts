import {useEffect, useRef, useState} from "react";
import {deleteTo, parseScript, RawStep, typeText, wait} from "@/app/hooks/placeholder-animation/utils";

const defaultRawScripts: RawStep[][] = [
    [
        "ate something"
    ],
    [
        "went outside",
        {wait: 900},
        {deleteTo: "went "},
        {type: "type", target: "went to Jupiter for coffee"}
    ],
    [
        "read a book",
        {wait: 500},
        {deleteTo: "read a "},
        {wait: 300},
        "read a comic book",
        {deleteTo: "read a "},
        {wait: 500},
        "read a graphic novel"
    ],
    [
        "ate a healthy meal",
        {wait: 300},
        {deleteTo: "ate a "},
        "ate a meal",
        {wait: 400},
        "ate a meal with vegetables, protein and carbs",
        {deleteTo: "ate a "},
        "ate a pizza"
    ]
];

export function useAnimatedPlaceholder(rawScripts: RawStep[][] = defaultRawScripts) {

    const [placeholder, setPlaceholder] = useState<string>("");
    const [showCursor, setShowCursor] = useState<boolean>(false);
    const [cursor, setCursor] = useState<string>("");
    const abortRef = useRef(false);

    const abort = () => false;

    useEffect(() => {

        if (!showCursor) {
            (() => setCursor(""))();
            return;
        }

        const intervalId = setInterval(() => { setCursor(cursor === "|" ? "" : "|") }, 100);
        return () => clearInterval(intervalId);
    }, [showCursor])

    useEffect(() => {
        const rawScript = rawScripts[Math.floor(Math.random() * rawScripts.length)];
        const script = parseScript(rawScript);


        let current = "";
        const set = (target: string) => {
            current = target;
            setPlaceholder(current);
        }
        const get = () => current;

        async function run() {
            for (const step of script) {
                if (abort()) {
                    return;
                }

                setShowCursor(false);

                switch (step.type) {
                    case "type":
                        setShowCursor(true);
                        await typeText(step.target, get, set, abort);
                        break;
                    case "deleteTo":
                        setShowCursor(false);
                        await deleteTo(step.target, get, set, abort);
                        break;
                    case "wait":
                        setShowCursor(true);
                        await wait(step.delay);
                        break;
                }
            }
        }

        run();
    }, []);

    return {
        placeholder: `${placeholder}${cursor}`,
        showCursor,
        stop: () => abortRef.current = true
    }
}
