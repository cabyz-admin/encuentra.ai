"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { sendMessageAction } from "@/actions/messaging/messaging-actions";
import { Loader2, Send } from "lucide-react";

const formSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await sendMessageAction({
        conversationId,
        content: data.content,
      });
      
      if (result.error) {
        console.error("Error sending message:", result.error);
        return;
      }
      
      reset();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
      <div className="flex-1">
        <Textarea
          placeholder="Type your message..."
          className="min-h-[60px] resize-none"
          {...register("content")}
        />
        {errors.content && (
          <p className="text-destructive text-xs mt-1">{errors.content.message}</p>
        )}
      </div>
      <Button type="submit" size="icon" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
}