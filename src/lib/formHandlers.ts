import axios from "axios";
import * as cheerio from "cheerio";
import type { CarScrappedData } from "../types/types";
import { carScrapped } from "../store";
import { km77Scrapper } from "./webpageScrapperAlgorithm";

const scrapingMap = new Map([
  ["www.km77.com", km77Scrapper],
  ["anotherSite", null],
]);

// Scrap the HTML from the given URL
export const scrapperFormHandler = async (e: SubmitEvent) => {
  e.preventDefault();
  const urlInput = document.getElementById("url") as HTMLInputElement;
  console.log("Submitted URL:", urlInput.value);
  const url = urlInput.value;
  const hostname = new URL(url).hostname;
  const scrapperFunc = scrapingMap.get(hostname);

  if (scrapperFunc) {
    const result = await scrapperFunc(url);
    // Set the scrapped data globally in the store
    carScrapped.set(result);

    (document.getElementById("car-name") as HTMLInputElement).value =
      result.name;
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
  } else {
    console.error("Scrapper not found for this site");
    return;
  }
};

// Save the scrapped data in DB form behaviour
export const saveCarScrappedData = async (e: SubmitEvent) => {
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
