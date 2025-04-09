"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Calendar, Clock, MapPin, Users, GraduationCap, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const internships = [
  {
    id: 1,
    title: "Web Development Intern",
    company: "SRM AP Tech Hub",
    location: "On Campus",
    type: "Part-time",
    duration: "3 months",
    stipend: "₹10,000/month",
    deadline: "June 15, 2023",
    skills: ["React", "Node.js", "JavaScript", "HTML/CSS"],
    description: "Join our tech team to develop and maintain web applications for the university. You'll work on real projects that impact student life on campus.",
    responsibilities: [
      "Develop responsive web interfaces using React",
      "Collaborate with backend developers to integrate APIs",
      "Participate in code reviews and team meetings",
      "Test and debug applications"
    ],
    requirements: [
      "Currently enrolled in Computer Science or related field",
      "Knowledge of JavaScript, HTML, and CSS",
      "Familiarity with React is a plus",
      "Strong problem-solving skills"
    ],
    category: "technical"
  },
  {
    id: 2,
    title: "Research Assistant",
    company: "SRM AP Research Lab",
    location: "On Campus",
    type: "Part-time",
    duration: "6 months",
    stipend: "₹12,000/month",
    deadline: "May 30, 2023",
    skills: ["Data Analysis", "Research Methods", "Documentation", "Statistics"],
    description: "Assist faculty members with ongoing research projects. Gain valuable experience in academic research and contribute to publications.",
    responsibilities: [
      "Collect and analyze research data",
      "Assist in literature reviews",
      "Help prepare research papers and presentations",
      "Maintain research documentation"
    ],
    requirements: [
      "Strong academic record",
      "Interest in research methodology",
      "Good analytical and writing skills",
      "Ability to work independently"
    ],
    category: "research"
  },
  {
    id: 3,
    title: "Marketing Intern",
    company: "SRM AP Outreach",
    location: "Hybrid",
    type: "Part-time",
    duration: "4 months",
    stipend: "₹8,000/month",
    deadline: "June 5, 2023",
    skills: ["Social Media", "Content Creation", "Event Planning", "Analytics"],
    description: "Help promote university events and programs through various marketing channels. Develop creative content and strategies to engage the student community.",
    responsibilities: [
      "Create content for social media platforms",
      "Assist in organizing campus events",
      "Analyze marketing campaign performance",
      "Develop promotional materials"
    ],
    requirements: [
      "Strong communication skills",
      "Creative mindset",
      "Basic knowledge of social media platforms",
      "Interest in marketing and event management"
    ],
    category: "non-technical"
  },
  {
    id: 4,
    title: "Data Science Intern",
    company: "SRM AP Analytics Lab",
    location: "On Campus",
    type: "Full-time",
    duration: "3 months",
    stipend: "₹15,000/month",
    deadline: "May 25, 2023",
    skills: ["Python", "Machine Learning", "Data Visualization", "Statistics"],
    description: "Work on data-driven projects to extract insights and develop predictive models. Apply machine learning techniques to solve real-world problems.",
    responsibilities: [
      "Clean and preprocess datasets",
      "Develop and implement machine learning models",
      "Create data visualizations",
      "Present findings to stakeholders"
    ],
    requirements: [
      "Strong programming skills in Python",
      "Knowledge of machine learning algorithms",
      "Experience with data analysis libraries (Pandas, NumPy)",
      "Statistical knowledge"
    ],
    category: "technical"
  },
  {
    id: 5,
    title: "Student Ambassador",
    company: "SRM AP Admissions",
    location: "On Campus",
    type: "Part-time",
    duration: "Ongoing",
    stipend: "₹5,000/month",
    deadline: "June 20, 2023",
    skills: ["Communication", "Leadership", "Public Speaking", "Organization"],
    description: "Represent the university to prospective students and their families. Conduct campus tours and share your experiences as a student at SRM AP.",
    responsibilities: [
      "Lead campus tours for visitors",
      "Participate in admission events",
      "Answer questions about student life",
      "Assist with orientation programs"
    ],
    requirements: [
      "Excellent communication skills",
      "Positive attitude and enthusiasm",
      "Good knowledge of campus resources",
      "Minimum GPA of 3.0"
    ],
    category: "non-technical"
  },
  {
    id: 6,
    title: "UI/UX Design Intern",
    company: "SRM AP Design Studio",
    location: "Remote",
    type: "Part-time",
    duration: "4 months",
    stipend: "₹12,000/month",
    deadline: "June 10, 2023",
    skills: ["Figma", "Adobe XD", "Wireframing", "Prototyping"],
    description: "Design user interfaces for web and mobile applications. Create intuitive and engaging user experiences that solve real problems for students and faculty.",
    responsibilities: [
      "Create wireframes and prototypes",
      "Conduct user research and testing",
      "Collaborate with developers to implement designs",
      "Iterate based on user feedback"
    ],
    requirements: [
      "Portfolio demonstrating design skills",
      "Familiarity with design tools (Figma, Adobe XD)",
      "Understanding of UI/UX principles",
      "Creative problem-solving abilities"
    ],
    category: "technical"
  }
];

