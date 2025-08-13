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
  onConfirmDesign?: (base64: string) => void;
}

interface State {
  canvasController: CanvasController;
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
    canvasController: {} as CanvasController,
    editorReady: false,
    textInput: "",
    textFont: "Open Sans",
    editing: false,
    currentColor: "",
    textColor: "",
    selectedObjects: [],
  };

  // Devuelve el array de colores del producto
getColorsAvailable() {
  const { product } = this.props;
  if (!product || !product.colors) return [];
  return Object.entries(product.colors).map(([color, imgs]) => ({
    color,
    imgFront: imgs.imgF,
    imgBack: imgs.imgB,
  }));
}

  initCanvasController = (controller: CanvasController) => {
    controller.canvas.on("mouse:down", () => {
      const selected = controller.canvas.getActiveObjects();
      if (selected.length > 0) {
        const canEdit = selected.length === 1 && selected[0].isType("textbox");
        this.setState({
          selectedObjects: selected,
          editing: canEdit,
          textInput: canEdit ? (selected[0] as any).text : "",
          textFont: canEdit ? (selected[0] as any).fontFamily : "Open Sans",
        });
      } else {
        this.setState({
          selectedObjects: [],
          editing: false,
          textInput: "",
          textFont: "Open Sans",
        });
      }
    });

    this.setState({ canvasController: controller, editorReady: true }, () => {
      // Si ya hay producto cargado, inicializar color por defecto
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
    const { canvasController } = this.state;
    if (!canvasController || !canvasController.changeBackground) return;

    const colorsAvailable = this.getColorsAvailable();
    const selectedColor = colorsAvailable.find((c) => c.color === color);

    if (selectedColor) {
      canvasController.changeBackground(selectedColor.imgFront);
      this.setState({ currentColor: selectedColor.color });
    }
  };

  handleColorTextChange = (colorT: string) => {
    this.setState({ textColor: colorT });
  };

  notifyAddTextItem = () => {
    if (this.props.addCustomItem) {
      this.props.addCustomItem({ type: "text", price: 1 });
    }
  };

  notifyAddImageItem = () => {
    if (this.props.addCustomItem) {
      this.props.addCustomItem({ type: "image", price: 2 });
    }
  };

  render() {
    const { canvasController, textInput, textFont, currentColor, textColor, editing, selectedObjects } = this.state;
    const { product } = this.props;
    if (!product) return null;

    const colorsAvailable = this.getColorsAvailable();

    return (
      <div className="py-5">
        <div className="py-5">
          <div className="container py-5 editor-container">
            <Row>

                  <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <Card.Title>Informacion del producto</Card.Title>
                    <p><strong>Titulo:</strong> {product.title}</p>
                    <p><strong>Precio:</strong> ${product.price}</p>
                  </Card.Body>
                </Card>

              <Col md={8} className="canvas-column">
                <Canvas
                  controller={this.initCanvasController}
                  product={product}
                />
                <div className="d-flex justify-content-between mt-3">
                  <div className="col-6 d-flex justify-content-center">
                    <Button
                      variant="danger"
                      style={{ width: '90%' }}
                      disabled={selectedObjects.length === 0}
                      onClick={() => {
                        canvasController.deleteObjects(selectedObjects);
                        this.setState({ selectedObjects: [] });
                      }}
                    >
                      <i className="fas fa-trash-alt me-2"></i>
                      Borrar elemento seleccionado
                    </Button>
                  </div>
                  <div className="col-6 d-flex justify-content-center">
                <Button
                  variant="success"
                  style={{ width: '90%' }}
                  onClick={() => {
                    const base64Image = canvasController.getImageBase64("png", true);
                    console.log(base64Image);
                    if (base64Image) {
                      localStorage.setItem("savedDesign", JSON.stringify({
                        image: base64Image,
                        productId: product.id,
                        color: currentColor
                      }));

                      if (this.props.onConfirmDesign) {
                        this.props.onConfirmDesign(base64Image);
                      }

                      alert("Guardado, proceda al pedido");
                    }
                  }}
                >
                  <i className="fas fa-save me-2"></i>
                  Confirmar Playera
                </Button>

                  </div>
                </div>
              </Col>

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
                      {['black', 'white', 'red', 'blue', 'yellow', 'green'].map(colorT => (
                        <Button
                          key={colorT}
                          variant="outline-dark"
                          style={{
                            backgroundColor: colorT,
                            color: colorT === 'yellow' || colorT === 'white' ? 'black' : 'white',
                            minWidth: 60
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
                          canvasController.addText(textInput, textFont, textColor);
                          this.notifyAddTextItem(); // <-- notificamos aquí
                        } else {
                          canvasController.updateText(selectedObjects[0] as fabric.Textbox, textInput, textFont, textColor);
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
                    <ImageUploadModal canvas={this.state.canvasController.canvas} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
