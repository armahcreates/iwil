import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { wellnessTemplates } from '../../data/templateData';
import { FilePlus2 } from 'lucide-react';
import { Client } from '../../types';

interface CreateReportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  clients: Client[] | null;
}

export const CreateReportDialog: React.FC<CreateReportDialogProps> = ({ isOpen, onOpenChange, clients }) => {
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const handleCreateReport = () => {
    if (selectedClient && selectedTemplate) {
      console.log('Creating report for client:', selectedClient, 'with template:', selectedTemplate);
      onOpenChange(false);
      setSelectedClient('');
      setSelectedTemplate('');
    } else {
      alert('Please select a client and a template.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FilePlus2 className="h-5 w-5 iwil-gradient-text" />
            <span>Create New Wellness Report</span>
          </DialogTitle>
          <DialogDescription>
            Select a client and a template to start a new report.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Select onValueChange={setSelectedClient} value={selectedClient}>
              <SelectTrigger id="client" className="col-span-3">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template" className="text-right">
              Template
            </Label>
            <Select onValueChange={setSelectedTemplate} value={selectedTemplate}>
              <SelectTrigger id="template" className="col-span-3">
                <SelectValue placeholder="Select a template" />
              </SelectTrigger>
              <SelectContent>
                {wellnessTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            className="iwil-gradient text-white shadow-lg" 
            onClick={handleCreateReport}
            disabled={!selectedClient || !selectedTemplate}
          >
            Create Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
