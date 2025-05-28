import { createClient } from "@/lib/supabase/clients/server";
import { TablesInsert } from "../types/db";

export async function createConversation(
  initiatorId: string,
  recipientId: string
) {
  const supabase = createClient();

  try {
    // Check if conversation already exists
    const { data: existingConversation, error: checkError } = await supabase
      .from("conversations")
      .select("*")
      .or(`and(initiator_id.eq.${initiatorId},recipient_id.eq.${recipientId}),and(initiator_id.eq.${recipientId},recipient_id.eq.${initiatorId})`)
      .maybeSingle();

    if (checkError) throw checkError;

    // If conversation exists, return it
    if (existingConversation) {
      return { data: existingConversation, error: null };
    }

    // Create new conversation
    const { data, error } = await supabase
      .from("conversations")
      .insert({
        initiator_id: initiatorId,
        recipient_id: recipientId,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating conversation:", error);
    return { data: null, error };
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  const supabase = createClient();

  try {
    // Insert message
    const { data: message, error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      })
      .select()
      .single();

    if (messageError) throw messageError;

    // Update conversation updated_at timestamp
    const { error: updateError } = await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);

    if (updateError) throw updateError;

    return { data: message, error: null };
  } catch (error) {
    console.error("Error sending message:", error);
    return { data: null, error };
  }
}

export async function markMessagesAsRead(
  conversationId: string,
  userId: string
) {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("messages")
      .update({ read: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("read", false);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { error };
  }
}