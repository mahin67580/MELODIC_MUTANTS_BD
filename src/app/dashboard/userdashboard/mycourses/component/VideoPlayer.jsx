"use client";
import { useState, useMemo, useEffect } from "react";

// Helper: convert Google Drive link to embeddable preview link
function getEmbedUrl(url) {
  if (!url) return "";
  const driveMatch = url.match(/\/d\/(.*?)(\/|$)/); // extract FILE_ID
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url; // return original (works for YouTube, Vimeo, etc.)
}

export default function VideoPlayer({ pasCourses, modules }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openMilestone, setOpenMilestone] = useState(0); // first milestone open by default

  const currentVideo = getEmbedUrl(modules[currentIndex]?.video);

  // Precompute a mapping from milestone modules to global module index
  const moduleIndexMap = useMemo(() => {
    const map = new Map();
    modules.forEach((mod, idx) => {
      map.set(`${mod.title}||${mod.video}`, idx); // unique key
    });
    return map;
  }, [modules]);

  // Determine which milestone contains the currently playing module
  const activeMilestoneIndex = useMemo(() => {
    for (let mIndex = 0; mIndex < pasCourses.length; mIndex++) {
      const milestone = pasCourses[mIndex];
      if (
        milestone.modules.some(
          (mod) =>
            moduleIndexMap.get(`${mod.title}||${mod.video}`) === currentIndex
        )
      ) {
        return mIndex;
      }
    }
    return null;
  }, [currentIndex, pasCourses, moduleIndexMap]);

  // Auto-open active milestone whenever currentIndex changes
  useEffect(() => {
    if (activeMilestoneIndex !== null) {
      setOpenMilestone(activeMilestoneIndex);
    }
  }, [activeMilestoneIndex]);

  // Move to next video
  const playNext = () => {
    if (currentIndex < modules.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Move to previous video
  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div>
      {/* Video Player */}
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          key={currentVideo} // force reload when video changes
          src={currentVideo}
          title={modules[currentIndex]?.title || "Course Video"}
          className="w-full h-64 lg:h-96 rounded-lg"
          frameBorder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={playPrev}
          disabled={currentIndex === 0}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <button
          onClick={playNext}
          disabled={currentIndex === modules.length - 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Accordion Style Milestones */}
      <div className="space-y-4">
        {pasCourses?.map((milestone, mIndex) => {
          const isActive = mIndex === activeMilestoneIndex;

          return (
            <div
              key={mIndex}
              className={`border rounded-lg ${
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
            >
              {/* Accordion Header */}
              <button
                onClick={() =>
                  setOpenMilestone(openMilestone === mIndex ? null : mIndex)
                }
                className={`w-full flex justify-between items-center px-4 py-2 rounded-t-lg ${
                  isActive ? "font-bold text-blue-700" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span>{milestone.title}</span>
                <span>{openMilestone === mIndex ? "▲" : "▼"}</span>
              </button>

              {/* Accordion Content */}
              {openMilestone === mIndex && (
                <ul className="p-4 space-y-2 bg-white">
                  {milestone.modules?.map((mod, i) => {
                    const globalIndex =
                      moduleIndexMap.get(`${mod.title}||${mod.video}`) ?? 0;

                    return (
                      <li
                        key={i}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <span
                          className={
                            globalIndex === currentIndex ? "font-bold text-blue-700" : ""
                          }
                        >
                          {mod.title}
                        </span>
                        <button
                          onClick={() => setCurrentIndex(globalIndex)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Watch
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
