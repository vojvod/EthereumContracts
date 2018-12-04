module.exports = {
    networks: {
        development: {
            host: "127.0.0.1",
            port: 7545,
            network_id: "5777" // Match any network id
        },
        // rinkeby: {
        //     host: "localhost", // Connect to geth on the specified
        //     port: 8545,
        //     from: "0x1a83f539cF6dEDe79Cb0443cB6D4F1A68B1eFCc9", // default address to use for any transaction Truffle makes during migrations
        //     network_id: 4,
        //     gas: 2082670 // Gas limit used for deploys
        // }
    }
};
