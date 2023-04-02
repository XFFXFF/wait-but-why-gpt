import fs from 'fs/promises';
import { CharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { PineconeStore } from 'langchain/vectorstores';
import { PineconeClient } from '@pinecone-database/pinecone';
import { Document } from 'langchain/document';

// Define data format interface
interface IData {
  title: string;
  date: string;
  url: string;
  content: string;
}

// Assume data is in the following format:
// title: <title>
// date: <date>
// url: <url>
// <content>
function processData(data: string): IData {
  // Split data into lines and extract the different fields
  const [titleLine, dateLine, urlLine, ...contentLines] = data.trim().split('\n');
  return {
    title: titleLine.substring(7),
    date: dateLine.substring(6),
    url: urlLine.substring(5),
    content: contentLines.join('\n'),
  };
}

// Main program
(async () => {
  try {
    console.log('Starting script...')
    console.log(`OpenAI base path: ${process.env.OPENAI_BASE_PATH || ''}`)
    console.log(`Pinecone API key: ${process.env.PINECONE_API_KEY || ''}`)
    console.log(`OpenAI API key: ${process.env.OPENAI_API_KEY || ''}`)

    // Read data file
    const data = await fs.readFile('scripts/example.txt', 'utf-8');
    
    // Parse data
    const result = processData(data);

    // Initialize text splitter and embedding model
    const textSplitter = new CharacterTextSplitter({ chunkSize: 300, separator: '\n' });
    const embeddings = new OpenAIEmbeddings({}, { basePath: process.env.OPENAI_BASE_PATH || '' });

    // Initialize Pinecone client and bind to corresponding index
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: 'us-central1-gcp',
      apiKey: process.env.PINECONE_API_KEY || '',
    });
    const indexName = 'zhangxiaoyu';
    const index = pinecone.Index(indexName);
    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });

    // Split text into multiple pages and add them to the index
    const documents = await textSplitter.splitText(result.content);
    for (let i = 0; i < documents.length; i++) {
      console.log(`Adding document ${i} to index ${indexName}`);

      // Create a new document object and add it to the vector store
      const document = new Document({
        pageContent: documents[i],
        metadata: {
          title: result.title,
          date: result.date,
          url: result.url,
        },
      });
      await vectorStore.addDocuments([document]);
    }

    console.log(`Indexed ${documents.length} documents in index ${indexName}`);
  } catch (err) {
    console.error(err);
  }
})();