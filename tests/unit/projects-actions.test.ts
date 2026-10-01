/* eslint-disable @typescript-eslint/unbound-method */

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  headers: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("~/server/db", () => ({
  db: {
    $transaction: vi.fn(),
  },
}));

import { headers } from "next/headers";

import {
  applyAiEdit,
  applyRemoveBackground,
  applySmartCrop,
  applyUpscale,
  undoPaidTransformation,
} from "~/actions/project-ai";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";

const tx = {
  project: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  user: {
    updateMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

type ActionResult =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      remainingCredits: number;
      transformations: unknown[];
    };

type PaidAction = () => Promise<ActionResult>;

function mockProject(transformations: unknown[] = []) {
  tx.project.findFirst.mockResolvedValue({
    id: "project-1",
    transformations,
  });
}

function mockSuccessfulPayment(remainingCredits = 9) {
  tx.user.updateMany.mockResolvedValue({
    count: 1,
  });

  tx.project.update.mockResolvedValue({});

  tx.user.findUnique.mockResolvedValue({
    credits: remainingCredits,
  });
}

function testCommonPaidActionCases({
  run,
  safeError,
}: {
  run: PaidAction;
  safeError: string;
}) {
  it("returns Unauthorized when user is not logged in", async () => {
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    const result = await run();

    expect(result).toEqual({
      success: false,
      error: "Unauthorized",
    });

    expect(db.$transaction).not.toHaveBeenCalled();
  });

  it("returns Project not found when project does not exist or belongs to another user", async () => {
    tx.project.findFirst.mockResolvedValue(null);

    const result = await run();

    expect(result).toEqual({
      success: false,
      error: "Project not found",
    });

    expect(tx.user.updateMany).not.toHaveBeenCalled();
    expect(tx.project.update).not.toHaveBeenCalled();
  });

  it("returns Insufficient credits when user does not have enough credits", async () => {
    mockProject();

    tx.user.updateMany.mockResolvedValue({
      count: 0,
    });

    const result = await run();

    expect(result).toEqual({
      success: false,
      error: "Insufficient credits",
    });

    expect(tx.project.update).not.toHaveBeenCalled();
    expect(tx.user.findUnique).not.toHaveBeenCalled();
  });

  it("returns safe error when transaction fails", async () => {
    vi.mocked(db.$transaction).mockRejectedValue(
      new Error("Database unavailable"),
    );

    const result = await run();

    expect(result).toEqual({
      success: false,
      error: safeError,
    });
  });
}

describe("project AI actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(headers).mockResolvedValue(new Headers());

    vi.mocked(auth.api.getSession).mockResolvedValue({
      session: {} as never,
      user: {
        id: "user-1",
      },
    } as never);

    vi.mocked(db.$transaction).mockImplementation(async (callback) => {
      return callback(tx as never);
    });
  });

  describe("applyRemoveBackground", () => {
    const run = () => applyRemoveBackground("project-1");

    testCommonPaidActionCases({
      run,
      safeError: "Failed to apply background removal",
    });

    it("does not charge credits when background removal was already applied", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
      ]);

      const result = await run();

      expect(result).toEqual({
        success: false,
        error: "Background removal already applied",
      });

      expect(tx.user.updateMany).not.toHaveBeenCalled();
      expect(tx.project.update).not.toHaveBeenCalled();
    });

    it("deducts credits and stores background removal transformation", async () => {
      mockProject();
      mockSuccessfulPayment(9);

      const result = await run();

      expect(tx.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: "user-1",
          credits: {
            gte: expect.any(Number),
          },
        },
        data: {
          credits: {
            decrement: expect.any(Number),
          },
        },
      });

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              aiRemoveBackground: true,
            },
          ],
        },
      });

      expect(result).toEqual({
        success: true,
        remainingCredits: 9,
        transformations: [
          {
            aiRemoveBackground: true,
          },
        ],
      });
    });
  });

  describe("applyUpscale", () => {
    const run = () => applyUpscale("project-1");

    testCommonPaidActionCases({
      run,
      safeError: "Failed to apply upscale",
    });

    it("does not charge credits when upscale was already applied", async () => {
      mockProject([
        {
          aiUpscale: true,
        },
      ]);

      const result = await run();

      expect(result).toEqual({
        success: false,
        error: "Upscale already applied",
      });

      expect(tx.user.updateMany).not.toHaveBeenCalled();
      expect(tx.project.update).not.toHaveBeenCalled();
    });

    it("deducts credits and stores upscale transformation", async () => {
      mockProject();
      mockSuccessfulPayment(8);

      const result = await run();

      expect(tx.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: "user-1",
          credits: {
            gte: expect.any(Number),
          },
        },
        data: {
          credits: {
            decrement: expect.any(Number),
          },
        },
      });

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              aiUpscale: true,
            },
          ],
        },
      });

      expect(result).toEqual({
        success: true,
        remainingCredits: 8,
        transformations: [
          {
            aiUpscale: true,
          },
        ],
      });
    });
  });

  describe("applySmartCrop", () => {
    const run = () => applySmartCrop("project-1", "car");

    testCommonPaidActionCases({
      run,
      safeError: "Failed to apply smart crop",
    });

    it("returns Invalid object when object input is empty", async () => {
      const result = await applySmartCrop("project-1", "   ");

      expect(result).toEqual({
        success: false,
        error: "Invalid object",
      });

      expect(db.$transaction).not.toHaveBeenCalled();
    });

    it("does not charge credits when smart crop was already applied", async () => {
      mockProject([
        {
          raw: "fo-car,ar-1-1",
        },
      ]);

      const result = await run();

      expect(result).toEqual({
        success: false,
        error: "Smart crop already applied",
      });

      expect(tx.user.updateMany).not.toHaveBeenCalled();
      expect(tx.project.update).not.toHaveBeenCalled();
    });

    it("normalizes object input and stores smart crop transformation", async () => {
      mockProject();
      mockSuccessfulPayment(7);

      const result = await applySmartCrop(
        "project-1",
        "  Red Car  ",
      );

      expect(tx.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: "user-1",
          credits: {
            gte: expect.any(Number),
          },
        },
        data: {
          credits: {
            decrement: expect.any(Number),
          },
        },
      });

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              raw: "fo-red%20car,ar-1-1",
            },
          ],
        },
      });

      expect(result).toEqual({
        success: true,
        remainingCredits: 7,
        transformations: [
          {
            raw: "fo-red%20car,ar-1-1",
          },
        ],
      });
    });
  });

  describe("applyAiEdit", () => {
    const run = () =>
      applyAiEdit("project-1", "make sky blue");

    testCommonPaidActionCases({
      run,
      safeError: "Failed to apply AI edit",
    });

    it("returns Invalid prompt when prompt is empty", async () => {
      const result = await applyAiEdit(
        "project-1",
        "   ",
      );

      expect(result).toEqual({
        success: false,
        error: "Invalid prompt",
      });

      expect(db.$transaction).not.toHaveBeenCalled();
    });

    it("deducts credits and stores AI edit transformation", async () => {
      mockProject();
      mockSuccessfulPayment(6);

      const result = await applyAiEdit(
        "project-1",
        "  Make Sky Blue  ",
      );

      expect(tx.user.updateMany).toHaveBeenCalledWith({
        where: {
          id: "user-1",
          credits: {
            gte: expect.any(Number),
          },
        },
        data: {
          credits: {
            decrement: expect.any(Number),
          },
        },
      });

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              raw: "e-edit-prompt-Make%20Sky%20Blue",
            },
          ],
        },
      });

      expect(result).toEqual({
        success: true,
        remainingCredits: 6,
        transformations: [
          {
            raw: "e-edit-prompt-Make%20Sky%20Blue",
          },
        ],
      });
    });

    it("replaces previous AI edit but keeps other transformations", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
        {
          raw: "e-edit-prompt-old%20prompt",
        },
        {
          aiUpscale: true,
        },
      ]);

      mockSuccessfulPayment(5);

      const result = await applyAiEdit(
        "project-1",
        "new prompt",
      );

      const expectedTransformations = [
        {
          aiRemoveBackground: true,
        },
        {
          aiUpscale: true,
        },
        {
          raw: "e-edit-prompt-new%20prompt",
        },
      ];

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: expectedTransformations,
        },
      });

      expect(result).toEqual({
        success: true,
        remainingCredits: 5,
        transformations: expectedTransformations,
      });
    });
  });

  describe("undoPaidTransformation", () => {
    it("returns Unauthorized when user is not logged in", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(result).toEqual({
        success: false,
        error: "Unauthorized",
      });

      expect(db.$transaction).not.toHaveBeenCalled();
    });

    it("returns Project not found when project does not exist or belongs to another user", async () => {
      tx.project.findFirst.mockResolvedValue(null);

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(result).toEqual({
        success: false,
        error: "Project not found",
      });

      expect(tx.project.update).not.toHaveBeenCalled();
      expect(tx.user.update).not.toHaveBeenCalled();
    });

    it("does not refund credits when transformation does not exist", async () => {
      mockProject();

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(result).toEqual({
        success: false,
        error: "Transformation not found",
      });

      expect(tx.project.update).not.toHaveBeenCalled();
      expect(tx.user.update).not.toHaveBeenCalled();
    });

    it("removes background transformation and refunds credits", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
        {
          aiUpscale: true,
        },
      ]);

      tx.project.update.mockResolvedValue({});

      tx.user.update.mockResolvedValue({
        credits: 10,
      });

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              aiUpscale: true,
            },
          ],
        },
      });

      expect(tx.user.update).toHaveBeenCalledWith({
        where: {
          id: "user-1",
        },
        data: {
          credits: {
            increment: expect.any(Number),
          },
        },
        select: {
          credits: true,
        },
      });

      expect(result).toEqual({
        success: true,
        transformations: [
          {
            aiUpscale: true,
          },
        ],
        remainingCredits: 10,
        refundedCredits: expect.any(Number),
      });
    });

    it("removes upscale transformation and refunds credits", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
        {
          aiUpscale: true,
        },
      ]);

      tx.project.update.mockResolvedValue({});

      tx.user.update.mockResolvedValue({
        credits: 11,
      });

      const result = await undoPaidTransformation(
        "project-1",
        "upscale",
      );

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: [
            {
              aiRemoveBackground: true,
            },
          ],
        },
      });

      expect(tx.user.update).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        success: true,
        transformations: [
          {
            aiRemoveBackground: true,
          },
        ],
        remainingCredits: 11,
        refundedCredits: expect.any(Number),
      });
    });

    it("removes smart crop transformation and keeps other transformations", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
        {
          raw: "fo-car,ar-1-1",
        },
        {
          aiUpscale: true,
        },
      ]);

      tx.project.update.mockResolvedValue({});

      tx.user.update.mockResolvedValue({
        credits: 12,
      });

      const result = await undoPaidTransformation(
        "project-1",
        "objectCrop",
      );

      const expectedTransformations = [
        {
          aiRemoveBackground: true,
        },
        {
          aiUpscale: true,
        },
      ];

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: expectedTransformations,
        },
      });

      expect(tx.user.update).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        success: true,
        transformations: expectedTransformations,
        remainingCredits: 12,
        refundedCredits: expect.any(Number),
      });
    });

    it("removes AI edit transformation and keeps other transformations", async () => {
      mockProject([
        {
          aiRemoveBackground: true,
        },
        {
          raw: "e-edit-prompt-make%20sky%20blue",
        },
        {
          aiUpscale: true,
        },
      ]);

      tx.project.update.mockResolvedValue({});

      tx.user.update.mockResolvedValue({
        credits: 13,
      });

      const result = await undoPaidTransformation(
        "project-1",
        "aiEdit",
      );

      const expectedTransformations = [
        {
          aiRemoveBackground: true,
        },
        {
          aiUpscale: true,
        },
      ];

      expect(tx.project.update).toHaveBeenCalledWith({
        where: {
          id: "project-1",
        },
        data: {
          transformations: expectedTransformations,
        },
      });

      expect(tx.user.update).toHaveBeenCalledTimes(1);

      expect(result).toEqual({
        success: true,
        transformations: expectedTransformations,
        remainingCredits: 13,
        refundedCredits: expect.any(Number),
      });
    });

    it("prevents double refund when transformation no longer exists", async () => {
      mockProject([]);

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(result).toEqual({
        success: false,
        error: "Transformation not found",
      });

      expect(tx.project.update).not.toHaveBeenCalled();
      expect(tx.user.update).not.toHaveBeenCalled();
    });

    it("returns safe error when transaction fails", async () => {
      vi.mocked(db.$transaction).mockRejectedValue(
        new Error("Database unavailable"),
      );

      const result = await undoPaidTransformation(
        "project-1",
        "background",
      );

      expect(result).toEqual({
        success: false,
        error: "Failed to undo transformation",
      });
    });
  });
});