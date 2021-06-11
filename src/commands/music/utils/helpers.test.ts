/* eslint-disable import/no-extraneous-dependencies */
import { expect } from "chai";
import { secToString, stringToSec } from "./helpers";

/* eslint-disable no-undef */
describe("#stringToSec", () => {
  context("given HH:MM:SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("05:20:30")).to.equal(19230);
    });
  });
  context("given MM:SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("10:10")).to.equal(610);
    });
  });
  context("given SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("47")).to.equal(47);
    });
  });
});

describe("#secToString", () => {
  context("given less than a minute", () => {
    it("should convert correctly", () => {
      expect(secToString(50)).to.equal("00:50");
    });
  });
  context("given more than a minute, less than an hour", () => {
    it("should convert correctly", () => {
      expect(secToString(320)).to.equal("05:20");
    });
  });
  context("given more than an hour", () => {
    it("should convert correctly", () => {
      expect(secToString(19230)).to.equal("05:20:30");
    });
  });
});
