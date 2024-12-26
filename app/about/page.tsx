"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, GraduationCap, Users, Globe, Award, BookOpen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-lg overflow-hidden mb-12">
        <Image
          src="https://srmap.edu.in/wp-content/uploads/2019/11/srmap-campus.jpg"
          alt="SRM University AP Campus"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-background/50 flex items-center">
          <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">
              SRM University AP
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              A world-class university committed to academic excellence, research innovation, and holistic development.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: Building2, label: 'Campus Area', value: '200 Acres' },
          { icon: Users, label: 'Students', value: '5000+' },
          { icon: GraduationCap, label: 'Faculty', value: '250+' },
          { icon: Globe, label: 'Global Partners', value: '100+' },
        ].map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Information */}
      <Tabs defaultValue="overview" className="mb-12">
        <TabsList className="mb-8">
          <TabsTrigger value="overview" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="academics" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            Academics
          </TabsTrigger>
          <TabsTrigger value="research" className="gap-2">
            <Globe className="h-4 w-4" />
            Research
          </TabsTrigger>
          <TabsTrigger value="achievements" className="gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">About SRM University AP</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                SRM University AP is a multi-stream research university focusing on diverse fields of knowledge. 
                Located in Amaravati, the People's Capital of Andhra Pradesh, India, SRM University AP was 
                established in 2017 and is already making its mark through excellence in teaching, research, 
                and service.
              </p>
              <p>
                The university is committed to developing and nurturing talent through innovative learning 
                programs, conducting interdisciplinary research to address global challenges, and engaging 
                in collaborative projects with industry and society.
              </p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="academics">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Academic Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Undergraduate Programs</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• B.Tech in Computer Science and Engineering</li>
                  <li>• B.Tech in Electronics and Communication Engineering</li>
                  <li>• B.Tech in Mechanical Engineering</li>
                  <li>• BBA in Business Administration</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Postgraduate Programs</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• M.Tech in Computer Science</li>
                  <li>• M.Tech in Robotics</li>
                  <li>• MBA in Business Analytics</li>
                  <li>• Ph.D. Programs in Various Disciplines</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Research and Innovation</h2>
            <div className="prose dark:prose-invert max-w-none">
              <p>
                SRM University AP is committed to fostering a culture of research and innovation. Our 
                state-of-the-art research facilities and collaborations with leading global institutions 
                enable cutting-edge research in various fields.
              </p>
              <h3>Research Centers</h3>
              <ul>
                <li>Center for Advanced Materials and Nano Technology</li>
                <li>Center for Artificial Intelligence and Machine Learning</li>
                <li>Center for Sustainable Development</li>
                <li>Center for Innovation and Entrepreneurship</li>
              </ul>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Notable Achievements</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Rankings and Recognition</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• NAAC Accreditation with 'A' Grade</li>
                  <li>• Top 50 in NIRF Rankings</li>
                  <li>• QS World University Rankings Recognition</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Research Output</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 500+ Research Publications</li>
                  <li>• 50+ Patents Filed</li>
                  <li>• Multiple Research Grants</li>
                </ul>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Contact Section */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <div className="space-y-2 text-muted-foreground">
              <p>SRM University AP</p>
              <p>Neerukonda, Mangalagiri Mandal</p>
              <p>Guntur District, Andhra Pradesh</p>
              <p>India - 522240</p>
              <p className="mt-4">Email: info@srmap.edu.in</p>
              <p>Phone: +91-866-2429299</p>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admissions" className="text-primary hover:underline">
                Admissions
              </Link>
              <Link href="/careers" className="text-primary hover:underline">
                Careers
              </Link>
              <Link href="/research" className="text-primary hover:underline">
                Research
              </Link>
              <Link href="/library" className="text-primary hover:underline">
                Library
              </Link>
              <Link href="/events" className="text-primary hover:underline">
                Events
              </Link>
              <Link href="/contact" className="text-primary hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 