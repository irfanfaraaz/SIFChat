export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'SIFChat',
  url: 'http://localhost:3000',
  ogImage: 'http://localhost:3000/og.jpg',
  creator: 'Syed Irfan Faraz',
  description: 'Description',
  mainNav: [
    {
      title: 'Home',
      href: '/',
    },
  ],
  links: {
    twitter: 'https://twitter.com/irfanfaraaz7',
    github: 'https://github.com/irfanfaraaz',
    docs: 'https://github.com/irfanfaraaz',
  },
};
