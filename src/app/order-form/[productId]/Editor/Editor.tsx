import React, { Component, ChangeEvent } from "react";
import { Col, Row, Button, FormControl, Card, Form } from "react-bootstrap";
import Canvas, { CanvasController } from "./Canvas";
import ImageUploadModal from "../Modals/ImageUploadModal";
import { fabric } from "fabric";
import { Product } from "../page";

interface CustomItem {
  type: "text" | "image";
  price: number;
}

interface Props {
  product: Product | null;
  addCustomItem?: (item: CustomItem) => void;
  onConfirmDesign?: (images: { front: string; back: string }) => void;
}

interface State {
  canvasControllerFront: CanvasController;
  canvasControllerBack: CanvasController;
  editorReady: boolean;
  textInput: string;
  textFont: string;
  editing: boolean;
  currentColor: string;
  textColor: string;
  selectedObjects: fabric.Object[];
}

class Editor extends Component<Props, State> {
  state: State = {
    canvasControllerFront: {} as CanvasController,
    canvasControllerBack: {} as CanvasController,
    editorReady: false,
    textInput: "",
    textFont: "Open Sans",
    editing: false,
    currentColor: "",
    textColor: "",
    selectedObjects: [],
  };

  getColorsAvailable() {
  const { product } = this.props;
  if (!product || !product.colors) return [];
  return Object.entries(product.colors).map(([color, imgs]) => ({
    color,
    imgFront: imgs.imgF,
    imgBack: imgs.imgB,
  }));
}

  initCanvasControllerFront = (controller: CanvasController) => {
    this.setState({ canvasControllerFront: controller, editorReady: true }, () => {
      const colorsAvailable = this.getColorsAvailable();
      if (colorsAvailable.length > 0) {
        this.handleShirtColorChange(colorsAvailable[0].color);
      }
    });
  };

