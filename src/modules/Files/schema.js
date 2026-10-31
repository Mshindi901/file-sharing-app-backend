import { sequelize } from "../../database/config.js";
import { DataTypes } from "sequelize";

const File = sequelize.define('files', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        references: {
            model: 'users',
            key: 'id'
        },
        allowNull: false
    },
    original_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    storage_path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mime_type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    size_bytes: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    share_token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    download_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {timestamps: true, indexes: [{fields: ['expires_at']}]});

export default File;