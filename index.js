const fs = require("fs");
const http = require("http");
const url = require("url");
const { dirname } = require("path");
const replaceTemplate = require("./modules/replaceTemplate");
const slug = require('slugify');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    const overviewHtml = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

    res.end(overviewHtml);
  } else if (pathname === "/product") {
    const product = dataObj[query.id];
    const productHtml = replaceTemplate(tempProduct, product);
    res.end(productHtml);
  } else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json",
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-typy": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page not found!</h1>");
  }
});

server.listen("8000", "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
