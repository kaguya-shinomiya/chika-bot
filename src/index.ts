function bootstrap() {
  switch (process.env.PROCESS_TYPE) {
    case 'bot':
      import('./chika');
      break;
    case 'web':
      import('./hayasaka');
      break;
    default:
      break;
  }
}

bootstrap();
