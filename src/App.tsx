import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { SignInForm } from './SignInForm'
import { NotesApp } from './NotesApp'
import { Toaster } from 'sonner'

export default function App() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
            setLoading(false)
        })

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {user ? <NotesApp /> : <SignInForm />}
            <Toaster />
        </div>
    )
}