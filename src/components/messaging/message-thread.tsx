"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageInput } from "@/components/messaging/message-input";
import { markMessagesAsReadAction } from "@/actions/messaging/messaging-actions";
import { createClient } from "@/lib/supabase/clients/client";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: {
    id: string;
    users: {
      full_name: string;
      email: string;
      avatar_url: string;
    };
  };
}

interface MessageThreadProps {
  initialMessages: Message[];
  conversationId: string;
  userId: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
}

export function MessageThread({
  initialMessages,
  conversationId,
  userId,
  otherPartyName,
  otherPartyAvatar,
}: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Scroll to bottom on initial load
    scrollToBottom();
    
    // Mark messages as read
    if (messages.some(msg => !msg.read && msg.sender_id !== userId)) {
      markMessagesAsReadAction({ conversationId });
    }
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Fetch the new message with sender info
          fetchMessage(payload.new.id);
          
          // Mark as read if from other party
          if (payload.new.sender_id !== userId) {
            markMessagesAsReadAction({ conversationId });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, messages]);

  const fetchMessage = async (messageId: string) => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:sender_id(
          id,
          users (
            full_name,
            email,
            avatar_url
          )
        )
      `)
      .eq('id', messageId)
      .single();
    
    if (data && !error) {
      setMessages(prev => [...prev, data]);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Format date
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};
    
    messages.forEach(message => {
      const date = new Date(message.created_at).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, messages]) => ({
      date,
      messages,
    }));
  };

  const messageGroups = groupMessagesByDate(messages);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col-reverse">
          {messageGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <div className="mb-4 flex justify-center">
                <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs">
                  {formatMessageDate(group.messages[0].created_at)}
                </span>
              </div>
              <div className="space-y-4">
                {group.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender_id === userId ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex max-w-[80%] ${message.sender_id === userId ? "flex-row-reverse" : "flex-row"}`}>
                      {message.sender_id !== userId && (
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src={otherPartyAvatar} />
                          <AvatarFallback>{getInitials(otherPartyName)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.sender_id === userId
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p>{message.content}</p>
                        </div>
                        <div
                          className={`mt-1 text-xs text-muted-foreground ${
                            message.sender_id === userId ? "text-right" : ""
                          }`}
                        >
                          {formatMessageTime(message.created_at)}
                          {message.sender_id !== userId && message.read && (
                            <span className="ml-1">• Read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground text-center">
                No messages yet. Start the conversation!
              </p>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}