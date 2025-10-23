import Link from "next/link";

export default function Home() {
   return (
    <div className="min-h-screen bg-linear-to-br from-blue-200 to-white flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to ResumeRater
        </h1>
        <p className="text-2xl md:text-3xl text-gray-700">
          Your personalized AI resume assistant
        </p>
      </div>
      
      <Link
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xl px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        href ='./pages/upload' 
      >
        Get Started
      </Link>
      </div>

  );
}
