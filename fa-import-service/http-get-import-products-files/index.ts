import { BlobServiceClient, generateBlobSASQueryParameters, SASProtocol, BlobSASPermissions } from "@azure/storage-blob";
import { AzureFunction, Context, HttpRequest } from "@azure/functions";
require('dotenv').config();

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const fileName = req.query.name;
    const containerName = 'natalinas-container'; 

    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage || '');
    context.log(blobServiceClient);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    context.log(containerClient);
    const blobClient = containerClient.getBlockBlobClient(fileName);

    const blobSAS = generateBlobSASQueryParameters(
        {
            containerName,
            blobName: fileName,
            permissions: BlobSASPermissions.parse('w'), 
            startsOn: new Date(),
            expiresOn: new Date(new Date().valueOf() + 86400), 
        },
        blobServiceClient.credential as any
    ).toString();

    const sasUrl = `${blobClient.url}?${blobSAS}`;

    context.res = {
        body: { sasToken: sasUrl }
    };
};

export default httpTrigger;