// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { NativeStackScreenProps } from "@react-navigation/native-stack";
// import { StatusBar } from "expo-status-bar";
// import { ArrowLeft, Calendar, FileText, Type } from "lucide-react-native";
// import React, { useState } from "react";
// import {
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { RootStackParamList, Task } from "../types/navigation";

// type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

// export default function AddTaskScreen({ navigation, route }: Props) {
//   const [tasks, setTasks] = useState<Task[]>([]);
//   const [taskTitle, setTaskTitle] = useState("");
//   const [taskDescription, setTaskDescription] = useState("");
//   const [taskDueDate, setTaskDueDate] = useState("");
//   const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>(
//     {}
//   );

//   // Get theme from route params
//   const isDarkTheme = route.params?.isDarkTheme || false;

//   // Theme colors
//   const colors = isDarkTheme
//     ? {
//         background: "#111827",
//         card: "#1f2937",
//         text: "#f9fafb",
//         textSecondary: "#9ca3af",
//         border: "#374151",
//         inputBg: "#111827",
//       }
//     : {
//         background: "#f9fafb",
//         card: "#ffffff",
//         text: "#111827",
//         textSecondary: "#6b7280",
//         border: "#e5e7eb",
//         inputBg: "#f3f4f6",
//       };

//   /**
//    * Validate task input
//    */
//   const validateTask = (): boolean => {
//     const newErrors: { title?: string; dueDate?: string } = {};

//     // Validate title
//     if (!taskTitle.trim()) {
//       newErrors.title = "Task title is required";
//     } else if (taskTitle.trim().length < 3) {
//       newErrors.title = "Title must be at least 3 characters";
//     }

//     // Validate due date format (if provided)
//     if (taskDueDate.trim()) {
//       const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//       if (!dateRegex.test(taskDueDate)) {
//         newErrors.dueDate = "Date must be in YYYY-MM-DD format";
//       } else {
//         // Check if it's a valid date
//         const date = new Date(taskDueDate);
//         if (isNaN(date.getTime())) {
//           newErrors.dueDate = "Please enter a valid date";
//         } else if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
//           newErrors.dueDate = "Due date cannot be in the past";
//         }
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // const handleSaveTask = async () => {
//   //   if (!validateTask()) {
//   //     return;
//   //   }

//   //   const newTask: Task = {
//   //     id: Date.now().toString(),
//   //     title: taskTitle.trim(),
//   //     description: taskDescription.trim(),
//   //     completed: false,
//   //     createdAt: new Date().toISOString(),
//   //     dueDate: taskDueDate.trim() || null,
//   //   };
//   //   try {
//   //     const storedTasks = await AsyncStorage.getItem("@tasks");
//   //     if (storedTasks) {
//   //       setTasks(JSON.parse(storedTasks));
//   //     }
//   //     console.log(tasks);

//   //     await AsyncStorage.setItem("@tasks", JSON.stringify([...tasks, newTask]));
//   //   } catch (error) {
//   //     console.error("Error saving tasks:", error);
//   //   }

//   //   // Navigate back with the new task
//   //   navigation.navigate("TaskList", { newTask });
//   // };

//   // const handleSaveTask = async () => {
//   //   if (!validateTask()) {
//   //     return;
//   //   }

//   //   const newTask: Task = {
//   //     id: Date.now().toString(),
//   //     title: taskTitle.trim(),
//   //     description: taskDescription.trim(),
//   //     completed: false,
//   //     createdAt: new Date().toISOString(),
//   //     dueDate: taskDueDate.trim() || null,
//   //   };

//   //   try {
//   //     const currentTasks = await loadTasks();
//   //     await saveTasks([newTask, ...currentTasks]);
//   //     navigation.navigate("TaskList", { newTask });
//   //   } catch (error) {
//   //     console.error("Error saving tasks:", error);
//   //     Alert.alert("Error", "Failed to save task. Please try again.");
//   //   }
//   // };

//   const handleSaveTask = async () => {
//     if (!validateTask()) {
//       return;
//     }

