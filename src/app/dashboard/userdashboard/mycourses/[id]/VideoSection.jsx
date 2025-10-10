"use client";

import dynamic from "next/dynamic";

const VideoPlayer = dynamic(() => import("../component/VideoPlayer"), {
  ssr: false,
  loading: () => <div className="text-center p-6 text-gray-500">Loading video player...</div>,
});

export default function VideoSection(props) {
  return <VideoPlayer {...props} />;
}
