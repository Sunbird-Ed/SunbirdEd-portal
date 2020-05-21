# Migration from QUML version 0.5 to QUML version 1.0

## Requirement

Old 'PracticeQuestionSet' contents created on platform do not show print option in application. Such 'PracticeQuestionSet' are to be modified to show print option.

## Solution

To achieve this, Questions should be updated in QUML version 1.0 format which contains property such as ***editorstate*** and ***responseDeclaration***
***Itemsets*** has to be created from updated ***questions*** and linked to ***content***
if content is live it has to ***publish*** again

## Migration Steps

- **Step 1**: Get the content which doesn't have itemset property using composite search
	   
	    EndPoint: /composite/v3/search
	    requestParameters:  
	    {
	    		  "request": {
	    		    "exists": "questions",
	    		    "filters": {
	    		      "contentType": "PracticeQuestionSet",
	    		      "medium": "English",
	    		      "objectType": "Content"
	    		    },
	    		    "not_exists": "itemSets",
	    		    "sort_by": {
	    		      "createdOn": "desc"
	    		    }
	    		  }
	    		}

- **Step 2**: Get the question from content
		
		EndPoint: /assessment/v3/items/read

- **Step 3**: update the structure as per QUML version 1.0 which is to add editorState and responseDeclaration and update the quesioon

		EndPoint: /assessment/v3/items/update/
- **Step 4**: Create the itemset using items/Questions
		
		EndPoint: /itemset/v3/create
		requestParameter: 
		{
            "request": {
                "itemset": {
                    "code": uuidv4(),
                    "name": value.name,
                    "description": value.name,
                    "language": _.split(value.language),
                    "owner": value.author,
                    "items": questionIdObjForItemset
                }
            }
        }
        
 - **Step 5**: update content with itemset
 
      		Endpoint: /content/v3/update/
      		requestParameters:
      		{
	        "request": {
	          "content": {
	            "itemSets": [
	              {
	                "identifier": itemSetIdentifier
	              }
	            ],
	            "versionKey": versionKey
	          }
	        }
	      }  
- Step 6: Publish content if status of content is live

	    	EndPoint: /content/v3/publish/
	    	requestParameters:
	    	 {
		        "request": {
		          "content": {
		            "publisher": "EkStep",
		            "lastPublishedBy": "EkStep"
		          }
		        }
		      }
