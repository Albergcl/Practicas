
import type { ObjectId } from "mongodb";

export type TaskModel = {
    _id?: ObjectId,
    title: string,
    completed: boolean
}

export type Task = {
    id?: string,
    title: string,
    completed: boolean
}