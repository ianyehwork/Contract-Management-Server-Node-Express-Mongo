# Introduction


## Project Requirement


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
