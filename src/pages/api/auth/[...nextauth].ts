import {IncomingMessage} from 'http';
import NextAuth, {User} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {setLicenseDB} from 'server/db';
import customerModel from 'server/models/customerModel';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'Email', type: 'text', placeholder: 'john'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials, req) {
        if (!(await setLicenseDB(req.headers?.host))) {
          return null;
        }
        const user: any = await customerModel.findByCredentials(credentials);
        console.log('user auth', user);
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user as unknown as User;
        } else {
          // If you return null or false then the credentials will be rejected
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line no-unused-vars
    // async jwt({token, account, user}) {
    //   // Persist the OAuth access_token to the token right after signin
    //   if (user) {
    //     token.accessToken = user.access_token;
    //     delete user.access_token;
    //     token.user = user.customer;
    //   }
    //   return token;
    // },
    async session({session, token}) {
      // Send properties to the client, like an access_token from a provider.
      console.log('session', session);
      session.user = token.user as User;
      return session;
    },

  },
  // secret: process.env.JWT_SECRET,
});
