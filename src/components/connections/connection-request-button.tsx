"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { createConnectionRequestAction } from "@/actions/connections/connection-actions";
import { Loader2, UserPlus } from "lucide-react";

interface ConnectionRequestButtonProps {
  recipientId: string;
  recipientName: string;
  recipientType: "candidate" | "company";
  status?: {
    exists: boolean;
    status: string;
    senderId: string;
  };
  onRequestSent?: () => void;
}

export function ConnectionRequestButton({ 
  recipientId, 
  recipientName, 
  recipientType,
  status,
  onRequestSent 
}: ConnectionRequestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await createConnectionRequestAction({
        recipientId,
        message,
      });
      
      if (result.error) {
        console.error("Error sending connection request:", result.error);
        return;
      }
      
      setIsOpen(false);
      setMessage("");
      
      if (onRequestSent) {
        onRequestSent();
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // If there's already a connection request
  if (status?.exists) {
    if (status.status === "pending") {
      return (
        <Button variant="outline" disabled>
          {status.senderId === recipientId ? "Request Received" : "Request Sent"}
        </Button>
      );
    } else if (status.status === "accepted") {
      return (
        <Button variant="outline" disabled>
          Connected
        </Button>
      );
    } else if (status.status === "declined") {
      return (
        <Button variant="outline" disabled>
          Request Declined
        </Button>
      );
    }
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserPlus className="mr-2 h-4 w-4" />
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with {recipientName}</DialogTitle>
          <DialogDescription>
            Send a connection request to {recipientName}. 
            {recipientType === "candidate" 
              ? " Once accepted, you'll be able to message this candidate."
              : " Once accepted, you'll be able to message this company."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder={`Add a message to introduce yourself to ${recipientName}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Connection Request"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}