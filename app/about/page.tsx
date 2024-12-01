import { Github, Mail, Linkedin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'About - SRM AP Campus App',
  description: 'Learn more about the SRM AP Campus App and its creator',
}

export default function About() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center text-center space-y-4 pb-6 border-b">
        <div className="relative w-24 h-24 rounded-full overflow-hidden">
          <Image
            src="/adarsh.jpg"
            alt="Adarsh Gupta"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Adarsh Gupta</h1>
          <p className="text-muted-foreground">Computer Science Engineering Student</p>
          <p className="text-muted-foreground">SRM University AP</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="https://github.com/adarsh-gupta101"
            target="_blank"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/adarsh-gupta-15aa68203/"
            target="_blank"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Linkedin className="h-5 w-5" />
          </Link>
          <Link
            href="mailto:adarsh_kishor@srmap.edu.in"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">About the App</h2>
        <p className="text-muted-foreground">
          SRM AP Campus App is a student-created initiative designed to enhance the campus
          experience. This app serves as your one-stop platform for accessing campus
          resources, events, and information.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Key Features</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Campus Events Calendar
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Mess Menu Updates
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Campus Navigation
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Student Community
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Important Notifications
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Technology Stack</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Next.js 14
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            React
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            TypeScript
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Tailwind CSS
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Firebase
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Project Goals</h2>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Simplify access to campus information
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Create a more connected community
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Reduce communication gaps
          </li>
          <li className="flex items-center gap-2">
            <div className="w-1 h-1 bg-primary rounded-full" />
            Provide a modern interface
          </li>
        </ul>
      </section>

      <section className="space-y-3 pt-4 border-t">
        <div className="flex justify-center gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
        </div>
      </section>
    </div>
  )
} 