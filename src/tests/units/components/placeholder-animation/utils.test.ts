import {describe, expect, test} from "vitest";
import {parseScript, Step, randomDelay} from "@/app/components/placeholder-animation/utils";

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