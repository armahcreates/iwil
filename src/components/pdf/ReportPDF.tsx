import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Client, Report } from '../../types';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#2563eb',
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
    color: '#6b7280',
    marginBottom: 3,
  },
  clientInfo: {
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 15,
    borderRadius: 5,
  },
  clientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  clientDetail: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 3,
  },
  content: {
    fontSize: 10,
    lineHeight: 1.4,
    color: '#4b5563',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metric: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 8,
    color: '#6b7280',
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 10,
  },
  protocolBox: {
    backgroundColor: '#eff6ff',
    border: 1,
    borderColor: '#3b82f6',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
  },
  protocolTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  protocolContent: {
    fontSize: 9,
    color: '#1f2937',
    lineHeight: 1.3,
  },
});

interface ReportPDFProps {
  client: Client;
  report: Report;
}

export const ReportPDF: React.FC<ReportPDFProps> = ({ client, report }) => {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateHealthInsights = () => {
    const insights = [
      "Metabolic markers show significant improvement over the past 30 days.",
      "Sleep quality has improved by 25% based on tracking data.",
      "Nutritional adherence remains consistently high at 92%.",
      "Recommended to continue current supplementation protocol.",
      "Consider adding 15 minutes of morning meditation for stress management.",
    ];
    return insights;
  };

  const generateRecommendations = () => {
    const recommendations = [
      "Maintain current exercise routine with focus on strength training",
      "Increase omega-3 intake through fatty fish 2-3 times per week",
      "Continue intermittent fasting protocol 16:8",
      "Schedule follow-up biomarker testing in 6 weeks",
      "Consider adding adaptogenic herbs for stress support",
    ];
    return recommendations;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>IWIL Health Report</Text>
          <Text style={styles.subtitle}>Comprehensive Wellness Assessment</Text>
          <Text style={styles.subtitle}>Report ID: {report.id}</Text>
          <Text style={styles.subtitle}>Generated: {formatDate(new Date())}</Text>
        </View>

        {/* Client Information */}
        <View style={styles.clientInfo}>
          <Text style={styles.clientName}>{client.name}</Text>
          <Text style={styles.clientDetail}>Email: {client.email}</Text>
          <Text style={styles.clientDetail}>Last Visit: {formatDate(client.lastVisit)}</Text>
          <Text style={styles.clientDetail}>Next Appointment: {formatDate(client.nextAppointment)}</Text>
        </View>

        {/* Health Protocol */}
        <View style={styles.protocolBox}>
          <Text style={styles.protocolTitle}>Current Health Protocol</Text>
          <Text style={styles.protocolContent}>{client.healthProtocol}</Text>
        </View>

        {/* Performance Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{client.adherenceScore.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Protocol Adherence</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{client.progressScore.toFixed(1)}%</Text>
            <Text style={styles.metricLabel}>Progress Score</Text>
          </View>
        </View>

        {/* Report Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Overview</Text>
          <Text style={styles.content}>
            Report Type: {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
          </Text>
          <Text style={styles.content}>
            Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Text>
          <Text style={styles.content}>
            Template: {report.templateName}
          </Text>
          <Text style={styles.content}>
            Completion: {report.completionPercentage}%
          </Text>
          <Text style={styles.content}>
            Deadline: {formatDate(report.deadline)}
          </Text>
        </View>

        {/* Health Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Insights</Text>
          {generateHealthInsights().map((insight, index) => (
            <Text key={index} style={[styles.content, { marginBottom: 3 }]}>
              • {insight}
            </Text>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          {generateRecommendations().map((recommendation, index) => (
            <Text key={index} style={[styles.content, { marginBottom: 3 }]}>
              {index + 1}. {recommendation}
            </Text>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          IWIL Protocol - Confidential Health Report
          {'\n'}
          This report contains sensitive health information and should be kept secure.
          {'\n'}
          Generated on {formatDate(new Date())} | Page 1 of 1
        </Text>
      </Page>
    </Document>
  );
};
