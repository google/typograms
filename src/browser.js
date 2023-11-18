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
  
      if (!source.includes(')@{')) {
        // define there is no animation inside.
        const svg = create(source, zoom, debug);      
        script.parentNode.insertBefore(svg, script.nextSibling);
        continue;
      } 
  
      // animation starts
      const [newSources, classname, ani] = separate(source);
      const {width, height} = ani;
      const containSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      containSvg.setAttribute("width", width);
      containSvg.setAttribute("height", height);
  
      for (const newSource of newSources) {
        const svg = create(newSource, zoom, debug);
        svg.classList.add(classname)
        svg.style.display = 'none';
        containSvg.appendChild(svg);
      }
  
      script.parentNode.insertBefore(containSvg, script.nextSibling);
      //}, 0);
      
      animation(classname, ani);
    //}, 0);
  }
});



