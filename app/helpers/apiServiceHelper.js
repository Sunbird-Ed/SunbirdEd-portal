const request = require("request"),
    env = process.env;

const contentURL = env.sunbird_content_player_url || 'http://localhost:5000/api/sb/v1/';
const learnerURL = env.sunbird_learner_player_url || 'http://52.172.36.121:9000/v1/';

exports.sendRequest = function(req, res) {
    console.log(req.params["0"]);
    if (req.params["0"]) {
        let serviceType = req.params["0"].split('/')[0]
        let serviceURL = req.params["0"].split('/').slice(1).join('/')
        switch (serviceType) {
            case "content":
                console.log('req.url',req.url);
                break;
            case "learner":
                
                break;
            default:
                res.end();
                break;
        }
    }

    res.end();
}
