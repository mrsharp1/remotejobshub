export const siteConfig = {
  name: 'Remote Jobs Hub',
  description: 'Production-ready Remote Jobs Hub SaaS Marketplace',
  version: '1.0.0',
  environment: import.meta.env.MODE || 'development',
  contactEmail: 'support@remotejobshub.com',
  socialLinks: {
    twitter: 'https://twitter.com/remotejobshub',
    github: 'https://github.com/remotejobshub',
    linkedin: 'https://linkedin.com/company/remotejobshub',
  },
}
export type SiteConfig = typeof siteConfig