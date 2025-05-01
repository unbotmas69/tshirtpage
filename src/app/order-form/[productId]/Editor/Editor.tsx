import React, { Component, ChangeEvent } from "react";
import { Col, Row, Button, InputGroup, FormControl, Card, Form } from "react-bootstrap";
import Canvas, { CanvasController } from "./Canvas";
import ImageUploadModal from "../Modals/ImageUploadModal";
import ExportImageModal from "../Modals/ExportImageModal";
import SaveImageModal from "../Modals/SaveImageModal";
import "./Editor.css";
import { fabric } from "fabric";
import { Product } from "../page";

interface Props {
  product: Product | null;
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
    currentColor: "rgba(255,255,255,255)", // Default to white
    selectedObjects: [] as fabric.Object[],
  };

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
            : "rgba(255,255,255,255)",
        });
      } else {
        this.setState({
          selectedObjects: [],
          editing: false,
          textInput: "",
          textFont: "Open Sans",
          currentColor: "rgba(255,255,255,255)",
        });
      }
    });

    this.setState({ canvasController: controller, editorReady: true });
  };

  handleColorChange = (color: string) => {
    this.setState({ currentColor: color });
  };

  handleShirtColorChange = (color: string) => {
    const selectedColor = this.props.product?.colorsAvailable.find(
      (item) => item.color === color
    );
    if (selectedColor) {
      this.state.canvasController.changeBackground(selectedColor.imgFront);
    }
  };

  render() {
    const { canvasController, textInput, textFont, currentColor, editing, selectedObjects } = this.state;
    const { product } = this.props;

    if (!product) return null;

    return (
      <div className="container py-4 editor-container">
        <Row>
          <Col md={8} className="canvas-column">
            <Canvas
              controller={this.initCanvasController}
              product={this.props.product}
            />
            <div className="d-flex justify-content-between mt-3">
              <div className="col-6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Button
                  variant="danger"
                  style={{width: '90%'}}
                  disabled={selectedObjects.length === 0}
                  onClick={() => {
                    canvasController.deleteObjects(selectedObjects);
                    this.setState({ selectedObjects: [] });
                  }}
                >
                  <i className="fas fa-trash-alt me-2"></i>
                  Delete selected
                </Button>
              </div>
              <div className="col-6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Button
                variant="success"
                style={{ width: '90%' }}
                onClick={() => {
                  const base64Image = canvasController?.getImageBase64("png", true); // Obtener la imagen en formato base64
                  if (base64Image) {
                    // Guardar la imagen en localStorage
                    localStorage.setItem("savedDesign", base64Image);
                    alert("Saved Design");
                  }
                }}
              >
                <i className="fas fa-trash-alt me-2"></i>
                Save Design
              </Button>
              </div>
            </div>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Text editor</Card.Title>
                <FormControl
                  placeholder={editing ? "Edit text" : "Add text"}
                  aria-label="text"
                  name="textInput"
                  onChange={this.handleOnChange}
                  value={textInput}
                  type="text"
                  className="mb-3 w-100"
                />

                {/* Color buttons */}
                <div className="color-buttons d-flex mb-3">
                  {['black', 'white', 'red', 'blue', 'yellow', 'green'].map(color => (
                    <Button
                      key={color}
                      variant="outline-dark"
                      style={{ backgroundColor: color, color: color === 'yellow' || color === 'white' ? 'black' : 'white' }}
                      onClick={() => this.handleColorChange(color)}
                    >
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </Button>
                  ))}
                </div>

                <Button
                  className="w-100 mt-3"
                  variant="primary"
                  onClick={() => {
                    if (!editing) {
                      canvasController.addText(textInput, textFont, currentColor);
                    } else {
                      canvasController.updateText(selectedObjects[0] as fabric.Textbox, textInput, textFont, currentColor);
                    }
                    this.setState({ textInput: "", editing: false });
                  }}
                >
                  {editing ? "Update text" : "Add text"}
                </Button>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Change shirt</Card.Title>
                <Form.Select
                  onChange={(e) => this.handleShirtColorChange(e.target.value)}
                >
                  {product.colorsAvailable.map((colorOption, index) => (
                    <option key={index} value={colorOption.color}>
                      {colorOption.color.charAt(0).toUpperCase() + colorOption.color.slice(1)}
                    </option>
                  ))}
                </Form.Select>
              </Card.Body>
            </Card>

            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="mb-3">Add images</Card.Title>
                <ImageUploadModal
                  canvas={this.state.canvasController.canvas}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Editor;
