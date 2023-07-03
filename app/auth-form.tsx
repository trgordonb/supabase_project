'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { AuthSession } from '@supabase/supabase-js'
import { Database } from './types/supabase'

const Auth = () => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const [session, setSession] = useState<AuthSession | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const getURL = (type: string = 'callback') => {
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
      process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
      'http://localhost:3000/'
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    if (type === 'callback') {
      url = `${url}auth/callback`
    } else if (type === 'reset') {
      url = `${url}account/reset`
    }
    return url
  }

  useEffect(() => {
    const initSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (data) {
        setSession(data.session)
      }
    }
    
    supabase.auth.onAuthStateChange((_event: string, session: AuthSession | null) => {
      setSession(session)
    })

    initSession()
  }, [])


  const handleLogin = async (type: string, email: string, password: string) => {
    const { data, error } =
        type === 'LOGIN'
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: getURL('callback') } })
    if (error) console.log('Error returned:', error.message)
    if (data) {
      if (type === 'LOGIN') {
        router.replace('/account')
      } else if (type === 'SIGNUP') {
        router.replace('/account/verify')
      }
    }
  } 
  
  const handleOAuthLogin = async () => {
    let { data, error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: getURL('callback')
      },
    })
    if (error) console.log('Error: ', error.message)
  }

  const forgotPassword = async () =>{
    //e.preventDefault()
    var email = prompt('Please enter your email:')
    if (email === null || email === '') {
      window.alert('You must enter your email.')
    } else {
      window.alert('Please check your inbox to get a link to reset your password')
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {redirectTo: getURL('reset')})
      if (error) console.log('Error returned:', error.message)
    }
  }

  return (
    !session &&
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='w-full max-w-sm'>
        <div className="border-teal p-8 border-t-12 bg-white mb-6 rounded-lg shadow-lg bg-white">
          <div className="mb-4">
            <label className="font-bold text-grey-darker block mb-2">Email</label>
            <input
              type="text"
              className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        <div className="mb-4">
          <label className="font-bold text-grey-darker block mb-2">Password</label>
          <input
            type="password"
            className="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-2 py-2 rounded shadow"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex flex-row gap-2">
          <a
            onClick={(e) => {
              e.preventDefault()
              handleLogin('SIGNUP', email, password)
            }}
            href={'/channels'}
            className="btn-black flex-auto border-2 rounded-md text-center border-green-500"
          >
            Sign up
          </a>
          <a
            onClick={(e) => {
              e.preventDefault()
              handleLogin('LOGIN', email, password)
            }}
            href={'/channels'}
            className="btn-black-outline flex-auto border-2 rounded-md text-center border-green-500"
          >
            Sign in
          </a>
        </div>

        <div className="mt-2 text-sm leading-5">
          {/* eslint-disable-next-line */}
          <a
            onClick={forgotPassword}
            href="/"
            className='inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800'
          >
            Forgot your password?
          </a>
        </div>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm leading-5">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6">
            <div className="mt-6">
              <span className="block w-full rounded-md shadow-sm">
                <button
                  onClick={() => handleOAuthLogin()}
                  type="button"
                  className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Google
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

export default Auth