const create = require("./typograms.js");

document.addEventListener("DOMContentLoaded", function() {
  // replace all of the <script type="text/typogram"> tags
  for (const script of document.querySelectorAll("script[type='text/typogram']")) {
    if (script.hasAttribute("disabled")) {
      continue;
    }
    //setTimeout(() => {
    const source = script.innerText;
    const zoom = Number(script.getAttribute("zoom") || 0.3);
    const debug = script.hasAttribute("grid");
    const svg = create(source, zoom, debug);
    script.parentNode.insertBefore(svg, script.nextSibling);
    //}, 0);
  }
});



