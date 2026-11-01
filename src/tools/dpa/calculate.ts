import type { VFile } from "vfile";
import { booleanContains } from "@turf/turf";

import type { GeoJSON, Point, Position } from "geojson";

import { formatCurrency } from "../../utilities";

import programBoundsGeoJSON from "./program-bounds.geojson";

// import { downPaymentPercentUpper, downPaymentPercentLower } from "./store";
// import { coordinates } from "./store";

export type boundNames = 'Texas' | 'City of Houston' | 'Harris County unincorporated';
export type LimitName = 'AMI 80' | 'AMI 120' | 'TSAHC Limit'

export interface Limit {
  householdSize: number | null,
  upperLimit: number,
  lowerLimit: number,
  limitName: LimitName,
}

export interface ProgramBase {
  program: string,
  programLogo: string,
  isActive: boolean,
  calcAvailableAmount: Function,
  descriptionTemplate: Function,
  upperLimit: LimitName,
  geoLimits: boundNames[],
}

export interface Program extends ProgramBase {
  description: string,
}

export const stateRankings = ['inactive', 'ineligible', 'needs-information', 'eligible-partial', 'eligible-full', 'ineligible',]

export interface ProgramAvailable extends Program {
  meetsHouseholdLimits: boolean | null,
  meetsGeoLimits: boolean | null,
  limits: Limit[],
  availableDPA: number,
  state: 'eligible-full' | 'eligible-partial' | 'ineligible' | 'inactive' | 'needs-information',
  stateRank: 1 | 2 | 3 | 4 | 5 | 6,
  order: number,
}

export interface ProgramRenderable extends ProgramAvailable {
  about: VFile,
}

export const limitsList: Limit[] = [
  {
    householdSize: 1,
    upperLimit: 58250,
    lowerLimit: 0,
    limitName: 'AMI 80',
  },
  {
    householdSize: 1,
    upperLimit: 87350,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 2,
    upperLimit: 66600,
    lowerLimit: 0,
    limitName: 'AMI 80',
  },
  {
    householdSize: 2,
    upperLimit: 99850,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 3,
    upperLimit: 74900,
    lowerLimit: 0,
    limitName: 'AMI 80',
  },
  {
    householdSize: 3,
    upperLimit: 112300,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 4,
    upperLimit: 83200,
    lowerLimit: 0,
    limitName: 'AMI 80',
  },
  {
    householdSize: 4,
    upperLimit: 124800,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 5,
    upperLimit: 89900,
    lowerLimit: 0,
    limitName: 'AMI 80'
  },
  {
    householdSize: 5,
    upperLimit: 134800,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 6,
    upperLimit: 96550,
    lowerLimit: 0,
    limitName: 'AMI 80'
  },
  {
    householdSize: 6,
    upperLimit: 144750,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 7,
    upperLimit: 103200,
    lowerLimit: 0,
    limitName: 'AMI 80'
  },
  {
    householdSize: 7,
    upperLimit: 154750,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: 8,
    upperLimit: 109850,
    lowerLimit: 0,
    limitName: 'AMI 80'
  },
  {
    householdSize: 8,
    upperLimit: 164750,
    lowerLimit: 0,
    limitName: 'AMI 120',
  },
  {
    householdSize: null,
    upperLimit: 156000,
    lowerLimit: 0,
    limitName: 'TSAHC Limit',
  },
]

