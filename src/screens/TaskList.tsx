// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { StatusBar } from "expo-status-bar";
// import {
//   Calendar,
//   Check,
//   Mic,
//   Moon,
//   Plus,
//   Search,
//   Sun,
//   Trash2,
// } from "lucide-react-native";
// import React, { useEffect, useState } from "react";
// import {
//   Alert,
//   FlatList,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";

// const TaskListScreen = ({ navigation, route }) => {
//   const [tasks, setTasks] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isListening, setIsListening] = useState(false);
//   const [isDarkTheme, setIsDarkTheme] = useState(false);

//   // Load tasks and theme on mount
//   useEffect(() => {
//     loadTasks();
//     loadTheme();
//   }, []);

//   // Save tasks whenever they change
//   useEffect(() => {
//     if (tasks.length >= 0) {
//       saveTasks();
//     }
//   }, [tasks]);

//   // Storage functions
//   const loadTasks = async () => {
//     try {
//       const storedTasks = await AsyncStorage.getItem("@tasks");
//       if (storedTasks) {
//         setTasks(JSON.parse(storedTasks));
//       }
//     } catch (error) {
//       console.error("Error loading tasks:", error);
//     }
//   };

//   const saveTasks = async () => {
//     try {
//       await AsyncStorage.setItem("@tasks", JSON.stringify(tasks));
//     } catch (error) {
//       console.error("Error saving tasks:", error);
//     }
//   };

//   const loadTheme = async () => {
//     try {
//       const theme = await AsyncStorage.getItem("@theme");
//       if (theme) {
//         setIsDarkTheme(theme === "dark");
//       }
//     } catch (error) {
//       console.error("Error loading theme:", error);
//     }
//   };

//   const toggleTheme = async () => {
//     const newTheme = !isDarkTheme;
//     setIsDarkTheme(newTheme);
//     try {
//       await AsyncStorage.setItem("@theme", newTheme ? "dark" : "light");
//     } catch (error) {
//       console.error("Error saving theme:", error);
//     }
//   };

//   // Task operations
//   const toggleTaskComplete = (taskId) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === taskId ? { ...task, completed: !task.completed } : task
//       )
//     );
//   };

//   const deleteTask = (taskId) => {
//     Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Delete",
//         style: "destructive",
//         onPress: () => setTasks(tasks.filter((task) => task.id !== taskId)),
//       },
//     ]);
//   };

//   // Voice input simulation
//   const startVoiceInput = () => {
//     setIsListening(true);

//     // Simulate voice recording and transcription
//     // In production, this would use expo-av and OpenAI Whisper API
//     setTimeout(() => {
//       const simulatedTranscription = "Buy provisions and call mom";
//       processVoiceInput(simulatedTranscription);
//       setIsListening(false);
//     }, 2000);
//   };

//   const processVoiceInput = (transcription) => {
//     // Split by "and" to create multiple tasks
//     const taskPhrases = transcription.split(/\s+and\s+/i);

//     const newTasks = taskPhrases.map((phrase) => {
//       const trimmed = phrase.trim();
//       const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

//       return {
//         id: `${Date.now()}-${Math.random()}`,
//         title: capitalized,
//         description: "Added via voice input",
//         completed: false,
//         createdAt: new Date().toISOString(),
//         dueDate: null,
//       };
//     });

//     setTasks([...newTasks, ...tasks]);
//     Alert.alert("Success", `Added ${newTasks.length} task(s) from voice input`);
//   };

//   // Filter and sort tasks
//   const getFilteredTasks = () => {
//     let filtered = tasks;

//     if (searchQuery.trim() !== "") {
//       filtered = filtered.filter(
//         (task) =>
//           task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//           task.description.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//     }

//     return filtered.sort((a, b) => {
//       if (a.dueDate && b.dueDate) {
//         return new Date(a.dueDate) - new Date(b.dueDate);
//       }
//       if (a.dueDate) return -1;
//       if (b.dueDate) return 1;
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//   };

