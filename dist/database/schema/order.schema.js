"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = exports.Order = exports.ShipmentScanSchema = exports.ShipmentScan = exports.OrderCustomerSchema = exports.OrderCustomer = exports.OrderAddressSchema = exports.OrderAddress = exports.OrderItemSchema = exports.OrderItem = exports.PaymentStatus = exports.PaymentMethod = exports.OrderStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["PENDING"] = "PENDING";
    OrderStatus["CONFIRMED"] = "CONFIRMED";
    OrderStatus["PROCESSING"] = "PROCESSING";
    OrderStatus["SHIPPED"] = "SHIPPED";
    OrderStatus["DELIVERED"] = "DELIVERED";
    OrderStatus["CANCELLED"] = "CANCELLED";
    OrderStatus["CANCELLATION_REQUESTED"] = "CANCELLATION_REQUESTED";
    OrderStatus["RETURN_REQUESTED"] = "RETURN_REQUESTED";
    OrderStatus["RETURN_INITIATED"] = "RETURN_INITIATED";
    OrderStatus["RETURNED"] = "RETURNED";
    OrderStatus["COD_INITIATED"] = "COD_INITIATED";
    OrderStatus["REFUND_INITIATED"] = "REFUND_INITIATED";
})(OrderStatus || (exports.OrderStatus = OrderStatus = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["COD"] = "COD";
    PaymentMethod["RAZORPAY"] = "RAZORPAY";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["REFUND_INITIATED"] = "REFUND_INITIATED";
    PaymentStatus["REFUNDED"] = "REFUNDED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
let OrderItem = class OrderItem {
    productId;
    name;
    sku;
    image;
    price;
    quantity;
    lineTotal;
};
exports.OrderItem = OrderItem;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], OrderItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderItem.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], OrderItem.prototype, "sku", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], OrderItem.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 1 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], OrderItem.prototype, "lineTotal", void 0);
exports.OrderItem = OrderItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderItem);
exports.OrderItemSchema = mongoose_1.SchemaFactory.createForClass(OrderItem);
let OrderAddress = class OrderAddress {
    address;
    apartment;
    city;
    state;
    pincode;
    country;
};
exports.OrderAddress = OrderAddress;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderAddress.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], OrderAddress.prototype, "apartment", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderAddress.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderAddress.prototype, "pincode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "India" }),
    __metadata("design:type", String)
], OrderAddress.prototype, "country", void 0);
exports.OrderAddress = OrderAddress = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderAddress);
exports.OrderAddressSchema = mongoose_1.SchemaFactory.createForClass(OrderAddress);
let OrderCustomer = class OrderCustomer {
    firstName;
    lastName;
    email;
    phone;
};
exports.OrderCustomer = OrderCustomer;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderCustomer.prototype, "firstName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderCustomer.prototype, "lastName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    }),
    __metadata("design:type", String)
], OrderCustomer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, trim: true }),
    __metadata("design:type", String)
], OrderCustomer.prototype, "phone", void 0);
exports.OrderCustomer = OrderCustomer = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], OrderCustomer);
exports.OrderCustomerSchema = mongoose_1.SchemaFactory.createForClass(OrderCustomer);
let ShipmentScan = class ShipmentScan {
    date;
    activity;
    location;
};
exports.ShipmentScan = ShipmentScan;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ShipmentScan.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], ShipmentScan.prototype, "activity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "" }),
    __metadata("design:type", String)
], ShipmentScan.prototype, "location", void 0);
exports.ShipmentScan = ShipmentScan = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], ShipmentScan);
exports.ShipmentScanSchema = mongoose_1.SchemaFactory.createForClass(ShipmentScan);
let Order = class Order {
    orderNumber;
    userId;
    guestId;
    customer;
    items;
    shippingAddress;
    billingAddress;
    status;
    paymentMethod;
    paymentStatus;
    subtotal;
    discount;
    shippingCharge;
    total;
    paymentOrderId;
    paymentId;
    trackingNumber;
    awb;
    shiprocketOrderId;
    shipmentCurrentStatus;
    shipmentStatus;
    shipmentStatusId;
    courierName;
    shipmentEtd;
    shipmentCurrentTimestamp;
    shipmentScans;
    deliveredAt;
    cancelledAt;
    checkoutRequestId;
    stockReleased;
    reservationExpiresAt;
    refundAmount;
    razorpayRefundId;
    refundInitiatedAt;
    refundGatewayStatus;
};
exports.Order = Order;
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        required: true,
        unique: true,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    }),
    __metadata("design:type", Object)
], Order.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, index: true }),
    __metadata("design:type", Object)
], Order.prototype, "guestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.OrderCustomerSchema, required: true }),
    __metadata("design:type", OrderCustomer)
], Order.prototype, "customer", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.OrderItemSchema],
        required: true,
        validate: {
            validator: (items) => Array.isArray(items) && items.length > 0,
            message: "An order must contain at least one item.",
        },
    }),
    __metadata("design:type", Array)
], Order.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.OrderAddressSchema, required: true }),
    __metadata("design:type", OrderAddress)
], Order.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.OrderAddressSchema, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "billingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(PaymentMethod),
        required: true,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
    }),
    __metadata("design:type", String)
], Order.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "discount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "shippingCharge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "paymentOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, index: true }),
    __metadata("design:type", Object)
], Order.prototype, "trackingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, index: true }),
    __metadata("design:type", Object)
], Order.prototype, "awb", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null, index: true }),
    __metadata("design:type", Object)
], Order.prototype, "shiprocketOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "shipmentCurrentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "shipmentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "shipmentStatusId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "courierName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "shipmentEtd", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "shipmentCurrentTimestamp", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.ShipmentScanSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], Order.prototype, "shipmentScans", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "deliveredAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "cancelledAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Order.prototype, "checkoutRequestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "stockReleased", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "reservationExpiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "refundAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "razorpayRefundId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "refundInitiatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: null }),
    __metadata("design:type", Object)
], Order.prototype, "refundGatewayStatus", void 0);
exports.Order = Order = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: "orders",
    })
], Order);
exports.OrderSchema = mongoose_1.SchemaFactory.createForClass(Order);
exports.OrderSchema.index({ userId: 1, createdAt: -1 });
exports.OrderSchema.index({ guestId: 1, createdAt: -1 });
exports.OrderSchema.index({ "customer.email": 1, createdAt: -1 });
exports.OrderSchema.index({ "customer.phone": 1, createdAt: -1 });
//# sourceMappingURL=order.schema.js.map