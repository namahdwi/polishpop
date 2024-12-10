import { Helmet } from 'react-helmet-async';

interface City {
  city: string;
  regions: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  address: {
    street: string;
    postalCode: string;
    phone: string;
  };
}

const majorCities: City[] = [
  {
    city: 'Jakarta',
    regions: [
      'Jakarta Selatan',
      'Jakarta Pusat',
      'Jakarta Barat',
      'Jakarta Timur',
      'Jakarta Utara'
    ],
    coordinates: {
      latitude: -6.2088,
      longitude: 106.8456
    },
    address: {
      street: 'Jl. Sudirman No. 123',
      postalCode: '12190',
      phone: '+62-21-5555-5555'
    }
  },
  {
    city: 'Surabaya',
    regions: [
      'Surabaya Pusat',
      'Surabaya Timur',
      'Surabaya Barat',
      'Surabaya Utara',
      'Surabaya Selatan'
    ],
    coordinates: {
      latitude: -7.2575,
      longitude: 112.7521
    },
    address: {
      street: 'Jl. Pemuda No. 456',
      postalCode: '60271',
      phone: '+62-31-5555-5555'
    }
  },
  {
    city: 'Bandung',
    regions: [
      'Bandung Kota',
      'Cimahi',
      'Lembang',
      'Dago',
      'Buah Batu'
    ],
    coordinates: {
      latitude: -6.9175,
      longitude: 107.6191
    },
    address: {
      street: 'Jl. Asia Afrika No. 789',
      postalCode: '40111',
      phone: '+62-22-5555-5555'
    }
  },
  {
    city: 'Medan',
    regions: [
      'Medan Kota',
      'Medan Selayang',
      'Medan Sunggal',
      'Medan Helvetia'
    ],
    coordinates: {
      latitude: 3.5952,
      longitude: 98.6722
    },
    address: {
      street: 'Jl. Putri Hijau No. 234',
      postalCode: '20111',
      phone: '+62-61-5555-5555'
    }
  },
  {
    city: 'Semarang',
    regions: [
      'Semarang Tengah',
      'Semarang Barat',
      'Semarang Timur',
      'Semarang Selatan'
    ],
    coordinates: {
      latitude: -6.9932,
      longitude: 110.4203
    },
    address: {
      street: 'Jl. Pandanaran No. 567',
      postalCode: '50134',
      phone: '+62-24-5555-5555'
    }
  }
];

interface SocialMedia {
  platform: string;
  url: string;
}

export const socialMediaProfiles: SocialMedia[] = [
  {
    platform: 'Instagram',
    url: 'https://instagram.com/polishpop.id'
  },
  {
    platform: 'Facebook',
    url: 'https://facebook.com/polishpop.id'
  },
  {
    platform: 'Twitter',
    url: 'https://twitter.com/polishpop_id'
  }
];

export function LocalSEO() {
  // Generate location data for each city
  const locations = majorCities.map(city => ({
    "@type": "LocalBusiness",
    "name": `PolishPop ${city.city}`,
    "@id": `https://polishpop.id/locations/${city.city.toLowerCase()}`,
    "url": `https://polishpop.id/locations/${city.city.toLowerCase()}`,
    "telephone": city.address.phone,
    "priceRange": "Rp50.000 - Rp500.000",
    "image": [
      `https://polishpop.id/images/stores/${city.city.toLowerCase()}-1.jpg`,
      `https://polishpop.id/images/stores/${city.city.toLowerCase()}-2.jpg`
    ],
    "address": {
      "@type": "PostalAddress",
      "streetAddress": city.address.street,
      "addressLocality": city.city,
      "addressRegion": city.city,
      "postalCode": city.address.postalCode,
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": city.coordinates.latitude,
      "longitude": city.coordinates.longitude
    },
    "areaServed": city.regions.map(_region => ({
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": city.coordinates.latitude,
        "longitude": city.coordinates.longitude
      },
      "geoRadius": "20000"
    })),
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "09:00",
        "closes": "21:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Saturday",
          "Sunday"
        ],
        "opens": "10:00",
        "closes": "22:00"
      }
    ],
    "sameAs": socialMediaProfiles.map(profile => profile.url)
  }));

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "name": "PolishPop Indonesia",
    "alternateName": "PolishPop ID",
    "url": "https://polishpop.id",
    "logo": "https://polishpop.id/logo.png",
    "image": "https://polishpop.id/storefront.jpg",
    "description": "PolishPop adalah salon kecantikan modern yang menyediakan layanan perawatan kuku profesional dengan standar kualitas tertinggi di Indonesia.",
    "foundingDate": "2020",
    "founders": [
      {
        "@type": "Person",
        "name": "Founder Name"
      }
    ],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+62-21-5555-5555",
        "contactType": "customer service",
        "areaServed": "ID",
        "availableLanguage": ["id", "en"],
        "contactOption": "TollFree",
        "hoursAvailable": "Mo-Su 09:00-21:00"
      },
      {
        "@type": "ContactPoint",
        "telephone": "+62-811-1234-5678",
        "contactType": "sales",
        "areaServed": "ID",
        "availableLanguage": ["id", "en"],
        "contactOption": "HearingImpairedSupported"
      }
    ],
    "sameAs": socialMediaProfiles.map(profile => profile.url),
    "location": locations,
    "potentialAction": {
      "@type": "ReserveAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://polishpop.id/book",
        "inLanguage": "id",
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/IOSPlatform",
          "http://schema.org/AndroidPlatform"
        ]
      },
      "result": {
        "@type": "Reservation",
        "name": "Nail Service Booking"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    },
    "priceRange": "Rp50.000 - Rp500.000",
    "currenciesAccepted": "IDR",
    "paymentAccepted": "Cash, Credit Card, Debit Card, Bank Transfer, Digital Wallet",
    "areaServed": {
      "@type": "Country",
      "name": "Indonesia"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
    </Helmet>
  );
} 