//   // Utility functions
//   const formatDate = (dateString) => {
//     if (!dateString) return null;
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   const isOverdue = (task) => {
//     if (!task.dueDate || task.completed) return false;
//     return new Date(task.dueDate) < new Date();
//   };

//   // Theme colors
//   const colors = isDarkTheme
//     ? {
//         background: "#111827",
//         card: "#1f2937",
//         text: "#f9fafb",
//         textSecondary: "#9ca3af",
//         border: "#374151",
//       }
//     : {
//         background: "#f9fafb",
//         card: "#ffffff",
//         text: "#111827",
//         textSecondary: "#6b7280",
//         border: "#e5e7eb",
//       };

//   const filteredTasks = getFilteredTasks();
//   const completedCount = tasks.filter((t) => t.completed).length;
//   const totalCount = tasks.length;

//   // Render task item
//   const renderTask = ({ item }) => (
//     <View
//       style={[
//         styles.taskItem,
//         { backgroundColor: colors.card },
//         isOverdue(item) && styles.overdueTask,
//       ]}
//     >
//       <TouchableOpacity
//         style={styles.taskCheckbox}
//         onPress={() => toggleTaskComplete(item.id)}
//       >
//         <View
//           style={[
//             styles.checkbox,
//             { borderColor: colors.border },
//             item.completed && styles.checkboxChecked,
//           ]}
//         >
//           {item.completed && <Check size={16} color="#fff" />}
//         </View>
//       </TouchableOpacity>

//       <View style={styles.taskContent}>
//         <Text
//           style={[
//             styles.taskTitle,
//             { color: colors.text },
//             item.completed && styles.taskTitleCompleted,
//           ]}
//         >
//           {item.title}
//         </Text>
//         {item.description !== "" && (
//           <Text
//             style={[styles.taskDescription, { color: colors.textSecondary }]}
//           >
//             {item.description}
//           </Text>
//         )}
//         {item.dueDate && (
//           <View style={styles.dueDateContainer}>
//             <Calendar
//               size={12}
//               color={isOverdue(item) ? "#ef4444" : "#6b7280"}
//             />
//             <Text
//               style={[
//                 styles.dueDateText,
//                 isOverdue(item) && styles.overdueText,
//               ]}
//             >
//               {formatDate(item.dueDate)}
//             </Text>
//           </View>
//         )}
//       </View>

//       <TouchableOpacity
//         style={styles.deleteButton}
//         onPress={() => deleteTask(item.id)}
//       >
//         <Trash2 size={20} color="#ef4444" />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar style={isDarkTheme ? "light" : "dark"} />

//       {/* Header */}
//       <View
//         style={[
//           styles.header,
//           { backgroundColor: colors.card, borderBottomColor: colors.border },
//         ]}
//       >
//         <Text style={[styles.headerTitle, { color: colors.text }]}>
//           My Tasks
//         </Text>
//         <View style={styles.headerActions}>
//           <Text style={[styles.taskCount, { color: colors.textSecondary }]}>
//             {completedCount}/{totalCount}
//           </Text>
//           <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
//             {isDarkTheme ? (
//               <Sun size={24} color="#fbbf24" />
//             ) : (
//               <Moon size={24} color="#6b7280" />
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Search Bar */}
//       <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
//         <Search size={20} color="#6b7280" />
//         <TextInput
//           style={[styles.searchInput, { color: colors.text }]}
//           placeholder="Search tasks..."
//           placeholderTextColor="#9ca3af"
//           value={searchQuery}
//           onChangeText={setSearchQuery}
//         />
//       </View>

//       {/* Task List */}
//       {filteredTasks.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Text
//             style={[styles.emptyStateText, { color: colors.textSecondary }]}
//           >
//             {searchQuery
//               ? "No tasks found"
//               : "No tasks yet. Add one to get started!"}
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredTasks}
//           renderItem={renderTask}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.taskList}
//         />
//       )}

//       {/* Floating Action Buttons */}
//       <View style={styles.fabContainer}>
//         <TouchableOpacity
//           style={[
//             styles.fab,
//             styles.fabVoice,
//             isListening && styles.fabListening,
//           ]}
//           onPress={startVoiceInput}
//           disabled={isListening}
//         >
//           <Mic size={24} color="#fff" />
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.fab, styles.fabAdd]}
//           onPress={() => navigation.navigate("AddTask", { isDarkTheme })}
//         >
//           <Plus size={28} color="#fff" />
//         </TouchableOpacity>
//       </View>

