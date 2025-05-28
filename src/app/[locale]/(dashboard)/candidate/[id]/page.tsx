import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile, getCandidateProfile } from "@/lib/supabase/queries/user";
import { recordCandidateViewAction } from "@/actions/user/user-actions";
import { createConversationAction } from "@/actions/messaging/messaging-actions";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageSquare, Bookmark, MapPin, Briefcase, GraduationCap, Globe, Linkedin, Github, Calendar, DollarSign } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: candidateProfile } = await getCandidateProfile(params.id);
  
  return {
    title: candidateProfile?.users?.full_name 
      ? `${candidateProfile.users.full_name} | Candidate Profile` 
      : "Candidate Profile",
  };
}

export default async function CandidateProfilePage({ params }: { params: { id: string } }) {
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
  
  // Fetch candidate profile
  const { data: candidateProfile } = await getCandidateProfile(params.id);
  
  if (!candidateProfile) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold">Candidate Not Found</h1>
        <p className="text-muted-foreground mt-4">
          The candidate profile you're looking for doesn't exist or is not public.
        </p>
        <Button asChild className="mt-8">
          <Link href="/browse">Browse Candidates</Link>
        </Button>
      </div>
    );
  }
  
  // If viewing as company, record the view
  if (userProfile.user_type === "company" && userData.user.id !== params.id) {
    await recordCandidateViewAction({ candidateId: params.id });
  }
  
  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={candidateProfile.avatar_url || candidateProfile.users?.avatar_url} />
                <AvatarFallback>{getInitials(candidateProfile.users?.full_name || "Candidate")}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{candidateProfile.users?.full_name || "Candidate"}</h1>
                <p className="text-xl">{candidateProfile.headline}</p>
                {candidateProfile.location && (
                  <div className="mt-1 flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{candidateProfile.location}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Action buttons - only show for companies viewing candidates */}
            {userProfile.user_type === "company" && userData.user.id !== params.id && (
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <Link href={`/messages/new?recipient=${params.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Link>
                </Button>
                <Button variant="ghost">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
          
          {/* Bio */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{candidateProfile.bio}</p>
            </CardContent>
          </Card>
          
          {/* Experience */}
          {candidateProfile.candidate_experience && candidateProfile.candidate_experience.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidateProfile.candidate_experience.map((exp) => (
                    <div key={exp.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <h3 className="font-semibold">{exp.title}</h3>
                      <p className="text-muted-foreground">{exp.company_name}</p>
                      <p className="text-muted-foreground text-sm">
                        {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      {exp.description && (
                        <p className="mt-2">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Education */}
          {candidateProfile.candidate_education && candidateProfile.candidate_education.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {candidateProfile.candidate_education.map((edu) => (
                    <div key={edu.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-muted-foreground">{edu.institution}</p>
                      {edu.field_of_study && (
                        <p className="text-muted-foreground">{edu.field_of_study}</p>
                      )}
                      {(edu.start_date || edu.end_date) && (
                        <p className="text-muted-foreground text-sm">
                          {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                        </p>
                      )}
                      {edu.description && (
                        <p className="mt-2">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Portfolio */}
          {candidateProfile.candidate_portfolios && candidateProfile.candidate_portfolios.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {candidateProfile.candidate_portfolios.map((portfolio) => (
                    <a
                      key={portfolio.id}
                      href={portfolio.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      {portfolio.image_url && (
                        <div className="mb-2 h-32 w-full overflow-hidden rounded-md">
                          <img
                            src={portfolio.image_url}
                            alt={portfolio.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="font-semibold">{portfolio.title}</h3>
                      {portfolio.description && (
                        <p className="text-muted-foreground text-sm">{portfolio.description}</p>
                      )}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div>
          {/* Skills */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Skills</CardTitle>
            </CardHeader>
            <CardContent>
              {candidateProfile.candidate_skills && candidateProfile.candidate_skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {candidateProfile.candidate_skills.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.skill_name}
                      {skill.proficiency && (
                        <span className="ml-1 text-xs opacity-70">
                          • {skill.proficiency}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No skills listed</p>
              )}
            </CardContent>
          </Card>
          
          {/* Availability */}
          {candidateProfile.candidate_availability && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Status</h3>
                    <Badge className="mt-1">
                      {formatAvailabilityStatus(candidateProfile.candidate_availability.status)}
                    </Badge>
                  </div>
                  
                  {candidateProfile.candidate_availability.available_from && (
                    <div>
                      <h3 className="text-sm font-medium">Available From</h3>
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(candidateProfile.candidate_availability.available_from)}
                      </p>
                    </div>
                  )}
                  
                  {candidateProfile.candidate_availability.notice_period_days && (
                    <div>
                      <h3 className="text-sm font-medium">Notice Period</h3>
                      <p>{candidateProfile.candidate_availability.notice_period_days} days</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Preferences */}
          {candidateProfile.candidate_preferences && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(candidateProfile.candidate_preferences.min_salary || candidateProfile.candidate_preferences.max_salary) && (
                    <div>
                      <h3 className="text-sm font-medium">Salary Expectation</h3>
                      <p className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {candidateProfile.candidate_preferences.min_salary && 
                          `${candidateProfile.candidate_preferences.min_salary.toLocaleString()}`}
                        {candidateProfile.candidate_preferences.min_salary && candidateProfile.candidate_preferences.max_salary && " - "}
                        {candidateProfile.candidate_preferences.max_salary && 
                          `${candidateProfile.candidate_preferences.max_salary.toLocaleString()}`}
                        {" "}
                        {candidateProfile.candidate_preferences.currency}
                      </p>
                    </div>
                  )}
                  
                  {candidateProfile.candidate_preferences.employment_types && (
                    <div>
                      <h3 className="text-sm font-medium">Employment Types</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {candidateProfile.candidate_preferences.employment_types.map((type, index) => (
                          <Badge key={index} variant="outline">
                            {formatEmploymentType(type)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {candidateProfile.candidate_preferences.remote_preference && (
                    <div>
                      <h3 className="text-sm font-medium">Remote Preference</h3>
                      <Badge variant="outline">
                        {formatRemotePreference(candidateProfile.candidate_preferences.remote_preference)}
                      </Badge>
                    </div>
                  )}
                  
                  {candidateProfile.candidate_preferences.locations && candidateProfile.candidate_preferences.locations.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium">Preferred Locations</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {candidateProfile.candidate_preferences.locations.map((location, index) => (
                          <Badge key={index} variant="outline">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {candidateProfile.candidate_preferences.industries && candidateProfile.candidate_preferences.industries.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium">Preferred Industries</h3>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {candidateProfile.candidate_preferences.industries.map((industry, index) => (
                          <Badge key={index} variant="outline">
                            {industry}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
                {candidateProfile.linkedin_url && (
                  <a
                    href={candidateProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                )}
                
                {candidateProfile.github_url && (
                  <a
                    href={candidateProfile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                )}
                
                {candidateProfile.website_url && (
                  <a
                    href={candidateProfile.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    <Globe className="h-4 w-4" />
                    Personal Website
                  </a>
                )}
                
                {!candidateProfile.linkedin_url && !candidateProfile.github_url && !candidateProfile.website_url && (
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

function formatAvailabilityStatus(status: string): string {
  switch (status) {
    case "active":
      return "Actively Looking";
    case "passive":
      return "Open to Opportunities";
    case "not_looking":
      return "Not Looking";
    default:
      return status;
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