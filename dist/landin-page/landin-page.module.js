"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LandingPageModule = void 0;
const common_1 = require("@nestjs/common");
const landin_page_service_1 = require("./landin-page.service");
const landin_page_controller_1 = require("./landin-page.controller");
const admin_AuthGuard_1 = require("../Guards/admin.AuthGuard");
const database_module_1 = require("../database/database.module");
const admin_module_1 = require("../admin/admin.module");
let LandingPageModule = class LandingPageModule {
};
exports.LandingPageModule = LandingPageModule;
exports.LandingPageModule = LandingPageModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, admin_module_1.AdminModule],
        providers: [landin_page_service_1.LandingPageService, admin_AuthGuard_1.AdminAuthGuard],
        controllers: [landin_page_controller_1.LandingPageController]
    })
], LandingPageModule);
//# sourceMappingURL=landin-page.module.js.map