//       {/* Voice Listening Indicator */}
//       {isListening && (
//         <View style={styles.listeningOverlay}>
//           <View style={[styles.listeningBox, { backgroundColor: colors.card }]}>
//             <Mic size={48} color="#3b82f6" />
//             <Text style={[styles.listeningText, { color: colors.text }]}>
//               Listening...
//             </Text>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     paddingTop: 60,
//     paddingBottom: 20,
//     paddingHorizontal: 20,
//     borderBottomWidth: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   headerTitle: { fontSize: 32, fontWeight: "bold" },
//   headerActions: { flexDirection: "row", alignItems: "center", gap: 15 },
//   taskCount: { fontSize: 16, fontWeight: "600" },
//   themeToggle: { padding: 5 },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 20,
//     marginTop: 15,
//     marginBottom: 10,
//     paddingHorizontal: 15,
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 10,
//   },
//   searchInput: { flex: 1, fontSize: 16 },
//   taskList: { padding: 20, paddingBottom: 100 },
//   taskItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   overdueTask: { borderLeftWidth: 4, borderLeftColor: "#ef4444" },
//   taskCheckbox: { marginRight: 12 },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderRadius: 6,
//     borderWidth: 2,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   checkboxChecked: { backgroundColor: "#10b981", borderColor: "#10b981" },
//   taskContent: { flex: 1 },
//   taskTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
//   taskTitleCompleted: { textDecorationLine: "line-through", opacity: 0.6 },
//   taskDescription: { fontSize: 14, marginBottom: 4 },
//   dueDateContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     marginTop: 4,
//   },
//   dueDateText: { fontSize: 12, color: "#6b7280" },
//   overdueText: { color: "#ef4444", fontWeight: "600" },
//   deleteButton: { padding: 8 },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   emptyStateText: { fontSize: 18, textAlign: "center" },
//   fabContainer: { position: "absolute", bottom: 30, right: 20, gap: 15 },
//   fab: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 8,
//   },
//   fabAdd: { backgroundColor: "#3b82f6" },
//   fabVoice: {
//     backgroundColor: "#8b5cf6",
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//   },
//   fabListening: { backgroundColor: "#ef4444" },
//   listeningOverlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0, 0, 0, 0.7)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   listeningBox: {
//     padding: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     gap: 15,
//   },
//   listeningText: { fontSize: 18, fontWeight: "600" },
// });

// export default TaskListScreen;

import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  Check,
  Mic,
  Moon,
  Plus,
  Search,
  Sun,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import voiceService from "../../services/VoiceService";
import { parseVoiceInput, validateTasks } from "../../utils/TaskParser";