export const programs: ProgramBase[] = [
  {
    program: 'City of Houston Homebuyer Assistance',
    programLogo: '/images/coh-hcdd.png',
    isActive: true,
    calcAvailableAmount: (info) => (50000),
    descriptionTemplate: (info) => (`
The City of Houston offers up to <span class="border-bottom border-1 border-black fst-italic">$50,000</span> to income-qualified residents.

The City assists first-time homebuyers who buy a home within the city limits through their Homebuyer Assistance Program.

For more information, please visit: [houstontx.gov/housing/hap.html](https://houstontx.gov/housing/hap.html)

If you have questions or want to talk to someone with the City of Houston Housing and Community Development about this program, give them a call at 832-394-6200.
    `),
    upperLimit: 'AMI 80',
    geoLimits: ['City of Houston'],
  },
  {
    program: 'Houston Community Land Trust',
    programLogo: '/images/hclt.png',
    isActive: false,
    calcAvailableAmount: (info) => (150000),
    descriptionTemplate: (info) => (`
With the Houston Community Land Trust Homebuyer Choice Program, a qualified homebuyer can receive up to <span class="border-bottom border-1 border-black fst-italic">$150,000</span> or $100,000 in financial assistance grants to help lower the cost of buying a high-quality home in the City of Houston that meets the program criteria. 

The homebuyer contributes what they can afford to their home purchase, usually in the form of a standard mortgage. The financial assistance grant helps cover the rest of the home's purchase price, as well as the buyer's reasonable closing costs.

For more information, please visit:  [houstonclt.org](https://www.houstonclt.org/)

If you have questions or want to talk to someone with the Houston Community Land Trust about this program, give them a call at 713-512-5575.
    `),
    upperLimit: 'AMI 80',
    geoLimits: ['City of Houston'],
  },
  {
    program: 'Harris County Down Payment Assistance Program',
    programLogo: '/images/countycsddlogo.jpg',
    isActive: true,
    calcAvailableAmount: (info) => (40000),
    descriptionTemplate: (info) => (`
Harris County offers up to <span class="border-bottom border-1 border-black fst-italic">$40,000</span> towards the purchase of new and pre-existing homes in the unincorporated areas of Harris County.  

For more information, please visit: [csd.harriscountytx.gov/Housing-and-Community-Development/Programs-and-Services/Downpayment-Assistance-Program](https://csd.harriscountytx.gov/Housing-and-Community-Development/Programs-and-Services/Downpayment-Assistance-Program)

If you have questions or want to talk to someone with the Harris County Community Services Department about this program, give them a call at 713-578-2000.
    `),
    upperLimit: 'AMI 120',
    geoLimits: ['Harris County unincorporated'],
  },
  {
    program: 'The Texas Homebuyer Program',
    programLogo: '/images/texas-homebuyers.png',
    isActive: true,
    calcAvailableAmount: (info) => (0.05 * info.houseListingPrice),
    descriptionTemplate: (info) => (`
The State of Texas offers up to 5% of the purchase price of your home${info.houseListingPrice && ` (<span class="border-bottom border-1 border-black fst-italic">${formatCurrency(0.05 * info.houseListingPrice)}</span>)` || ''}.

For more information, please visit:  [thetexashomebuyerprogram.com](https://thetexashomebuyerprogram.com/)

If you have questions or want to talk to someone with the Texas Department of Housing and Community Affairs about this program, give them a call at 1-800-792-1119.
    `),
    upperLimit: 'AMI 120',
    geoLimits: ['Texas'],
  },
  {
    program: 'Texas State Affordable Housing Corporation',
    programLogo: '/images/tsahc.png',
    isActive: true,
    calcAvailableAmount: (info) => (0.05 * info.houseListingPrice),
    descriptionTemplate: (info) => (`
The Texas State Affordable Housing Corporation offers up to 5% of the purchase price of your home${info.houseListingPrice && ` (<span class="border-bottom border-1 border-black fst-italic">${formatCurrency(0.05 * info.houseListingPrice)}</span>)` || ''}.

For more information, please visit: [tsahc.org/home-buyer-programs](https://www.tsahc.org/home-buyer-programs)

If you have questions or want to talk to someone with the Texas State Affordable Housing Corporation about this program, give them a call at 1-877-508-4611.
    `),
    upperLimit: 'TSAHC Limit',
    geoLimits: ['Texas'],
  },
]

export interface MatchingProgramParams {
  householdSize?: number,
  annualIncome?: number,
  geoLimits?: boundNames[],
  coordinates?: Position,
  houseListingPrice?: number,
}

//   {
//   householdSize: number = 1,
//   annualIncome: number = 20000,
//   geoLimits: boundNames[] = ['City of Houston', 'Harris County unincorporated', 'Texas']
// } 


