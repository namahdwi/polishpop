import { Helmet } from 'react-helmet-async';
import type { NailDesign } from '../../types';

interface ProductSchemaProps {
  product: NailDesign;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  // Helper function to determine availability
  const getAvailability = (stockStatus: NailDesign['stockStatus']): string => {
    switch (stockStatus.status) {
      case 'IN_STOCK':
        return 'https://schema.org/InStock';
      case 'OUT_OF_STOCK':
        return 'https://schema.org/OutOfStock';
      case 'PRE_ORDER':
        return 'https://schema.org/PreOrder';
      default:
        return 'https://schema.org/OutOfStock';
    }
  };

  // Helper function to format price
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  // Calculate aggregate rating if reviews exist
  const aggregateRating = product.reviews?.length ? {
    "@type": "AggregateRating",
    "ratingValue": (product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length).toFixed(1),
    "reviewCount": product.reviews.length
  } : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.imageUrls,
    "sku": product.id,
    "mpn": `PP-${product.id}`, // Manufacturer Part Number
    "brand": {
      "@type": "Brand",
      "name": "PolishPop",
      "logo": "https://polishpop.com/logo.png"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": `https://polishpop.com/product/${product.id}`,
      "priceCurrency": "IDR",
      "price": formatPrice(product.price),
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "availability": getAvailability(product.stockStatus),
      "seller": {
        "@type": "Organization",
        "name": "PolishPop Indonesia",
        "url": "https://polishpop.com"
      },
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "IDR"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "ID"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "3",
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "5",
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(aggregateRating && { aggregateRating }),
    "review": product.reviews?.map(review => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "author": {
        "@type": "Person",
        "name": review.authorName
      },
      "reviewBody": review.content,
      "datePublished": review.createdAt
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
} 