"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/clients/client";

interface RealtimePresenceProps {
  userId: string;
  channelName: string;
  children: (isOnline: boolean) => React.ReactNode;
}

export function RealtimePresence({ userId, channelName, children }: RealtimePresenceProps) {
  const [isOnline, setIsOnline] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase.channel(channelName);

    // Set up presence
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userPresence = Object.values(state).flat().some(
          (presence: any) => presence.user_id === userId
        );
        setIsOnline(userPresence);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        const userJoined = newPresences.some(
          (presence: any) => presence.user_id === userId
        );
        if (userJoined) {
          setIsOnline(true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        const userLeft = leftPresences.some(
          (presence: any) => presence.user_id === userId
        );
        if (userLeft) {
          setIsOnline(false);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: userId, online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId, channelName]);

  return <>{children(isOnline)}</>;
}