const assert = require("assert");
const create = require("./../src/typograms.js");

describe("typograms", () => {
  it("basic", () => {
    assertThat(1).equalsTo(1);
  });

  function assertThat(a) {
    return {
      equalsTo(b) {
        assert.deepEqual(a, b);
      }
    }
  }
});
