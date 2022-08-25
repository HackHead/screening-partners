import { Model, DataTypes } from "sequelize";
import db from "../loaders/db.js";
import SanctionAddress from "../models/SanctionAddress.model.js";
import SanctionAlias from "../models/SanctionAlias.model.js";
import SanctionInfo from "../models/SanctionInfo.model.js";
import SanctionProgram from "../models/SanctionProgram.model.js";
class SanctionEntity extends Model {
}
SanctionEntity.init({
    uid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false
    },
    authority: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    created: {
        type: DataTypes.DATE,
        defaultValue: Date.now,
    },
    latestUpdate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    // authority: {
    //     type: DataTypes.STRING,
    //     allowNull: false
    // }
}, {
    timestamps: false,
    sequelize: db,
    tableName: 'SanctionEntity',
    modelName: 'SanctionEntity',
});
SanctionEntity.hasMany(SanctionAddress, {
    foreignKey: "sanction",
    onDelete: 'CASCADE',
    hooks: true
});
SanctionEntity.hasMany(SanctionAlias, {
    onDelete: 'CASCADE',
    foreignKey: "sanction",
    hooks: true
});
SanctionEntity.hasMany(SanctionInfo, {
    onDelete: 'CASCADE',
    foreignKey: "sanction",
    hooks: true
});
SanctionEntity.hasMany(SanctionProgram, {
    onDelete: 'CASCADE',
    foreignKey: "sanction",
    hooks: true
});
await SanctionEntity.sync();
export default SanctionEntity;
