"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Header, Footer } from "@/components";
import styles from "./page.module.css";
import Editor from './Editor/Editor';
import Image from 'next/image';
import { NewOrder } from "@/api/orders"; // 👈 REAL IMPORT

export interface Product {
  id: string;
  imgFront: string;
  imgBack: string;
  price: number;
  colorsAvailable: {
    color: string;
    imgFront: string;
    imgBack: string;
  }[];
}

interface ShirtDetail {
  name: string;
  size: string;
}

export default function OrderForms() {
  const params = useParams();
  const productId = Array.isArray(params.productId) ? params.productId[0] : params.productId;

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQuantity] = useState(1);
  const [shirtDetails, setShirtDetails] = useState<ShirtDetail[]>([{ name: "", size: "" }]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [supervisorName, setSupervisorName] = useState("");
  const [phone, setPhone] = useState("");
  const [equipment, setEquipment] = useState("");

  useEffect(() => {
    async function fetchProductData() {
      try {
        const res = await fetch("/apilocal/cover.json");
        const data = await res.json();
        const foundProduct = data.find((item: Product) => item.id === productId);
        setProduct(foundProduct || null);
      } catch (error) {
        console.error("Error loading product data:", error);
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

  useEffect(() => {
    if (isModalOpen) {
      const savedDesign = localStorage.getItem("savedDesign");
      if (savedDesign) {
        setCustomImage(savedDesign);
      }
    }
  }, [isModalOpen]);

  const handleDetailChange = (index: number, field: "name" | "size", value: string) => {
    const updated = [...shirtDetails];
    updated[index][field] = value;
    setShirtDetails(updated);
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
    const orderPayload = {
      name,
      supervisorName,
      phone,
      equipment,
      qty,
      productId,
      customImage,
      personsData: shirtDetails.map(detail => ({
        name: detail.name,
        size: detail.size
      })),
      status: "New"
    };
    console.log(orderPayload); 

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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <Header />
      <main className={styles.orderFormMain}>
        {product ? (
          <div className={styles.productContainer}>
            <h1 className={styles.productTitle}>T-Shirt Order Form</h1>
            <p className={styles.productPrice}>
              Base Price: <strong>${product.price}</strong>
            </p>
          </div>
        ) : (
          <p className={styles.loadingMessage}>Loading product details...</p>
        )}
      </main>

      <Editor product={product} />

      <div className={styles.detailsSection}>
        <h2>Order Details</h2>
        <label>
          Quantity:
          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className={styles.quantityInput}
          />
        </label>

        <div className={styles.buttonContainer}>
          <button className={styles.orderButton} onClick={handleOpenModal}>
            Confirm Order
          </button>
        </div>

        {qty >= 1 && (
          <table className={styles.detailsTable}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Size</th>
                <th>Action</th>
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
                      <option value="">Select</option>
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
                      Delete
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
            <h2>Confirm Order</h2>

            <div className={styles.modalBody}>
              {customImage && (
                <div className={styles.imageContainer}>
                  <Image src={customImage} alt="Custom design" width={300} height={300} />
                </div>
              )}

              <div className={styles.tableContainer}>
                <table className={styles.detailsTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Size</th>
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
              <h3>Contact Information</h3>
              <form>
                <label>
                  Name:
                  <input
                    type="text"
                    placeholder="Requestor's name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Supervisor:
                  <input
                    type="text"
                    placeholder="Supervisor's name"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
                <label>
                  Equipment:
                  <input
                    type="text"
                    placeholder="Equipment or area"
                    value={equipment}
                    onChange={(e) => setEquipment(e.target.value)}
                    className={styles.inputField}
                  />
                </label>
              </form>
            </div>

            <div className={styles.modalButtons}>
              <button onClick={handleCloseModal} className={styles.cancelBtn}>
                Cancel
              </button>
              <button onClick={handleSubmit} className={styles.confirmBtn}>
                Submit Order
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
