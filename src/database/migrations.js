module.exports = {
    createAndDrop: (tables) => ({
        up: async (queryInterface, Sequelize) => {
            Object.keys(tables).forEach(async (key) => {
                console.log(`creating table: ${key.toLowerCase()}`);
                await queryInterface.createTable(key, tables[key]);
            })
        },
        down: async (queryInterface, Sequelize) => {
            const keys = Object.keys(tables);
            for (let i = keys.length - 1; keys[i] != undefined; i--){
                console.log(`droping table: ${keys[i].toLowerCase()}`);
                await queryInterface.dropTable(keys[i]);
            }                
        }
    })
}