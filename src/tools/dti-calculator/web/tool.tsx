import { customElement } from "@solidjs/element";
import { DTICalculator } from "../component";

customElement("ownthehou-dti-calculator",
  {
    initialHousePayment: undefined,
    initialCarPayment: undefined,
    initialMinStudentPayment: undefined,
    initialMinCreditCardPayment: undefined,
    initialPersonalLoanPayments: undefined,
    initialOtherDebtPayments: undefined,
  },
  DTICalculator,
)