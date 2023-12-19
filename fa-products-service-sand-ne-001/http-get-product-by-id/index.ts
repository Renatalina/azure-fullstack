import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import productList from "../constant";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function http-get-product-by-id processed a request.');
    const { productId } = req.params;
    const product = productList?.find(item => item.id === productId);

    context.res = {
        status: product? 200 : 404, /* Defaults to 200 */
        body: product ? product : console.error("Product not found")        
    };
};

export default httpTrigger;