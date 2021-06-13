import { Message, TextChannel } from "discord.js";
import { mock } from "jest-mock-extended";
import { Command } from "../types/command";
import * as cooldownManager from "./cooldownManager";
import { cooldownRedis } from "./cooldownManager";
import { isOnCooldown } from "./validateCooldowns";

afterAll(() => {
  return cooldownRedis.quit();
});

describe("#isOnCooldown", () => {
  const mockMessage = mock<Message>();
  mockMessage.channel = mock<TextChannel>();

  const channelSendSpy = jest.spyOn(mockMessage.channel, "send");
  const getCooldownSpy = jest.spyOn(cooldownManager, "getCooldown");

  beforeEach(() => {
    getCooldownSpy.mockClear();
    channelSendSpy.mockClear();
  });

  describe("if command has no cooldown set", () => {
    const mockCommand = mock<Command>();
    mockCommand.channelCooldown = undefined;
    mockCommand.userCooldown = undefined;
    it("should return false", () => {
      return isOnCooldown(mockMessage, mockCommand).then((res) => {
        expect(res).toBe(false);
      });
    });
    it("should not call #getCooldown", () => {
      return isOnCooldown(mockMessage, mockCommand).then(() => {
        expect(getCooldownSpy).toBeCalledTimes(0);
      });
    });
  });

  describe("if command has channel cooldown", () => {
    const mockCommand = mock<Command>();
    mockCommand.channelCooldown = 10000;
    mockCommand.userCooldown = undefined;
    it("should call #getCooldown once", () => {
      return isOnCooldown(mockMessage, mockCommand).then(() => {
        expect(getCooldownSpy).toBeCalledTimes(1);
      });
    });

    describe("and got ttl > 0", () => {
      it("should return true", () => {
        getCooldownSpy.mockResolvedValueOnce(1000);
        return isOnCooldown(mockMessage, mockCommand).then((res) => {
          expect(res).toBe(true);
        });
      });
      it("should call channel#send once", () => {
        getCooldownSpy.mockResolvedValueOnce(1000);
        return isOnCooldown(mockMessage, mockCommand).then(() => {
          expect(channelSendSpy).toBeCalledTimes(1);
        });
      });
    });

    describe("got ttl 0", () => {
      it("should return false", () => {
        getCooldownSpy.mockResolvedValueOnce(0);
        return isOnCooldown(mockMessage, mockCommand).then((res) => {
          expect(res).toBe(false);
        });
      });
      it("should not call channel#send", () => {
        return isOnCooldown(mockMessage, mockCommand).then(() => {
          expect(channelSendSpy).toBeCalledTimes(0);
        });
      });
    });
  });

  describe("if command has user cooldown", () => {
    const mockCommand = mock<Command>();
    mockCommand.userCooldown = 10000;
    mockCommand.channelCooldown = undefined;
    it("should call getCooldown once", () => {
      return isOnCooldown(mockMessage, mockCommand).then(() => {
        expect(getCooldownSpy).toBeCalledTimes(1);
      });
    });

    describe("and found ttl", () => {
      it("should return true", () => {
        getCooldownSpy.mockResolvedValueOnce(1000);
        return isOnCooldown(mockMessage, mockCommand).then((res) => {
          expect(res).toBe(true);
        });
      });
      it("should call channel#send once", () => {
        getCooldownSpy.mockResolvedValueOnce(1000);
        return isOnCooldown(mockMessage, mockCommand).then(() => {
          expect(channelSendSpy).toBeCalledTimes(1);
        });
      });
    });
  });
});
