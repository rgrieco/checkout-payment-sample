const express = require("express");
const app = express();
const cors = require("cors");
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "TEST-3130846003507029-030223-2072232e0bb3d174f1f339e808490e1c-276402374",
});
  

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(express.static("../../client"));

app.get("/", function (req, res) {
  res.status(200).sendFile("F:/checkout-payment-sample/client/index.html");
}); 

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": "http://localhost:3000/feedback",
			"failure": "http://localhost:3000/feedback",
			"pending": "http://localhost:3000/feedback"
		},
		auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id
			});
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/feedback', function(req, res) {
	res.json({
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	});
});

app.listen(3000, () => {
  console.log("The server is now running on Port 3000");
});
