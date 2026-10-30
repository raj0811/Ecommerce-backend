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
exports.TransactionSchema = exports.Transaction = exports.TransactionStatus = exports.TransactionPaymentMethod = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = __importStar(require("mongoose"));
var TransactionPaymentMethod;
(function (TransactionPaymentMethod) {
    TransactionPaymentMethod["RAZORPAY"] = "RAZORPAY";
    TransactionPaymentMethod["COD"] = "COD";
})(TransactionPaymentMethod || (exports.TransactionPaymentMethod = TransactionPaymentMethod = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "PENDING";
    TransactionStatus["SUCCESS"] = "SUCCESS";
    TransactionStatus["FAILED"] = "FAILED";
    TransactionStatus["REFUNDED"] = "REFUNDED";
    TransactionStatus["PARTIALLY_REFUNDED"] = "PARTIALLY_REFUNDED";
    TransactionStatus["REFUND_INITIATED"] = "REFUND_INITIATED";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
let Transaction = class Transaction {
    orderId;
    userId;
    guestId;
    paymentMethod;
    status;
    amount;
    currency;
    gatewayOrderId;
    gatewayPaymentId;
    gatewaySignature;
    failureReason;
    gatewayRefundId;
    refundedAmount;
    paidAt;
    refundedAt;
    notes;
};
exports.Transaction = Transaction;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
        index: true,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Transaction.prototype, "orderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.default.Schema.Types.ObjectId,
        ref: "User",
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "guestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(TransactionPaymentMethod),
        required: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
        index: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        required: true,
        min: 0,
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: "INR",
        uppercase: true,
    }),
    __metadata("design:type", String)
], Transaction.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "gatewayOrderId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        index: true,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "gatewayPaymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
        select: false,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "gatewaySignature", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "failureReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "gatewayRefundId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Number,
        default: 0,
        min: 0,
    }),
    __metadata("design:type", Number)
], Transaction.prototype, "refundedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: null,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: Date,
        default: null,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "refundedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        default: null,
    }),
    __metadata("design:type", Object)
], Transaction.prototype, "notes", void 0);
exports.Transaction = Transaction = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: "transactions" })
], Transaction);
exports.TransactionSchema = mongoose_1.SchemaFactory.createForClass(Transaction);
exports.TransactionSchema.index({ orderId: 1, createdAt: -1 });
exports.TransactionSchema.index({ userId: 1, createdAt: -1 });
exports.TransactionSchema.index({ guestId: 1, createdAt: -1 });
//# sourceMappingURL=transaction.schema.js.map