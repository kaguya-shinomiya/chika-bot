module.exports = {
  apps: [
    {
      name: 'chika-bot',
      script: './dist/index.js',
      instances: 1,
      exec_mode: 'cluster',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
