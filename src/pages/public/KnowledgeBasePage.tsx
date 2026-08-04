import React, { useEffect, useState } from 'react'
import { BookOpen, Clock, Download, Share2, ChevronRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

export const KnowledgeBasePage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('account-delivery')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const menuItems = [
    { id: 'remote-job-guide', label: 'Remote Job Guide' },
    { id: 'beginner-guide', label: 'Beginner Guide' },
    { id: 'account-delivery', label: 'Account Delivery Guide' },
    { id: 'proxy-guide', label: 'Proxy Guide' },
    { id: 'vpn-guide', label: 'VPN Guide' },
    { id: 'escrow-guide', label: 'Escrow Guide' },
    { id: 'buyer-guide', label: 'Buyer Guide' },
    { id: 'seller-guide', label: 'Seller Guide' },
  ]

  return (
    <div className="min-h-screen bg-background pt-20 flex">
      {/* Sidebar Navigation */}
      <aside className="w-80 hidden lg:block border-r border-border h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-6">
          <Link to="/help" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 mb-8 font-medium">
            <ChevronRight className="w-4 h-4 rotate-180" /> Back to Help Center
          </Link>
          <h3 className="font-bold font-heading mb-4 text-sm tracking-wider uppercase text-muted-foreground">Documentation</h3>
          <nav className="space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeMenu === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <FileText className="w-4 h-4" /> {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl px-8 py-12">
        <div className="mb-8 flex items-center gap-4 text-sm text-muted-foreground">
          <Link to="/help" className="hover:text-primary transition-colors">Help Center</Link>
          <ChevronRight className="w-4 h-4" />
          <span>Documentation</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Account Delivery Guide</span>
        </div>

        <div className="flex items-center justify-between mb-8 pb-8 border-b border-border">
          <div>
            <h1 className="text-4xl font-bold font-heading mb-4">Account Delivery Guide</h1>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 5 min read</span>
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Last updated: Oct 12, 2026</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Download PDF">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 border rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Share Article">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Prose Content (Simulated rich text) */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <p className="lead">
            Receiving a purchased remote work account requires strict adherence to security protocols to ensure the account doesn't get flagged by the platform. Follow this guide precisely.
          </p>

          <h2>1. Preparation Before Login</h2>
          <p>Before you even attempt to log into the purchased account, you must prepare your technical environment.</p>
          <ul>
            <li><strong>Clear Cookies:</strong> Use a brand new browser profile (e.g. Chrome Profile or Firefox Container) specifically for this account.</li>
            <li><strong>VPN/Proxy:</strong> Ensure your IP address matches the country listed on the account. Never log into a US account with an Asian IP address on day one.</li>
            <li><strong>Check Connections:</strong> Go to <a href="https://whatismyipaddress.com">whatismyipaddress.com</a> to verify your location.</li>
          </ul>

          <div className="bg-amber-500/10 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
            <p className="m-0 text-amber-700 dark:text-amber-400 font-medium">
              <strong>Warning:</strong> Logging in without a proper VPN/Proxy is the #1 reason accounts get banned immediately. Remote Jobs Hub Escrow will not refund accounts banned due to buyer negligence.
            </p>
          </div>

          <h2>2. The First Login</h2>
          <p>When the seller provides the credentials in the Escrow chat, log in carefully.</p>
          <ol>
            <li>Navigate directly to the platform (e.g. Upwork.com, Fiverr.com).</li>
            <li>Enter the provided username and password.</li>
            <li>If a 2FA code is required, request it from the seller in the Escrow chat.</li>
          </ol>

          <h2>3. Securing the Account (Crucial)</h2>
          <p>Once inside, you must immediately secure the account so the seller cannot recover it.</p>
          <ul>
            <li>Change the recovery email address to an email you control.</li>
            <li>Change the account password.</li>
            <li>Update the security questions.</li>
            <li>If applicable, change the phone number (use a virtual number matching the account's country).</li>
          </ul>

          <h2>4. Escrow Release</h2>
          <p>Only after you have completed all security steps and verified the account matches the listing description should you click "Release Funds" in your Buyer Dashboard.</p>
        </article>

        {/* Footer Actions */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between">
          <div className="text-sm font-medium">Was this article helpful?</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium transition-colors">Yes</button>
            <button className="px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium transition-colors">No</button>
          </div>
        </div>
      </main>

      {/* Table of Contents (Right Sidebar) */}
      <aside className="w-64 hidden xl:block p-8 border-l border-border h-[calc(100vh-5rem)] sticky top-20">
        <h4 className="font-bold text-sm tracking-wider uppercase text-muted-foreground mb-4">On this page</h4>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li><a href="#" className="hover:text-primary transition-colors">1. Preparation Before Login</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">2. The First Login</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">3. Securing the Account</a></li>
          <li><a href="#" className="hover:text-primary transition-colors">4. Escrow Release</a></li>
        </ul>
      </aside>
    </div>
  )
}
