"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { likeUserAction, recordBehavioralDataAction } from "@/actions/matching/matching-actions";
import { ConnectionRequestButton } from "@/components/connections/connection-request-button";
import { Loader2, ThumbsDown, ThumbsUp, MessageSquare, MapPin, Briefcase } from "lucide-react";
import Link from "next/link";

interface MatchCardProps {
  match: {
    id: string;
    score: number;
    score_breakdown?: any;
    candidate?: {
      id: string;
      headline?: string;
      location?: string;
      experience_level?: string;
      years_of_experience?: number;
      avatar_url?: string;
      candidate_skills?: {
        skill_name: string;
        proficiency: string;
      }[];
      users: {
        full_name: string;
        email: string;
        avatar_url?: string;
      };
    };
    company?: {
      id: string;
      company_name: string;
      industry?: string;
      headquarters_location?: string;
      logo_url?: string;
      company_job_interests?: {
        id: string;
        title: string;
        skills?: string[];
      }[];
      users: {
        full_name: string;
        email: string;
        avatar_url?: string;
      };
    };
  };
  userType: "candidate" | "company";
  isLiked?: boolean;
  connectionStatus?: {
    exists: boolean;
    status: string;
    senderId: string;
  };
  onAction?: () => void;
}

export function MatchCard({ match, userType, isLiked = false, connectionStatus, onAction }: MatchCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDisliking, setIsDisliking] = useState(false);
  const [liked, setLiked] = useState(isLiked);
  
  const targetId = userType === "candidate" ? match.company?.id : match.candidate?.id;
  const targetName = userType === "candidate" 
    ? match.company?.company_name 
    : match.candidate?.users.full_name;
  const targetAvatar = userType === "candidate"
    ? match.company?.logo_url || match.company?.users.avatar_url
    : match.candidate?.avatar_url || match.candidate?.users.avatar_url;
  
  const handleLike = async () => {
    if (!targetId) return;
    
    setIsLiking(true);
    try {
      const result = await likeUserAction({ userId: targetId });
      
      if (result.error) {
        console.error("Error liking user:", result.error);
        return;
      }
      
      setLiked(true);
      
      // Record behavioral data
      await recordBehavioralDataAction({
        targetId,
        actionType: "like",
        metadata: { score: match.score }
      });
      
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error("Error liking user:", error);
    } finally {
      setIsLiking(false);
    }
  };
  
  const handleDislike = async () => {
    if (!targetId) return;
    
    setIsDisliking(true);
    try {
      // Record behavioral data for dislike
      await recordBehavioralDataAction({
        targetId,
        actionType: "dislike",
        metadata: { score: match.score }
      });
      
      if (onAction) {
        onAction();
      }
    } catch (error) {
      console.error("Error disliking user:", error);
    } finally {
      setIsDisliking(false);
    }
  };
  
  // Format match score as percentage
  const matchPercentage = Math.round(match.score * 100);
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div 
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 to-blue-500" 
          style={{ width: `${matchPercentage}%` }}
        />
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={targetAvatar} />
              <AvatarFallback>{getInitials(targetName || "")}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{targetName}</h3>
                  {userType === "candidate" ? (
                    <p className="text-muted-foreground text-sm">{match.company?.industry}</p>
                  ) : (
                    <p className="text-muted-foreground text-sm">{match.candidate?.headline}</p>
                  )}
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {matchPercentage}% Match
                </Badge>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                {userType === "candidate" && match.company?.headquarters_location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{match.company.headquarters_location}</span>
                  </div>
                )}
                
                {userType === "company" && match.candidate?.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{match.candidate.location}</span>
                  </div>
                )}
                
                {userType === "company" && match.candidate?.experience_level && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    <span>{formatExperienceLevel(match.candidate.experience_level)}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-2">
                {userType === "candidate" && match.company?.company_job_interests && (
                  <div className="flex flex-wrap gap-1">
                    {match.company.company_job_interests.slice(0, 2).map((job) => (
                      <Badge key={job.id} variant="secondary" className="text-xs">
                        {job.title}
                      </Badge>
                    ))}
                    {match.company.company_job_interests.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{match.company.company_job_interests.length - 2} more
                      </Badge>
                    )}
                  </div>
                )}
                
                {userType === "company" && match.candidate?.candidate_skills && (
                  <div className="flex flex-wrap gap-1">
                    {match.candidate.candidate_skills.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill.skill_name}
                      </Badge>
                    ))}
                    {match.candidate.candidate_skills.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{match.candidate.candidate_skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div className="flex gap-2">
            <Button 
              variant={liked ? "default" : "outline"} 
              size="sm" 
              onClick={handleLike}
              disabled={isLiking || liked}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsUp className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDislike}
              disabled={isDisliking}
            >
              {isDisliking ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ThumbsDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <Link href={userType === "candidate" ? `/company/${match.company?.id}` : `/candidate/${match.candidate?.id}`}>
                View Profile
              </Link>
            </Button>
            
            {targetId && (
              <ConnectionRequestButton
                recipientId={targetId}
                recipientName={targetName || ""}
                recipientType={userType === "candidate" ? "company" : "candidate"}
                status={connectionStatus}
              />
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

function formatExperienceLevel(level: string): string {
  switch (level) {
    case "entry":
      return "Entry Level";
    case "mid":
      return "Mid Level";
    case "senior":
      return "Senior Level";
    case "executive":
      return "Executive Level";
    default:
      return level;
  }
}