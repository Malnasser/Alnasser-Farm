const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const server = http.createServer((req, res) => {
    const query = url.parse(req.url, true).query;
    const pathName = url.parse(req.url, true).pathname;

    //overview page
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const cardHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardHTML);
        res.end(output);

    //product page
    } else if (pathName === '/product') {
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    //api
    } else if (pathName === '/api') {
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);

    //not found
    } else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>')
    }

    return;
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});
