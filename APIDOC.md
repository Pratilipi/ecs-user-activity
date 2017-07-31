**Post a Rate-Review**
----
This API is to post a review along with the rating.  
* **URL**  
  /user-activity/rate-reviews
* **Method:**  
  POST
* **Headers:**  
  User-Id
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
    "message": "Successfully added the rate-review"
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
This API is to get rate-review by id.
* **URL**  
  /user-activity/rate-reviews/0123456789?fields=comments
* **Method:**  
  GET
* **Headers:**  
  User-Id
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
          "voteCount": 12,
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
This API is to get rate-reviews by reference.
* **URL**  
  /user-activity/rate-reviews?reference_type=PRATILIPI&reference_id=1234567890
* **Method:**  
  GET
* **Headers:**  
  User-Id
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
This API is to update a rate-review.
* **URL**  
  /user-activity/rate-reviews/1234567890
* **Method:**  
  PATCH
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "rating": 4,
    "review": "This is a very good story.",
    "state": "PUBLISHED"
  }
  ~~~  
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
    "message": "Rate-Review not found"
  }
  ~~~
   
**Delete Rate-Review**  
----
This API is to delete a rate-review.
* **URL**  
  /user-activity/rate-reviews/1234567890
* **Method:**  
  DELETE
* **Headers:**  
  User-Id
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
    "message": "Rate-Review not found"
  }
  ~~~


**Post a Comment**
----
This API is to post a comment.  
* **URL**  
  /user-activity/comments
* **Method:**  
  POST
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "comment": "Very nice review.",
    "referenceType": "REVIEW",
    "referenceId": 1234567890
  }
  ~~~
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully added the comment"
  }
  ~~~   
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~    
 
**Get Comment by id**  
----
This API is to get comment by id.
* **URL**  
  /user-activity/comments/0123456789
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "id": 7890123456,
    "comment": "Well said",
    "referenceType": "REVIEW",
    "referenceId": "9012345678"
    "user": {
      "id": 6789012345,
      "name": "raghu",
      "profilePicUrl: "/"
    },
    "voteCount": 12,
    "state": "ACTIVE",
    "hasAccessToUpdate": true,
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
    "message": "Comment not found"
  }
  ~~~ 
  
**Get Comments by reference id**
----
This API is to get comments by reference.
* **URL**  
  /user-activity/comments?reference_type=REVIEW&reference_id=1234567890
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "data":[
      {
        // refer 'Get comment by id'
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
  
**Update Comment**  
----
This API is to update a comment.
* **URL**  
  /user-activity/comments/1234567890
* **Method:**  
  PATCH
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "comment": "Very nice review."
  }
  ~~~  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully updated comment"
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
    "message": "Comment not found"
  }
  ~~~
   
**Delete Comment**  
----
This API is to delete a comment.
* **URL**  
  /user-activity/comments/1234567890
* **Method:**  
  DELETE
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully deleted comment"
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
    "message": "Comment not found"
  }
  ~~~

**Post a Vote**
----
This API is to post a vote.  
* **URL**  
  /user-activity/votes
* **Method:**  
  POST
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "type": "LIKE",
    "referenceType": "COMMENT",
    "referenceId": 1234567890
  }
  ~~~
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully added the vote"
  }
  ~~~   
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~  
  
**Get votes by reference id**
----
This API is to get votes by reference.
* **URL**  
  /user-activity/votes?reference_type=COMMENT&reference_id=1234567890
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "data":[
      {
        "id": 7890123456,
        "type": "LIKE",
        "referenceType": "COMMENT",
        "referenceId": "9012345678"
        "user": {
          "id": 6789012345,
          "name": "raghu",
          "profilePicUrl: "/"
        },
        "hasAccessToUpdate": true,
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
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
  
**Update Vote**  
----
This API is to update a vote.
* **URL**  
  /user-activity/votes/1234567890
* **Method:**  
  PATCH
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "type": "NONE"
  }
  ~~~  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully updated vote"
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
    "message": "Vote not found"
  }
  ~~~   

**Post Follow**
----
This API is to follow an author.  
* **URL**  
  /user-activity/follows
* **Method:**  
  POST
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "referenceType": "COMMENT",
    "referenceId": 1234567890
  }
  ~~~
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully followed"
  }
  ~~~   
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~  
  
**Get followers**
----
This API is to get followers by reference.
* **URL**  
  /user-activity/follows/followers?reference_type=AUTHOR&reference_id=1234567890
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "referenceType": "AUTHOR",
    "referenceId": 1234567890,
    "data":[
      {
        id:"3489523352453",
	"user": {
          "id": 6789012345,
          "name": "raghu",
          "profilePicUrl: "/"
        },
        "hasAccessToUpdate": true,
	"state": "FOLLOWING"
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
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
  
**Get following list**
----
This API is to get following list.
* **URL**  
  /user-activity/follows/following
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    
    "data":[
      {
        referenceType: "AUTHOR"
        refereceId:"3489523352453",
	"user": {
          "id": 6789012345,
          "name": "raghu",
          "profilePicUrl: "/"
        },
        "hasAccessToUpdate": true,
	"state": "FOLLOWING"
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
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

**Update Follow**  
----
This API is to update a follow.
* **URL**  
  /user-activity/follows/1234567890
* **Method:**  
  PATCH
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "state": "UNFOLLOWED"
  }
  ~~~  
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully updated follow"
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
    "message": "Follow not found"
  }
  ~~~   
