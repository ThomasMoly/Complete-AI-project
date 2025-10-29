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
  const [jobPosting, setJobPosting] = useState("");
  const [resumeFile, setResumeFile] = useState<File | undefined>(undefined);


  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    setIsUploading(true); // ✅ Start loader

    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_posting", jobPosting);


    try {
      const response = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setIsUploading(false);
      router.push("./dashboard");
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsUploading(false);
      setFileName(null);
    }
  };




  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 text-lg">
            Get instant AI-powered feedback to improve your resume
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Resume Upload Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              1. Upload Resume
            </h2>
            <form>
              <input
                type="file"
                className="hidden"
                ref={fileInputReference}
                accept=".pdf,.doc,.docx"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  setResumeFile(file);
                }}
              />
            </form>

            <div
              className={`border-3 border-dashed border-gray-300 rounded-xl p-8 text-center transition-all duration-200 ${
                isUploading
                  ? "bg-blue-50"
                  : "hover:border-blue-400 hover:bg-blue-50 cursor-pointer"
              }`}
              onClick={() =>
                !isUploading && fileInputReference.current?.click()
              }
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-700 font-semibold">
                    Analyzing...
                  </p>
                  {fileName && (
                    <p className="text-gray-500 text-sm mt-2">{fileName}</p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-3">
                    <Image
                      src={uploadimg}
                      alt="upload"
                      width={80}
                      className="opacity-80"
                    />
                  </div>
                  <p className="text-gray-700 font-semibold mb-1">
                    Click to upload
                  </p>
                  <p className="text-gray-500 text-xs">PDF, DOC, DOCX</p>
                </>
              )}
            </div>

            {!isUploading && (
              <button
                type="button"
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200"
                onClick={() => fileInputReference.current?.click()}
              >
                Choose Resume
              </button>
            )}
          </div>

          {/* Job Posting Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              2. Job Posting (Optional)
            </h2>
            
            <div className="space-y-4">
              {/* Text Area Option */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste job description
                </label>
                <textarea
                  value={jobPosting}
                  onChange={(e) => {
                    setJobPosting(e.target.value);
                    // Clear file if text is entered
                    
                  }}
                  placeholder="Paste the job posting here to get tailored feedback..."
                  className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800"
                />
              </div>             

              {/* File Upload Option */}
              

              <p className="text-xs text-gray-500 mt-2">
                Adding a job posting helps tailor the feedback to specific requirements
              </p>
            </div>
          </div>
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
        <div className="text-center">
          <button
            onClick={() => handleUpload(resumeFile)}
            className="text-gray-600 hover:text-gray-800 font-semibold transition-colors duration-200 inline-flex items-center gap-2"
          >
            Continue
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="bevel"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;