import {v4 as uuidv4} from "uuid"


export default function generateRandomNumber(): number {
    const randomUUID = uuidv4();
    const hash = parseInt(randomUUID.replace(/-/g, ""), 16);
    const randomFloat = hash / 2 ** 128;
    return randomFloat;
  }