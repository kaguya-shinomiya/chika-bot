/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import { endOfToday, secToWordString } from "./time";

describe("#secToWordString", () => {
  describe("given exact hour", () => {
    it("should return hour only", () => {
      expect(secToWordString(3600)).toEqual("1h");
    });
  });
  describe("given exact minute", () => {
    it("should return minute only", () => {
      expect(secToWordString(300)).toEqual("5min");
    });
  });
  describe("given exact second", () => {
    it("should return second only", () => {
      expect(secToWordString(45)).toEqual("45s");
    });
  });
  describe("given mix of hours, minutes, and seconds", () => {
    it("should convert correctly", () => {
      expect(secToWordString(19230)).toEqual("5h 20min 30s");
    });
  });
});

describe("#endOfToday", () => {
  const dateSpy = jest.spyOn(Date.prototype, "setHours").mockReturnValue(420);

  beforeEach(() => {
    dateSpy.mockClear();
  });

  it("should call Date with 23, 59, 59, 999", () => {
    endOfToday();
    expect(dateSpy).toBeCalledTimes(1);
    expect(dateSpy).toBeCalledWith(23, 59, 59, 999);
  });
  it("should call valueOf and return a number", () => {
    expect(endOfToday()).toBe(420);
  });
});
