import { render, screen } from '@testing-library/react';
import Task from './Task';
import {expect, test } from "vitest";

test('renders Task component', () => {
    render(<Task>Done</Task>);
    expect(screen.getByText('Done')).toBeInTheDocument();
});