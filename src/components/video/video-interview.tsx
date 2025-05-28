"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Video, Mic, MicOff, VideoOff, Camera, RefreshCw } from "lucide-react";

interface VideoInterviewProps {
  questions: string[];
  onComplete: (recordings: Blob[]) => void;
  onCancel: () => void;
}

export function VideoInterview({ questions, onComplete, onCancel }: VideoInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 for setup screen
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Blob[]>([]);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoEnabled,
          audio: audioEnabled,
        });
        
        setStream(mediaStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
        setError("Could not access camera or microphone. Please check your permissions.");
      }
    };
    
    initializeMedia();
    
    return () => {
      // Clean up media stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [videoEnabled, audioEnabled]);
  
  // Handle recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  // Handle countdown
  useEffect(() => {
    if (countdown > 0 && currentQuestionIndex >= 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isRecording && currentQuestionIndex >= 0) {
      startRecording();
    }
  }, [countdown, currentQuestionIndex, isRecording]);
  
  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      setRecordings(prev => [...prev, blob]);
      setRecordingTime(0);
    };
    
    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handleNextQuestion = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCountdown(3);
    } else {
      // All questions completed
      onComplete(recordings);
    }
  };
  
  const handleRetake = () => {
    // Remove the last recording
    setRecordings(prev => prev.slice(0, -1));
    // Reset countdown and start again
    setCountdown(3);
  };
  
  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };
  
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            There was a problem accessing your camera or microphone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onCancel}>Cancel</Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>
          {currentQuestionIndex === -1 
            ? "Video Interview Setup" 
            : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
        </CardTitle>
        <CardDescription>
          {currentQuestionIndex === -1 
            ? "Make sure your camera and microphone are working properly" 
            : questions[currentQuestionIndex]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video 
            ref={videoRef} 
            autoPlay 
            muted={!audioEnabled} 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          {!stream && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          
          {countdown > 0 && currentQuestionIndex >= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-6xl font-bold text-white">{countdown}</div>
            </div>
          )}
          
          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
              <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>{formatTime(recordingTime)}</span>
            </div>
          )}
          
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={toggleVideo}
              className="bg-black/50 hover:bg-black/70"
            >
              {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              onClick={toggleAudio}
              className="bg-black/50 hover:bg-black/70"
            >
              {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {currentQuestionIndex === -1 ? (
          <>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => setCurrentQuestionIndex(0)}>
              Start Interview
            </Button>
          </>
        ) : isRecording ? (
          <Button 
            variant="destructive" 
            onClick={stopRecording}
            className="ml-auto"
          >
            Stop Recording
          </Button>
        ) : recordings.length > currentQuestionIndex ? (
          <>
            <Button variant="outline" onClick={handleRetake}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete Interview"}
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => setCountdown(3)}
            className="ml-auto"
          >
            <Camera className="mr-2 h-4 w-4" />
            Start Recording
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}