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
      <link rel='icon' href='/favicon.ico' />{' '}
    </Head>
  );
}
