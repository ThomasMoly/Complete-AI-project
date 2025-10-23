"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import uploadimg from "@/public/uploadimg.png";
import Image from "next/image";

const Page = () => {
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      router.push("./dashboard");
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setFileName(null);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 text-lg">
            Get instant AI-powered feedback to improve your resume
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200 mb-6">
          <form>
            <input
              type="file"
              className="hidden"
              ref={fileInputReference}
              accept=".pdf,.doc,.docx"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const file = e.target.files?.[0];
                handleUpload(file);
              }}
            />
          </form>

          <div
            className={`border-3 border-dashed border-gray-300 rounded-xl p-12 text-center transition-all duration-200 ${
              isUploading ? "bg-blue-50" : "hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
            }`}
            onClick={() => !isUploading && fileInputReference.current?.click()}
          >
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-700 font-semibold text-lg">Analyzing your resume...</p>
                {fileName && (
                  <p className="text-gray-500 text-sm mt-2">{fileName}</p>
                )}
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-4">
                  <Image
                    src={uploadimg}
                    alt="upload"
                    width={120}
                    className="opacity-80"
                  />
                </div>
                <p className="text-gray-700 font-semibold text-lg mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-gray-500 text-sm">
                  Supported formats: PDF, DOC, DOCX
                </p>
              </>
            )}
          </div>

          {!isUploading && (
            <div className="mt-6">
              <button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg"
                onClick={() => fileInputReference.current?.click()}
              >
                Choose File
              </button>
            </div>
          )}
        </div>

        {/* Return Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 inline-flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10 19l-7-7m0 0l7-7m-7 7h18" 
              />
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;