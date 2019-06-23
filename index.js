const express = require('express');
const got = require('got');
const path = require('path');
const Bing = require('node-bing-api')({ accKey: "711d7cd15e6a41cdb133d898beefff9d" });
const app = express();
app.set('view engine', 'twig')
app.use('/assets', express.static(path.join(__dirname, 'views/assets')));

app.get('/', function(req, result) {
    result.render('index', {
        page: 'index',
        title: 'Your food, smarter. - WiseFoods'
    });
});

app.get('/record', function(req, result) {
    result.render('record', {
        page: 'record',
        title: 'Record your data - WiseFoods'
    });
});

app.get('/save', function(req, result) {
    result.render('save', {
        page: 'save',
        title: 'Saving..'
    });
});

app.get('/history', function(req, result) {
    result.render('history', {
        page: 'history',
        title: 'Your Items - WiseFoods'
    });
});

app.get('/get/*', function(req, result) { // getting the info for a barcode.
    let barcode = req.url.slice(5);
    let data = {};

    got('https://world.openfoodfacts.org/api/v0/product/' + barcode + '.json', { json: true }).then(response => {
        if (response.body.status) {
            data.status = 1;
            data.ingredients = [];
            let _temp = response.body.product.ingredients_original_tags;
            for (let i = 0; i < _temp.length; i++)
                data.ingredients.push(_temp[i].slice(3));
            data.name = response.body.product.product_name;
            Bing.images(data.name, {
                count: 1,
                offset: 0
            }, function(error, res, body) {
                data.image = body.value[0].contentUrl;
                result.send(JSON.stringify(data));
            });
        } else {
            result.send(JSON.stringify({status: 0}));
        }
    });
});

app.listen(8000, function() {
    console.log("server is listening on port 8000");
});