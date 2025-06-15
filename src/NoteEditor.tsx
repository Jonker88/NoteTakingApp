import { useState, useEffect } from 'react'
import { supabase, Note, Category } from './lib/supabase'
import { toast } from 'sonner'

interface Props {
  note: Note | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

export function NoteEditor({ note, categories, onClose, onSave }: Props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setCategory(note.category)
    }
  }, [note])

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required')
      return
    }

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not signed in')
      return
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category,
      user_id: user.id // <-- Added this for RLS
    }

    try {
      if (note) {
        // For updates, we don't need to include user_id since it's already set
        const updateData = {
          title: title.trim(),
          content: content.trim(),
          category
        }
        await supabase.from('notes').update(updateData).eq('id', note.id)
        toast.success('Note updated')
      } else {
        // For inserts, we need user_id for RLS
        await supabase.from('notes').insert(noteData)
        toast.success('Note created')
      }
      onSave()
    } catch (error) {
      toast.error('Failed to save note')
    }
  }

  return (
      <div className="modal-overlay">
        <div className="modal-content max-w-2xl">
          <div className="modal-header">
            <h2 className="text-xl font-semibold">{note ? 'Edit Note' : 'New Note'}</h2>
            <button onClick={onClose} className="close-btn">×</button>
          </div>

          <div className="modal-body space-y-4">
            <input
                type="text"
                placeholder="Note title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field w-full"
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field w-full"
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            <textarea
                placeholder="Write your note here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="input-field w-full resize-none"
            />
          </div>

          <div className="modal-footer">
            <button onClick={onClose} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">
              {note ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </div>
  )
}