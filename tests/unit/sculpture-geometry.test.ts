import { describe, expect, it } from "vitest";
import {
  morphAmount,
  renderSize,
  ringGeometry,
} from "../../src/presentation/graphics/sculpture-geometry";

describe("sculpture geometry", () => {
  it("creates two triangles per ring segment and side with finite coordinates", () => {
    const mesh = ringGeometry(24, 8, 1, 0.16);
    expect(mesh.length).toBe(24 * 8 * 6 * 6);
    expect(mesh.every(Number.isFinite)).toBe(true);
  });

  it("limits pixel density and canvas size", () => {
    expect(renderSize(400, 400, 3)).toEqual({ width: 600, height: 600 });
    expect(renderSize(1200, 600, 2)).toEqual({ width: 900, height: 450 });
    expect(renderSize(0, 0, 1)).toEqual({ width: 1, height: 1 });
  });

  it("clamps and eases scroll-linked geometry deformation", () => {
    expect(morphAmount(-1)).toBe(0);
    expect(morphAmount(0)).toBe(0);
    expect(morphAmount(0.4)).toBeCloseTo(0.5);
    expect(morphAmount(0.8)).toBe(1);
    expect(morphAmount(3)).toBe(1);
    expect(morphAmount(Number.NaN)).toBe(0);
  });
});
