const assert = require("assert");
const create = require("./../src/typograms.js");

describe("typograms", () => {
  class Grid {
    constructor(str) {
      this.rows = str.split("\n");
      this.width = 0;
      for (const row of this.rows) {
        this.width = Math.max(this.width, row.length);
      }
      this.height = this.rows.length;
    }
    size() {
      return [this.width, this.height];
    }
    get(x, y) {
      if (x < 0 || x >= this.width) {
        return undefined;
      } else if (y < 0 || y >= this.height) {
        return undefined;
      } else if (x < this.rows[y].length) {
        return this.rows[y][x];
      } else {
        return ' ';
      }
    }

    subgrid(x, y) {
      const center = this.get(x, y);
      if (!center) {
        return undefined;
      }
      return [
        [this.get(x - 1, y - 1) || ' ', this.get(x, y - 1) || ' ', this.get(x + 1, y - 1) || ' '],
        [this.get(x - 1, y) || ' ', this.get(x, y) || ' ', this.get(x + 1, y) || ' '],
        [this.get(x - 1, y + 1) || ' ', this.get(x, y + 1) || ' ', this.get(x + 1, y + 1) || ' '],
      ];
    }

    paint(x, y) {
      const commands = [];
      const subgrid = this.subgrid(x, y);

      const primitives = ["*", "o", "|", "-"];

      if (primitives.includes(subgrid[1][1])) {
        commands.push(subgrid[1][1]);
      }

      if (subgrid[1][1] == "+") {
        // left
        if (subgrid[1][0] == "-") {
          commands.push("╴");
        }
        // right
        if (subgrid[1][2] == "-") {
          commands.push("╶");
        }
        // top
        if (subgrid[0][1] == "|") {
          commands.push("╵");
        }
        // down
        if (subgrid[2][1] == "|") {
          commands.push("╷");
        }
      }
      
      return commands;
    }
    
    go() {
      const result = [];
      for (let y = 0; y < this.height; y++) {
        const row = [];
        result.push(row);
        for (let x = 0; x < this.rows[y].length; x++) {
        }
      }
      return result;
    }
  }

  it("parser", () => {
    assertThat(1).equalsTo(1);
    assertThat(new Grid("").size()).equalsTo([0, 1]);
    assertThat(new Grid("a").size()).equalsTo([1, 1]);
    assertThat(new Grid("ab").size()).equalsTo([2, 1]);
    assertThat(new Grid("\n").size()).equalsTo([0, 2]);
    assertThat(new Grid("a\n").size()).equalsTo([1, 2]);    
    assertThat(new Grid("a\nb").size()).equalsTo([1, 2]);
    assertThat(new Grid("ab\n").size()).equalsTo([2, 2]);
    assertThat(new Grid("ab\ncd").size()).equalsTo([2, 2]);
    assertThat(new Grid("ab\ncde").size()).equalsTo([3, 2]);
    assertThat(new Grid("\n\n").size()).equalsTo([0, 3]);
    assertThat(new Grid("\na\n").size()).equalsTo([1, 3]);
  });

  it("cells", () => {
    assertThat(new Grid("").get(0, 0)).equalsTo(undefined);
    assertThat(new Grid("").get(-1, 0)).equalsTo(undefined);
    assertThat(new Grid("").get(0, -1)).equalsTo(undefined);
    
    assertThat(new Grid("a").get(-1, 0)).equalsTo(undefined);
    assertThat(new Grid("a").get(0, -1)).equalsTo(undefined);
    assertThat(new Grid("a").get(0, 0)).equalsTo('a');
    assertThat(new Grid("a").get(0, 1)).equalsTo(undefined);
    assertThat(new Grid("a").get(1, 0)).equalsTo(undefined);

    assertThat(new Grid("ab").get(0, 0)).equalsTo('a');
    assertThat(new Grid("ab").get(1, 0)).equalsTo('b');
    assertThat(new Grid("ab").get(0, 1)).equalsTo(undefined);
    assertThat(new Grid("ab").get(2, 0)).equalsTo(undefined);
    assertThat(new Grid("ab").get(2, 1)).equalsTo(undefined);

    assertThat(new Grid("a\nb").get(0, 0)).equalsTo('a');
    assertThat(new Grid("a\nb").get(1, 0)).equalsTo(undefined);
    assertThat(new Grid("a\nb").get(0, 1)).equalsTo('b');
    assertThat(new Grid("a\nb").get(1, 1)).equalsTo(undefined);

    assertThat(new Grid("ab\nc").get(0, 0)).equalsTo('a');
    assertThat(new Grid("ab\nc").get(1, 0)).equalsTo('b');
    assertThat(new Grid("ab\nc").get(2, 0)).equalsTo(undefined);
    assertThat(new Grid("ab\nc").get(0, 1)).equalsTo('c');
    assertThat(new Grid("ab\nc").get(1, 1)).equalsTo(' ');
    assertThat(new Grid("ab\nc").get(2, 1)).equalsTo(undefined);
  });
  
  it("subgrid", () => {
    assertThat(new Grid("").subgrid(0, 0)).equalsTo(undefined);
    
    assertThat(new Grid("a").subgrid(0, 0)).equalsTo([
      [' ', ' ', ' '],
      [' ', 'a', ' '],
      [' ', ' ', ' '],
    ]);


    assertThat(new Grid("ab").subgrid(0, 0)).equalsTo([
      [' ', ' ', ' '],
      [' ', 'a', 'b'],
      [' ', ' ', ' '],
    ]);
    assertThat(new Grid("ab").subgrid(1, 0)).equalsTo([
      [' ', ' ', ' '],
      ['a', 'b', ' '],
      [' ', ' ', ' '],
    ]);

    assertThat(new Grid("a\nb").subgrid(0, 0)).equalsTo([
      [' ', ' ', ' '],
      [' ', 'a', ' '],
      [' ', 'b', ' '],
    ]);
    assertThat(new Grid("a\nb").subgrid(0, 1)).equalsTo([
      [' ', 'a', ' '],
      [' ', 'b', ' '],
      [' ', ' ', ' '],
    ]);

    assertThat(new Grid("ab\nc").subgrid(0, 0)).equalsTo([
      [' ', ' ', ' '],
      [' ', 'a', 'b'],
      [' ', 'c', ' '],
    ]);
    assertThat(new Grid("ab\nc").subgrid(1, 0)).equalsTo([
      [' ', ' ', ' '],
      ['a', 'b', ' '],
      ['c', ' ', ' '],
    ]);
    assertThat(new Grid("ab\nc").subgrid(0, 1)).equalsTo([
      [' ', 'a', 'b'],
      [' ', 'c', ' '],
      [' ', ' ', ' '],
    ]);
    assertThat(new Grid("ab\nc").subgrid(1, 1)).equalsTo([
      ['a', 'b', ' '],
      ['c', ' ', ' '],
      [' ', ' ', ' '],
    ]);
  });

  it("primitives", () => {
    assertThat(new Grid("*").paint(0, 0)).equalsTo(
      ["*"]
    );    
    assertThat(new Grid("o").paint(0, 0)).equalsTo(
      ["o"]
    );    
    assertThat(new Grid("|").paint(0, 0)).equalsTo(
      ["|"]
    );    
    assertThat(new Grid("-").paint(0, 0)).equalsTo(
      ["-"]
    );    
  });

  it("cross empty", () => {
    assertThat(new Grid("+").paint(0, 0)).equalsTo(
      []
    );    
  });

  it("cross right", () => {
    assertThat(new Grid("+-").paint(0, 0)).equalsTo(
      ["╶"]
    );
  });

  it("cross left", () => {
    assertThat(new Grid("-+").paint(1, 0)).equalsTo(
      ["╴"]
    );
  });

  it("cross down", () => {
    assertThat(new Grid("+\n|").paint(0, 0)).equalsTo(
      ["╷"]
    );
  });

  it("cross up", () => {
    assertThat(new Grid("|\n+").paint(0, 1)).equalsTo(
      ["╵"]
    );
  });

  it("top-left corner", () => {
    assertThat(new Grid([
      "+-",
      "| "
    ].join("\n")).paint(0, 0)).equalsTo(
      ["╶", "╷"]
    );
  });

  it("top-right corner", () => {
    assertThat(new Grid([
      "-+",
      " |"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["╴", "╷"]
    );
  });

  it("bottom-left corner", () => {
    assertThat(new Grid([
      "|",
      "+-"
    ].join("\n")).paint(0, 1)).equalsTo(
      ["╶", "╵"]
    );
  });

  it("bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-+"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╴", "╵"]
    );
  });

  function assertThat(a) {
    return {
      equalsTo(b) {
        assert.deepEqual(a, b);
      }
    }
  }
});
