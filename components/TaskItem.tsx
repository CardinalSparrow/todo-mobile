import { Calendar, Check, Trash2 } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { isOverdue as checkOverdue, formatDate } from "../utils/dateUtils";

const TaskItem = ({ task, onToggle, onDelete }) => {
  const { colors } = useTheme();
  const overdue = checkOverdue(task);

  return (
    <View
      style={[
        styles.taskItem,
        { backgroundColor: colors.card },
        overdue && styles.overdueTask,
      ]}
    >
      <TouchableOpacity
        style={styles.taskCheckbox}
        onPress={() => onToggle(task.id)}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: colors.border },
            task.completed && styles.checkboxChecked,
          ]}
        >
          {task.completed && <Check size={16} color="#fff" />}
        </View>
      </TouchableOpacity>

      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            { color: colors.text },
            task.completed && styles.taskTitleCompleted,
          ]}
        >
          {task.title}
        </Text>
        {task.description !== "" && (
          <Text
            style={[styles.taskDescription, { color: colors.textSecondary }]}
          >
            {task.description}
          </Text>
        )}
        {task.dueDate && (
          <View style={styles.dueDateContainer}>
            <Calendar size={12} color={overdue ? "#ef4444" : "#6b7280"} />
            <Text style={[styles.dueDateText, overdue && styles.overdueText]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  overdueTask: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  taskCheckbox: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    opacity: 0.6,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: "#6b7280",
  },
  overdueText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  deleteButton: {
    padding: 8,
  },
});

export default TaskItem;
