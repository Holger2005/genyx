interface MediaBase {
  readonly id: string;
  readonly title: string;
  readonly caption: string;
  readonly src: string;
}

export interface ProjectImage extends MediaBase {
  readonly kind: "image";
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

export interface ProjectVideo extends MediaBase {
  readonly kind: "video";
  readonly captions: string;
  readonly captionsLabel: string;
  readonly transcript: string;
}

export type ProjectMedia = ProjectImage | ProjectVideo;
