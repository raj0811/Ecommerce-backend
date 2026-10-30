"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerSchema = exports.Customer = exports.CustomerUtmSchema = exports.CustomerUtm = exports.CustomerAddressSchema = exports.CustomerAddress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CustomerAddress = class CustomerAddress {
    fullName;
    phone;
    addressLine1;
    addressLine2;
    city;
    state;
    pincode;
    isDefault;
};
exports.CustomerAddress = CustomerAddress;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, match: /^\d{10}$/ }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressLine1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: '' }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "addressLine2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, match: /^\d{6}$/ }),
    __metadata("design:type", String)
], CustomerAddress.prototype, "pincode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], CustomerAddress.prototype, "isDefault", void 0);
exports.CustomerAddress = CustomerAddress = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CustomerAddress);
exports.CustomerAddressSchema = mongoose_1.SchemaFactory.createForClass(CustomerAddress);
let CustomerUtm = class CustomerUtm {
    source;
    medium;
    campaign;
};
exports.CustomerUtm = CustomerUtm;
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CustomerUtm.prototype, "source", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CustomerUtm.prototype, "medium", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], CustomerUtm.prototype, "campaign", void 0);
exports.CustomerUtm = CustomerUtm = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CustomerUtm);
exports.CustomerUtmSchema = mongoose_1.SchemaFactory.createForClass(CustomerUtm);
let Customer = class Customer {
    userId;
    name;
    phone;
    email;
    addresses;
    firstUtm;
    tags;
    teamNotes;
    totalSpent;
    totalOrders;
};
exports.Customer = Customer;
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Types.ObjectId,
        ref: 'User',
        default: undefined,
    }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Customer.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], Customer.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        trim: true,
        match: /^\d{10}$/,
    }),
    __metadata("design:type", String)
], Customer.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        lowercase: true,
        trim: true,
        default: undefined,
    }),
    __metadata("design:type", String)
], Customer.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [exports.CustomerAddressSchema],
        default: [],
    }),
    __metadata("design:type", Array)
], Customer.prototype, "addresses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: exports.CustomerUtmSchema, default: undefined }),
    __metadata("design:type", CustomerUtm)
], Customer.prototype, "firstUtm", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Customer.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Customer.prototype, "teamNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "totalSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0, min: 0 }),
    __metadata("design:type", Number)
], Customer.prototype, "totalOrders", void 0);
exports.Customer = Customer = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        collection: 'customers',
    })
], Customer);
exports.CustomerSchema = mongoose_1.SchemaFactory.createForClass(Customer);
exports.CustomerSchema.index({ userId: 1 });
exports.CustomerSchema.index({ phone: 1 });
exports.CustomerSchema.index({ email: 1 });
exports.CustomerSchema.index({ createdAt: -1 });
//# sourceMappingURL=customer.schema.js.map