"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/clients/client";

interface TypingIndicatorProps {
  conversationId: string;
  userId: string;
}

export function TypingIndicator({ conversationId, userId }: TypingIndicatorProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(`typing:${conversationId}`);

    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload.user_id !== userId) {
          setIsTyping(true);
          setTypingUser(payload.payload.user_name || "Someone");
          
          // Auto-clear typing indicator after 3 seconds
          setTimeout(() => {
            setIsTyping(false);
          }, 3000);
        }
      })
      .on('broadcast', { event: 'stop_typing' }, (payload) => {
        if (payload.payload.user_id !== userId) {
          setIsTyping(false);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, conversationId, userId]);

  if (!isTyping) return null;

  return (
    <div className="flex items-center text-muted-foreground text-xs italic px-4 py-2">
      <div className="flex space-x-1 mr-2">
        <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
        <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
        <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
      </div>
      <span>{typingUser} is typing...</span>
    </div>
  );
}