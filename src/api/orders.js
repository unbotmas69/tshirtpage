import request from "../services/HTTPClient";
import { requestMethods, API } from "./constants";

export const NewOrder = async (data) => {
  return request({
    url: API.ORDER.NEW,
    method: requestMethods.POST,
    data,
  })
    .then(response => {
      return response;
    })
    .catch(error => {
      console.error(`Error:`, error);
      throw error;
    });
};
