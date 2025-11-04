import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: '3px solid #3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 2,
    lineHeight: 1.3,
  },
  section: {
    marginTop: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 6,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 3,
  },
  overallScore: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 5,
  },
  performanceBadge: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 12,
    textTransform: 'uppercase',
    paddingTop: 5,
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 6,
    backgroundColor: '#f8fafc',
    borderRadius: 3,
  },
  stageName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
  },
  stageScore: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  strengthItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  strengthBullet: {
    width: 12,
    fontSize: 10,
    color: '#16a34a',
  },
  strengthText: {
    flex: 1,
    fontSize: 9,
    color: '#166534',
    lineHeight: 1.4,
  },
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 4,
    paddingLeft: 8,
  },
  improvementBullet: {
    width: 12,
    fontSize: 10,
    color: '#f59e0b',
  },
  improvementText: {
    flex: 1,
    fontSize: 9,
    color: '#92400e',
    lineHeight: 1.4,
  },
  feedbackBox: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 3,
    borderLeft: '2px solid #3b82f6',
  },
  feedbackQuestion: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 3,
  },
  feedbackScore: {
    fontSize: 8,
    color: '#3b82f6',
    marginBottom: 4,
  },
  feedbackSubsection: {
    marginTop: 4,
  },
  feedbackLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 2,
  },
  feedbackText: {
    fontSize: 8,
    color: '#64748b',
    marginLeft: 8,
    marginBottom: 2,
  },
  footer: {
    marginTop: 'auto',
    textAlign: 'center',
    fontSize: 7,
    color: '#94a3b8',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 8,
    paddingBottom: 0,
  },
});

interface InterviewReportPDFProps {
  report: any;
  session: any;
  userEmail: string;
}

export const InterviewReportPDF = ({ report, session, userEmail }: InterviewReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Full-Stack Developer Interview Report</Text>
        <Text style={styles.subtitle}>Candidate: {userEmail}</Text>
        <Text style={styles.subtitle}>
          Experience Level: {session.experience_level.charAt(0).toUpperCase() + session.experience_level.slice(1)}
        </Text>
        <Text style={styles.subtitle}>
          Date: {new Date(session.created_at).toLocaleDateString()}
        </Text>
      </View>

      {/* Overall Score */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Performance</Text>
        <Text style={styles.overallScore}>{report.overall_score.toFixed(1)}/10</Text>
        <Text style={styles.performanceBadge}>
          {report.performance_level.replace('-', ' ')}
        </Text>
      </View>

      {/* Stage Scores */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Score Breakdown by Stage</Text>
        {report.stage_scores.map((stage: any, idx: number) => (
          <View key={idx} style={styles.stageRow}>
            <Text style={styles.stageName}>{stage.title}</Text>
            <Text style={styles.stageScore}>
              {stage.score.toFixed(1)}/{stage.maxScore}
            </Text>
          </View>
        ))}
      </View>

      {/* Key Strengths */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Strengths</Text>
        {report.strengths.slice(0, 5).map((strength: string, idx: number) => (
          <View key={idx} style={styles.strengthItem}>
            <Text style={styles.strengthBullet}>✓</Text>
            <Text style={styles.strengthText}>{strength}</Text>
          </View>
        ))}
      </View>

      {/* Areas for Improvement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Areas for Improvement</Text>
        {report.improvements.slice(0, 5).map((improvement: string, idx: number) => (
          <View key={idx} style={styles.improvementItem}>
            <Text style={styles.improvementBullet}>•</Text>
            <Text style={styles.improvementText}>{improvement}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Generated by QodeBench Interview System</Text>
        <Text>This report is confidential and intended for the candidate only</Text>
      </View>
    </Page>

    {/* Detailed Feedback - Second Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Detailed Feedback by Stage</Text>
      </View>

      {report.detailed_feedback.slice(0, 3).map((stageFeedback: any, idx: number) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{stageFeedback.stage}</Text>
          {stageFeedback.responses.slice(0, 2).map((response: any, rIdx: number) => (
            <View key={rIdx} style={styles.feedbackBox}>
              <Text style={styles.feedbackQuestion}>
                {response.question_text.length > 100
                  ? response.question_text.substring(0, 97) + '...'
                  : response.question_text}
              </Text>
              <Text style={styles.feedbackScore}>
                Score: {response.score.toFixed(1)}/10
              </Text>

              <View style={styles.feedbackSubsection}>
                <Text style={styles.feedbackLabel}>Strengths:</Text>
                {response.feedback.strengths.slice(0, 2).map((s: string, sIdx: number) => (
                  <Text key={sIdx} style={styles.feedbackText}>
                    • {s.length > 120 ? s.substring(0, 117) + '...' : s}
                  </Text>
                ))}
              </View>

              <View style={styles.feedbackSubsection}>
                <Text style={styles.feedbackLabel}>Improvements:</Text>
                {response.feedback.improvements.slice(0, 2).map((i: string, iIdx: number) => (
                  <Text key={iIdx} style={styles.feedbackText}>
                    • {i.length > 120 ? i.substring(0, 117) + '...' : i}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>
      ))}

      {/* Footer */}
      <View style={styles.footer}>
        <Text>Page 2 of 2</Text>
      </View>
    </Page>
  </Document>
);
