/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import { secToWordString } from "./time";

describe("#secToWordString", () => {
  context("given exact hour", () => {
    it("should return hour only", () => {
      expect(secToWordString(3600)).to.equal("1h");
    });
  });
  context("given exact minute", () => {
    it("should return minute only", () => {
      expect(secToWordString(300)).to.equal("5min");
    });
  });
  context("given exact second", () => {
    it("should return second only", () => {
      expect(secToWordString(45)).to.equal("45s");
    });
  });
  context("given mix of hours, minutes, and seconds", () => {
    it("should convert correctly", () => {
      expect(secToWordString(19230)).to.equal("5h 20min 30s");
    });
  });
});
