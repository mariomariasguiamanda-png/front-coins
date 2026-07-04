import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';

// BigInt não é serializável por JSON.stringify por padrão; todo id do banco é BigInt.
(BigInt.prototype as unknown as { toJSON: () => number }).toJSON = function (
  this: bigint,
) {
  return Number(this);
};

async function bootstrap() {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      'JWT_SECRET não configurado. Defina a variável de ambiente antes de iniciar a API.',
    );
  }

  const app = await NestFactory.create(AppModule);

  const frontendUrl = process.env.FRONTEND_URL;
  app.enableCors({
    origin: frontendUrl ? frontendUrl.split(',') : process.env.NODE_ENV !== 'production',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new PrismaExceptionFilter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
