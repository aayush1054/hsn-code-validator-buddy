
import { VectorStore, Chunk } from './vectorStore';

// Supported tools
type Tool = 'calculator' | 'dictionary' | 'rag';

// Tool definitions
interface ToolDefinition {
  name: Tool;
  description: string;
  keywords: string[];
  execute: (query: string, vectorStore?: VectorStore) => Promise<ToolResponse>;
}

// Tool response interface
export interface ToolResponse {
  answer: string;
  chunks?: Chunk[];
  toolUsed: Tool;
  logs: string[];
}

// Calculate function for the calculator tool
function calculate(expression: string): number {
  // This is a very simple calculator that handles basic operations
  // WARNING: Using eval is generally not safe for user input
  // In a production environment, use a proper math expression parser
  try {
    // Basic sanitization - only allow numbers and basic operators
    if (!/^[0-9+\-*/(). ]+$/.test(expression)) {
      throw new Error('Invalid expression');
    }
    
    // eslint-disable-next-line no-eval
    return eval(expression);
  } catch (error) {
    console.error('Calculation error:', error);
    throw new Error('Could not calculate the expression');
  }
}

// Simple dictionary definitions
const dictionary: Record<string, string> = {
  "rag": "Retrieval-Augmented Generation, a technique that enhances LLM responses with external knowledge.",
  "llm": "Large Language Model, an AI model trained to understand and generate human language.",
  "agent": "In AI, a system that can perceive its environment and take actions to achieve goals.",
  "vector": "A mathematical entity with magnitude and direction, used in ML to represent data in space.",
  "embedding": "A vector representation of text that captures semantic meaning for ML models."
};

// Tool definitions
const tools: ToolDefinition[] = [
  {
    name: 'calculator',
    description: 'Calculates mathematical expressions',
    keywords: ['calculate', 'compute', 'sum', 'add', 'subtract', 'multiply', 'divide', 'math'],
    execute: async (query: string) => {
      const logs: string[] = [`Calculator tool selected for query: ${query}`];
      
      // Extract mathematical expression
      const expressionMatch = query.match(/calculate\s+(.+)$/) || 
                             query.match(/compute\s+(.+)$/) || 
                             query.match(/what is\s+(.+)\?/);
      
      if (!expressionMatch) {
        logs.push('No valid expression found in the query');
        return {
          answer: "I couldn't identify a mathematical expression to calculate. Please provide a clearer expression.",
          toolUsed: 'calculator',
          logs
        };
      }
      
      const expression = expressionMatch[1];
      logs.push(`Extracted expression: ${expression}`);
      
      try {
        const result = calculate(expression);
        logs.push(`Calculated result: ${result}`);
        
        return {
          answer: `The result of ${expression} is ${result}.`,
          toolUsed: 'calculator',
          logs
        };
      } catch (error) {
        logs.push(`Calculation error: ${error instanceof Error ? error.message : String(error)}`);
        return {
          answer: `I couldn't calculate that expression. Please check the format and try again.`,
          toolUsed: 'calculator',
          logs
        };
      }
    }
  },
  {
    name: 'dictionary',
    description: 'Looks up definitions of terms',
    keywords: ['define', 'meaning', 'what is', 'definition'],
    execute: async (query: string) => {
      const logs: string[] = [`Dictionary tool selected for query: ${query}`];
      
      // Extract the term to define
      const termMatch = query.match(/define\s+(.+)$/i) || 
                       query.match(/what\s+is\s+(?:a|an|the)?\s*(.+?)\?*/i) || 
                       query.match(/meaning\s+of\s+(.+)$/i);
      
      if (!termMatch) {
        logs.push('No term found to define in the query');
        return {
          answer: "I couldn't identify a term to define. Please specify what you'd like me to define.",
          toolUsed: 'dictionary',
          logs
        };
      }
      
      const term = termMatch[1].toLowerCase().trim().replace(/[.,?!;:]+$/, '');
      logs.push(`Looking up definition for: "${term}"`);
      
      // Try to find the term in our dictionary
      if (term in dictionary) {
        logs.push(`Definition found for "${term}"`);
        return {
          answer: `${term}: ${dictionary[term]}`,
          toolUsed: 'dictionary',
          logs
        };
      } else {
        logs.push(`No definition found for "${term}"`);
        return {
          answer: `I don't have a definition for "${term}" in my dictionary.`,
          toolUsed: 'dictionary',
          logs
        };
      }
    }
  },
  {
    name: 'rag',
    description: 'Retrieves information and generates an answer',
    keywords: [], // Default tool when no other tool matches
    execute: async (query: string, vectorStore?: VectorStore) => {
      if (!vectorStore) {
        throw new Error('Vector store is required for RAG tool');
      }
      
      const logs: string[] = [`RAG tool selected for query: ${query}`];
      
      // Retrieve relevant chunks
      logs.push('Retrieving relevant document chunks...');
      const relevantChunks = vectorStore.search(query, 3);
      logs.push(`Retrieved ${relevantChunks.length} relevant chunks`);
      
      // In a real application, you would use an actual LLM here
      // This is a mock implementation
      const combinedContext = relevantChunks.map(chunk => chunk.text).join('\n\n');
      logs.push('Generating answer based on retrieved context...');
      
      // Mock LLM response generation
      const answer = generateMockAnswer(query, combinedContext);
      logs.push('Answer generated successfully');
      
      return {
        answer,
        chunks: relevantChunks,
        toolUsed: 'rag',
        logs
      };
    }
  }
];

// Function to generate a mock answer (in a real app, this would be an LLM call)
function generateMockAnswer(query: string, context: string): string {
  if (context.length === 0) {
    return "I don't have enough information to answer that question.";
  }
  
  // Very simple mock response generation
  // In a real application, you would call an LLM API here
  const shortContext = context.substring(0, 100);
  return `Based on the information I have, I can tell you that ${shortContext}... [This is where a real LLM would generate a complete answer based on the context].`;
}

// Agent service to route queries to the appropriate tool
export async function routeQuery(query: string, vectorStore: VectorStore): Promise<ToolResponse> {
  const logs: string[] = [`Processing query: "${query}"`];
  
  // Determine which tool to use based on query keywords
  for (const tool of tools) {
    if (tool.name === 'rag') continue; // Skip RAG tool in keyword matching (it's our fallback)
    
    const keywordMatch = tool.keywords.some(keyword => 
      query.toLowerCase().includes(keyword.toLowerCase())
    );
    
    if (keywordMatch) {
      logs.push(`Matched keywords for ${tool.name} tool`);
      const response = await tool.execute(query);
      return {
        ...response,
        logs: [...logs, ...response.logs]
      };
    }
  }
  
  // If no tool matched, use RAG
  logs.push('No specific tool matched, using RAG pipeline');
  const ragTool = tools.find(tool => tool.name === 'rag');
  
  if (!ragTool) {
    throw new Error('RAG tool not found');
  }
  
  const response = await ragTool.execute(query, vectorStore);
  return {
    ...response,
    logs: [...logs, ...response.logs]
  };
}
