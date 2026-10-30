"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipRocketModule = void 0;
const common_1 = require("@nestjs/common");
const ship_rocket_service_1 = require("./ship-rocket.service");
const ship_rocket_controller_1 = require("./ship-rocket.controller");
const database_module_1 = require("../database/database.module");
const admin_module_1 = require("../admin/admin.module");
let ShipRocketModule = class ShipRocketModule {
};
exports.ShipRocketModule = ShipRocketModule;
exports.ShipRocketModule = ShipRocketModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, admin_module_1.AdminModule],
        providers: [ship_rocket_service_1.ShipRocketService],
        controllers: [ship_rocket_controller_1.ShipRocketController],
        exports: [ship_rocket_service_1.ShipRocketService],
    })
], ShipRocketModule);
//# sourceMappingURL=ship-rocket.module.js.map