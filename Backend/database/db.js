var Sequelize = require("sequelize")
var db = {}

var sequelize = new Sequelize("reuniaoprojeto", "root", "123456", {

    host: "localhost",
    dialect: "mysql",
    operatorsAliases: 0,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }

});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;