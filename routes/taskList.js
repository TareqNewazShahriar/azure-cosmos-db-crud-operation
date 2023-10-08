const DatabaseService = require("../services/databaseService");

class TaskList {
   /**
    * Handles the various APIs for displaying and managing tasks
    * @param {TaskDao} DatabaseService
    */
   constructor(DatabaseService) {
      this.DatabaseService = DatabaseService;
   }

   async showTasks(req, res) {
      const items = await this.DatabaseService.find('root', { name: "@completed", value: false });
      res.render("index", {
         title: "My ToDo List",
         tasks: items
      });
   }

   async addTask(req, res) {
      const item = req.body;

      await this.DatabaseService.addItem(item);
      res.redirect("/");
   }

   async completeTask(req, res) {
      const completedTasks = Object.keys(req.body);
      const tasks = [];

      completedTasks.forEach(task => {
         tasks.push(this.DatabaseService.updateItem(task));
      });

      await Promise.all(tasks);

      res.redirect("/");
   }
}

module.exports = TaskList;