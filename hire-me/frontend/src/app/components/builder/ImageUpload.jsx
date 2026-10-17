"use client";

import { useEffect, useRef, useState } from "react";
import { icons } from "../../../../assets/iconCollection";
import Image from "next/image";

// Reuse the detector instead of loading the model for every image.
let faceDetectorPromise = null;

async function getFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      const { FilesetResolver, FaceDetector } = await import(
        "@mediapipe/tasks-vision"
      );

      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.0/wasm",
      );

      return FaceDetector.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
        },
        runningMode: "IMAGE",
        minDetectionConfidence: 0.5,
      });
    })();
  }

  try {
    return await faceDetectorPromise;
  } catch (error) {
    faceDetectorPromise = null;
    throw error;
  }
}

// Detect the largest face and return its normalized center coordinates.
async function detectFaceCenter(imageUrl) {
  const image = new window.Image();
  image.src = imageUrl;

  await image.decode();

  const detector = await getFaceDetector();
  const result = detector.detect(image);
  const detections = result.detections ?? [];

  if (!detections.length) return null;

  const largestFace = detections.reduce((largest, current) => {
    const a = largest.boundingBox;
    const b = current.boundingBox;

    return b.width * b.height > a.width * a.height
      ? current
      : largest;
  });

  const { originX, originY, width, height } = largestFace.boundingBox;

  return {
    x: (originX + width / 2) / image.naturalWidth,
    y: (originY + height / 2) / image.naturalHeight,
  };
}

const STATE_STYLES = {
  default: "bg-[#6E6E73]/5 border-[#6E6E73]/10",
  hover: "bg-green-500/10 border-green-500/20",
  loading: "bg-[#6E6E73]/5 border-[#6E6E73]/10",
  uploaded: "border-transparent bg-transparent",
};

