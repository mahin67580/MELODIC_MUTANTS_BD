// app/displayprofile/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    User,
    Mail,
    Phone,
    Music,
    Target,
    Star,
    Calendar,
    Youtube,
    Music2,
    Edit,
    MapPin,
    Camera
} from 'lucide-react';

export default function DisplayProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetchUserProfile();
        }
    }, [session]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/user/profile');

            if (response.ok) {
                const data = await response.json();
                setUserData(data.user);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to load profile');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleEditProfile = () => {
        router.push('/dashboard/userdashboard/profile/updateprofile');
    };

    // Social platform icons and colors
    const socialPlatforms = [
        {
            name: 'YouTube',
            url: userData?.youtubeUrl,
            icon: Youtube,
            color: 'text-red-600'
        },
        {
            name: 'Spotify',
            url: userData?.spotifyUrl,
            icon: Music2,
            color: 'text-green-600'
        },
        {
            name: 'SoundCloud',
            url: userData?.soundcloudUrl,
            icon: Music2,
            color: 'text-orange-600'
        }
    ];

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Alert>
                        <AlertDescription>No profile data found.</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className=" ">
            <div className="mx-auto   space-y-6 ">
                {/* Profile Header - Matching the target design */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col lg:items-start items-center gap-6 md:flex-row md:items-center">
                            <div className="relative">
                                <Avatar className="lg:h-24 lg:w-24 h-32 w-32 ">
                                    <AvatarImage src={userData.image} alt="Profile" className="object-cover" />
                                    <AvatarFallback className="text-2xl">
                                        {getInitials(userData.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
                                    onClick={handleEditProfile}
                                >
                                    <Camera className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex-1 space-y-2  ">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center items-center  ">
                                    <h1 className="text-2xl font-bold">{userData.name}</h1>
                                    <Badge variant="secondary" className="capitalize">
                                        {userData.role}
                                    </Badge>
                                </div>
                                <p className="text-muted-foreground text-center lg:text-start">
                                    {userData.skillLevel ? `${userData.skillLevel} Musician` : 'Music Enthusiast'}
                                </p>
                                <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-4 w-4" />
                                        {userData.email}
                                    </div>
                                    {userData.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            {userData.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        Joined {formatDate(userData.createdAt)}
                                    </div>
                                </div>
                            </div>
                            <Button variant="default" onClick={handleEditProfile}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Profile
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabbed Content - Matching the target design */}
                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="preferences">Preferences</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Your basic information and musical background</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{userData.name}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span>{userData.email}</span>
                                        </div>
                                    </div>
                                    {userData.phone && (
                                        <div className="space-y-2">
                                            <Label>Phone</Label>
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                                <Phone className="h-4 w-4 text-muted-foreground" />
                                                <span>{userData.phone}</span>
                                            </div>
                                        </div>
                                    )}
                                    {userData.skillLevel && (
                                        <div className="space-y-2">
                                            <Label>Skill Level</Label>
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                                <Star className="h-4 w-4 text-muted-foreground" />
                                                <span className="capitalize">{userData.skillLevel}</span>
                                            </div>
                                        </div>
                                    )}
                                    {userData.yearsOfExperience && (
                                        <div className="space-y-2">
                                            <Label>Years of Experience</Label>
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span>{userData.yearsOfExperience} year(s)</span>
                                            </div>
                                        </div>
                                    )}
                                    {userData.practiceFrequency && (
                                        <div className="space-y-2">
                                            <Label>Practice Frequency</Label>
                                            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                                                <Target className="h-4 w-4 text-muted-foreground" />
                                                <span>{userData.practiceFrequency}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {userData.bio && (
                                    <div className="space-y-2">
                                        <Label>Bio</Label>
                                        <div className="p-3 border rounded-md bg-muted/50">
                                            <p className="text-sm leading-relaxed">{userData.bio}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Musical Background */}
                        {(userData.musicalGoals || userData.influences) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Musical Background</CardTitle>
                                    <CardDescription>Your goals and influences in music</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {userData.musicalGoals && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Musical Goals</h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {userData.musicalGoals}
                                            </p>
                                        </div>
                                    )}
                                    <Separator />
                                    {userData.influences && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Musical Influences</h3>
                                            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                                {userData.influences}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-6">
                        {(userData.favoriteInstruments?.length > 0 || userData.favoriteGenres?.length > 0) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Music Preferences</CardTitle>
                                    <CardDescription>Your favorite instruments and musical genres</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {userData.favoriteInstruments?.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Favorite Instruments</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.favoriteInstruments.map((instrument, index) => (
                                                    <Badge key={index} variant="secondary" className="px-3 py-1">
                                                        {instrument}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <Separator />
                                    {userData.favoriteGenres?.length > 0 && (
                                        <div>
                                            <h3 className="font-semibold mb-3">Favorite Genres</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {userData.favoriteGenres.map((genre, index) => (
                                                    <Badge key={index} variant="outline" className="px-3 py-1">
                                                        {genre}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Social Tab */}
                    <TabsContent value="social" className="space-y-6">
                        {(userData.youtubeUrl || userData.spotifyUrl || userData.soundcloudUrl) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Social Links</CardTitle>
                                    <CardDescription>Your musical presence online</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {socialPlatforms.map((platform, index) =>
                                            platform.url && (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <platform.icon className={`h-5 w-5 ${platform.color}`} />
                                                        <div>
                                                            <div className="font-medium">{platform.name}</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {platform.name === 'Spotify' ? 'Profile' : 'Channel'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button variant="outline" size="sm" asChild>
                                                        <a
                                                            href={platform.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            Visit
                                                        </a>
                                                    </Button>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Your account details and membership</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Member Since</Label>
                                        <p className="text-muted-foreground text-sm">
                                            {formatDate(userData.createdAt)}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Last Updated</Label>
                                        <p className="text-muted-foreground text-sm">
                                            {formatDate(userData.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Account Type</Label>
                                        <p className="text-muted-foreground text-sm capitalize">
                                            {userData.role} Account
                                        </p>
                                    </div>
                                    <Badge variant={userData.role === 'instructor' ? 'default' : 'secondary'}>
                                        {userData.role}
                                    </Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Empty State for New Users */}
                {!userData.bio &&
                    !userData.phone &&
                    !userData.skillLevel &&
                    !userData.yearsOfExperience &&
                    !userData.practiceFrequency &&
                    (!userData.favoriteInstruments || userData.favoriteInstruments.length === 0) &&
                    (!userData.favoriteGenres || userData.favoriteGenres.length === 0) &&
                    !userData.musicalGoals &&
                    !userData.influences && (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold mb-2">
                                        Complete Your Musical Profile
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Add your musical preferences, goals, and background to get personalized recommendations.
                                    </p>
                                    <Button onClick={handleEditProfile}>
                                        Complete Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
            </div>
        </div>
    );
}

// Label component if not available
function Label({ children, ...props }) {
    return (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" {...props}>
            {children}
        </label>
    );
}