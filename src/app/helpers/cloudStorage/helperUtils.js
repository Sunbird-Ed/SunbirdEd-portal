const env = process.env
 const mapCloudConfig = (cloudConfig)=>{
    Object.keys(cloudConfig).forEach((item) => {
        cloudConfig[item] = env[item]
    })
    return  cloudConfig;
  }
  module.exports={mapCloudConfig}