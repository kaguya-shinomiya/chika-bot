function bootstrap() {
  switch (process.env.PROCESS_TYPE) {
    case 'bot':
      import('./bot');
      break;
    case 'web':
      import('./web');
      break;
    default:
      break;
  }
}

bootstrap();