const TaskListScreen = ({ navigation, route }) => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState("");

  // Load tasks and theme on mount
  useEffect(() => {
    loadTasks();
    loadTheme();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length >= 0) {
      saveTasks();
    }
  }, [tasks]);

  // Recording timer
  useEffect(() => {
    let interval;
    if (isListening) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);

  // Storage functions
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("@tasks");
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem("@tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem("@theme");
      if (theme) {
        setIsDarkTheme(theme === "dark");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    try {
      await AsyncStorage.setItem("@theme", newTheme ? "dark" : "light");
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  // Task operations
  const toggleTaskComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks(tasks.filter((task) => task.id !== taskId)),
      },
    ]);
  };

  // Real voice input implementation
  const startVoiceInput = async () => {
    try {
      setIsListening(true);
      setTranscriptionText("");

      const started = await voiceService.startRecording();
      if (!started) {
        setIsListening(false);
        return;
      }

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (voiceService.getIsRecording()) {
          stopVoiceInput();
        }
      }, 10000);
    } catch (error) {
      console.error("Error starting voice input:", error);
      Alert.alert("Error", "Failed to start recording: " + error.message);
      setIsListening(false);
    }
  };

  const stopVoiceInput = async () => {
    try {
      setIsListening(false);
      setIsTranscribing(true);

      const audioUri = await voiceService.stopRecording();
      if (!audioUri) {
        throw new Error("No audio recorded");
      }

      // Transcribe the audio
      const transcription = await voiceService.transcribeAudio(audioUri);
      console.log("Transcription:", transcription);

      if (!transcription || transcription.trim().length === 0) {
        Alert.alert(
          "No Speech Detected",
          "Please try again and speak clearly."
        );
        setIsTranscribing(false);
        return;
      }

      setTranscriptionText(transcription);

      // Parse the transcription into tasks
      const newTasks = parseVoiceInput(transcription);
      const validTasks = validateTasks(newTasks);

      if (validTasks.length === 0) {
        Alert.alert(
          "No Tasks Detected",
          `I heard: "${transcription}"\n\nBut couldn't parse any tasks. Try saying something like "Buy groceries and call mom".`
        );
        setIsTranscribing(false);
        return;
      }

      // Add the tasks
      setTasks([...validTasks, ...tasks]);

      // Show success message
      Alert.alert(
        "Success! 🎉",
        `Added ${validTasks.length} task(s):\n\n${validTasks
          .map((t) => `• ${t.title}`)
          .join("\n")}`,
        [{ text: "OK", onPress: () => setTranscriptionText("") }]
      );

      setIsTranscribing(false);
    } catch (error) {
      console.error("Error processing voice input:", error);
      setIsTranscribing(false);

      let errorMessage = "Failed to process voice input.";
      if (error.message.includes("API key")) {
        errorMessage =
          "OpenAI API key not configured. Please add your API key in voiceService.js";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = error.message;
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const cancelVoiceInput = async () => {
    await voiceService.cancelRecording();
    setIsListening(false);
    setIsTranscribing(false);
    setTranscriptionText("");
  };

  // Filter and sort tasks
  const getFilteredTasks = () => {
    let filtered = tasks;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Utility functions
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  // Theme colors
  const colors = isDarkTheme
    ? {
        background: "#111827",
        card: "#1f2937",
        text: "#f9fafb",
        textSecondary: "#9ca3af",
        border: "#374151",
      }
    : {
        background: "#f9fafb",
        card: "#ffffff",
        text: "#111827",
        textSecondary: "#6b7280",
        border: "#e5e7eb",
      };

  const filteredTasks = getFilteredTasks();
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  // Render task item
  const renderTask = ({ item }) => (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: colors.card },
        isOverdue(item) && styles.overdueTask,
      ]}
    >
      <TouchableOpacity
        style={styles.taskCheckbox}
        onPress={() => toggleTaskComplete(item.id)}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: colors.border },
            item.completed && styles.checkboxChecked,
          ]}
        >
          {item.completed && <Check size={16} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            { color: colors.text },
            item.completed && styles.taskTitleCompleted,
          ]}
        >
          {item.title}
        </Text>
        {item.description !== "" && (
          <Text
            style={[styles.taskDescription, { color: colors.textSecondary }]}
          >
            {item.description}
          </Text>
        )}
        {item.dueDate && (
          <View style={styles.dueDateContainer}>
            <Calendar
              size={12}
              color={isOverdue(item) ? "#ef4444" : "#6b7280"}
            />
            <Text
              style={[
                styles.dueDateText,
                isOverdue(item) && styles.overdueText,
              ]}
            >
              {formatDate(item.dueDate)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkTheme ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.card, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          My Tasks
        </Text>
        <View style={styles.headerActions}>
          <Text style={[styles.taskCount, { color: colors.textSecondary }]}>
            {completedCount}/{totalCount}
          </Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            {isDarkTheme ? (
              <Sun size={24} color="#fbbf24" />
            ) : (
              <Moon size={24} color="#6b7280" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <Search size={20} color="#6b7280" />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search tasks..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text
            style={[styles.emptyStateText, { color: colors.textSecondary }]}
          >
            {searchQuery
              ? "No tasks found"
              : "No tasks yet. Add one to get started!"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.taskList}
        />
      )}

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            styles.fabVoice,
            isListening && styles.fabListening,
          ]}
          onPress={isListening ? stopVoiceInput : startVoiceInput}
          disabled={isTranscribing}
        >
          {isTranscribing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Mic size={24} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.fab, styles.fabAdd]}
          onPress={() => navigation.navigate("AddTask", { isDarkTheme })}
        >
          <Plus size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Voice Recording Modal */}
      <Modal
        visible={isListening || isTranscribing}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {isListening && (
              <>
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseOuter} />
                  <View style={styles.pulseMiddle} />
                  <Mic size={48} color="#3b82f6" />
                </View>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Listening...
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  {recordingTime}s / 10s
                </Text>
                <Text
                  style={[styles.modalHint, { color: colors.textSecondary }]}
                >
                  Say something like "Buy groceries and call dentist"
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelVoiceInput}
                >
                  <X size={20} color="#ef4444" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
            {isTranscribing && (
              <>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text
                  style={[
                    styles.modalTitle,
                    { color: colors.text, marginTop: 20 },
                  ]}
                >
                  Processing...
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Transcribing your voice
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 32, fontWeight: "bold" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 15 },
  taskCount: { fontSize: 16, fontWeight: "600" },
  themeToggle: { padding: 5 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 16 },
  taskList: { padding: 20, paddingBottom: 100 },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overdueTask: { borderLeftWidth: 4, borderLeftColor: "#ef4444" },
  taskCheckbox: { marginRight: 12 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: { backgroundColor: "#10b981", borderColor: "#10b981" },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  taskTitleCompleted: { textDecorationLine: "line-through", opacity: 0.6 },
  taskDescription: { fontSize: 14, marginBottom: 4 },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  dueDateText: { fontSize: 12, color: "#6b7280" },
  overdueText: { color: "#ef4444", fontWeight: "600" },
  deleteButton: { padding: 8 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateText: { fontSize: 18, textAlign: "center" },
  fabContainer: { position: "absolute", bottom: 30, right: 20, gap: 15 },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabAdd: { backgroundColor: "#3b82f6" },
  fabVoice: {
    backgroundColor: "#8b5cf6",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fabListening: { backgroundColor: "#ef4444" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minWidth: 300,
    maxWidth: "80%",
  },
  pulseContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  pulseOuter: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(59, 130, 246, 0.1)",
  },
  pulseMiddle: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalHint: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  cancelButtonText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default TaskListScreen;
