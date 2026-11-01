import { booleanContains } from "@turf/turf";

 import cohLogoDataURL from '../../images/coh-hcdd.png?base64';
 import hcltLogoDataURL from '../../images/hclt.png?base64';
 import harrisCountyLogoDataURL from '../../images/countycsddlogo.jpg?base64';
 import texasHomebuyersLogoDataURL from '../../images/texas-homebuyers.png?base64';
 import tsahcLogoDataURL from '../../images/tsahc.png?base64';

import type { Position } from "geojson";

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
    programLogo: cohLogoDataURL,
    isActive: true,
    calcAvailableAmount: (info) => (50000),
    upperLimit: 'AMI 80',
    geoLimits: ['City of Houston'],
  },
  {
    program: 'Houston Community Land Trust',
    programLogo: hcltLogoDataURL,
    isActive: false,
    calcAvailableAmount: (info) => (150000),
    upperLimit: 'AMI 80',
    geoLimits: ['City of Houston'],
  },
  {
    program: 'Harris County Down Payment Assistance Program',
    programLogo: harrisCountyLogoDataURL,
    isActive: true,
    calcAvailableAmount: (info) => (40000),
    upperLimit: 'AMI 120',
    geoLimits: ['Harris County unincorporated'],
  },
  {
    program: 'The Texas Homebuyer Program',
    programLogo: texasHomebuyersLogoDataURL,
    isActive: true,
    calcAvailableAmount: (info) => (0.05 * info.houseListingPrice),
    upperLimit: 'AMI 120',
    geoLimits: ['Texas'],
  },
  {
    program: 'Texas State Affordable Housing Corporation',
    programLogo: tsahcLogoDataURL,
    isActive: true,
    calcAvailableAmount: (info) => (0.05 * info.houseListingPrice),
    upperLimit: 'TSAHC Limit',
    geoLimits: ['Texas'],
  },
]

export interface MatchingProgramParams {
  householdSize?: number,
  annualIncome?: number,
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
  coordinates,
  houseListingPrice,
}: MatchingProgramParams):ProgramAvailable[] {

  const matchingLimits = householdSize && annualIncome && getMatchingLimits(householdSize, annualIncome) || []
  const matchedLimits = matchingLimits.map((limit) => (limit.limitName))

  let boundNames = undefined

  if (coordinates) {
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