const TAU = Math.PI * 2;

export function ringGeometry(segments: number, sides: number, radius: number, tube: number) {
  const vertices: number[] = [];

  function vertex(i: number, j: number) {
    const u = (i / segments) * TAU;
    const v = (j / sides) * TAU;
    const radial = radius + tube * Math.cos(v);
    vertices.push(
      radial * Math.cos(u),
      radial * Math.sin(u),
      tube * Math.sin(v),
      Math.cos(v) * Math.cos(u),
      Math.cos(v) * Math.sin(u),
      Math.sin(v),
    );
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < sides; j++) {
      vertex(i, j);
      vertex(i + 1, j);
      vertex(i + 1, j + 1);
      vertex(i, j);
      vertex(i + 1, j + 1);
      vertex(i, j + 1);
    }
  }

  return new Float32Array(vertices);
}

export function renderSize(width: number, height: number, pixelRatio: number) {
  const ratio = Math.min(Math.max(pixelRatio, 1), 1.5, 900 / Math.max(width, height, 1));
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

export function morphAmount(scroll: number) {
  if (!Number.isFinite(scroll)) return 0;
  const progress = Math.max(0, Math.min(1, scroll / 0.8));
  return progress * progress * (3 - 2 * progress);
}
