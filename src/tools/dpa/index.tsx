import { customElement } from "@solidjs/element";
import { DPATool } from "./component";
// import { isStatic } from "solid-js";

customElement("ownthehou-dpa",
  {
    initialTargetHomePrice: undefined,
    initialHouseholdSize: undefined,
    initialHouseholdIncome: undefined,
    initialCoordinates: undefined,
  },
  DPATool,
)