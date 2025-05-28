"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { updateMatchingFiltersAction } from "@/actions/matching/matching-actions";
import { getSkillTags, getIndustryTags, getLocationData } from "@/lib/supabase/queries/user";
import { Loader2 } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  skills: z.array(z.string()).optional(),
  experience_levels: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
  remote_preferences: z.array(z.string()).optional(),
  min_salary: z.number().optional(),
  max_salary: z.number().optional(),
  employment_types: z.array(z.string()).optional(),
  radius_km: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface MatchingFiltersFormProps {
  initialData?: Partial<FormValues>;
  userType: "candidate" | "company";
  onApplyFilters?: (filters: FormValues) => void;
}

export function MatchingFiltersForm({ initialData, userType, onApplyFilters }: MatchingFiltersFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skills, setSkills] = useState<{id: string; label: string; value: string}[]>([]);
  const [industries, setIndustries] = useState<{id: string; label: string; value: string}[]>([]);
  const [locations, setLocations] = useState<{id: string; label: string; value: string}[]>([]);

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: initialData?.skills || [],
      experience_levels: initialData?.experience_levels || [],
      locations: initialData?.locations || [],
      industries: initialData?.industries || [],
      remote_preferences: initialData?.remote_preferences || [],
      min_salary: initialData?.min_salary || undefined,
      max_salary: initialData?.max_salary || undefined,
      employment_types: initialData?.employment_types || [],
      radius_km: initialData?.radius_km || 50,
    },
  });

  const radiusKm = watch("radius_km");

  useEffect(() => {
    const fetchData = async () => {
      const [skillsResult, industriesResult, locationsResult] = await Promise.all([
        getSkillTags(),
        getIndustryTags(),
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

      if (industriesResult.data) {
        setIndustries(
          industriesResult.data.map((industry) => ({
            id: industry.id,
            label: industry.name,
            value: industry.name,
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
      const result = await updateMatchingFiltersAction(data);
      if (result.error) {
        console.error("Error updating matching filters:", result.error);
      } else if (onApplyFilters) {
        onApplyFilters(data);
      }
    } catch (error) {
      console.error("Error updating matching filters:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const experienceLevelOptions = [
    { id: "entry", label: "Entry Level", value: "entry" },
    { id: "mid", label: "Mid Level", value: "mid" },
    { id: "senior", label: "Senior Level", value: "senior" },
    { id: "executive", label: "Executive Level", value: "executive" },
  ];

  const remotePreferenceOptions = [
    { id: "remote", label: "Remote", value: "remote" },
    { id: "hybrid", label: "Hybrid", value: "hybrid" },
    { id: "onsite", label: "Onsite", value: "onsite" },
  ];

  const employmentTypeOptions = [
    { id: "full_time", label: "Full-time", value: "full_time" },
    { id: "part_time", label: "Part-time", value: "part_time" },
    { id: "contract", label: "Contract", value: "contract" },
    { id: "freelance", label: "Freelance", value: "freelance" },
    { id: "internship", label: "Internship", value: "internship" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Skills</Label>
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
        </div>

        <div className="space-y-2">
          <Label>Experience Levels</Label>
          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={control}
              name="experience_levels"
              render={({ field }) => (
                <>
                  {experienceLevelOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`experience_level_${option.id}`}
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`experience_level_${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Locations</Label>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="radius_km">Location Radius (km)</Label>
            <span className="text-sm">{radiusKm || 50} km</span>
          </div>
          <Slider
            id="radius_km"
            min={5}
            max={500}
            step={5}
            value={[radiusKm || 50]}
            onValueChange={(value) => setValue("radius_km", value[0])}
          />
          <p className="text-muted-foreground text-xs">Maximum distance from your preferred locations</p>
        </div>

        <div className="space-y-2">
          <Label>Industries</Label>
          <Controller
            control={control}
            name="industries"
            render={({ field }) => (
              <MultiSelect
                options={industries}
                selected={field.value?.map(ind => ({
                  label: ind,
                  value: ind,
                })) || []}
                onChange={(selected) => {
                  field.onChange(selected.map(item => item.value));
                }}
                placeholder="Select industries..."
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label>Remote Preferences</Label>
          <div className="grid grid-cols-3 gap-2">
            <Controller
              control={control}
              name="remote_preferences"
              render={({ field }) => (
                <>
                  {remotePreferenceOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`remote_preference_${option.id}`}
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`remote_preference_${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="min_salary">Min Salary</Label>
            <Input
              id="min_salary"
              type="number"
              min={0}
              {...register("min_salary", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max_salary">Max Salary</Label>
            <Input
              id="max_salary"
              type="number"
              min={0}
              {...register("max_salary", { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Employment Types</Label>
          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={control}
              name="employment_types"
              render={({ field }) => (
                <>
                  {employmentTypeOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`employment_type_${option.id}`}
                        checked={field.value?.includes(option.value)}
                        onCheckedChange={(checked) => {
                          const currentValues = field.value || [];
                          if (checked) {
                            field.onChange([...currentValues, option.value]);
                          } else {
                            field.onChange(
                              currentValues.filter((value) => value !== option.value)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`employment_type_${option.id}`}>{option.label}</Label>
                    </div>
                  ))}
                </>
              )}
            />
          </div>
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
            Applying Filters...
          </div>
        ) : (
          "Apply Filters"
        )}
      </Button>
    </form>
  );
}