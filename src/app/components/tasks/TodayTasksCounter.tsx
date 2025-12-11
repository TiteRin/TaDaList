interface TodayTasksCounterProps {
    count: number
}

export default function TodayTasksCounter({count}: TodayTasksCounterProps) {

    return (<span className="today-tasks-counter" data-testid="today-tasks-counter">
        {count === 0 && "No tasks done today… yet!"}
        {count === 1 && "1 task done today!"}
        {count > 1 && `${count} tasks done today!`}
    </span>)
}