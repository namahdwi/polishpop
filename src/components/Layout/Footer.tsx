import { Link } from 'react-router-dom';
import { socialMediaProfiles } from '../SEO/LocalSEO';
import { useState } from 'react';
import ContactUsModal from '../CustomerSupport/ContactUsModal';

export default function Footer() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              About Us
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  Our Story
                </Link>
              </li>
              <li>
                <Link to="/locations" className="text-base text-gray-500 hover:text-gray-900">
                  Locations
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <button 
                  onClick={() => setShowContactModal(true)}
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <Link to="/faq" className="text-base text-gray-500 hover:text-gray-900">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Legal
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-600 tracking-wider uppercase">
              Social Media
            </h3>
            <ul className="mt-4 space-y-4">
              {socialMediaProfiles.map((profile: { platform: string; url: string }) => (
                <li key={profile.platform}>
                  <a 
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-gray-500 hover:text-gray-900"
                  >
                    {String(profile.platform)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ContactUsModal 
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </footer>
  );
} 