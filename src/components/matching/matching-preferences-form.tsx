"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { updateMatchingPreferencesAction } from "@/actions/matching/matching-actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  skill_weight: z.number().min(0).max(2),
  experience_weight: z.number().min(0).max(2),
  location_weight: z.number().min(0).max(2),
  industry_weight: z.number().min(0).max(2),
  company_size_weight: z.number().min(0).max(2),
  remote_preference_weight: z.number().min(0).max(2),
  salary_weight: z.number().min(0).max(2),
  behavioral_weight: z.number().min(0).max(2),
});

type FormValues = z.infer<typeof formSchema>;

interface MatchingPreferencesFormProps {
  initialData?: Partial<FormValues>;
}

export function MatchingPreferencesForm({ initialData }: MatchingPreferencesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill_weight: initialData?.skill_weight || 1.0,
      experience_weight: initialData?.experience_weight || 1.0,
      location_weight: initialData?.location_weight || 1.0,
      industry_weight: initialData?.industry_weight || 1.0,
      company_size_weight: initialData?.company_size_weight || 0.5,
      remote_preference_weight: initialData?.remote_preference_weight || 0.8,
      salary_weight: initialData?.salary_weight || 0.7,
      behavioral_weight: initialData?.behavioral_weight || 0.6,
    },
  });

  // Watch all values for real-time updates
  const watchedValues = watch();

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateMatchingPreferencesAction(data);
      if (result.error) {
        console.error("Error updating matching preferences:", result.error);
      }
    } catch (error) {
      console.error("Error updating matching preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="skill_weight">Skills Importance</Label>
            <span className="text-sm">{watchedValues.skill_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="skill_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.skill_weight]}
            onValueChange={(value) => setValue("skill_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important are matching skills in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="experience_weight">Experience Importance</Label>
            <span className="text-sm">{watchedValues.experience_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="experience_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.experience_weight]}
            onValueChange={(value) => setValue("experience_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is experience level in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="location_weight">Location Importance</Label>
            <span className="text-sm">{watchedValues.location_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="location_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.location_weight]}
            onValueChange={(value) => setValue("location_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is location in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="industry_weight">Industry Importance</Label>
            <span className="text-sm">{watchedValues.industry_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="industry_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.industry_weight]}
            onValueChange={(value) => setValue("industry_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is industry match in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="company_size_weight">Company Size Importance</Label>
            <span className="text-sm">{watchedValues.company_size_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="company_size_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.company_size_weight]}
            onValueChange={(value) => setValue("company_size_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is company size in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="remote_preference_weight">Remote Work Importance</Label>
            <span className="text-sm">{watchedValues.remote_preference_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="remote_preference_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.remote_preference_weight]}
            onValueChange={(value) => setValue("remote_preference_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is remote work preference in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="salary_weight">Salary Importance</Label>
            <span className="text-sm">{watchedValues.salary_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="salary_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.salary_weight]}
            onValueChange={(value) => setValue("salary_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is salary match in your matches?</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="behavioral_weight">Behavioral Data Importance</Label>
            <span className="text-sm">{watchedValues.behavioral_weight.toFixed(1)}</span>
          </div>
          <Slider
            id="behavioral_weight"
            min={0}
            max={2}
            step={0.1}
            value={[watchedValues.behavioral_weight]}
            onValueChange={(value) => setValue("behavioral_weight", value[0])}
          />
          <p className="text-muted-foreground text-xs">How important is behavioral data (interactions, engagement) in your matches?</p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </div>
        ) : (
          "Save Preferences"
        )}
      </Button>
    </form>
  );
}