import React, { useState, useMemo } from 'react'
import { Search, MessageCircle, ShieldCheck, User as UserIcon } from 'lucide-react'
import { useUserDirectory } from '@/features/messaging/hooks'
import { conversationService } from '@/features/messaging/services'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

interface AdminUserDirectoryProps {
  onUserSelected: (conversationId: string) => void
  adminId: string
}

export const AdminUserDirectory: React.FC<AdminUserDirectoryProps> = ({ onUserSelected, adminId }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  const { data: users = [], isLoading } = useUserDirectory(searchQuery, roleFilter, sortBy)
  
  const queryClient = useQueryClient()
  const [messagingUser, setMessagingUser] = useState<string | null>(null)

  const handleMessage = async (userId: string) => {
    try {
      setMessagingUser(userId)
      const conv = await conversationService.createConversation('support', null, adminId, userId)
      if (conv && conv.id) {
        // Optimistically update the conversations cache so that AdminMessagesPage can find it
        queryClient.setQueryData(['conversations', adminId], (old: any) => {
          if (!old) return [conv]
          if (!old.find((c: any) => c.id === conv.id)) {
            return [conv, ...old]
          }
          return old
        })
        onUserSelected(conv.id)
      }
    } catch (err) {
      console.error('Failed to create/open conversation', err)
    } finally {
      setMessagingUser(null)
    }
  }

  // Memoize the user list to prevent unnecessary re-renders
  const memoizedUsers = useMemo(() => users, [users])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <h2 className="font-semibold text-lg">User Directory</h2>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm py-2 px-3"
          >
            <option value="all">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
            <option value="verified_seller">Verified Seller</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm py-2 px-3"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : memoizedUsers.length === 0 ? (
          <div className="text-center p-8 text-slate-500 text-sm">
            No users found.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {memoizedUsers.map(user => (
              <div key={user.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="relative">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${user.online ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {user.full_name || (user.email ? user.email.split('@')[0] : 'Unknown User')}
                      </h4>
                      {user.is_verified_seller && (
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleMessage(user.id)}
                    disabled={messagingUser === user.id}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 rounded-full transition-colors flex-shrink-0"
                    title="Message User"
                  >
                    {messagingUser === user.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MessageCircle className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
