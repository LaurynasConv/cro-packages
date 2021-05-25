export const image = {
  src: '',
  setup: (src: string) => {
    image.src = src;
  },
  render: ({ path = '', alt, className, picClassName, width }: PictureOptions, ...sources: Image[]) => {
    const renderSource = ({ src, media, path: imgPath = '', width: sourceWidth }: Image) => {
      const query = media ? `media="(min-width: ${media}px)"` : '';
      const imgWidth = sourceWidth || width ? `width="${sourceWidth || width}"` : '';
      const webp = `${path}${imgPath}/webp/${src}.webp`;
      const fallback = `${path}${imgPath}/${src}.png`;

      return /* html */ `
        <source
          srcset="${image.src}/1x${webp} 1x, ${image.src}/3x${webp} 1.5x"
          type="image/webp"
          ${imgWidth}
          ${query}
        />
        <source
          srcset="${image.src}/1x${fallback} 1x, ${image.src}/1x${fallback} 1.5x"
          type="image/png"
          ${imgWidth}
          ${query}
        />
      `;
    };
    const lastImage = sources[sources.length - 1];
    const lastImageWidth = lastImage.width || width ? `width="${lastImage.width || width}"` : '';

    return /* html */ `
      <picture ${picClassName ? ` class="${picClassName}"` : ''}>
        ${sources.map(renderSource).join('')}
        <img
          src="${image.src}/1x${path}${lastImage.path || ''}/${lastImage.src}.png"
          ${className ? `class="${className}"` : ''}
          ${alt ? `alt="${alt}"` : ''}
          ${lastImageWidth}
        />
      </picture>
    `;
  },
};

interface Image {
  src: string | number;
  path?: string;
  media?: number;
  width?: number;
}

export interface PictureOptions {
  path?: string;
  alt?: string;
  className?: string;
  picClassName?: string;
  width?: number;
}
