const fs = require('fs');

const secretsText = fs.readFileSync('secrets.json', { encoding: 'utf8' });
const secretJson = JSON.parse(secretsText);

const config = {};
config.host = process.env.HOST || secretJson.COSMOS_DB.ENDPOINT; // Get from Azure portal
config.authKey =
  process.env.AUTH_KEY || secretJson.COSMOS_DB.AUTH_KEY; // Get from Azure portal
config.databaseId = secretJson.COSMOS_DB.DATABASE_ID; // db name
config.containerId = "Items";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;
