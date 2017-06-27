USER_AUTHOR = { "structure" : {
                              "AUTHOR_ID": {"type": "INTEGER", "default": 0},
                              "FOLLOW_DATE": {"type": "TIMESTAMP", "default": 0},
                              "FOLLOW_STATE": {"type": "STRING", "default": None},
                              "FOLLOWING": {"type":"BOOLEAN", "default": False},
                              "FOLLOWING_SINCE": {"type": "TIMESTAMP", "default": None},
                              "USER_ID": {"type": "INTEGER", "default": 0},
                          },
               	"primary_key"  : "ID" }



USER_PRATILIPI = { "structure" : {

"ADDED_TO_LIB": {"type": "BOOLEAN", "default": False},
"ADDED_TO_LIB_DATE": {"type": "TIMESTAMP", "default": None},
"COMMENT_COUNT": {"type": "INTEGER", "default": 0},
"LAST_OPENED_DATE": {"type": "TIMESTAMP", "default": None},
"LAST_OPENED_PAGE": {"type": "STRING", "default": None},
"PRATILIPI_ID": {"type": "INTEGER", "default": 0},
"RATING": {"type": "INTEGER", "default": 0},
"RATING_DATE": {"type":	"TIMESTAMP", "default": None},
"REVIEW": {"type": "STRING", "default": None},
"REVIEW_DATE": {"type": "TIMESTAMP", "default": None},
"REVIEW_STATE": {"type": "STRING", "default": None},
"REVIEW_TITLE": {"type": "STRING", "default": None},
"USER_ID": {"type": "INTEGER", "default": 0},
},
"primary_key": "ID"
}
