import type {Meta, StoryObj} from '@storybook/nextjs-vite';
import TodayTasksCounter from '@/app/components/tasks/TodayTasksCounter';
import {useState} from "react";

const meta: Meta<typeof TodayTasksCounter> = {
    title: 'Components/TodayTasksCounter',
    component: TodayTasksCounter,
    parameters: {
        layout: "centered"
    }
}

export default meta;

type Story = StoryObj<typeof TodayTasksCounter>;

export const Default: Story = {
    args: {
        count: 0
    }
};

const StatefulWrapper = () => {
    const [counter, setCounter] = useState<number>(0);
    return (
        <div className={"flex flex-col gap-2"}>
            <TodayTasksCounter count={counter}/>
            <div className="flex gap-2 justify-center">
                <button className={"btn btn-primary"} onClick={() => setCounter(counter + 1)}>Add task</button>
                <button className={"btn"} onClick={() => setCounter(0)}>Reset</button>
            </div>
        </div>
    )
}

export const AddTask: Story = {
    render: () => <StatefulWrapper/>
}