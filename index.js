const fs = require('fs');
const {DefaultAzureCredential} = require("@azure/identity");
const {ResourceGraphClient} = require("@azure/arm-resourcegraph");

const credentials = new DefaultAzureCredential();
const client = new ResourceGraphClient(credentials);

const GET_RESOURCES_QUERY = {
    "query": `Resources
        | where tags.artifact_type == 'certified_product'`,
}

const GET_RESOURCE_CHANGES_QUERY = {
    "query": `
        ResourceChanges
        | extend timestamp = todatetime(properties.changeAttributes.timestamp)
        | order by timestamp desc
        `,
};

(async () => {
    const query = async () => {
        const resourcesResult = await client.resources(GET_RESOURCES_QUERY, {resultFormat: "table"});
        const resourceChangesResult = await client.resources(GET_RESOURCE_CHANGES_QUERY, {resultFormat: "table"});

        fs.writeFileSync('./Resources.json', JSON.stringify(resourcesResult.data));
        fs.writeFileSync('./ResourceChanges.json', JSON.stringify(resourceChangesResult.data));
    };

    await query();
})();