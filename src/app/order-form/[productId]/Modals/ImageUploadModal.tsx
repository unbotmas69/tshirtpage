import React, { ReactElement, useState, ChangeEvent } from "react";
import { Button, Modal, Form, FormControl, Tabs, Tab } from "react-bootstrap";
import { fabric } from "fabric";

interface Props {
  canvas: fabric.Canvas;
  onImageAdded?: () => void;
}

function ImageUploadModal({ canvas, onImageAdded }: Props): ReactElement {
  const [show, setShow] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageName, setImageName] = useState("image");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFileOnChange = (e: ChangeEvent<HTMLInputElement> | any) => {
    let file: File = e.target.files[0];
    const imageSrc = URL.createObjectURL(file);
    setImageURL(imageSrc);
    setImageName(file.name);
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setImageURL(e.target.value);
  };

  const handleImageUpload = () => {
    if (!imageURL) return;

    fabric.Image.fromURL(imageURL, (img) => {
      img.scaleToHeight(400);
      canvas.add(img);
      canvas.renderAll();

      // Aquí llamamos a la función que suma el precio
      if (onImageAdded) onImageAdded();

      handleClose();
    });
  };

  return (
    <>
      <Button className="add-img-btn" variant="primary" onClick={handleShow}>
        <i className="fas fa-image mr-1"></i>
        Add Image
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Tabs defaultActiveKey="upload" id="uncontrolled-tab-example">
            <Tab eventKey="upload" title="Upload">
              <div className="py-2 px-2">
                <Form.Group controlId="formFile">
                  <Form.Label>
                    Upload an image from your computer <br />
                    (png, jpg, jpeg, svg is officially supported)
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/jpg,image/jpeg,image/png, .svg"
                    onChange={handleFileOnChange}
                  />
                </Form.Group>
              </div>
            </Tab>
            <Tab eventKey="fromUrl" title="From URL">
              <div className="py-2 px-2">
                <Form>
                  <Form.Label>URL to image: </Form.Label>
                  <FormControl
                    type="url"
                    className="form-control-url-img"
                    placeholder="image url"
                    value={imageURL}
                    onChange={handleOnChange}
                  />
                </Form>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImageUpload}>
            Upload Image
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ImageUploadModal;
