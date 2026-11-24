import type { Component } from "solid-js";
import { createMemo, For, onSettled, createSignal, createEffect, Show } from "solid-js";

import { getMatchingPrograms, } from "./calculate";
import { formatCurrency } from "../../utilities/";

import type { MatchingProgramParams } from "./calculate";

import { Program, ProgramBadge, ProgramSummary } from "./program";

export interface DPAProgramListProps {

  initialTargetHomePrice: number | null,
  initialHouseholdSize: number | null,
  initialHouseholdIncome: number | null,

  initialCoordinates: number[] | null,
}

export interface DPAToolProps extends DPAProgramListProps {
  allowInputTargetDownPaymentPercent: boolean,

  allowInputTargetHomePrice: boolean,
  allowInputHouseholdSize: boolean,
  allowInputHouseholdIncome: boolean,

  allowInputCoordinates: boolean,
}

export const DPAProgramsList: Component<DPAProgramListProps> = ({

  initialTargetHomePrice,
  initialHouseholdSize,
  initialHouseholdIncome,
  initialCoordinates,

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

  const programs = () => getMatchingPrograms({
    householdSize: householdSize(),
    annualIncome: householdIncome(),
    coordinates: coordinates(), // [-95.374543, 29.850715],
    // coordinates: [-95.484657, 29.930173],
    houseListingPrice: houseListingPrice(),
  });
  
  return (<>
    <For each={programs()}>{ (program) => (
      <ProgramBadge
        program={program}
      />
    )}</For>
  </>)
}

export const DPAProgramsListSummary: Component<DPAProgramListProps> = ({

  initialTargetHomePrice,
  initialHouseholdSize,
  initialHouseholdIncome,
  initialCoordinates,

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

  const programs = () => getMatchingPrograms({
    householdSize: householdSize(),
    annualIncome: householdIncome(),
    coordinates: coordinates(), // [-95.374543, 29.850715],
    // coordinates: [-95.484657, 29.930173],
    houseListingPrice: houseListingPrice(),
  });
  
  return (<div class="accordion accordion-sm theme-primary">
    <For each={programs()}>{ (program) => (
      <ProgramSummary
        program={program}
        houseListingPrice={houseListingPrice}
        downPaymentPercentUpper={downPaymentPercentUpper}
        downPaymentPercentLower={downPaymentPercentLower}
      />
    )}</For>
  </div>)
}

export const MoneyInput: Component = (props) => {
  const [value, setValue] = createSignal(props.defaultValue)
  const maskedValue = () => value() && formatCurrency(value()) || null
  const unmaskValue = (val) => (val.replaceAll(/(^\$|,)/g, '') * 1)

  const handleInput = (e: InputEvent & { currentTarget: HTMLInputElement }) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.setCustomValidity('')
    e.currentTarget.reportValidity()

    const numericValue = unmaskValue(e.currentTarget.value)
    setValue(numericValue)

    if (Number.isNaN(numericValue)) {
      e.currentTarget.setCustomValidity('Please type in only numbers.')
      e.currentTarget.reportValidity()
    } else {
      props.onChange(e)
    }
  }

  return (
    <input
      type="text"
      inputmode="numeric"
      {...props}
      onInput={handleInput}
      defaultValue={maskedValue()}
      value={maskedValue()}
      data-value={value()}
    />
  )
}

export const DPATool: Component<DPAToolProps> = ({

  initialTargetHomePrice,
  initialHouseholdSize,
  initialHouseholdIncome,
  initialCoordinates,

  allowInputTargetDownPaymentPercent = false,

  allowInputTargetHomePrice = true,
  allowInputHouseholdSize = true,
  allowInputHouseholdIncome = true,

  allowInputCoordinates = false,
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

  const [showOptions, setShowOptions] = createSignal(false);

  const [downPaymentPercentUpper, setDownPaymentPercentUpper] = createSignal(0.05);
  const [downPaymentPercentLower, setDownPaymentPercentLower] = createSignal(0.035);

  const [householdSize, setHouseholdSize] = createSignal(initialHouseholdSize);
  const [householdIncome, setHouseholdIncome] = createSignal(initialHouseholdIncome);
  const [houseListingPrice, setHouseListingPrice] = createSignal(initialTargetHomePrice);

  const [longitude, setLongitude] = createSignal(initialCoordinates && initialCoordinates.length && initialCoordinates[0] || undefined);
  const [latitude, setLatitude] = createSignal(initialCoordinates && initialCoordinates.length && initialCoordinates[1] || undefined);

  const coordinates = () => (longitude() && latitude() && [longitude(), latitude()] || null);

  const isValid = () => !(Number.isNaN(householdIncome() * 1) || Number.isNaN(householdSize() * 1) || Number.isNaN(houseListingPrice() * 1))

  const programs = () => (getMatchingPrograms({
    householdSize: householdSize(),
    annualIncome: householdIncome(),
    coordinates: coordinates(),
    houseListingPrice: houseListingPrice(),
  }).filter((program) => (!['ineligible','inactive'].includes(program.state))));

  return (<>
    <p>
      <strong>
        Down payment assistance programs in Texas help first time homebuyers with the initial home buying expenses.  Use this screener below to see if you qualify for one or more of these financial assistance programs.
      </strong>
    </p>
    <p>This is not an application for assistance and only asks for basic information.  Each down payment assistance program will have more detailed applications.</p>
    {(allowInputCoordinates || allowInputHouseholdIncome || allowInputHouseholdSize || allowInputTargetHomePrice) && <form
      onSubmit={(submitEvent) => {
        submitEvent.preventDefault()
        if (!submitEvent.currentTarget.checkValidity()) {
          submitEvent.currentTarget.reportValidity()
          return
        }

        setShowOptions(true)
      }}
      onChange={() => {
        if (!isValid()) {
          setShowOptions(false)
        }
      }}
    >
      {allowInputTargetDownPaymentPercent && <div class="mb-3">
        <label for="down-payment-percentage-target" class="form-label">Target Down Payment Percent</label>
        <input type="range" class="form-range" min="3.5" max="20" step="0.5"
          name="down-payment-percentage-target"
          id="down-payment-percentage-target"
          title="Down Payment Percentage Target"
          onChange={(changeEvent) => {setDownPaymentPercentUpper(changeEvent.target.value * .01)}}
          defaultValue={downPaymentPercentUpper() * 100}
          required
        />
      </div>}
      <div class="row mb-3">
        {allowInputHouseholdSize && <div class="xs:col xl:col-6 2xl:col-4">
          <label for="household-size" class="form-label">How many people are part of your household?</label>
          <input
            type="number" class="form-control" step="1"
            min="1" max="15"
            name="household-size"
            id="household-size"
            title="Household Size"
            // aria-describedby="householdSizeHelp"
            onChange={(changeEvent) => {setHouseholdSize(changeEvent.target.value * 1)}}
            defaultValue={householdSize()}
            required
          />
          {/* <div id="householdSizeHelp" class="form-text"></div> */}
        </div>}
        {allowInputHouseholdIncome && <div class="xs:col xl:col-6 2xl:col-4">
          <label for="annual-income" class="form-label">What is your approximate annual household income?</label>
          <MoneyInput
            class="form-control"
            name="annual-income"
            id="annual-income"
            aria-describedby="annual-income-help"
            step="10000" min="10000"
            onChange={(changeEvent) => {
              setHouseholdIncome(changeEvent.target.dataset.value * 1)
            }}
            defaultValue={householdIncome()}
            required
          />
          <div class="form-text" id="annual-income-help">
            Household annual income is the total income of all of the people who live together (and are older than 15), even if they are not related to each other.
          </div>
        </div>}
        {allowInputTargetHomePrice && <div class="xs:col xl:col-6 2xl:col-4 mb-3">
          <label for="house-listing-price" class="form-label">About how much do you expect to spend on your new home?</label>
          <MoneyInput
            class="form-control"
            id="house-listing-price"
            name="house-listing-price"
            step="10000" min="50000"
            onChange={(changeEvent) => {setHouseListingPrice(changeEvent.target.dataset.value * 1)}}
            defaultValue={houseListingPrice()}
            required
          />
        </div>}
      </div>
      {allowInputCoordinates && (<div class="row mb-3"><div class="xs:col xl:col-6 2xl:col-4">
        <label for="longitude" class="form-label">Longitude</label>
        <input
          type="number" class="form-control"
          step="0.001"
          name="longitude"
          id="longitude"
          onChange={(changeEvent) => {setLongitude(changeEvent.target.value * 1)}}
          defaultValue={longitude()}
        />
      </div>
      <div class="xs:col xl:col-6 2xl:col-4">
        <label for="latitude" class="form-label">Latitude</label>
        <input
          type="number" class="form-control"
          step="0.001"
          name="latitude"
          id="latitude"
          onChange={(changeEvent) => {setLatitude(changeEvent.target.value * 1)}}
          defaultValue={latitude()}
        />
      </div>
    </div>)}
    <input type="submit" value={`${(showOptions() && isValid()) && 'Your options are below' || 'See my options'}`} class={`btn ${(showOptions() && isValid()) && 'btn-outline' || 'btn-solid'} theme-primary`} role="button"
      disabled={showOptions() || !isValid()}
    />
  </form>}
  <Show when={showOptions() && isValid()}>
    <div class="mt-8">
      <Show when={programs().length === 0}>
        <p>Sorry, no programs match your conditions.</p>
      </Show>
      <Show when={programs().length > 0}>
        <p>You may be eligible for the following programs!</p>
        <For each={programs()}>{ (program) => (
          <Program
          program={program}
          houseListingPrice={houseListingPrice}
          downPaymentPercentUpper={downPaymentPercentUpper}
          downPaymentPercentLower={downPaymentPercentLower}
          />
        )}</For>
      </Show>

    </div>
  </Show>
  </>)
}