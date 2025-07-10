<!-- User 

googleId ==> not required, type:string
email  ==> required, string
password ==> required, string
fullName ==> string, default : ''
headline ==> string, default : ''
currentCompany ==> string, default : ''
currentLocation ==> string, default : ''
profilePic : string, default : 'https://res.cloudinary.com/dm0rlehq8/image/upload/v1750167533/default_profile_pic_hrs7ed.jpg'
profileBanner : string, default:'https://res.cloudinary.com/dm0rlehq8/image/upload/v1750167749/default_banner_r0agoh.jpg'
about : string, default : ''
experience : [ {designation:{string}} , {companyName:{string}}, {duration:{string}}, location:{string} ]
friends : [{type:mongoose.schema.Types.objectId, ref:user}]
pendingRequest : [{type:mongoose.schema.Types.objectId, ref:user}]
resume : default : '' -->


<small>



### 🧑‍💻 User Schema

| Field Name        | Type                              | Required | Default Value                                                                                               | Description / Notes                           |
|-------------------|-----------------------------------|----------|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------|
| `googleId`        | `String`                          | ❌       | —                                                                                                            | Optional – used for Google OAuth              |
| `email`           | `String`                          | ✅       | —                                                                                                            | Required – User's email                       |
| `password`        | `String`                          | ✅       | —                                                                                                            | Required – Hashed password                    |
| `fullName`        | `String`                          | ❌       | `''`                                                                                                         | Full name of the user                         |
| `headline`        | `String`                          | ❌       | `''`                                                                                                         | User's professional tagline                   |
| `currentCompany`  | `String`                          | ❌       | `''`                                                                                                         | Company user is currently working at          |
| `currentLocation` | `String`                          | ❌       | `''`                                                                                                         | User's current location                       |
| `profilePic`      | `String`                          | ❌       | `https://res.cloudinary.com/dm0rlehq8/image/upload/v1750167533/default_profile_pic_hrs7ed.jpg`              | Profile picture URL                           |
| `profileBanner`   | `String`                          | ❌       | `https://res.cloudinary.com/dm0rlehq8/image/upload/v1750167749/default_banner_r0agoh.jpg`                   | Banner image URL                              |
| `about`           | `String`                          | ❌       | `''`                                                                                                         | Short user bio                                |
| `experience`      | `Array<Object>`                   | ❌       | `[]`                                                                                                         | Array of work experiences                     |

#### 📌 `experience` Object Structure

Each item in the `experience` array contains the following fields:

| Key             | Type     | Description                      |
|------------------|----------|----------------------------------|
| `designation`    | `String` | Job title                        |
| `companyName`    | `String` | Name of the company              |
| `duration`       | `String` | Time period (e.g. "Jan 2020 - Dec 2021") |
| `location`       | `String` | Location of the job              |

---

| Field Name        | Type                              | Required | Default Value | Description / Notes               |
|-------------------|-----------------------------------|----------|----------------|-----------------------------------|
| `friends`         | `Array<ObjectId>` (User Ref)      | ❌       | `[]`           | References to other user IDs      |
| `pendingRequest`  | `Array<ObjectId>` (User Ref)      | ❌       | `[]`           | Friend requests sent to the user  |
| `resume`          | `String`                          | ❌       | `''`           | URL/path to uploaded resume       |




</small>



<!-- postSchema
userId : mongoose.schema.types.objectId , ref : User , at the time of getAllPost , populate('User', -password)
description : string
postImage : string 
likes : [{type:mongoose.schema.types.objectId, ref:user}]
comments : number, default : 0 -->

### 📝 Post Schema

| Field Name   | Type                            | Required | Default Value | Description                               |
|--------------|----------------------------------|----------|----------------|-------------------------------------------|
| `user`     | `ObjectId` (ref: User)           | ✅       | —              | Reference to the user who created the post |
| `description`| `String`                         | ❌       | `''`           | Text content or caption of the post        |
| `postImage`  | `String`                         | ❌       | `''`           | URL/path of the image uploaded in the post |
| `likes`      | `Array<ObjectId>` (ref: User)    | ❌       | `[]`           | List of user IDs who liked the post        |
| `comments`   | `Number`                         | ❌       | `0`            | Total number of comments on the post       |


<!-- Post

postId => mongoose.schema.types.objectId , ref:post
user => mongoose.schema.types.objectId , ref:user
comment : string, required -->

### 💬 Comment Schema

| Field Name | Type                            | Required | Reference         | Description                                                                 |
|------------|----------------------------------|----------|--------------------|-----------------------------------------------------------------------------|
| `postId`   | `ObjectId`                      | ✅       | `Post`             | Refers to the post on which the comment is made                             |
| `user`     | `ObjectId`                      | ✅       | `User`             | Refers to the user who made the comment                                     |
| `comment`  | `String`                        | ✅       | —                  | The actual comment text submitted by the user                               |


<!-- 
conversation model
 members ==> [ {mongoose.schema.types.objectId, ref:'user' } ] -->

 ### 💬 Conversation Schema

| Field Name | Type                      | Required | Reference | Description                                        |
|------------|---------------------------|----------|-----------|----------------------------------------------------|
| `members`  | `Array of ObjectId`       | ✅       | `User`    | List of users participating in the conversation    |


<!-- 
Message
conversationId ==> mongoose.schema.types.Object , ref:'conversation'
sender ==> mongoose.schema.types.Object , ref:'user'
message : string
image : string -->

### 📩 Message Schema

| Field Name      | Type                      | Required | Reference     | Description                                           |
|------------------|---------------------------|----------|----------------|-------------------------------------------------------|
| `conversationId` | `ObjectId`                | ✅       | `Conversation` | ID of the conversation to which this message belongs |
| `sender`         | `ObjectId`                | ✅       | `User`         | ID of the user who sent the message                  |
| `message`        | `String`                  | ❌       | -              | Text content of the message                          |
| `image`          | `String` (URL)            | ❌       | -              | Image URL if the message contains an image           |





<!-- Notification
sender : mongoose.schema.types.Object , ref:'user'
receiver : mongoose.schema.types.Object , ref:'user'
content : string, required true
notificationType : {   type:string, required, enum:[friendrequest, comment]   }
isRead : type:Boolean, default:false
postId : type:String , default : '' -->

### 🔔 Notification Schema

| Field Name        | Type                      | Required | Reference | Description                                                                 |
|------------------|---------------------------|----------|-----------|-----------------------------------------------------------------------------|
| `sender`         | `ObjectId`                | ✅       | `User`    | The user who triggered the notification (e.g., sent a request, commented). |
| `receiver`       | `ObjectId`                | ✅       | `User`    | The user who receives the notification.                                    |
| `content`        | `String`                  | ✅       | -         | The main text content/message of the notification.                         |
| `notificationType` | `String`                | ✅       | -         | Type of notification. Must be one of: `friendrequest`, `comment`.          |
| `isRead`         | `Boolean`                 | ❌       | -         | Indicates whether the notification has been read. Defaults to `false`.     |
| `postId`         | `String` (or `ObjectId`)  | ❌       | `Post`    | ID of the related post if applicable (e.g., for comment notifications).    |
