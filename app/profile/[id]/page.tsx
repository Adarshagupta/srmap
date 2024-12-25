import { Metadata } from 'next';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserCircle, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Hash, 
  MapPin, 
  BookOpen,
  ArrowLeft,
  Link as LinkIcon,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Person {
  id: string;
  name: string;
  email: string;
  collegeEmail?: string;
  regNumber: string;
  batch: string;
  year: string;
  department: string;
  dob: string;
  interests: string[];
  bio: string;
  avatar?: string;
}

interface Props {
  params: { id: string }
}

export async function generateStaticParams() {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const docRef = doc(db, 'users', params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
      title: 'Profile Not Found | SRM AP Connect',
      description: 'The requested profile could not be found.',
      openGraph: {
        title: 'Profile Not Found | SRM AP Connect',
        description: 'The requested profile could not be found.',
        type: 'profile',
      },
      twitter: {
        card: 'summary',
        title: 'Profile Not Found | SRM AP Connect',
        description: 'The requested profile could not be found.',
      },
    };
  }

  const person = docSnap.data() as Person;
  const title = `${person.name} | SRM AP Connect`;
  const description = person.bio || 
    `${person.name} is a ${person.year} student in ${person.department} at SRM University AP.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
      images: [
        {
          url: person.avatar || 'https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png',
          width: 1200,
          height: 630,
          alt: person.name,
        },
      ],
      firstName: person.name.split(' ')[0],
      lastName: person.name.split(' ').slice(1).join(' '),
      username: person.regNumber,
      gender: 'unspecified',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [person.avatar || 'https://srmap.edu.in/wp-content/uploads/2019/11/SRMAP-Logo-2.png'],
    },
    alternates: {
      canonical: `https://srmap.edu.in/profile/${params.id}`,
    },
    keywords: [
      'SRM AP',
      'student profile',
      person.name,
      person.department,
      person.year,
      'university',
      'education',
      ...(person.interests || []),
    ],
  };
}

async function getProfile(id: string): Promise<Person | null> {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data()
  } as Person;
}

export default async function ProfilePage({ params }: Props) {
  const person = await getProfile(params.id);

  if (!person) {
    notFound();
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        asChild
      >
        <Link href="/discover">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Discover
        </Link>
      </Button>

      <Card className="p-6 md:p-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <Avatar className="w-24 h-24">
              <AvatarImage src={person.avatar} alt={person.name} />
              <AvatarFallback className="text-2xl">
                {person.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 flex-1">
              <h1 className="text-2xl font-bold">{person.name}</h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {person.year}
                </span>
                <span className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary">
                  {person.batch} Batch
                </span>
              </div>
            </div>
            <Button>
              Connect
            </Button>
          </div>

          {/* Bio */}
          {person.bio && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-muted-foreground">
                {person.bio}
              </p>
            </div>
          )}

          {/* Details */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Academic Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="w-4 h-4" />
                  <span>{person.regNumber}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span>{person.department}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{person.email}</span>
                </div>
                {person.collegeEmail && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{person.collegeEmail}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {person.interests && person.interests.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Interests</h2>
                <div className="flex flex-wrap gap-2">
                  {person.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-sm rounded-full bg-primary/10 text-primary"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
} 