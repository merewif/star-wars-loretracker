import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import RedditProvider from 'next-auth/providers/reddit';
// pages/api/auth/[...nextauth].js
import InstagramProvider from 'next-auth/providers/instagram';

export default NextAuth({
  providers: [
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_CLIENT_SECRET,
      version: '2.0',
    }),
    RedditProvider({
      clientId: process.env.NEXT_PUBLIC_REDDIT_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_REDDIT_CLIENT_SECRET,
    }),
    InstagramProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET,
    }),
  ],
});
