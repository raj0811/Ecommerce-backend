"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        rawBody: true,
        bodyParser: true,
    });
    app.enableCors({
        origin: [
            'https://ecommerce-frontend-umber-alpha.vercel.app',
            'https://store.urbanza.shop',
            'http://localhost:3000',
        ],
        methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Guest-Id',
            'Idempotency-Key',
        ],
        credentials: true,
        optionsSuccessStatus: 204,
    });
    const port = process.env.PORT ?? 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Server is Running on PORT: ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map