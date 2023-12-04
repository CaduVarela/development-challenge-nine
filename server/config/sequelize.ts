import { Sequelize } from "sequelize";

const sequelize = new Sequelize('challenge_nine_database', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD || 'password', {
    host: "database",
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        
    }
})

export = sequelize