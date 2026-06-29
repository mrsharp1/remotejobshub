# Production Release Checklist

Pre-flight checklist to verify security, performance, and integrations integrity.

- [x] **Secure Headers**: Verify HTTPS redirects and Content-Security-Policy (CSP) config.
- [x] **RLS Enforcement**: Ensure all tables have Row Level Security enabled.
- [x] **PWA Configuration**: Validate `site.webmanifest` assets and service workers cache loaders.
- [x] **SEO Foundation**: Verify `robots.txt` disallows dashboard pages and `sitemap.xml` references are accurate.
- [x] **Production Storage**: Verify target buckets (`listings`, `kyc-documents`, `avatars`) are set up in Supabase dashboard.
- [x] **Global Boundaries**: Confirm Error Boundary components wrap core routing.
