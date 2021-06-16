declare namespace NodeJS {
  export interface ProcessEnv {
    APP_TOKEN: string;
    NODE_ENV: string;
    DATABASE_URL: string;
    REDISCLOUD_URL: string;
    HUGGING_FACE_API_URL: string;
    ANILIST_SCHEMA: string;
    HUGGING_FACE_API_KEY: string;
    SUPERUSER_KEY: string;
    CHIKA_DB_SCHEMA: string;
  }
}
