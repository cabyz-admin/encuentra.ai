import { getUser } from "@/lib/supabase/queries/index";
import { getUserProfile } from "@/lib/supabase/queries/user";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Briefcase, CheckCircle, Search, User } from "lucide-react";

export const metadata = {
  title: "Encuentra - Reverse Job Board",
  description: "Connect talented professionals with great companies",
};

export default async function LandingPage() {
  const { data: userData } = await getUser();
  
  // If user is logged in, check if they have completed onboarding
  if (userData?.user) {
    const { data: userProfile } = await getUserProfile(userData.user.id);
    
    if (userProfile) {
      if (userProfile.onboarding_completed) {
        redirect("/dashboard");
      } else {
        redirect(`/onboarding/${userProfile.onboarding_step}`);
      }
    } else {
      redirect("/user-type");
    }
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Encuentra
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/login">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-muted/50 to-background py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                The Reverse Job Board for Top Talent
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                Encuentra connects talented professionals with great companies. Create your profile, get discovered, and find your next opportunity.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/login">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#how-it-works">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20" id="how-it-works">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Encuentra flips the traditional job board model, putting candidates in control.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Candidates</h3>
                <p className="mt-2 text-muted-foreground">
                  Create a compelling profile showcasing your skills and experience. Get discovered by companies looking for your talents.
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Create a professional profile</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Showcase your skills and experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Get contacted by companies</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">For Companies</h3>
                <p className="mt-2 text-muted-foreground">
                  Browse profiles of talented professionals. Filter by skills, experience, and more to find the perfect match for your team.
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Browse candidate profiles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Filter by skills and experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Contact candidates directly</span>
                  </li>
                </ul>
              </div>
              
              <div className="flex flex-col items-center text-center md:col-span-2 lg:col-span-1">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Smart Matching</h3>
                <p className="mt-2 text-muted-foreground">
                  Our intelligent matching system connects the right candidates with the right companies, saving time and improving hiring outcomes.
                </p>
                <ul className="mt-4 space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>AI-powered matching</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Find candidates that match your needs</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <span>Save time in your hiring process</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-muted py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join Encuentra today and transform your job search or hiring process.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/login">
                    Sign Up Now
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              &copy; {new Date().getFullYear()} Encuentra. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}