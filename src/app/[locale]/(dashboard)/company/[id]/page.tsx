import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCompanyProfile } from "@/lib/supabase/queries/user";
import { getConnectionStatus } from "@/lib/supabase/queries/connections";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MapPin, Briefcase, Globe, Linkedin, Building, Users, Calendar, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConnectionRequestButton } from "@/components/connections/connection-request-button";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: companyProfile } = await getCompanyProfile(params.id);
  
  return {
    title: companyProfile?.company_name 
      ? `${companyProfile.company_name} | Company Profile` 
      : "Company Profile",
  };
}

export default async function CompanyProfilePage({ params }: { params: { id: string } }) {
  const { data: userData } = await getUser();
  
  if (!userData?.user) {
    redirect("/login");
  }
  
  // Check if user has a profile
  const { data: userProfile } = await getUserProfile(userData.user.id);
  
  if (!userProfile) {
    redirect("/user-type");
  }
  
  // If user hasn't completed onboarding, redirect to onboarding
  if (!userProfile.onboarding_completed) {
    redirect(`/onboarding/${userProfile.onboarding_step}`);
  }
  
  // Fetch company profile
  const { data: companyProfile } = await getCompanyProfile(params.id);
  
  if (!companyProfile) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold">Company Not Found</h1>
        <p className="text-muted-foreground mt-4">
          The company profile you're looking for doesn't exist.
        </p>
        <Button asChild className="mt-8">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  // Check connection status
  const { data: connectionStatus } = await getConnectionStatus(userData.user.id, params.id);
  
  const connectionStatusData = connectionStatus ? {
    exists: true,
    status: connectionStatus.status,
    senderId: connectionStatus.sender_id,
  } : undefined;
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={companyProfile.logo_url} />
                <AvatarFallback>{getInitials(companyProfile.company_name)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{companyProfile.company_name}</h1>
                <p className="text-muted-foreground">{companyProfile.industry}</p>
                {companyProfile.headquarters_location && (
                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{companyProfile.headquarters_location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons - only show for candidates viewing companies */}
            {userProfile.user_type === "candidate" && userData.user.id !== params.id && (
              <div className="flex gap-2">
                <ConnectionRequestButton
                  recipientId={params.id}
                  recipientName={companyProfile.company_name}
                  recipientType="company"
                  status={connectionStatusData}
                />
                
                {/* Only show message button if connected */}
                {connectionStatusData?.status === "accepted" && (
                  <Button asChild>
                    <Link href={`/messages/new?recipient=${params.id}`}>
                      Message
                    </Link>
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Bio */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{companyProfile.bio}</p>
            </CardContent>
          </Card>
          
          {/* Culture & Benefits */}
          {(companyProfile.culture || companyProfile.benefits) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Culture & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyProfile.culture && (
                    <div>
                      <h3 className="font-semibold">Our Culture</h3>
                      <p>{companyProfile.culture}</p>
                    </div>
                  )}
                  
                  {companyProfile.benefits && (
                    <div>
                      <h3 className="font-semibold">Benefits</h3>
                      <p>{companyProfile.benefits}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Team Members */}
          {companyProfile.company_team_members && companyProfile.company_team_members.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {companyProfile.company_team_members.map((member) => (
                    <div key={member.id} className="flex flex-col items-center text-center">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                      </Avatar>
                      <h3 className="mt-2 font-semibold">{member.name}</h3>
                      <p className="text-muted-foreground text-sm">{member.title}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {/* Company Info */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Company Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Industry</h3>
                  <p>{companyProfile.industry}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Company Size</h3>
                  <p>{companyProfile.company_size}</p>
                </div>
                
                {companyProfile.founded_year && (
                  <div>
                    <h3 className="text-sm font-medium">Founded</h3>
                    <p className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {companyProfile.founded_year}
                    </p>
                  </div>
                )}
                
                {companyProfile.headquarters_location && (
                  <div>
                    <h3 className="text-sm font-medium">Headquarters</h3>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {companyProfile.headquarters_location}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Job Interests */}
          {companyProfile.company_job_interests && companyProfile.company_job_interests.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Currently Hiring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {companyProfile.company_job_interests.map((job) => (
                    <div key={job.id} className="rounded-lg border p-4">
                      <h3 className="font-semibold">{job.title}</h3>
                      
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.skills?.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {job.skills && job.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{job.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        {job.experience_level && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            {formatExperienceLevel(job.experience_level)}
                          </span>
                        )}
                        
                        {job.employment_type && (
                          <span>{formatEmploymentType(job.employment_type)}</span>
                        )}
                        
                        {job.remote_preference && (
                          <span>{formatRemotePreference(job.remote_preference)}</span>
                        )}
                      </div>
                      
                      {(job.min_salary || job.max_salary) && (
                        <div className="mt-2 flex items-center gap-1 text-sm">
                          <DollarSign className="h-3 w-3" />
                          {job.min_salary && `${job.min_salary.toLocaleString()}`}
                          {job.min_salary && job.max_salary && " - "}
                          {job.max_salary && `${job.max_salary.toLocaleString()}`}
                          {" "}
                          {job.currency}
                        </div>
                      )}
                      
                      {job.description && (
                        <p className="mt-2 text-sm">{job.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {companyProfile.website_url && (
                  <a
                    href={companyProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                  </a>
                )}
                
                {companyProfile.linkedin_url && (
                  <a
                    href={companyProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                
                {!companyProfile.website_url && !companyProfile.linkedin_url && (
                  <p className="text-muted-foreground text-sm">No links provided</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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

function formatEmploymentType(type: string): string {
  switch (type) {
    case "full_time":
      return "Full-time";
    case "part_time":
      return "Part-time";
    case "contract":
      return "Contract";
    case "freelance":
      return "Freelance";
    case "internship":
      return "Internship";
    default:
      return type;
  }
}

function formatRemotePreference(preference: string): string {
  switch (preference) {
    case "remote":
      return "Remote";
    case "hybrid":
      return "Hybrid";
    case "onsite":
      return "Onsite";
    default:
      return preference;
  }
}