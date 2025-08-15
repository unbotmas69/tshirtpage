"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header, Footer } from "@/components";
import styles from "./page.module.css";
import Editor from './Editor/Editor';
import Image from 'next/image';
import ProductsService from "../../../api/products";
import { NewOrder } from "@/api/orders";

export interface Product {
  id: string;
  title: string;
  previewImage: string;
  price: number;
  colors: {
    color: string;
    imgF: string;
    imgB: string;
  }[];
}

interface ShirtDetail {
  name: string;
  size: string;
}

interface CustomItem {
  type: "image" | "text";
  price: number;
}

export default function OrderForms() {
  const params = useParams();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const [customItems, setCustomItems] = useState<CustomItem[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQuantity] = useState(1);
  const [shirtDetails, setShirtDetails] = useState<ShirtDetail[]>([{ name: "", size: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customImageF, setCustomImageF] = useState<string | null>(null);
  const [customImageB, setCustomImageB] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [phone, setPhone] = useState("");
  const [equipment, setEquipment] = useState("");

  useEffect(() => {
    async function fetchProductData() {
      try {
        const res = await ProductsService.ProductsById(productId);
        console.log("Producto cargado:", res);
        setProduct(res);
      } catch (error) {
        console.error("Error loading product data:", error);
        setProduct(null);
      }
    }

    if (productId) {
      fetchProductData();
    }
  }, [productId]);

  useEffect(() => {
    setShirtDetails((prevDetails) => {
      const updated = [...prevDetails];
      while (updated.length < qty) updated.push({ name: "", size: "" });
      return updated.slice(0, qty);
    });
  }, [qty]);


  const handleDetailChange = (index: number, field: "name" | "size", value: string) => {
    const updated = [...shirtDetails];
    updated[index][field] = value;
    setShirtDetails(updated);
  };

  const handleDesignConfirm = (images: { front: string; back: string }) => {
   console.log("Imágenes recibidas del editor:", images);
    setCustomImageF(images.front);
    setCustomImageB(images.back);
};

  const handleDelete = (index: number) => {
    setShirtDetails((prevDetails) => {
      const updatedDetails = [...prevDetails];
      updatedDetails.splice(index, 1);
      setQuantity(updatedDetails.length);
      return updatedDetails;
    });
  };

  const handleSubmit = async () => {
    if (!customImageF || !customImageB) {
  alert("Debe confirmar el diseño de la playera antes de enviar la orden.");
  return;
}

    const totalPrice = ((product?.price ?? 0) + customItemsTotal) * qty;

    const orderPayload = {
      name,
      supervisorName,
      phone,
      equipment,
      qty,
      productId,
      customImageF,
      customImageB,
      total: totalPrice,
      personsData: shirtDetails.map(detail => ({
        name: detail.name,
        size: detail.size
      })),
      status: "New"
    };

    try {
      const response = await NewOrder(orderPayload);
      if (response && response.status === 201) {
        alert("Order successfully submitted!");
        setIsModalOpen(false);
        setSupervisorName("");
        setPhone("");
        setEquipment("");
        setQuantity(1);
        setShirtDetails([{ name: "", size: "" }]);
      } else {
        alert("There was an error submitting the order.");
      }
    } catch (error) {
      console.error("Error submitting the order:", error);
      alert("Could not submit the order. Check your connection or try again later.");
    }
  };

  const addCustomItem = (item: CustomItem) => {
    setCustomItems((prev) => [...prev, item]);
  };

  const customItemsTotal = customItems.reduce((sum, item) => sum + item.price, 0);
  const totalPrice = ((product?.price ?? 0) + customItemsTotal) * qty;

  const handleOpenModal = () => {
  if (!customImageF || !customImageB) {
    alert("Debe confirmar el diseño de la playera antes de enviar la orden.");
    return;
  }
  setIsModalOpen(true);
};

  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Header />

      <Editor
        product={product}
        addCustomItem={addCustomItem}
        onConfirmDesign={handleDesignConfirm}
      />

      <div className={styles.detailsSection}>
        <h2>Detalles de la orden</h2>
        <label>
          Cantidad de playeras:
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantityInput}
          />
        </label>
        <p>Precio Total: <strong>${totalPrice.toFixed(2)}</strong></p>
        <div className={styles.buttonContainer}>
          <button
            className={styles.orderButton}
            onClick={() => {
              if (!customImageF || !customImageB) {
                alert("Debe confirmar el diseño de la playera antes de enviar la orden.");
                return;
              }
              handleOpenModal();
            }}
          >
            Confirmar su orden
          </button>
        </div>
        {qty >= 1 && (
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre a mostrar</th>
                <th>Talla</th>
                <th>Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {shirtDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      className={styles.detailsTableInput}
                      type="text"
                      value={detail.name}
                      onChange={(e) => handleDetailChange(index, "name", e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      value={detail.size}
                      onChange={(e) => handleDetailChange(index, "size", e.target.value)}
                    >
                      <option value=""></option>
                      <option value="XS">XS</option>
                      <option value="S">S</option>
                      <option value="M">M</option>
                      <option value="L">L</option>
                      <option value="XL">XL</option>
                      <option value="XXL">XXL</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2>Confirmar Orden</h2>

            <p>Total a pagar: <strong>${totalPrice.toFixed(2)}</strong></p>
            <div className={styles.modalBody}>
              <div className={styles.tableContainer}>
                <table className={styles.detailsTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Talla</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shirtDetails.map((detail, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{detail.name}</td>
                        <td>{detail.size}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.formSection}>
              <h3>Informacion de contacto</h3>
              <form>
                <label>
                  Nombre:
                  <input
                    type="text"
                    placeholder="Nombre del requisitor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Supervisor:
                  <input
                    type="text"
                    placeholder="Nombre del supervisor"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Telefono:
                  <input
                    type="tel"
                    placeholder="Numero"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Equipo:
                  <input
                    type="text"
                    placeholder="Equipo"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
              </form>
            </div>

            <div className={styles.modalButtons}>
              <button onClick={handleCloseModal} className={styles.cancelBtn}>
                Cancelar
              </button>
              <button onClick={handleSubmit} className={styles.confirmBtn}>
                Enviar Orden
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
