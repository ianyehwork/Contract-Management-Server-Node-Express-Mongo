# Introduction


## Project Dependencies
1) @line/bot-sdk: The LINE Messaging API SDK for nodejs makes it easy to develop bots.
2) bcryptjs: Optimized bcrypt in JavaScript with zero dependencies.
3) body-parser: Node.js body parsing middleware.
4) crypto-js: JavaScript library of crypto standards.
5) express: Fast, unopinionated, minimalist web framework for node.
6) googleapis: Node.js client library for using Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT tokens is included.
7) jsonwebtoken: An implementation of JSON Web Tokens.
8) lodash: The Lodash library exported as Node.js modules.
9) moment: Lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
10) mongodb: Official MongoDB driver for Node.js.
11) mongoose: MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports both promises and callbacks.
11) mongoose-transactions: Atomicity and Transactions for mongoose.
12) multer: Node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
13) nodemailer: Send e-mails from Node.js.
14) pdfmake: PDF document generation library for server-side and client-side usage in pure JavaScript.
15) request: Request is designed to be the simplest way possible to make http calls
16) validator: A library of string validators and sanitizers.

## Project Structure
<a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server">server</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/config/">config</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/config/config.js">config.js</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/config/config.json">config.json</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/">controllers</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/contract-api.js">contract-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/customer-api.js">customer-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/line-api.js">line-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/parking-area-api.js">parking-area-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/parking-lot-api.js">parking-lot-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/payment-api.js">payment-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/poster-api.js">poster-api.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/report-api.js">report-api.js</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/controllers/user-api.js">user-api.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/email/">email</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/email/email-service.js">email-service.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/line/">line</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/line/line-controller.js">line-controller.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/">middleware</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/authenticate-admin.js">authenticate-admin.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/authenticate.js">authenticate.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/contract-active.js">contract-active.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/customer-delete.js">customer-delete.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/parking-area-delete.js">parking-area-delete.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/parking-lot-available.js">parking-lot-available.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/parking-lot-delete.js">parking-lot-delete.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/payment-contract-active.js">payment-contract-active.js</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/middleware/poster-exists.js">poster-exists.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/">models</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/contract.js">contract.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/customer.js">customer.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/line-token.js">line-token.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/login-token.js">login-token.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/parking-area.js">parking-area.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/parking-lot.js">parking-lot.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/password-token.js">password-token.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/payment.js">payment.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/poster.js">poster.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/user-auth.js">user-auth.js</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/models/user.js">user.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/multer/">multer</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/multer/poster-image-upload.js">poster-image-upload.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/out.html">out.html</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/reports/">reports</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/reports/table-template.js">table-template.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/">routes</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/contract-routes.js">contract-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/customer-routes.js">customer-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/line-routes.js">line-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/parking-area-routes.js">parking-area-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/parking-lot-routes.js">parking-lot-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/payment-routes.js">payment-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/poster-routes.js">poster-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/report-routes.js">report-routes.js</a><br>
	│   ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/routes.js">routes.js</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/routes/user-routes.js">user-routes.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/server.js">server.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/test/">test</a><br>
	│   └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/test/test.js">test.js</a><br>
	├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/uploads/">uploads</a><br>
	└── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/util/">util</a><br>
	&nbsp;&nbsp;&nbsp; ├── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/util/captcha.js">captcha.js</a><br>
	&nbsp;&nbsp;&nbsp; └── <a href="https://github.com/ianyehwork/Contract-Management-Server-Node-Express-Mongo/tree/master/server/util/utility.js">utility.js</a><br>
	<br><br>
