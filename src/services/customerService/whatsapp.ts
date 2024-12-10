import axios from 'axios';
import { captureError } from '../../utils/errorTracking';

interface WhatsAppTemplate {
  name: string;
  language: string;
  components: Array<{
    type: 'header' | 'body' | 'footer';
    parameters: Array<{
      type: 'text' | 'image' | 'document' | 'video';
      text?: string;
      image_url?: string;
      document_url?: string;
      video_url?: string;
    }>;
  }>;
}

interface MediaMessage {
  type: 'image' | 'document' | 'video';
  url: string;
  caption?: string;
  filename?: string;
}

interface MessageTracker {
  messageId: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: Date;
}

const TEMPLATES: Record<string, WhatsAppTemplate> = {
  orderConfirmation: {
    name: 'order_confirmation',
    language: 'id',
    components: [
      {
        type: 'header',
        parameters: [{ type: 'text', text: 'Konfirmasi Pesanan #{orderId}' }]
      },
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{customerName}' },
          { type: 'text', text: '{orderTotal}' }
        ]
      }
    ]
  },
  orderProcessing: {
    name: 'order_processing',
    language: 'id',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{customerName}' },
          { type: 'text', text: '{orderId}' }
        ]
      }
    ]
  },
  orderShipped: {
    name: 'order_shipped',
    language: 'id',
    components: [
      {
        type: 'body',
        parameters: [
          { type: 'text', text: '{customerName}' },
          { type: 'text', text: '{orderId}' },
          { type: 'text', text: '{trackingNumber}' }
        ]
      }
    ]
  }
};

export class WhatsAppService {
  private static instance: WhatsAppService;
  private baseUrl: string;
  private headers: Record<string, string>;

  private constructor() {
    this.baseUrl = `https://graph.facebook.com/v17.0/${import.meta.env.VITE_WHATSAPP_PHONE_ID}/messages`;
    this.headers = {
      'Authorization': `Bearer ${import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };
  }

  static getInstance(): WhatsAppService {
    if (!this.instance) {
      this.instance = new WhatsAppService();
    }
    return this.instance;
  }

  private replaceTemplateParams(text: string, params: Record<string, string>): string {
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, value),
      text
    );
  }

  async sendTemplate(params: {
    to: string;
    template: string;
    params: Record<string, string>;
  }) {
    try {
      const templateConfig = TEMPLATES[params.template];
      if (!templateConfig) {
        throw new Error(`Template ${params.template} not found`);
      }

      const components = templateConfig.components.map(comp => ({
        ...comp,
        parameters: comp.parameters.map(param => ({
          ...param,
          text: param.text ? this.replaceTemplateParams(param.text, params.params) : undefined
        }))
      }));

      await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: params.to,
          type: 'template',
          template: {
            name: templateConfig.name,
            language: { code: templateConfig.language },
            components
          }
        },
        { headers: this.headers }
      );
    } catch (error) {
      captureError(error as Error, {
        context: 'WhatsApp Template Message',
        template: params.template,
        recipient: params.to
      });
      throw error;
    }
  }

  async sendMessage(params: {
    to: string;
    message: string;
  }) {
    try {
      await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: params.to,
          type: 'text',
          text: { body: params.message }
        },
        { headers: this.headers }
      );
    } catch (error) {
      captureError(error as Error, {
        context: 'WhatsApp Direct Message',
        recipient: params.to
      });
      throw error;
    }
  }

  async sendMedia(params: {
    to: string;
    media: MediaMessage;
  }): Promise<void> {
    try {
      await axios.post(
        this.baseUrl,
        {
          messaging_product: 'whatsapp',
          to: params.to,
          type: params.media.type,
          [params.media.type]: {
            link: params.media.url,
            caption: params.media.caption,
            filename: params.media.filename,
          }
        },
        { headers: this.headers }
      );
    } catch (error) {
      captureError(error as Error, {
        context: 'WhatsApp Media Message',
        recipient: params.to,
        mediaType: params.media.type
      });
      throw error;
    }
  }

  async trackMessage(messageId: string): Promise<MessageTracker> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${messageId}`,
        { headers: this.headers }
      );
      
      return {
        messageId,
        status: response.data.status,
        timestamp: new Date()
      };
    } catch (error) {
      captureError(error as Error, {
        context: 'WhatsApp Message Tracking',
        messageId
      });
      throw error;
    }
  }
} 