import LinkTo from "@/componenets/LinkTo";
import NavBar from "@/componenets/NavBar";
import Link from "next/link";

export default function Home() {
  const features = [
    {
      number: "01",
      title: "Resume ATS Rater",
      description: "Finds problems in your resume that can hinder you from getting past ATS and provides suggestions on improving said problems.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      color: "from-blue-500 to-blue-600"
    },
    {
      number: "02",
      title: "Personalized Resume Feedback",
      description: "Gives tips on improving wording, phrasing, and making your skills more noticeable.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: "from-purple-500 to-purple-600"
    },
    {
      number: "03",
      title: "Job Comparison",
      description: "Drop in a job description and ResumeRater will tell you exactly what you need to do in order to increase your likelihood of getting that job.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "from-green-500 to-green-600"
    }
  ];



  return (
    <>
    <NavBar/>
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">Resumater</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            Your personalized AI resume assistant
          </p>
        </div>
        
        <LinkTo/>

        {/* Features Section */}
        <div className="max-w-6xl w-full px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-4">
            How We Help You Beat ATS
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            Three powerful tools to optimize your resume and land your dream job
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:-translate-y-2"
              >
                {/* Colored Header */}
                <div className={`bg-linear-to-r ${feature.color} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-5xl font-bold opacity-30">{feature.number}</span>
                    <div className="bg-white/20 p-3 rounded-lg">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="text-center py-16 px-4">
        <div className="max-w-3xl mx-auto bg-blue-600 rounded-2xl p-10 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Optimize Your Resume?
          </h3>
          <p className="text-blue-100 text-lg mb-6">
            Get ahead of thousands of job seekers by improving your chances with ResumeRater
          </p>
          <Link
            href='./pages/upload'
            className="inline-block bg-white text-blue-600 font-semibold text-lg px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
          >
            Upload Your Resume Now
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}