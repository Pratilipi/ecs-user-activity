**Post a Rate-Review**
----
This API is to post a review along with the rating.  
* **URL**  
  /user-activity/rate-reviews
* **Method:**  
  POST
* **Headers:**  
  User-Id (Requests coming from internal services)
* **Request Body**
  ~~~
  {
    "rating": 4,
    "review": "This is a very good story.",
    "referenceType": "PRATILIPI",
    "referenceId": 1234567890
  }
  ~~~
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully added the review"
  }
  ~~~   
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~    
  
**Get Rate-Review by id**  
----
This API is to get 'Rate-Review' by id.
* **URL**  
  /user-activity/rate-reviews/0123456789?fields=comments
* **Method:**  
  GET
* **Headers:**  
  User-Id (Requests coming from internal services)  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "id": 0123456789,
    "rating": 4, 
	  "review": "Awesome story",
	  "referenceType": "PRATILIPI",
	  "referenceId": "9012345678"
	  "user": {
		  "id": 8901234567,
		  "name": "Sam",
		  "profilePicUrl": "/"
    },
    "votesCount": 234,
    "comments": {
	    "data": [
        {
		      "id": 7890123456,
    		  "comment": "Well said",
		      "user": {
    		    "id": 6789012345,
		        "name": "raghu",
		        "profilePicUrl: "/"
          },
          "voteCount": 12
          "state": "ACTIVE",
          "dateCreated": "2017-07-29 12:00:00+0530",
          "dateUpdated": "2017-07-29 12:00:00+0530"
        },
        {
	        //...
        }
      ],
      "cursor": 10,
      "resultCount": 5,
      "numberFound": 30
    }
    "hasAccessToUpdate": true,
    "state": "SUBMITTED",
    "dateCreated": "2017-07-29 12:00:00+0530",
    "dateUpdated": "2017-07-29 12:00:00+0530"
  }
  ~~~   
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~
  -or-  
  * **Code:** 404 
  ~~~
  {
    "message": "Rate-Review not found"
  }
  ~~~
   
**Get Rate-Review by reference id**
----
This API is to get 'Rate-Review's by reference.
* **URL**  
  /user-activity/rate-reviews?reference_type=PRATILIPI&reference_id=1234567890
* **Method:**  
  GET
* **Headers:**  
  User-Id (Requests coming from internal services)  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "data":[
      {
        // refer 'Get review by id'
      },
      {}
    ],
    "cursor": 10,
    "resultCount": 5,
    "numberFound": 30
  }
  ~~~
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~
  -or-  
  * **Code:** 404 
  ~~~
  {
    "message": "Reference not found"
  }
  ~~~
  
**Update Rate-Review**  
----
This API is to update a 'Rate-Review'.
* **URL**  
  /user-activity/rate-reviews?reference_type=PRATILIPI&reference_id=1234567890
* **Method:**  
  PATCH
* **Headers:**  
  User-Id (Requests coming from internal services)  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully updated rate-review"
  }
  ~~~
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~
  -or-  
  * **Code:** 404 
  ~~~
  {
    "message": "Reference not found"
  }
  ~~~
   
**Delete Rate-Review**  
----
This API is to delete a 'Rate-Review'.
* **URL**  
  /user-activity/rate-reviews/1234567890
* **Method:**  
  DELETE
* **Headers:**  
  User-Id (Requests coming from internal services) 
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully deleted rate-review"
  }
  ~~~
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~
  -or-  
  * **Code:** 404 
  ~~~
  {
    "message": "Reference not found"
  }
  ~~~
