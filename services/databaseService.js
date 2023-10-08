// @ts-check
const CosmosClient = require('@azure/cosmos').CosmosClient

// For simplicity we'll set a constant partition key
const partitionKey = undefined

class DatabaseService {
   /**
    * Manages reading, adding, and updating Tasks in Azure Cosmos DB
    * @param {CosmosClient} cosmosClient
    * @param {string} databaseId
    * @param {string} containerId
    */
   constructor(cosmosClient, databaseId, containerId) {
      this.client = cosmosClient
      this.databaseId = databaseId
      this.collectionId = containerId

      this.database = null
      this.container = null
   }

   async init() {
      const dbResponse = await this.client.databases.createIfNotExists({
         id: this.databaseId
      })
      this.database = dbResponse.database
      const coResponse = await this.database.containers.createIfNotExists({
         id: this.collectionId
      })
      this.container = coResponse.container
   }

   async getItem(itemId) {
      const { resource } = await this.container.item(itemId, partitionKey).read()
      return resource;
   }

   /**
    * Performs SQL query on a container.
    * @param {string} containerName
    * @param {array|object} parameters: in the format [{ name: '@name_of_column', value: x }]. If only on parameter, then just pass the object without array.
    */
   find(containerName, parameters) {
      const querySpec = {
         query: `SELECT * FROM ${containerName}`,
         parameters: parameters instanceof Array ? parameters : [parameters]
      };

      return new Promise((resolve, reject) => {
         this.container.items.query(querySpec)
            .fetchAll()
            .then(response => {
                resolve(response.resources)
            })
            .catch(error => {
               reject(error)
            })
      })
   }

   async addItem(item) {
      item.date = Date.now()
      item.completed = false

      return new Promise((resolve, reject) => {
         this.container.items.create(item, { preTriggerInclude: ['addToDoItemTimestamp'] })
            .then(r => {
               console.log('Created.', r);
               resolve(r.resource);
            })
            .catch(err => {
               console.log('Error on create.', err);
               reject(err);
            });
      });
   }

   async updateItem(itemId) {
      const doc = await this.getItem(itemId)
      doc.completed = true

      return new Promise((resolve, reject) => {
         this.container
            .item(itemId, partitionKey)
            .replace(doc)
            .then(r => {
               resolve(r.resource);
            })
            .catch(err => {
               reject(err);
            });
      });
   }
}

module.exports = DatabaseService