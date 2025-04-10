import React, { Component } from "react";
import { fabric } from "fabric";
//"fabric": "^6.6.2",
//import * as fabric from 'fabric'
import { saveAs } from "file-saver";

export interface CanvasController {
  canvas: fabric.Canvas;
  setBackground: () => void;
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
    object: fabric.Object[],
    direction: CanvasOrderDirection | string
  ) => void;
  exportToImage: (
    format: string,
    fileName?: string,
    includeBackground?: boolean
  ) => void;
  exportToJSON: (fileName: string) => void;
  importFromJSON: (json: object | fabric.Object) => void;
}

export enum CanvasOrderDirection {
  backwards = "backwards",
  forwards = "forwards",
  back = "back",
  front = "front",
}

interface Props {
  tshirt?: string;
  controller?: (controller: CanvasController) => void;
}
interface State {}

export default class Canvas extends Component<Props, State> {
  state = {};
  canvas!: fabric.Canvas;

  

  componentDidMount() {
    //creating the canvas
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
    // setting the background image
    if (this.props.tshirt !== undefined) this.setBackground();

    
  }

  setBackground = () => {
    const imgUrl = '/img/shirts/tshirtBlackF.png';
    fabric.Image.fromURL(imgUrl, (img) => {
      img.center();
      if (window.innerWidth > 1000) {
        const h: number = img.getScaledHeight();
        const w: number = img.getScaledWidth();
        this.canvas.setHeight(563);
        this.canvas.setWidth(443);
        img.scaleToHeight(this.canvas.getHeight());
        img.scaleToWidth(this.canvas.getWidth());
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
      } else
      if (window.innerHeight >= 600 && window.innerWidth <= 1000) {
        this.canvas.setHeight(563);
        this.canvas.setWidth(443);
        img.scaleToHeight(this.canvas.getHeight());
        img.scaleToWidth(this.canvas.getWidth());
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
      } else
      if (window.innerHeight >= 400 && window.innerWidth <= 600) {
        this.canvas.setHeight(563);
        this.canvas.setWidth(443);
        img.scaleToHeight(this.canvas.getHeight());
        img.scaleToWidth(this.canvas.getWidth());
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
      }
    });
  };

  setScreenResize = () => {
    const imgUrl = `images/${this.props.tshirt}.png`;
    fabric.Image.fromURL(imgUrl, (img) => {
      img.center();
      //if window.innerHeight is greater than img.getScaledHeight
      if (window.innerWidth > 1000) {
        this.setBackground();
      }
      if (window.innerHeight >= 600 && window.innerWidth <= 1000) {
        this.canvas.setHeight(563);
        this.canvas.setWidth(443);
        img.scaleToHeight(this.canvas.getHeight());
        img.scaleToWidth(this.canvas.getWidth());
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
      }
      if (window.innerHeight >= 400 && window.innerWidth <= 600) {
        this.canvas.setHeight(563);
        this.canvas.setWidth(443);
        img.scaleToHeight(this.canvas.getHeight());
        img.scaleToWidth(this.canvas.getWidth());
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas)
        );
      }
    });

    console.log(this.canvas.getHeight(), this.canvas.getWidth());
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
    objects: fabric.Object[],
    direction: CanvasOrderDirection | string
  ) => {
    switch (direction) {
      case CanvasOrderDirection.backwards:
        objects.forEach((object) => this.canvas.sendBackwards(object));
        break;
      case CanvasOrderDirection.forwards:
        objects.forEach((object) => this.canvas.bringForward(object));
        break;
      case CanvasOrderDirection.back:
        objects.forEach((object) => this.canvas.sendToBack(object));
        break;
      case CanvasOrderDirection.front:
        objects.forEach((object) => this.canvas.bringToFront(object));
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
        this.setBackground();
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

  changeBackground = (imagePath: string) => {
    fabric.Image.fromURL(imagePath, (img) => {
      img.scaleToHeight(this.canvas.getHeight());
      img.scaleToWidth(this.canvas.getWidth());
      img.selectable = false;
      this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas));
    });
  };

  importFromJSON = (json: object | fabric.Object) => {
    this.canvas.loadFromJSON(json, () => {
      console.log("uploaded");
      this.canvas.renderAll();
    });
  };

  render() {
    window.addEventListener("resize", this.setBackground);
    return <canvas id="c" style={{ border: "2px solid #b2b2b2" }} />;
  }
}
