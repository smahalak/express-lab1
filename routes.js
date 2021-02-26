





"use strict ";


//require the Express module
const express = require("express");

//Creates a new router object
const routes = express.Router();

const cartItems = [

    { id: 1, product: "Keyboard", price: 100, quantity: 1 },
    { id: 2, product: "Mouse", price: 40, quantity: 1 },
    { id: 3, product: "Monitor", price: 300, quantity: 3 },
    { id: 4, product: "Sticky Notes", price: 1, quantity: 30 },

]

let nextId = 5;

// 1. GET /cart-items
// a. Action: None
// b. Response: a JSON array of all cart items
// c. Response Code: 200 (OK)
// d. Query string parameters: the request may have one of the following or it may
// have none. (See tests below for examples.)
// i. maxPrice - if specified, only include products that are at or below this
// price.
// ii. prefix - if specified, only includes products that start with the given
// string in the response array.
// iii. pageSize - if specified, only includes up to the given number of items in
// the response array. For example, if there are ten items total, but
// pageSize=5, only return an array of the first five items

routes.get("/cart-items", (req, res) => {

    let maxPrice = req.query.maxPrice;
    let filteredItems = cartItems;

    let prefix = req.query.prefix;

    let pageSize = req.query.pageSize;


    if (maxPrice) {
        filteredItems = filteredItems.filter((item) => {
            return item.price <= maxPrice;
        })
    }

    if (prefix) {
        filteredItems = filteredItems.filter((item) => {
            return item.product.toLowerCase().includes(prefix.toLowerCase().trim());
        })
    }

    if (pageSize) {
        filteredItems = filteredItems.slice(0, pageSize);
    };

    res.status(200);
    res.json(filteredItems);


})

// 2. GET /cart-items/:id
// a. Action: None
// b. Response: a JSON object of the item with the given ID
// c. Response Code: 200 (OK)
// d. However, if the item with that ID cannot be found in the array, return a string
// response “ID Not Found” with response code 404 (Not Found)



routes.get("/cart-items/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let foundProduct = cartItems.find((item) => {
        return item.id === id;
    })

    if (foundProduct) {
        res.status(200);
        res.json(foundProduct);

    } else {
        res.status(404);
        res.send(`No product with ${id}`);

    }

})


// 3. POST /cart-items
// a. Action: Add a cart item to the array using the JSON body of the request. Also
// generate a unique ID for that item.
// b. Response: the added cart item object as JSON.
// c. Response Code: 201 (Created)

routes.post("/cart-items", (req, res) => {
    let product = req.body;
    product.id = nextId++;
    cartItems.push(product);

    res.status(201);
    res.json(product);

})


// 4. PUT /cart-items/:id
// a. Action: Update the cart item in the array that has the given id. Use the JSON
// body of the request as the new properties.
// b. Response: the updated cart it


routes.put("/cart-items/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let updatedProduct = req.body;
    updatedProduct.id = id;

    let index = cartItems.findIndex((item) => {
        return item.id === id;
    })
    if (index === -1) {
        res.status(404)
        res.send(`No product found with id: ${id}`)
    } else {
        cartItems[index] = updatedProduct;
        res.json(updatedProduct);
    }

})


// 5. DELETE /cart-items/:id
// a. Action: Remove the item from the array that has the given ID.
// b. Response: Empty
// c. Response Code: 204 (No Content)


routes.delete("/cart-items/:id", (req, res) => {
    let id = parseInt(req.params.id);
    let index = cartItems.findIndex((item) => {
        return item.id === id;
    })
    if (index === -1) {
        res.status(404)
        res.send(`No product found with id: ${id}`)
    } else {
        res.sendStatus(204);
        cartItems.splice(index, 1);

    }

})


//export routes for use in server.js
module.exports = routes