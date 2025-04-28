import React, { useEffect, useState } from 'react';
import { marked } from 'marked';

const resumeData = {
  enhancedResumeText: `
  **Kadiri Rachith**  
  Bangalore, India | +91-9611618349 | kadrachith@gmail.com | linkedin.com/in/kadiri-rachith

  ## Professional Summary
  Highly motivated and results-oriented Associate System Engineer with proven success in full-stack software development, testing, and automation. Expertise in Java, Python, SQL, React, and Next.js, with a passion for building scalable and user-centric applications. Demonstrated ability to collaborate effectively within cross-functional teams to deliver high-quality solutions and drive continuous improvement.

  ## Key Skills
  - Java
  - Python
  - C++
  - JavaScript
  - SQL
  - MongoDB
  - HTML
  - CSS
  - React
  - Next.js
  - Selenium
  - Postman
  - Karate
  - AWS
  - Azure
  - Openshift
  - Linux
  - Windows
  - Spring Boot
  - API Testing
  - UI Testing
  - Test Automation
  - Software Development
  - Agile Methodologies

  ## Professional Experience

  ### IBM
  **Associate System Engineer** | Dec 2023 - Present

  - **Situation:** Multiple software releases required comprehensive testing to ensure quality and stability. Manual testing processes were time-consuming and prone to errors.
  - **Task:** Led testing efforts as Test Lead, responsible for developing and executing test strategies, as well as delivering detailed summary reports for all releases.
  - **Action:** Implemented end-to-end automation testing using Selenium for UI and Postman/Karate for API testing. Collaborated with cross-functional teams to identify and resolve issues. Introduced continuous improvement practices within the testing process.
  - **Result:** Achieved a 35% reduction in testing cycle time while significantly improving the quality and efficiency of the software release process.

  ### KGTTI
  **Intern Trainee** | Aug 2022 - Sep 2022

  - **Situation:** Existing user registration process was inefficient and created bottlenecks in onboarding new users.
  - **Task:** Designed and developed user registration software to streamline the onboarding process.
  - **Action:** Developed the application using Java Spring Boot and deployed it on Red Hat Enterprise Linux, prioritizing system security and data integrity. Collaborated with a team of 3 engineers throughout the project lifecycle.
  - **Result:** Delivered the project on time and within budget, resulting in a 20% improvement in user onboarding efficiency.

  ## Projects
  - **Mockhiato:** Engineered a full-stack AI-powered interview platform using Next.js, Firebase, and Vapi SDK.
  - **CryptoInfo:** Built a React application providing real-time cryptocurrency data and news.
  - **Notes Portal:** Developed an online notes portal using Java Spring Boot, React, and SQL.
  - **Sudoku Solver App:** Developed an Android Sudoku solver app using Java and a Backtracking algorithm.

  ## Education
  **East West Institute of Technology - Bengaluru**  
  Bachelor of Engineering (B.E), Computer Science & Engineering | June 2019 - June 2023  
  GPA: 8.36/10.0
  `
};

const ResumeComponent = () => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    // Convert the Markdown to HTML when component mounts
    const parsedHtml = marked.parse(resumeData.enhancedResumeText) as string;
    setHtmlContent(parsedHtml);
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <div
        id="resume-content"
        className="p-8 sm:p-10 prose max-w-none text-gray-900"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
};

export default ResumeComponent;
