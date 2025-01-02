import axios from "axios";
import * as cheerio from "cheerio";
import type { CarScrappedData } from "../types/types";

/// Scrapper for km77.com
export const km77Scrapper = async (url: string) => {
  const response = await axios.get(url);

  // Scrap the HTML
  const $ = cheerio.load(response.data);

  // Extract the car name
  const carName = $("h1")
    .contents()
    .filter(function () {
      return this.type === "text";
    })
    .text()
    .trim()
    .replace("|", "")
    .trim();

  // Extract the price text, ensuring duplicates are removed
  const rawText = $(".js-price.js-price-total")
    .contents() // Get all child nodes
    .filter(function () {
      return this.type === "text"; // Include only text nodes
    })
    .map((_, node) => $(node).text().trim()) // Trim each text node
    .toArray(); // Convert to an array

  // Remove duplicates from the array and join into a single string
  const uniqueText = [...new Set(rawText)].join(" ");

  const potenciaMaxima = $("table.js-relocation-destination")
    .find('th:contains("Potencia máxima")')
    .next("td")
    .contents()
    .map((_, node) => $(node).text().trim())
    .toArray()[0];

  const accel = $("table.js-relocation-destination")
    .find('th:contains("Aceleración 0-100 km/h")')
    .next("td")
    .contents()
    .text()
    .trim();

  const car_length = $("table.js-relocation-destination")
    .find('th:contains("Longitud")')
    .next("td")
    .contents()
    .text()
    .trim();

  const car_weight = $("table.js-relocation-destination")
    .find('th:contains("Peso")')
    .next("td")
    .contents()
    .text()
    .trim();

  // Trunk size
  const trunk_seats = $("table.js-relocation-destination")
    .find('td:contains("Volumen con una fila de asientos disponible")')
    .next("td")
    .contents()
    .text()
    .trim();

  const trunk_no_seats = $("table.js-relocation-destination")
    .find('td:contains("Volumen mínimo con dos filas de asientos disponibles")')
    .next("td")
    .contents()
    .text()
    .trim();

  const fuel_tank_scrapped = $("table.js-relocation-destination")
    .find('td:contains("Gasolina")')
    .next("td")
    .contents()
    .text()
    .trim();

  // Return the cleaned-up price text
  const result: CarScrappedData = {
    name: carName || "No encontrado",
    price: uniqueText || "No encontrado",
    hp: potenciaMaxima || "No encontrado",
    accel: accel || "No encontrado",
    length: car_length || "No encontrado",
    weight: car_weight || "No encontrado",
    trunk_space_seats: trunk_seats || "No encontrado",
    trunk_space_no_seats: trunk_no_seats || "No encontrado",
    fuel_tank: fuel_tank_scrapped || "No encontrado",
    url: (document.getElementById("url") as HTMLInputElement).value,
  };

  return result;
};
