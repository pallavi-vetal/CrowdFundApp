module.exports = {
    networks: {
        ganache: {
            host: "localhost",
            port: 7545,
            gas: 5000000,
            network_id: "*" 
        }
    },
    ens: {
        enabled: true
      }
      
};