"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import cornerstone from "cornerstone-core";
import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader";
import dicomParser from "dicom-parser";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const DicomViewer = ({ url }) => {
  const elementRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [totalFrames, setTotalFrames] = useState(1);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [fileId, setFileId] = useState(null);

  useEffect(() => {
    if (!url) return;

    cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
    cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
    cornerstoneWADOImageLoader.configure({ useWebWorkers: true });

    cornerstone.enable(elementRef.current);

    // Axios ilə yükləmə
    axios
      .get(url, {
        responseType: "blob",
        onDownloadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          }
        },
      })
      .then((res) => {
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(res.data);
        setFileId(imageId);
        loadImage(imageId, 0);
      })
      .catch((err) => {
        console.error("Fayl yüklənərkən xəta:", err);
        setError(true);
        setLoading(false);
      });

    return () => {
      if (elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, [url]);

  const loadImage = (imageId, frame) => {
    const finalId = frame ? `${imageId}?frame=${frame}` : imageId;

    cornerstone
      .loadAndCacheImage(finalId)
      .then((image) => {
        const frames = image.data.string("x00280008");
        if (frames) {
          setTotalFrames(parseInt(frames));
        }
        cornerstone.displayImage(elementRef.current, image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Görüntü yüklənərkən xəta:", err);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!fileId) return;
    loadImage(fileId, currentFrame);
  }, [currentFrame]);

  useEffect(() => {
    const handleScroll = (e) => {
      e.preventDefault();
      if (loading) return;

      if (e.deltaY > 0) {
        setCurrentFrame((prev) => Math.min(prev + 1, totalFrames - 1));
      } else {
        setCurrentFrame((prev) => Math.max(prev - 1, 0));
      }
    };

    const handleKeydown = (e) => {
      if (loading) return;

      if (e.key === "ArrowRight") {
        setCurrentFrame((prev) => Math.min(prev + 1, totalFrames - 1));
      } else if (e.key === "ArrowLeft") {
        setCurrentFrame((prev) => Math.max(prev - 1, 0));
      }
    };

    const element = elementRef.current;
    if (element) {
      element.addEventListener("wheel", handleScroll);
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      if (element) {
        element.removeEventListener("wheel", handleScroll);
      }
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [loading, totalFrames]);

  if (error) {
    return <h1>Fayl yüklənə bilmədi, səhifəni yeniləyin.</h1>;
  }

  return (
    <div className="relative">
      {loading ? (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <div className="mt-4 w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-white text-sm">{progress}%</div>
        </div>
      ) : (
        <div className="absolute right-0 bottom-0 z-10 text-white text-[48px]">
          {currentFrame + 1}/{totalFrames}
        </div>
      )}

      <div ref={elementRef} className="w-full h-[600px] bg-black" />
    </div>
  );
};

export default DicomViewer;
