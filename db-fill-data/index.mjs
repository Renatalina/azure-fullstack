import { CosmosClient } from "@azure/cosmos";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

const key = process.env.COSMOS_KEY;
const endpoint = process.env.COSMOS_ENDPOINT;

const databaseName = `products-db`;
const container = {'products':'products', 'stock':'stock'};

const cosmosClient = new CosmosClient({ endpoint, key });

const database = cosmosClient.database(databaseName);
const containerProduct = database.container(container.products);
const containerStock = database.container(container.stock);

async function main() {
  for (let i = 0; i < 14; i++) {
    const id = uuidv4();
    const title = faker.commerce.productName();
    const description = faker.commerce.productDescription();
    const price = faker.commerce.price();
    const count = faker.string.numeric({ length: { min: 2, max: 10 } });

    const productItem = { id, title, description, price };
    const stockItem = { id, product_id: id, count };

    const { resource: createdProduct } = await containerProduct.items.create(
      productItem
    );
    console.log(`Created product: ${createdProduct.id}`);

    const { resource: createdStock } = await containerStock.items.create(
      stockItem
    );
    console.log(`Created stock: ${createdStock.product_id}`);
  }
}

main().catch((error) => {
  console.error(error);
});