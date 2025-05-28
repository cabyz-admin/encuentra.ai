import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { MultiSelect } from "@/components/ui/multi-select";
import Link from "next/link";
import { Heart, MessageSquare, MapPin, Briefcase, User, Building, Check, X } from "lucide-react";

export const metadata = {
  title: "Component Demo",
};

export default function DemoPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Component Demo</h1>
        <p className="text-muted-foreground">
          Showcasing the components built for the Encuentra app
        </p>
      </div>
      
      <Tabs defaultValue="cards">
        <TabsList className="mb-6">
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
          <TabsTrigger value="profiles">Profiles</TabsTrigger>
          <TabsTrigger value="messaging">Messaging</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cards">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Match Card</h2>
              <Card className="overflow-hidden">
                <div className="relative">
                  <div 
                    className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-green-500 to-blue-500" 
                    style={{ width: "85%" }}
                  />
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">John Doe</h3>
                            <p className="text-muted-foreground text-sm">Senior Developer</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10">
                            85% Match
                          </Badge>
                        </div>
                        
                        <div className="mt-2 flex flex-wrap gap-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>San Francisco, CA</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            <span>Senior Level</span>
                          </div>
                        </div>
                        
                        <div className="mt-2">
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className="text-xs">
                              React
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              TypeScript
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              Node.js
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        <User className="mr-2 h-4 w-4" />
                        Connect
                      </Button>
                    </div>
                  </CardFooter>
                </div>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Connection Request Card</h2>
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://randomuser.me/api/portraits/women/1.jpg" />
                        <AvatarFallback>AC</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">
                          Acme Corporation
                        </CardTitle>
                        <p className="text-muted-foreground text-sm">
                          Technology
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">
                      June 15, 2025
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm">We're impressed with your profile and would love to connect to discuss potential opportunities at Acme Corporation.</p>
                  </div>
                  
                  <div className="mb-4">
                    <Textarea
                      placeholder="Add a response message (optional)"
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    Add Response
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="destructive">
                      <X className="mr-2 h-4 w-4" />
                      Decline
                    </Button>
                    <Button>
                      <Check className="mr-2 h-4 w-4" />
                      Accept
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="forms">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Info Form</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Update your personal and professional information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="headline">Professional Headline</Label>
                      <Input
                        id="headline"
                        placeholder="e.g. Senior Frontend Developer at Tech Company"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell companies about yourself, your skills, and what you're looking for"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="years_of_experience">Years of Experience</Label>
                        <Input
                          id="years_of_experience"
                          type="number"
                          min={0}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience_level">Experience Level</Label>
                        <Select defaultValue="mid">
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
                      </div>
                    </div>

                    <Button className="w-full">
                      Save & Continue
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Matching Preferences</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Matching Preferences</CardTitle>
                  <CardDescription>
                    Customize how we match you with companies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="skill_weight">Skills Importance</Label>
                          <span className="text-sm">1.0</span>
                        </div>
                        <Slider
                          id="skill_weight"
                          min={0}
                          max={2}
                          step={0.1}
                          defaultValue={[1.0]}
                        />
                        <p className="text-muted-foreground text-xs">How important are matching skills in your matches?</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="location_weight">Location Importance</Label>
                          <span className="text-sm">1.0</span>
                        </div>
                        <Slider
                          id="location_weight"
                          min={0}
                          max={2}
                          step={0.1}
                          defaultValue={[1.0]}
                        />
                        <p className="text-muted-foreground text-xs">How important is location in your matches?</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Skills</Label>
                        <div className="border rounded-md p-2 flex flex-wrap gap-1">
                          <Badge variant="secondary">React</Badge>
                          <Badge variant="secondary">TypeScript</Badge>
                          <Badge variant="secondary">Node.js</Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Employment Types</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="employment_type_full_time" defaultChecked />
                            <Label htmlFor="employment_type_full_time">Full-time</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="employment_type_part_time" />
                            <Label htmlFor="employment_type_part_time">Part-time</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="employment_type_contract" />
                            <Label htmlFor="employment_type_contract">Contract</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="employment_type_freelance" />
                            <Label htmlFor="employment_type_freelance">Freelance</Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button className="w-full">
                      Save Preferences
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="profiles">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Candidate Profile</h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://randomuser.me/api/portraits/men/2.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>John Doe</CardTitle>
                      <CardDescription>Senior Frontend Developer</CardDescription>
                      <div className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">About</h3>
                    <p className="text-sm mt-1">
                      Experienced frontend developer with a passion for creating beautiful, responsive user interfaces. Specialized in React, TypeScript, and modern web technologies.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge>React</Badge>
                      <Badge>TypeScript</Badge>
                      <Badge>Next.js</Badge>
                      <Badge>Tailwind CSS</Badge>
                      <Badge>Node.js</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Experience</h3>
                    <div className="space-y-2 mt-1">
                      <div>
                        <div className="font-medium">Senior Frontend Developer</div>
                        <div className="text-muted-foreground">Acme Inc.</div>
                        <div className="text-muted-foreground text-xs">Jan 2022 - Present</div>
                      </div>
                      <div>
                        <div className="font-medium">Frontend Developer</div>
                        <div className="text-muted-foreground">Tech Solutions</div>
                        <div className="text-muted-foreground text-xs">Jun 2019 - Dec 2021</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Message
                  </Button>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Company Profile</h2>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="https://randomuser.me/api/portraits/lego/1.jpg" />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>Acme Corporation</CardTitle>
                      <CardDescription>Technology</CardDescription>
                      <div className="mt-1 flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>San Francisco, CA</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">About</h3>
                    <p className="text-sm mt-1">
                      Acme Corporation is a leading technology company specializing in innovative software solutions for businesses of all sizes. We're dedicated to creating products that make a difference.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Currently Hiring</h3>
                    <div className="space-y-2 mt-1">
                      <div className="rounded-lg border p-3">
                        <h4 className="font-medium">Senior Frontend Developer</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">React</Badge>
                          <Badge variant="secondary" className="text-xs">TypeScript</Badge>
                          <Badge variant="secondary" className="text-xs">Next.js</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            Senior Level
                          </span>
                          <span>Full-time</span>
                          <span>Remote</span>
                        </div>
                      </div>
                      
                      <div className="rounded-lg border p-3">
                        <h4 className="font-medium">UX Designer</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge variant="secondary" className="text-xs">Figma</Badge>
                          <Badge variant="secondary" className="text-xs">UI/UX</Badge>
                          <Badge variant="secondary" className="text-xs">Design Systems</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Briefcase className="h-3 w-3" />
                            Mid Level
                          </span>
                          <span>Full-time</span>
                          <span>Hybrid</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">
                    <Heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button>
                    <Building className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="messaging">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold mb-4">Conversation List</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Conversations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/50">
                        <Avatar>
                          <AvatarImage src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i}.jpg`} />
                          <AvatarFallback>{i % 2 === 0 ? 'JD' : 'AC'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate">{i % 2 === 0 ? 'John Doe' : 'Acme Corporation'}</h3>
                            <span className="text-muted-foreground text-xs">
                              {i === 1 ? '2m ago' : i === 2 ? 'Yesterday' : '3d ago'}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-muted-foreground text-sm truncate">
                              {i === 1 ? 'Thanks for reaching out!' : i === 2 ? 'When are you available for a call?' : 'Looking forward to connecting'}
                            </p>
                            {i === 1 && (
                              <span className="h-2 w-2 rounded-full bg-primary"></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Message Thread</h2>
              <Card className="flex h-[500px] flex-col">
                <CardHeader className="border-b px-4 py-3">
                  <CardTitle className="text-lg">
                    John Doe
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] flex-row">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="rounded-lg bg-muted px-4 py-2">
                            <p>Hi there! I saw your profile and I'm interested in learning more about your company.</p>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            10:30 AM
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="flex max-w-[80%] flex-row-reverse">
                        <div>
                          <div className="rounded-lg bg-primary text-primary-foreground px-4 py-2">
                            <p>Hello! Thanks for reaching out. We're currently looking for someone with your skills.</p>
                          </div>
                          <div className="mt-1 text-right text-xs text-muted-foreground">
                            10:32 AM
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-start">
                      <div className="flex max-w-[80%] flex-row">
                        <Avatar className="mr-2 h-8 w-8">
                          <AvatarImage src="https://randomuser.me/api/portraits/men/1.jpg" />
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="rounded-lg bg-muted px-4 py-2">
                            <p>That sounds great! I'd love to learn more about the position and your company culture.</p>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            10:35 AM
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        className="min-h-[60px] pr-10 resize-none"
                      />
                    </div>
                    <Button>Send</Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Want to see the full application in action?
        </p>
        <Button asChild>
          <Link href="/">
            Go to Home Page
          </Link>
        </Button>
      </div>
    </div>
  );
}