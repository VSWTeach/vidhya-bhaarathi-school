import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, image }) => {
  const siteTitle = "Vidya Bharati Public School | Premier CBSE School in Delhi";
  const defaultDescription = "Vidya Bharati Public School - Premier CBSE school in New Delhi providing quality education since 1995. State-of-the-art campus, experienced faculty, and holistic development.";
  const defaultKeywords = "Vidya Bharati Public School, CBSE School, Best School in Delhi, Education, School Admission, Delhi School";
  const siteUrl = "https://www.vidyabharati.edu.in";
  const defaultImage = "/logo512.png";

  const fullTitle = title ? `${title} | Vidya Bharati Public School` : siteTitle;
  const metaDescription = description || defaultDescription;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || defaultImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="Vidya Bharati Public School" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Vidya Bharati Public School" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={siteUrl} />
      
      {/* Schema.org markup */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": "Vidya Bharati Public School",
          "alternateName": "VBPS",
          "url": siteUrl,
          "logo": "https://www.vidyabharati.edu.in/logo512.png",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Education Street, Civil Lines",
            "addressLocality": "New Delhi",
            "addressRegion": "Delhi",
            "postalCode": "110001",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-1234567890",
            "contactType": "admissions",
            "areaServed": "IN"
          },
          "sameAs": [
            "https://facebook.com/vidyabharati",
            "https://twitter.com/vidyabharati",
            "https://instagram.com/vidyabharati"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
