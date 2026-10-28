
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
} from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { DatabaseService } from "src/database/database.service";
import { TransactionStatus } from "src/database/schema/transaction.schema";

type CheckoutItemDto = {
    product_id: string;
    qty: number;
};

type CheckoutDto = {
    checkoutRequestId: string;
    items: CheckoutItemDto[];
    customer: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
    };
    shippingAddress: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
    billingAddress?: {
        address: string;
        apartment?: string;
        city: string;
        state: string;
        pincode: string;
        country?: string;
    };
};

type VerifyPaymentDto = {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
};

@Controller("payments")
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService,
        private readonly databaseService: DatabaseService
    ) { }

    @Post("create-order")
    @HttpCode(HttpStatus.CREATED)
    async createOrder(@Body() body: CheckoutDto) {
        return this.paymentService.processOrder(body);
    }

    @Post("verify")
    @HttpCode(HttpStatus.OK)
    verifyPayment(@Body() body: VerifyPaymentDto) {
        const isValid =
            this.paymentService.verifyPaymentSignature(body);

        if (!isValid) {
            return {
                success: false,
                message: "Invalid payment signature.",
            };
        }

        return {
            success: true,
            message: "Payment signature verified.",
        };
    }

    @Get('/razorpay-init')
    async initRazorpay(@Req() req: any, @Res() res: any) {
        const transactionId = req.query.transaction_id;

        if (!transactionId || !/^[a-f\d]{24}$/i.test(transactionId)) {
            throw new BadRequestException('Invalid transaction ID');
        }

        const transaction =
            await this.databaseService.transactionModel.findById(transactionId);

        if (!transaction) {
            throw new BadRequestException('Transaction not found');
        }

        if (!transaction.gatewayOrderId) {
            throw new BadRequestException(
                'Failed to create an order at gateway',
            );
        }

        if (transaction.status !== 'PENDING') {
            throw new BadRequestException('Transaction is not pending');
        }

        const order = await this.databaseService.orderModel
            .findById(transaction.orderId)
            .populate('shippingAddress')
            .exec();

        if (!order) {
            throw new BadRequestException('Order not found');
        }

        const options = {
            key: process.env.RZP_API_KEY,
            order_id: transaction.gatewayOrderId,
            amount: transaction.amount, // Must be in paise
            currency: transaction.currency || 'INR',
            name: `${order.customer.firstName} ${order.customer.lastName}`,
            description: `Order ${order.orderNumber || order._id}`,
            callback_url: `${process.env.BACKEND_URL}/payments/callback?transaction_id=${transactionId}`,
            redirect: true,
            prefill: {
                name: `${order.customer.firstName} ${order.customer.lastName}`,
                email: order.customer.email || '',
                contact: order.customer.phone || '',
            },
        };

        if (!options.key || !process.env.BACKEND_URL) {
            throw new Error('Razorpay environment variables are missing');
        }

        const checkoutOptions = JSON.stringify(options).replace(/</g, '\\u003c');

        const frontendUrl = process.env.URL;

        if (!frontendUrl) {
            throw new Error('Frontend URL is missing');
        }

        const dismissUrl =
            `${frontendUrl}/razorpay-nonseamless/callback` +
            `?collect_id=${encodeURIComponent(transaction.gatewayOrderId)}`;

        return res.type('html').send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Razorpay Payment</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
      </head>
      <body>
        <p>Opening secure payment checkout...</p>
        <script>
          window.onload = function () {
            const options = ${checkoutOptions};

            options.modal = {
              ondismiss: function () {
                window.location.href = ${JSON.stringify(dismissUrl)};
              }
            };

            const rzp = new Razorpay(options);
            rzp.open();
          };
        </script>
      </body>
    </html>
  `);
    }

    @Get("/callback")
    async callback(@Req() req: any, @Res() res: any) {
        const { transaction_id } = req.query;

        if (!transaction_id) {
            throw new BadRequestException("Invalid transaction ID");
        }
        const transaction = await this.databaseService.transactionModel.findById(transaction_id)
        if (!transaction || !transaction.gatewayOrderId) {
            throw new BadRequestException("Transaction not found");
        }

        const response = await this.paymentService.checkPaymentStatus(transaction.gatewayOrderId.toString())
        console.log(response);

        return res.send({
            response
        })
    }


    @Post('/callback')
    async callbackPost(
        @Req() req: any,
        @Res() res: any,
        @Body() body: any,
    ) {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
        } = body;

        const { transaction_id } = req.query;
        const frontendUrl = process.env.URL;

        if (!transaction_id) {
            throw new BadRequestException('Invalid transaction ID');
        }

        try {
            const transaction =
                await this.databaseService.transactionModel.findById(
                    transaction_id,
                );

            if (!transaction) {
                throw new BadRequestException('Transaction not found');
            }

            if (transaction.gatewayOrderId !== razorpay_order_id) {
                throw new BadRequestException('Razorpay order ID mismatch');
            }

            // Use your existing method to check Razorpay order status.
            const response =
                await this.paymentService.checkPaymentStatus(
                    razorpay_order_id,
                );

            if (response.status === 'paid') {
                // Update transaction and order only if not already updated.
                if (transaction.status !== TransactionStatus.SUCCESS) {
                    transaction.status = TransactionStatus.SUCCESS;
                    transaction.gatewayPaymentId = razorpay_payment_id;
                    transaction.gatewaySignature = razorpay_signature;
                    transaction.paidAt = new Date(response.created_at);

                    await transaction.save();

                    await this.databaseService.orderModel.findByIdAndUpdate(
                        transaction.orderId,
                        {
                            paymentStatus: 'PAID',
                            paymentId: razorpay_payment_id,
                        },
                    );
                }

                return res.redirect(
                    `${frontendUrl}/order-success/${transaction.orderId}`,
                );
            }

            return res.redirect(
                `${frontendUrl}/payment-pending`,
            );
        } catch (error) {
            console.error('Razorpay callback error:', error);

            return res.redirect(
                `${frontendUrl}/payment-pending`,
            );
        }
    }
}
