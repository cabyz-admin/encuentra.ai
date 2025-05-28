"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { addCandidateSkillAction, deleteCandidateSkillAction } from "@/actions/user/user-actions";
import { SkillLevel } from "@/types/user";
import { getSkillTags } from "@/lib/supabase/queries/user";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  skill_name: z.string().min(1, "Skill name is required"),
  proficiency: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  years_of_experience: z.coerce.number().min(0, "Years must be a positive number").optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface Skill {
  id: string;
  skill_name: string;
  proficiency: SkillLevel;
  years_of_experience?: number;
}

interface SkillsFormProps {
  initialSkills?: Skill[];
}

export function SkillsForm({ initialSkills = [] }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skill_name: "",
      proficiency: "intermediate",
      years_of_experience: 0,
    },
  });

  const skillNameValue = watch("skill_name");

  useEffect(() => {
    const fetchSkillTags = async () => {
      const { data } = await getSkillTags();
      if (data) {
        setSkillSuggestions(data.map(tag => tag.name));
      }
    };

    fetchSkillTags();
  }, []);

  useEffect(() => {
    if (skillNameValue) {
      const filtered = skillSuggestions.filter(skill => 
        skill.toLowerCase().includes(skillNameValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [skillNameValue, skillSuggestions]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addCandidateSkillAction(data);
      if (result.data) {
        setSkills([...skills, result.data]);
        reset();
      }
    } catch (error) {
      console.error("Error adding skill:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteCandidateSkillAction({ id });
      setSkills(skills.filter(skill => skill.id !== id));
    } catch (error) {
      console.error("Error deleting skill:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const selectSuggestion = (skill: string) => {
    setValue("skill_name", skill);
    setShowSuggestions(false);
  };

  const getProficiencyColor = (level: SkillLevel) => {
    switch (level) {
      case "beginner": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "intermediate": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "advanced": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "expert": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Your Skills</h3>
        <p className="text-muted-foreground text-sm">
          Add skills to help companies find you based on your expertise
        </p>
      </div>

      {skills.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {skills.map((skill) => (
              <div 
                key={skill.id} 
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div>
                  <div className="font-medium">{skill.skill_name}</div>
                  <div className="flex items-center gap-2">
                    <Badge className={getProficiencyColor(skill.proficiency)}>
                      {skill.proficiency}
                    </Badge>
                    {skill.years_of_experience && (
                      <span className="text-muted-foreground text-xs">
                        {skill.years_of_experience} years
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteSkill(skill.id)}
                  disabled={isDeleting === skill.id}
                >
                  {isDeleting === skill.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="skill_name">Skill Name</Label>
          <div className="relative">
            <Input
              id="skill_name"
              placeholder="e.g. JavaScript, React, Project Management"
              {...register("skill_name")}
              autoComplete="off"
            />
            {showSuggestions && (
              <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
                <ul className="max-h-60 overflow-auto py-1 text-base">
                  {filteredSuggestions.map((skill, index) => (
                    <li
                      key={index}
                      className="cursor-pointer px-4 py-2 hover:bg-muted"
                      onClick={() => selectSuggestion(skill)}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {errors.skill_name && (
            <p className="text-destructive text-sm">{errors.skill_name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="proficiency">Proficiency Level</Label>
            <Select
              defaultValue="intermediate"
              onValueChange={(value) => setValue("proficiency", value as SkillLevel)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>
            {errors.proficiency && (
              <p className="text-destructive text-sm">{errors.proficiency.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="years_of_experience">Years of Experience (optional)</Label>
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
              Add Skill
            </>
          )}
        </Button>
      </form>
    </div>
  );
}