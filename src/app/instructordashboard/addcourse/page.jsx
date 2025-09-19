"use client";
import { useState } from "react";
import Swal from "sweetalert2";
export default function UploadCoursePage() {
  const [form, setForm] = useState({
    title: "",
    instrument: "",
    level: "",
    category: "",
    description: "",
    price: "",
    videoPreview: "",
    instructorName: "",
    instructorBio: "",
    thumbnail: "",
  });

  const [syllabus, setSyllabus] = useState([]);
  const [lesson, setLesson] = useState("");

  const [resources, setResources] = useState([]);
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false); // image uploading
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addLesson = () => {
    if (lesson.trim()) {
      setSyllabus([...syllabus, lesson.trim()]);
      setLesson("");
    }
  };

  const addResource = () => {
    if (resourceName.trim() && resourceUrl.trim()) {
      setResources([...resources, {
        name: resourceName.trim(),
        url: resourceUrl.trim()
      }]);
      setResourceName("");
      setResourceUrl("");
    }
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
        setForm({ ...form, thumbnail: data.url });
        setMessage("✅ Image uploaded successfully!");
      } else {
        setMessage("❌ Failed to upload image");
      }
    } catch (err) {
      console.error(err);
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
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          instrument: form.instrument,
          level: form.level,
          category: form.category,
          longDescription: form.description,
          price: Number(form.price),
          thumbnail: form.thumbnail,
          videoPreview: form.videoPreview,
          instructor: {
            name: form.instructorName,
            bio: form.instructorBio,
          },
          syllabus,
          resources: {
            downloadables: resources,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setForm({
          title: "",
          instrument: "",
          level: "",
          category: "",
          description: "",
          price: "",
          videoPreview: "",
          instructorName: "",
          instructorBio: "",
          thumbnail: "",
        });
        setSyllabus([]);
        setResources([]);

        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Course uploaded successfully 🎉",
          confirmButtonColor: "#3085d6",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.error || "Something went wrong",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error uploading course",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="  mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload New Course</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        {/* Title */}
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border rounded p-2"
          required
        />

        {/* Instrument, Level, Category */}
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            placeholder="Instrument"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="level"
            value={form.level}
            onChange={handleChange}
            placeholder="Level"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border rounded p-2"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Course Description"
          rows="3"
          className="w-full border rounded p-2"
        />

        {/* Price */}
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price ($)"
          className="w-full border rounded p-2"
        />

        {/* Thumbnail Upload */}
        <div>
          <label className="block font-medium mb-1">Course Thumbnail</label>
          <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg inline-block hover:bg-blue-700 transition-colors">
            {uploading ? "Uploading..." : "Upload Image /JPG"}
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
          {/* /form.thumbnail */}
          {form.thumbnail && !uploading && (
            <div className="mt-2">
              <img
                src={form.thumbnail}
                alt="Course thumbnail"
                className="w-32 h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}
        </div>

        {/* YouTube Video */}
        <input
          type="text"
          name="videoPreview"
          value={form.videoPreview}
          onChange={handleChange}
          placeholder="YouTube Video Link"
          className="w-full border rounded p-2"
          required
        />

        {/* Instructor */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="instructorName"
            value={form.instructorName}
            onChange={handleChange}
            placeholder="Instructor Name"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="instructorBio"
            value={form.instructorBio}
            onChange={handleChange}
            placeholder="Instructor Bio"
            className="border rounded p-2"
          />
        </div>

        {/* Syllabus */}
        <div>
          <label className="block font-medium mb-1">Course Content / Syllabus</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={lesson}
              onChange={(e) => setLesson(e.target.value)}
              placeholder="Enter lesson"
              className="flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={addLesson}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
          <ul className="mt-2 list-disc pl-6">
            {syllabus.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <label className="block font-medium mb-1">Resources (PDF Links)</label>
          <div className="grid sm:grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              value={resourceName}
              onChange={(e) => setResourceName(e.target.value)}
              placeholder="Resource Name"
              className="border rounded p-2"
            />
            <input
              type="text"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="Resource URL"
              className="border rounded p-2"
            />
          </div>
          <button
            type="button"
            onClick={addResource}
            className="bg-green-600 text-white px-4 py-2 rounded mb-2"
          >
            Add Resource
          </button>
          <ul className="mt-2 list-disc pl-6">
            {resources.map((r, i) => (
              <li key={i}>
                <strong>{r.name}:</strong> <a href={r.url} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">{r.url}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className={`w-full py-2 rounded-lg transition ${loading || uploading
            ? "bg-gray-400 cursor-not-allowed"
            : " bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            }`}
        >
          {loading ? "Uploading..." : "Upload Course"}
        </button>
      </form>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}