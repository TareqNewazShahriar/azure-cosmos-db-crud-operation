const config = {};

config.host = process.env.HOST || "https://guineapig-db.documents.azure.com:443/";
config.authKey =
  process.env.AUTH_KEY || "WEGKTtZ6B75RIqjZksJRj9zZkkw5wonyR4e7hi5LBZB8NlclE7HdL5RaySbrWOSRB3JMvOEMM3UVACDbJlWyIw==";
config.databaseId = "guineapig-db";
config.containerId = "Items";

if (config.host.includes("https://localhost:")) {
  console.log("Local environment detected");
  console.log("WARNING: Disabled checking of self-signed certs. Do not have this code in production.");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.log(`Go to http://localhost:${process.env.PORT || '3000'} to try the sample.`);
}

module.exports = config;