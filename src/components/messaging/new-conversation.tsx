"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createConversationAction, sendMessageAction } from "@/actions/messaging/messaging-actions";
import { Loader2 } from "lucide-react";

interface NewConversationProps {
  recipientId: string;
  recipientName: string;
}

export function NewConversation({ recipientId, recipientName }: NewConversationProps) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Create conversation
      const { data: conversation, error } = await createConversationAction({
        recipientId,
      });
      
      if (error || !conversation) {
        console.error("Error creating conversation:", error);
        return;
      }
      
      // Send initial message
      const { error: messageError } = await sendMessageAction({
        conversationId: conversation.id,
        content: message,
      });
      
      if (messageError) {
        console.error("Error sending message:", messageError);
        return;
      }
      
      // Redirect to conversation
      router.push(`/messages/${conversation.id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-medium">New Message to {recipientName}</h2>
        <p className="text-muted-foreground text-sm">
          Start a conversation with this {recipientId.includes("company") ? "company" : "candidate"}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Write your message to ${recipientName}...`}
          className="min-h-[120px]"
          required
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
}