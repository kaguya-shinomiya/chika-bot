declare namespace NodeJS {
  export interface ProcessEnv {
    YOUTUBE_API_KEY: string;
    APP_TOKEN: string;
    NODE_ENV: string;
    REDIS_HOST: string;
    REDIS_PORT: string;
  }
}
