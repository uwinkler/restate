module.exports = {
  siteMetadata: {
    title: `react-rx-state Documentation`,
    siteUrl: `https://react-rx-state.netlify.com`
  },
  plugins: [
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-react-helmet`,
    // Add typescript stack into webpack
    `gatsby-plugin-typescript`,
    `gatsby-plugin-offline`,
    `gatsby-mdx`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `GatsbyJS`,
        short_name: `GatsbyJS`,
        start_url: `/`,
        background_color: `#f7f0eb`,
        theme_color: `#a2466c`,
        display: `standalone`
      }
    }
  ]
}
