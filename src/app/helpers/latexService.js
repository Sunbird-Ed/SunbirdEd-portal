const mathjax = require("mathjax-full/js/mathjax");
const TeX = require("mathjax-full/js/input/tex");
const SVG = require("mathjax-full/js/output/svg");
const LiteAdaptor = require("mathjax-full/js/adaptors/liteAdaptor");
const RegisterHTMLHandler = require("mathjax-full/js/handlers/html");
const AllPackages = require("mathjax-full/js/input/tex/AllPackages");

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

function convert(req, res) {
    let equation = req.query.equation;
    if (!equation) {
        equation = req.body.equation;
    }
    if (!equation) {
        res.status(400).send('Bad Request');
    } else {
        let color = "black";
        const normalizedEquation = equation.replace(/\.(svg|png)$/, "");
        console.log(normalizedEquation);
        try {
            const svgString = tex2svg(normalizedEquation, color);
            let imageData = svgString;
            res.setHeader("cache-control", "s-maxage=604800, maxage=604800");
            // render equation
            res.contentType("image/svg+xml");
            res.write(`<?xml version="1.0" standalone="no" ?>
            <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
            `);
            res.end(imageData);
        } catch (err) {
            res.status(500).send('Server Error');
        }
    }
}

module.exports.convert = convert