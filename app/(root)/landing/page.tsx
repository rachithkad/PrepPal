"use client";

import { motion } from "framer-motion";
import { FiCheck, FiAward, FiBarChart2, FiUser, FiFileText, FiMic, FiStar } from "react-icons/fi";
import { useState } from "react";
import Head from "next/head";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const scaleUp = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5, ease: "backOut" }
  }
};

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("resume");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
  };

  return (
    <>
      <Head>
        <title>InterviewIQ | AI-Powered Mock Interviews & Resume Review</title>
        <meta name="description" content="Practice with AI interviews, get your resume ATS score, and land your dream job with InterviewIQ" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="text-center"
          >
            <motion.div variants={fadeIn} className="mb-6">
              <span className="inline-block bg-blue-900/30 text-blue-400 px-4 py-1 rounded-full text-sm font-medium border border-blue-800/50">
                AI-Powered Career Prep
              </span>
            </motion.div>
            <motion.h1 variants={fadeIn} className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                Ace Your Next Interview
              </span>
              <br />
              Land Your Dream Job
            </motion.h1>
            <motion.p variants={fadeIn} className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Practice with AI interviews, optimize your resume with ATS scoring, and get personalized feedback to stand out from the competition.
            </motion.p>
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#try-now"
                className="px-8 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full font-medium hover:shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Get Started Free
              </a>
              <a
                href="#features"
                className="px-8 py-3 bg-gray-700/50 border border-gray-600 rounded-full font-medium hover:bg-gray-700 transition-all"
              >
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Supercharge Your Job Search
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered tools give you the competitive edge you need in today's job market.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-blue-100/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FiFileText className="text-blue-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Resume ATS Score</h3>
              <p className="text-gray-600 mb-4">
                Get instant feedback on how well your resume matches job descriptions and passes through Applicant Tracking Systems.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Keyword optimization
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Formatting analysis
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Actionable improvements
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -100px 0px" }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-purple-100/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FiMic className="text-purple-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Mock Interviews</h3>
              <p className="text-gray-600 mb-4">
                Practice with realistic AI interviews tailored to your target job role and industry.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Role-specific questions
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Real-time feedback
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Performance analytics
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={scaleUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "0px 0px -200px 0px" }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-amber-100/50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <FiStar className="text-amber-500 text-xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Coaching</h3>
              <p className="text-gray-600 mb-4">
                Get tailored recommendations to improve your interview skills and resume based on your performance.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Strengths analysis
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Weakness identification
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <FiCheck className="text-emerald-500" /> Improvement roadmap
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-300 max-w-2xl mx-auto">
              Get interview-ready in just a few simple steps
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <FiUser className="text-2xl" />,
                title: "Create Profile",
                desc: "Tell us about your target role and experience level"
              },
              {
                icon: <FiFileText className="text-2xl" />,
                title: "Upload Resume",
                desc: "Get instant ATS scoring and optimization tips"
              },
              {
                icon: <FiMic className="text-2xl" />,
                title: "Practice Interview",
                desc: "Conduct realistic mock interviews with our AI"
              },
              {
                icon: <FiAward className="text-2xl" />,
                title: "Get Hired",
                desc: "Apply with confidence and land your dream job"
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center"
              >
                <div className="bg-gradient-to-br from-blue-500 to-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-300">{step.desc}</p>
                <div className="mt-4 text-blue-400 font-bold">{i + 1}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="try-now" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold mb-4">Try InterviewIQ Now</h2>
                <p className="text-gray-600 mb-6">
                  Get started with a free resume review and sample mock interview. No credit card required.
                </p>
                
                <div className="flex gap-2 mb-6 bg-gray-100 rounded-full p-1">
                  <button
                    onClick={() => setActiveTab("resume")}
                    className={`flex-1 py-2 px-4 rounded-full transition-all ${activeTab === "resume" ? "bg-white shadow-sm" : ""}`}
                  >
                    Resume Review
                  </button>
                  <button
                    onClick={() => setActiveTab("interview")}
                    className={`flex-1 py-2 px-4 rounded-full transition-all ${activeTab === "interview" ? "bg-white shadow-sm" : ""}`}
                  >
                    Mock Interview
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-md transition-all"
                  >
                    {activeTab === "resume" ? "Get Free Resume Score" : "Start Free Mock Interview"}
                  </button>
                </form>
              </div>
              
              <div className="md:w-1/2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                {activeTab === "resume" ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FiBarChart2 className="text-blue-500 text-xl" />
                      <h3 className="text-xl font-bold">Resume Review Demo</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">ATS Score</span>
                          <span className="font-bold text-blue-600">82%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Matched Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {['React', 'TypeScript', 'Agile', 'Node.js'].map((kw, i) => (
                            <span key={i} className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Suggestions</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <FiCheck className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Add more quantifiable achievements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <FiCheck className="text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>Include 'Redux' as a missing keyword</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <FiMic className="text-purple-500 text-xl" />
                      <h3 className="text-xl font-bold">Mock Interview Demo</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium mb-2">Sample Question:</div>
                        <p className="italic">"Can you describe a time when you faced a technical challenge and how you overcame it?"</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="font-medium mb-2">Feedback Preview:</div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <FiStar className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Good use of the STAR method in your response</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <FiStar className="text-amber-500 mt-0.5 flex-shrink-0" />
                            <span>Consider being more specific about the technologies used</span>
                          </li>
                        </ul>
                      </div>
                      <div className="text-center text-sm text-gray-500">
                        Actual interview includes voice interaction and detailed analytics
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-4">
              Success Stories
            </motion.h2>
            <motion.p variants={fadeIn} className="text-lg text-gray-600 max-w-2xl mx-auto">
              Join thousands of job seekers who landed their dream roles with InterviewIQ
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "The mock interviews were so realistic! I felt completely prepared for my actual interviews and got multiple offers.",
                name: "Sarah K.",
                role: "Software Engineer at Google"
              },
              {
                quote: "My resume score helped me identify exactly what was missing. After implementing the suggestions, I started getting 3x more callbacks.",
                name: "Michael T.",
                role: "Product Manager at Amazon"
              },
              {
                quote: "The AI feedback was incredibly detailed and helped me improve my communication skills dramatically.",
                name: "Jessica L.",
                role: "Data Scientist at Microsoft"
              }
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                variants={scaleUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-lg"
              >
                <div className="text-amber-400 mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="font-bold">{testimonial.name}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Job Search?
            </motion.h2>
            <motion.p variants={fadeIn} className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are acing their interviews and landing dream jobs with InterviewIQ.
            </motion.p>
            <motion.div variants={fadeIn}>
              <a
                href="#try-now"
                className="inline-block px-8 py-3 bg-white text-blue-600 rounded-full font-bold hover:bg-gray-100 hover:shadow-lg transition-all"
              >
                Get Started Free
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">InterviewIQ</h3>
              <p className="mb-4">AI-powered interview preparation and resume optimization for the modern job seeker.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Tips</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-sm text-center">
            © {new Date().getFullYear()} InterviewIQ. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}