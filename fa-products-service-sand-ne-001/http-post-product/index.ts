import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
require('dotenv').config(); 


const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const databaseName = `products-db`;
const container = {'products':'products', 'stock':'stock'};

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function http-post-product processed a request.');

    const results= await containerProduct.items.upsert(req.body);

    context.log(results);
    context.res = {
        status: 200 , /* Defaults to 200 */
        body: results
    };
};

export default httpTrigger;
