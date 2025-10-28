import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Alert, Platform } from "react-native";

const OPENAI_API_URL = "https://api.openai.com/v1/audio/transcriptions";

const OPENAI_API_KEY = "your-openai-api-key-here";
class VoiceService {
  constructor() {
    this.recording = null;
    this.isRecording = false;
  }

  //  Request microphone permissions

  async requestPermissions() {
    try {
      ``;
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow microphone access to use voice input.",
          [{ text: "OK" }]
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      return false;
    }
  }

  // Start recording audio

  async startRecording() {
    try {
      // Check permissions first
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error("Microphone permission not granted");
      }

      // Configure audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Create and prepare recording
      this.recording = new Audio.Recording();
      await this.recording.prepareToRecordAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // Start recording
      await this.recording.startAsync();
      this.isRecording = true;

      console.log("Recording started");
      return true;
    } catch (error) {
      console.error("Failed to start recording:", error);
      Alert.alert(
        "Recording Error",
        "Failed to start recording. Please try again."
      );
      this.recording = null;
      this.isRecording = false;
      return false;
    }
  }

  //  Stop recording and return the URI

  async stopRecording() {
    try {
      if (!this.recording || !this.isRecording) {
        throw new Error("No active recording");
      }

      await this.recording.stopAndUnloadAsync();
      const uri = this.recording.getURI();

      this.isRecording = false;
      this.recording = null;

      // Reset audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: false,
      });

      console.log("Recording stopped, URI:", uri);
      return uri;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      this.isRecording = false;
      this.recording = null;
      throw error;
    }
  }

  // Transcribe audio file using OpenAI Whisper API Using XMLHttpRequest

  async transcribeAudio(audioUri) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!audioUri) {
          throw new Error("No audio URI provided");
        }

        // Check if API key is configured
        if (!OPENAI_API_KEY) {
          throw new Error(
            "OpenAI API key not configured. Please add your API key in voiceService.js"
          );
        }

        console.log("Starting transcription for:", audioUri);

        // Create FormData
        const formData = new FormData();

        // Prepare file object
        const fileUri =
          Platform.OS === "ios" ? audioUri.replace("file://", "") : audioUri;

        formData.append("file", {
          uri: fileUri,
          type: "audio/m4a",
          name: "recording.m4a",
        });

        formData.append("model", "whisper-1");

        console.log("Uploading to OpenAI Whisper API...");

        const xhr = new XMLHttpRequest();

        xhr.onload = async () => {
          console.log("Response status:", xhr.status);

          if (xhr.status === 200) {
            try {
              const result = JSON.parse(xhr.responseText);
              console.log("Transcription successful:", result.text);

              // Cleanup audio file
              await this.cleanupAudioFile(audioUri);

              resolve(result.text);
            } catch (parseError) {
              console.error("Error parsing response:", parseError);
              await this.cleanupAudioFile(audioUri);
              reject(new Error("Failed to parse transcription response"));
            }
          } else {
            console.error("API Error:", xhr.responseText);
            await this.cleanupAudioFile(audioUri);

            let errorMessage = `Transcription failed: ${xhr.status}`;
            try {
              const errorJson = JSON.parse(xhr.responseText);
              if (errorJson.error?.message) {
                errorMessage = errorJson.error.message;
              }
            } catch (e) {
              errorMessage += ` - ${xhr.responseText}`;
            }

            reject(new Error(errorMessage));
          }
        };

        xhr.onerror = async () => {
          console.error("Network error during upload");
          await this.cleanupAudioFile(audioUri);
          reject(
            new Error("Network error. Please check your internet connection.")
          );
        };

        xhr.ontimeout = async () => {
          console.error("Request timeout");
          await this.cleanupAudioFile(audioUri);
          reject(new Error("Request timeout. Please try again."));
        };

        xhr.open("POST", OPENAI_API_URL);
        xhr.setRequestHeader("Authorization", `Bearer ${OPENAI_API_KEY}`);
        xhr.timeout = 30000; // 30 second timeout

        xhr.send(formData);
      } catch (error) {
        console.error("Transcription error:", error);
        await this.cleanupAudioFile(audioUri);
        reject(error);
      }
    });
  }

  //  Clean up audio file after transcription

  async cleanupAudioFile(audioUri) {
    if (!audioUri) return;

    try {
      // Try new API first
      const file = new FileSystem.File(audioUri);
      await file.delete();
      console.log("Audio file cleaned up (new API)");
    } catch (cleanupError) {
      // Fallback to legacy API
      try {
        await FileSystem.deleteAsync(audioUri, { idempotent: true });
        console.log("Audio file cleaned up (legacy API)");
      } catch (legacyError) {
        console.warn("Could not cleanup audio file:", legacyError);
      }
    }
  }

  /**
   * @param {number} maxDuration - Maximum recording duration in milliseconds (default: 10000)
   */
  async recordAndTranscribe(maxDuration = 10000) {
    let audioUri = null;

    try {
      // Start recording
      const started = await this.startRecording();
      if (!started) {
        throw new Error("Failed to start recording");
      }

      // Wait for max duration or manual stop
      await new Promise((resolve) => setTimeout(resolve, maxDuration));

      // Stop recording
      audioUri = await this.stopRecording();
      if (!audioUri) {
        throw new Error("Failed to get audio URI");
      }

      // Transcribe
      const transcription = await this.transcribeAudio(audioUri);

      return {
        success: true,
        text: transcription,
      };
    } catch (error) {
      console.error("Record and transcribe error:", error);

      // Cleanup recording if it's still active
      if (this.isRecording && this.recording) {
        try {
          await this.recording.stopAndUnloadAsync();
          this.isRecording = false;
          this.recording = null;
        } catch (stopError) {
          console.error("Error stopping recording during cleanup:", stopError);
        }
      }

      return {
        success: false,
        error: error.message || "Recording failed",
      };
    }
  }

  //  Cancel active recording

  async cancelRecording() {
    try {
      if (this.recording && this.isRecording) {
        await this.recording.stopAndUnloadAsync();
        const uri = this.recording.getURI();

        // Delete the cancelled recording
        if (uri) {
          await this.cleanupAudioFile(uri);
        }

        this.isRecording = false;
        this.recording = null;
      }
    } catch (error) {
      console.error("Error cancelling recording:", error);
      this.isRecording = false;
      this.recording = null;
    }
  }

  // Check if currently recording

  getIsRecording() {
    return this.isRecording;
  }
}

export default new VoiceService();
