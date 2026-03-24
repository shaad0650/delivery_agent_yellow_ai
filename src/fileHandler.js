import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ORDERS_PATH = path.join(__dirname, "../data/orders.json");

export async function readOrders(){
    try {
        const data=await fs.readFile(ORDERS_PATH,'utf-8')
        if(!data){
            throw new Error("Orders file is empty")
        }
        const parsed=JSON.parse(data);
        if(!Array.isArray(parsed)){
            throw new Error("Invalid JSON Structure: Expected an array");
        }
        return parsed;
    } catch (error) {
        throw new Error(`FILE READ ERROR:${error.message}`);
    }
}

export async function writeOrders(orders) {
  try {
    if (!Array.isArray(orders)) {
      throw new Error("Invalid data: orders must be an array");
    }

    const jsonData = JSON.stringify(orders, null, 2);

    await fs.writeFile(ORDERS_PATH, jsonData, "utf-8");

  } catch (error) {
    throw new Error(`FILE_WRITE_ERROR: ${error.message}`);
  }
}