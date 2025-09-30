"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Settings2, House, Clapperboard, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

// Settings Component
function SettingsContent() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [shareProgress, setShareProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setDisplayName('Anime Fan');
      setEmail('user@example.com');
      setUsername('@animefan123');
      
      // Load preferences from localStorage
      const savedTheme = localStorage.getItem('theme');
      const savedShareProgress = localStorage.getItem('shareProgress');
      
      setIsDarkMode(savedTheme === 'dark');
      setShareProgress(savedShareProgress === 'true');
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement actual profile update API call
      // await updateProfile({ displayName });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
    
    // TODO: Implement theme persistence API call
    // await updateUserPreferences({ theme: checked ? 'dark' : 'light' });
    
    toast.success(`Switched to ${checked ? 'dark' : 'light'} mode`);
  };

  const handleShareToggle = (checked: boolean) => {
    setShareProgress(checked);
    localStorage.setItem('shareProgress', checked.toString());
    
    // TODO: Implement privacy settings API call
    // await updatePrivacySettings({ shareProgress: checked });
    
    toast.success(`Progress sharing ${checked ? 'enabled' : 'disabled'}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto p-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>
        
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-heading font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and privacy settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IdCard className="h-5 w-5" />
            Profile
          </CardTitle>
          <CardDescription>
            Update your profile information and display preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" />
              <AvatarFallback>{displayName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{displayName}</h3>
              <p className="text-sm text-muted-foreground">{username}</p>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
            />
          </div>

          <Button onClick={handleSaveProfile} className="w-full">
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Customize your experience and privacy settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme-toggle">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Switch between light and dark themes
              </p>
            </div>
            <Switch
              id="theme-toggle"
              checked={isDarkMode}
              onCheckedChange={handleThemeToggle}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="share-toggle">Share Progress Publicly</Label>
              <p className="text-sm text-muted-foreground">
                Allow others to see your anime watching progress
              </p>
            </div>
            <Switch
              id="share-toggle"
              checked={shareProgress}
              onCheckedChange={handleShareToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Auth Fallback Component
function AuthFallback({ onAuthRequired }: { onAuthRequired?: () => void }) {
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingSession(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAuthClick = () => {
    if (onAuthRequired) {
      onAuthRequired();
    } else {
      // Fire custom event for Header to catch
      window.dispatchEvent(new CustomEvent('openAuthModal'));
    }
  };

  if (isCheckingSession) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <Skeleton className="h-12 w-12 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <IdCard className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access your personalized anime tracking experience.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleAuthClick} className="w-full">
            Sign In to Continue
          </Button>
          <p className="text-xs text-muted-foreground">
            New here? Create an account to get started
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// 404 Error Page Component
function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-lg text-center">
        <CardHeader className="space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/20 rounded-full flex items-center justify-center">
            <Clapperboard className="h-10 w-10 text-primary" />
          </div>
          <div className="space-y-3">
            <CardTitle className="text-2xl">Series Not Found</CardTitle>
            <CardDescription className="text-base">
              We couldn't find that series — maybe try searching for something else? 
              There are thousands of amazing anime waiting to be discovered.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link href="/">
                <House className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/browse">
                <Clapperboard className="h-4 w-4 mr-2" />
                Browse Series
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Lost? Try exploring our featured anime or search for your favorites.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Utilities Section Component
interface UtilitiesSectionProps {
  view?: 'settings' | 'auth-fallback' | '404';
  onAuthRequired?: () => void;
}

export default function UtilitiesSection({ 
  view = 'settings', 
  onAuthRequired 
}: UtilitiesSectionProps) {
  switch (view) {
    case 'auth-fallback':
      return <AuthFallback onAuthRequired={onAuthRequired} />;
    case '404':
      return <NotFoundPage />;
    case 'settings':
    default:
      return <SettingsContent />;
  }
}
