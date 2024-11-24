"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const authSchema = z.object({
  email: z.string()
    .email()
    .regex(/^[a-z0-9._%+-]+@srmap\.edu\.in$/, 'Must be a valid SRM AP email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50)
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

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
        await createUserWithEmailAndPassword(auth, data.email, data.password);
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
      }
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

  const AuthForm = ({ isSignUp }: { isSignUp: boolean }) => (
    <form onSubmit={handleSubmit((data) => onSubmit(data, isSignUp))} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">College Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ap21@srmap.edu.in"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignUp ? 'Creating Account' : 'Signing In'}
          </>
        ) : (
          isSignUp ? 'Sign Up' : 'Sign In'
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

        <Tabs defaultValue="signin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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