import { authOptions } from "@/app/auth";
import SideNav from "@/componenets/SideNav";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

   if (!session?.user?.email) {
    throw new Error("No user session found");
  }

  const res = await prisma.user.findUnique({
    where: {email: session.user.email}
  })

  if (!res) {
    throw new Error("User not found");
  }

  const { recommendations, score } = res;

  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-300";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-300";
    if (score == 0) return "bg-gray-400 text-white text-bold"
    return "bg-red-100 text-red-700 border-red-300";
  };

  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-50 to-white">
      <SideNav></SideNav>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section with Score */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Resume Feedback
            </h1>
            <p className="text-gray-600">
              AI-powered analysis and recommendations for your resume
            </p>
          </div>
          
          {/* Match Score Badge */}
          {score !== undefined && (
            <div className={`px-6 py-3 rounded-xl border-2 ${getScoreColor(score)}`}>
              <div className="text-sm font-medium opacity-80">
                {score == 0 ? (
                  <>
                    No Job Description Found
                  </>
                ):
                (
                  <>
                    Match Score
                    <div className="text-3xl font-bold">{score}%</div>
                  </>
                )
              }
              </div>
            </div>
          )}
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
              <ul className="space-y-4">
              {recommendations.map((point: String, i: number) => (
                <li
                  key={i}
                  className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl shadow-sm bg-gray-50 hover:bg-blue-50 hover:shadow-md transition-all duration-200"
                >
                  <span className="shrink-0 w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-gray-800 leading-relaxed font-medium">{point}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          
          <Link href="./upload"
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow-md border border-gray-300 transition-all duration-200 hover:shadow-lg"
          >
            Analyze Another Resume
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}