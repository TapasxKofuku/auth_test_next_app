import NextAuth from "next-auth"
import Apple from "next-auth/providers/apple"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Apple],
})