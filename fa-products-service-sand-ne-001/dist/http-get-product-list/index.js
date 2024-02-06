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
const containerStock = database.container(container.stock);
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        context.log(req);
        const products = yield containerProduct.items.readAll().fetchAll();
        const stocks = yield containerStock.items.readAll().fetchAll();
        const response = products.resources.map((product) => {
            const productStock = stocks.resources.find((stock) => stock.product_id === product.id);
            return {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                count: productStock ? productStock.count : 0,
            };
        });
        context.log(response);
        context.res = {
            status: response ? 200 : 400,
            body: response ? response : context.log("Error with list of resources")
        };
    });
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map