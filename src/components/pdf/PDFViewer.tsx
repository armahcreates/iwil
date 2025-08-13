import React, { useState } from 'react';
import { PDFViewer as ReactPDFViewer, PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Download, FileText, Eye, X, Loader2 } from 'lucide-react';
import { ReportPDF } from './ReportPDF';
import { Client, Report } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface PDFViewerProps {
  client: Client;
  report: Report;
  trigger?: React.ReactNode;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ 
  client, 
  report, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleViewInBrowser = async () => {
    try {
      setIsGenerating(true);
      const pdfDoc = <ReportPDF client={client} report={report} />;
      const blob = await pdf(pdfDoc).toBlob();
      const url = URL.createObjectURL(blob);
      
      // Open in new tab
      window.open(url, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm"
      className="glass border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
    >
      <FileText className="h-4 w-4 mr-2" />
      View PDF
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl h-[90vh] glass-strong border-0 shadow-2xl">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-white/20">
          <div>
            <DialogTitle className="text-xl font-bold text-gray-800">
              Health Report - {client.name}
            </DialogTitle>
            <p className="text-sm text-gray-600 mt-1">
              {report.templateName} • Report ID: {report.id}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleViewInBrowser}
              disabled={isGenerating}
              variant="outline"
              size="sm"
              className="glass border-green-200 hover:border-green-300 text-green-700 hover:text-green-800"
            >
              {isGenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              Open in Browser
            </Button>
            
            <PDFDownloadLink
              document={<ReportPDF client={client} report={report} />}
              fileName={`${client.name.replace(/\s+/g, '_')}_Health_Report_${report.id}.pdf`}
            >
              {({ loading }) => (
                <Button
                  disabled={loading}
                  variant="outline"
                  size="sm"
                  className="glass border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Download PDF
                </Button>
              )}
            </PDFDownloadLink>
            
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full"
              >
                <ReactPDFViewer 
                  width="100%" 
                  height="100%"
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  <ReportPDF client={client} report={report} />
                </ReactPDFViewer>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
