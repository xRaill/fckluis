module.exports = {
  rewrites: async () => [
    {
      source: '/index.php',
      destination: '/',
    },
    {
      source: '/maildev',
      destination: '/api/dev/maildev',
    },
  ],
};
