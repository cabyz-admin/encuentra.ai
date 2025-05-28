"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/actions/messaging/messaging-actions";
import { Loader2, Send, Paperclip, Smile } from "lucide-react";
import { createClient } from "@/lib/supabase/clients/client";
import { useUser } from "@/hooks/use-user";

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useUser();
  const supabase = createClient();
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  
  const content = watch("content");
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "60px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);
  
  // Handle typing indicator
  useEffect(() => {
    if (!user) return;
    
    if (content && content.length > 0) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Broadcast typing event
      const channel = supabase.channel(`typing:${conversationId}`);
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.send({
            type: 'broadcast',
            event: 'typing',
            payload: {
              user_id: user.id,
              user_name: user.user_metadata.full_name || user.email,
            },
          });
        }
      });
      
      // Set timeout to clear typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        channel.send({
          type: 'broadcast',
          event: 'stop_typing',
          payload: {
            user_id: user.id,
          },
        });
      }, 3000);
      
      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
      };
    }
  }, [content, conversationId, supabase, user]);
  
  const onSubmit = async (data: FormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Clear typing indicator
      const channel = supabase.channel(`typing:${conversationId}`);
      channel.send({
        type: 'broadcast',
        event: 'stop_typing',
        payload: {
          user_id: user.id,
        },
      });
      
      const result = await sendMessageAction({
        conversationId,
        content: data.content,
      });
      
      if (result.error) {
        console.error("Error sending message:", result.error);
        return;
      }
      
      reset();
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "60px";
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
      <div className="flex items-end gap-2">
        <div className="relative flex-1">
          <Textarea
            {...register("content")}
            placeholder="Type your message..."
            className="min-h-[60px] pr-10 resize-none"
            onKeyDown={handleKeyDown}
            ref={(e) => {
              register("content").ref(e);
              textareaRef.current = e;
            }}
          />
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="absolute bottom-2 right-2 h-6 w-6 text-muted-foreground"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button type="button" size="icon" variant="outline">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button type="submit" size="icon" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      {errors.content && (
        <p className="text-destructive text-xs">{errors.content.message}</p>
      )}
    </form>
  );
}