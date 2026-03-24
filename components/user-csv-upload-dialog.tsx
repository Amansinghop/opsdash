'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, Download } from 'lucide-react';

interface UserCsvUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserCsvUploadDialog({ isOpen, onClose }: UserCsvUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!file) {
      setError('Please select a CSV file');
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/user/csv-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload CSV');
        return;
      }

      setResults(data.results);
      setSuccess(`CSV processed: ${data.results.length} records handled`);
      setFile(null);

      setTimeout(() => {
        onClose();
        setResults(null);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('[v0] CSV upload error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `name,email,action
John Doe,john@example.com,add
Jane Smith,jane@example.com,add
user@example.com,user@example.com,delete`;

    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'user-template.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[v0] Download template error:', error);
      alert('Failed to download template. Please create a CSV file with: name, email, action');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload User CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to add, update, or delete users. Download the template to see the required format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={downloadTemplate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  disabled={isLoading}
                  className="hidden"
                />
                <label htmlFor="csv-file" className="cursor-pointer flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {file ? file.name : 'Click to select CSV file or drag and drop'}
                  </span>
                  <span className="text-xs text-muted-foreground">CSV files only</span>
                </label>
              </div>
            </div>

            <div className="bg-muted/50 p-3 rounded text-sm">
              <p className="font-medium mb-2">CSV Format (name, email, action):</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>• Add user: {`name,email@example.com,add`}</li>
                <li>• Update user: {`name,email@example.com,update`}</li>
                <li>• Delete user: {`name,email@example.com,delete`}</li>
              </ul>
            </div>

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-success bg-success/10 p-3 rounded">
                {success}
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !file}>
                {isLoading ? 'Uploading...' : 'Upload CSV'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