export function getMatchingPrograms({
  householdSize,
  annualIncome,
  geoLimits,
  coordinates,
  houseListingPrice,
}: MatchingProgramParams):ProgramAvailable[] {

  const matchingLimits = householdSize && annualIncome && getMatchingLimits(householdSize, annualIncome) || []
  const matchedLimits = matchingLimits.map((limit) => (limit.limitName))

  let boundNames = geoLimits

  if (coordinates && !geoLimits) {
    boundNames = getMatchingProgramsGeo(coordinates)
  }

  const matchedGeoLimitsSet = new Set(boundNames || [])

  return programs
    .map((program) => ({
      ...program,
      limits: getPossibleLimits(householdSize).filter((limit) => limit.limitName === program.upperLimit),
      meetsHouseholdLimits: householdSize && annualIncome && matchedLimits.includes(program.upperLimit) || null,
    }))
    .map((program) => ({
      ...program,
      meetsGeoLimits: (boundNames === undefined)? null : (boundNames && (Array.from(
        new Set(program.geoLimits).intersection(matchedGeoLimitsSet)
      ).length > 0) || false),
    }))
    .map((program) => ({
      ...program,
      description: program.descriptionTemplate({

        householdSize,
        annualIncome,
        geoLimits,
        coordinates,
        houseListingPrice,

        meetsHouseholdLimits: program.meetsHouseholdLimits,
        meetsGeoLimits: program.meetsGeoLimits,
      }),
      availableDPA: !(program.meetsHouseholdLimits === false || program.meetsGeoLimits === false || program.isActive === false) && program.calcAvailableAmount({
        houseListingPrice,
      }) || 0,
    }))
    .map((program) => ({
      ...program,
      state: (program.isActive === false && 'inactive') ||
        (program.meetsHouseholdLimits === true && program.meetsGeoLimits === true) && 'eligible-full' ||
        (program.meetsHouseholdLimits === null && program.meetsGeoLimits === null) && 'needs-information' ||
        (program.meetsHouseholdLimits === false || program.meetsGeoLimits === false) && 'ineligible' ||
        'eligible-partial'
    }))
    .map((program) => ({
      ...program,
      stateRank: stateRankings.findIndex((state)=> state === program.state) + 1,
    }))
    .map((program) => ({
      ...program,
      order: program.stateRank * 10000000 + program.availableDPA,
    }))
    .toSorted((a, b) => (b.order - a.order))
}

export function isAssistanceAvailable(program: ProgramAvailable) {
  return program.isActive && program.meetsHouseholdLimits && program.meetsGeoLimits
}

export function getAvailableAssistanceAmount(program: ProgramAvailable) {
  return isAssistanceAvailable(program) && program.calcAavailableAmount(program) || 0
}

export function getMatchingProgramsGeo(coordinates: Position) {

  return [
    ...programBoundsGeoJSON.features
      .filter((programBounds) => (booleanContains(programBounds, {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates,
        },
        properties: {},
      })))
      .map((programBounds) => (programBounds.properties.boundName)),
      coordinates && 'Texas' || null,
  ].filter((bound) => (bound))
}

export function getMatchingLimits(householdSize: number | undefined, annualIncome: number | undefined):Limit[] {
  const possibleLimits = getPossibleLimits(householdSize)

  return possibleLimits.filter((limit) => (annualIncome && limit.lowerLimit < annualIncome && annualIncome <= limit.upperLimit || annualIncome === undefined))
}

export function getPossibleLimits(householdSize: number | undefined):Limit[] {
  if (householdSize === undefined) {
    return limitsList
  }

  if (householdSize < 1 ) {
    return []
  }

  if (householdSize < 9) {
    return limitsList.filter((item) => (item.householdSize === householdSize || item.householdSize === null))
  }

  const BASE_LIMIT = 4
  const overBase = householdSize - BASE_LIMIT
  const baseAMI = limitsList.filter((item) => (item.householdSize === BASE_LIMIT))

  if (baseAMI.length === 0){
    return []
  }

  return [
    ...baseAMI.map((limit) => ({
      ...limit,
      householdSize,
      upperLimit: Math.round(limit.upperLimit * (1 + overBase * 0.08)) * 50,
    })),
    ...limitsList.filter((item) => (item.householdSize === null)),
  ]
}

// export function calcDownPaymentDiscount(homePrice: number):number {
//   return homePrice * downPaymentPercentUpper()
// }