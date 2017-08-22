**Post a Review**
----
This API is to post a review along with the rating.  
* **URL**  
  /user-activity/pratilipis/7890123456/reviews
* **Method:**  
  POST
* **Headers:**  
  User-Id (Clients would be sending Access-Token, 'auth' service internally converts Access-Token to User-Id)
* **Request Body**
  ~~~
  {
    "rating": 4,
    "review": "This is a very good story."
  }
  ~~~
* **Response**  
  * **Code:** 201 
  ~~~
  {
    "id": 0123456789,
    "rating": 4, 
    "review": "Awesome story",
    "referenceType": "PRATILIPI",
    "referenceId": "9012345678"
    "user": {
      "id": 8901234567,
      "fullName": "Sam",
      "fullNameEn": "Samanth",
      "displayName": "Giridhar Samanth"
      "profileImageUrl": "/"
    },
    "likesCount": 234,
    "commentsCount": 13,
    "hasAccessToUpdate": true,
    "state": "SUBMITTED",
    "relativeTime": "23 mins ago",
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
  
**Get Review by id**  
----
This API is to get review by id.
* **URL**  
  /user-activity/pratilipis/7890123456/reviews/0123456789?includes=comments
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
    "referenceId": "9012345678",
    "user": {
       "id": 8901234567,
      "fullName": "Sam",
      "fullNameEn": "Samanth",
      "displayName": "Giridhar Samanth"
      "profileImageUrl": "/"
    },
    "likesCount": 234,
    "commentsCount": 13,
    "comments": {
      "data": [
        {
          "id": 7890123456,
          "comment": "Well said",
          "user": {
             "id": 8901234567,
             "fullName": "Sam",
             "fullNameEn": "Samanth",
             "displayName": "Giridhar Samanth"
             "profileImageUrl": "/"
          },
          "likesCount": 12,
          "hasAccessToUpdate": true,
          "state": "ACTIVE",
          "relativeTime": "23 mins ago",
          "dateCreated": "2017-07-29 12:00:00+0530",
          "dateUpdated": "2017-07-29 12:00:00+0530"
        },
        {
	  //...
        }
      ],
      "cursor": "hof31u98y23hx8y3189upr823y4",
      "resultCount": 5,
      "numberFound": 30
    }
    "hasAccessToUpdate": true,
    "state": "SUBMITTED",
    "relativeTime": "23 mins ago",
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
    "message": "Review not found"
  }
  ~~~
   
**Get Review by reference id**
----
This API is to get reviews by reference.
* **URL**  
  /user-activity/pratilipis/7890123456/reviews?sort=userReview&cursor=u089x3yrn023ox4y2390x482&resultCount=5
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
        "id": 0123456789,
        "rating": 4, 
        "review": "Awesome story",
        "referenceType": "PRATILIPI",
        "referenceId": "9012345678"
        "user": {
           "id": 8901234567,
           "fullName": "Sam",
           "fullNameEn": "Samanth",
           "displayName": "Giridhar Samanth"
           "profileImageUrl": "/"
        },
        "likesCount": 234,
        "commentsCount": 13,
        "hasAccessToUpdate": true,
        "state": "SUBMITTED",
        "relativeTime": "23 mins ago",
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
      },
      {}
    ],
    "cursor": "23y80n49y234tydnr389027ctyp34",
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
  
**Update Review**  
----
This API is to update a review.
* **URL**  
  /user-activity/pratilipis/7890123456/reviews/1234567890
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
    "message": "Successfully updated review"
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
    "message": "Review not found"
  }
  ~~~
   
**Delete Review**  
----
This API is to delete a review.
* **URL**  
  /user-activity/pratilipis/7890123456/reviews/1234567890
* **Method:**  
  DELETE
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "message": "Successfully deleted review"
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
    "message": "Review not found"
  }
  ~~~


**Post a Comment**
----
This API is to post a comment.  
* **URL**  
  /user-activity/reviews/8901234567/comments
* **Method:**  
  POST
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "comment": "Very nice review."
  }
  ~~~
