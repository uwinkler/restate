export default {
  title: 'Restate',
  description:
    'ReState is a predictable, easy to use, easy to integrate, typesafe state container for React',
  markdown: {
    lineNumbers: true
  },
  themeConfig: {
    logo: { light: '/logo.svg', dark: '/logo-dark.svg' },
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/introduction' },
      { text: 'API', link: '/api' },
      { text: 'Imprint', link: '/imprint' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © Dr. Winkler GmbH'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/uwinkler/restate' }
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Hello Restate', link: '/introduction' },
          { text: 'Installation', link: '/installation' },
          { text: 'useAppState', link: '/quick-useAppState' },
          { text: 'useSelector', link: '/quick-useSelector' }
          // { text: 'Provider', link: '/quick-provider' },
          // { text: 'App State Hook', link: '/quick-state-hook' },
          // { text: 'Next Hook', link: '/quick-next-hook' },
          // { text: 'Actions', link: '/quick-actions' },
          // { text: 'Connectors', link: '/quick-glue' },
          // { text: 'Middleware', link: '/quick-middleware' },
          // { text: 'DevTools', link: '/quick-dev-tools' }
        ]
      },
      {
        text: 'Best Practices',
        items: [
          // { text: 'Hello Restate', link: '/introduction' },
          // { text: 'Installation', link: '/installation' },
          // { text: 'useAppState', link: '/quick-useAppState' },
          // { text: 'useSelector', link: '/quick-useSelector' },
          // { text: 'Provider', link: '/quick-provider' },
          // { text: 'App State Hook', link: '/quick-state-hook' },
          // { text: 'Next Hook', link: '/quick-next-hook' },
          // { text: 'Actions', link: '/quick-actions' },
          { text: 'Connectors', link: '/quick-glue' },
          { text: 'Middleware', link: '/quick-middleware' },
          { text: 'DevTools', link: '/quick-dev-tools' }
        ]
      }
    ]
  }
}
