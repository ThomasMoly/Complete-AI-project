"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation"; // ✅ import this
import uploadimg from "@/public/uploadimg.png";
import Image from "next/image";
import Link from "next/link";

const Page = () => {
  const fileInputReference = useRef<HTMLInputElement | null>(null);
  const router = useRouter(); // ✅ initialize router

  const handleUpload = async (file: File | undefined) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

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

      // ✅ Navigate to dashboard after success
      router.push("./dashboard");
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col text-center justify-center h-screen text-black bg-white">
        <div className="flex justify-center">
          <div className="w-250 h-150 bg-gray-200 rounded-3xl">
            <div className="hover:cursor-pointer">
              <form>
                <input
                  type="file"
                  className="absolute right-[9999px]"
                  ref={fileInputReference}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    handleUpload(file);
                  }}
                />
              </form>
              <div
                className="flex justify-center items-center h-full"
                onClick={() => fileInputReference.current?.click()}
              >
                <Image
                  src={uploadimg}
                  alt="upload"
                  width={200}
                  className="cursor-pointer mt-40"
                />
              </div>
              <button
                type="button"
                className="text-gray-500 mt-10 hover:cursor-pointer"
                onClick={() => fileInputReference.current?.click()}
              >
                Upload your resume in .pdf .docx or .doc
              </button>
            </div>
          </div>
        </div>

        <Link
          className="m-5 p-5 bg-green-100 text-black rounded-3xl hover:bg-green-300 hover:cursor-pointer hover:-translate-y-2 duration-300 ease-in-out"
          href="/"
        >
          Return
        </Link>
      </div>
    </>
  );
};

export default Page;
