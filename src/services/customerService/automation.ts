import { WhatsAppService } from './whatsapp';
import { OrderStatus, CustomerQuery } from '../../types';
import { captureError } from '../../utils/errorTracking';
import { CustomerSupportQueue } from './queueService';
import { ConversationService } from './conversationService';
import { RateLimiter } from '../../middleware/rateLimiting';
import { Security } from '../../utils/security';
import { RateLimitError } from '../../utils/errors';

export class CustomerServiceAutomation {
  private static instance: CustomerServiceAutomation;
  private whatsapp: WhatsAppService;
  private queue: CustomerSupportQueue;
  private conversation: ConversationService;
  private readonly MAX_RETRIES = 3;
  private rateLimiter: RateLimiter;

  private constructor() {
    this.whatsapp = WhatsAppService.getInstance();
    this.queue = CustomerSupportQueue.getInstance();
    this.conversation = ConversationService.getInstance();
    this.rateLimiter = new RateLimiter({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100 // limit each phone to 100 requests per windowMs
    });
  }

  static getInstance(): CustomerServiceAutomation {
    if (!this.instance) {
      this.instance = new CustomerServiceAutomation();
    }
    return this.instance;
  }

  async handleOrderStatusUpdate(params: {
    orderId: string;
    status: OrderStatus;
    customer: {
      phone: string;
      name: string;
    };
    trackingNumber?: string;
  }, retryCount = 0): Promise<void> {
    try {
      const templates: Record<OrderStatus, string> = {
        [OrderStatus.PROCESSING]: 'orderProcessing',
        [OrderStatus.SHIPPED]: 'orderShipped',
        [OrderStatus.DELIVERED]: 'orderDelivered'
      };

      const template = templates[params.status];
      if (!template) {
        throw new Error(`No template found for status: ${params.status}`);
      }

      const templateParams = {
        customerName: params.customer.name,
        orderId: params.orderId,
        ...(params.trackingNumber && { trackingNumber: params.trackingNumber })
      };

      await this.whatsapp.sendTemplate({
        to: params.customer.phone,
        template,
        params: templateParams
      });
    } catch (error) {
      if (retryCount < this.MAX_RETRIES) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        return this.handleOrderStatusUpdate(params, retryCount + 1);
      }
      captureError(error as Error, {
        context: 'Order Status Update Automation',
        orderId: params.orderId,
        status: params.status
      });
      throw error;
    }
  }

  async handleCustomerQuery(query: CustomerQuery): Promise<void> {
    try {
      // Check rate limit
      await this.rateLimiter.checkLimit(query.customer.phone);

      // Encrypt sensitive data
      const encryptedPhone = Security.encrypt(query.customer.phone);
      
      // Save incoming message
      await this.conversation.saveMessage({
        customerPhone: encryptedPhone,
        message: query.message,
        direction: 'inbound',
        timestamp: new Date(),
      });

      // Analyze intent using NLP
      const analysis = await this.conversation.analyzeIntent(query);
      
      if (analysis.confidence > 0.8) {
        const response = await this.handleAutomatedResponse(query, analysis);
        await this.conversation.saveMessage({
          customerPhone: encryptedPhone,
          message: response,
          direction: 'outbound',
          timestamp: new Date(),
        });
      } else {
        await this.escalateToHuman(query);
      }
    } catch (error) {
      if (error instanceof RateLimitError) {
        await this.handleRateLimitExceeded(query);
        return;
      }
      captureError(error as Error, {
        context: 'Customer Query Handling',
        queryId: query.orderId
      });
      await this.escalateToHuman(query);
    }
  }

  private async handleAutomatedResponse(
    query: CustomerQuery,
    analysis: { intent: string; confidence: number; suggestedResponse?: string }
  ): Promise<string> {
    const response = analysis.suggestedResponse || this.getDefaultResponse(analysis.intent);
    
    await this.whatsapp.sendMessage({
      to: query.customer.phone,
      message: response
    });

    return response;
  }

  private getDefaultResponse(intent: string): string {
    const defaultResponses: Record<string, string> = {
      'order_status': 'I can help you check your order status. Please provide your order number.',
      'product_inquiry': 'I can help you with product information. What would you like to know?',
      'general_help': 'How may I assist you today?',
      'default': 'I understand you need help. Let me connect you with our support team.'
    };

    return defaultResponses[intent] || defaultResponses.default;
  }

  private async escalateToHuman(query: CustomerQuery): Promise<void> {
    try {
      await this.queue.addToQueue(query);
      
      const message = "We've received your query and a customer service representative will assist you shortly.";
      await this.whatsapp.sendMessage({
        to: query.customer.phone,
        message
      });

      await this.conversation.saveMessage({
        customerPhone: query.customer.phone,
        message,
        direction: 'outbound',
        timestamp: new Date(),
      });
    } catch (error) {
      captureError(error as Error, {
        context: 'Query Escalation',
        queryId: query.orderId
      });
      throw error;
    }
  }

  private async handleRateLimitExceeded(query: CustomerQuery): Promise<void> {
    await this.whatsapp.sendMessage({
      to: query.customer.phone,
      message: "We're experiencing high volume. Please try again in a few minutes."
    });
  }
} 