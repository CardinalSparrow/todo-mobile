import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_KEY = "@tasks";
const THEME_KEY = "@theme";

export const saveTasks = async (tasks) => {
  try {
    await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
  }
};

export const loadTasks = async () => {
  try {
    const tasks = await AsyncStorage.getItem(TASKS_KEY);
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    return [];
  }
};

export const saveTheme = async (isDark) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  } catch (error) {
    console.error("Error saving theme:", error);
  }
};

export const loadTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme === "dark";
  } catch (error) {
    console.error("Error loading theme:", error);
    return false;
  }
};
