const async = require('async');
const mathjax = require("mathjax-full/js/mathjax");
const TeX = require("mathjax-full/js/input/tex");
const SVG = require("mathjax-full/js/output/svg");
const LiteAdaptor = require("mathjax-full/js/adaptors/liteAdaptor");
const RegisterHTMLHandler = require("mathjax-full/js/handlers/html");
const AllPackages = require("mathjax-full/js/input/tex/AllPackages");
const svg2img = require("svg2img");
const fs = require('fs');

const adaptor = new LiteAdaptor.LiteAdaptor();
RegisterHTMLHandler.RegisterHTMLHandler(adaptor);

const html = mathjax.mathjax.document("", {
    InputJax: new TeX.TeX({ packages: AllPackages.AllPackages }),
    OutputJax: new SVG.SVG({ fontCache: "none" })
});


function tex2svg(equation, color) {
    const svg = adaptor
        .innerHTML(html.convert(equation, { display: true }))
        .replace(/fill="currentColor"/, `fill="${color}"`);
    if (svg.includes("merror")) {
        return svg.replace(/<rect.+?><\/rect>/, "");
    }
    return svg;
}

function svg2png(svgString) {
    return new Promise(function (resolve, reject) {
      var dims = svgString
          .match(/width="([\d.]+)ex" height="([\d.]+)ex"/)
          .slice(1)
          .map(function (s) { return parseFloat(s); }), width = dims[0], height = dims[1];
      var args = {
        width: width * 3 + "ex",
        height: height * 3 + "ex"
      };
      svg2img(svgString, args, function(error, buffer) {
        if (error) {
          return reject(error);
        }
        resolve(buffer);
      });
    });
}

function png2base64(pngString) {
    var base64Image = Buffer.from(pngString, 'binary').toString('base64');
    return 'data:image/png;base64,'+base64Image;
}

async function convert(req, res) {
    let equation = req.query.equation;
    if (!equation) {
        equation = req.body.equation;
    }
    if (!equation) {
        res.status(400).send('Bad Request');
    } else {
        let color = "black";
        const isPNG = /\.png$/.test(equation);
        const normalizedEquation = equation.replace(/\.(svg|png)$/, "");
        const svgString = tex2svg(normalizedEquation, color);
        let imageData = svgString;
        res.setHeader("cache-control", "s-maxage=604800, maxage=604800");
        // render equation
        if (isPNG) {
            imageData = await svg2png(svgString);
            const base64Image = await png2base64(imageData);
            res.contentType("application/json");
            imageData = { 'data': base64Image };
            res.send(imageData);
        } else {
            res.contentType("image/svg+xml");
            res.write(`<?xml version="1.0" standalone="no" ?>
                <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
            `);
            res.end(imageData);
        }
    }
}



module.exports.convert = convert
module.exports.tex2svg = tex2svg
module.exports.svg2png = svg2png