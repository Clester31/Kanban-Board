export interface BoardType {
    id: string
    name: string
    description?: string
    createdAt: string
    updatedAt: string

    userId: string
}

export interface Column {
    id: string
    name: string
    position: number
    color?: string
    createdAt: string
    updatedAt: string
}