//     const newTask: Task = {
//       id: Date.now().toString(),
//       title: taskTitle.trim(),
//       description: taskDescription.trim(),
//       completed: false,
//       createdAt: new Date().toISOString(),
//       dueDate: taskDueDate.trim() || null,
//     };

//     try {
//       // Read the current tasks from storage
//       const storedTasks = await AsyncStorage.getItem("@tasks");
//       const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];

//       // Add the new task to the beginning of the array
//       const updatedTasks = [newTask, ...currentTasks];

//       // Save back to storage
//       await AsyncStorage.setItem("@tasks", JSON.stringify(updatedTasks));

//       // Navigate back with the new task
//       navigation.navigate("TaskList", { newTask });
//     } catch (error) {
//       console.error("Error saving tasks:", error);
//       Alert.alert("Error", "Failed to save task. Please try again.");
//     }
//   };

//   /**
//    * Handle cancel
//    */
//   const handleCancel = () => {
//     if (taskTitle.trim() || taskDescription.trim() || taskDueDate.trim()) {
//       Alert.alert(
//         "Discard Changes?",
//         "You have unsaved changes. Are you sure you want to go back?",
//         [
//           { text: "Keep Editing", style: "cancel" },
//           {
//             text: "Discard",
//             style: "destructive",
//             onPress: () => navigation.goBack(),
//           },
//         ]
//       );
//     } else {
//       navigation.goBack();
//     }
//   };

//   /**
//    * Format date helper text
//    */
//   const getDateHelperText = () => {
//     if (taskDueDate.trim()) {
//       const date = new Date(taskDueDate);
//       if (!isNaN(date.getTime())) {
//         return date.toLocaleDateString("en-US", {
//           weekday: "long",
//           year: "numeric",
//           month: "long",
//           day: "numeric",
//         });
//       }
//     }
//     return "Format: YYYY-MM-DD (e.g., 2025-12-31)";
//   };

//   return (
//     <KeyboardAvoidingView
//       style={[styles.container, { backgroundColor: colors.background }]}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <StatusBar style={isDarkTheme ? "light" : "dark"} />

//       {/* Header */}
//       <View
//         style={[
//           styles.header,
//           { backgroundColor: colors.card, borderBottomColor: colors.border },
//         ]}
//       >
//         <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
//           <ArrowLeft size={24} color={colors.text} />
//         </TouchableOpacity>
//         <Text style={[styles.headerTitle, { color: colors.text }]}>
//           Add New Task
//         </Text>
//         <View style={styles.placeholder} />
//       </View>

//       {/* Form */}
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.formContainer}
//         keyboardShouldPersistTaps="handled"
//       >
//         {/* Task Title */}
//         <View style={styles.inputGroup}>
//           <View style={styles.labelContainer}>
//             <Type size={20} color={colors.textSecondary} />
//             <Text style={[styles.label, { color: colors.text }]}>
//               Task Title <Text style={styles.required}>*</Text>
//             </Text>
//           </View>
//           <TextInput
//             style={[
//               styles.input,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: errors.title ? "#ef4444" : colors.border,
//                 color: colors.text,
//               },
//             ]}
//             placeholder="Enter task title..."
//             placeholderTextColor={colors.textSecondary}
//             value={taskTitle}
//             onChangeText={(text) => {
//               setTaskTitle(text);
//               if (errors.title) {
//                 setErrors({ ...errors, title: undefined });
//               }
//             }}
//             maxLength={100}
//             autoFocus
//           />
//           {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
//           <Text style={[styles.helperText, { color: colors.textSecondary }]}>
//             {taskTitle.length}/100 characters
//           </Text>
//         </View>

//         {/* Task Description */}
//         <View style={styles.inputGroup}>
//           <View style={styles.labelContainer}>
//             <FileText size={20} color={colors.textSecondary} />
//             <Text style={[styles.label, { color: colors.text }]}>
//               Description
//             </Text>
//             <Text style={[styles.optional, { color: colors.textSecondary }]}>
//               (optional)
//             </Text>
//           </View>
//           <TextInput
//             style={[
//               styles.input,
//               styles.textArea,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: colors.border,
//                 color: colors.text,
//               },
//             ]}
//             placeholder="Add more details about your task..."
//             placeholderTextColor={colors.textSecondary}
//             value={taskDescription}
//             onChangeText={setTaskDescription}
//             multiline
//             numberOfLines={4}
//             maxLength={500}
//             textAlignVertical="top"
//           />
//           <Text style={[styles.helperText, { color: colors.textSecondary }]}>
//             {taskDescription.length}/500 characters
//           </Text>
//         </View>

