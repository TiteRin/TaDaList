import {defineConfig} from 'vitest/config';
// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        exclude: [
            'node_modules',
            '.next',
            '.storybook',
            'src/stories/**',
            'storybook-static'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
        }
    }
});
