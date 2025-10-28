export const parseVoiceInput = (transcription) => {
  // Split by "and" (case insensitive)
  const taskPhrases = transcription.split(/\s+and\s+/i);

  return taskPhrases.map((phrase) => {
    const trimmed = phrase.trim();
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);

    return {
      id: `${Date.now()}-${Math.random()}`,
      title: capitalized,
      description: "Added via voice input",
      completed: false,
      createdAt: new Date().toISOString(),
      dueDate: null,
    };
  });
};
