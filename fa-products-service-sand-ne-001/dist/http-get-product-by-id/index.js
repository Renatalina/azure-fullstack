"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../constant");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function http-get-product-by-id processed a request.');
        const { productId } = req.params;
        const product = constant_1.default === null || constant_1.default === void 0 ? void 0 : constant_1.default.find(item => item.id === productId);
        context.res = {
            status: product ? 200 : 404,
            body: product ? product : console.error("Product not found")
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map