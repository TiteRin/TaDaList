export type RawStep =
    | string
    | { wait: number }
    | { deleteTo: string }
    | Step;

export type Step =
    | { type: 'type', target: string }
    | { type: 'wait', delay: number }
    | { type: 'deleteTo', target: string };

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