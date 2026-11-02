import { customElement } from "@solidjs/element";
import { DPAProgramsListSummary } from "../component";
// import { isStatic } from "solid-js";

customElement("ownthehou-dpa-programs-summary",
  {
    initialTargetHomePrice: null,
    initialHouseholdSize: null,
    initialHouseholdIncome: null,
    initialCoordinates: null,
  },
  DPAProgramsListSummary,
)