"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { addCandidateExperienceAction, deleteCandidateExperienceAction, addCandidateEducationAction, deleteCandidateEducationAction } from "@/actions/user/user-actions";
import { Loader2, Plus, Trash2, Briefcase, GraduationCap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const experienceSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  title: z.string().min(1, "Job title is required"),
  location: z.string().optional(),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

const educationSchema = z.object({
  institution: z.string().min(1, "Institution name is required"),
  degree: z.string().min(1, "Degree is required"),
  field_of_study: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_current: z.boolean().default(false),
  description: z.string().optional(),
});

type ExperienceFormValues = z.infer<typeof experienceSchema>;
type EducationFormValues = z.infer<typeof educationSchema>;

interface Experience {
  id: string;
  company_name: string;
  title: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

interface ExperienceFormProps {
  initialExperiences?: Experience[];
  initialEducation?: Education[];
}

export function ExperienceForm({ initialExperiences = [], initialEducation = [] }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [isSubmittingExp, setIsSubmittingExp] = useState(false);
  const [isSubmittingEdu, setIsSubmittingEdu] = useState(false);
  const [isDeletingExp, setIsDeletingExp] = useState<string | null>(null);
  const [isDeletingEdu, setIsDeletingEdu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("experience");

  const { 
    register: registerExp, 
    handleSubmit: handleSubmitExp, 
    formState: { errors: errorsExp }, 
    setValue: setValueExp,
    watch: watchExp,
    reset: resetExp
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company_name: "",
      title: "",
      location: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    },
  });

  const { 
    register: registerEdu, 
    handleSubmit: handleSubmitEdu, 
    formState: { errors: errorsEdu }, 
    setValue: setValueEdu,
    watch: watchEdu,
    reset: resetEdu
  } = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field_of_study: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    },
  });

  const isCurrentExp = watchExp("is_current");
  const isCurrentEdu = watchEdu("is_current");

  const onSubmitExperience = async (data: ExperienceFormValues) => {
    setIsSubmittingExp(true);
    try {
      const result = await addCandidateExperienceAction(data);
      if (result.data) {
        setExperiences([...experiences, result.data]);
        resetExp();
      }
    } catch (error) {
      console.error("Error adding experience:", error);
    } finally {
      setIsSubmittingExp(false);
    }
  };

  const onSubmitEducation = async (data: EducationFormValues) => {
    setIsSubmittingEdu(true);
    try {
      const result = await addCandidateEducationAction(data);
      if (result.data) {
        setEducation([...education, result.data]);
        resetEdu();
      }
    } catch (error) {
      console.error("Error adding education:", error);
    } finally {
      setIsSubmittingEdu(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    setIsDeletingExp(id);
    try {
      await deleteCandidateExperienceAction({ id });
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      console.error("Error deleting experience:", error);
    } finally {
      setIsDeletingExp(null);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    setIsDeletingEdu(id);
    try {
      await deleteCandidateEducationAction({ id });
      setEducation(education.filter(edu => edu.id !== id));
    } catch (error) {
      console.error("Error deleting education:", error);
    } finally {
      setIsDeletingEdu(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="experience" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="experience" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Work Experience
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Education
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experience" className="space-y-6 pt-4">
          {experiences.length > 0 && (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className="flex items-start justify-between rounded-md border p-4"
                >
                  <div>
                    <div className="font-medium">{exp.title}</div>
                    <div>{exp.company_name}</div>
                    <div className="text-muted-foreground text-sm">
                      {formatDate(exp.start_date)} - {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      {exp.location && ` • ${exp.location}`}
                    </div>
                    {exp.description && (
                      <div className="mt-2 text-sm">{exp.description}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteExperience(exp.id)}
                    disabled={isDeletingExp === exp.id}
                  >
                    {isDeletingExp === exp.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitExp(onSubmitExperience)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title</Label>
              <Input
                id="title"
                placeholder="e.g. Software Engineer"
                {...registerExp("title")}
              />
              {errorsExp.title && (
                <p className="text-destructive text-sm">{errorsExp.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                placeholder="e.g. Acme Inc."
                {...registerExp("company_name")}
              />
              {errorsExp.company_name && (
                <p className="text-destructive text-sm">{errorsExp.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                placeholder="e.g. San Francisco, CA"
                {...registerExp("location")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...registerExp("start_date")}
                />
                {errorsExp.start_date && (
                  <p className="text-destructive text-sm">{errorsExp.start_date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  disabled={isCurrentExp}
                  {...registerExp("end_date")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_current"
                checked={isCurrentExp}
                onCheckedChange={(checked) => {
                  setValueExp("is_current", checked === true);
                  if (checked) {
                    setValueExp("end_date", "");
                  }
                }}
              />
              <Label htmlFor="is_current">I currently work here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe your responsibilities and achievements"
                rows={3}
                {...registerExp("description")}
              />
            </div>

            <Button
              type="submit"
              className="flex w-full items-center justify-center"
              disabled={isSubmittingExp}
            >
              {isSubmittingExp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Experience
                </>
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="education" className="space-y-6 pt-4">
          {education.length > 0 && (
            <div className="space-y-4">
              {education.map((edu) => (
                <div 
                  key={edu.id} 
                  className="flex items-start justify-between rounded-md border p-4"
                >
                  <div>
                    <div className="font-medium">{edu.degree}</div>
                    <div>{edu.institution}</div>
                    {edu.field_of_study && (
                      <div className="text-muted-foreground">{edu.field_of_study}</div>
                    )}
                    {(edu.start_date || edu.end_date) && (
                      <div className="text-muted-foreground text-sm">
                        {formatDate(edu.start_date)} - {edu.is_current ? "Present" : formatDate(edu.end_date)}
                      </div>
                    )}
                    {edu.description && (
                      <div className="mt-2 text-sm">{edu.description}</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteEducation(edu.id)}
                    disabled={isDeletingEdu === edu.id}
                  >
                    {isDeletingEdu === edu.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 text-destructive" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmitEdu(onSubmitEducation)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Institution</Label>
              <Input
                id="institution"
                placeholder="e.g. Stanford University"
                {...registerEdu("institution")}
              />
              {errorsEdu.institution && (
                <p className="text-destructive text-sm">{errorsEdu.institution.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <Input
                id="degree"
                placeholder="e.g. Bachelor of Science"
                {...registerEdu("degree")}
              />
              {errorsEdu.degree && (
                <p className="text-destructive text-sm">{errorsEdu.degree.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="field_of_study">Field of Study (optional)</Label>
              <Input
                id="field_of_study"
                placeholder="e.g. Computer Science"
                {...registerEdu("field_of_study")}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="edu_start_date">Start Date (optional)</Label>
                <Input
                  id="edu_start_date"
                  type="date"
                  {...registerEdu("start_date")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edu_end_date">End Date (optional)</Label>
                <Input
                  id="edu_end_date"
                  type="date"
                  disabled={isCurrentEdu}
                  {...registerEdu("end_date")}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="edu_is_current"
                checked={isCurrentEdu}
                onCheckedChange={(checked) => {
                  setValueEdu("is_current", checked === true);
                  if (checked) {
                    setValueEdu("end_date", "");
                  }
                }}
              />
              <Label htmlFor="edu_is_current">I'm currently studying here</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edu_description">Description (optional)</Label>
              <Textarea
                id="edu_description"
                placeholder="Describe your studies, achievements, etc."
                rows={3}
                {...registerEdu("description")}
              />
            </div>

            <Button
              type="submit"
              className="flex w-full items-center justify-center"
              disabled={isSubmittingEdu}
            >
              {isSubmittingEdu ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </>
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}