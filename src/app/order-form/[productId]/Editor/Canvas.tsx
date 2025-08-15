import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

export interface CanvasController {
  canvas: fabric.Canvas;
  changeBackground: (url: string) => void;
  addText: (text: string, font: string, color: string) => void;
  updateText: (textbox: fabric.Textbox, text: string, font: string, color: string) => void;
  deleteObjects: (objects: fabric.Object[]) => void;
  getImageBase64: (format?: string, withBackground?: boolean) => Promise<string>;
}

interface Props {
  controller: (controller: CanvasController) => void;
  product: { id: string; title: string; price: number };
}

const Canvas: React.FC<Props> = ({ controller, product }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvas = useRef<fabric.Canvas | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 400,
      height: 500,
      preserveObjectStacking: true,
    });
    fabricCanvas.current = canvas;

    const canvasController: CanvasController = {
      canvas,
      changeBackground: (url: string) => {
        if (!url) {
          canvas.setBackgroundImage(null as any, canvas.renderAll.bind(canvas));
          return;
        }
        fabric.Image.fromURL(url, (img) => {
          img.scaleToWidth(canvas.width || 400);
          img.scaleToHeight(canvas.height || 500);
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            originX: "left",
            originY: "top",
          });
        }, { crossOrigin: "anonymous" });
      },
      addText: (text, font, color) => {
        const textbox = new fabric.Textbox(text, {
          left: 50,
          top: 50,
          fontFamily: font,
          fill: color,
          fontSize: 24,
        });
        canvas.add(textbox);
        canvas.setActiveObject(textbox);
        canvas.renderAll();
      },
      updateText: (textbox, text, font, color) => {
        textbox.set({ text, fontFamily: font, fill: color });
        canvas.renderAll();
      },
      deleteObjects: (objects) => {
        objects.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.renderAll();
      },
      getImageBase64: async (format = "png", withBackground = true): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    try {
      const bg = canvas.backgroundImage;
      if (!withBackground && bg) canvas.setBackgroundImage(null as any, canvas.renderAll.bind(canvas));
      requestAnimationFrame(() => {
        const dataUrl = canvas.toDataURL({ format: format as "png" | "jpeg", quality: 1 });
        if (!withBackground && bg) canvas.setBackgroundImage(bg, canvas.renderAll.bind(canvas));
        resolve(dataUrl);
      });
    } catch (err) {
      reject(err);
    }
  });
},
    };

    controller(canvasController);

    return () => {
      canvas.dispose();
    };
  }, [controller, product]);

  return (
    <div className="text-center">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
