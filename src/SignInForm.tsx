import { useState } from 'react'
import { supabase } from './lib/supabase'
import { toast } from 'sonner'

export function SignInForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({ email, password })
                if (error) throw error
                toast.success('Check your email for verification link')
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password })
                if (error) throw error
            }
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Notes</h1>
                    <p className="text-gray-600">Sign in to access your notes</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field w-full"
                        required
                    />
                    <button type="submit" disabled={loading} className="btn-primary w-full">
                        {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 hover:underline"
                    >
                        {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                    </button>
                </div>
            </div>
        </div>
    )
}