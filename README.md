# myAngkringan

<h1 align="center">MyAngkringan - Simple restaurant app</h1>



MyAngkringan is a simple restaurant application specially for backend. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)
## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. <a href="https://www.getpostman.com/">Postman</a>
3. <a href="https://redis.io/download/">Redis</a>
3. <a href="https://www.mysql.com/downloads/">MySQL</a> or <a href="https://www.apachefriends.org/download.html">XAMPP</a>
3. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install` [here](#requirements)
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on your redis sever.
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name myangkringan, and Import file [backup.sql](backup.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3000/item)
8. You can see all the end point [here](#end-point)

## Set up env file
Open .env file on your favorite code editor, and copy paste this code below :
```
APP_PORT=8080
APP_URI=http://localhost:8080/
APP_KEY=your_secret_key
DB_SERVER=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=your_database
REDIS_PORT=your_port
```

## End Point
**1. GET**
* `/api/user` (only accessable by admin)
* `/api/item`
* `/api/item/search?name=ayam&sort=rating&byRestaurant=11&limit=5&page=1`
* `/api/item/:id` (Get item by id and show recommendation)
* `/api/categories`
* `/api/restaurant`
* `/api/restaurant/:id` (Get Restaurant by id)
* `/api/cart/`
* `/api/review/` 
* `/api/review/myreview` (get all review based on login user) 
* `/api/review/:id_item` (Get all review by id_item)

**2. POST**
* `/api/user/registrasi`
    * ``` { "username" : "auliaramadhan", "password" : "1234" } ```

* `/api/user/createmanager`
    * ``` { "username" : "auliamanager3","password" : "1234","id_restaurant" : "2" } ```

* `/api/user/login`
    * ``` { "username" : "auliaramadhan", "password" : "1234" } ```

* `/api/user/logout`

* `/api/restaurant`
    * ``` { "name" : "kentucky fried chicken","lating" : "-6.5483965,106.9711935","description" : "makanan cepat saji"  "image" :[]} ```

* `/api/category`
    * ``` { "name" : "makanan" berat',"description" : "makanan" } ```

* `/api/item`
    * ``` { "name" : "rendang", "price" : "15000", "id_category" : "3", "image" :[image] } ```

* `/api/review`
    * ``` { "review" : "Kurang" Enak', "rating" : "4", "id_item" : "12"}```

* `/api/cart`
    * ``` { "id_item" : "39", "qty" : "2" }```

**3. PUT**
* `/api/user/changeroles/:username`
    ```{ "id_restaurant" : "11","roles" : "pelanggan" }```

* `/api/user/changeuser/:username`
    ```{ "username" : "auliaramadhan", "password" : "1234" }```

* `/api/restaurant`
    * ``` { "name" : "kentucky fried chicken","lating" : "-6.5483965,106.9711935","description" : "makanan cepat saji" "image" :[] } ```

* `/api/category`
    * ``` { "name" : "makanan berat","description" : "makanan" } ```

* `/api/item`
    * ``` { "name" : "rendang", "price" : "15000", "image" :[image] } ```

* `/api/review`
    * ``` { "review" : "Kurang Enak", "rating" : "4"}```

* `/api/cart/changeitemqty`
    * ``` {  "qty" : "2" }```

**4. DELETE**
* `/api/item/:id` (Delete item by id)
* `/api/review/:id` (Delete review by id)
* `/api/cart/:id` (Delete cart by id)
* `/api/cart/cleanmycart` (Delete all item in cart by user login)
