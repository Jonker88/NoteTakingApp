import { supabase } from './lib/supabase'

export function SignOutButton() {
  return (
      <button
          onClick={() => supabase.auth.signOut()}
          className="btn-secondary"
      >
        Sign Out
      </button>
  )
}