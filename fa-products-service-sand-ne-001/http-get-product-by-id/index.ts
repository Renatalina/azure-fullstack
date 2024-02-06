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
    context.log('HTTP trigger function http-get-product-by-id processed a request.');
    context.log(req);
    const { productId } = req.params;

    const results = await containerProduct.items
        .query({
            query: "SELECT * FROM c WHERE  c.id = @id",
            parameters: [{ name: "@id", value: productId }]
        })
        .fetchAll();
    context.log(results.resources);
    context.res = {
        status: results.resources? 200 : 404, /* Defaults to 200 */
        body: results.resources ? results.resources : context.log("Product not found")        
    };
};

export default httpTrigger;