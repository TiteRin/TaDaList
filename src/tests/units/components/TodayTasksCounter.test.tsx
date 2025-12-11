import {describe, expect, it} from "vitest";
import {render, screen} from "@testing-library/react";
import TodayTasksCounter from "@/app/components/tasks/TodayTasksCounter";

describe("TodayTasksCounter", () => {
    it("should render", () => {
        render(<TodayTasksCounter count={0} />);

        expect(screen.getByTestId("today-tasks-counter")).toBeInTheDocument();
    })

    it("should tell how many tasks are done today", () => {
        render(<TodayTasksCounter count={10}/>);

        expect(screen.getByTestId("today-tasks-counter")).toHaveTextContent("10 tasks done today!");
    });

    it("should have encouraging text when no tasks done yet", () => {
        render(<TodayTasksCounter count={0}/>);

        expect(screen.getByTestId("today-tasks-counter")).toHaveTextContent("No tasks done today… yet!");
    });
});