
import { Document } from './vectorStore';

export const sampleDocuments: Document[] = [
  {
    id: 'doc_1',
    text: `# What is RAG (Retrieval-Augmented Generation)?

Retrieval-Augmented Generation (RAG) is an AI framework that enhances large language model (LLM) outputs by retrieving relevant information from external sources before generating responses.

## Key Components of RAG

1. **Retrieval System**: Searches for relevant documents or information from a knowledge base
2. **Vector Database**: Stores document embeddings for efficient similarity search
3. **Large Language Model**: Generates coherent responses based on the retrieved information

## Benefits of RAG

- Improves factual accuracy by grounding responses in retrieved information
- Reduces hallucination compared to standard LLM responses
- Enables access to domain-specific or proprietary information
- Can be updated without retraining the underlying language model

RAG is particularly useful for question-answering systems, chatbots, and any application where factual accuracy is important.`,
    metadata: {
      title: 'RAG Overview',
      source: 'Sample Document'
    }
  },
  {
    id: 'doc_2',
    text: `# Multi-Agent Systems in AI

A multi-agent system (MAS) is a computerized system composed of multiple interacting intelligent agents within an environment. These systems can solve problems that are difficult or impossible for an individual agent to solve.

## Key Characteristics

1. **Autonomy**: Agents operate without direct human intervention and have control over their actions
2. **Social Ability**: Agents interact with other agents via agent-communication languages
3. **Reactivity**: Agents perceive their environment and respond to changes
4. **Proactivity**: Agents exhibit goal-directed behavior by taking initiative

## Applications

Multi-agent systems are used in:
- Task allocation and scheduling
- Collaborative problem solving
- Distributed information retrieval
- Simulation of complex systems
- Game theory and economic systems

## Agent Frameworks

Popular frameworks for implementing multi-agent systems include:
- JADE (Java Agent Development Framework)
- LangChain and LlamaIndex (for LLM-based agents)
- SPADE (Smart Python Agent Development Environment)
- MASON (Multi-Agent Simulator Of Neighborhoods)`,
    metadata: {
      title: 'Multi-Agent Systems',
      source: 'Sample Document'
    }
  },
  {
    id: 'doc_3',
    text: `# Vector Databases for RAG Systems

Vector databases are specialized database systems designed to store, index, and query high-dimensional vector representations (embeddings) of data. They are a critical component in modern Retrieval-Augmented Generation (RAG) systems.

## Popular Vector Databases

1. **Pinecone**: Fully managed vector database with simple API integration and real-time updates
2. **Weaviate**: Open-source vector search engine with GraphQL interface
3. **Milvus**: Open-source vector database for scalable similarity search
4. **Chroma**: Simple, embedded vector database designed specifically for RAG applications
5. **FAISS (Facebook AI Similarity Search)**: Library for efficient similarity search of dense vectors

## Key Features

- **Approximate Nearest Neighbor (ANN) algorithms**: Enable efficient similarity search in high dimensions
- **Vector indexing**: Methods like HNSW, IVF, and PQ that optimize search performance
- **Filtering capabilities**: Allow combining vector search with metadata filtering
- **Scalability**: Support for distributed architecture to handle large embedding collections

## Integration with RAG

In a RAG pipeline, vector databases:
1. Store document chunk embeddings
2. Perform fast similarity searches to find relevant context
3. Return the most semantically similar results to a query

The performance of vector search directly impacts the quality of retrieved context and, consequently, the generation quality of the RAG system.`,
    metadata: {
      title: 'Vector Databases',
      source: 'Sample Document'
    }
  }
];
