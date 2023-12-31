import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  'use server'
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch {
      
    }
  }

  return NextResponse.redirect(new URL('/account/reset', req.url))
}