
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductEventDocument =
  HydratedDocument<ProductEvent>;

export enum ProductEventType {
  PRODUCT_VIEWED = 'PRODUCT_VIEWED',
  PRODUCT_CLICKED = 'PRODUCT_CLICKED',
  ADDED_TO_CART = 'ADDED_TO_CART',
  REMOVED_FROM_CART = 'REMOVED_FROM_CART',
  PURCHASED = 'PURCHASED',
}

export enum ProductEventSource {
  PRODUCT_PAGE = 'PRODUCT_PAGE',
  CART_PAGE = 'CART_PAGE',
  HOME_PAGE = 'HOME_PAGE',
  CHECKOUT = 'CHECKOUT',
  RECOMMENDATION = 'RECOMMENDATION',
  OTHER = 'OTHER',
}

@Schema({
  timestamps: true,
  versionKey: false,
  collection: 'product_events',
})
export class ProductEvent {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  eventId: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true,
  })
  productId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    default: null,
  })
  userId: Types.ObjectId | null;

  // Useful for anonymous customers
  @Prop({
    type: String,
    default: null,
    index: true,
  })
  sessionId: string | null;

  @Prop({
    type: String,
    enum: ProductEventType,
    required: true,
  })
  eventType: ProductEventType;

  @Prop({
    type: String,
    enum: ProductEventSource,
    default: ProductEventSource.OTHER,
  })
  source: ProductEventSource;

  @Prop({
    type: Types.ObjectId,
    ref: 'Order',
    default: null,
  })
  orderId: Types.ObjectId | null;

  @Prop({
    type: Number,
    default: 1,
    min: 1,
  })
  quantity: number;

  @Prop({
    type: Number,
    default: null,
    min: 0,
  })
  price: number | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    default: null,
  })
  recommendedFromProductId: Types.ObjectId | null;

  @Prop({
    type: Object,
    default: {},
  })
  metadata: Record<string, any>;
}

export const ProductEventSchema =
  SchemaFactory.createForClass(ProductEvent);

// Query events for a particular product and event type
ProductEventSchema.index({
  productId: 1,
  eventType: 1,
  createdAt: -1,
});

// Query user activity
ProductEventSchema.index({
  userId: 1,
  createdAt: -1,
});

// Query anonymous session activity
ProductEventSchema.index({
  sessionId: 1,
  createdAt: -1,
});

// Process purchase events for an order
ProductEventSchema.index({
  orderId: 1,
  eventType: 1,
});
