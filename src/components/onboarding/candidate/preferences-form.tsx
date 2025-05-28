"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCandidateAvailabilityAction, updateCandidatePreferencesAction } from "@/actions/user/user-actions";
import { AvailabilityStatus, RemotePreference, EmploymentType } from "@/types/user";
import { getIndustryTags, getLocationData } from "@/lib/supabase/queries/user";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  // Availability
  status: z.enum(["active", "passive", "not_looking"]),
  available_from: z.string().optional(),
  notice_period_days: z.coerce.number().optional(),
  
  // Preferences
  min_salary: z.coerce.number().optional(),
  max_salary: z.coerce.number().optional(),
  currency: z.string().default("USD"),
  employment_types: z.array(z.enum(["full_time", "part_time", "contract", "freelance", "internship"])),
  remote_preference: z.enum(["remote", "hybrid", "onsite"]),
  locations: z.array(z.string()).optional(),
  industries: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PreferencesFormProps {
  initialAvailability?: {
    status: AvailabilityStatus;
    available_from?: string;
    notice_period_days?: number;
  };
  initialPreferences?: {
    min_salary?: number;
    max_salary?: number;
    currency?: string;
    employment_types?: EmploymentType[];
    remote_preference?: RemotePreference;
    locations?: string[];
    industries?: string[];
  };
}

export function PreferencesForm({ initialAvailability, initialPreferences }: PreferencesFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<{id: string; label: string; value: string}[]>([]);
  const [industries, setIndustries] = useState<{id: string; label: string; value: string}[]>([]);

  const { register, handleSubmit, formState: { errors }, control, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Availability
      status: initialAvailability?.status || "active",
      available_from: initialAvailability?.available_from || "",
      notice_period_days: initialAvailability?.notice_period_days || 0,
      
      // Preferences
      min_salary: initialPreferences?.min_salary || undefined,
      max_salary: initialPreferences?.max_salary || undefined,
      currency: initialPreferences?.currency || "USD",
      employment_types: initialPreferences?.employment_types || ["full_time"],
      remote_preference: initialPreferences?.remote_preference || "remote",
      locations: initialPreferences?.locations || [],
      industries: initialPreferences?.industries || [],
    },
  });

  const availabilityStatus = watch("status");

  useEffect(() => {
    const fetchData = async () => {
      const [locationsResult, industriesResult] = await Promise.all([
        getLocationData(),
        getIndustryTags(),
      ]);

      if (locationsResult.data) {
        setLocations(
          locationsResult.data.map((loc) => ({
            id: loc.id,
            label: `${loc.city}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`,
            value: `${loc.city}${loc.state ? `, ${loc.state}` : ""}, ${loc.country}`,
          }))
        );
      }

      if (industriesResult.data) {
        setIndustries(
          industriesResult.data.map((ind) => ({
            id: ind.id,
            label: ind.name,
            value: ind.name,
          }))
        );
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Split the data into availability and preferences
      const { status, available_from, notice_period_days, ...preferencesData } = data;
      
      // Update availability
      const availabilityResult = await updateCandidateAvailabilityAction({
        status,
        available_from: available_from || undefined,
        notice_period_days: notice_period_days || undefined,
      });
      
      if (availabilityResult.error) {
        throw availabilityResult.error;
      }
      
      // Update preferences
      const preferencesResult = await updateCandidatePreferencesAction(preferencesData);
      
      if (preferencesResult.error) {
        throw preferencesResult.error;
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const employmentTypeOptions = [
    { id: "full_time", label: "Full-time", value: "full_time" },
    { id: "part_time", label: "Part-time", value: "part_time" },
    { id: "contract", label: "Contract", value: "contract" },
    { id: "freelance", label: "Freelance", value: "freelance" },
    { id: "internship", label: "Internship", value: "internship" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Availability</h3>
        <p className="text-muted-foreground text-sm">
          Let companies know about your current job search status
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Job Search Status</Label>
        <Select
          defaultValue={initialAvailability?.status || "active"}
          onValueChange={(value) => setValue("status", value as AvailabilityStatus)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select your job search status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Actively looking</SelectItem>
            <SelectItem value="passive">Open to opportunities</SelectItem>
            <SelectItem value="not_looking">Not looking</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-destructive text-sm">{errors.status.message}</p>
        )}
      </div>

      {availabilityStatus !== "not_looking" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="available_from">Available From (optional)</Label>
            <Input
              id="available_from"
              type="date"
              {...register("available_from")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notice_period_days">Notice Period in Days (optional)</Label>
            <Input
              id="notice_period_days"
              type="number"
              min={0}
              {...register("notice_period_days")}
            />
          </div>
        </>
      )}

      <div className="border-t pt-6">
        <h3 className="text-lg font-medium">Job Preferences</h3>
        <p className="text-muted-foreground text-sm">
          Set your preferences to help companies find you for the right opportunities
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="min_salary">Minimum Salary (optional)</Label>
          <Input
            id="min_salary"
            type="number"
            min={0}
            {...register("min_salary")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_salary">Maximum Salary (optional)</Label>
          <Input
            id="max_salary"
            type="number"
            min={0}
            {...register("max_salary")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="currency">Currency</Label>
        <Select
          defaultValue={initialPreferences?.currency || "USD"}
          onValueChange={(value) => setValue("currency", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD - US Dollar</SelectItem>
            <SelectItem value="EUR">EUR - Euro</SelectItem>
            <SelectItem value="GBP">GBP - British Pound</SelectItem>
            <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
            <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
            <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
          </SelectContent>
        </Select>
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
                      checked={field.value?.includes(option.value as EmploymentType)}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, option.value as EmploymentType]);
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
        {errors.employment_types && (
          <p className="text-destructive text-sm">{errors.employment_types.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="remote_preference">Remote Preference</Label>
        <Select
          defaultValue={initialPreferences?.remote_preference || "remote"}
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

      <div className="space-y-2">
        <Label>Preferred Locations (optional)</Label>
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
        <Label>Preferred Industries (optional)</Label>
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