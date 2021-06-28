declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    APP_TOKEN: string;
    BOT_USER_ID: string;
    DATABASE_URL: string;
    REDISCLOUD_URL: string;
    HUGGING_FACE_CHIKA: string;
    HUGGING_FACE_KAGUYA: string;
    HUGGING_FACE_CHIKA_KEY: string;
    HUGGING_FACE_KAGUYA_KEY: string;
    ANILIST_SCHEMA: string;
  }
}
