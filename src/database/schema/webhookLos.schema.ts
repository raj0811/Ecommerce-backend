
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ timestamps: true })
export class WebhookLog {
    @Prop({ type: String, required: true })
    log: string;
    @Prop({ type: String })
    event: string;

}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
