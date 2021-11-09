module.exports = {
  rewrites: async () => [
    {
      source: '/index.php',
      destination: '/',
    },
    {
      source: '/projects/:id',
      destination: '/',
    },
  ],
};
