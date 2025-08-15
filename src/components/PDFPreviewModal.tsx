import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Download, X, FileText, Loader2 } from 'lucide-react';
import { pdfGenerator, ReportData } from '../lib/pdfGenerator';

interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData: ReportData | null;
}

export const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({
  isOpen,
  onClose,
  reportData
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && reportData) {
      generatePDF();
    }
    
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, reportData]);

  const generatePDF = async () => {
    if (!reportData) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const url = await pdfGenerator.generateAndPreview(reportData);
      setPdfUrl(url);
    } catch (err) {
      setError('Failed to generate PDF. Please try again.');
      console.error('PDF generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!reportData) return;
    
    try {
      await pdfGenerator.generateAndDownload(reportData);
    } catch (err) {
      setError('Failed to download PDF. Please try again.');
      console.error('PDF download error:', err);
    }
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-slate-600" />
              <span>PDF Report Preview</span>
              {reportData && (
                <span className="text-sm font-normal text-slate-500">
                  - {reportData.clientName}
                </span>
              )}
            </DialogTitle>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDownload}
                disabled={!pdfUrl || isGenerating}
                size="sm"
                className="iwil-gradient text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                onClick={handleClose}
                variant="ghost"
                size="sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0">
          {isGenerating && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600">Generating PDF report...</p>
                <p className="text-sm text-slate-500 mt-2">
                  Including IWIL logo and formatting content
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 font-medium">{error}</p>
                <Button
                  onClick={generatePDF}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {pdfUrl && !isGenerating && !error && (
            <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Preview"
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 pt-4 border-t">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-4">
              <span>Report Type: {reportData?.template}</span>
              <span>Status: {reportData?.status}</span>
            </div>
            <div>
              Generated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
