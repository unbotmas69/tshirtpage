import React, { Component } from "react";
import { fabric } from "fabric";
import { saveAs } from "file-saver";

export interface CanvasController {
  canvas: fabric.Canvas;
  setBackground: (imgUrl: string) => void;
    setScreenResize: () => void;
  changeBackground: (imagePath: string) => void;
  addImage: () => void;
  addText: (text: string, fontFamily: string, textColor: string) => void;
  updateText: (
    textObj: fabric.Textbox,
    text: string,
    fontFamily: string,
    textColor: string
  ) => void;
  deleteObjects: (objects: fabric.Object[]) => void;
  changeObjectOrder: (
    object: fabric.Object[] | fabric.Object,
    direction: CanvasOrderDirection | string
  ) => void;
  exportToImage: (
    format: string,
    fileName?: string,
    includeBackground?: boolean
  ) => void;
  exportToJSON: (fileName: string) => void;
  importFromJSON: (json: object | fabric.Object) => void;
  getImageBase64: (
    format: string,
    includeBackground: boolean
  ) => string;
}

export enum CanvasOrderDirection {
  backwards = "backwards",
  forwards = "forwards",
  back = "back",
  front = "front",
}

interface Props {
  product?: {
    imgFront: string;
  } | null;
  controller?: (controller: CanvasController) => void;
}

interface State {}

export default class Canvas extends Component<Props, State> {
  state = {};
  canvas!: fabric.Canvas;

  componentDidMount() {
    this.canvas = new fabric.Canvas("c", {
      renderOnAddRemove: true,
      width: 443,
      height: 563,
    });

    if (this.props.controller !== undefined)
      this.props.controller({
        ...(this as CanvasController),
        changeBackground: this.changeBackground,
      });

    // Solo se llama a setBackground si el producto tiene la propiedad imgFront
    if (this.props.product && this.props.product.imgFront) {
      this.setBackground(this.props.product.imgFront);
    }

    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.setScreenResize);
    }
  }

  componentWillUnmount() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.setScreenResize);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Solo si el producto cambió
    if (
      this.props.product?.imgFront &&
      this.props.product?.imgFront !== prevProps.product?.imgFront
    ) {
      this.setBackground(this.props.product.imgFront);
    }
  }
  
  setBackground = (imgUrl: string) => {
    // Establece la imagen de fondo en el lienzo
    fabric.Image.fromURL(imgUrl, (img) => {
      img.center();
      this.canvas.setHeight(563);
      this.canvas.setWidth(443);
      img.scaleToHeight(this.canvas.getHeight());
      img.scaleToWidth(this.canvas.getWidth());
      this.canvas.setBackgroundImage(
        img,
        this.canvas.renderAll.bind(this.canvas)
      );
    });
  };

  setScreenResize = () => {
    // Llama a setBackground cuando el tamaño de la pantalla cambie
    if (this.props.product && this.props.product.imgFront) {
      this.setBackground(this.props.product.imgFront);
    }
  };

  addImage = () => {
    console.log("adding image");
    fabric.Image.fromURL("images/logo512.png", (img: fabric.Image) => {
      this.canvas.add(img);
    });
  };

  addText = (text: string, fontFamily: string, textColor: string) => {
    const [w, h]: number[] = [this.canvas.getWidth(), this.canvas.getHeight()];
    let t = new fabric.Textbox(text, {
      left: w / 4,
      top: h / 4,
      fontFamily: fontFamily,
      fontSize: 100,
      fill: textColor,
      editable: true,
    });
    this.canvas.add(t);
  };

  updateText = (
    textObj: fabric.Textbox,
    text: string,
    fontFamily: string,
    textColor: string
  ) => {
    textObj.set("text", text);
    textObj.set("fontFamily", fontFamily);
    textObj.set("fill", textColor);
    this.canvas.renderAll();
  };

  deleteObjects = (objects: fabric.Object[]) => {
    objects.forEach((object) => this.canvas.remove(object));
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  };

  changeObjectOrder = (
    objects: fabric.Object[] | fabric.Object,
    direction: CanvasOrderDirection | string
  ) => {
    switch (direction) {
      case CanvasOrderDirection.backwards:
        if (Array.isArray(objects)) {
          objects.forEach((object) => this.canvas.sendBackwards(object));
        } else {
          this.canvas.sendBackwards(objects);
        }
        break;
      case CanvasOrderDirection.forwards:
        if (Array.isArray(objects)) {
          objects.forEach((object) => this.canvas.bringForward(object));
        } else {
          this.canvas.bringForward(objects);
        }
        break;
      case CanvasOrderDirection.back:
        if (Array.isArray(objects)) {
          objects.forEach((object) => this.canvas.sendToBack(object));
        } else {
          this.canvas.sendToBack(objects);
        }
        break;
      case CanvasOrderDirection.front:
        if (Array.isArray(objects)) {
          objects.forEach((object) => this.canvas.bringToFront(object));
        } else {
          this.canvas.bringToFront(objects);
        }
        break;
      default:
        break;
    }
    this.canvas.discardActiveObject();
    this.canvas.renderAll();
  };

  exportToImage = (
    format: string,
    fileName: string = "design",
    includeBackground?: boolean
  ) => {
    try {
      this.canvas.discardActiveObject();
      this.canvas.renderAll();
      if (!includeBackground) {
        this.canvas.backgroundImage = undefined;
        this.canvas.renderAll();
        this.canvas.getElement().toBlob((data: any) => {
          saveAs(data, fileName + "." + format);
        });
        this.setBackground(this.props.product?.imgFront || ""); // En caso de que imgFront no esté definido
      } else {
        this.canvas.renderAll();
        this.canvas.getElement().toBlob((data: any) => {
          saveAs(data, fileName + "." + format);
        });
      }
    } catch (error) {
      console.log(error);
      window.alert("Try downloading again!");
    }
  };

  exportToJSON = (fileName: string) => {
    try {
      fileName = fileName.replace(/([^a-z0-9 ]+)/gi, "-");
      const data = JSON.stringify(this.canvas.toJSON());
      var blob = new Blob([data], { type: "application/json" });
      console.log(data);
      saveAs(blob, fileName + ".tdp");
    } catch (error) {
      console.log(error);
      window.alert("Try downloading again!");
    }
  };

  importFromJSON = (json: object | fabric.Object) => {
    this.canvas.loadFromJSON(json, () => {
      console.log("uploaded");
      this.canvas.renderAll();
    });
  };

  changeBackground = (imagePath: string) => {
    fabric.Image.fromURL(imagePath, (img) => {
      img.scaleToHeight(this.canvas.getHeight());
      img.scaleToWidth(this.canvas.getWidth());
      img.selectable = false;
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
    });
  };
  
  getImageBase64 = (format: string = "png", includeBackground: boolean = true): string => {
    const originalBackground = this.canvas.backgroundImage;
  
    if (!includeBackground) {
      this.canvas.setBackgroundImage(null as any, this.canvas.renderAll.bind(this.canvas));
    }
  
    const dataUrl = this.canvas.toDataURL({
      format: format as "png" | "jpeg",
      quality: 1.0,
    });
  
    if (!includeBackground && originalBackground) {
      this.canvas.setBackgroundImage(originalBackground, this.canvas.renderAll.bind(this.canvas));
    }
  
    return dataUrl;
  };
  
  render() {
    return <canvas id="c" style={{ border: "2px solid #b2b2b2" }} />;
  }
  
}
