### AUTHENTICATION AND AUTHORIZATION ### dev journal

# MIDDLEWARES

1 authentication middleware

stands inbetween requests, checks if that incoming request is authenticated using JWT. If successfull with next() makes sure the process proceeds, if the authentication fails it terminates the request here and throws necessary error

process
-Extracts Authorization header from the request, checks the token from header or the bearer token

- If there is no token denied access(401) else procceed
  -Verifies the given token using jwt which takes in these aruments to complete the process(the actual token and our secret key encypted inside .env)
  -If all succeeds attatch the decoded payload, very important for the next steps
- Call next() to continue request flow

2 Multer middleware

Multer middleware intercepts incoming file upload requests
Process file uploads (like images, PDFs) making it easy to manage files sent from forms alongside regular text data,adding features like file filtering and size limits

process

1Configure storage using `multer.diskStorage` - Save files temporarily in `/uploads/` folder - Generate filename  
2 Apply file filter (checkFileFilter) - Allow only jpeg, jpg ,png, webp mimetypes - If invalid type → reject with error "Only image files are allowed"  
3 Set upload limits - Max file size = 5MB  
4 If file passes filter and size check → accept and save to `/uploads/`  
5 If any check fails → throw error and block upload  
6 Export `upload` middleware for use in routes

# Auth-routes and controllers

1 register user controller

This controller handles the logic of registering a user, hashing their password and adding the user information to the data base.

**use async await and wrap logic in try catch block and handle errors**

flow--
-extract user information from our request body
-check if the user already exists in the database ($or method to check for email or username)
-to register, hash the password befre adding queueing it to the data we will add to the database
-create new user to database and save
-return user details side for the password

2 login user controller

This controller handles the logic of loging in a user, unhashing and comparing passwords and creating token.
**use async await and wrap logic in try catch block and handle errors**

flow--
-user will enter username and password and we will find User in the DB by username
-check if the user exists and if user does go on
-Use compare method from bcrypt which takes in 2 arument (the user password and and the hashed password from the DB), hashes and compare the both if they match
-if they match we create token(it expires)
then return 201 response for success

3 change password controller
**the route is for authenticated users only, so in the route, added (authMiddleware)** to check authentication
This controller handles the changing password logic
**use async await and wrap logic in try catch block and handle errors**

flow--
-get old and new password from the request body
-check if the new and old password are the same
-check if user is not entering the old password as the new password as well
-get user info passed in the auth middleware
-find the user from the data base by Id, check if user exists then
-use bcrypt compare method to compare the old password against the userpassword
-hash the new password
-update and save the new password
-return 200

# home-routes

this is a home route(just returns a message for now)
the route is protected, every user that is registered can have access to it

- so we added the authMiddleware to ensure this

# admin-routes

this is an admin route(only returns a message)
this route is protected, only users with the admin role have acess to this route

- in the the route we add the authMiddleware and isAdmin middleware
  -the isAdmin middleware only checkes if the user has admin role then grants them access if they do

# image-routes and controllers

Image route This router is protected, **only authenticated users, admin role users can upload images here**

1 image upload controller

Cloudinary helper**It uploads image and return the most important info url(https url/secure) and publicId (used later to delete img etc).**

upload image to cloud controller

flow
-we get the file from the request body
-check if user entered file(req.file is set by multer when a file is uploaded)
-upload to cloud, local file path (req.file.path)is sent to cloudinary and cloudinary returns url and publiId
-create new image data to mongoDB which contains url, publicId and uploadedBy
-save
-delete the local file with unlink
-return 201 image uploaded successfully

2 fetch images controller
the route is protected, only logged in users can fetch images

# models

# Creating Models (Quick Notes)

--> 1 Define a schema

- Use **Mongoose** for MongoDB.

--> 2 Create the model

- Bind schema to a collection.
- Example: `const User = mongoose.model("User", userSchema);`

--> 3 Export the model

--> 4 Use the model in code

- Perform CRUD operations:

  - `User.create()` → add new document
  - `User.find()` → query documents
  - `User.updateOne()` → update document
  - `User.deleteOne()` → remove document

  pagination and rendering

<!-- /imageId -->
