
import * as crypto from 'crypto';


export function verifyWebhookSignature(
    rawBody: Buffer,
    signature: string,
    secret: string,
    prefix?: string,
): boolean {
    if (!secret || !rawBody || !signature) {
        return false;
    }

    const receivedSignature = prefix
        ? signature.startsWith(prefix)
            ? signature.slice(prefix.length)
            : ''
        : signature;

    if (!/^[a-fA-F0-9]{64}$/.test(receivedSignature)) {
        return false;
    }

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest();

    const receivedBuffer = Buffer.from(receivedSignature, 'hex');

    return (
        receivedBuffer.length === expectedSignature.length &&
        crypto.timingSafeEqual(expectedSignature, receivedBuffer)
    );
}


