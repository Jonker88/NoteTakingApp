import { supabase, Note } from './lib/supabase'
import { toast } from 'sonner'

interface Props {
  note: Note
  onEdit: () => void
  onDelete: () => void
}

export function NoteCard({ note, onEdit, onDelete }: Props) {
  const handleDelete = async () => {
    if (!confirm('Delete this note?')) return

    try {
      await supabase.from('notes').delete().eq('id', note.id)
      toast.success('Note deleted')
      onDelete()
    } catch (error) {
      toast.error('Failed to delete note')
    }
  }

  return (
      <div className="note-card">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold truncate flex-1">{note.title}</h3>
          <div className="flex gap-1">
            <button onClick={onEdit} className="icon-btn text-blue-600">✏️</button>
            <button onClick={handleDelete} className="icon-btn text-red-600">🗑️</button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{note.content}</p>

        <div className="flex justify-between text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-1 rounded-full">
          {note.category || 'Uncategorized'}
        </span>
          <span>{new Date(note.created_at).toLocaleDateString()}</span>
        </div>
      </div>
  )
}