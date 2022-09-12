import { Model, DataTypes } from "sequelize";
import db from "../loaders/db.js";
class SanctionNationality extends Model {
}
SanctionNationality.init({
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        autoIncrement: false,
        defaultValue: DataTypes.UUIDV4
    },
    sanction: {
        type: DataTypes.UUID,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: true
    },
    country: {
        type: DataTypes.STRING,
        allowNull: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true
    },
    stateOrProvince: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, {
    timestamps: true,
    sequelize: db,
    tableName: 'SanctionNationality',
    modelName: 'SanctionNationality',
});
await SanctionNationality.sync();
// Info.belongsTo(SanctionEntity)
export default SanctionNationality;