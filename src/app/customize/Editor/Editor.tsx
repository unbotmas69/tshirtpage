import React, { Component, ChangeEvent } from "react";
import {
  Col,
  Row,
  Button,
  InputGroup,
  FormControl,
  Card,
  Form,
} from "react-bootstrap";
import Canvas, { CanvasController } from "./Canvas";
import ImageUploadModal from "../Modals/ImageUploadModal";
import ExportImageModal from "../Modals/ExportImageModal";
import ColorPicker from "../ColorPicker/ColorPicker";

import "./Editor.css";
import { fabric } from "fabric";

interface Props {}
interface State {
  canvasController: CanvasController;
  editorReady: boolean;
  textInput: string;
  textFont: string;
  editing: boolean;
  currentColor: string;
  selectedObjects: fabric.Object[];
  [key: string]: any;
}

class Editor extends Component<Props, State> {
  state = {
    canvasController: {} as CanvasController,
    editorReady: false,
    textInput: "",
    textFont: "Open Sans",
    editing: false,
    currentColor: "rgba(255,255,255,255)",
    selectedObjects: [] as fabric.Object[],
  };

  handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value });
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

  render() {
    const { canvasController } = this.state;

    return (
      <div className="container py-4 editor-container">
        <Row>
          <Col md={8} className="canvas-column">
            <Canvas
              tshirt="tshirt"
              controller={(controller) =>
                this.initCanvasController(controller)
              }
            />
            <div className="d-flex justify-content-between mt-3">
              <div className="col-6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Button
                variant="danger"
                style={{width: '90%'}}
                disabled={this.state.selectedObjects.length === 0}
                onClick={() => {
                  canvasController.deleteObjects(this.state.selectedObjects);
                  this.setState({ selectedObjects: [] as fabric.Object[] });
                }}
              >
                <i className="fas fa-trash-alt me-2"></i>
                Delete selected
              </Button>
              </div>
              <div className="col-6" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ExportImageModal
                exportFunction={this.state.canvasController.exportToImage}
              />
              </div>
            </div>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Text editor</Card.Title>

                <FormControl
                  placeholder={
                    !this.state.editing ? "Add text" : "Edit text"
                  }
                  aria-label="text"
                  name="textInput"
                  onChange={this.handleOnChange}
                  value={this.state.textInput}
                  type="text"
                  style={{width: '100%'}}
                  className="mb-3 w-100"
                />

                <ColorPicker
                  defaultColor={this.state.currentColor}
                  getColor={(color) =>
                    this.setState({ currentColor: color })
                  }
                />

                <Button
                  className="w-100 mt-3"
                  variant="primary"
                  onClick={() => {
                    if (!this.state.editing) {
                      canvasController.addText(
                        this.state.textInput,
                        this.state.textFont,
                        this.state.currentColor
                      );
                    } else {
                      canvasController.updateText(
                        this.state.selectedObjects[0] as fabric.Textbox,
                        this.state.textInput,
                        this.state.textFont,
                        this.state.currentColor
                      );
                    }
                    this.setState({ textInput: "", editing: false });
                  }}
                >
                  {!this.state.editing ? "Add text" : "Update text"}
                </Button>
              </Card.Body>
            </Card>

            <Card className="shadow-sm mb-3">
              <Card.Body>
                <Card.Title className="mb-3">Change shirt</Card.Title>
                <Form.Select
                  onChange={(e) =>
                    this.state.canvasController.changeBackground(
                      `/img/shirts/${e.target.value}.png`
                    )
                  }
                >
                  <option value="tshirtBlackF">Black</option>
                  <option value="tshirtBlueF">Blue</option>
                  <option value="tshirtWhiteF">White</option>
                  <option value="tshirtRedF">Red</option>
                  <option value="tshirtBrownF">Brown</option>
                  <option value="tshirtYellowF">Yellow</option>
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
