import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config(); 


const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;
const databaseName = `products-db`;
const container = {'products':'products', 'stock':'stock'};

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);

const interfaceProduct = {
    title: "",
    price: 0,
    description: "",
    count: 1
}

const validate = (product: object) => {
  const item = Object.keys(product);
  
  for (const key of item) {
    if (!(key in interfaceProduct)) return false;
  }
  
    return true;
  };

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log(req);

    if(validate (req.body)) {
    req.body.id=uuidv4();

    const results= await containerProduct.items.create(req.body);
    context.log(results);

    context.res = {
        status: results.resource? 200 : 404, 
        body: results.resource? results.resource : { errorMessage : "Server error" }
    };
    } else {
        context.res = {
            status:  400 ,
            body:  { errorMessage: "Error. Data is invalid" }
        };
    }

};

export default httpTrigger;
