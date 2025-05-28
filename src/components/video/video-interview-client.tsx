"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { VideoInterview } from "@/components/video/video-interview";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";

interface VideoInterviewClientProps {
  questions: string[];
}

export function VideoInterviewClient({ questions }: VideoInterviewClientProps) {
  const [isStarted, setIsStarted] = useState(false);
  const router = useRouter();
  
  const handleComplete = (recordings: Blob[]) => {
    // In a real implementation, we would upload the recordings to storage
    // and save the URLs to the database
    console.log("Recordings completed:", recordings);
    
    // For now, just redirect to the completed page
    router.push("/video-interview?completed=true");
  };
  
  const handleCancel = () => {
    setIsStarted(false);
  };
  
  if (!isStarted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ready to Start?</CardTitle>
          <CardDescription>
            You'll be asked {questions.length} questions about your background and experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            This video interview will help you stand out and get better matches. 
            Your responses will be analyzed to highlight your strengths and personality.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setIsStarted(true)} className="w-full">
            <Camera className="mr-2 h-4 w-4" />
            Start Video Interview
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <VideoInterview 
      questions={questions} 
      onComplete={handleComplete} 
      onCancel={handleCancel} 
    />
  );
}