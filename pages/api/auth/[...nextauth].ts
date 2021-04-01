import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import Provider from 'next-auth/providers'
import { connectToDB } from '../../../db';
import { folder, doc } from '../../../db/';

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
        },
        callbacks: {
          async session(session, user) {
            session.user.id = user.id
            return session
          },
          async jwt(tokenPayload, user, account, profile, isNewUser) {
            const { db } = await connectToDB()
        
            if (isNewUser) {
              const personalFolder = await folder.createFolder(db, { createdBy: `${user.id}`, name: 'Getting Started' })
              await doc.createDoc(db, {
                name: 'Start Here',
                folder: personalFolder._id,
                createdBy: `${user.id}`,
                content: {
                  time: 1556098174501,
                  blocks: [
                    {
                      type: 'header',
                      data: {
                        text: 'Some default content',
                        level: 2,
                      },
                    },
                  ],
                  version: '2.12.4',
                },
              })
            }
        
            if (tokenPayload && user) {
              return { ...tokenPayload, id: `${user.id}` }
            }
        
            return tokenPayload
          },
        },
    })


