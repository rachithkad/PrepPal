"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import { motion } from "framer-motion";
import mammoth from "mammoth";
import html2pdf from "html2pdf.js";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
const LOCAL_STORAGE_KEY = "mockhiato_resume_data";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    textAlign: 'center'
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  contact: {
    fontSize: 12,
    color: '#444444',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginBottom: 15
  },
  section: {
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#dddddd',
    paddingBottom: 3,
    marginBottom: 5
  },
  sectionContent: {
    fontSize: 12,
    lineHeight: 1.5
  }
});

interface resumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
}

const ResumePDF = ({ resumeData }: { resumeData: resumeData }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{resumeData.name || "Your Name"}</Text>
        <View style={styles.contact}>
          {resumeData.email && <Text>{resumeData.email}</Text>}
          {resumeData.phone && <Text>{resumeData.phone}</Text>}
        </View>
      </View>

      {resumeData.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUMMARY</Text>
          <Text style={styles.sectionContent}>{resumeData.summary}</Text>
        </View>
      )}

      {resumeData.experience && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXPERIENCE</Text>
          <Text style={styles.sectionContent}>{resumeData.experience}</Text>
        </View>
      )}

      {resumeData.education && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          <Text style={styles.sectionContent}>{resumeData.education}</Text>
        </View>
      )}

      {resumeData.skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SKILLS</Text>
          <Text style={styles.sectionContent}>{resumeData.skills}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export default function BuildResumePage() {
  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
  });

  const [modeSelected, setModeSelected] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  // Load saved data from localStorage when page loads
  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      setResumeData(JSON.parse(savedData));
      setModeSelected(true);
    }
  }, []);

  // Save to localStorage every time resumeData changes
  useEffect(() => {
    if (modeSelected) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resumeData));
    }
  }, [resumeData, modeSelected]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResumeData({ ...resumeData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoadingUpload(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });

      const sections = value.split("\n").map(line => line.trim()).filter(line => line.length > 0);

      setResumeData({
        name: sections[0] || "",
        email: sections.find(line => line.includes("@")) || "",
        phone: sections.find(line => /\d{10}/.test(line)) || "",
        summary: sections.slice(1, 5).join(" ") || "",
        experience: sections.find(line => line.toLowerCase().includes("experience")) || "",
        education: sections.find(line => line.toLowerCase().includes("education")) || "",
        skills: sections.find(line => line.toLowerCase().includes("skills")) || "",
      });

      setModeSelected(true);
    } catch (error) {
      console.error("Failed to parse file:", error);
      alert("Failed to read the file. Please upload a valid .docx file.");
    }
    setLoadingUpload(false);
  };

  const handleClearAll = () => {
    setResumeData({
      name: "",
      email: "",
      phone: "",
      summary: "",
      experience: "",
      education: "",
      skills: "",
    });
  };

  const DownloadButton = () => (
    <PDFDownloadLink 
      document={<ResumePDF resumeData={resumeData} />} 
      fileName={`${resumeData.name || 'resume'}.pdf`}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow hover:shadow-md flex items-center gap-2"
    >
      {({ loading }: { loading: boolean }) => (
        loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Preparing...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download as PDF
          </>
        )
      )}
    </PDFDownloadLink>
  );
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Clear and Download Buttons */}
      {modeSelected && (
        <div className="flex justify-end mb-8 gap-4">
          <button
            onClick={handleClearAll}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-6 rounded-lg transition-all duration-200 shadow hover:shadow-md flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Clear All
          </button>

          <DownloadButton />
        </div>
      )}

      {/* Choose Mode */}
      {!modeSelected && (
        <motion.div
          className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Build Your Perfect Resume</h1>
            <p className="text-gray-600 dark:text-gray-400">Choose how you'd like to get started</p>
          </div>
          
          <div className="flex gap-6 flex-wrap justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setModeSelected(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Start from Scratch
            </motion.button>

            <motion.label 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
            >
              {loadingUpload ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Upload Resume"
              )}
              <input type="file" accept=".docx" onChange={handleFileUpload} className="hidden" />
            </motion.label>
          </div>
        </motion.div>
      )}

      {/* Resume Builder Form */}
      {modeSelected && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Left Side - Form */}
          <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Resume Details</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Fill in your information below</p>

            <div className="space-y-5">
              {["name", "email", "phone", "summary", "experience", "education", "skills"].map((field) => (
                <div key={field} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {field}
                    {["email", "phone"].includes(field) && (
                      <span className="text-gray-500 text-xs ml-1">({field === "email" ? "e.g., name@example.com" : "e.g., 123-456-7890"})</span>
                    )}
                  </label>
                  {["summary", "experience", "education", "skills"].includes(field) ? (
                    <textarea
                      name={field}
                      value={resumeData[field as keyof typeof resumeData]}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      rows={field === "summary" ? 3 : 4}
                      placeholder={`Enter your ${field}...`}
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={resumeData[field as keyof typeof resumeData]}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder={`Enter your ${field}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Live Preview (PDF-safe version) */}
          <div className="sticky top-6 h-fit">
            <div
              ref={previewRef}
              className="bg-white text-gray-800 p-8 rounded-xl border border-gray-300"
              style={{
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff',
                color: '#000000'
              }}
            >
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1" style={{ color: '#000000' }}>{resumeData.name || "Your Name"}</h1>
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                  {resumeData.email && <span style={{ color: '#4b5563' }}>{resumeData.email}</span>}
                  {resumeData.phone && <span style={{ color: '#4b5563' }}>{resumeData.phone}</span>}
                </div>
              </div>

              {resumeData.summary && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2" style={{ color: '#000000' }}>Summary</h2>
                  <p className="text-gray-700" style={{ color: '#374151' }}>{resumeData.summary}</p>
                </div>
              )}

              {resumeData.experience && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2" style={{ color: '#000000' }}>Experience</h2>
                  <p className="text-gray-700 whitespace-pre-line" style={{ color: '#374151' }}>{resumeData.experience}</p>
                </div>
              )}

              {resumeData.education && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2" style={{ color: '#000000' }}>Education</h2>
                  <p className="text-gray-700 whitespace-pre-line" style={{ color: '#374151' }}>{resumeData.education}</p>
                </div>
              )}

              {resumeData.skills && (
                <div>
                  <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-2" style={{ color: '#000000' }}>Skills</h2>
                  <p className="text-gray-700 whitespace-pre-line" style={{ color: '#374151' }}>{resumeData.skills}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}