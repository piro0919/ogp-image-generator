import { useMemo, useRef } from "react";
import { Layer, Shape, Stage } from "react-konva";
import useImage from "use-image";
import { useWindowSize } from "usehooks-ts";
import type Konva from "konva";

type Props = {
  backgroundColor?: string;
  shape?: "circle" | "round" | "square";
  src: string;
};

export default function KonvaCanvas({
  backgroundColor = "transparent",
  shape = "square",
  src,
}: Props): React.JSX.Element {
  const ref = useRef<Konva.Shape>(null);
  const { width } = useWindowSize();
  const size = useMemo(() => Math.min(128, width / 5.5), [width]);
  const [image] = useImage(src);

  return (
    <Stage height={size} width={size}>
      <Layer>
        <Shape
          sceneFunc={(ctx) => {
            if (!image) return;

            ctx.beginPath();

            switch (shape) {
              case "circle": {
                ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);

                break;
              }
              case "round": {
                const radius = size * 0.2;

                ctx.moveTo(radius, 0);
                ctx.arcTo(size, 0, size, radius, radius);
                ctx.arcTo(size, size, size - radius, size, radius);
                ctx.arcTo(0, size, 0, size - radius, radius);
                ctx.arcTo(0, 0, radius, 0, radius);

                break;
              }
              case "square": {
                ctx.rect(0, 0, size, size);

                break;
              }
            }

            ctx.fillStyle = backgroundColor;
            ctx.fill();

            ctx.clip();

            const aspectRatio = image.width / image.height;
            const targetAspectRatio = 1;

            let sx = 0;
            let sy = 0;
            let sWidth = image.width;
            let sHeight = image.height;

            if (aspectRatio > targetAspectRatio) {
              // Image is wider than square - crop the sides
              const newWidth = image.height * targetAspectRatio;

              sx = (image.width - newWidth) / 2;
              sWidth = newWidth;
            } else if (aspectRatio < targetAspectRatio) {
              // Image is taller than square - crop the top and bottom
              const newHeight = image.width / targetAspectRatio;

              sy = (image.height - newHeight) / 2;
              sHeight = newHeight;
            }

            ctx.drawImage(image, sx, sy, sWidth, sHeight, 0, 0, size, size);
            ctx.closePath();
          }}
          height={size}
          ref={ref}
          width={size}
        />
      </Layer>
    </Stage>
  );
}
