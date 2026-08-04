import React from 'react'
import { Plus, Edit2, Trash2, Columns, ShieldCheck, CreditCard } from 'lucide-react'

export const FooterBuilderPro: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Footer Builder Pro</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
          <Columns className="w-4 h-4" /> Add Column
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Column 1 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-bold">Platform</h3>
            <div className="flex gap-1">
              <button className="p-1 text-muted-foreground hover:text-primary"><Edit2 className="w-3 h-3" /></button>
              <button className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center justify-between group">
              <span>About Us</span>
              <button className="opacity-0 group-hover:opacity-100 p-1"><Edit2 className="w-3 h-3" /></button>
            </li>
            <li className="flex items-center justify-between group">
              <span>Careers</span>
              <button className="opacity-0 group-hover:opacity-100 p-1"><Edit2 className="w-3 h-3" /></button>
            </li>
          </ul>
          <button className="mt-4 w-full py-2 border border-dashed rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted">
            + Add Link
          </button>
        </div>

        {/* Column 2 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-bold">Legal</h3>
            <div className="flex gap-1">
              <button className="p-1 text-muted-foreground hover:text-primary"><Edit2 className="w-3 h-3" /></button>
              <button className="p-1 text-muted-foreground hover:text-destructive"><Trash2 className="w-3 h-3" /></button>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Refund Policy</li>
          </ul>
          <button className="mt-4 w-full py-2 border border-dashed rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted">
            + Add Link
          </button>
        </div>

        {/* Column 3 */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm col-span-2">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="font-bold">Trust & Security Badges</h3>
          </div>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium">SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/50">
              <CreditCard className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Stripe Partner</span>
            </div>
          </div>
          <button className="mt-4 w-full py-2 border border-dashed rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted flex items-center justify-center gap-2">
            <Plus className="w-3 h-3" /> Add Trust Badge
          </button>
        </div>
      </div>
    </div>
  )
}