export default function InternshipsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Campus Internship Opportunities
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Gain valuable work experience, develop professional skills, and build your network right here on campus.
        </p>
      </div>

      {/* Tabs for filtering */}
      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-center mb-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="all">All Internships</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="research">Research</TabsTrigger>
            <TabsTrigger value="non-technical">Non-Technical</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships
              .filter((internship) => internship.category === "technical")
              .map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="research" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships
              .filter((internship) => internship.category === "research")
              .map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="non-technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships
              .filter((internship) => internship.category === "non-technical")
              .map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* How to Apply Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">How to Apply</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">1. Choose an Internship</h3>
              <p className="text-muted-foreground">Browse through available opportunities and find the one that matches your skills and interests.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-4">
                <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">2. Prepare Your Application</h3>
              <p className="text-muted-foreground">Update your resume and prepare a brief cover letter explaining why you're interested in the position.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-4">
                <Building2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="font-semibold mb-2">3. Submit and Follow Up</h3>
              <p className="text-muted-foreground">Send your application to the email address provided and follow up if you don't hear back within a week.</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="mb-4 text-muted-foreground">For any questions about the internship program, please contact:</p>
            <a 
              href="mailto:internships@srmap.edu.in" 
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              internships@srmap.edu.in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

interface InternshipCardProps {
  internship: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    duration: string;
    stipend: string;
    deadline: string;
    skills: string[];
    description: string;
    responsibilities: string[];
    requirements: string[];
    category: string;
  };
}

function InternshipCard({ internship }: InternshipCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-200 h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{internship.title}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              {internship.company}
            </CardDescription>
          </div>
          <Badge 
            variant={
              internship.category === "technical" ? "default" : 
              internship.category === "research" ? "secondary" : 
              "outline"
            }
            className="capitalize"
          >
            {internship.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm mb-4">{internship.description}</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {internship.location}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            {internship.type}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            {internship.duration}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Briefcase className="h-3.5 w-3.5 mr-1" />
            {internship.stipend}
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-xs font-medium mb-1.5">Skills:</p>
          <div className="flex flex-wrap gap-1.5">
            {internship.skills.map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          Deadline: {internship.deadline}
        </div>
        <a 
          href={`mailto:adarsh_kishor@srmap.edu.in?subject=Application for ${internship.title} Position&body=Dear Hiring Manager,%0A%0AI am writing to express my interest in the ${internship.title} position at ${internship.company}.%0A%0A[Include your qualifications and why you're interested in this role]%0A%0AThank you for considering my application.%0A%0ASincerely,%0A[Your Name]%0A[Your Registration Number]%0A[Your Contact Information]`}
        >
          <Button variant="outline" size="sm" className="gap-1">
            Apply <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  );
}
