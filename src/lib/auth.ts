import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('Auth attempt:', credentials?.email)
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log('Missing credentials')
            return null
          }
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email
            }
          })
          console.log('User found:', user ? 'yes' : 'no')
          if (!user) {
            console.log('No user found')
            return null
          }
          if (!user.password) {
            console.log('No password in user')
            return null
          }
          console.log('Stored password:', user.password)
          console.log('Input password:', credentials.password)
          if (user.password !== credentials.password) {
            console.log('Password mismatch')
            return null
          }
          console.log('Auth successful')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.sub
        (session.user as any).role = token.role
      }
      return session
    }
  }
}