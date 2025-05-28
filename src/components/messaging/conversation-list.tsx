"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/clients/client";
import { Loader2 } from "lucide-react";

interface Conversation {
  id: string;
  initiator_id: string;
  recipient_id: string;
  created_at: string;
  updated_at: string;
  initiator: any;
  recipient: any;
  messages: any[];
}

export function ConversationList({ initialConversations, userId }: { initialConversations: Conversation[]; userId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `initiator_id=eq.${userId},recipient_id=eq.${userId}`,
        },
        (payload) => {
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, router]);

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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground text-center">
          No conversations yet. Start by browsing candidates or companies and reaching out!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => {
        // Determine the other party in the conversation
        const otherParty = conversation.initiator_id === userId
          ? conversation.recipient
          : conversation.initiator;
        
        // Get the latest message
        const latestMessage = conversation.messages && conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1]
          : null;
        
        // Determine name and avatar based on user type
        let name = otherParty?.users?.full_name || "User";
        let subtitle = "";
        let avatarUrl = otherParty?.users?.avatar_url;
        
        if (otherParty?.user_profiles?.user_type === "candidate") {
          subtitle = otherParty?.candidate_profiles?.headline || "Candidate";
        } else if (otherParty?.user_profiles?.user_type === "company") {
          name = otherParty?.company_profiles?.company_name || name;
          subtitle = otherParty?.company_profiles?.industry || "Company";
          avatarUrl = otherParty?.company_profiles?.logo_url || avatarUrl;
        }
        
        const hasUnread = latestMessage && 
                          !latestMessage.read && 
                          latestMessage.sender_id !== userId;
        
        return (
          <Link
            key={conversation.id}
            href={`/messages/${conversation.id}`}
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/50"
          >
            <Avatar>
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{name}</h3>
                {latestMessage && (
                  <span className="text-muted-foreground text-xs">
                    {formatDate(latestMessage.created_at)}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm truncate">
                  {latestMessage ? latestMessage.content : subtitle}
                </p>
                {hasUnread && (
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}