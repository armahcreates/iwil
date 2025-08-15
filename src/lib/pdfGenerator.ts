import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ReportData {
  id: string;
  clientName: string;
  clientEmail: string;
  template: string;
  status: string;
  createdAt: string;
  data: {
    assessment?: {
      overallScore: number;
      categories: Array<{
        name: string;
        score: number;
        recommendations: string[];
      }>;
    };
    recommendations?: string[];
    nextSteps?: string[];
    notes?: string;
  };
}

export class PDFReportGenerator {
  private logoDataUrl: string | null = null;

  constructor() {
    this.loadLogo();
  }

  private async loadLogo(): Promise<void> {
    try {
      // Load the IWIL logo and convert to data URL
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = '/iwil-logo.png';
      
      await new Promise((resolve, reject) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          this.logoDataUrl = canvas.toDataURL('image/png');
          resolve(void 0);
        };
        img.onerror = reject;
      });
    } catch (error) {
      console.warn('Could not load logo for PDF:', error);
    }
  }

  async generatePDF(reportData: ReportData): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Add logo if available
    if (this.logoDataUrl) {
      try {
        pdf.addImage(this.logoDataUrl, 'PNG', margin, margin, 30, 30);
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }

    // Header
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('I.W.I.L. Protocol Report', margin + 40, margin + 15);

    // Client information
    let yPosition = margin + 40;
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Client Information', margin, yPosition);
    
    yPosition += 10;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${reportData.clientName}`, margin, yPosition);
    
    yPosition += 8;
    pdf.text(`Email: ${reportData.clientEmail}`, margin, yPosition);
    
    yPosition += 8;
    pdf.text(`Report Type: ${reportData.template}`, margin, yPosition);
    
    yPosition += 8;
    pdf.text(`Status: ${reportData.status.toUpperCase()}`, margin, yPosition);
    
    yPosition += 8;
    pdf.text(`Generated: ${new Date(reportData.createdAt).toLocaleDateString()}`, margin, yPosition);

    // Assessment Results (if available)
    if (reportData.data.assessment) {
      yPosition += 20;
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Assessment Results', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(14);
      pdf.text(`Overall Score: ${reportData.data.assessment.overallScore}/100`, margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Category Breakdown:', margin, yPosition);
      
      reportData.data.assessment.categories.forEach((category) => {
        yPosition += 10;
        pdf.setFont('helvetica', 'normal');
        pdf.text(`• ${category.name}: ${category.score}/100`, margin + 5, yPosition);
        
        if (category.recommendations.length > 0) {
          category.recommendations.forEach((rec) => {
            yPosition += 6;
            const lines = pdf.splitTextToSize(`  - ${rec}`, contentWidth - 10);
            pdf.text(lines, margin + 10, yPosition);
            yPosition += (lines.length - 1) * 6;
          });
        }
        
        // Check if we need a new page
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
      });
    }

    // Recommendations
    if (reportData.data.recommendations && reportData.data.recommendations.length > 0) {
      yPosition += 20;
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Recommendations', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      reportData.data.recommendations.forEach((recommendation, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${recommendation}`, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 6 + 5;
        
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
      });
    }

    // Next Steps
    if (reportData.data.nextSteps && reportData.data.nextSteps.length > 0) {
      yPosition += 20;
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Next Steps', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      
      reportData.data.nextSteps.forEach((step, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${step}`, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 6 + 5;
        
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = margin;
        }
      });
    }

    // Notes
    if (reportData.data.notes) {
      yPosition += 20;
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = margin;
      }
      
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Additional Notes', margin, yPosition);
      
      yPosition += 15;
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      const noteLines = pdf.splitTextToSize(reportData.data.notes, contentWidth);
      pdf.text(noteLines, margin, yPosition);
    }

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `I.W.I.L. Protocol System - Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      pdf.text(
        `Generated on ${new Date().toLocaleDateString()}`,
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    return pdf.output('blob');
  }

  async generateAndDownload(reportData: ReportData): Promise<void> {
    const pdfBlob = await this.generatePDF(reportData);
    const url = URL.createObjectURL(pdfBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `IWIL_Report_${reportData.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }

  async generateAndPreview(reportData: ReportData): Promise<string> {
    const pdfBlob = await this.generatePDF(reportData);
    return URL.createObjectURL(pdfBlob);
  }
}

export const pdfGenerator = new PDFReportGenerator();
