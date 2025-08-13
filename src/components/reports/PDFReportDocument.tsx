import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { Client, Report } from '../../types';
import { format } from 'date-fns';

// Register fonts
// In a real app, you'd bundle these font files. For this example, we'll link to Google Fonts.
// Note: Linking might be unreliable. Bundling is the robust solution.
Font.register({
  family: 'Lato',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/lato/v23/S6uyw4BMUTPHjx4wXg.ttf' },
    { src: 'https://fonts.gstatic.com/s/lato/v23/S6u9w4BMUTPHh6UVSwiPHA.ttf', fontWeight: 'bold' },
    { src: 'https://fonts.gstatic.com/s/lato/v23/S6u_w4BMUTPHjxsI5w.ttf', fontStyle: 'italic' },
  ],
});

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Lato',
    fontSize: 11,
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    backgroundColor: '#FFFFFF',
    color: '#2d3748', // gray-800
  },
  header: {
    position: 'absolute',
    top: 15,
    left: 35,
    right: 35,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
  },
  headerText: {
    fontSize: 8,
    color: '#a0aec0', // gray-500
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 8,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
  titlePage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  gradientText: {
    // Gradients aren't supported, so we'll use the primary blue color
    color: '#007BFF', // A representative blue
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a202c', // gray-900
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a5568', // gray-700
    marginBottom: 40,
    textAlign: 'center',
  },
  clientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: 5,
  },
  reportDate: {
    fontSize: 12,
    color: '#718096', // gray-600
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#007BFF',
    paddingBottom: 4,
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#f7fafc', // gray-100
    padding: 12,
    borderRadius: 5,
  },
  label: {
    fontSize: 10,
    color: '#718096',
    marginBottom: 4,
  },
  value: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d3748',
  },
  progressBarContainer: {
    height: 10,
    width: '100%',
    backgroundColor: '#e2e8f0', // gray-300
    borderRadius: 5,
    marginTop: 4,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#38a169', // green-500
    borderRadius: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 35,
    right: 35,
    textAlign: 'center',
    fontSize: 8,
    color: '#a0aec0',
  },
});

interface PDFReportDocumentProps {
  client: Client;
  report: Report;
}

export const PDFReportDocument: React.FC<PDFReportDocumentProps> = ({ client, report }) => (
  <Document
    author="IWIL Protocol"
    title={`${report.template} for ${client.name}`}
  >
    {/* Title Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.titlePage}>
        <Image style={styles.logo} src="https://i.imgur.com/9LXk5Qm.png" />
        <Text style={{...styles.title, marginTop: 20}}>Wellness Report</Text>
        <Text style={styles.subtitle}>{report.template}</Text>
        <Text style={styles.clientName}>{client.name}</Text>
        <Text style={styles.reportDate}>Report Generated: {format(new Date(), 'MMMM dd, yyyy')}</Text>
      </View>
    </Page>

    {/* Content Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.header} fixed>
        <Image style={styles.logo} src="https://i.imgur.com/9LXk5Qm.png" />
        <Text style={styles.headerText}>IWIL Protocol - Confidential Wellness Report</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Profile</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Client Name</Text>
            <Text style={styles.value}>{client.name}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Client Email</Text>
            <Text style={styles.value}>{client.email}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wellness Protocol</Text>
        <View style={styles.gridItem}>
          <Text style={styles.label}>Current Protocol</Text>
          <Text style={styles.value}>{client.healthProtocol}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Metrics</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Protocol Adherence</Text>
            <Text style={styles.value}>{client.adherenceScore}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={{...styles.progressBar, width: `${client.adherenceScore}%`}} />
            </View>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Overall Progress</Text>
            <Text style={styles.value}>{client.progressScore}%</Text>
            <View style={styles.progressBarContainer}>
              <View style={{...styles.progressBar, width: `${client.progressScore}%`, backgroundColor: '#3182ce'}} />
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Details</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Report Type</Text>
            <Text style={styles.value}>{report.type}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Report Status</Text>
            <Text style={styles.value}>{report.status}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.label}>Report Deadline</Text>
            <Text style={styles.value}>{format(new Date(report.deadline), 'MMM dd, yyyy')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes & Recommendations</Text>
        <View style={styles.gridItem}>
           <Text>This is a placeholder for detailed notes, observations, and recommendations for the client based on the data from this reporting period. It can include text, lists, and other formatted content.</Text>
        </View>
      </View>

      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);
