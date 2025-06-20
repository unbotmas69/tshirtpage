import React, { Component, ChangeEvent } from "react";
import {
  Col,
  Row,
  Button,
  FormControl,
  Card,
  Form
} from "react-bootstrap";
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
}

interface State {
  canvasController: CanvasController;
  editorReady: boolean;
  textInput: string;
  textFont: string;
  editing: boolean;
  currentColor: string;
  selectedObjects: fabric.Object[];
}

class Editor extends Component<Props, State> {
  state = {
    canvasController: {} as CanvasController,
    editorReady: false,
    textInput: "",
    textFont: "Open Sans",
    editing: false,
    currentColor: "",
    selectedObjects: [] as fabric.Object[],
  };

  // Transformamos product.colors (objeto) a array usable
  getColorsAvailable() {
    const { product } = this.props;
    if (!product || !product.colors) return [];
    return Object.entries(product.colors).map(([color, imgs]) => ({
      color,
      imgFront: imgs.imgFront,
      imgBack: imgs.imgBack,
    }));
  }

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "textInput") {
      this.setState({ textInput: value });
    }
  };

  initCanvasController = (controller: CanvasController) => {
    controller.canvas.on("mouse:down", () => {
      const selected = controller.canvas.getActiveObjects();
      if (selected.length > 0) {
        const canEdit =
          selected.length === 1 && selected[0].isType("textbox");
        this.setState({
          selectedObjects: selected,
          editing: canEdit,
          textInput: canEdit ? (selected[0] as any).text : "",
          textFont: canEdit ? (selected[0] as any).fontFamily : "Open Sans",
          currentColor: canEdit
            ? (selected[0] as any).fill
            : this.state.currentColor,
        });
      } else {
        this.setState({
          selectedObjects: [],
          editing: false,
          textInput: "",
          textFont: "Open Sans",
          // No resetear color para que no desaparezca la selección
        });
      }
    });

    this.setState({ canvasController: controller, editorReady: true });
  };

  componentDidUpdate(prevProps: Props) {
    const { product } = this.props;

    if (product && product !== prevProps.product && this.state.canvasController) {
      const colorsAvailable = this.getColorsAvailable();
      if (colorsAvailable.length === 0) return;

      // Default: primer color disponible
      const defaultColor = colorsAvailable[0];

      this.state.canvasController.changeBackground(defaultColor.imgFront);
      this.setState({ currentColor: defaultColor.color });
    }
  }

  handleColorChange = (color: string) => {
    this.setState({ currentColor: color });
  };

  handleShirtColorChange = (color: string) => {
    const colorsAvailable = this.getColorsAvailable();
    const selectedColor = colorsAvailable.find(
      (item) => item.color === color
    );
    if (selectedColor) {
      this.state.canvasController.changeBackground(selectedColor.imgFront);
      this.setState({ currentColor: selectedColor.color });
    }
  };

  // Función para notificar al padre cuando se agrega un texto personalizado
  notifyAddTextItem = () => {
    if (this.props.addCustomItem) {
      this.props.addCustomItem({ type: "text", price: 20 });
    }
  };

  // Función para notificar al padre cuando se agrega una imagen personalizada
  notifyAddImageItem = () => {
    if (this.props.addCustomItem) {
      this.props.addCustomItem({ type: "image", price: 50 });
    }
  };

  render() {
    const { canvasController, textInput, textFont, currentColor, editing, selectedObjects } = this.state;
    const { product } = this.props;
    if (!product) return null;

    const colorsAvailable = this.getColorsAvailable();

    return (
      <div className="py-5">
        <div className="py-5">
          <div className="container py-5 editor-container">
            <Row>
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
                    const base64Image = canvasController?.getImageBase64("png", true);
                    if (base64Image) {
                      localStorage.setItem("savedDesign", JSON.stringify({
                        image: base64Image,
                        productId: product.id,
                        color: currentColor
                      }));
                      alert("Saved Design");
                    }
                  }}
                >
                  <i className="fas fa-save me-2"></i>
                  Confirmar Playera
                </Button>

                  </div>
                </div>
              </Col>

              <Col md={4}>
                <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <Card.Title>Informacion del producto</Card.Title>
                    <p><strong>Titulo:</strong> {product.title}</p>
                    <p><strong>Precio:</strong> ${product.price}</p>
                  </Card.Body>
                </Card>

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
                      {['black', 'white', 'red', 'blue', 'yellow', 'green'].map(color => (
                        <Button
                          key={color}
                          variant="outline-dark"
                          style={{
                            backgroundColor: color,
                            color: color === 'yellow' || color === 'white' ? 'black' : 'white',
                            minWidth: 60
                          }}
                          onClick={() => this.handleColorChange(color)}
                        >
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </Button>
                      ))}
                    </div>

                    <Button
                      className="w-100 mt-3"
                      variant="primary"
                      disabled={!textInput.trim()}
                      onClick={() => {
                        if (!editing) {
                          canvasController.addText(textInput, textFont, currentColor);
                          this.notifyAddTextItem(); // <-- notificamos aquí
                        } else {
                          canvasController.updateText(selectedObjects[0] as fabric.Textbox, textInput, textFont, currentColor);
                        }
                        this.setState({ textInput: "", editing: false });
                      }}
                    >
                      {editing ? "Actualizar texto" : "Agregar"}
                    </Button>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm mb-3">
                  <Card.Body>
                    <Card.Title className="mb-3">Color de playera</Card.Title>
                    <Form.Select
                      onChange={(e) => this.handleShirtColorChange(e.target.value)}
                      value={currentColor}
                    >
                      {colorsAvailable.map((colorOption, index) => (
                        <option key={index} value={colorOption.color}>
                          {colorOption.color.charAt(0).toUpperCase() + colorOption.color.slice(1)}
                        </option>
                      ))}
                    </Form.Select>
                  </Card.Body>
                </Card>

                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title className="mb-3">Agregar logo</Card.Title>
                    <ImageUploadModal
                      canvas={this.state.canvasController.canvas}
                    />
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
