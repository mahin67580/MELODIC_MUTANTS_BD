"use client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function InstructorRegisterPage() {

  const { data: session, status } = useSession()
  // console.log(session?.user?.email);


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

  const [loading, setLoading] = useState(false); // register button
  const [uploading, setUploading] = useState(false); // image uploading
  const [message, setMessage] = useState("");

  // handle form inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // upload profile image to Cloudinary
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

  // submit instructor data
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
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Register as Instructor</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full border rounded p-2"
          required
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          //value={form.email}
          disabled
          defaultValue={session?.user?.email}
         // onChange={handleChange}
          placeholder="Email"
          className="w-full border rounded p-2"
          //required
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full border rounded p-2"
          required
        />

        {/* Bio */}
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short Bio"
          rows="3"
          className="w-full border rounded p-2"
          required
        />

        {/* Instrument & Experience */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            placeholder="Instrument (e.g., Guitar)"
            className="border rounded p-2"
            required
          />
          <input
            type="number"
            name="experienceYears"
            value={form.experienceYears}
            onChange={handleChange}
            placeholder="Years of Experience"
            className="border rounded p-2"
            required
          />
        </div>

        {/* Achievements */}
        <textarea
          name="achievements"
          value={form.achievements}
          onChange={handleChange}
          placeholder="Achievements (comma-separated)"
          rows="2"
          className="w-full border rounded p-2"
        />

        {/* Profile Image Upload */}
        <div>
          <label className="block font-medium mb-1">Profile Image</label>
          <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg inline-block hover:bg-blue-700 transition-colors">
            {uploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
            />
          </label>

          {uploading && (
            <div className="mt-2 text-blue-600 flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Uploading image...</span>
            </div>
          )}

          {form.image && !uploading && (
            <div className="mt-2">
              <img
                src={form.image}
                alt="Instructor profile"
                className="w-32 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || uploading}
          className={`w-full py-2 rounded-lg transition ${loading || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}
