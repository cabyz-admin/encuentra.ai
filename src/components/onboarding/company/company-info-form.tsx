"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateCompanyProfileAction } from "@/actions/user/user-actions";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  company_name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  company_size: z.string().min(1, "Company size is required"),
  founded_year: z.coerce.number().min(1800, "Please enter a valid year").max(new Date().getFullYear(), "Year cannot be in the future"),
  website_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  linkedin_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
  headquarters_location: z.string().min(1, "Headquarters location is required"),
  bio: z.string().min(10, "Company bio should be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

interface CompanyInfoFormProps {
  initialData?: Partial<FormValues>;
}

export function CompanyInfoForm({ initialData }: CompanyInfoFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: initialData?.company_name || "",
      industry: initialData?.industry || "",
      company_size: initialData?.company_size || "",
      founded_year: initialData?.founded_year || new Date().getFullYear(),
      website_url: initialData?.website_url || "",
      linkedin_url: initialData?.linkedin_url || "",
      headquarters_location: initialData?.headquarters_location || "",
      bio: initialData?.bio || "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateCompanyProfileAction(data);
      if (result.error) {
        console.error("Error updating company profile:", result.error);
      }
    } catch (error) {
      console.error("Error updating company profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const companySizeOptions = [
    "1-10 employees",
    "11-50 employees",
    "51-200 employees",
    "201-500 employees",
    "501-1000 employees",
    "1001-5000 employees",
    "5001-10000 employees",
    "10000+ employees",
  ];

  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Media",
    "Entertainment",
    "Real Estate",
    "Transportation",
    "Energy",
    "Retail",
    "Consulting",
    "Telecommunications",
    "Agriculture",
    "Hospitality",
    "Construction",
    "Aerospace",
    "Automotive",
    "Pharmaceuticals",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="company_name">Company Name</Label>
        <Input
          id="company_name"
          placeholder="e.g. Acme Inc."
          {...register("company_name")}
        />
        {errors.company_name && (
          <p className="text-destructive text-sm">{errors.company_name.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <Select
            defaultValue={initialData?.industry}
            onValueChange={(value) => setValue("industry", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              {industryOptions.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.industry && (
            <p className="text-destructive text-sm">{errors.industry.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company_size">Company Size</Label>
          <Select
            defaultValue={initialData?.company_size}
            onValueChange={(value) => setValue("company_size", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select company size" />
            </SelectTrigger>
            <SelectContent>
              {companySizeOptions.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.company_size && (
            <p className="text-destructive text-sm">{errors.company_size.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="founded_year">Founded Year</Label>
          <Input
            id="founded_year"
            type="number"
            min={1800}
            max={new Date().getFullYear()}
            {...register("founded_year")}
          />
          {errors.founded_year && (
            <p className="text-destructive text-sm">{errors.founded_year.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="headquarters_location">Headquarters Location</Label>
          <Input
            id="headquarters_location"
            placeholder="e.g. San Francisco, CA"
            {...register("headquarters_location")}
          />
          {errors.headquarters_location && (
            <p className="text-destructive text-sm">{errors.headquarters_location.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website_url">Website URL (optional)</Label>
        <Input
          id="website_url"
          placeholder="https://yourcompany.com"
          {...register("website_url")}
        />
        {errors.website_url && (
          <p className="text-destructive text-sm">{errors.website_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin_url">LinkedIn URL (optional)</Label>
        <Input
          id="linkedin_url"
          placeholder="https://linkedin.com/company/yourcompany"
          {...register("linkedin_url")}
        />
        {errors.linkedin_url && (
          <p className="text-destructive text-sm">{errors.linkedin_url.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Company Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell candidates about your company, mission, and values"
          rows={5}
          {...register("bio")}
        />
        {errors.bio && (
          <p className="text-destructive text-sm">{errors.bio.message}</p>
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