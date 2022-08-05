import { Sequelize, SequelizeOptions } from "sequelize-typescript";

const sequelizeOptions: SequelizeOptions = {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    sync: { force: true },
};

export function setupSequelize(options: SequelizeOptions = {}) {

    let _sequelize: Sequelize;

    beforeAll(() => _sequelize = new Sequelize({
        ...sequelizeOptions,
        ...options,
    }));

    beforeEach(async () => {
        await _sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await _sequelize.close()
    });

    return {
        get sequelize() {
            return _sequelize;
        },
    };
};

// const sequelize = setupSequelize();