"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Play, CheckCircle } from "lucide-react";
import CertificateDownload from "@/components/CertificateDownload";
 

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

export default function VideoPlayer({ pasCourses, modules, userId, courseId, initialProgress, courseData }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openMilestone, setOpenMilestone] = useState("0");
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const currentVideo = getEmbedUrl(modules[currentIndex]?.video);
  const currentModule = modules[currentIndex];

  // Initialize progress from props
  useEffect(() => {
    if (initialProgress) {
      console.log('Initial progress received:', initialProgress);
      setWatchedVideos(new Set(initialProgress.watchedVideos || []));
      setProgress(initialProgress.progress || 0);

      // Set current index to last watched module if available
      if (initialProgress.lastWatchedModule !== undefined && initialProgress.lastWatchedModule !== null) {
        setCurrentIndex(initialProgress.lastWatchedModule);
      }
    }
  }, [initialProgress]);

  // Calculate progress percentage - ensure it's exactly 100 when all videos are watched
  const calculateProgress = useMemo(() => {
    if (modules.length === 0) return 0;
    
    const progressValue = Math.round((watchedVideos.size / modules.length) * 100);
    
    // Ensure it's exactly 100 when all modules are watched
    if (watchedVideos.size === modules.length) {
      return 100;
    }
    
    return progressValue;
  }, [watchedVideos, modules.length]);

  // Update progress state when calculateProgress changes
  useEffect(() => {
    setProgress(calculateProgress);
  }, [calculateProgress]);

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

  // Load progress from database on component mount (fallback)
  useEffect(() => {
    const loadProgress = async () => {
      if (!userId || !courseId) return;

      try {
        const response = await fetch(`/api/progress?userId=${encodeURIComponent(userId)}&courseId=${encodeURIComponent(courseId)}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Progress loaded from API:', data);
          if (data.progress !== undefined && data.watchedVideos) {
            setWatchedVideos(new Set(data.watchedVideos));
            setProgress(data.progress);

            // Set current index to last watched module if available
            if (data.lastWatchedModule !== undefined && data.lastWatchedModule !== null) {
              setCurrentIndex(data.lastWatchedModule);
            }
          }
        } else {
          console.error('Failed to load progress:', response.status);
        }
      } catch (error) {
        console.error("Failed to load progress:", error);
      }
    };

    // Only load if no initialProgress was provided
    if (!initialProgress) {
      loadProgress();
    }
  }, [userId, courseId, initialProgress]);

  // Auto-open active milestone whenever currentIndex changes
  useEffect(() => {
    if (activeMilestoneIndex !== null) {
      setOpenMilestone(activeMilestoneIndex);
    }
  }, [activeMilestoneIndex]);

  // Save progress function with better error handling
  const saveProgress = useCallback(async () => {
    if (!userId || !courseId || isSaving) return;

    setIsSaving(true);
    setSaveError('');
    
    try {
      const progressData = {
        userId: userId.toString(),
        courseId: courseId.toString(),
        watchedVideos: Array.from(watchedVideos),
        progress: calculateProgress, // Use the calculated progress
        lastWatchedModule: currentIndex
      };

      console.log('Saving progress to server:', progressData);

      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      console.log('Progress saved successfully:', result);
    } catch (error) {
      console.error("Failed to save progress:", error);
      setSaveError(error.message);
    } finally {
      setIsSaving(false);
    }
  }, [watchedVideos, calculateProgress, userId, courseId, currentIndex, isSaving]);

  // Save progress when watched videos or progress changes
  useEffect(() => {
    // Don't save on initial load
    if (watchedVideos.size === 0 && progress === 0) return;

    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [watchedVideos, calculateProgress, currentIndex, saveProgress]);

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

  // Mark video as watched
  const markAsWatched = (moduleIndex) => {
    setWatchedVideos(prev => {
      const newSet = new Set(prev);
      newSet.add(moduleIndex);
      
      // Log when course is completed
      if (newSet.size === modules.length) {
        console.log('🎉 Course completed! All modules watched');
      }
      
      return newSet;
    });
  };

  // Mark current video as watched when navigating away or component unmounts
  useEffect(() => {
    return () => {
      if (currentIndex !== null && currentIndex !== undefined) {
        markAsWatched(currentIndex);
      }
    };
  }, [currentIndex]);

  // Auto-mark video as watched after 30 seconds of being on the current module
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex !== null && currentIndex !== undefined && !watchedVideos.has(currentIndex)) {
        console.log('Auto-marking video as watched:', currentIndex);
        markAsWatched(currentIndex);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [currentIndex, watchedVideos]);

  // Handle manual mark as watched for current video
  const handleMarkAsWatched = () => {
    console.log('Manually marking video as watched:', currentIndex);
    markAsWatched(currentIndex);
  };

  // Debug: Log when progress reaches 100%
  useEffect(() => {
    if (calculateProgress === 100) {
      console.log('✅ Client-side progress reached 100%');
      console.log('Watched videos:', Array.from(watchedVideos));
      console.log('Total modules:', modules.length);
    }
  }, [calculateProgress, watchedVideos, modules.length]);


  return (
    <div className="space-y-6">
      {/* Certificate Download - Shows when course is completed */}
      <CertificateDownload
        courseId={courseId} 
        progress={calculateProgress} 
        courseData={courseData}
        userId={userId}
      />

      {/* Save Error Display */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <span className="text-sm">Failed to save progress: {saveError}</span>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex justify-between items-center">
            <span>Course Progress</span>
            <span className="text-sm font-normal text-gray-600">
              {calculateProgress}% Complete  
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={calculateProgress} className="w-full h-3" />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{watchedVideos.size} of {modules.length} videos watched</span>
            {calculateProgress === 100 && (
              <span className="text-green-600 font-semibold">🎉 Course Completed!</span>
            )}
          </div>
        </CardContent>
      </Card>






      {/* Current Video Info */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900">Now Playing</h3>
            <p className="text-blue-800 text-sm mt-1">{currentModule?.title || "No title"}</p>
          </div>
          <div className="flex items-center gap-2">
            {watchedVideos.has(currentIndex) && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Watched
              </Badge>
            )}
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {currentIndex + 1} of {modules.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <Card>
        <CardContent className="p-0">
          <div className="aspect-w-16 aspect-h-9">
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

        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Module {currentIndex + 1} of {modules.length}
          </div>
          {!watchedVideos.has(currentIndex) && (
            <Button
              onClick={handleMarkAsWatched}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Watched
            </Button>
          )}
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
      <Card className={' border-0 '}>
        <CardHeader>
          <CardTitle className="text-lg   ">Course Content</CardTitle>
        </CardHeader>
        <CardContent className={'lg:p-2  p-0 '}>
          <Accordion type="single" value={openMilestone} onValueChange={setOpenMilestone} className="space-y-2">
            {pasCourses?.map((milestone, mIndex) => {
              const milestoneIndex = mIndex.toString();
              const isActive = milestoneIndex === activeMilestoneIndex;

              // Calculate milestone progress
              const milestoneModules = milestone.modules || [];
              const milestoneWatchedCount = milestoneModules.filter((mod, i) => {
                const globalIndex = moduleIndexMap.get(`${mod.title}||${mod.video}`);
                return globalIndex !== undefined && watchedVideos.has(globalIndex);
              }).length;

              const milestoneProgress = milestoneModules.length > 0
                ? Math.round((milestoneWatchedCount / milestoneModules.length) * 100)
                : 0;

              return (
                <AccordionItem
                  key={mIndex}
                  value={milestoneIndex}
                  className={`border rounded-lg ${isActive ? "border-blue-300 bg-blue-50" : "border-gray-200"
                    }`}
                >
                  <AccordionTrigger className={`lg:px-4 hover:no-underline ${isActive ? "bg-blue-100 rounded-t-lg" : ""
                    }`}>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${isActive ? "bg-blue-600" : "bg-gray-400"
                          }`}></div>
                        <span className={`font-medium ${isActive ? "text-blue-900" : "text-gray-900"
                          }`}>
                          {milestone.title}
                        </span>
                        <Badge variant="secondary" className="ml-2">
                          {milestone.modules?.length || 0} modules
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{milestoneProgress}%</span>
                        <Progress value={milestoneProgress} className="w-20 h-2" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="lg:px-4 pb-0">
                    <div className="space-y-2 py-2">
                      {milestone.modules?.map((mod, i) => {
                        const globalIndex = moduleIndexMap.get(`${mod.title}||${mod.video}`) ?? 0;
                        const isCurrent = globalIndex === currentIndex;
                        const isWatched = watchedVideos.has(globalIndex);

                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isCurrent
                                ? "bg-blue-100 border border-blue-200"
                                : isWatched
                                  ? "bg-green-50 border border-green-200"
                                  : "hover:bg-gray-50"
                              }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${isCurrent ? "bg-blue-600" : isWatched ? "bg-green-500" : "bg-gray-300"
                                }`}></div>
                              <span className={`text-sm ${isCurrent ? "text-blue-900 font-medium" :
                                  isWatched ? "text-green-900" : "text-gray-700"
                                }`}>
                                {mod.title}
                              </span>
                              {isWatched && (
                                <CheckCircle className="h-4 w-4 text-green-500 pr-1" />
                              )}
                            </div>
                            <Button
                              onClick={() => setCurrentIndex(globalIndex)}
                              variant={isCurrent ? "default" : "outline"}
                              size="sm"
                              className="flex items-center gap-1 lg:gap-2 h-8  "
                            >
                              <Play className="h-3 w-3 " />
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