const client = require("../../bot");

async function findOne(type, filter, create = true) {
    const user_data = await client.db[type].findOne(filter);

    if (user_data) {
        return user_data;
    } else {
        if (create) {
            const create_user_data = await client.db[type].create(filter);
            create_user_data.new = true;
            return create_user_data;
        } else return null;
    };
};

module.exports = findOne;