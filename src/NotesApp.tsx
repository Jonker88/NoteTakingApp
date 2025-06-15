import { useState, useEffect } from 'react'
import { supabase, Note, Category } from './lib/supabase'
import { NoteCard } from './NoteCard'
import { NoteEditor } from './NoteEditor'
import { CategoryManager } from './CategoryManager'
import { SignOutButton } from './SignOutButton'

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showCategories, setShowCategories] = useState(false)

  useEffect(() => {
    fetchNotes()
    fetchCategories()
  }, [])

  const fetchNotes = async () => {
    const { data } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false })
    setNotes(data || [])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  const filteredNotes = notes.filter(note => {
    const matchesCategory = !selectedCategory || note.category === selectedCategory
    const matchesSearch = !searchQuery ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Notes</h1>
            <div className="flex gap-4">
              <button onClick={() => setShowCategories(true)} className="btn-secondary">
                Categories
              </button>
              <button onClick={() => setShowEditor(true)} className="btn-primary">
                New Note
              </button>
              <SignOutButton />
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
          {/* Sidebar */}
          <div className="w-64">
            <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field w-full mb-6"
            />

            <div>
              <h3 className="font-medium mb-3">Categories</h3>
              <button
                  onClick={() => setSelectedCategory('')}
                  className={`category-btn ${!selectedCategory ? 'active' : ''}`}
              >
                All Notes
              </button>
              {categories.map(cat => (
                  <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                  >
                    {cat.name}
                  </button>
              ))}
            </div>
          </div>

          {/* Notes Grid */}
          <div className="flex-1">
            {filteredNotes.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">No notes found</p>
                  <button onClick={() => setShowEditor(true)} className="btn-primary">
                    Create your first note
                  </button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredNotes.map(note => (
                      <NoteCard
                          key={note.id}
                          note={note}
                          onEdit={() => { setEditingNote(note); setShowEditor(true) }}
                          onDelete={fetchNotes}
                      />
                  ))}
                </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showEditor && (
            <NoteEditor
                note={editingNote}
                categories={categories}
                onClose={() => { setShowEditor(false); setEditingNote(null) }}
                onSave={() => { fetchNotes(); setShowEditor(false); setEditingNote(null) }}
            />
        )}

        {showCategories && (
            <CategoryManager
                onClose={() => setShowCategories(false)}
                onUpdate={fetchCategories}
            />
        )}
      </div>
  )
}