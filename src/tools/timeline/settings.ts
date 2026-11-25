export const STEP_01_FINANCE_REVIEW = {
  name: 'Determine Your Budget',
  description: '',
  toolkitChapter: '',
  order: 1,
  substeps: [
    'Gather financial information',
    'Determine your DTI',
    'Secure Down Payment Assistance',
    '',
  ]
}

export const STEP_00_HOUSING_COUNSELOR = {
  name: 'Team up with a housing counselor',
  description: '',
  toolkitChapter: '',
  order: 0,
}

export const STEP_02_PREAPPROVAL =   {
  name: 'Finding a Lender and Getting Pre-Approved',
  description: '',
  toolkitChapter: '',
  order: 2,
}

export const STEP_03_REAL_ESTATE_AGENT = {
  name: 'Finding a Real Estate Agent',
  order: 3,
}

export const STEP_04_SEARCHING_FOR_A_HOME = {
  name: 'Searching for a Home',
  order: 4,
}

export const STEP_05_MAKE_AN_OFFER = {
  name: 'Make an Offer',
  order: 5,
}

export const STEP_06_ENTER_CONTRACT = {
  name: 'Enter Contract Phase',
  order: 6,
}

export const STEP_07_HOME_INSPECTION = {
  name: 'Home Inspection',
  order: 7,
}
// listing status change, payment, paper work

export const STEP_08_NEGOTIATIONS = {
  name: 'Negotations',
  order: 8,
}

export const STEP_09_FINALIZE_MORTGAGE = {
  name: 'Finalize Mortgage',
}

export const STEP_10_CLOSING = {
  name: 'Close on your home',
}

export const STEP_09_PLAN_YOUR_MOVE = {
  name: 'Plan your move',
}

export const DEFAULT_TIMELINE = [
  {
    step: STEP_00_HOUSING_COUNSELOR,
    timerange: [1, 5],
    relativeStart: 0,
  },
  {
    step: STEP_01_FINANCE_REVIEW,
    timerange: [14, 60],
    relativeStart: 0,
  },
  {
    step: STEP_02_PREAPPROVAL,
    timerange: [2, 21],
    dependsOn: STEP_01_FINANCE_REVIEW,
  },
  {
    step: STEP_03_REAL_ESTATE_AGENT,
    timerange: [7, 14],
    dependsOn: STEP_02_PREAPPROVAL,
  },
  {
    step: STEP_04_SEARCHING_FOR_A_HOME,
    timerange: [14, 12 * 7],
    dependsOn: STEP_03_REAL_ESTATE_AGENT,
  },
  {
    step: STEP_05_MAKE_AN_OFFER,
    timerange: [3, 7],
    dependsOn: STEP_04_SEARCHING_FOR_A_HOME,
  },
  {
    step: STEP_06_ENTER_CONTRACT,
    timerange: [1, 3],
    dependsOn: STEP_05_MAKE_AN_OFFER,
  },
  {
    step: STEP_07_HOME_INSPECTION,
    timerange: [1, 10],
    dependsOn: STEP_06_ENTER_CONTRACT,
  },
  {
    step: STEP_08_NEGOTIATIONS,
    timerange: [5, 14],
    dependsOn: STEP_07_HOME_INSPECTION,
  },
  {
    step: STEP_09_FINALIZE_MORTGAGE,
    timerange: [30, 45],
    dependsOn: STEP_06_ENTER_CONTRACT,
  },
  {
    step: STEP_10_CLOSING,
    timerange: [2, 7],
    dependsOn: STEP_09_FINALIZE_MORTGAGE,
  },
  {
    step: STEP_09_PLAN_YOUR_MOVE,
    timerange: [14, 30],
    dependsOn: STEP_07_HOME_INSPECTION,
  },
]