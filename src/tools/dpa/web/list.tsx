import { customElement } from "@solidjs/element";
import { DPAProgramsList } from "../component";
// import { isStatic } from "solid-js";

customElement("ownthehou-dpa-programs-list",
  {
    initialTargetHomePrice: null,
    initialHouseholdSize: null,
    initialHouseholdIncome: null,
    initialCoordinates: null,
  },
  DPAProgramsList,
)