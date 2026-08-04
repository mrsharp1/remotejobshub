import React, { useState, useMemo } from 'react'
import { Folder, Image as ImageIcon, Video, FileText, Upload, Trash2, Search, Grid, List as ListIcon, FolderPlus, Copy, ArrowLeft } from 'lucide-react'
import { useCMSStore, CMSMediaItem } from '@/services/cms/cms.store'
import { toast } from 'sonner'

export const MediaLibraryPro: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentFolder, setCurrentFolder] = useState<string>('root')
  const { mediaLibrary, addMedia, deleteMedia } = useCMSStore()

  const folders = useMemo(() => {
    const uniqueFolders = new Set<string>()
    mediaLibrary.forEach(m => {
      if (m.folder && m.folder !== 'root') uniqueFolders.add(m.folder)
    })
    return Array.from(uniqueFolders)
  }, [mediaLibrary])

  const handleCreateFolder = () => {
    const folderName = prompt('Enter new folder name:')
    if (folderName && folderName.trim()) {
      // Just add a dummy media item to create the folder or we could track folders separately.
      // Since schema doesn't have a folder entity, we create an empty placeholder or just wait for upload.
      toast.success(`Folder '${folderName}' created. Upload a file to see it here.`)
      setCurrentFolder(folderName)
    }
  }

  const handleUpload = () => {
    const fileName = prompt('Enter fake file name (e.g. video.mp4, image.png):', `image-${Date.now()}.png`)
    if (!fileName) return
    
    let type: CMSMediaItem['type'] = 'image'
    if (fileName.endsWith('.mp4') || fileName.endsWith('.webm')) type = 'video'
    else if (fileName.endsWith('.svg')) type = 'icon'

    addMedia({
      id: crypto.randomUUID(),
      name: fileName,
      url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', // placeholder
      type,
      folder: currentFolder,
      size: Math.floor(Math.random() * 5000000) + 100000,
      usageIndicator: ['Unused']
    })
    toast.success('Media uploaded successfully')
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('URL copied to clipboard')
  }

  const filteredMedia = mediaLibrary.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (searchTerm ? true : f.folder === currentFolder) // if searching, ignore folder constraint
  )

  const getIcon = (type: string, name: string) => {
    if (name.endsWith('.svg')) return <div className="text-pink-500 font-bold text-xs uppercase">SVG</div>
    if (name.endsWith('.webm')) return <div className="text-purple-500 font-bold text-xs uppercase">WEBM</div>
    if (name.endsWith('.mp4')) return <div className="text-indigo-500 font-bold text-xs uppercase">MP4</div>
    
    switch(type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-500" />
      case 'video': return <Video className="w-8 h-8 text-purple-500" />
      case 'icon': return <div className="text-pink-500 font-bold">ICON</div>
      case 'document': return <FileText className="w-8 h-8 text-emerald-500" />
      default: return <ImageIcon className="w-8 h-8 text-muted-foreground" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Media Library Pro</h2>
        <div className="flex items-center gap-2">
          <button onClick={handleCreateFolder} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-muted text-sm font-medium">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
          <button onClick={handleUpload} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-medium">
            <Upload className="w-4 h-4" /> Upload File
          </button>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            placeholder="Search media globally..." 
            className="premium-input w-full pl-9 pr-4 py-2"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-card border rounded-lg p-1">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded-md ${viewMode === 'grid' ? 'bg-muted shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded-md ${viewMode === 'list' ? 'bg-muted shadow-sm text-foreground' : 'text-muted-foreground'}`}>
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!searchTerm && (
        <div className="flex items-center gap-2 mb-2">
          {currentFolder !== 'root' && (
            <button onClick={() => setCurrentFolder('root')} className="flex items-center gap-1 text-sm text-primary font-semibold hover:underline">
              <ArrowLeft className="h-4 w-4" /> Back to Root
            </button>
          )}
          <span className="text-sm font-bold text-muted-foreground ml-2 uppercase tracking-widest">{currentFolder}</span>
        </div>
      )}

      {/* Folders (only show in root and when not searching) */}
      {!searchTerm && currentFolder === 'root' && folders.length > 0 && (
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mb-6">
          {folders.map(folder => (
            <div 
              key={folder}
              onClick={() => setCurrentFolder(folder)}
              className="bg-card border rounded-xl p-4 flex flex-col items-center justify-center text-center hover:border-primary/50 cursor-pointer transition-colors shadow-sm group"
            >
              <Folder className="w-10 h-10 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium truncate w-full">{folder}</span>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMedia.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-card/50">
              {searchTerm ? 'No media matched your search.' : 'This folder is empty. Upload files here.'}
            </div>
          )}
          {filteredMedia.map(file => (
            <div key={file.id} className="bg-card border rounded-xl overflow-hidden shadow-sm group relative flex flex-col">
              <div className="aspect-square bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                {file.type === 'image' ? (
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                ) : getIcon(file.type, file.name)}
                
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => handleCopyUrl(file.url)} className="p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-colors" title="Copy URL">
                    <Copy className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteMedia(file.id)} className="p-2 bg-red-500/80 hover:bg-red-500 backdrop-blur-md rounded-full text-white transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <div className="mt-2 text-[10px] font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 rounded p-1 truncate">
                  Usage: {file.usageIndicator?.length ? file.usageIndicator.join(', ') : 'Unused'}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-xl bg-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-medium text-muted-foreground">Name</th>
                <th className="p-4 font-medium text-muted-foreground">Usage</th>
                <th className="p-4 font-medium text-muted-foreground">Size</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMedia.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    {searchTerm ? 'No media matched your search.' : 'This folder is empty. Upload files here.'}
                  </td>
                </tr>
              )}
              {filteredMedia.map(file => (
                <tr key={file.id} className="hover:bg-muted/30">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      {file.type === 'image' ? <ImageIcon className="w-4 h-4 text-blue-500" /> : getIcon(file.type, file.name)}
                    </div>
                    <span className="font-medium truncate max-w-[200px]" title={file.name}>{file.name}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">
                    <span className="inline-block bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs truncate max-w-[150px]" title={file.usageIndicator?.join(', ')}>
                      {file.usageIndicator?.length ? file.usageIndicator.join(', ') : 'Unused'}
                    </span>
                  </td>
                  <td className="p-4 text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => handleCopyUrl(file.url)} className="p-1.5 hover:bg-primary/10 text-primary rounded-md transition-colors" title="Copy URL">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMedia(file.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
