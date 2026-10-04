'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Check, X } from 'lucide-react';
import { evaluatePassword } from '@/lib/auth';

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const router = useRouter();
  const { register, user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{ score: number; label: string; checks: string[] } | null>(null);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-dvh w-full items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    );
  }

  if (user) {
    return null;
  }

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
    const result = await register(values.name, values.email, values.password);
    if (result.error) {
      form.setError('email', { type: 'manual', message: result.error });
    } else {
      router.push('/');
    }
    setIsSubmitting(false);
  };

  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    form.setValue('password', value);
    if (value) {
      setPasswordStrength(evaluatePassword(value));
    } else {
      setPasswordStrength(null);
    }
  };

  return (
    <div className="flex min-h-dvh w-full items-center justify-center bg-background p-4">
      <Card decoration="tape" className="w-full max-w-md hover:rotate-0">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Create Account</CardTitle>
          <CardDescription>Join the sketchy budget tracker community.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input
                          type="text"
                          placeholder="Jane Doe"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-12"
                          {...field}
                          onChange={onPasswordChange}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground/50 hover:text-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {passwordStrength && (
                <div className="space-y-2 rounded-sm border-2 border-foreground bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-sm font-bold">
                      Password Strength: {passwordStrength.label}
                    </span>
                    <span className={`text-xs ${passwordStrength.score >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                      {passwordStrength.score}/5
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((i) => {
                      let barClass = 'bg-muted';
                      if (i < passwordStrength.score) {
                        if (passwordStrength.score >= 4) {
                          barClass = 'bg-primary';
                        } else if (passwordStrength.score >= 2) {
                          barClass = 'bg-foreground/50';
                        } else {
                          barClass = 'bg-foreground/30';
                        }
                      }
                      return (
                        <div
                          key={i}
                          className={`h-2 flex-1 rounded-sm ${barClass}`}
                        />
                      );
                    })}
                  </div>
                  <div className="space-y-1">
                    {passwordStrength.checks.map((check, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <Check className={`h-3 w-3 ${i < passwordStrength.score ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={i < passwordStrength.score ? 'text-foreground' : 'text-muted-foreground'}>
                          {check}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-12"
                          {...field}
                        />
                        <button
                          type="button"
                          tabIndex={-1}
                          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-muted-foreground/50 hover:text-foreground"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></span>
                    Creating account...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Register
                  </span>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-base">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Link
              href="/login"
              className="font-headline font-bold text-primary underline decoration-wavy underline-offset-2 hover:text-accent"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

RegisterPage.auth = false;