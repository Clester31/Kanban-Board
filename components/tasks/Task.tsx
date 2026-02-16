import { TaskType } from "@/lib/types/types";

export default function Task({ task }: { task: TaskType }) {
    return (
        <div className="task flex flex-col">
            <h1>{task.title}</h1>
        </div>
    )
}