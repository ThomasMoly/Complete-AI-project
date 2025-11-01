"use client";
import { prisma } from "@/lib/db";
import { useRouter } from 'next/navigation';
import SideNav from '@/componenets/SideNav';

const Page = () => {
  const router = useRouter();
  
  // Mock data - replace with actual data from your database
  

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score === 0) return "text-gray-500 bg-gray-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusBadge = (status: string) => {
    if (status === "analyzed") {
      return (
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
          Analyzed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
        Pending
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const res = await prisma.user.findUnique({
      where: {email: session.user.email}
    })
  
    if (!res) {
      throw new Error("User not found");
    }
  
    const { email, username, recommendations, score } = res;

  return (
    <div className="flex min-h-screen bg-linear-to-br from-blue-50 to-white p-8">
      <SideNav username = {username} email = {email}></SideNav>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">My Resumes</h1>
              <p className="text-gray-600">Manage and track all your resume submissions</p>
            </div>
            <button
              onClick={() => router.push('/pages/upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload New Resume
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Total Resumes</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{resumes.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Analyzed</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {resumes.filter(r => r.status === "analyzed").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Average Score</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">
                    {Math.round(
                      resumes.filter(r => r.score > 0).reduce((acc, r) => acc + r.score, 0) /
                      resumes.filter(r => r.score > 0).length
                    )}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume List */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Table Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 font-semibold text-gray-700 text-sm">
              <div className="col-span-4">Resume Name</div>
              <div className="col-span-2">Job Title</div>
              <div className="col-span-2">Upload Date</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Score</div>
              <div className="col-span-1">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="px-6 py-4 hover:bg-blue-50 transition-colors duration-150"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Resume Name */}
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{resume.name}</p>
                      <p className="text-xs text-gray-500">PDF Document</p>
                    </div>
                  </div>

                  {/* Job Title */}
                  <div className="col-span-2">
                    <p className="text-gray-700">{resume.jobTitle}</p>
                  </div>

                  {/* Upload Date */}
                  <div className="col-span-2">
                    <p className="text-gray-600 text-sm">{formatDate(resume.uploadDate)}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {getStatusBadge(resume.status)}
                  </div>

                  {/* Score */}
                  <div className="col-span-1">
                    {resume.score > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(resume.score)}`}>
                        {resume.score}%
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => router.push(`/dashboard`)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State (show when no resumes) */}
        {resumes.length === 0 && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No resumes yet</h3>
            <p className="text-gray-600 mb-6">Upload your first resume to get started with AI-powered analysis</p>
            <button
              onClick={() => router.push('/pages/upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;