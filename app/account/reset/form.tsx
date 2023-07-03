'use client'

import { useState } from 'react'
import { Database } from '../../types/supabase'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function ResetPasswordForm() {
    const supabase = createClientComponentClient<Database>()
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function updatePassword(){
        let { data, error } = await supabase.auth.updateUser({ 
            password: password })
        if (error) {
            console.log(error.message)
        }
        if (data) {
            await supabase.auth.signOut()
            router.replace('/')
        }
    }
       

    return (
        <div className='flex h-screen w-screen items-center justify-center text-gray-500'>
            <div className="md:flex md:items-center mb-6">  
                <div className="md:w-1/3">
                    <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="email">
                        New password
                    </label>
                </div>
                <div className="md:w-1/3">
                    <input 
                        id='password' 
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="md:w-1/3">
                    <button 
                        className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 ml-4 rounded" 
                        type="button"
                        onClick={updatePassword}
                    >
                        Submit
                    </button>
                </div>
            </div>  
        </div>
    )
}