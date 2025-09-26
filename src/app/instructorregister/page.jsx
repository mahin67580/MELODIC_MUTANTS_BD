"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, User, Mail, Lock, BookOpen, Award, Calendar } from "lucide-react";

export default function InstructorRegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    instrument: "",
    experienceYears: "",
    achievements: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const instrumentOptions = [
    "Acoustic Guitar",
    "Electric Guitar",
    "Classical Guitar",
    "Bass Guitar",
    "Piano / Keyboard",
    "Drums / Percussion",
    "Violin",
    "Cello",
    "Flute",
    "Saxophone",
    "Clarinet",
    "Trumpet",
    "Trombone",
    "Vocals (Singing)",
    "Ukulele",
    "Harmonica",
    "Banjo",
    "Tabla / Hand Drums",
    "Digital Music Production"
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name, value) => {
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("Uploading image...");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.url) {
        setForm({ ...form, image: data.url });
        setMessage("✅ Image uploaded successfully!");
      } else {
        setMessage("❌ Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/instructor/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setForm({
          name: "",
          email: "",
          password: "",
          bio: "",
          instrument: "",
          experienceYears: "",
          achievements: "",
          image: "",
        });

        router.push('/instructordashboard/addcourse');
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Instructor registered successfully 🎉",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message || "Something went wrong",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error registering instructor",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 relative flex justify-end lg:pr-28"
      style={{
        backgroundImage: "url('/bg2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/ backdrop-blur-sm"></div>

      <div className="max-w-lg   relative z-10  ">
        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold bg-black bg-clip-text text-transparent">
              𝔅𝔢𝔠𝔬𝔪𝔢 𝔞𝔫 ℑ𝔫𝔰𝔱𝔯𝔲𝔠𝔱𝔬𝔯
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Share your musical expertise with aspiring musicians
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="flex flex-col lg:flex-row gap-5 justify-between">


                <div className="space-y-2">
                  <Label htmlFor="name" className=" ">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    className="h-11 lg:w-56"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className=" ">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    disabled
                    defaultValue={session?.user?.email}
                    placeholder="Your email"
                    className="h-11 lg:w-56  bg-gray-100"
                  />
                </div>
              </div>
              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  required
                  className="h-11"
                />
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your musical journey and teaching philosophy..."
                  rows="3"
                  required
                />
              </div>

              {/* Instrument & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Instrument */}
                <div className="space-y-2">
                  <Label htmlFor="instrument">Primary Instrument</Label>
                  <Select
                    value={form.instrument}
                    onValueChange={(value) => handleSelectChange("instrument", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select instrument" />
                    </SelectTrigger>
                    <SelectContent>
                      {instrumentOptions.map((instrument, index) => (
                        <SelectItem key={index} value={instrument}>
                          {instrument}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Experience */}
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Experience (Years)
                  </Label>
                  <Input
                    id="experienceYears"
                    name="experienceYears"
                    type="number"
                    value={form.experienceYears}
                    onChange={handleChange}
                    placeholder="Years"
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {/* Achievements */}
              <div className="space-y-2">
                <Label htmlFor="achievements" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Achievements
                </Label>
                <Textarea
                  id="achievements"
                  name="achievements"
                  value={form.achievements}
                  onChange={handleChange}
                  placeholder="Notable achievements, awards, or performances (comma-separated)"
                  rows="2"
                />
              </div>

              {/* Profile Image Upload */}
              <div className="space-y-3">
                <Label>Profile Image</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={uploading}
                    />
                    <Label
                      htmlFor="image-upload"
                      className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${uploading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                        }`}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      {uploading ? "Uploading..." : "Choose Image"}
                    </Label>
                  </div>

                  {form.image && !uploading && (
                    <div className="flex-shrink-0">
                      <img
                        src={form.image}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
                      />
                    </div>
                  )}
                </div>

                {uploading && (
                  <div className="flex items-center gap-2 text-blue-600 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading image...</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || uploading}
                className="w-full h-12 text-lg font-semibold bg-black "
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>

            {message && (
              <div className={`mt-4 p-3 rounded-lg text-center text-sm ${message.includes("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}