//         {/* Due Date */}
//         <View style={styles.inputGroup}>
//           <View style={styles.labelContainer}>
//             <Calendar size={20} color={colors.textSecondary} />
//             <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
//             <Text style={[styles.optional, { color: colors.textSecondary }]}>
//               (optional)
//             </Text>
//           </View>
//           <TextInput
//             style={[
//               styles.input,
//               {
//                 backgroundColor: colors.inputBg,
//                 borderColor: errors.dueDate ? "#ef4444" : colors.border,
//                 color: colors.text,
//               },
//             ]}
//             placeholder="YYYY-MM-DD"
//             placeholderTextColor={colors.textSecondary}
//             value={taskDueDate}
//             onChangeText={(text) => {
//               setTaskDueDate(text);
//               if (errors.dueDate) {
//                 setErrors({ ...errors, dueDate: undefined });
//               }
//             }}
//             keyboardType="numbers-and-punctuation"
//             maxLength={10}
//           />
//           {errors.dueDate && (
//             <Text style={styles.errorText}>{errors.dueDate}</Text>
//           )}
//           <Text style={[styles.helperText, { color: colors.textSecondary }]}>
//             {getDateHelperText()}
//           </Text>
//         </View>

//         {/* Quick Date Buttons */}
//         <View style={styles.quickDateContainer}>
//           <Text
//             style={[styles.quickDateLabel, { color: colors.textSecondary }]}
//           >
//             Quick select:
//           </Text>
//           <View style={styles.quickDateButtons}>
//             <TouchableOpacity
//               style={[
//                 styles.quickDateButton,
//                 { backgroundColor: colors.card, borderColor: colors.border },
//               ]}
//               onPress={() => {
//                 const today = new Date();
//                 setTaskDueDate(today.toISOString().split("T")[0]);
//                 setErrors({ ...errors, dueDate: undefined });
//               }}
//             >
//               <Text
//                 style={[styles.quickDateButtonText, { color: colors.text }]}
//               >
//                 Today
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.quickDateButton,
//                 { backgroundColor: colors.card, borderColor: colors.border },
//               ]}
//               onPress={() => {
//                 const tomorrow = new Date();
//                 tomorrow.setDate(tomorrow.getDate() + 1);
//                 setTaskDueDate(tomorrow.toISOString().split("T")[0]);
//                 setErrors({ ...errors, dueDate: undefined });
//               }}
//             >
//               <Text
//                 style={[styles.quickDateButtonText, { color: colors.text }]}
//               >
//                 Tomorrow
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[
//                 styles.quickDateButton,
//                 { backgroundColor: colors.card, borderColor: colors.border },
//               ]}
//               onPress={() => {
//                 const nextWeek = new Date();
//                 nextWeek.setDate(nextWeek.getDate() + 7);
//                 setTaskDueDate(nextWeek.toISOString().split("T")[0]);
//                 setErrors({ ...errors, dueDate: undefined });
//               }}
//             >
//               <Text
//                 style={[styles.quickDateButtonText, { color: colors.text }]}
//               >
//                 Next Week
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </ScrollView>

//       {/* Action Buttons */}
//       <View
//         style={[
//           styles.footer,
//           { backgroundColor: colors.card, borderTopColor: colors.border },
//         ]}
//       >
//         <TouchableOpacity
//           style={[styles.button, styles.cancelButton]}
//           onPress={handleCancel}
//         >
//           <Text style={styles.cancelButtonText}>Cancel</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={[
//             styles.button,
//             styles.saveButton,
//             !taskTitle.trim() && styles.saveButtonDisabled,
//           ]}
//           onPress={handleSaveTask}
//           disabled={!taskTitle.trim()}
//         >
//           <Text style={styles.saveButtonText}>Save Task</Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   placeholder: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   formContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   inputGroup: {
//     marginBottom: 28,
//   },
//   labelContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//     gap: 8,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   required: {
//     color: "#ef4444",
//   },
//   optional: {
//     fontSize: 14,
//     fontStyle: "italic",
//   },
//   input: {
//     borderWidth: 1.5,
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 16,
//   },
//   textArea: {
//     height: 120,
//     textAlignVertical: "top",
//   },
//   errorText: {
//     color: "#ef4444",
//     fontSize: 13,
//     marginTop: 6,
//   },
//   helperText: {
//     fontSize: 13,
//     marginTop: 6,
//   },
//   quickDateContainer: {
//     marginTop: 8,
//   },
//   quickDateLabel: {
//     fontSize: 14,
//     marginBottom: 10,
//   },
//   quickDateButtons: {
//     flexDirection: "row",
//     gap: 10,
//   },
//   quickDateButton: {
//     flex: 1,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     borderWidth: 1.5,
//     alignItems: "center",
//   },
//   quickDateButtonText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   footer: {
//     flexDirection: "row",
//     gap: 12,
//     padding: 20,
//     paddingBottom: 30,
//     borderTopWidth: 1,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 16,
//     borderRadius: 12,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   cancelButton: {
//     backgroundColor: "#e5e7eb",
//   },
//   cancelButtonText: {
//     color: "#374151",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   saveButton: {
//     backgroundColor: "#3b82f6",
//   },
//   saveButtonDisabled: {
//     backgroundColor: "#93c5fd",
//     opacity: 0.6,
//   },
//   saveButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { ArrowLeft, Calendar, FileText, Type, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList, Task } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "AddTask">;

export default function AddTaskScreen({ navigation, route }: Props) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; dueDate?: string }>(
    {}
  );

  // Get theme from route params
  const isDarkTheme = route.params?.isDarkTheme || false;

  // Theme colors
  const colors = isDarkTheme
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        textSecondary: "#9ca3af",
        border: "#374151",
        inputBg: "#111827",
      }
    : {
        background: "#f9fafb",
        card: "#ffffff",
        text: "#111827",
        textSecondary: "#6b7280",
        border: "#e5e7eb",
        inputBg: "#f3f4f6",
      };

  /**
   * Validate task input
   */
  const validateTask = (): boolean => {
    const newErrors: { title?: string; dueDate?: string } = {};

    // Validate title
    if (!taskTitle.trim()) {
      newErrors.title = "Task title is required";
    } else if (taskTitle.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    // Validate due date (if provided)
    if (taskDueDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(taskDueDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle date change from picker
   */
  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setTaskDueDate(selectedDate);
      setErrors({ ...errors, dueDate: undefined });
    }
  };

  /**
   * Handle save task
   */
  const handleSaveTask = async () => {
    if (!validateTask()) {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: taskDueDate ? taskDueDate.toISOString().split("T")[0] : null,
    };

    try {
      // Read the current tasks from storage
      const storedTasks = await AsyncStorage.getItem("@tasks");
      const currentTasks = storedTasks ? JSON.parse(storedTasks) : [];

      // Add the new task to the beginning of the array
      const updatedTasks = [newTask, ...currentTasks];

      // Save back to storage
      await AsyncStorage.setItem("@tasks", JSON.stringify(updatedTasks));

      // Navigate back with the new task
      navigation.navigate("TaskList", { newTask });
    } catch (error) {
      console.error("Error saving tasks:", error);
      Alert.alert("Error", "Failed to save task. Please try again.");
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    if (taskTitle.trim() || taskDescription.trim() || taskDueDate) {
      Alert.alert(
        "Discard Changes?",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Keep Editing", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Set quick date
   */
  const setQuickDate = (daysToAdd: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    setTaskDueDate(date);
    setErrors({ ...errors, dueDate: undefined });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style={isDarkTheme ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Add New Task
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* Form */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.formContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Task Title */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Type size={20} color={colors.textSecondary} />
            <Text style={[styles.label, { color: colors.text }]}>
              Task Title <Text style={styles.required}>*</Text>
            </Text>
          </View>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                borderColor: errors.title ? "#ef4444" : colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Enter task title..."
            placeholderTextColor={colors.textSecondary}
            value={taskTitle}
            onChangeText={(text) => {
              setTaskTitle(text);
              if (errors.title) {
                setErrors({ ...errors, title: undefined });
              }
            }}
            maxLength={100}
            autoFocus
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {taskTitle.length}/100 characters
          </Text>
        </View>

        {/* Task Description */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <FileText size={20} color={colors.textSecondary} />
            <Text style={[styles.label, { color: colors.text }]}>
              Description
            </Text>
            <Text style={[styles.optional, { color: colors.textSecondary }]}>
              (optional)
            </Text>
          </View>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Add more details about your task..."
            placeholderTextColor={colors.textSecondary}
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={[styles.helperText, { color: colors.textSecondary }]}>
            {taskDescription.length}/500 characters
          </Text>
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <Calendar size={20} color={colors.textSecondary} />
            <Text style={[styles.label, { color: colors.text }]}>Due Date</Text>
            <Text style={[styles.optional, { color: colors.textSecondary }]}>
              (optional)
            </Text>
          </View>

          {/* Date Display/Picker Button */}
          <TouchableOpacity
            style={[
              styles.datePickerButton,
              {
                backgroundColor: colors.inputBg,
                borderColor: errors.dueDate ? "#ef4444" : colors.border,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Calendar size={20} color={"red"} />
            <Text
              style={[
                styles.datePickerButtonText,
                { color: taskDueDate ? colors.text : colors.textSecondary },
              ]}
            >
              {taskDueDate ? formatDate(taskDueDate) : "Select a date"}
            </Text>
            {taskDueDate && (
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  setTaskDueDate(null);
                  setErrors({ ...errors, dueDate: undefined });
                }}
                style={styles.clearDateButton}
              >
                <X size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {errors.dueDate && (
            <Text style={styles.errorText}>{errors.dueDate}</Text>
          )}

          {/* Date Picker */}
          {showDatePicker && (
            <DateTimePicker
              value={taskDueDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              minimumDate={new Date()}
              textColor={colors.text}
              themeVariant={isDarkTheme ? "dark" : "light"}
            />
          )}

          {Platform.OS === "ios" && showDatePicker && (
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: "#3b82f6" }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick Date Buttons */}
        <View style={styles.quickDateContainer}>
          <Text
            style={[styles.quickDateLabel, { color: colors.textSecondary }]}
          >
            Quick select:
          </Text>
          <View style={styles.quickDateButtons}>
            <TouchableOpacity
              style={[
                styles.quickDateButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setQuickDate(0)}
            >
              <Text
                style={[styles.quickDateButtonText, { color: colors.text }]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickDateButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setQuickDate(1)}
            >
              <Text
                style={[styles.quickDateButtonText, { color: colors.text }]}
              >
                Tomorrow
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.quickDateButton,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setQuickDate(7)}
            >
              <Text
                style={[styles.quickDateButtonText, { color: colors.text }]}
              >
                Next Week
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={[
          styles.footer,
          { backgroundColor: colors.card, borderTopColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.saveButton,
            !taskTitle.trim() && styles.saveButtonDisabled,
          ]}
          onPress={handleSaveTask}
          disabled={!taskTitle.trim()}
        >
          <Text style={styles.saveButtonText}>Save Task</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 28,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  required: {
    color: "#ef4444",
  },
  optional: {
    fontSize: 14,
    fontStyle: "italic",
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  datePickerButtonText: {
    flex: 1,
    fontSize: 16,
  },
  clearDateButton: {
    padding: 4,
  },
  doneButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  doneButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  errorText: {
    color: "#ef4444",
    fontSize: 13,
    marginTop: 6,
  },
  helperText: {
    fontSize: 13,
    marginTop: 6,
  },
  quickDateContainer: {
    marginTop: 8,
  },
  quickDateLabel: {
    fontSize: 14,
    marginBottom: 10,
  },
  quickDateButtons: {
    flexDirection: "row",
    gap: 10,
  },
  quickDateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  quickDateButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#3b82f6",
  },
  saveButtonDisabled: {
    backgroundColor: "#93c5fd",
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
