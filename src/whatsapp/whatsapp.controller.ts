import {
    Controller,
    Get,
    Post,
    Query,
    Body,
    Res,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { DatabaseService } from 'src/database/database.service';
import { OrderService } from 'src/order/order.service';

@Controller('whatsapp')
export class WhatsappController {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly ordersService: OrderService
    ) { }
    @Get('webhook')
    async verifyWebhook(
        @Query('hub.mode') mode: string,
        @Query('hub.verify_token') token: string,
        @Query('hub.challenge') challenge: string,
        @Res() res: Response,
        @Body() body: any
    ) {
        console.log('WhatsApp webhook verification:', {
            mode,
            token,
            tokenReceived: !!token,
            challenge,
            body
        });
        try {

            await this.databaseService.webhookLogModel.create({
                log: JSON.stringify({ body, mode, token, challenge }),
                event: "WP"
            })
        } catch (e) {
            console.log('fail to save logs');

        }
        if (
            mode === 'subscribe' &&
            token === process.env.VERIFY_TOKEN_WP
        ) {
            console.log('return');

            return res.status(200).send(challenge);
        }

        return res.sendStatus(403);
    }

    @Post("webhook")
    @HttpCode(HttpStatus.OK)
    async receiveMessage(@Body() body: any) {
        const messages =
            body?.entry?.flatMap((entry: any) =>
                entry?.changes?.flatMap(
                    (change: any) => change?.value?.messages ?? [],
                ),
            ) ?? [];

        for (const message of messages) {
            if (message.type !== "interactive") continue;

            const buttonId = message.interactive?.button_reply?.id;
            const customerPhone = message.from;

            if (!buttonId || !customerPhone) continue;

            console.log("COD button reply:", {
                buttonId,
                customerPhone,
            });

            try {
                const result =
                    await this.ordersService.handleCodConfirmationReply(
                        customerPhone,
                        buttonId,
                    );

                console.log("COD confirmation result:", result);
            } catch (error: any) {
                console.error(
                    "Failed to process COD confirmation:",
                    error.message,
                );
            }
        }

        return { received: true };
    }
}