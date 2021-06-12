import { cooldownRedis, setCooldown, getCooldown } from "./cooldownManager";

afterAll(() => {
  cooldownRedis.quit();
});

describe("cooldownManager", () => {
  const setSpy = jest.spyOn(cooldownRedis, "set");
  const ttlSpy = jest.spyOn(cooldownRedis, "ttl");

  beforeEach(() => {
    setSpy.mockReset();
    ttlSpy.mockReset();
  });

  describe("#setCooldown", () => {
    it("calls set once", () => {
      setCooldown("id", "command", 10);
      expect(setSpy).toBeCalledTimes(1);
    });
    it("calls set with correct params", () => {
      setCooldown("id", "command", 10);
      expect(setSpy).toBeCalledWith("id:command", "command", "px", 10);
    });
  });

  describe("#getCooldown", () => {
    it("calls get once", () => {
      getCooldown("id", "command");
      expect(ttlSpy).toBeCalledTimes(1);
    });
    it("calls set with correct params", () => {
      getCooldown("id", "command");
      expect(ttlSpy).toBeCalledWith("id:command");
    });
    it("returns 0 if key already expired or has no ttl set (-1 or -2)", () => {
      ttlSpy.mockResolvedValueOnce(-1);
      return getCooldown("id", "command").then((res) => {
        expect(res).toBe(0);
      });
    });
    it("returns ttl if ttl is found", () => {
      ttlSpy.mockResolvedValueOnce(1000);
      return getCooldown("id", "command").then((res) => {
        expect(res).toBe(1000);
      });
    });
  });
});
