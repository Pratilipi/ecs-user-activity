# ecs-user-activity    

# request
##### resource : user-activity/is_add_to_lib?userId=5649050225344512&pratilipiIds=[5071662873575424,5192735183077376,5684453372329984]
##### method : GET

##### response
```[
  {
    "addedToLib": true,
    "pratilipiId": "5071662873575424"
  },
  {
    "addedToLib": false,
    "pratilipiId": "5684453372329984"
  },
  {
    "addedToLib": true,
    "pratilipiId": "5192735183077376"
  }
]```
```



# request

##### resource : user-activity/is_following_author?userId=1&authorIds=[1,2,3]
##### method : GET

##### response
```[
  {
    "following": false,
    "authorId": "1"
  },
  {
    "following": false,
    "authorId": "3"
  },
  {
    "following": true,
    "authorId": "2"
  }
]```
