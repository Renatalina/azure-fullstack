import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
require('dotenv').config(); 


const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const databaseName = `products-db`;
const container = {'products':'products', 'stock':'stock'};

console.log(key);
console.log(endpoint);

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);
const containerStock = database.container(container.stock);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    const response = await containerProduct.items.readAll().fetchAll();
    context.log(response.resources);
    context.res = {
        status: response.resources?  200 : 400, /* Defaults to 200 */
        body: response.resources? response.resources : context.log("Error with list of resources")
    };

};

export default httpTrigger;