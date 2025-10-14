// app/profile/page.jsx
"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Mail, MapPin, User, Phone, Music, Target, Star, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';

// Music-related data
const INSTRUMENTS = [
    'Guitar', 'Piano', 'Violin', 'Drums', 'Bass', 'Saxophone', 'Flute',
    'Trumpet', 'Cello', 'Vocals', 'Ukulele', 'Harmonica', 'Keyboard', 'Clarinet'
];

const GENRES = [
    'Rock', 'Pop', 'Jazz', 'Classical', 'Blues', 'Metal', 'Country',
    'Hip Hop', 'R&B', 'Electronic', 'Folk', 'Reggae', 'Funk', 'Soul'
];

const SKILL_LEVELS = [
    'Beginner', 'Intermediate', 'Advanced', 'Professional'
];

const PRACTICE_FREQUENCY = [
    'Daily', '3-4 times a week', 'Weekly', 'Occasionally'
];

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [userData, setUserData] = useState({
        // Basic info
        name: '',
        email: '',
        image: '',
        phone: '',
        bio: '',
        location: '',

        // Music preferences
        favoriteInstruments: [],
        favoriteGenres: [],
        skillLevel: '',
        yearsOfExperience: '',
        practiceFrequency: '',
        musicalGoals: '',
        influences: '',

        // Social links
        youtubeUrl: '',
        spotifyUrl: '',
        soundcloudUrl: '',
    });

    const [newInstrument, setNewInstrument] = useState('');
    const [newGenre, setNewGenre] = useState('');

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
            const response = await fetch('/api/user/profile');
            if (response.ok) {
                const data = await response.json();
                if (data.user) {
                    setUserData(prev => ({
                        ...prev,
                        ...data.user,
                        favoriteInstruments: data.user.favoriteInstruments || [],
                        favoriteGenres: data.user.favoriteGenres || [],
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSelectChange = (name, value) => {
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage({ type: 'error', text: 'Please upload an image file' });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setMessage({ type: 'error', text: 'Image size should be less than 5MB' });
            return;
        }

        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUserData(prev => ({ ...prev, image: data.url }));
                setMessage({ type: 'success', text: 'Image uploaded successfully' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to upload image' });
        } finally {
            setImageUploading(false);
        }
    };

    const addInstrument = () => {
        if (newInstrument && !userData.favoriteInstruments.includes(newInstrument)) {
            setUserData(prev => ({
                ...prev,
                favoriteInstruments: [...prev.favoriteInstruments, newInstrument]
            }));
            setNewInstrument('');
        }
    };

    const removeInstrument = (instrument) => {
        setUserData(prev => ({
            ...prev,
            favoriteInstruments: prev.favoriteInstruments.filter(i => i !== instrument)
        }));
    };

    const addGenre = () => {
        if (newGenre && !userData.favoriteGenres.includes(newGenre)) {
            setUserData(prev => ({
                ...prev,
                favoriteGenres: [...prev.favoriteGenres, newGenre]
            }));
            setNewGenre('');
        }
    };

    const removeGenre = (genre) => {
        setUserData(prev => ({
            ...prev,
            favoriteGenres: prev.favoriteGenres.filter(g => g !== genre)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (response.ok) {
                  router.push('/dashboard/userdashboard/profile');
                setMessage({ type: 'success', text: 'Profile updated successfully' });

                // ✅ SweetAlert2 Success Notification
                Swal.fire({
                    title: 'Profile Updated!',
                    text: 'Your profile has been successfully updated.',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                    timer: 2000,
                    timerProgressBar: true,
                });

                // Update session info
                await update({
                    ...session,
                    user: {
                        ...session.user,
                        name: userData.name,
                        image: userData.image,
                    },
                });
        

            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to update profile' });

                // ❌ SweetAlert2 Error Notification
                Swal.fire({
                    title: 'Update Failed',
                    text: data.error || 'Something went wrong while updating your profile.',
                    icon: 'error',
                    confirmButtonColor: '#d33',
                    confirmButtonText: 'Try Again',
                });
            }
            
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });

            // ❌ SweetAlert2 Error Notification
            Swal.fire({
                title: 'Error',
                text: 'An unexpected error occurred while updating your profile.',
                icon: 'error',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
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

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-full max-w-4xl space-y-6">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className=" ">
            <div className="mx-auto space-y-6 ">
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
                                <label htmlFor="profile-image" className="absolute -right-2 -bottom-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-8 w-8 rounded-full cursor-pointer"
                                        asChild
                                    >
                                        <span>
                                            <Camera className="h-4 w-4" />
                                        </span>
                                    </Button>
                                    <input
                                        id="profile-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={imageUploading || loading}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex flex-col gap-2 md:flex-row md:items-center">
                                    <h1 className="text-2xl font-bold text-center lg:text-start">Edit Profile</h1>
                                    {/* <Badge variant="secondary" className="capitalize ">
                    {userData.role || 'Member'}
                  </Badge> */}
                                </div>
                                <p className="text-muted-foreground">
                                    Update your personal and musical information
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
                                        {userData.createdAt ? `Joined ${new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : 'Member'}
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                form="profile-form"
                                disabled={loading || imageUploading}
                                className="min-w-24"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {message.text && (
                    <Alert variant={message.type === 'success' ? 'default' : 'destructive'}>
                        <AlertDescription>{message.text}</AlertDescription>
                    </Alert>
                )}

                {/* Tabbed Content - Matching the target design */}
                <Tabs defaultValue="personal" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="music">Music</TabsTrigger>
                        <TabsTrigger value="social">Social</TabsTrigger>
                    </TabsList>

                    {/* Personal Information Tab */}
                    <TabsContent value="personal" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>Update your personal details and profile information.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">First Name</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleInputChange}
                                            required
                                            disabled={loading}
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={userData.email}
                                            onChange={handleInputChange}
                                            disabled
                                            className="bg-muted"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={userData.phone || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Your phone number"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            value={userData.location || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Your city, state"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="skillLevel">Skill Level</Label>
                                        <Select
                                            value={userData.skillLevel}
                                            onValueChange={(value) => handleSelectChange('skillLevel', value)}
                                            disabled={loading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select your skill level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SKILL_LEVELS.map(level => (
                                                    <SelectItem key={level} value={level}>{level}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                                        <Input
                                            type="number"
                                            id="yearsOfExperience"
                                            name="yearsOfExperience"
                                            value={userData.yearsOfExperience || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="0"
                                            min="0"
                                            max="80"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={userData.bio || ''}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        placeholder="Tell us about your musical journey..."
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Music Preferences Tab */}
                    <TabsContent value="music" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Music Preferences</CardTitle>
                                <CardDescription>Tell us about your musical tastes and practice habits.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Favorite Instruments */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-base">Favorite Instruments</Label>
                                            <p className="text-muted-foreground text-sm">Select your preferred musical instruments</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {userData.favoriteInstruments.map((instrument, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1">
                                                {instrument}
                                                <button
                                                    type="button"
                                                    onClick={() => removeInstrument(instrument)}
                                                    className="ml-2 text-xs hover:text-red-500"
                                                    disabled={loading}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                        {userData.favoriteInstruments.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No instruments selected</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Select value={newInstrument} onValueChange={setNewInstrument}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select an instrument" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {INSTRUMENTS.map(instrument => (
                                                    <SelectItem key={instrument} value={instrument}>
                                                        {instrument}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            onClick={addInstrument}
                                            disabled={!newInstrument || loading}
                                            variant="outline"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                {/* Favorite Genres */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <Label className="text-base">Favorite Genres</Label>
                                            <p className="text-muted-foreground text-sm">Choose your preferred music genres</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {userData.favoriteGenres.map((genre, index) => (
                                            <Badge key={index} variant="outline" className="px-3 py-1">
                                                {genre}
                                                <button
                                                    type="button"
                                                    onClick={() => removeGenre(genre)}
                                                    className="ml-2 text-xs hover:text-red-500"
                                                    disabled={loading}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                        {userData.favoriteGenres.length === 0 && (
                                            <p className="text-sm text-muted-foreground">No genres selected</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <Select value={newGenre} onValueChange={setNewGenre}>
                                            <SelectTrigger className="flex-1">
                                                <SelectValue placeholder="Select a genre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {GENRES.map(genre => (
                                                    <SelectItem key={genre} value={genre}>
                                                        {genre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <Button
                                            type="button"
                                            onClick={addGenre}
                                            disabled={!newGenre || loading}
                                            variant="outline"
                                        >
                                            Add
                                        </Button>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="practiceFrequency">Practice Frequency</Label>
                                        <Select
                                            value={userData.practiceFrequency}
                                            onValueChange={(value) => handleSelectChange('practiceFrequency', value)}
                                            disabled={loading}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="How often do you practice?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PRACTICE_FREQUENCY.map(freq => (
                                                    <SelectItem key={freq} value={freq}>{freq}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="musicalGoals">Musical Goals</Label>
                                        <Textarea
                                            id="musicalGoals"
                                            name="musicalGoals"
                                            value={userData.musicalGoals || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="What are your musical goals? (e.g., learn jazz improvisation, join a band, record an album)"
                                            rows={3}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="influences">Musical Influences</Label>
                                        <Textarea
                                            id="influences"
                                            name="influences"
                                            value={userData.influences || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="Who are your favorite artists or biggest musical influences?"
                                            rows={2}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Social Links Tab */}
                    <TabsContent value="social" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Social Links</CardTitle>
                                <CardDescription>Share your musical presence online.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="youtubeUrl">YouTube Channel</Label>
                                        <Input
                                            type="url"
                                            id="youtubeUrl"
                                            name="youtubeUrl"
                                            value={userData.youtubeUrl || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="https://youtube.com/your-channel"
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="spotifyUrl">Spotify Profile</Label>
                                        <Input
                                            type="url"
                                            id="spotifyUrl"
                                            name="spotifyUrl"
                                            value={userData.spotifyUrl || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="https://open.spotify.com/user/your-profile"
                                        />
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <Label htmlFor="soundcloudUrl">SoundCloud</Label>
                                        <Input
                                            type="url"
                                            id="soundcloudUrl"
                                            name="soundcloudUrl"
                                            value={userData.soundcloudUrl || ''}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            placeholder="https://soundcloud.com/your-profile"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Information</CardTitle>
                                <CardDescription>Your account details and membership.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Account Status</Label>
                                        <p className="text-muted-foreground text-sm">Your account is currently active</p>
                                    </div>
                                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                                        Active
                                    </Badge>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Member Since</Label>
                                        <p className="text-muted-foreground text-sm">
                                            {userData.createdAt ? formatDate(userData.createdAt) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <Label className="text-base">Last Updated</Label>
                                        <p className="text-muted-foreground text-sm">
                                            {userData.updatedAt ? formatDate(userData.updatedAt) : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Hidden form for submission */}
                <form id="profile-form" onSubmit={handleSubmit} className="hidden" />
            </div>
        </div>
    );
}

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}