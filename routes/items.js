var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var request = require('request');
    var main_res = res;
    var search_box = req.query.search;
    var search_box_get_parsed = search_box.replace(' ', '+');
    var api_query = 'https://api.mercadolibre.com/sites/MLA/search?q=' + search_box_get_parsed + '&limit=4';
    request.get(api_query, function (err, res, body) {
        var json_data_result = JSON.parse(body);
        var category_id = json_data_result.results[0].category_id;
        var category_query = 'https://api.mercadolibre.com/categories/' + category_id;
        request.get(category_query, function (err, category_res, category_body) {
            var json_categories_result = JSON.parse(category_body);
            main_res.render('items', {
                title: 'Mercadolibre',
                items: json_data_result,
                search_box: search_box,
                categories: json_categories_result
            })
        });
    });
});

router.get('/:id', function (req, res, next) {
    var request = require('request');
    var item_id = req.params.id;
    var api_query = 'https://api.mercadolibre.com/items/' + item_id;
    var main_res = res;
    request.get(api_query, function (err, res, body) {
        var json_data_result = JSON.parse(body);
        var description_query = 'https://api.mercadolibre.com/items/' + item_id + '/description';
        request.get(description_query, function (err, res, body) {
            var json_description = JSON.parse(body);
            var category_id = json_data_result.category_id;
            var category_query = 'https://api.mercadolibre.com/categories/' + category_id;
            request.get(category_query, function (err, category_res, category_body) {
                var json_categories_result = JSON.parse(category_body);
                main_res.render('item_description', {
                    title: 'Mercadolibre',
                    item: json_data_result,
                    item_description: json_description,
                    categories: json_categories_result
                });
            });
        });
    });
});

module.exports = router;
