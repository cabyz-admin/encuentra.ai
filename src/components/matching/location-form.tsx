"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { updateLocationDataAction } from "@/actions/matching/matching-actions";
import { getLocationData as getLocationDataQuery } from "@/lib/supabase/queries/user";
import { Loader2, MapPin } from "lucide-react";

const formSchema = z.object({
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  radius_km: z.number().min(1).max(500),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LocationFormProps {
  initialData?: Partial<FormValues>;
}

export function LocationForm({ initialData }: LocationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locations, setLocations] = useState<{city: string; state: string | null; country: string}[]>([]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      city: initialData?.city || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      radius_km: initialData?.radius_km || 50,
      latitude: initialData?.latitude,
      longitude: initialData?.longitude,
    },
  });

  const radiusKm = watch("radius_km");

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await getLocationDataQuery();
      if (data) {
        setLocations(data);
      }
    };

    fetchLocations();
  }, []);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await updateLocationDataAction(data);
      if (result.error) {
        console.error("Error updating location data:", result.error);
      }
    } catch (error) {
      console.error("Error updating location data:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Set the coordinates in the form
        setValue("latitude", latitude);
        setValue("longitude", longitude);
        
        // Try to get the city, state, country from coordinates using a geocoding service
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          );
          const data = await response.json();
          
          if (data.address) {
            setValue("city", data.address.city || data.address.town || data.address.village || "");
            setValue("state", data.address.state || "");
            setValue("country", data.address.country || "");
          }
        } catch (error) {
          console.error("Error getting location details:", error);
        } finally {
          setIsGettingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        setIsGettingLocation(false);
        alert("Unable to retrieve your location. Please enter it manually.");
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Button 
            type="button" 
            variant="outline" 
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="w-full"
          >
            {isGettingLocation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Getting Location...
              </>
            ) : (
              <>
                <MapPin className="mr-2 h-4 w-4" />
                Use Current Location
              </>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g. San Francisco"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-destructive text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province (optional)</Label>
          <Input
            id="state"
            placeholder="e.g. California"
            {...register("state")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="e.g. United States"
            {...register("country")}
          />
          {errors.country && (
            <p className="text-destructive text-sm">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="radius_km">Search Radius (km)</Label>
            <span className="text-sm">{radiusKm} km</span>
          </div>
          <Slider
            id="radius_km"
            min={5}
            max={500}
            step={5}
            value={[radiusKm]}
            onValueChange={(value) => setValue("radius_km", value[0])}
          />
          <p className="text-muted-foreground text-xs">Maximum distance for location-based matching</p>
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
          "Save Location"
        )}
      </Button>
    </form>
  );
}