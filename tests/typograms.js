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

      const center = subgrid[1][1];
      const left = subgrid[1][0];
      const right = subgrid[1][2];
      const top = subgrid[0][1];
      const top_right = subgrid[0][2];
      const top_left = subgrid[0][0];
      const bottom = subgrid[2][1];
      const bottom_right = subgrid[2][2];
      const bottom_left = subgrid[2][0];
      
      const primitives = [
        // endings
        "*", "o", "#",
        // pipes
        "|", "-",
        // diagonals
        "/", "\\"
      ];

      if (primitives.includes(center)) {
        commands.push(center);
      }

      // connectors and endings
      if (center == "+" || center == "*" || center == "o" || center == "#") {
        if (left == "-") {
          commands.push("╴");
        }
        if (right == "-") {
          commands.push("╶");
        }
        if (top == "|") {
          commands.push("╵");
        }
        if (bottom == "|") {
          commands.push("╷");
        }
        if (top_right == "/") {
          commands.push("/t");
        }
        if (top_left == "\\") {
          commands.push("\\t");
        }
        if (bottom_right == "\\") {
          commands.push("\\b");
        }
        if (bottom_left == "/") {
          commands.push("/b");
        }
      } else if (subgrid[1][1] == ".") {
        // top-left rounded corner
        if (right == "-" && bottom == "|") {
          commands.push("╭");
        }
        // top-right rounded corner
        if (left == "-" && bottom == "|") {
          commands.push("╮");
        }
        // bottom-left rounded corner
        if (right == "-" && top == "|") {
          commands.push("╰");
        }
        // bottom-right rounded corner
        if (left == "-" && top == "|") {
          commands.push("╯");
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

  it("*", () => {
    assertThat(new Grid("*").paint(0, 0)).equalsTo(
      ["*"]
    );    
  });
  
  it("o", () => {
    assertThat(new Grid("o").paint(0, 0)).equalsTo(
      ["o"]
    );    
  });

  it("#", () => {
    assertThat(new Grid("#").paint(0, 0)).equalsTo(
      ["#"]
    );    
  });

  it("|", () => {
    assertThat(new Grid("|").paint(0, 0)).equalsTo(
      ["|"]
    );    
  });

  it("-", () => {
    assertThat(new Grid("-").paint(0, 0)).equalsTo(
      ["-"]
    );    
  });

  it("/", () => {
    assertThat(new Grid("/").paint(0, 0)).equalsTo(
      ["/"]
    );    
  });

  it("\\", () => {
    assertThat(new Grid("\\").paint(0, 0)).equalsTo(
      ["\\"]
    );    
  });

  it("+", () => {
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

  it("cross top-right", () => {
    assertThat(new Grid([
      " /",
      "+ "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["/t"]
    );
  });
  
  it("cross top-left", () => {
    assertThat(new Grid([
      "\\ ",
       " +"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["\\t"]
    );
  });
  
  it("cross bottom-right", () => {
    assertThat(new Grid([
      "+ ",
      " \\"
    ].join("\n")).paint(0, 0)).equalsTo(
      ["\\b"]
    );
  });
  
  it("cross bottom-left", () => {
    assertThat(new Grid([
      " +",
      "/ "
    ].join("\n")).paint(1, 0)).equalsTo(
      ["/b"]
    );
  });

  it("cross top corner", () => {
    assertThat(new Grid([
      " +",
      "/ \\"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["\\b", "/b"]
    );
  });

  it("cross bottom corner", () => {
    assertThat(new Grid([
      "\\ /",
       " + "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["/t", "\\t"]
    );
  });

  it("cross right corner", () => {
    assertThat(new Grid([
      "  /",
      " + ",
      "  \\"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["/t", "\\b"]
    );
  });

  it("cross left corner", () => {
    assertThat(new Grid([
      "\\",
      " +",
      "/ "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["\\t", "/b", ]
    );
  });

  it("cross diagonal corner", () => {
    assertThat(new Grid([
     "\\ /",
      " +",
      "/ \\"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["/t", "\\t", "\\b", "/b"]
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

  it("top-bottom-right corner", () => {
    assertThat(new Grid([
      "| ",
      "+-",
      "| "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["╶", "╵", "╷"]
    );
  });

  it("top-bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-+",
      " |"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╴", "╵", "╷"]
    );
  });

  it("top-bottom-right-left corner", () => {
    assertThat(new Grid([
      " | ",
      "-+-",
      " | "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╴", "╶", "╵", "╷"]
    );
  });

  it("* right", () => {
    assertThat(new Grid("*-").paint(0, 0)).equalsTo(
      ["*", "╶"]
    );
  });

  it("* left", () => {
    assertThat(new Grid("-*").paint(1, 0)).equalsTo(
      ["*", "╴"]
    );
  });

  it("* down", () => {
    assertThat(new Grid("*\n|").paint(0, 0)).equalsTo(
      ["*", "╷"]
    );
  });

  it("* up", () => {
    assertThat(new Grid("|\n*").paint(0, 1)).equalsTo(
      ["*", "╵"]
    );
  });

  it("* top-left corner", () => {
    assertThat(new Grid([
      "*-",
      "| "
    ].join("\n")).paint(0, 0)).equalsTo(
      ["*", "╶", "╷"]
    );
  });

  it("* top-right corner", () => {
    assertThat(new Grid([
      "-*",
      " |"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["*", "╴", "╷"]
    );
  });

  it("* bottom-left corner", () => {
    assertThat(new Grid([
      "|",
      "*-"
    ].join("\n")).paint(0, 1)).equalsTo(
      ["*", "╶", "╵"]
    );
  });

  it("* bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-*"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["*", "╴", "╵"]
    );
  });

  it("* top-bottom-right corner", () => {
    assertThat(new Grid([
      "| ",
      "*-",
      "| "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["*", "╶", "╵", "╷"]
    );
  });

  it("* top-bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-*",
      " |"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["*", "╴", "╵", "╷"]
    );
  });

  it("* top-bottom-right-left corner", () => {
    assertThat(new Grid([
      " | ",
      "-*-",
      " | "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["*", "╴", "╶", "╵", "╷"]
    );
  });

  it("o right", () => {
    assertThat(new Grid("o-").paint(0, 0)).equalsTo(
      ["o", "╶"]
    );
  });

  it("o left", () => {
    assertThat(new Grid("-o").paint(1, 0)).equalsTo(
      ["o", "╴"]
    );
  });

  it("o down", () => {
    assertThat(new Grid("o\n|").paint(0, 0)).equalsTo(
      ["o", "╷"]
    );
  });

  it("o up", () => {
    assertThat(new Grid("|\no").paint(0, 1)).equalsTo(
      ["o", "╵"]
    );
  });

  it("o top-left corner", () => {
    assertThat(new Grid([
      "o-",
      "| "
    ].join("\n")).paint(0, 0)).equalsTo(
      ["o", "╶", "╷"]
    );
  });

  it("o top-right corner", () => {
    assertThat(new Grid([
      "-o",
      " |"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["o", "╴", "╷"]
    );
  });

  it("o bottom-left corner", () => {
    assertThat(new Grid([
      "|",
      "o-"
    ].join("\n")).paint(0, 1)).equalsTo(
      ["o", "╶", "╵"]
    );
  });

  it("o bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-o"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["o", "╴", "╵"]
    );
  });

  it("o top-bottom-right corner", () => {
    assertThat(new Grid([
      "| ",
      "o-",
      "| "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["o", "╶", "╵", "╷"]
    );
  });

  it("o top-bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-o",
      " |"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["o", "╴", "╵", "╷"]
    );
  });

  it("o top-bottom-right-left corner", () => {
    assertThat(new Grid([
      " | ",
      "-o-",
      " | "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["o", "╴", "╶", "╵", "╷"]
    );
  });

  it("# right", () => {
    assertThat(new Grid("#-").paint(0, 0)).equalsTo(
      ["#", "╶"]
    );
  });

  it("# left", () => {
    assertThat(new Grid("-#").paint(1, 0)).equalsTo(
      ["#", "╴"]
    );
  });

  it("# down", () => {
    assertThat(new Grid("#\n|").paint(0, 0)).equalsTo(
      ["#", "╷"]
    );
  });

  it("# up", () => {
    assertThat(new Grid("|\n#").paint(0, 1)).equalsTo(
      ["#", "╵"]
    );
  });

  it("# top-left corner", () => {
    assertThat(new Grid([
      "#-",
      "| "
    ].join("\n")).paint(0, 0)).equalsTo(
      ["#", "╶", "╷"]
    );
  });

  it("# top-right corner", () => {
    assertThat(new Grid([
      "-#",
      " |"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["#", "╴", "╷"]
    );
  });

  it("# bottom-left corner", () => {
    assertThat(new Grid([
      "|",
      "#-"
    ].join("\n")).paint(0, 1)).equalsTo(
      ["#", "╶", "╵"]
    );
  });

  it("# bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-#"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["#", "╴", "╵"]
    );
  });

  it("# top-bottom-right corner", () => {
    assertThat(new Grid([
      "| ",
      "#-",
      "| "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["#", "╶", "╵", "╷"]
    );
  });

  it("# top-bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-#",
      " |"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["#", "╴", "╵", "╷"]
    );
  });

  it("# top-bottom-right-left corner", () => {
    assertThat(new Grid([
      " | ",
      "-#-",
      " | "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["#", "╴", "╶", "╵", "╷"]
    );
  });

  it("top-left corner", () => {
    assertThat(new Grid([
      ".-",
      "| "
    ].join("\n")).paint(0, 0)).equalsTo(
      ["╭"]
    );
  });

  it("top-right corner", () => {
    assertThat(new Grid([
      "-.",
      " |"
    ].join("\n")).paint(1, 0)).equalsTo(
      ["╮"]
    );
  });

  it("bottom-left corner", () => {
    assertThat(new Grid([
      "|",
      ".-"
    ].join("\n")).paint(0, 1)).equalsTo(
      ["╰"]
    );
  });

  it("bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-."
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╯"]
    );
  });

  it("top-bottom-right corner", () => {
    assertThat(new Grid([
      "| ",
      ".-",
      "| "
    ].join("\n")).paint(0, 1)).equalsTo(
      ["╭", "╰"]
    );
  });

  it("top-bottom-left corner", () => {
    assertThat(new Grid([
      " |",
      "-.",
      " |"
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╮", "╯"]
    );
  });

  it("top-bottom-right-left corner", () => {
    assertThat(new Grid([
      " | ",
      "-.-",
      " | "
    ].join("\n")).paint(1, 1)).equalsTo(
      ["╭", "╮", "╰", "╯"]
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
