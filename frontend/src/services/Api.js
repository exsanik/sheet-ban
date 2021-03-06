import axios from "axios";
import { createToast } from "mosha-vue-toastify";

import { LOCAL_STORAGE } from "@/constants";

class Api {
  constructor() {
    this.instance = axios.create({
      baseURL: process.env.VUE_APP_BACKEND_URL,
    });

    this.instance.interceptors.response.use(
      (config) => config,
      (err) => {
        if (err?.response?.data?.message) {
          createToast(err?.response?.data?.message, {
            type: "danger",
            toastBackgroundColor: "#F87171",
          });
        } else {
          createToast("Oops something went wrong", {
            type: "danger",
            toastBackgroundColor: "#F87171",
          });
        }

        return Promise.reject(err);
      }
    );
  }

  setAuthToken(token, jwtToken) {
    this.accessToken = token;
    this.jwtToken = jwtToken;
    this.instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    this.instance.defaults.headers.common[
      "X-Auth-Token"
    ] = `Bearer ${jwtToken}`;

    localStorage.setItem(LOCAL_STORAGE.token, token);
    localStorage.setItem(LOCAL_STORAGE.jwtToken, jwtToken);
  }

  getAuthToken() {
    const token = localStorage.getItem(LOCAL_STORAGE.token);
    const jwtToken = localStorage.getItem(LOCAL_STORAGE.jwtToken);
    this.setAuthToken(token, jwtToken);

    return { token, jwtToken };
  }

  async getGoogleAuthLink() {
    const resp = await this.instance.get("/api/google/link");
    return resp.data;
  }

  async sendGoogleAuth(payload) {
    const resp = await this.instance.post("/api/google/auth", payload);
    return resp.data;
  }

  async createComparePair(payload) {
    const resp = await this.instance.post("/api/compare", payload);
    return resp.data;
  }

  async getAllPairs() {
    const resp = await this.instance.get("/api/compare");
    return resp.data;
  }

  async deletePair(id) {
    const resp = await this.instance.delete(`/api/compare/${id}`);
    return resp.data;
  }
}

export default new Api();
