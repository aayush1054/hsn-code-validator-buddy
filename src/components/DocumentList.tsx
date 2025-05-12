
import React from 'react';
import { Document } from '@/utils/vectorStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ documents }) => {
  if (documents.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>No documents added yet.</p>
            <p className="text-sm">Add documents to build your knowledge base.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Knowledge Base ({documents.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="border rounded-md p-3 bg-gray-50">
              <div className="flex items-start">
                <FileText className="h-5 w-5 mr-2 mt-0.5 text-blue-600" />
                <div>
                  <h3 className="font-medium">{doc.metadata.title}</h3>
                  <p className="text-xs text-gray-500">Source: {doc.metadata.source}</p>
                  <p className="text-sm mt-1 line-clamp-2 text-gray-700">
                    {doc.text.substring(0, 150)}...
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default DocumentList;
