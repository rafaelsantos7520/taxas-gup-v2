import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Usuário", type: "text" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {

                if (credentials?.username === "admin" && credentials?.password === "801532") {
                    return {
                        id: "1",
                        name: "Admin User",
                        email: "admin@example.com",
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
