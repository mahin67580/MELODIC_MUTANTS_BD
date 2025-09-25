"use client";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// Helper: convert Google Drive link to embeddable preview link
function getEmbedUrl(url) {
  if (!url) return "";
  const driveMatch = url.match(/\/d\/(.*?)(\/|$)/);
  if (driveMatch) {
    const fileId = driveMatch[1];
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  return url;
}

export default function VideoPlayer({ pasCourses, modules }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openMilestone, setOpenMilestone] = useState("0");

  const currentVideo = getEmbedUrl(modules[currentIndex]?.video);
  const currentModule = modules[currentIndex];

  // Precompute a mapping from milestone modules to global module index
  const moduleIndexMap = useMemo(() => {
    const map = new Map();
    modules.forEach((mod, idx) => {
      map.set(`${mod.title}||${mod.video}`, idx);
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
        return mIndex.toString();
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

  const playNext = () => {
    if (currentIndex < modules.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Video Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Now Playing</h3>
            <p className="text-blue-800 text-sm mt-1">{currentModule?.title || "No title"}</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {currentIndex + 1} of {modules.length}
          </Badge>
        </div>
      </div>

      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-w-19 aspect-h-9">
            <iframe
              key={currentVideo}
              src={currentVideo}
              title={currentModule?.title || "Course Video"}
              className="w-full h-64 border-2 sm:h-80 lg:h-96 rounded-t-lg"
              frameBorder="0"
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button
          onClick={playPrev}
          disabled={currentIndex === 0}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="text-sm text-gray-600">
          Module {currentIndex + 1} of {modules.length}
        </div>
        
        <Button
          onClick={playNext}
          disabled={currentIndex === modules.length - 1}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Course Content Accordion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course Content</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" value={openMilestone} onValueChange={setOpenMilestone} className="space-y-2">
            {pasCourses?.map((milestone, mIndex) => {
              const milestoneIndex = mIndex.toString();
              const isActive = milestoneIndex === activeMilestoneIndex;

              return (
                <AccordionItem
                  key={mIndex}
                  value={milestoneIndex}
                  className={`border rounded-lg ${
                    isActive ? "border-blue-300 bg-blue-50" : "border-gray-200"
                  }`}
                >
                  <AccordionTrigger className={`px-4 hover:no-underline ${
                    isActive ? "bg-blue-100 rounded-t-lg" : ""
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isActive ? "bg-blue-600" : "bg-gray-400"
                      }`}></div>
                      <span className={`font-medium ${
                        isActive ? "text-blue-900" : "text-gray-900"
                      }`}>
                        {milestone.title}
                      </span>
                      <Badge variant="secondary" className="ml-2">
                        {milestone.modules?.length || 0} modules
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-0">
                    <div className="space-y-2 py-2">
                      {milestone.modules?.map((mod, i) => {
                        const globalIndex = moduleIndexMap.get(`${mod.title}||${mod.video}`) ?? 0;
                        const isCurrent = globalIndex === currentIndex;

                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              isCurrent
                                ? "bg-blue-100 border border-blue-200"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                isCurrent ? "bg-blue-600" : "bg-gray-300"
                              }`}></div>
                              <span className={`text-sm ${
                                isCurrent ? "text-blue-900 font-medium" : "text-gray-700"
                              }`}>
                                {mod.title}
                              </span>
                            </div>
                            <Button
                              onClick={() => setCurrentIndex(globalIndex)}
                              variant={isCurrent ? "default" : "outline"}
                              size="sm"
                              className="flex items-center gap-2 h-8"
                            >
                              <Play className="h-3 w-3" />
                              {isCurrent ? "Playing" : "Play"}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}