export default function ImageUpload({
  state,
  value = null,
  onUpload,
  maxSizeMB = 5,
  className = "",
}) {
  const inputRef = useRef(null);
  const blobRef = useRef(null);
  const boxRef = useRef(null);

  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [error, setError] = useState("");

  const [faceCenter, setFaceCenter] = useState(null);
  const [imageSize, setImageSize] = useState(null);
  const [boxSize, setBoxSize] = useState({
    width: 0,
    height: 0,
  });

  // Track the responsive preview dimensions.
  useEffect(() => {
    const box = boxRef.current;

    if (!box || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;

      setBoxSize({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(box);

    return () => observer.disconnect();
  }, []);

  // Synchronize an externally supplied image URL.
  useEffect(() => {
    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
      blobRef.current = null;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreview(value);
    setFaceCenter(null);
    setImageSize(null);
  }, [value]);

  // Clean up local preview URLs when unmounting.
  useEffect(() => {
    return () => {
      if (blobRef.current) {
        URL.revokeObjectURL(blobRef.current);
      }
    };
  }, []);

  const current = loading
    ? "loading"
    : (state ?? (preview ? "uploaded" : hover ? "hover" : "default"));

  // Calculate object-position so the detected face moves to the center.
  const objectPosition = (() => {
    if (
      !faceCenter ||
      !imageSize?.width ||
      !imageSize?.height ||
      !boxSize.width ||
      !boxSize.height
    ) {
      return "50% 50%";
    }

    const scale = Math.max(
      boxSize.width / imageSize.width,
      boxSize.height / imageSize.height,
    );

    const renderedWidth = imageSize.width * scale;
    const renderedHeight = imageSize.height * scale;

    const horizontalSpace = boxSize.width - renderedWidth;
    const verticalSpace = boxSize.height - renderedHeight;

    const clamp = (value) => Math.max(0, Math.min(1, value));

    const x =
      Math.abs(horizontalSpace) < 0.5
        ? 0.5
        : clamp(
            (boxSize.width / 2 - faceCenter.x * renderedWidth) /
              horizontalSpace,
          );

    const y =
      Math.abs(verticalSpace) < 0.5
        ? 0.5
        : clamp(
            (boxSize.height / 2 - faceCenter.y * renderedHeight) /
              verticalSpace,
          );

    return `${x * 100}% ${y * 100}%`;
  })();

  async function handleFile(file) {
    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png"].includes(file.type)) {
      setError("Please upload a JPG or PNG image.");
      return;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Image size must be ${maxSizeMB}MB or less.`);
      return;
    }

    setLoading(true);
    setFaceCenter(null);
    setImageSize(null);

    const localUrl = URL.createObjectURL(file);

    if (blobRef.current) {
      URL.revokeObjectURL(blobRef.current);
    }

    blobRef.current = localUrl;
    setPreview(localUrl);

    try {
      // Face detection failure should not prevent uploading the image.
      try {
        const detectedCenter = await detectFaceCenter(localUrl);
        setFaceCenter(detectedCenter);
      } catch (detectionError) {
        console.warn(
          "Face detection unavailable; using the default center crop.",
          detectionError,
        );
      }

      const uploadedUrl = await onUpload?.(file);

      if (uploadedUrl) {
        URL.revokeObjectURL(localUrl);

        if (blobRef.current === localUrl) {
          blobRef.current = null;
        }

        setPreview(uploadedUrl);
      }
    } catch {
      setError("Upload failed. The photo preview is shown, but it wasn't saved.");
    } finally {
      setLoading(false);
    }
  }

  const openPicker = () => {
    if (current !== "loading") {
      inputRef.current?.click();
    }
  };

  return (
    <div className="w-full max-w-[clamp(17.5rem,calc(3.756vw_+_16.62rem),20rem)]">
      <div
        ref={boxRef}
        role="button"
        tabIndex={0}
        aria-label="Upload or replace profile photo"
        aria-busy={current === "loading"}
        onClick={openPicker}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openPicker();
          }
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setHover(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        className={[
          "group relative flex w-full shrink-0",
          "h-[clamp(8.875rem,calc(3.568vw+8.039rem),11.25rem)]",
          "cursor-pointer select-none items-center justify-center",
          "overflow-hidden rounded-md border font-primary",
          "transition-colors duration-150",
          "hover:bg-green-500/10 hover:border-green-500/20",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          "focus-visible:outline-green-500",
          STATE_STYLES[current],
          current === "loading" ? "cursor-wait" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg"
          aria-label="Choose a profile photo"
          className="hidden"
          onChange={(e) => {
            void handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />

        {(current === "default" || current === "hover") && (
          <div className="flex flex-col items-center gap-1 px-4 text-center text-[#6E6E73]">
            <i
              className={`${icons.imageUpload} mb-2 text-[44px] opacity-30`}
              aria-hidden="true"
            />

            <p className="font-primary text-small font-semibold opacity-60">
              Upload your photo
            </p>

            <p className="text-[12px] opacity-60">
              JPG, PNG · Max {maxSizeMB}MB
            </p>
          </div>
        )}

        {current === "loading" && (
          <div className="flex flex-col items-center gap-2 text-[#6E6E73]">
            <i
              className={`${icons.imageUpload} animate-pulse text-[40px]`}
              aria-hidden="true"
            />
            <p className="text-sm">Preparing photo...</p>
          </div>
        )}

        {current === "uploaded" && preview && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Image
              src={preview}
              alt="Uploaded profile photo"
              draggable={false}
              width={e.currentTarget.naturalWidth}
              height={e.currentTarget.naturalHeight}
              onLoad={(e) => {
                setImageSize({
                  width: e.currentTarget.naturalWidth,
                  height: e.currentTarget.naturalHeight,
                });
              }}
              style={{ objectPosition }}
              className="absolute inset-0 h-full w-full object-cover"
            />

            <span className="absolute inset-0 flex items-center justify-center bg-black/40 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Replace photo
            </span>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}