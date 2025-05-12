
import React from 'react';
import { ToolResponse } from '@/utils/agentService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Chunk } from '@/utils/vectorStore';

interface ResultDisplayProps {
  result: ToolResponse | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  if (!result) return null;

  const getToolIcon = (toolName: string) => {
    switch (toolName) {
      case 'calculator':
        return '🧮';
      case 'dictionary':
        return '📚';
      case 'rag':
        return '🔍';
      default:
        return '🤖';
    }
  };

  const getToolColor = (toolName: string) => {
    switch (toolName) {
      case 'calculator':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'dictionary':
        return 'bg-purple-50 border-purple-200 text-purple-700';
      case 'rag':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mr-2 ${getToolColor(result.toolUsed)}`}>
            {getToolIcon(result.toolUsed)} {result.toolUsed.toUpperCase()}
          </span>
          Response
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-md p-4 border">
          <h3 className="text-lg font-medium mb-2">Answer</h3>
          <p>{result.answer}</p>
        </div>

        {result.chunks && result.chunks.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2 text-gray-700">Retrieved Context</h3>
            <div className="space-y-2">
              {result.chunks.map((chunk: Chunk, index: number) => (
                <div 
                  key={chunk.id} 
                  className="bg-gray-50 rounded-md p-3 border text-sm"
                >
                  <p className="text-xs font-medium text-gray-500 mb-1">
                    Source: {chunk.metadata.title} (Chunk {chunk.metadata.chunkIndex + 1})
                  </p>
                  <p>{chunk.text.substring(0, 200)}{chunk.text.length > 200 ? '...' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700">Agent Logs</h3>
          <pre className="bg-gray-900 text-gray-100 rounded-md p-3 text-xs overflow-x-auto">
            {result.logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultDisplay;
