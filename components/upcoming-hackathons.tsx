"use client";

import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, ChevronRight, Code, Trophy, Users, Zap, Rocket, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Hackathon {
  id: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  location: string;
  prizePool: string;
  registrationLink: string;
  imageUrl?: string;
}

export function UpcomingHackathons({ expanded = false }) {
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingHackathon = async () => {
      try {
        const now = Timestamp.now();
        const hackathonsRef = collection(db, 'hackathons');

        // Get upcoming hackathons
        const q = query(
          hackathonsRef,
          where('endDate', '>=', now),
          orderBy('startDate', 'asc'),
          limit(1)
        );

        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          setHackathon({
            id: doc.id,
            ...doc.data()
          } as Hackathon);
        } else {
          // Use a sample hackathon for demonstration purposes
          const startDate = new Date();
          startDate.setDate(startDate.getDate() + 7); // Start 7 days from now

          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 3); // End 3 days after start date

          setHackathon({
            id: 'sample-hackathon',
            title: "SRM AP Coding Challenge 2023",
            description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
            startDate: Timestamp.fromDate(startDate),
            endDate: Timestamp.fromDate(endDate),
            location: "SRM University AP, Andhra Pradesh",
            prizePool: "₹50,000",
            registrationLink: "https://forms.gle/example",
            imageUrl: ""
          });
          console.log('Using sample hackathon data for demonstration');
        }
      } catch (error) {
        console.error('Error fetching hackathon:', error);
        // Fallback to sample data in case of error
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + 7);

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 3);

        setHackathon({
          id: 'sample-hackathon',
          title: "SRM AP Coding Challenge 2023",
          description: "Join us for an exciting 3-day hackathon where you can showcase your coding skills, collaborate with peers, and win amazing prizes. This event is open to all SRM AP students.",
          startDate: Timestamp.fromDate(startDate),
          endDate: Timestamp.fromDate(endDate),
          location: "SRM University AP, Andhra Pradesh",
          prizePool: "₹50,000",
          registrationLink: "https://forms.gle/example",
          imageUrl: ""
        });
        console.log('Using sample hackathon data due to error');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingHackathon();
  }, []);

  // If expanded layout is requested but we're still loading
  if (expanded && loading) {
    return (
      <div className="relative">
        {/* Header with gradient text */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Hackathon Challenge
          </h2>
          <p className="text-muted-foreground">Showcase your skills and win prizes</p>
        </div>

        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-violet-600/20 to-indigo-600/20 h-40 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            <p className="text-muted-foreground">Loading hackathon information...</p>
          </div>
        </div>
      </div>
    );
  }

  // If compact layout is requested but we're still loading
  if (loading) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-white/5 h-full flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  // If expanded layout is requested but there's no hackathon
  if (expanded && !hackathon) {
    return (
      <div className="relative">
        {/* Header with gradient text */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Hackathon Challenge
            </h2>
            <p className="text-muted-foreground">Showcase your skills and win prizes</p>
          </div>
          <Link href="/hackathons" className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline flex items-center">
            View all
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {/* Main content with hexagon pattern background */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background with hexagon pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-95">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 5.38L5.38 17.32v25.64L30 54.62l24.62-11.66V17.32L30 5.38z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="relative z-10 p-6 md:p-8 text-white">
            <div className="md:flex items-center gap-8">
              {/* Content for no hackathon */}
              <div className="w-full text-center py-6">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                  <Rocket className="h-8 w-8" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-4">No Upcoming Hackathons</h3>

                <p className="text-white/80 mb-8 max-w-md mx-auto">
                  There are no hackathons scheduled at the moment. Check back later for exciting coding challenges and competitions!
                </p>

                <Link href="/hackathons">
                  <Button
                    className="bg-white hover:bg-white/90 text-indigo-700 font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Explore Past Hackathons
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If compact layout is requested but there's no hackathon
  if (!hackathon) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-white/5 h-full">
        <div className="w-full h-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-blue-600/80">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M10,20 L90,20" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M10,40 L90,40" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M10,60 L90,60" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M10,80 L90,80" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M20,10 L20,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M40,10 L40,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M60,10 L60,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
                <path d="M80,10 L80,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              </svg>
            </div>
          </div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white/20 p-2 rounded-full">
              <Rocket className="h-5 w-5 text-white" />
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <h3 className="text-lg font-bold text-white text-center px-4 drop-shadow-md">
              Hackathon Season
            </h3>
          </div>
        </div>

        <div className="p-3">
          <p className="text-xs text-muted-foreground mb-3 text-center">
            No upcoming hackathons at the moment. Check back later!
          </p>

          <div className="grid grid-cols-3 gap-2 mb-3">
            <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/10 rounded-lg p-2 border border-purple-100 dark:border-purple-800/20">
              <Code className="h-4 w-4 text-purple-600 dark:text-purple-400 mb-1" />
              <span className="text-[10px] font-medium text-center">Coding</span>
            </div>

            <div className="flex flex-col items-center bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-2 border border-indigo-100 dark:border-indigo-800/20">
              <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-[10px] font-medium text-center">Prizes</span>
            </div>

            <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2 border border-blue-100 dark:border-blue-800/20">
              <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
              <span className="text-[10px] font-medium text-center">Teams</span>
            </div>
          </div>

          <Link href="/hackathons" className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm text-xs h-8"
              size="sm"
            >
              <Zap className="mr-1 h-3 w-3" />
              Explore Hackathons
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Is this hackathon active now?
  const isActive = () => {
    const now = new Date().getTime();
    return hackathon.startDate.toMillis() <= now && hackathon.endDate.toMillis() >= now;
  };

  // Redesigned expanded layout for the home page
  if (expanded) {
    return (
      <div className="relative">
        {/* Header with gradient text */}
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Hackathon Challenge
            </h2>
            <p className="text-xs text-muted-foreground">Showcase your skills and win prizes</p>
          </div>
          <Link href="/hackathons" className="text-xs text-indigo-600 hover:text-indigo-700 hover:underline flex items-center">
            View all
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Link>
        </div>

        {/* Main content with hexagon pattern background */}
        <div className="relative rounded-xl overflow-hidden">
          {/* Background with hexagon pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-indigo-600 opacity-95">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 5.38L5.38 17.32v25.64L30 54.62l24.62-11.66V17.32L30 5.38z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
              backgroundSize: '24px 24px'
            }}></div>
          </div>

          <div className="relative z-10 p-4 md:p-5 text-white">
            <div className="md:flex items-center gap-4">
              {/* Left side with status badge and title */}
              <div className="md:w-1/2 mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 mr-1.5 animate-pulse"></div>
                    <span className="text-xs font-medium uppercase tracking-wider">
                      {isActive() ? "Live Now" : "Coming Soon"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(hackathon.startDate)} - {formatDate(hackathon.endDate)}</span>
                  </div>
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-1.5">{hackathon.title}</h3>

                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {hackathon.description}
                </p>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="bg-white/20 p-1 rounded-full">
                      <Users className="h-3 w-3" />
                    </div>
                    <span className="text-xs">{hackathon.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className="bg-white/20 p-1 rounded-full">
                      <Trophy className="h-3 w-3 text-yellow-300" />
                    </div>
                    <span className="text-xs">{hackathon.prizePool || "Exciting Prizes"}</span>
                  </div>
                </div>

                {hackathon.registrationLink ? (
                  <a href={hackathon.registrationLink} target="_blank" rel="noopener noreferrer">
                    <Button
                      className="bg-white hover:bg-white/90 text-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      size="sm"
                    >
                      <Zap className="mr-1.5 h-3.5 w-3.5" />
                      Register Now
                    </Button>
                  </a>
                ) : (
                  <Link href={`/hackathons/${hackathon.id}`}>
                    <Button
                      className="bg-white hover:bg-white/90 text-indigo-700 font-medium shadow-md hover:shadow-lg transition-all duration-200"
                      size="sm"
                    >
                      <Zap className="mr-1.5 h-3.5 w-3.5" />
                      View Details
                    </Button>
                  </Link>
                )}
              </div>

              {/* Right side with features */}
              <div className="md:w-1/2 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center w-full">
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                    {/* Feature 1 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow"></div>
                      </div>
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <Code className="h-4 w-4" />
                      </div>
                      <div className="z-10">
                        <div className="text-sm font-medium">Coding</div>
                        <div className="text-xs text-white/70">Challenges</div>
                      </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-reverse-spin"></div>
                      </div>
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <Users className="h-4 w-4" />
                      </div>
                      <div className="z-10">
                        <div className="text-sm font-medium">Team</div>
                        <div className="text-xs text-white/70">Collaboration</div>
                      </div>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-ping-slow opacity-50"></div>
                      </div>
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <Trophy className="h-4 w-4 text-yellow-300" />
                      </div>
                      <div className="z-10">
                        <div className="text-sm font-medium">Prizes</div>
                        <div className="text-xs text-white/70">{hackathon.prizePool || "Win Big"}</div>
                      </div>
                    </div>

                    {/* Feature 4 */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-2 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-spin-slow"></div>
                      </div>
                      <div className="bg-white/20 p-1.5 rounded-lg">
                        <Rocket className="h-4 w-4" />
                      </div>
                      <div className="z-10">
                        <div className="text-sm font-medium">Innovation</div>
                        <div className="text-xs text-white/70">Create & Build</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add custom animation keyframes */}
        <style jsx global>{`
          @keyframes ping-slow {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes reverse-spin {
            from { transform: rotate(360deg); }
            to { transform: rotate(0deg); }
          }
          .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
          .animate-reverse-spin {
            animation: reverse-spin 15s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  // Original compact layout
  return (
    <div className="relative rounded-xl overflow-hidden border border-border bg-black/5 dark:bg-white/5 h-full">
      <div className="w-full h-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/80 to-blue-600/80">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M10,20 L90,20" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M10,40 L90,40" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M10,60 L90,60" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M10,80 L90,80" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M20,10 L20,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M40,10 L40,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M60,10 L60,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
              <path d="M80,10 L80,90" stroke="white" strokeWidth="0.5" strokeDasharray="5,5" />
            </svg>
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-white/20 p-2 rounded-full">
            <Rocket className="h-5 w-5 text-white" />
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-lg font-bold text-white text-center px-4 drop-shadow-md">
            {isActive() ? "LIVE NOW" : "Coming Soon"}
          </h3>
        </div>
      </div>

      <div className="p-3">
        <h4 className="font-medium text-sm mb-1 truncate">{hackathon.title}</h4>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {hackathon.description}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex flex-col items-center bg-purple-50 dark:bg-purple-900/10 rounded-lg p-2 border border-purple-100 dark:border-purple-800/20">
            <Code className="h-4 w-4 text-purple-600 dark:text-purple-400 mb-1" />
            <span className="text-[10px] font-medium text-center">{formatDate(hackathon.startDate)}</span>
          </div>

          {hackathon.prizePool ? (
            <div className="flex flex-col items-center bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-2 border border-indigo-100 dark:border-indigo-800/20">
              <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-[10px] font-medium text-center">{hackathon.prizePool.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-2 border border-indigo-100 dark:border-indigo-800/20">
              <Trophy className="h-4 w-4 text-indigo-600 dark:text-indigo-400 mb-1" />
              <span className="text-[10px] font-medium text-center">Prizes</span>
            </div>
          )}

          <div className="flex flex-col items-center bg-blue-50 dark:bg-blue-900/10 rounded-lg p-2 border border-blue-100 dark:border-blue-800/20">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400 mb-1" />
            <span className="text-[10px] font-medium text-center">{hackathon.location}</span>
          </div>
        </div>

        {hackathon.registrationLink ? (
          <a href={hackathon.registrationLink} target="_blank" rel="noopener noreferrer" className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm text-xs h-8"
              size="sm"
            >
              <Zap className="mr-1 h-3 w-3" />
              Register Now
            </Button>
          </a>
        ) : (
          <Link href={`/hackathons/${hackathon.id}`} className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-sm text-xs h-8"
              size="sm"
            >
              <Zap className="mr-1 h-3 w-3" />
              View Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}