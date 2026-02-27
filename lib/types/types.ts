export interface BoardType {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string

    userId: string
}

export interface ColumnType {
    id: string
    name: string
    position: number
    color?: string
    createdAt: string
    updatedAt: string
}

export interface TaskType {
    id: string
    title: string
    completed: boolean
    position: number
    createdAt: string
    updatedAt: string

    columnId: string

    subTasks: subTaskType[]
    tags: tagType[]
}

export interface subTaskType {
    id: string
    title: string
    completed: boolean
    position: number
    createdAt: string
    updatedAt: string

    taskId: string
}

export interface tagType {

}