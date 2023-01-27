export const mockData =  {
  "onboardingDisabled"  : [
   {
      "stepLabel": "Step 3:BMGS",
      "description": "Form step to accept BMGS from User",
      "title": "To discover relevant content update the following details",
      "subtitle": "Your preferences",
      "footer": "Your details helps us to search better",
      "isEnabled": false,
      "sequence": 1,
      "isMandatory": true,
      "resubmission": true,
      "renderOptions": { "type": "component","name" : "BMGS"},
      "defaults": {
        board: ["State (Tamil Nadu)"], 
        gradeLevel: ["Class 1"], 
        medium: ["Tamil"]
      }
    },
    
    {
      "stepLabel": "Step 1:userType",
      "description": "Form step to accept userType from User",
      "title": "To discover relevant content update the following details",
      "subtitle": "Your preferences",
      "footer": "Your details helps us to search better",
      "isEnabled": false,
      "sequence": 2,
      "isMandatory": true,
      "resubmission": true,
      "renderOptions": { "type": "component","name" : "userType"},
      "defaults": { role:'Others'}
    },
    {
      "stepLabel": "Step 2:Location",
      "description": "Form step to accept Location from User",
      "title": "To discover relevant content update the following details",
      "subtitle": "Your preferences",
      "footer": "Your details helps us to search better",
      "isEnabled": false,
      "sequence": 3,
      "isMandatory": true,
      "resubmission": true,
      "renderOptions": { "type": "component","name" : "Location"},
      "defaults": {
        district: 'Bidar',
        state: 'Karnataka'
      }
    }],
    "onboardingEnabled" : [

    {
        "stepLabel": "Step 1:userType",
        "description": "Form step to accept userType from User",
        "title": "To discover relevant content update the following details",
        "subtitle": "Your preferences",
        "footer": "Your details helps us to search better",
        "isEnabled": true,
        "sequence": 2,
        "isMandatory": true,
        "resubmission": true,
        "renderOptions": { "type": "component","name" : "userType"},
        "defaults": { role:'Others'}
      },
    {
        "stepLabel": "Step 3:BMGS",
        "description": "Form step to accept BMGS from User",
        "title": "To discover relevant content update the following details",
        "subtitle": "Your preferences",
        "footer": "Your details helps us to search better",
        "isEnabled": true,
        "sequence": 1,
        "isMandatory": true,
        "resubmission": true,
        "renderOptions": { "type": "component","name" : "BMGS"},
        "defaults": {
          board: ["State (Tamil Nadu)"], 
          gradeLevel: ["Class 1"], 
          medium: ["Tamil"]
        }
      },
    {
        "stepLabel": "Step 2:Location",
        "description": "Form step to accept Location from User",
        "title": "To discover relevant content update the following details",
        "subtitle": "Your preferences",
        "footer": "Your details helps us to search better",
        "isEnabled": true,
        "sequence": 3,
        "isMandatory": true,
        "resubmission": true,
        "renderOptions": { "type": "component","name" : "Location"},
        "defaults": {
          district: 'Bidar',
          state: 'Karnataka'
        }
      }
 ],
 "enbledDForOneScreen" : [
    {
        "stepLabel": "Location",
        "description": "Form step to accept Location from User",
        "title": "To discover relevant content update the following details",
        "subtitle": "Your preferences",
        "footer": "Your details helps us to search better",
        "isEnabled": true,
        "sequence": 1,
        "isMandatory": true,
        "resubmission": true,
        "renderOptions": { "type": "component","name" : "Location"},
        "defaults": {
          district: 'Bidar',
          state: 'Karnataka'
        }
      }
],
 tenantData: {
    "titleName": "sunbird",
    "logo": "http://localhost:3000/assets/images/sunbird_logo.png",
    "poster": "http://localhost:3000/assets/images/sunbird_logo.png",
    "favicon": "http://localhost:3000/assets/images/favicon.ico",
    "appLogo": "http://localhost:3000/assets/images/sunbird_logo.png"
    }
}