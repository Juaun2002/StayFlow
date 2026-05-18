import { supabase } from './supabase'

export interface UserProfile {
  id: string
  auth_id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  cpf?: string
  created_at: string
  updated_at: string
}

/**
 * ❌ DEPRECATED: Não use saveUserProfile!
 * O usuário é criado automaticamente pelo trigger quando auth.users é inserido
 * Este função está aqui apenas para referência histórica
 */
export async function saveUserProfile(
  email: string,
  full_name: string,
  auth_id?: string
) {
  throw new Error(
    '❌ saveUserProfile NÃO DEVE SER USADO! O usuário é criado automaticamente pelo trigger. Use getUserProfile() para verificar.'
  )
}

/**
 * Busca o perfil do usuário logado
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data as UserProfile || null
  } catch (err) {
    console.error('❌ Erro ao buscar perfil:', err)
    return null
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'id' | 'auth_id' | 'created_at'>>
) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Nenhum usuário autenticado')

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('auth_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data as UserProfile
  } catch (err) {
    console.error('❌ Erro ao atualizar perfil:', err)
    throw err
  }
}

/**
 * Deleta o usuário (conta completa)
 */
export async function deleteUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Nenhum usuário autenticado')

    // Deleta da tabela users (vai deletar properties por CASCADE também)
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('auth_id', user.id)

    if (error) throw error

    // Deleta da autenticação do Supabase
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id)
    if (authError) throw authError

    return true
  } catch (err) {
    console.error('❌ Erro ao deletar perfil:', err)
    throw err
  }
}

/**
 * Verifica se o usuário existe na tabela users
 */
export async function userExists(auth_id: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', auth_id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') throw error
    return data !== null
  } catch (err) {
    console.error('❌ Erro ao verificar usuário:', err)
    return false
  }
}