  initCanvasControllerBack = (controller: CanvasController) => {
    this.setState({ canvasControllerBack: controller, editorReady: true }, () => {
      const colorsAvailable = this.getColorsAvailable();
      if (colorsAvailable.length > 0) {
        this.handleShirtColorChange(colorsAvailable[0].color);
      }
    });
  };

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "textInput") this.setState({ textInput: value });
  };

  handleShirtColorChange = (color: string) => {
    const { canvasControllerFront, canvasControllerBack } = this.state;
    const selectedColor = this.getColorsAvailable().find((c) => c.color === color);

    if (selectedColor) {
      canvasControllerFront.changeBackground(selectedColor.imgFront);
      canvasControllerBack.changeBackground(selectedColor.imgBack);
      this.setState({ currentColor: selectedColor.color });
    }
  };

  handleColorTextChange = (colorT: string) => {
    this.setState({ textColor: colorT });
  };

  notifyAddTextItem = () => {
    this.props.addCustomItem?.({ type: "text", price: 1 });
  };

  notifyAddImageItem = () => {
    this.props.addCustomItem?.({ type: "image", price: 2 });
  };

  renderCanvasSection = (title: string, controller: CanvasController) => {
    const { textInput, textFont, textColor, editing, selectedObjects } = this.state;

    return (
      <Row className="mb-5">
        <Col md={8}>
          <div className="text-center mb-2">
            <p style={{ color: "black", margin: 0 }}>
              <strong>{title}</strong>
            </p>
          </div>

          <Canvas
            controller={title.includes("frontal") ? this.initCanvasControllerFront : this.initCanvasControllerBack}
            product={this.props.product!}
          />

          <div className="d-flex justify-content-between m-3">
            <Button
              variant="danger"
              style={{ width: "90%" }}
              disabled={selectedObjects.length === 0}
              onClick={() => {
                controller.deleteObjects(selectedObjects);
                this.setState({ selectedObjects: [] });
              }}
            >
              <i className="fas fa-trash-alt me-2"></i>
              Borrar elemento seleccionado
            </Button>
          </div>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title className="mb-3">Agregar texto</Card.Title>
              <FormControl
                placeholder={editing ? "Editar" : "Agregar"}
                name="textInput"
                onChange={this.handleOnChange}
                value={textInput}
                type="text"
                className="mb-3"
              />
              <div className="color-buttons d-flex flex-wrap gap-2 mb-3">
                {["black", "white", "red", "blue", "yellow", "green"].map((colorT) => (
                  <Button
                    key={colorT}
                    variant="outline-dark"
                    style={{
                      backgroundColor: colorT,
                      color: colorT === "yellow" || colorT === "white" ? "black" : "white",
                      minWidth: 60,
                    }}
                    onClick={() => this.handleColorTextChange(colorT)}
                  >
                    {colorT.charAt(0).toUpperCase() + colorT.slice(1)}
                  </Button>
                ))}
              </div>

              <Button
                className="w-100 mt-3"
                variant="primary"
                disabled={!textInput.trim()}
                onClick={() => {
                  if (!editing) {
                    controller.addText(textInput, textFont, textColor);
                    this.notifyAddTextItem();
                  } else {
                    controller.updateText(selectedObjects[0] as fabric.Textbox, textInput, textFont, textColor);
                  }
                  this.setState({ textInput: "", editing: false });
                }}
              >
                {editing ? "Actualizar texto" : "Agregar"}
              </Button>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Agregar logo</Card.Title>
              <ImageUploadModal 
              canvas={controller.canvas} 
              onImageAdded={this.notifyAddImageItem} 
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

handleConfirm = async () => {
  const { canvasControllerFront, canvasControllerBack } = this.state;

  if (!canvasControllerFront || !canvasControllerBack) {
    alert("El editor aún no está listo.");
    return;
  }

  // Renderizar canvas antes de obtener imágenes
  canvasControllerFront.canvas.discardActiveObject();
  canvasControllerFront.canvas.renderAll();
  canvasControllerBack.canvas.discardActiveObject();
  canvasControllerBack.canvas.renderAll();

  try {
    const frontBase64 = await canvasControllerFront.getImageBase64("png", true);
    const backBase64 = await canvasControllerBack.getImageBase64("png", true);

    if (!frontBase64 || !backBase64) {
      alert("Ocurrió un error al generar las imágenes.");
      return;
    }

    // Enviar imágenes como strings
    this.props.onConfirmDesign?.({
      front: frontBase64,
      back: backBase64,
    });

    alert("Guardado, proceda al pedido");
  } catch (error) {
    console.error(error);
    alert("Error al generar las imágenes. Intente nuevamente.");
  }
};


  render() {
    const { currentColor, canvasControllerFront, canvasControllerBack } = this.state;
    const { product } = this.props;
    if (!product) return null;

    const colorsAvailable = this.getColorsAvailable();

    return (
      <div className="py-5">
        <div className="container py-5 editor-container">
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Información del producto</Card.Title>
              <p><strong>Título:</strong> {product.title}</p>
              <p><strong>Precio:</strong> ${product.price}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm mb-3">
            <Card.Body>
              <Card.Title>Color de playera</Card.Title>
              {colorsAvailable.length > 0 ? (
                <Form.Select
                  onChange={(e) => this.handleShirtColorChange(e.target.value)}
                  value={currentColor}
                >
                  {colorsAvailable.map((c, idx) => (
                    <option key={idx} value={c.color}>
                      {c.color.charAt(0).toUpperCase() + c.color.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <p>Cargando colores...</p>
              )}
            </Card.Body>
          </Card>

          {this.renderCanvasSection("Diseño frontal", canvasControllerFront)}
          {this.renderCanvasSection("Diseño trasero", canvasControllerBack)}

          <div className="d-flex justify-content-between m-3">
            <Button
              variant="success"
              style={{ width: "90%" }}
              onClick={this.handleConfirm}
            >
              <i className="fas fa-save me-2"></i>
              Confirmar Playera
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
