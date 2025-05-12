
import { useState, useEffect } from 'react';
import { Document, useVectorStore } from '@/utils/vectorStore';
import { routeQuery, ToolResponse } from '@/utils/agentService';
import { preloadSampleDocuments } from '@/utils/preloadSampleDocuments';
import { sampleDocuments } from '@/utils/sampleDocuments';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentList from '@/components/DocumentList';
import QueryInput from '@/components/QueryInput';
import ResultDisplay from '@/components/ResultDisplay';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Index = () => {
  const vectorStore = useVectorStore();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [result, setResult] = useState<ToolResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [useSampleDocs, setUseSampleDocs] = useState(true);
  const { toast } = useToast();

  // Load sample documents on initial render if selected
  useEffect(() => {
    if (useSampleDocs && documents.length === 0) {
      preloadSampleDocuments(vectorStore);
      setDocuments(sampleDocuments);
      toast({
        title: 'Sample documents loaded',
        description: 'Sample documents have been added to the knowledge base',
      });
    }
  }, [useSampleDocs, vectorStore]);

  // Handle document addition
  const handleDocumentAdded = (document: Document) => {
    setDocuments([...documents, document]);
    vectorStore.addDocument(document);
  };

  // Handle query submission
  const handleQuerySubmit = async (query: string) => {
    setIsProcessing(true);
    try {
      if (documents.length === 0) {
        toast({
          title: 'No knowledge base',
          description: 'Please add documents to the knowledge base first',
          variant: 'destructive',
        });
        return;
      }

      const response = await routeQuery(query, vectorStore);
      setResult(response);
    } catch (error) {
      console.error('Error processing query:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while processing your query',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 rounded-lg p-2">
              <Search className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">RAG-Powered Q&A Assistant</h1>
              <p className="text-sm text-gray-500">
                Ask questions about your documents using a multi-agent system
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: Document management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="useSampleDocs" 
                  checked={useSampleDocs}
                  onCheckedChange={(checked) => setUseSampleDocs(checked as boolean)} 
                />
                <Label htmlFor="useSampleDocs">
                  Use sample documents
                </Label>
              </div>
            </div>
            
            <DocumentUploader onDocumentAdded={handleDocumentAdded} />
            <DocumentList documents={documents} />
          </div>

          {/* Right column: Query and results */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Ask a Question</h2>
              <QueryInput onSubmitQuery={handleQuerySubmit} isProcessing={isProcessing} />
              <div className="mt-2 text-xs text-gray-500">
                <p>Try asking:</p>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>"What is RAG and how does it work?"</li>
                  <li>"Tell me about multi-agent systems"</li>
                  <li>"What vector databases are used in RAG systems?"</li>
                  <li>"Calculate 24 * 7 + 365"</li>
                  <li>"Define LLM"</li>
                </ul>
              </div>
            </div>
            
            <ResultDisplay result={result} />
          </div>
        </div>
      </main>

      <footer className="bg-white border-t mt-12">
        <div className="container mx-auto py-4">
          <p className="text-center text-sm text-gray-500">
            RAG-Powered Multi-Agent Q&A Assistant
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
