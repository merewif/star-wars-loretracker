import React from 'react';
import Head from 'next/head';
import { HeadProps } from '../types';

export default function HeadContent({ module }: HeadProps) {
  return (
    <Head>
      <title>
        {module[0].toUpperCase() + module.substring(1)} | Star Wars Loretracker
      </title>
      <meta
        name='description'
        content='Track which Star Wars content you consooomed.'
      />
      <meta property='og:title' content='Star Wars Loretracker' />
      <meta
        property='og:description'
        content='Track which Star Wars content you consooomed.'
      />
      <meta
        property='og:url'
        content='https://star-wars-loretracker.vercel.app/'
      />
      <meta property='og:type' content='website' />
      <meta name='image' property='og:image' content='/imgs/featured.png' />
      <meta property='og:site_name' content='Star Wars Loretracker' />
      <meta
        property='og:url'
        content='https://star-wars-loretracker.vercel.app/'
      />
      <meta name='twitter:card' content='summary_large_image' />
      <meta
        property='twitter:url'
        content='https://star-wars-loretracker.vercel.app'
      />
      <meta name='twitter:title' content='Star Wars Loretracker' />
      <meta
        name='twitter:description'
        content='Track which Star Wars content you consooomed'
      />
      <meta name='twitter:image' content='/imgs/featured.png' />
      <link rel='icon' href='/favicon.ico' />

      <meta name='application-name' content='Star Wars Loretracker' />
      <link rel='apple-touch-icon' href='/icons/android-chrome-192x192.png' />
      <meta name='apple-mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='default' />
      <meta name='apple-mobile-web-app-title' content='Star Wars Loretracker' />
      <meta name='format-detection' content='telephone=no' />
      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='msapplication-config' content='/icons/browserconfig.xml' />
      <meta name='msapplication-TileColor' content='#2B5797' />
      <meta name='msapplication-tap-highlight' content='no' />
      <meta name='theme-color' content='#000000' />

      <link rel='manifest' href='/manifest.json' />
    </Head>
  );
}
