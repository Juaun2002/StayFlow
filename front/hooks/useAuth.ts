"use client"

import { useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { getCurrentUser, getAuthToken } from '@/lib/api'
import { getUserProfile, UserProfile } from '@/lib/userService'

export function useAuth() {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const token = getAuthToken()
        if (!token) {
          setUser(null)
          setLoading(false)
          return
        }

        const user = await getCurrentUser()
        if (mounted) {
          setUser(user)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao autenticar')
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
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
