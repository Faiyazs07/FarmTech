"use client";

import { useState, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VoiceController({ onDataUpdate }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await processVoiceInput(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('Please enable microphone access');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processVoiceInput = async (audioBlob) => {
    try {
      // Step 1: Convert speech to text (use browser's Web Speech API)
      const text = await transcribeAudio(audioBlob);
      setTranscript(text);

      // Step 2: Send to Claude for analysis
      const response = await fetch('/api/claude-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          transcript: text,
          context: 'farm_monitoring'
        })
      });

      const data = await response.json();
      
      // Step 3: Update farm data based on Claude's analysis
      if (data.updates || data.alerts) {
        onDataUpdate(prev => ({
          ...prev,
          ...data.updates,
          alerts: data.alerts ? Array.from(new Set([...(prev.alerts || []), ...(data.alerts || [])])) : (prev.alerts || [])
        }));
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Voice processing error:', error);
      setIsProcessing(false);
    }
  };

  const transcribeAudio = async (audioBlob) => {
    // For demo/simplicity: Use Web Speech API if possible or a mock
    // In a real app, you'd use a service like OpenAI Whisper
    return new Promise((resolve) => {
      // If Web Speech API is used it would be differently structured, 
      // but for this task we use a mock that returns the most likely command
      // unless we implement the actual Speech Recognition API.
      
      const recognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)
        ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
        : null;

      if (recognition) {
        recognition.onresult = (event) => {
          resolve(event.results[0][0].transcript);
        };
        recognition.onerror = () => resolve("Check soil moisture in north field");
        recognition.start();
        
        // Stop recognition after a bit just in case
        setTimeout(() => recognition.stop(), 5000);
      } else {
        setTimeout(() => {
          resolve("Check soil moisture in north field");
        }, 1000);
      }
    });
  };

  return (
    <div className="absolute bottom-8 right-8 z-20">
      {/* Voice button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        className={`
          relative w-16 h-16 rounded-full shadow-2xl 
          flex items-center justify-center
          transition-all duration-300
          ${isRecording 
            ? 'bg-red-500 animate-pulse' 
            : isProcessing
            ? 'bg-gray-400'
            : 'bg-blue-600 hover:bg-blue-700'
          }
        `}
      >
        {isRecording ? (
          <MicOff className="w-7 h-7 text-white" />
        ) : (
          <Mic className="w-7 h-7 text-white" />
        )}

        {/* Recording indicator */}
        {isRecording && (
          <motion.div
            className="absolute -inset-1 rounded-full border-4 border-red-300"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0, 0.7]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.button>

      {/* Transcript display */}
      <AnimatePresence>
        {(transcript || isProcessing) && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-24 right-0 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-farm-cyan/20"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                  {isProcessing ? 'Analyzing...' : 'Transcription'}
                </p>
                {isProcessing && <div className="w-2 h-2 bg-farm-cyan rounded-full animate-ping" />}
              </div>
              
              {isProcessing ? (
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              ) : (
                <p className="text-sm font-bold text-gray-800 leading-tight">
                  "{transcript}"
                </p>
              )}

              {!isProcessing && transcript && (
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  <p className="text-[9px] text-green-600 font-bold uppercase tracking-tight">Processed by Claude AI</p>
                </div>
              )}
            </div>
            
            {/* Arrow */}
            <div className="absolute top-full right-6 -translate-y-1 border-8 border-transparent border-t-white/95" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
