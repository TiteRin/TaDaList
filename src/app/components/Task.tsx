import {ReactNode} from "react";

export default function Task({children}: { children: ReactNode }) {
    return (
        <span className="task">{children}</span>
    )
}