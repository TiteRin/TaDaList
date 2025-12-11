interface TodayTasksCounterProps {
    count: number
}

const CONGRATULATIONS_MSG = [
    "Congratulations!",
    "You did it!",
    "You're awesome!",
    "Awesome!",
    "Amazing!",
    "You’re the best!",
    "Bravo",
    "You rock!",
    "Way to go!",
    "Well done!",
    "Good job!",
    "You nailed it!",
    "You crushed it!",
    "Fantastic!",
    "Brilliant!",
    "Incredible",
    "Impressive!",
    "Outstanding!",
    "You’re on fire!",
    "Congrats!",
    "Hurray!",
    "Wow!",
    "Excellent!",
    "Remarkable!"
];

function getRandomCongratulation() {
    return CONGRATULATIONS_MSG[Math.floor(Math.random() * CONGRATULATIONS_MSG.length)];
}

export default function TodayTasksCounter({count}: TodayTasksCounterProps) {

    const congrats = count > 0 && getRandomCongratulation();

    return (<span className="today-tasks-counter"
                  data-testid="today-tasks-counter" >
        {count === 0 && "No tasks done today… yet!"}
        {count === 1 && `${congrats} 1 task done today!`}
        {count > 1 && `${congrats} ${count} tasks done today!`}
    </span>)
}