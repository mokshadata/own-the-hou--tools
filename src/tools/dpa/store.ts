import { createSignal } from "solid-js";
import { getMatchingProgramsGeo } from "./calculate";

export const [downPaymentPercentUpper, setDownPaymentPercentUpper] = createSignal(0.05);
export const [downPaymentPercentLower, setDownPaymentPercentLower] = createSignal(0.035);

export const [householdSize, setHouseholdSize] = createSignal();
export const [householdIncome, setHouseholdIncome] = createSignal();
export const [houseListingPrice, setHouseListingPrice] = createSignal();

export const [latitude, setLatitude] = createSignal();
export const [longitude, setLongitude] = createSignal();

export const coordinates = () => (longitude() && latitude() && [longitude(), latitude()] || null);

export const geoLimits = () => (coordinates() && getMatchingProgramsGeo(coordinates()) || [])

export const downPaymentUpper = () => (houseListingPrice() && houseListingPrice() * downPaymentPercentUpper())
export const downPaymentLower = () => (houseListingPrice() && houseListingPrice() * downPaymentPercentLower())

// export const 