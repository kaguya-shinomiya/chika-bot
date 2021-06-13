/* eslint-disable import/no-extraneous-dependencies */
import { secToString, stringToSec } from "./helpers";

/* eslint-disable no-undef */
describe("#stringToSec", () => {
  describe("given HH:MM:SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("05:20:30")).toEqual(19230);
    });
  });
  describe("given MM:SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("10:10")).toEqual(610);
    });
  });
  describe("given SS", () => {
    it("should convert correctly", () => {
      expect(stringToSec("47")).toEqual(47);
    });
  });
});

describe("#secToString", () => {
  describe("given less than a minute", () => {
    it("should convert correctly", () => {
      expect(secToString(50)).toEqual("00:50");
    });
  });
  describe("given more than a minute, less than an hour", () => {
    it("should convert correctly", () => {
      expect(secToString(320)).toEqual("05:20");
    });
  });
  describe("given more than an hour", () => {
    it("should convert correctly", () => {
      expect(secToString(19230)).toEqual("05:20:30");
    });
  });
});
