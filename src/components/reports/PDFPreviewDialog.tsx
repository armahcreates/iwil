import React, { useEffect, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { PDFReportDocument } from './PDFReportDocument';
import { Client, Report } from '../../types';
import { LoaderCircle } from 'lucide-react';

interface PDFPreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  report: Report | null;
  client: Client | null;
}

export const PDFPreviewDialog: React.FC<PDFPreviewDialogProps> = ({ isOpen, onOpenChange, report, client }) => {
  const [isClient, setIsClient] = useState(false);

  // This is a workaround to ensure PDFViewer only renders on the client side.
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent size="xl" className="h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Report Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1">
          {isClient && report && client ? (
            <PDFViewer width="100%" height="100%" className="rounded-md">
              <PDFReportDocument report={report} client={client} />
            </PDFViewer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
              <p className="ml-2">Loading PDF Preview...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
