module.exports = {
  siteMetadata: {
    siteUrl: `https://www.yourdomain.tld`,
  },
  plugins: [
    {
      resolve:'gatsby-plugin-create-client-paths',
      options: {prefixes:['/dashboard/*']}
    }
  ],
}
