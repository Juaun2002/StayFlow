"use client"

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { getUserProfile, UserProfile } from '@/lib/userService'

export function useAuth() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    // Subscribe to auth state changes PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user || null)
        setLoading(false)
      }
    })

    // Depois verificar o estado atual
    supabase.auth.getUser()
      .then(({ data: { user }, error }) => {
        if (mounted) {
          if (error) {
            setError(error.message)
            setUser(null)
          } else {
            setUser(user)
          }
          setLoading(false)
        }
      })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  return { user, loading, error }
}

/**
 * Hook que retorna o usuário autenticado + seu perfil do banco de dados
 */
export function useAuthWithProfile() {
  const { user, loading: authLoading, error: authError } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const userProfile = await getUserProfile()
        setProfile(userProfile)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
        console.error('Erro ao carregar perfil:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  return {
    user,
    profile,
    loading: authLoading || loading,
    error: authError || error,
  }
}

export function useProperties() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  async function fetchProperties() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProperties(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar propriedades')
    } finally {
      setLoading(false)
    }
  }

  return { properties, loading, error, refetch: fetchProperties }
}
