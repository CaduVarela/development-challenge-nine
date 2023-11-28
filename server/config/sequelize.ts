import { Sequelize } from "sequelize";

const sequelize = new Sequelize('medcloud_challenge_nine', process.env.MYSQL_USER || 'root', process.env.MYSQL_PASSWORD || 'admin', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
        
    }
})

export = sequelize