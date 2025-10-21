import Link from "next/link";

export default async function DashboardPage() {
  const res = await fetch("http://localhost:8000/results/", {
    cache: "no-store",
  }); 

  const data = await res.json();

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Resume Feedback
          </h1>
          <p className="text-gray-600">
            AI-powered analysis and recommendations for your resume
          </p>
        </div>

        {/* Feedback Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <svg 
                className="w-6 h-6 text-blue-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Analysis Complete
            </h2>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.text}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg">
            Download Report
          </button>
          <Link href="./upload"
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md border border-gray-300 transition-all duration-200 hover:shadow-lg"
          >
            Analyze Another Resume
          </Link>
        </div>
      </div>
    </div>
  );
}