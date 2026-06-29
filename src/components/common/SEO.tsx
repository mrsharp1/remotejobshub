import React, { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  canonicalUrl?: string
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
}) => {
  useEffect(() => {
    // Dynamic page title
    document.title = `${title} | Remote Jobs Hub`

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      description ||
        'The premium marketplace to buy and sell verified remote listings, contracts, and digital workflows.'
    )

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', canonicalUrl || window.location.href)
  }, [title, description, canonicalUrl])

  return null
}
export default SEO
