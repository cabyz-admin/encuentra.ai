"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCompanyJobInterestAction, deleteCompanyJobInterestAction } from "@/actions/user/user-actions";
import { ExperienceLevel, RemotePreference, EmploymentType } from "@/types/user";
import { getSkillTags, getLocationData } from "@/lib/supabase/queries/user";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  title: z.string().min(1, "Job title is required"),
  description: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]),
  employment_type: z.enum(["full_time", "part_time", "contract", "freelance", "internship"]),
  remote_preference: z.enum(["remote", "hybrid", "onsite"]),
  min_salary: z.coerce.number().optional(),
  max_salary: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  locations: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface JobInterest {
  id: string;
  title: string;
  description?: string;
  skills?: string[];
  experience_level?: ExperienceLevel;
  employment_type: EmploymentType;
  remote_preference: RemotePreference;
  min_salary?: number;
  max_salary?: number;
  currency: string;
  locations?: string[];
}

interface HiringInterestsFormProps {
  initialJobInterests?: JobInterest[];
}

export function HiringInterestsForm({ initialJobInterests = [] }: HiringInterestsFormProps) {
  const [jobInterests, setJobInterests] = useState<JobInterest[]>(initialJobInterests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [skills, setSkills] = useState<{id: string; label: string; value: string}[]>([]);
  const [locations, setLocations] = useState<{id: string; label: string; value: string}[]>([]);

  const { register, handleSubmit, formState: { errors }, control, setValue, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      skills: [],
      experience_level: "mid",
      employment_type: "full_time",
      remote_preference: "remote",
      min_salary: undefined,
      max_salary: undefined,
      currency: "USD",
      locations: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      const [skillsResult, locationsResult] = await Promise.all([
        getSkillTags(),
        getLocationData(),
      ]);

      if (skillsResult.data) {
        setSkills(
          skillsResult.data.map((skill) => ({
            id: skill.id,
            label: skill.name,
            value: skill.name,
          }))
        );
      }

      if (locationsResult.data) {
        setLocations(
          locationsResult.data.map((loc) => ({
            id: loc.id,
            label: `${loc.city}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`,
            value: `${loc.city}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`,
          }))
        );
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addCompanyJobInterestAction(data);
      if (result.data) {
        setJobInterests([...jobInterests, result.data]);
        reset();
      }
    } catch (error) {
      console.error("Error adding job interest:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJobInterest = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteCompanyJobInterestAction({ id });
      setJobInterests(jobInterests.filter(interest => interest.id !== id));
    } catch (error) {
      console.error("Error deleting job interest:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hiring Interests</h3>
        <p className="text-muted-foreground text-sm">
          Add positions you're currently hiring for to help match with relevant candidates
        </p>
      </div>

      {jobInterests.length > 0 && (
        <div className="space-y-4">
          {jobInterests.map((interest) => (
            <div 
              key={interest.id} 
              className="flex items-start justify-between rounded-md border p-4"
            >
              <div>
                <div className="font-medium">{interest.title}</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {interest.skills?.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="text-muted-foreground text-sm mt-2">
                  {interest.experience_level && `${interest.experience_level} level • `}
                  {interest.employment_type} • {interest.remote_preference}
                </div>
                {(interest.min_salary || interest.max_salary) && (
                  <div className="text-muted-foreground text-sm">
                    {interest.min_salary && `${interest.min_salary}`}
                    {interest.min_salary && interest.max_salary && " - "}
                    {interest.max_salary && `${interest.max_salary}`}
                    {(interest.min_salary || interest.max_salary) && ` ${interest.currency}`}
                  </div>
                )}
                {interest.description && (
                  <div className="mt-2 text-sm">{interest.description}</div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteJobInterest(interest.id)}
                disabled={isDeleting === interest.id}
              >
                {isDeleting === interest.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            placeholder="e.g. Frontend Developer"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Describe the role and responsibilities"
            rows={3}
            {...register("description")}
          />
        </div>

        <div className="space-y-2">
          <Label>Required Skills</Label>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <MultiSelect
                options={skills}
                selected={field.value?.map(skill => ({
                  label: skill,
                  value: skill,
                })) || []}
                onChange={(selected) => {
                  field.onChange(selected.map(item => item.value));
                }}
                placeholder="Select skills..."
              />
            )}
          />
          {errors.skills && (
            <p className="text-destructive text-sm">{errors.skills.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="experience_level">Experience Level</Label>
            <Select
              defaultValue="mid"
              onValueChange={(value) => setValue("experience_level", value as ExperienceLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="executive">Executive Level</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employment_type">Employment Type</Label>
            <Select
              defaultValue="full_time"
              onValueChange={(value) => setValue("employment_type", value as EmploymentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full_time">Full-time</SelectItem>
                <SelectItem value="part_time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="remote_preference">Remote Preference</Label>
          <Select
            defaultValue="remote"
            onValueChange={(value) => setValue("remote_preference", value as RemotePreference)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select remote preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="remote">Remote</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
              <SelectItem value="onsite">Onsite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="min_salary">Min Salary (optional)</Label>
            <Input
              id="min_salary"
              type="number"
              min={0}
              {...register("min_salary")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_salary">Max Salary (optional)</Label>
            <Input
              id="max_salary"
              type="number"
              min={0}
              {...register("max_salary")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              defaultValue="USD"
              onValueChange={(value) => setValue("currency", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="AUD">AUD</SelectItem>
                <SelectItem value="JPY">JPY</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Locations (optional)</Label>
          <Controller
            control={control}
            name="locations"
            render={({ field }) => (
              <MultiSelect
                options={locations}
                selected={field.value?.map(loc => ({
                  label: loc,
                  value: loc,
                })) || []}
                onChange={(selected) => {
                  field.onChange(selected.map(item => item.value));
                }}
                placeholder="Select locations..."
              />
            )}
          />
        </div>

        <Button
          type="submit"
          className="flex w-full items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Job Interest
            </>
          )}
        </Button>
      </form>
    </div>
  );
}