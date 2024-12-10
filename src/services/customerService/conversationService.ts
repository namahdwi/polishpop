import { OpenAI } from 'openai';
import { CustomerQuery } from '../../types';
import { captureError } from '../../utils/errorTracking';
import { db } from '../../lib/firebase';
import { addDoc, getDocs, limit, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { collection } from 'firebase/firestore';


interface ConversationMessage {
  id: string;
  customerPhone: string;
  message: string;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
}

export class ConversationService {
  private static instance: ConversationService;
  private openai: OpenAI;

  private constructor() {
    this.openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY
    });
  }

  static getInstance(): ConversationService {
    if (!this.instance) {
      this.instance = new ConversationService();
    }
    return this.instance;
  }

  async analyzeIntent(query: CustomerQuery): Promise<{
    intent: string;
    confidence: number;
    suggestedResponse?: string;
  }> {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a customer service assistant. Analyze the customer query and determine the intent. Respond with JSON in the format: {\"intent\": string, \"confidence\": number, \"suggestedResponse\": string}"
          },
          {
            role: "user",
            content: query.message
          }
        ],
        model: "gpt-3.5-turbo",
      });

      const content = completion.choices[0].message.content;
      
      if (!content) {
        return {
          intent: 'unknown',
          confidence: 0,
          suggestedResponse: 'I apologize, but I am unable to process your request at the moment.'
        };
      }

      try {
        const analysis = JSON.parse(content);
        return {
          intent: analysis.intent || 'unknown',
          confidence: analysis.confidence || 0,
          suggestedResponse: analysis.suggestedResponse
        };
      } catch (parseError) {
        captureError(parseError as Error, {
          context: 'JSON Parse in Intent Analysis',
          content
        });
        return {
          intent: 'parse_error',
          confidence: 0,
          suggestedResponse: 'I apologize, but I am having trouble understanding your request.'
        };
      }
    } catch (error) {
      captureError(error as Error, {
        context: 'Conversation Intent Analysis',
        query: query.message
      });
      throw error;
    }
  }

  async saveMessage(message: Omit<ConversationMessage, 'id'>): Promise<ConversationMessage> {
    try {
      const docRef = await addDoc(collection(db, 'conversations'), {
        customerPhone: message.customerPhone,
        message: message.message,
        direction: message.direction,
        timestamp: Timestamp.fromDate(message.timestamp),
      });
  
      return {
        id: docRef.id,
        ...message
      };
    } catch (error) {
      captureError(error as Error, { context: 'Save Conversation Message' });
      throw error;
    }
  }
  
  async getConversationHistory(customerPhone: string, maxResults = 10): Promise<ConversationMessage[]> {
    try {
      const q = query(
        collection(db, 'conversations'),
        where('customerPhone', '==', customerPhone),
        orderBy('timestamp', 'desc'),
        limit(maxResults)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ConversationMessage[];
    } catch (error) {
      captureError(error as Error, { context: 'Get Conversation History' });
      throw error;
    }
  }
} 