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
    instructorName: "",
    instructorBio: "",
    thumbnail: "",
  });

  const [syllabus, setSyllabus] = useState([]);
  const [lesson, setLesson] = useState("");

  const [resources, setResources] = useState([]);
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");

  // ---------- MILESTONES ----------
  const [milestones, setMilestones] = useState([]);
  const [milestoneTitle, setMilestoneTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Instrument options
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

  // Level options
  const levelOptions = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Masterclass"
  ];

  // Category options
  const categoryOptions = [
    "Fundamentals",
    "Technique",
    "Performance",
    "Improvisation",
    "Songwriting",
    "Composition",
    "Ear Training",
    "Music Theory",
    "Sight Reading",
    "Stage Presence",
    "Fingerstyle (Guitar)",
    "Slap & Pop (Bass)",
    "Double Bass Pedal (Drums)",
    "Chord Progressions",
    "Lead Playing / Soloing",
    "Rhythm & Groove"
  ];

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
      setResources([
        ...resources,
        { name: resourceName.trim(), url: resourceUrl.trim() },
      ]);
      setResourceName("");
      setResourceUrl("");
    }
  };

  // ---------- ADD NEW MILESTONE ----------
  const addMilestone = () => {
    if (milestoneTitle.trim()) {
      setMilestones([
        ...milestones,
        {
          title: milestoneTitle.trim(),
          modules: [],
          newModuleTitle: "",
          newModuleVideo: "",
        },
      ]);
      setMilestoneTitle("");
    }
  };

  // ---------- HANDLE MODULE INPUT PER MILESTONE ----------
  const handleModuleInputChange = (index, field, value) => {
    const updated = [...milestones];
    updated[index][field] = value;
    setMilestones(updated);
  };

  // ---------- ADD MODULE TO SPECIFIC MILESTONE ----------
  const addModule = (index) => {
    const updated = [...milestones];
    const milestone = updated[index];
    if (milestone.newModuleTitle.trim() && milestone.newModuleVideo.trim()) {
      milestone.modules.push({
        title: milestone.newModuleTitle.trim(),
        video: milestone.newModuleVideo.trim(),
      });
      milestone.newModuleTitle = "";
      milestone.newModuleVideo = "";
    }
    setMilestones(updated);
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
      // remove temp inputs before sending
      const cleanedMilestones = milestones.map(({ newModuleTitle, newModuleVideo, ...rest }) => rest);

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
          instructor: {
            name: form.instructorName,
            bio: form.instructorBio,
          },
          syllabus,
          resources: { downloadables: resources },
          milestones: cleanedMilestones, // send cleaned milestones with modules
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
          instructorName: "",
          instructorBio: "",
          thumbnail: "",
        });
        setSyllabus([]);
        setResources([]);
        setMilestones([]);

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
    <div className="  ">
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
          {/* Instrument Dropdown */}
          <select
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Instrument</option>
            {instrumentOptions.map((instrument, index) => (
              <option key={index} value={instrument}>
                {instrument}
              </option>
            ))}
          </select>

          {/* Level Dropdown */}
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Level</option>
            {levelOptions.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>

          {/* Category Dropdown */}
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border rounded p-2"
            required
          >
            <option value="">Select Category</option>
            {categoryOptions.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
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

        {/* ---------- Milestones & Modules Section ---------- */}
        <div>
          <label className="block font-medium mb-1">Course Milestones</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={milestoneTitle}
              onChange={(e) => setMilestoneTitle(e.target.value)}
              placeholder="Milestone Title (e.g. Milestone 1)"
              className="flex-1 border rounded p-2"
            />
            <button
              type="button"
              onClick={addMilestone}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add Milestone
            </button>
          </div>

          {milestones.map((m, mi) => (
            <div key={mi} className="border rounded p-3 mb-3">
              <h3 className="font-semibold">{m.title}</h3>

              {/* Add Module under this milestone */}
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={m.newModuleTitle}
                  onChange={(e) =>
                    handleModuleInputChange(mi, "newModuleTitle", e.target.value)
                  }
                  placeholder="Module Title"
                  className="flex-1 border rounded p-2"
                />
                <input
                  type="text"
                  value={m.newModuleVideo}
                  onChange={(e) =>
                    handleModuleInputChange(mi, "newModuleVideo", e.target.value)
                  }
                  placeholder="Video Link"
                  className="flex-1 border rounded p-2"
                />
                <button
                  type="button"
                  onClick={() => addModule(mi)}
                  className="bg-green-600 text-white px-4 rounded"
                >
                  Add Module
                </button>
              </div>

              {/* Show modules */}
              <ul className="mt-2 list-disc pl-6">
                {m.modules.map((mod, idx) => (
                  <li key={idx}>
                    <strong>{mod.title}:</strong>{" "}
                    <a
                      href={mod.video}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      {mod.video}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Syllabus */}
        <div>
          <label className="block font-medium mb-1">Extra Syllabus Points</label>
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
                <strong>{r.name}:</strong>{" "}
                <a
                  href={r.url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.url}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploading}
          className={`w-full py-2 rounded-lg transition ${
            loading || uploading
              ? "bg-gray-400 cursor-not-allowed"
              : " bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Course"}
        </button>
      </form>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}