import React, { Component } from "react";
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import styles from "./Canvas.module.css";

export interface CanvasController {
  canvas: fabric.Canvas;
  setBackground: (imgUrl: string) => void;
  setScreenResize: () => void;
  changeBackground: (imagePath: string) => void;
  addImage: (url: string) => void;
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
    previewImage: string;
  } | null;
  controller?: (controller: CanvasController) => void;
}

interface State {}

export default class Canvas extends Component<Props, State> {
  state = {};
  canvas!: fabric.Canvas;

  componentDidMount() {

    if (this.canvas) {
    this.canvas.dispose(); // Limpia el canvas anterior
  }
  
    this.canvas = new fabric.Canvas("c", {
      renderOnAddRemove: true,
      width: 443,
      height: 563,
      selection: true,
      preserveObjectStacking: true,
    });

    // Listener para editar texto con doble clic
    this.canvas.on("mouse:dblclick", (opt) => {
      const target = opt.target;
      if (target && target.type === "textbox") {
        (target as fabric.Textbox).enterEditing();
        (target as fabric.Textbox).selectAll();
        this.canvas.renderAll();
      }
    });

    if (this.props.controller !== undefined)
      this.props.controller({
        ...(this as CanvasController),
        changeBackground: this.changeBackground,
      });

    if (this.props.product && this.props.product.previewImage) {
      this.setBackground(this.props.product.previewImage);
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
    if (
      this.props.product?.previewImage &&
      this.props.product?.previewImage !== prevProps.product?.previewImage
    ) {
      this.setBackground(this.props.product.previewImage);
    }
  }

  setBackground = (imgUrl: string) => {
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
    }, { crossOrigin: 'anonymous' });
  };

  setScreenResize = () => {
    if (this.props.product && this.props.product.previewImage) {
      this.setBackground(this.props.product.previewImage);
    }
  };

addImage = (url: string) => {
  fabric.Image.fromURL(url, (img: fabric.Image) => {
    img.set({
      left: 50,
      top: 50,
      selectable: true,
      hasControls: true,
      hasBorders: true,
    });
    this.canvas.add(img);
    this.canvas.setActiveObject(img);
    this.canvas.renderAll();
  }, { crossOrigin: 'anonymous' });
};


addText = (text: string, fontFamily: string, textColor: string) => {
  const w = this.canvas.getWidth();
  const h = this.canvas.getHeight();

  const editableText = new fabric.IText(text, {
    left: w / 4,
    top: h / 4,
    fontFamily: fontFamily,
    fontSize: 30,
    fill: textColor,
    selectable: true,
    hasControls: true,
    hasBorders: true,
    lockMovementX: false,
    lockMovementY: false,
    evented: true,
    objectCaching: false,
  });

  this.canvas.add(editableText);
  this.canvas.setActiveObject(editableText);
  this.canvas.renderAll();
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
        this.setBackground(this.props.product?.previewImage || "");
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
      saveAs(blob, fileName + ".tdp");
    } catch (error) {
      console.log(error);
      window.alert("Try downloading again!");
    }
  };

  importFromJSON = (json: object | fabric.Object) => {
    this.canvas.loadFromJSON(json, () => {
      this.canvas.renderAll();
    });
  };

  changeBackground = (imagePath: string) => {
    fabric.Image.fromURL(imagePath, (img) => {
      img.scaleToHeight(this.canvas.getHeight());
      img.scaleToWidth(this.canvas.getWidth());
      img.selectable = false;
      this.canvas.setBackgroundImage(
        img,
        this.canvas.renderAll.bind(this.canvas)
      );
    }, { crossOrigin: 'anonymous' }); 
  };

  getImageBase64 = (
    format: string = "png",
    includeBackground: boolean = true
  ): string => {
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
    return <canvas id="c" className={styles.canvasContainer} />;
  }
}
