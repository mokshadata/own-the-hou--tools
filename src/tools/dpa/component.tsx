import type { Component } from "solid-js";
import { createMemo, For, onSettled, createSignal } from "solid-js";

import { getMatchingPrograms, getMatchingProgramsGeo } from "./calculate";
import { getHTMLFromMarkdown } from "../../utilities/";

import type { boundNames, ProgramRenderable, MatchingProgramParams } from "./calculate";

import { Program } from "./program";

export interface DPAToolProps {

  initialTargetHomePrice: number | null,
  initialHouseholdSize: number | null,
  initialHouseholdIncome: number | null,

  initialAddress: string | null,
  initialCoordinates: number[] | null,
  initialBounds: string[] | null,

  allowInputTargetDownPaymentPercent: boolean,

  allowInputTargetHomePrice: boolean,
  allowInputHouseholdSize: boolean,
  allowInputHouseholdIncome: boolean,

  allowInputAddress: boolean,
  allowInputCoordinates: boolean,
  allowInputBounds: boolean,
}

async function fetchPrograms({
  householdSize,
  annualIncome,
  geoLimits,
  coordinates,
  houseListingPrice,
  downPaymentPercentLower,
  downPaymentPercentUpper,
}: MatchingProgramParams): Promise<ProgramRenderable[]> {

  const response = await (Promise.all(getMatchingPrograms({
    householdSize,
    annualIncome,
    geoLimits,
    coordinates,
    houseListingPrice,
    downPaymentPercentLower,
    downPaymentPercentUpper,
  }).map(async (program) => ({
    ...program,
    about: await getHTMLFromMarkdown(program.description),
  }))))

  return response
}

export const DPATool: Component<DPAToolProps> = ({

  initialTargetHomePrice,
  initialHouseholdSize,
  initialHouseholdIncome,
  initialAddress,
  initialCoordinates,

  initialBounds = ['Texas', 'City of Houston', 'Harris County unincorporated'],

  allowInputTargetDownPaymentPercent = true,

  allowInputTargetHomePrice = true,
  allowInputHouseholdSize = true,
  allowInputHouseholdIncome = true,

  allowInputAddress = false,
  allowInputCoordinates = true,
  allowInputBounds = false,
}, node) => {
  
  onSettled(() => {

    if (!node) { return }
    const shadowRoot = node.element.shadowRoot;
    let parentStyles = new CSSStyleSheet();
    parentStyles.replaceSync(`
      ${
        [...shadowRoot.ownerDocument.styleSheets]
          .reduce((result, sheet) => (
            [...result, ...[...sheet.cssRules].map((rule) => (rule.cssText))]
          ), [])
          .join('')
      }
    `)

    if (shadowRoot && parentStyles) {
      shadowRoot.adoptedStyleSheets = [
        ...shadowRoot.adoptedStyleSheets,
        parentStyles,
      ]
    }
  })

  const [downPaymentPercentUpper, setDownPaymentPercentUpper] = createSignal(0.05);
  const [downPaymentPercentLower, setDownPaymentPercentLower] = createSignal(0.035);

  const [householdSize, setHouseholdSize] = createSignal(initialHouseholdSize);
  const [householdIncome, setHouseholdIncome] = createSignal(initialHouseholdIncome);
  const [houseListingPrice, setHouseListingPrice] = createSignal(initialTargetHomePrice);

  const [longitude, setLongitude] = createSignal(initialCoordinates && initialCoordinates.length && initialCoordinates[0] || undefined);
  const [latitude, setLatitude] = createSignal(initialCoordinates && initialCoordinates.length && initialCoordinates[1] || undefined);

  const coordinates = () => (longitude() && latitude() && [longitude(), latitude()] || null);

  const geoLimits = () => (coordinates() && getMatchingProgramsGeo(coordinates()) || [])

  const downPaymentUpper = () => (houseListingPrice() && houseListingPrice() * downPaymentPercentUpper())
  const downPaymentLower = () => (houseListingPrice() && houseListingPrice() * downPaymentPercentLower())

  const programs = createMemo(() => fetchPrograms(
    // {}
    {
      householdSize: householdSize(),
      annualIncome: householdIncome(),
      coordinates: coordinates(), // [-95.374543, 29.850715],
      // coordinates: [-95.484657, 29.930173],
      // geoLimits: ['Texas', 'Harris County unincorporated'],
      houseListingPrice: houseListingPrice(),
      downPaymentPercentLower: downPaymentPercentLower(),
      downPaymentPercentUpper: downPaymentPercentUpper(),
    }
  ));
  
  return (<div>
    {(allowInputCoordinates || allowInputHouseholdIncome || allowInputHouseholdSize || allowInputTargetHomePrice) && <form>
      {allowInputTargetDownPaymentPercent && <div class="mb-3">
        <label for="down-payment-percentage-target" class="form-label">Target Down Payment Percent</label>
        <input type="range" class="form-range" min="3.5" max="20" step="0.5" id="down-payment-percentage-target"
          onChange={(changeEvent) => {setDownPaymentPercentUpper(changeEvent.target.value * .01)}}
          defaultValue={downPaymentPercentUpper() * 100}
        />
      </div>}
      <div class="row mb-3">
        {allowInputHouseholdSize && <div class="col">
          <label for="householdSize" class="form-label">How many people are part of your household?</label>
          <input
            type="number" class="form-control" id="householdSize" step="1"
            // aria-describedby="householdSizeHelp"
            onChange={(changeEvent) => {setHouseholdSize(changeEvent.target.value * 1)}}
            defaultValue={householdSize()}
          />
          {/* <div id="householdSizeHelp" class="form-text"></div> */}
        </div>}
        {allowInputHouseholdIncome && <div class="col">
          <label for="annualIncome" class="form-label">Household annual income is the total income of all of the people who live together (and are older than 15), even if they are not related to each other.</label>
          <input
            type="number" class="form-control" id="annualIncome" step="10000"
            onChange={(changeEvent) => {setHouseholdIncome(changeEvent.target.value * 1)}}
            defaultValue={householdIncome()}
          />
        </div>}
      </div>
      {allowInputTargetHomePrice && <div class="mb-3">
        <label for="houseListingPrice" class="form-label">House listing price</label>
        <input
          type="number" class="form-control" id="houseListingPrice" step="10000"
          onChange={(changeEvent) => {setHouseListingPrice(changeEvent.target.value * 1)}}
          defaultValue={houseListingPrice()}
        />
      </div>}
      {allowInputCoordinates && (<div class="row mb-3"><div class="col">
        <label for="longitude" class="form-label">Longitude</label>
        <input
          type="number" class="form-control" id="longitude" step="0.001"
          onChange={(changeEvent) => {setLongitude(changeEvent.target.value * 1)}}
          defaultValue={longitude()}
        />
      </div>
      <div class="col">
        <label for="latitude" class="form-label">Latitude</label>
        <input
          type="number" class="form-control" id="latitude" step="0.001"
          onChange={(changeEvent) => {setLatitude(changeEvent.target.value * 1)}}
          defaultValue={latitude()}
        />
      </div>
      {geoLimits().length && <p>Your target home is in the following geographic limits: {geoLimits().join(', ')}</p> || null}
      </div>)}
    </form>}

    <For each={programs()}>{ (program) => (
      <Program
        program={program}
        houseListingPrice={houseListingPrice}
        downPaymentPercentUpper={downPaymentPercentUpper}
        downPaymentPercentLower={downPaymentPercentLower}
      />
    )}</For>
  </div>)
}