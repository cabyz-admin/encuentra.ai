import { createClient } from "@/lib/supabase/clients/server";
import { createConversation } from "./messaging";

export async function createConnectionRequest(
  senderId: string,
  recipientId: string,
  message?: string
) {
  const supabase = createClient();

  try {
    // Check if connection request already exists
    const { data: existingRequest, error: checkError } = await supabase
      .from("connection_requests")
      .select("*")
      .or(`and(sender_id.eq.${senderId},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${senderId})`)
      .maybeSingle();

    if (checkError) throw checkError;

    // If connection request exists, return it
    if (existingRequest) {
      return { data: existingRequest, error: null };
    }

    // Create new connection request
    const { data, error } = await supabase
      .from("connection_requests")
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        message,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating connection request:", error);
    return { data: null, error };
  }
}

export async function respondToConnectionRequest(
  connectionId: string,
  userId: string,
  accepted: boolean,
  message?: string
) {
  const supabase = createClient();

  try {
    // Get the connection request
    const { data: connectionRequest, error: fetchError } = await supabase
      .from("connection_requests")
      .select("*")
      .eq("id", connectionId)
      .eq("recipient_id", userId) // Ensure the user is the recipient
      .eq("status", "pending") // Only pending requests can be responded to
      .single();

    if (fetchError) throw fetchError;
    if (!connectionRequest) {
      throw new Error("Connection request not found or already processed");
    }

    // Update the connection request status
    const { data, error } = await supabase
      .from("connection_requests")
      .update({
        status: accepted ? "accepted" : "declined",
        response_message: message,
        responded_at: new Date().toISOString(),
      })
      .eq("id", connectionId)
      .select()
      .single();

    if (error) throw error;

    // If accepted, create a conversation
    if (accepted) {
      await createConversation(
        connectionRequest.sender_id,
        connectionRequest.recipient_id
      );
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error responding to connection request:", error);
    return { data: null, error };
  }
}

export async function getConnectionStatus(
  userId: string,
  otherUserId: string
) {
  const supabase = createClient();

  try {
    // Check if there's a connection request between the users
    const { data, error } = await supabase
      .from("connection_requests")
      .select("*")
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .maybeSingle();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error getting connection status:", error);
    return { data: null, error };
  }
}