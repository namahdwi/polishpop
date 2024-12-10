import { logEvent } from 'firebase/analytics';
import { analytics } from '../lib/firebase';

interface ShareContent {
  title: string;
  description: string;
  image: string;
  url: string;
}

export class SocialMediaService {
  static async shareToWhatsApp(content: ShareContent) {
    const text = `${content.title}\n\n${content.description}\n\nLihat di: ${content.url}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    
    logEvent(analytics, 'share', {
      method: 'whatsapp',
      content_type: 'product',
      item_id: content.url
    });

    window.open(whatsappUrl, '_blank');
  }

  static async shareToInstagram(content: ShareContent) {
    // Instagram sharing logic (usually through their API)
    logEvent(analytics, 'share', {
      method: 'instagram',
      content_type: 'product',
      item_id: content.url
    });
  }

  static async shareToTikTok(content: ShareContent) {
    // TikTok sharing logic
    logEvent(analytics, 'share', {
      method: 'tiktok',
      content_type: 'product',
      item_id: content.url
    });
  }
}

// Social Media Share Buttons Component
export function SocialShareButtons({ content }: { content: ShareContent }) {
  return (
    <div className="flex space-x-4">
      <button 
        onClick={() => SocialMediaService.shareToWhatsApp(content)}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Share ke WhatsApp
      </button>
      <button 
        onClick={() => SocialMediaService.shareToInstagram(content)}
        className="bg-purple-500 text-white px-4 py-2 rounded-lg"
      >
        Share ke Instagram
      </button>
      <button 
        onClick={() => SocialMediaService.shareToTikTok(content)}
        className="bg-black text-white px-4 py-2 rounded-lg"
      >
        Share ke TikTok
      </button>
    </div>
  );
} 