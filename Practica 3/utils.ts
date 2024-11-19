import type { Task, TaskModel } from "./types.ts";

export const fromModelToTask = (model: TaskModel): Task => ({
    id: model._id!.toString(),
    title: model.title,
    completed: model.completed,
});