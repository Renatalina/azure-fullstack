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
const cosmos_1 = require("@azure/cosmos");
require('dotenv').config();
const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const databaseName = `products-db`;
const container = { 'products': 'products', 'stock': 'stock' };
const cosmosClient = new cosmos_1.CosmosClient({ endpoint, key });
const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function http-get-product-by-id processed a request.');
        context.log(req);
        const { productId } = req.params;
        const results = yield containerProduct.items
            .query({
            query: "SELECT * FROM c WHERE  c.id = @id",
            parameters: [{ name: "@id", value: productId }]
        })
            .fetchAll();
        context.log(results.resources);
        context.res = {
            status: results.resources ? 200 : 404,
            body: results.resources ? results.resources : context.log("Product not found")
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map