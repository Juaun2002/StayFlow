import { getCurrentUser, updateProfile } from './api'
import { User } from './types'

export type UserProfile = User

/**
 * Busca o perfil do usuário autenticado
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser()
    return user as UserProfile || null
  } catch (err) {
    console.error('❌ Erro ao buscar perfil:', err)
    return null
  }
}

/**
 * Atualiza o perfil do usuário
 */
export async function updateUserProfile(
  updates: Partial<User>
) {
  try {
    const updatedUser = await updateProfile(updates)
    return updatedUser as UserProfile
  } catch (err) {
    console.error('❌ Erro ao atualizar perfil:', err)
    throw err
  }
}
