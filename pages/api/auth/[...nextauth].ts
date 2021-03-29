import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Provider from 'next-auth/providers'

export default (req: NextApiRequest, res: NextApiResponse) =>
    NextAuth(req, res, {
        session: {
            jwt: true,
        },
        jwt: {
            secret: process.env.JWT_SECRET
        },
        providers: [
            Provider.GitHub({
                clientId: process.env.GITHUB_ID,
                clientSecret: process.env.GITHUB_SECRET
            })
            // Add more eg facebook etc.
        ],
        database: process.env.DATABASE_URL,
        pages: {
            signIn: '/signin'
        }
    })