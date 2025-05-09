"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendEmailVerification } from 'firebase/auth';
import { auth, googleProvider, db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { doc, setDoc } from 'firebase/firestore';

// Add JSX namespace import
import type { JSX } from 'react';

const authSchema = z.object({
  email: z.string()
    .email()
    .regex(/^[a-z0-9._%+-]+@srmap\.edu\.in$/, 'Must be a valid SRM AP email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50)
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [storedOTP, setStoredOTP] = useState('');
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  // Function to generate OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Function to send OTP email
  const sendOTPEmail = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
    } catch (error) {
      throw new Error('Failed to send OTP email');
    }
  };

  const handleSuccessfulAuth = () => {
    toast({
      title: "Success",
      description: "Signed in successfully"
    });
    router.push('/discover?tab=profile');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      handleSuccessfulAuth();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AuthFormData, isSignUp: boolean) => {
    try {
      setLoading(true);
      if (isSignUp) {
        if (!showOTPInput) {
          // Generate and send OTP
          const generatedOTP = generateOTP();
          setStoredOTP(generatedOTP);
          await sendOTPEmail(data.email, generatedOTP);
          setVerificationEmail(data.email);
          setShowOTPInput(true);
          toast({
            title: "OTP Sent",
            description: "Please check your email for the verification code"
          });
        } else {
          // Verify OTP
          if (otp === storedOTP) {
            const userCredential = await createUserWithEmailAndPassword(auth, verificationEmail, data.password);
            await sendEmailVerification(userCredential.user);
            
            // Create user document in Firestore
            await setDoc(doc(db, 'users', userCredential.user.uid), {
              email: verificationEmail,
              createdAt: new Date(),
              emailVerified: false
            });
            
            handleSuccessfulAuth();
          } else {
            toast({
              title: "Error",
              description: "Invalid OTP. Please try again.",
              variant: "destructive"
            });
          }
        }
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        handleSuccessfulAuth();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const AuthForm = ({ isSignUp }: { isSignUp: boolean }): JSX.Element => (
    <form onSubmit={handleSubmit((data) => onSubmit(data, isSignUp))} className="space-y-4">
      {isSignUp && showOTPInput ? (
        <div className="space-y-2">
          <Label htmlFor="otp">Enter OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <p className="text-sm text-muted-foreground">
            OTP sent to {verificationEmail}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor={`email-${isSignUp ? 'signup' : 'signin'}`}>College Email</Label>
            <Input
              id={`email-${isSignUp ? 'signup' : 'signin'}`}
              type="email"
              placeholder="ap21@srmap.edu.in"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`password-${isSignUp ? 'signup' : 'signin'}`}>Password</Label>
            <Input
              id={`password-${isSignUp ? 'signup' : 'signin'}`}
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />
            {isSignUp ? 
              (showOTPInput ? 'Verifying OTP' : 'Sending OTP') 
              : 'Signing In'}
          </>
        ) : (
          isSignUp ? 
            (showOTPInput ? 'Verify OTP' : 'Sign Up') 
            : 'Sign In'
        )}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Welcome to SRM University AP</h1>
          <p className="text-muted-foreground">Sign in to access your campus account</p>
        </div>

        <Tabs defaultValue="signin" className={cn("space-y-6")}>
          <TabsList className={cn("grid w-full grid-cols-2")}>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="space-y-4">
              <AuthForm isSignUp={false} />
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className={cn("mr-2 h-4 w-4 animate-spin")} />
                ) : (
                  'Sign in with Google'
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <AuthForm isSignUp={true} />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}