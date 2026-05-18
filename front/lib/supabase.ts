// ⚠️ DEPRECATED: Supabase foi removido
// Use apenas as APIs em lib/api.ts que consomem o backend Django

export const supabase = {
  auth: {
    signOut: () => Promise.reject(new Error('Use logout() de lib/api.ts')),
    getUser: () => Promise.reject(new Error('Use getCurrentUser() de lib/api.ts')),
    signUp: () => Promise.reject(new Error('Use register() de lib/api.ts')),
    signInWithPassword: () => Promise.reject(new Error('Use login() de lib/api.ts')),
    onAuthStateChange: () => ({ data: { subscription: null } }),
  },
}
