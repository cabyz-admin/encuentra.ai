"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { respondToConnectionRequestAction } from "@/actions/connections/connection-actions";
import { Loader2, Check, X } from "lucide-react";

interface ConnectionRequestCardProps {
  request: {
    id: string;
    sender_id: string;
    recipient_id: string;
    message?: string;
    status: string;
    created_at: string;
    sender: {
      id: string;
      users: {
        full_name: string;
        email: string;
        avatar_url?: string;
      };
      user_profiles: {
        user_type: string;
      };
      candidate_profiles?: {
        headline?: string;
        location?: string;
        experience_level?: string;
      };
      company_profiles?: {
        company_name: string;
        industry?: string;
        headquarters_location?: string;
      };
    };
  };
  onRespond?: () => void;
}

export function ConnectionRequestCard({ request, onRespond }: ConnectionRequestCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [showResponseInput, setShowResponseInput] = useState(false);
  
  const isCompany = request.sender.user_profiles.user_type === "company";
  
  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await respondToConnectionRequestAction({
        connectionId: request.id,
        accepted: true,
        message: responseMessage,
      });
      
      if (onRespond) {
        onRespond();
      }
    } catch (error) {
      console.error("Error accepting connection request:", error);
    } finally {
      setIsAccepting(false);
    }
  };
  
  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await respondToConnectionRequestAction({
        connectionId: request.id,
        accepted: false,
        message: responseMessage,
      });
      
      if (onRespond) {
        onRespond();
      }
    } catch (error) {
      console.error("Error declining connection request:", error);
    } finally {
      setIsDeclining(false);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={request.sender.users.avatar_url} />
              <AvatarFallback>
                {isCompany 
                  ? getInitials(request.sender.company_profiles?.company_name || "Company") 
                  : getInitials(request.sender.users.full_name || "User")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base">
                {isCompany 
                  ? request.sender.company_profiles?.company_name 
                  : request.sender.users.full_name}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {isCompany 
                  ? request.sender.company_profiles?.industry 
                  : request.sender.candidate_profiles?.headline}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {formatDate(request.created_at)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {request.message && (
          <div className="mb-4">
            <p className="text-sm">{request.message}</p>
          </div>
        )}
        
        {showResponseInput && (
          <div className="mb-4">
            <Textarea
              placeholder="Add a response message (optional)"
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setShowResponseInput(!showResponseInput)}
        >
          {showResponseInput ? "Hide Response" : "Add Response"}
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="destructive" 
            onClick={handleDecline}
            disabled={isAccepting || isDeclining}
          >
            {isDeclining ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <X className="mr-2 h-4 w-4" />
            )}
            Decline
          </Button>
          <Button 
            onClick={handleAccept}
            disabled={isAccepting || isDeclining}
          >
            {isAccepting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Accept
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}