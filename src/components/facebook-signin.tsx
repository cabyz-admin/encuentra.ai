"use client";

import { createClient } from "@/lib/supabase/clients/client";
import { Button } from "@/components/ui/button";

export function FacebookSignin() {
  const supabase = createClient();

  const handleSignin = () => {
    supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
        scopes: "email", // Only request email scope to avoid metadata issues
      },
    });
  };

  return (
    <Button onClick={handleSignin} variant="outline" className="font-mono">
      Sign in with Facebook
    </Button>
  );
}
