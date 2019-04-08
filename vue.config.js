module.exports = {
    pluginOptions: {
      electronBuilder: {
        builderOptions: {
            "productName": "regs",
            "appId": "scripter.regs",
            "win": {
                "target": [
                    "portable"
                ]
            },
            "portable": {
                "artifactName": "regs_portable.exe"
            }
        }
      }
    }
  }