import { CONFIG } from "./config";

const API = CONFIG.API_BASE_URL;

export async function fetchAiMove(
  fen: string,
  maxDepth: number
): Promise<string> {
  try {
    const encodedFEN = encodeURIComponent(fen);
    const url = `${API}/ai_interface/get_move/${encodedFEN}/${maxDepth}/`;
    const response = await fetch(url);

    const data = await response.json();
    return data.ai_move;
  } catch (error) {
    console.error("Error fetching AI move:", error);
    return "";
  }
}
