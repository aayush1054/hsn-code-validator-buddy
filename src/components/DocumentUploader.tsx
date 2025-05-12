
import React, { useState, useRef } from 'react';
import { Document } from '@/utils/vectorStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Upload, FileText } from 'lucide-react';

interface DocumentUploaderProps {
  onDocumentAdded: (document: Document) => void;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onDocumentAdded }) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [content, setContent] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Set the title to the file name by default
    setTitle(file.name.replace(/\.[^/.]+$/, ''));
    setSource('File Upload');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setContent(content);
    };
    
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: 'Missing information',
        description: 'Please provide a title and content for the document',
        variant: 'destructive',
      });
      return;
    }
    
    const newDocument: Document = {
      id: `doc_${Date.now()}`,
      text: content,
      metadata: {
        title,
        source: source || 'Manual Entry',
      }
    };
    
    onDocumentAdded(newDocument);
    
    // Reset form
    setTitle('');
    setSource('');
    setContent('');
    toast({
      title: 'Document added',
      description: `"${title}" has been added to the knowledge base`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Document</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Enter document source"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Document Content</Label>
            <textarea
              id="content"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[200px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter document content or upload a file"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.html"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" />
              Add Document
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
