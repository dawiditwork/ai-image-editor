import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const actionMocks = vi.hoisted(() => ({
  applyRemoveBackground: vi.fn(),
  applyUpscale: vi.fn(),
  applySmartCrop: vi.fn(),
  applyAiEdit: vi.fn(),
  undoPaidTransformation: vi.fn(),
}));

vi.mock("~/actions/project-ai", () => actionMocks);

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("~/env", () => ({
  env: {
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: "https://ik.example.com",
  },
}));

import { useImageEditor } from "~/hooks/useImageEditor";

const uploadedImage = {
  fileId: "file-1",
  url: "https://example.com/image.jpg",
  name: "image.jpg",
  filePath: "/users/user-1/image.jpg",
};

const createImageErrorEvent = (src: string) =>
  ({
    currentTarget: { src },
  }) as React.SyntheticEvent<HTMLImageElement>;

describe("useImageEditor credit refund flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    actionMocks.applyRemoveBackground.mockResolvedValue({
      success: true,
      transformations: [{ aiRemoveBackground: true }],
      remainingCredits: 8,
    });

    actionMocks.undoPaidTransformation.mockResolvedValue({
      success: true,
      transformations: [],
      remainingCredits: 10,
      refundedCredits: 2,
    });
  });

  it("manual undo removes a paid transformation without refunding credits", () => {
    const setCredits = vi.fn();

    const { result } = renderHook(() =>
      useImageEditor({
        uploadedImage,
        imageRef: { current: null },
        setCredits,
        activeProjectId: "project-1",
      }),
    );

    act(() => {
      result.current.setTransformations([
        { aiRemoveBackground: true },
      ]);
    });

    act(() => {
      result.current.removeTransformation("background");
    });

    expect(result.current.transformations).toEqual([]);
    expect(actionMocks.undoPaidTransformation).not.toHaveBeenCalled();
    expect(setCredits).not.toHaveBeenCalled();
  });

  it("provider failure refunds the paid operation", async () => {
    const setCredits = vi.fn();

    const { result } = renderHook(() =>
      useImageEditor({
        uploadedImage,
        imageRef: { current: null },
        setCredits,
        activeProjectId: "project-1",
      }),
    );

    await act(async () => {
      await result.current.removeBackground();
    });

    expect(actionMocks.applyRemoveBackground).toHaveBeenCalledWith(
      "project-1",
    );

    await act(async () => {
      await result.current.handleImageError(
        createImageErrorEvent(
          "https://ik.example.com/image.jpg?tr=e-bgremove",
        ),
      );
    });

    expect(actionMocks.undoPaidTransformation).toHaveBeenCalledTimes(1);
    expect(actionMocks.undoPaidTransformation).toHaveBeenCalledWith(
      "project-1",
      "background",
    );
    expect(setCredits).toHaveBeenLastCalledWith(10);
    expect(result.current.transformations).toEqual([]);
  });

  it("does not refund the same failed operation twice", async () => {
    const setCredits = vi.fn();

    const { result } = renderHook(() =>
      useImageEditor({
        uploadedImage,
        imageRef: { current: null },
        setCredits,
        activeProjectId: "project-1",
      }),
    );

    await act(async () => {
      await result.current.removeBackground();
    });

    const event = createImageErrorEvent(
      "https://ik.example.com/image.jpg?tr=e-bgremove",
    );

    await act(async () => {
      await result.current.handleImageError(event);
    });

    await act(async () => {
      await result.current.handleImageError(event);
    });

    expect(actionMocks.undoPaidTransformation).toHaveBeenCalledTimes(1);
  });

  it("Clear All cancels a pending automatic refund", async () => {
    const setCredits = vi.fn();

    const { result } = renderHook(() =>
      useImageEditor({
        uploadedImage,
        imageRef: { current: null },
        setCredits,
        activeProjectId: "project-1",
      }),
    );

    await act(async () => {
      await result.current.removeBackground();
    });

    act(() => {
      result.current.clearTransformations();
    });

    await act(async () => {
      await result.current.handleImageError(
        createImageErrorEvent(
          "https://ik.example.com/image.jpg?tr=e-bgremove",
        ),
      );
    });

    expect(result.current.transformations).toEqual([]);
    expect(actionMocks.undoPaidTransformation).not.toHaveBeenCalled();
  });
  it("opens the Buy Credits flow when a paid action has insufficient credits", async () => {
    const setCredits = vi.fn();
    const onInsufficientCredits = vi.fn();

    actionMocks.applyRemoveBackground.mockResolvedValueOnce({
      success: false,
      error: "Insufficient credits",
    });

    const { result } = renderHook(() =>
      useImageEditor({
        uploadedImage,
        imageRef: { current: null },
        setCredits,
        activeProjectId: "project-1",
        onInsufficientCredits,
      }),
    );

    await act(async () => {
      await result.current.removeBackground();
    });

    expect(onInsufficientCredits).toHaveBeenCalledTimes(1);
    expect(actionMocks.undoPaidTransformation).not.toHaveBeenCalled();
  });

});
