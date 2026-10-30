"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const product_controller_1 = require("./product.controller");
const database_module_1 = require("../database/database.module");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const admin_module_1 = require("../admin/admin.module");
const s3_bucket_module_1 = require("../s3-bucket/s3-bucket.module");
let ProductModule = class ProductModule {
};
exports.ProductModule = ProductModule;
exports.ProductModule = ProductModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, admin_module_1.AdminModule, s3_bucket_module_1.S3BucketModule],
        providers: [product_service_1.ProductService, admin_AuthGuard_1.AdminAuthGuard],
        controllers: [product_controller_1.ProductController]
    })
], ProductModule);
//# sourceMappingURL=product.module.js.map