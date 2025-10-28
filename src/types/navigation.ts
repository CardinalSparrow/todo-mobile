export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate: string | null;
}

export type RootStackParamList = {
  TaskList: { newTask?: Task } | undefined;
  AddTask: { isDarkTheme: boolean };
};
