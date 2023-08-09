const create = require("./typograms.js");

document.addEventListener("DOMContentLoaded", function() {
  // replace all of the <script type="text/typogram"> tags
  for (const script of document.querySelectorAll("script[type='text/typogram']")) {
    if (script.hasAttribute("disabled")) {
      continue;
    }
    //setTimeout(() => {
    const svg = create(script);
    script.parentNode.insertBefore(svg, script.nextSibling);
    //}, 0);
  }
});



