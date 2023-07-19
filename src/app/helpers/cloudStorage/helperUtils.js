const env = process.env
export const mapCloudConfig = (cloudConfig)=>{
    Object.keys(cloudConfig).forEach((item) => {
        cloudConfig[item] = env[item]
    })
    return  cloudConfig;
  }