import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #3b82f6',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 3,
  },
  section: {
    marginTop: 15,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 4,
  },
  overallScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#3b82f6',
    textAlign: 'center',
    marginVertical: 10,
  },
  performanceBadge: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
    textAlign: 'center',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  stageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  stageName: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#334155',
  },
  stageScore: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  strengthItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  strengthBullet: {
    width: 15,
    fontSize: 11,
    color: '#16a34a',
  },
  strengthText: {
    flex: 1,
    fontSize: 10,
    color: '#166534',
    lineHeight: 1.5,
  },
  improvementItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  improvementBullet: {
    width: 15,
    fontSize: 11,
    color: '#f59e0b',
  },
  improvementText: {
    flex: 1,
    fontSize: 10,
    color: '#92400e',
    lineHeight: 1.5,
  },
  feedbackBox: {
    marginBottom: 12,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    borderLeft: '3px solid #3b82f6',
  },
  feedbackQuestion: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  feedbackScore: {
    fontSize: 9,
    color: '#3b82f6',
    marginBottom: 6,
  },
  feedbackSubsection: {
    marginTop: 6,
  },
  feedbackLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 3,
  },
  feedbackText: {
    fontSize: 8,
    color: '#64748b',
    marginLeft: 10,
    marginBottom: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTop: '1px solid #e2e8f0',
    paddingTop: 10,
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
        {report.strengths.map((strength: string, idx: number) => (
          <View key={idx} style={styles.strengthItem}>
            <Text style={styles.strengthBullet}>✓</Text>
            <Text style={styles.strengthText}>{strength}</Text>
          </View>
        ))}
      </View>

      {/* Areas for Improvement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Areas for Improvement</Text>
        {report.improvements.map((improvement: string, idx: number) => (
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

      {report.detailed_feedback.map((stageFeedback: any, idx: number) => (
        <View key={idx} style={styles.section}>
          <Text style={styles.sectionTitle}>{stageFeedback.stage}</Text>
          {stageFeedback.responses.slice(0, 3).map((response: any, rIdx: number) => (
            <View key={rIdx} style={styles.feedbackBox}>
              <Text style={styles.feedbackQuestion}>
                {response.question_text}
              </Text>
              <Text style={styles.feedbackScore}>
                Score: {response.score.toFixed(1)}/10
              </Text>

              <View style={styles.feedbackSubsection}>
                <Text style={styles.feedbackLabel}>Strengths:</Text>
                {response.feedback.strengths.map((s: string, sIdx: number) => (
                  <Text key={sIdx} style={styles.feedbackText}>
                    • {s}
                  </Text>
                ))}
              </View>

              <View style={styles.feedbackSubsection}>
                <Text style={styles.feedbackLabel}>Improvements:</Text>
                {response.feedback.improvements.map((i: string, iIdx: number) => (
                  <Text key={iIdx} style={styles.feedbackText}>
                    • {i}
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
