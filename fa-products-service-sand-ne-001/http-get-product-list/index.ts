import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CosmosClient } from "@azure/cosmos";
require('dotenv').config(); 


const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const databaseName = `products-db`;
const container = {'products':'products', 'stock':'stock'};

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);
const containerStock = database.container(container.stock);

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    context.log(req);
    const products = await containerProduct.items.readAll().fetchAll();
    const stocks = await containerStock.items.readAll().fetchAll();

    const response = products.resources.map((product) => {
        const productStock = stocks.resources.find(
          (stock) => stock.product_id === product.id
        );
    
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          count: productStock ? productStock.count : 0,
        };
      })

    context.log(response);

    context.res = {
        status: response?  200 : 400, /* Defaults to 200 */
        body: response? response : context.log("Error with list of resources")
    };

};

export default httpTrigger;