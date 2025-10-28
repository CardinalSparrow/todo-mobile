import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { registerRootComponent } from "expo";
import React from "react";
import AddTaskScreen from "./src/screens/AddTask";
import TaskListScreen from "./src/screens/TaskList";

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
const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="TaskList" component={TaskListScreen} />
        <Stack.Screen
          name="AddTask"
          component={AddTaskScreen}
          options={{
            presentation: "modal",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Register the app component
registerRootComponent(App);

export default App;
