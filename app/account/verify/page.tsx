'use client'
import { Session } from '@supabase/auth-helpers-nextjs'

export default function EmailVerify({ session }: { session: Session | null }) {

    return (
        <div className='flex h-screen w-screen items-center justify-center text-gray-500'>
            <h2>Please check your inbox to verify your email address</h2>
        </div>
    )
}