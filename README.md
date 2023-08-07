# typograms

Typograms (short for typographic diagrams) is a lightweight image format
 (`text/typogram`) useful for defining simple diagrams in technical 
documentation.

See it in action here:

https://google.github.io/typograms/

Like markdown, typograms is heavily inspired by pre-existing conventions 
found in ASCII diagrams. A small set of primitives and rules to connect
them is defined, which you can use to build larger diagrams.

Typograms optimizes for editability and portability (e.g. plain text is
easy to maintain, change, store and transmit), at the cost of expressivity
(e.g. SVG is more expressive) and ergonomics (e.g. higher level tools
produce diagrams faster).

You can embed typograms into pages using the polyfill library: 

```html
<body>
  <script src="https://google.github.io/typograms/typograms.js"></script>
  <script type="text/typogram">
+----+
|    |---> My first diagram!
+----+
  </script>
</body>
```

A comparison with related work is available below.

A polyfill is available that allows you use to use it in browsers.


