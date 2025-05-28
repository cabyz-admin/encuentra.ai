"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addCompanyTeamMemberAction, deleteCompanyTeamMemberAction } from "@/actions/user/user-actions";
import { Loader2, Plus, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal('')),
  avatar_url: z.string().url("Please enter a valid URL").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof formSchema>;

interface TeamMember {
  id: string;
  name: string;
  title: string;
  email?: string;
  avatar_url?: string;
}

interface TeamFormProps {
  initialTeamMembers?: TeamMember[];
}

export function TeamForm({ initialTeamMembers = [] }: TeamFormProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      title: "",
      email: "",
      avatar_url: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addCompanyTeamMemberAction(data);
      if (result.data) {
        setTeamMembers([...teamMembers, result.data]);
        reset();
      }
    } catch (error) {
      console.error("Error adding team member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteCompanyTeamMemberAction({ id });
      setTeamMembers(teamMembers.filter(member => member.id !== id));
    } catch (error) {
      console.error("Error deleting team member:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Team Members</h3>
        <p className="text-muted-foreground text-sm">
          Add key team members to showcase your company's leadership
        </p>
      </div>

      {teamMembers.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {teamMembers.map((member) => (
              <div 
                key={member.id} 
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={member.avatar_url} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.name}</div>
                    <div className="text-muted-foreground text-sm">{member.title}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteTeamMember(member.id)}
                  disabled={isDeleting === member.id}
                >
                  {isDeleting === member.id ? (
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="e.g. John Doe"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. CEO, CTO, Product Manager"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-destructive text-sm">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (optional)</Label>
          <Input
            id="email"
            type="email"
            placeholder="e.g. john@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL (optional)</Label>
          <Input
            id="avatar_url"
            placeholder="https://example.com/avatar.jpg"
            {...register("avatar_url")}
          />
          {errors.avatar_url && (
            <p className="text-destructive text-sm">{errors.avatar_url.message}</p>
          )}
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
              <UserPlus className="mr-2 h-4 w-4" />
              Add Team Member
            </>
          )}
        </Button>
      </form>
    </div>
  );
}