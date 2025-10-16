"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaGuitar, FaAward, FaUserTie, FaSave, FaArrowLeft } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

export default function UpdateBioPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [instructor, setInstructor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const [formData, setFormData] = useState({
        bio: "",
        achievements: "",
        experienceYears: "",
        instrument: ""
    });

    // Fetch instructor data
    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/instructors/${id}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch instructor data");
                }

                const data = await response.json();
                setInstructor(data);
                setFormData({
                    bio: data.bio || "",
                    achievements: data.achievements || "",
                    experienceYears: data.experienceYears || "",
                    instrument: data.instrument || ""
                });
            } catch (error) {
                console.error("Error fetching instructor:", error);
                setMessage({ type: "error", text: "Failed to load instructor data" });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInstructor();
        }
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setUpdating(true);
            setMessage({ type: "", text: "" });

            const response = await fetch(`/api/instructors/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to update profile");
            }

            setMessage({
                type: "success",
                text: "Profile updated successfully!"
            });

            // Redirect back to instructor detail page after 2 seconds

            router.push(`/instructordashboard/updatebio`);


        } catch (error) {
            console.error("Error updating instructor:", error);
            setMessage({
                type: "error",
                text: error.message || "Failed to update profile"
            });
        } finally {
            setUpdating(false);
        }
    };

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase() || "";
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-8">Loading instructor data...</div>
                    </CardContent>
                </Card>
            </div>
        );
    }



    return (
        <div className="  mx-auto py-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>

                    <h1 className="text-3xl font-bold mt-2">Update Profile</h1>
                    <p className="text-muted-foreground">
                        Update your bio, achievements, and teaching information
                    </p>
                </div>

                <Avatar className="h-16 w-16">
                    <AvatarImage className={'object-cover'}  src={instructor.image} alt={instructor.name} />
                    <AvatarFallback className="text-lg">
                        {getInitials(instructor.name)}
                    </AvatarFallback>
                </Avatar>
            </div>

            <Separator />

            {/* Message Alert */}
            {message.text && (
                <Alert variant={message.type === "error" ? "destructive" : "default"}>
                    <AlertDescription>{message.text}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bio Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaUserTie className="text-primary" />
                            About Me
                        </CardTitle>
                        <CardDescription>
                            Tell students about your teaching philosophy and experience
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleInputChange}
                                placeholder="Describe your teaching style, experience, and what students can expect from your lessons..."
                                rows={6}
                                required
                                className="min-h-[120px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Achievements Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FaAward className="text-amber-500" />
                            Achievements
                        </CardTitle>
                        <CardDescription>
                            List your musical achievements, awards, and notable performances (separate with commas)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="achievements">Achievements</Label>
                            <Textarea
                                id="achievements"
                                name="achievements"
                                value={formData.achievements}
                                onChange={handleInputChange}
                                placeholder="Performed at Joy Bangla 2018, Certified Music Teacher, Album Release 2020..."
                                rows={4}
                                className="min-h-[80px]"
                            />
                            <p className="text-sm text-muted-foreground">
                                Separate multiple achievements with commas
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Experience and Instrument Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FaGuitar className="text-primary" />
                                Teaching Experience
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="experienceYears">Years of Experience</Label>
                                <Input
                                    id="experienceYears"
                                    name="experienceYears"
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={formData.experienceYears}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Primary Instrument</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="instrument">Instrument</Label>
                                <Input
                                    id="instrument"
                                    name="instrument"
                                    value={formData.instrument}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Guitar, Piano, Drums, Violin..."
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Preview</CardTitle>
                        <CardDescription>
                            This is how your profile will appear to students
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
                            {/* Bio Preview */}
                            <div>
                                <h4 className="font-semibold mb-2">About Me:</h4>
                                <p className="text-sm text-muted-foreground">
                                    {formData.bio || "Your bio will appear here..."}
                                </p>
                            </div>

                            {/* Achievements Preview */}
                            {instructor.achievements && (
                                <section>


                                    <CardContent className="flex justify-center lg:justify-start   flex-wrap gap-4">
                                        {instructor.achievements
                                            .split(",")
                                            .map((achievement, index) => (
                                                <div
                                                    key={index}
                                                    className="p-4 rounded-2xl shadow bg-white border text-center 
                                                                 transition transform hover:scale-105 hover:shadow-xl hover:bg-gradient-to-r from-primary/10 to-primary/5"
                                                >
                                                    <p className="text-sm text-gray-700">{achievement.trim()}</p>
                                                </div>
                                            ))}
                                    </CardContent>

                                </section>
                            )}

                            {/* Stats Preview */}
                            <div className="flex gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <FaGuitar className="w-3 h-3" />
                                    <span>{formData.instrument || "Instrument"}</span>
                                </div>
                                <div>
                                    <span className="font-medium">{formData.experienceYears || "0"}</span> years experience
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-end pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push(`/instructordashboard/updatebio`)}
                        disabled={updating}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={updating}
                        className="flex items-center gap-2"
                    >
                        <FaSave className="w-4 h-4" />
                        {updating ? "Updating..." : "Update Profile"}
                    </Button>
                </div>
            </form>
        </div>
    );
}