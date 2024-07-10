import { create, StateCreator } from "zustand";
import { v4 as uuid } from "uuid";
import { Task, TaskStatus } from "../../interfaces";
import { devtools, persist } from "zustand/middleware";
// import { produce } from "immer";
import { immer } from "zustand/middleware/immer";

interface TaskState {
  dragginTaskId?: string;
  tasks: Record<string, Task>;

  getTaskByStatus: (status: TaskStatus) => Task[];
  addTask: (title: string, status: TaskStatus) => void;
  setDraggingTaskId: (taskId: string) => void;
  removeDragginTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;
  onTaskDrop: (status: TaskStatus) => void;
  getTasksCount: () => number;
}

const storeApi: StateCreator<
  TaskState,
  [["zustand/devtools", never]],
  [["zustand/immer", never]]
> = (set, get) => ({
  dragginTaskId: undefined,
  tasks: {
    "ABC-1": {
      id: "ABC-1",
      title: "Task 1",
      status: "open",
    },
    "ABC-2": {
      id: "ABC-2",
      title: "Task 2",
      status: "in-progress",
    },
    "ABC-3": {
      id: "ABC-3",
      title: "Task 3",
      status: "open",
    },
    "ABC-4": {
      id: "ABC-4",
      title: "Task 4",
      status: "open",
    },
  },
  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    const filteredTasks = Object.values(tasks).filter(
      (task) => task.status == status
    );
    return filteredTasks;
  },
  addTask: (title: string, status: TaskStatus) => {
    const newTask = {
      id: uuid(),
      title: title,
      status: status,
    };

    // ? Using immer
    set((state) => {
      state.tasks[newTask.id] = newTask;
      return state;
    });

    // ? Require npm install immer
    // set(
    //   produce((state: TaskState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );

    // ? Native form to manage state
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask,
    //   },
    // }));
  },
  setDraggingTaskId: (taskId: string) => {
    set({ dragginTaskId: taskId }, false, "setDragginTaskId");
  },
  removeDragginTaskId: () => {
    set({ dragginTaskId: undefined }, false, "removeDragginTaskId");
  },
  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    set((state) => {
      state.tasks[taskId] = {
        ...state.tasks[taskId],
        status,
      };
      return state;
    });
  },
  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().dragginTaskId;
    if (!taskId) return;
    get().changeTaskStatus(taskId, status);
    get().removeDragginTaskId();
  },
  getTasksCount: () => {
    return Object.values(get().tasks).length;
  },
});

export const useTaskStore = create<TaskState>()(
  devtools(persist(immer(storeApi), { name: "task-store" }))
);
