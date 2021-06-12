import { TextChannel } from "discord.js";
import { mock } from "jest-mock-extended";
import * as Embeds from "../shared/embeds";
import { Command } from "../types/command";
import { validateArgsCount } from "./validateArgsCount";
jest.mock("discord.js");
jest.mock("../shared/embeds");

describe("#validateArgsCount", () => {
  const mockCommand = mock<Command>();
  const mockChannel = mock<TextChannel>();

  const embedErrorSpy = jest.spyOn(Embeds, "lightErrorEmbed");
  const channelSendSpy = jest.spyOn(mockChannel, "send");

  beforeEach(() => {
    embedErrorSpy.mockClear();
    channelSendSpy.mockClear();
  });

  describe("for command with no params", () => {
    beforeEach(() => {
      mockCommand.args = [];
    });
    it("should return null if any args submitted", () => {
      expect(validateArgsCount(mockCommand, ["1", "2"], mockChannel)).toBe(
        null
      );
      expect(validateArgsCount(mockCommand, ["1"], mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(2);
      expect(channelSendSpy).toBeCalledTimes(2);
    });
    it("should return [] if no args submitted", () => {
      const args: string[] = [];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
  });

  describe("for command with N mono-required params", () => {
    beforeEach(() => {
      mockCommand.args = [{ name: "arg1" }, { name: "arg2" }];
    });
    it("should return null if args < N", () => {
      expect(validateArgsCount(mockCommand, ["1"], mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
    it("should return null if args > N", () => {
      expect(validateArgsCount(mockCommand, ["1", "2", "3"], mockChannel)).toBe(
        null
      );
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
    it("should return args if args = N", () => {
      const args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
    });
    expect(embedErrorSpy).toBeCalledTimes(0);
    expect(channelSendSpy).toBeCalledTimes(0);
  });

  describe("for command with N mono-optional params only", () => {
    beforeEach(() => {
      mockCommand.args = [
        { name: "arg1", optional: true },
        { name: "arg2", optional: true },
      ];
    });
    it("should return args if no args submitted", () => {
      const args: string[] = [];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args < N", () => {
      const args = ["1"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args = N", () => {
      const args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return null if args > N", () => {
      const args = ["1", "2", "3"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
  });

  describe("for command with N mono-required and M mono-optional params", () => {
    beforeEach(() => {
      mockCommand.args = [
        { name: "arg1" },
        { name: "arg2" },
        { name: "arg3", optional: true },
        { name: "arg4", optional: true },
      ];
    });
    it("should return null if args < N", () => {
      expect(validateArgsCount(mockCommand, ["1"], mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
    it("should return args if args = N", () => {
      const args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if N < args <= N + M", () => {
      const args3 = ["1", "2", "3"];
      expect(validateArgsCount(mockCommand, args3, mockChannel)).toBe(args3);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);

      const args4 = ["1", "2", "3", "4"];
      expect(validateArgsCount(mockCommand, args4, mockChannel)).toBe(args4);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return null if args > N", () => {
      expect(
        validateArgsCount(mockCommand, ["1", "2", "3", "4", "5"], mockChannel)
      ).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
  });

  describe("for command with N multi-required params", () => {
    beforeEach(() => {
      mockCommand.args = [
        { name: "arg1", multi: true },
        { name: "arg2", multi: true },
      ];
    });
    it("should return null if args < N", () => {
      expect(validateArgsCount(mockCommand, [], mockChannel)).toBe(null);
      expect(validateArgsCount(mockCommand, ["1"], mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(2);
      expect(channelSendSpy).toBeCalledTimes(2);
    });
    it("should return args if args >= N", () => {
      let args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      args = ["1", "2", "3"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
  });

  describe("for command with N multi-optional params", () => {
    beforeEach(() => {
      mockCommand.args = [
        { name: "arg1", multi: true, optional: true },
        { name: "arg2", multi: true, optional: true },
      ];
    });
    it("should return args if no args submitted", () => {
      const args: string[] = [];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args < N", () => {
      const args = ["1"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args = N", () => {
      const args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args > N", () => {
      const args = ["1", "2", "3", "4"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
  });

  describe("for command with N multi-required and M multi-optional params", () => {
    beforeEach(() => {
      mockCommand.args = [
        { name: "arg1", multi: true },
        { name: "arg2", multi: true },
        { name: "arg3", multi: true, optional: true },
        { name: "arg4", multi: true, optional: true },
      ];
    });
    it("should return null if no args submitted", () => {
      const args: string[] = [];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
    it("should return null if args < N", () => {
      const args = ["1"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(null);
      expect(embedErrorSpy).toBeCalledTimes(1);
      expect(channelSendSpy).toBeCalledTimes(1);
    });
    it("should return args if args = N", () => {
      const args = ["1", "2"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if N < args < N + M", () => {
      const args = ["1", "2", "3"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args = N + M", () => {
      const args = ["1", "2", "3", "4"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
    it("should return args if args > N + M", () => {
      const args = ["1", "2", "3", "4", "5"];
      expect(validateArgsCount(mockCommand, args, mockChannel)).toBe(args);
      expect(embedErrorSpy).toBeCalledTimes(0);
      expect(channelSendSpy).toBeCalledTimes(0);
    });
  });
});
