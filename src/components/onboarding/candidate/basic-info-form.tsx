"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCandidateProfileAction } from "@/actions/user/user-actions";
import { ExperienceLevel } from "@/types/user";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  headline: z.string().min(3, "Headline is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  years_of_experience: z.coerce.number().min(0, "Years of experience must be a positive number"),
  experience_level: z.enum(["entry", "mid", "senior", "executive"]),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  github_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface BasicInfoFormProps {
  initialData?: Partial<FormValues>;
}

export function BasicInfoForm({ initialData }: BasicInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: initialData?.headline || "",
      bio: initialData?.bio || "",
      location: initialData?.location || "",
      years_of_experience: initialData?.years_of_experience || 0,
      experience_level: initialData?.experience_level || "entry",
      linkedin_url: initialData?.linkedin_url || "",
      github_url: initialData?.github_url || "",
      website_url: initialData?.website_url || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateCandidateProfileAction(data);
      if (result.error) {
        console.error("Error updating profile:", result.error);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="headline">Professional Headline</Label>
        <Input
          id="headline"
          placeholder="e.g. Senior Frontend Developer at Tech Company"
          {...register("headline")}
        />
        {errors.headline && (
          <p className="text-destructive text-sm">{errors.headline.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell companies about yourself, your skills, and what you're looking for"
          rows={5}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-destructive text-sm">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. San Francisco, CA"
          {...register("location")}
        />
        {errors.location && (
          <p className="text-destructive text-sm">{errors.location.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="years_of_experience">Years of Experience</Label>
          <Input
            id="years_of_experience"
            type="number"
            min={0}
            {...register("years_of_experience")}
          />
          {errors.years_of_experience && (
            <p className="text-destructive text-sm">{errors.years_of_experience.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience_level">Experience Level</Label>
          <Select
            defaultValue={watch("experience_level")}
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
          {errors.experience_level && (
            <p className="text-destructive text-sm">{errors.experience_level.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
        <Input
          id="linkedin_url"
          placeholder="https://linkedin.com/in/yourprofile"
          {...register("linkedin_url")}
        />
        {errors.linkedin_url && (
          <p className="text-destructive text-sm">{errors.linkedin_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="github_url">GitHub URL (optional)</Label>
        <Input
          id="github_url"
          placeholder="https://github.com/yourusername"
          {...register("github_url")}
        />
        {errors.github_url && (
          <p className="text-destructive text-sm">{errors.github_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Personal Website (optional)</Label>
        <Input
          id="website_url"
          placeholder="https://yourwebsite.com"
          {...register("website_url")}
        />
        {errors.website_url && (
          <p className="text-destructive text-sm">{errors.website_url.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </div>
        ) : (
          "Save & Continue"
        )}
      </button>
    </form>
  );
}