export type RawStep =
    | string
    | { wait: number }
    | { deleteTo: string }
    | Step;

export type Step =
    | { type: 'type', target: string }
    | { type: 'wait', delay: number }
    | { type: 'deleteTo', target: string };

export type SpeedRange = { min: number, max: number };

export function parseScript(script: RawStep[]): Step[] {

    return script.map(step => {
        if (typeof step === 'string') {
            return {type: 'type', target: step};
        }

        if ("wait" in step) {
            return {type: 'wait', delay: step.wait};
        }

        if ("deleteTo" in step) {
            return {type: 'deleteTo', target: step.deleteTo};
        }

        return step as Step;
    });
};

export function randomDelay(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

async function wait(delay: number) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

export async function typeText(
    target: string,
    set: (t: string) => void,
    abort: () => boolean, speedRange
    : SpeedRange = {
        min: 40,
        max: 120
    }) {
    for (let i = 0; i < target.length; i++) {
        set(target.slice(0, i + 1));
        await wait(randomDelay(speedRange.min, speedRange.max));
    }
}

export async function deleteTo(
    target: string,
    get: () => string,
    set: (t: string) => void,
    abort: () => boolean,
    speedRange: SpeedRange = {
        min: 40,
        max: 120
    }) {

    if (get().slice(0, target.length) != target) {
        throw new Error(`Cannot delete to "${target}" because current text is "${get()}"`);
    }

    while (!abort() && get() != target && get().length > 0) {
        set(get().slice(0, -1));
        await wait(randomDelay(speedRange.min, speedRange.max));
    }
}