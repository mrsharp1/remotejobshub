import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ConversationLayoutProps {
  sidebarOpen: boolean
  leftPanel: React.ReactNode
  centerPanel: React.ReactNode
  rightPanel?: React.ReactNode
  hasActiveId?: boolean
}

export const ConversationLayout: React.FC<ConversationLayoutProps> = ({
  sidebarOpen,
  leftPanel,
  centerPanel,
  rightPanel,
  hasActiveId = false,
}) => {
  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* Left Panel: Conversation List */}
      <div className={`${hasActiveId ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-shrink-0 border-r border-border flex-col lg:w-96`}>
        {leftPanel}
      </div>

      {/* Center Panel: Chat Area */}
      <div className={`${hasActiveId ? 'flex' : 'hidden md:flex'} flex-1 flex-col overflow-hidden relative`}>
        {centerPanel}
      </div>

      {/* Right Panel: Context Sidebar */}
      <AnimatePresence>
        {sidebarOpen && rightPanel && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="hidden flex-shrink-0 border-l border-border xl:flex xl:flex-col overflow-hidden"
          >
            <div className="w-[320px] h-full flex flex-col">
              {rightPanel}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
