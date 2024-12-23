import axios from "axios";
import * as cheerio from "cheerio";
import type { CarScrappedData } from "../types/types";
import { carScrapped } from "../store";

// Scrap the HTML from the given URL
export const scrapperFormHandler = async (e: SubmitEvent) => {
  e.preventDefault();
  const urlInput = document.getElementById("url") as HTMLInputElement;
  console.log("Submitted URL:", urlInput.value);
  const url = urlInput.value;

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

  // Set the scrapped data globally in the store
  carScrapped.set(result);

  (document.getElementById("car-name") as HTMLInputElement).value = result.name;
  (document.getElementById("car-price") as HTMLInputElement).value =
    result.price;
  (document.getElementById("car-hp") as HTMLInputElement).value = result.hp;
  (document.getElementById("car-accel") as HTMLInputElement).value =
    result.accel;
  (document.getElementById("car-length") as HTMLInputElement).value =
    result.length;
  (document.getElementById("car-weight") as HTMLInputElement).value =
    result.weight;
  (document.getElementById("car-trunk-seat") as HTMLInputElement).value =
    result.trunk_space_seats;
  (document.getElementById("car-trunk-no-seat") as HTMLInputElement).value =
    result.trunk_space_no_seats;
  (document.getElementById("fuel_tank") as HTMLInputElement).value =
    result.fuel_tank;

  console.log("Result:", result);
};

// Save the scrapped data in DB form behaviour
export const saveCarScrappedData = async (
  e: SubmitEvent
) => {
  e.preventDefault();
  const saveButton = document.getElementById(
    "car-scrapper-save-button"
  ) as HTMLButtonElement;
  const loader = document.getElementById("loader") as HTMLElement;
  try {
    // Setting HTML elements
    saveButton.disabled = true;
    loader.classList.remove("hidden");

    // Sending the data to the server
    const response = await fetch("/api/car", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(carScrapped.value),
    });

    const result = await response.json();

    if (result.success) {
      console.log("Data saved successfully!");
    } else {
      console.error("Failed to save data:", result.error);
    }
  } catch (error) {
    console.error("Error sending data to server:", error);
  } finally {
    saveButton.disabled = false;
    loader.classList.add("hidden");
  }
};
