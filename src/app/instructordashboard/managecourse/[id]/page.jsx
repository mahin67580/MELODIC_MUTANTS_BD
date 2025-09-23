"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function EditCoursePage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    instrument: "",
    level: "",
    category: "",
    description: "",
    longDescription: "",
    price: "",
    thumbnail: "",
    videoPreview: "",
    instructorName: "",
    instructorBio: "",
  });

  const [syllabus, setSyllabus] = useState([]);
  const [lesson, setLesson] = useState("");

  const [resources, setResources] = useState([]);
  const [resourceName, setResourceName] = useState("");
  const [resourceUrl, setResourceUrl] = useState("");

  const [milestones, setMilestones] = useState([]);
  const [currentMilestone, setCurrentMilestone] = useState({
    title: "",
    modules: [],
  });
  const [currentModule, setCurrentModule] = useState({
    title: "",
    video: "",
  });

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/courses/${id}`);
        if (!res.ok) throw new Error("Failed to fetch course");

        const data = await res.json();

        setFormData({
          title: data.title || "",
          instrument: data.instrument || "",
          level: data.level || "",
          category: data.category || "",
          description: data.description || "",
          longDescription: data.longDescription || "",
          price: data.price || "",
          thumbnail: data.thumbnail || "",
          videoPreview: data.videoPreview || "",
          instructorName: data.instructor?.name || "",
          instructorBio: data.instructor?.bio || "",
        });

        setSyllabus(data.syllabus || []);
        setResources(data.resources?.downloadables || []);
        setMilestones(data.milestones || []);

        setLoading(false);
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "Failed to load course data", "error");
      }
    };

    if (id) fetchCourse();
  }, [id]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Add syllabus lesson
  const addLesson = () => {
    if (lesson.trim()) {
      setSyllabus([...syllabus, lesson.trim()]);
      setLesson("");
    }
  };

  const removeLesson = (index) => {
    setSyllabus(syllabus.filter((_, i) => i !== index));
  };

  // ✅ Add resource
  const addResource = () => {
    if (resourceName.trim() && resourceUrl.trim()) {
      setResources([...resources, { name: resourceName, url: resourceUrl }]);
      setResourceName("");
      setResourceUrl("");
    }
  };

  const removeResource = (index) => {
    setResources(resources.filter((_, i) => i !== index));
  };

  // ✅ Handle milestone changes
  const handleMilestoneChange = (e) => {
    const { value } = e.target;
    setCurrentMilestone({ ...currentMilestone, title: value });
  };

  // ✅ Add milestone
  const addMilestone = () => {
    if (currentMilestone.title.trim()) {
      setMilestones([...milestones, { ...currentMilestone, modules: [] }]);
      setCurrentMilestone({ title: "", modules: [] });
    }
  };

  const removeMilestone = (index) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  // ✅ Handle module changes
  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setCurrentModule({ ...currentModule, [name]: value });
  };

  // ✅ Add module to current milestone
  const addModuleToMilestone = (milestoneIndex) => {
    if (currentModule.title.trim() && currentModule.video.trim()) {
      const updatedMilestones = [...milestones];
      updatedMilestones[milestoneIndex].modules.push({ ...currentModule });
      setMilestones(updatedMilestones);
      setCurrentModule({ title: "", video: "" });
    }
  };

  // ✅ Remove module from milestone
  const removeModuleFromMilestone = (milestoneIndex, moduleIndex) => {
    const updatedMilestones = [...milestones];
    updatedMilestones[milestoneIndex].modules = updatedMilestones[
      milestoneIndex
    ].modules.filter((_, i) => i !== moduleIndex);
    setMilestones(updatedMilestones);
  };

  // ✅ Upload new image
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      setImageUploading(true); // start loading
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setFormData((prev) => ({ ...prev, thumbnail: data.url }));
        Swal.fire("Success", "Image uploaded successfully!", "success");
      } else {
        Swal.fire("Error", "Failed to upload image", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Upload error", "error");
    } finally {
      setImageUploading(false); // stop loading
    }
  };

  // ✅ Handle update
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          instructor: {
            name: formData.instructorName,
            bio: formData.instructorBio,
          },
          syllabus,
          resources: { downloadables: resources },
          milestones,
        }),
      });

      if (!res.ok) throw new Error("Failed to update course");

      Swal.fire("Updated!", "Course updated successfully.", "success");
      router.push("/instructordashboard/managecourse");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update course", "error");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Course</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-2xl p-6 space-y-4"
      >
        {/* Title */}
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Course Title"
          className="w-full border rounded p-2"
          required
        />

        {/* Instrument / Level / Category */}
        <div className="grid sm:grid-cols-3 gap-4">
          <input
            type="text"
            name="instrument"
            value={formData.instrument}
            onChange={handleChange}
            placeholder="Instrument"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
            placeholder="Level"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="border rounded p-2"
          />
        </div>

        {/* Price */}
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price ($)"
          className="w-full border rounded p-2"
        />

        {/* Thumbnail Upload */}
        <div>
          <label className="block font-medium mb-1">Course Image</label>
          <label className="cursor-pointer bg-blue-600 text-white py-2 px-4 rounded-lg inline-block hover:bg-blue-700 transition-colors">
            {imageUploading ? "Uploading..." : "Choose Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          {imageUploading && (
            <p className="text-sm text-gray-500 mt-1 animate-pulse">⏳ Uploading image...</p>
          )}

          {formData.thumbnail && !imageUploading && (
            <div className="mt-2">
              <img
                src={formData.thumbnail}
                alt="Course thumbnail"
                className="w-40 h-40 object-cover rounded-lg shadow"
              />
            </div>
          )}
        </div>

        {/* Video Preview */}
        <input
          type="text"
          name="videoPreview"
          value={formData.videoPreview}
          onChange={handleChange}
          placeholder="YouTube Video Link"
          className="w-full border rounded p-2"
        />

        {/* Instructor */}
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="instructorName"
            value={formData.instructorName}
            onChange={handleChange}
            placeholder="Instructor Name"
            className="border rounded p-2"
          />
          <input
            type="text"
            name="instructorBio"
            value={formData.instructorBio}
            onChange={handleChange}
            placeholder="Instructor Bio"
            className="border rounded p-2"
          />
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Description"
          rows="3"
          className="w-full border rounded p-2"
        />

        {/* Long Description */}
        <textarea
          name="longDescription"
          value={formData.longDescription}
          onChange={handleChange}
          placeholder="Detailed Description"
          rows="5"
          className="w-full border rounded p-2"
        />

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
            <button type="button" onClick={addLesson} className="bg-blue-600 text-white px-4 rounded">
              Add
            </button>
          </div>
          <ul className="mt-2 list-disc pl-6">
            {syllabus.map((l, i) => (
              <li key={i} className="flex justify-between">
                {l}
                <button
                  type="button"
                  onClick={() => removeLesson(i)}
                  className="text-red-500 text-sm"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Milestones and Modules */}
        <div>
          <label className="block font-medium mb-1">Milestones & Modules</label>

          {/* Add New Milestone */}
          <div className="mb-4 p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Add New Milestone</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={currentMilestone.title}
                onChange={handleMilestoneChange}
                placeholder="Milestone Title"
                className="flex-1 border rounded p-2"
              />
              <button type="button" onClick={addMilestone} className="bg-blue-600 text-white px-4 rounded">
                Add Milestone
              </button>
            </div>
          </div>

          {/* Existing Milestones */}
          {milestones.map((milestone, milestoneIndex) => (
            <div key={milestoneIndex} className="mb-4 p-4 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium">Milestone: {milestone.title}</h3>
                <button
                  type="button"
                  onClick={() => removeMilestone(milestoneIndex)}
                  className="text-red-500 text-sm"
                >
                  ❌ Remove Milestone
                </button>
              </div>

              {/* Add Module to this Milestone */}
              <div className="mb-3 p-3 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Add Module to this Milestone</h4>
                <div className="grid gap-2 mb-2">
                  <input
                    type="text"
                    name="title"
                    value={currentModule.title}
                    onChange={handleModuleChange}
                    placeholder="Module Title"
                    className="border rounded p-2"
                  />
                  <input
                    type="text"
                    name="video"
                    value={currentModule.video}
                    onChange={handleModuleChange}
                    placeholder="Video URL"
                    className="border rounded p-2"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addModuleToMilestone(milestoneIndex)}
                  className="bg-green-600 text-white px-4 py-1 rounded"
                >
                  Add Module
                </button>
              </div>

              {/* Existing Modules */}
              <div>
                <h4 className="font-medium mb-2">Modules:</h4>
                {milestone.modules.length > 0 ? (
                  <ul className="space-y-2">
                    {milestone.modules.map((module, moduleIndex) => (
                      <li key={moduleIndex} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <strong>{module.title}</strong>
                          <br />
                          <a href={module.video} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm">
                            {module.video}
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeModuleFromMilestone(milestoneIndex, moduleIndex)}
                          className="text-red-500 text-sm"
                        >
                          ❌
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No modules added yet.</p>
                )}
              </div>
            </div>
          ))}
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
          <button type="button" onClick={addResource} className="bg-green-600 text-white px-4 py-2 rounded">
            Add Resource
          </button>
          <ul className="mt-2 list-disc pl-6">
            {resources.map((r, i) => (
              <li key={i} className="flex justify-between">
                <span>
                  <strong>{r.name}</strong>:{" "}
                  <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {r.url}
                  </a>
                </span>
                <button type="button" onClick={() => removeResource(i)} className="text-red-500 text-sm">
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={imageUploading} // disable while uploading
          className={`w-full py-2 rounded-lg transition 
    ${imageUploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {imageUploading ? "Uploading Image..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}