* **Response**  
  * **Code:** 201 
  ~~~
  {
    "id": 7890123456,
    "comment": "Well said",
    "referenceType": "REVIEW",
    "referenceId": "9012345678",
    "user": {
       "id": 8901234567,
       "fullName": "Sam",
       "fullNameEn": "Samanth",
       "displayName": "Giridhar Samanth"
       "profileImageUrl": "/"
    },
    "likesCount": 12,
    "state": "ACTIVE",
    "hasAccessToUpdate": true,
    "relativeTime": "23 mins ago",
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
 
**Get Comment by id**  
----
This API is to get comment by id.
* **URL**  
  /user-activity/reviews/8901234567/comments/0123456789
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
    "referenceId": "9012345678",
    "user": {
       "id": 8901234567,
       "fullName": "Sam",
       "fullNameEn": "Samanth",
       "displayName": "Giridhar Samanth"
       "profileImageUrl": "/"
    },
    "likesCount": 12,
    "state": "ACTIVE",
    "hasAccessToUpdate": true,
    "relativeTime": "23 mins ago",
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
  /user-activity/reviews/8901234567/comments?cursor=384yn289034y70283xyr234&resultCount=5
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
        "comment": "Well said",
        "referenceType": "REVIEW",
        "referenceId": "9012345678",
        "user": {
          "id": 8901234567,
          "fullName": "Sam",
          "fullNameEn": "Samanth",
          "displayName": "Giridhar Samanth"
          "profileImageUrl": "/"
        },
        "likesCount": 12,
        "state": "ACTIVE",
        "hasAccessToUpdate": true,
        "relativeTime": "23 mins ago",
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
      },
      {}
    ],
    "cursor": "23894yxn29038y98273r93xrfp2r",
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
  /user-activity/reviews/8901234567/comments/1234567890
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
  /user-activity/reviews/8901234567/comments/1234567890
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
  /user-activity/comments/9012345678/votes
* **Method:**  
  POST
* **Headers:**  
  User-Id
* **Request Body**
  ~~~
  {
    "type": "LIKE"
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
  /user-activity/comments/9012345678/votes?type=LIKE&cursor=y803y4x02783n9rxy8r38238rn&resultCount=5
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
        "referenceId": 9012345678,
        "user": {
           "id": 8901234567,
           "fullName": "Sam",
           "fullNameEn": "Samanth",
           "displayName": "Giridhar Samanth"
           "profileImageUrl": "/"
        },
        "hasAccessToUpdate": true,
	"relativeTime": "23 mins ago",
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
      },
      {}
    ],
    "cursor": "23x8923y480nxy23784y3yfx23",
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

**Post Follow**
----
This API is to follow an author.  
* **URL**  
  /user-activity/authors/3290834720394/follows
* **Method:**  
  POST
* **Headers:**  
  User-Id  
* **Request Body**
  ~~~
  {
    "state": "FOLLOWING"
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
  /user-activity/authors/3290834720394/follows/followers?cursor=89323y8x9023h0x8mfh2309fh083&resultCount=5
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
        id:"3489523352453",
	"referenceType": "AUTHOR",
        "referenceId": 1234567890,
        "user": {
           "id": 8901234567,
           "fullName": "Sam",
           "fullNameEn": "Samanth",
           "displayName": "Giridhar Samanth"
           "profileImageUrl": "/"
        },
        "hasAccessToUpdate": true,
        "state": "FOLLOWING",
	"relativeTime": "23 mins ago",
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
      },
      {}
    ],
    "cursor": "2i3urnc890234y280yf2349cfy",
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
  /user-activity/users/34786534876534/follows/following?cursor=380n4y238y794yn238ry&resultCount=5
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
        "id": 9928789324503,
        "author": {
           "id": 8901234567,
           "fullName": "Sam",
           "fullNameEn": "Samanth",
           "displayName": "Giridhar Samanth"
           "profileImageUrl": "/"
        },
        "hasAccessToUpdate": true,
        "state": "FOLLOWING",
	"relativeTime": "23 mins ago",
        "dateCreated": "2017-07-29 12:00:00+0530",
        "dateUpdated": "2017-07-29 12:00:00+0530"
      },
      {
	//...
      }
    ],
    "cursor": "3489n2308fy230fyx390eu393",
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
  
**Is following**
----
This API is to check if user is following
* **URL**  
  /user-activity/follows/isFollowing?userId=34786534876534&referenceType=AUTHOR&referenceId=95234234343,987637846534
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "userId": 34786534876534,
    "data":[
      {
        "following": true,
        "referenceId": 95234234343,
        "referenceType": "AUTHOR"
      },
      {
	    //...
      }
    ]
  }
  ~~~
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~    

**Is Added to library**
----
This API is to check if user has added pratilipi to library
* **URL**  
  /user-activity/library/isAdded?userId=34786534876534&pratilipiId=95234234343,987637846534
* **Method:**  
  GET
* **Headers:**  
  User-Id
* **Response**  
  * **Code:** 200 
  ~~~
  {
    "userId": 34786534876534,
    "data":[
      {
        "isAdded": true,
        "pratilipiId": 95234234343
      },
      {
	//...
      }
    ]
  }
  ~~~
  -or-  
  * **Code:** 400 
  ~~~
  {
    "message": "Invalid parameters"
  }
  ~~~  
