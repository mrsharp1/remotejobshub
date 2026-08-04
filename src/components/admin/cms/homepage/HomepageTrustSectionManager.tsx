import React from 'react'

export const HomepageTrustSectionManager: React.FC = () => {
  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="font-heading text-lg font-bold">Trust Section Configuration</h3>
      <p className="text-sm text-muted-foreground">Manage the security and compliance logos displayed in the trust band.</p>
      
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
        Trust section is currently locked to enterprise compliance standards (AES-256, SOC 2 Type II, GDPR, ISO 27001). Customization will be available in a future release.
      </div>
    </div>
  )
}
