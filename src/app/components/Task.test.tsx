import { render, screen } from '@testing-library/react';
import Task from './Task';

test('renders Task component', () => {
    render(<Task>Done</Task>);
    expect(screen.getByText('Done')).toBeInTheDocument();
});