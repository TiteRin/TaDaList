import {describe, expect, test} from "vitest";
import {parseScript, Step, randomDelay, typeText, deleteTo} from "@/app/components/placeholder-animation/utils";

describe("parseScript", function () {
    test("string -> type step", () => {
        const steps = parseScript(["hello"]);
        expect(steps[0]).toEqual({type: "type", target: "hello"});
    });

    test("wait -> correct format", () => {
        const steps = parseScript([{wait: 500}]);
        expect(steps[0]).toEqual({type: "wait", delay: 500});
    });

    test("deleteTo -> correct format", () => {
        const steps = parseScript([{deleteTo: "hi"}]);
        expect(steps[0]).toEqual({type: "deleteTo", target: "hi"});
    });

    test("passThrough", () => {
        const step = {type: "type", target: "hello"};
        const steps = parseScript([step as Step]);
        expect(steps[0]).toEqual(step);
    })
});


describe("randomDelay", () => {
    test("returns number within range", () => {
        const d = randomDelay(10, 20);
        expect(d).toBeGreaterThan(10);
        expect(d).toBeLessThan(20);
    })
});

describe("typeText", () => {

    test("types step by step", async () => {
        let text = "";
        const set = (t: string) => (text = t);

        await typeText("hello", set, () => false, { min: 1, max: 1});
        expect(text).toBe("hello");
    });

    test("deleteTo, step by step", async () => {
       let text = "hello";
       const set = (t: string) => (text = t);
       const get = () => text;

       await deleteTo("he", get, set, () => false, { min: 1, max: 1});
       expect(text).toBe("he");
    });

    test("cannot deleteTo if target is not contained in text", async () => {
        let text = "hello";
        const set = (t: string) => (text = t);
        const get = () => text;


        expect(() => deleteTo("hi", get, set, () => false, { min: 1, max: 1})).rejects.toThrowError();
    });

    test("stops when aborted", async () => {
        let text = "";
        const set = (t: string) => (text = t);

        const abort = () => true;

        const p = typeText("hello", set, abort, { min: 1, max: 1 });

        await p;

        expect(text).toBe(""); // nothing typed
    });
});