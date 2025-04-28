import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { Html } from 'react-pdf-html';

// Fallback font registration (simpler approach)
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
      fontWeight: 400,
    },
    {
      src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2',
      fontWeight: 700,
    },
  ],
});

// Create styles with fallback font
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontFamily: 'Roboto', // Using simpler font
  },
  section: {
    marginBottom: 20,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#006699',
    textAlign: 'center',
  },
  heading2: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#006699',
    borderBottom: '1px solid #66aaff',
    paddingBottom: 4,
  },
  heading3: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#66aaff',
  },
  paragraph: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 1.5,
  },
  listItem: {
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 10,
  },
});

// Simplified HTML renderer with basic tags only
const htmlRendererOptions = {
  styleSheets: [
    {
      id: 'resume-styles',
      text: `
        h1 { font-size: 24pt; font-weight: bold; margin-bottom: 10pt; color: #006699; text-align: center; }
        h2 { font-size: 18pt; font-weight: bold; margin-bottom: 8pt; color: #006699; border-bottom: 1pt solid #66aaff; padding-bottom: 4pt; }
        h3 { font-size: 14pt; font-weight: bold; margin-bottom: 6pt; color: #66aaff; }
        p { font-size: 12pt; margin-bottom: 8pt; line-height: 1.5; }
        li { font-size: 12pt; margin-bottom: 4pt; margin-left: 10pt; }
      `,
    },
  ],
};

interface ResumePDFProps {
  enhancedResumeText: string;
}

const ResumePDF = ({ enhancedResumeText }: ResumePDFProps) => {
  // Simplify HTML content to prevent rendering issues
  const sanitizedHTML = enhancedResumeText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, (match) => {
      // Only allow basic formatting tags
      const allowedTags = ['h1', 'h2', 'h3', 'p', 'li', 'ul', 'ol', 'strong', 'em', 'b', 'i', 'u'];
      const tagMatch = match.match(/^<(\w+)/);
      if (tagMatch && allowedTags.includes(tagMatch[1].toLowerCase())) {
        return match.replace(/style="[^"]*"/g, ''); // Remove style attributes
      }
      return '';
    });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Html {...htmlRendererOptions}>
            {sanitizedHTML}
          </Html>
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDF;