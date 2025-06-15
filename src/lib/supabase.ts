import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://puhipzzegdrniusiztvv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1aGlwenplZ2Rybml1c2l6dHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NDcwMzcsImV4cCI6MjA2NTQyMzAzN30.fiAB8ud0JIz5oIGddGmHzqZEx5HamXMd4irVtSnKm8s'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Note = {
    id: string
    title: string
    content: string
    category: string
    created_at: string
    user_id: string
}

export type Category = {
    id: string
    name: string
    user_id: string
}