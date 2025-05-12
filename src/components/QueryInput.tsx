
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface QueryInputProps {
  onSubmitQuery: (query: string) => void;
  isProcessing: boolean;
}

const QueryInput: React.FC<QueryInputProps> = ({ onSubmitQuery, isProcessing }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmitQuery(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Ask a question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="flex-grow"
      />
      <Button type="submit" disabled={isProcessing || !query.trim()}>
        {isProcessing ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Ask
          </>
        )}
      </Button>
    </form>
  );
};

export default QueryInput;
