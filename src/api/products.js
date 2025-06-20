import request from "../services/HTTPClient";
import { requestMethods, API } from "./constants";

function Products() {
    return request({
        url: API.PRODUCTS.ALL,
        method: requestMethods.GET,
    })
    .then(res => {
        return res;
    })
    .catch(err => {
        console.error("Error en ProductsService.Products:", err);
        return [];
    });
}

function ProductsById(productId) {
    return request({
        url: API.PRODUCTS.ID.replace(":productId", productId),
        method: requestMethods.GET
    });
}

const ProductsService = {
    Products,
    ProductsById
};

export default ProductsService;
