import { createSignal, onSettled, type Component } from "solid-js";
import { kebabCase, camelCase } from 'change-case';
import MoneyInput from "../../components/MoneyInput"
import { handleWebComponentStyling, formatPercent } from "../../utilities";

const DEBTS = [
  { label: 'Mortgage or rent payment', name: 'house-payment', },
  { label: 'Car loan or lease payment(s)', name: 'car-payment', },
  { label: 'Minimum student loan payment(s)', name: 'min-student-payment', },
  { label: 'Minimum credit card payment(s)', name: 'min-credit-card-payment', },
  { label: 'Personal loan payment(s)', name: 'personal-loan-payments', },
  { label: 'Other debt or court-ordered payment(s)', name: 'other-debt-payments', },
].map((debt) => ({
  name: kebabCase(debt.label),
  ...debt,
})).map((debt) => ({
  signalName: camelCase(debt.name),
  initialValueName: camelCase(`initial ${debt.name}`),
  ...debt,
}))

const INCOMES = [
  { label: 'Gross Monthly Income', }
].map((income) => ({
  name: kebabCase(income.label),
  ...income,
})).map((income) => ({
  signalName: camelCase(income.name),
  initialValueName: camelCase(`initial ${income.name}`),
  ...income,
}))

export interface DTICalculatorProps {

}

export const DTICalculator: Component<DTICalculatorProps> = (props, node) => {
  onSettled(handleWebComponentStyling(node))
  
  const debtSettings = DEBTS.map((debt) => ({
    setting: debt,
    controls: createSignal(props[debt.initialValueName] || 0),
  }))

  const incomeSettings = INCOMES.map((income) => ({
    setting: income,
    controls: createSignal(props[income.initialValueName] || 0),
  }))

  const debtsTotal = () => debtSettings.reduce((acc, debt) => (acc + debt.controls[0]()), 0)
  const incomesTotal = () => incomeSettings.reduce((acc, income) => (acc + income.controls[0]()), 0)

  const ratio = () => (debtsTotal() / incomesTotal())

  return (<><form>
    <div class="row">{
        debtSettings.map((debt) => (
          <div class="xs:col xl:col-6 2xl:col-4 mb-8">
              <label for={debt.setting.name} class="form-label">{debt.setting.label}</label>
              <MoneyInput
                class="form-control"
                name={debt.setting.name}
                id={debt.setting.name}
                step="1000" min="0"
                onChange={(changeEvent) => {
                  debt.controls[1](changeEvent.target.dataset.value * 1)
                }}
                defaultValue={
                  debt.controls[0]()
                }
                required
              />
            </div>
        ))
      }
    </div>
    <div class="row">{
        incomeSettings.map((debt) => (
          <div class="xs:col xl:col-6 2xl:col-4 mb-8">
              <label for={debt.setting.name} class="form-label">{debt.setting.label}</label>
              <MoneyInput
                class="form-control"
                name={debt.setting.name}
                id={debt.setting.name}
                step="1000" min="0"
                onChange={(changeEvent) => {
                  debt.controls[1](changeEvent.target.dataset.value * 1)
                }}
                defaultValue={
                  debt.controls[0]()
                }
                required
              />
            </div>
        ))
      }
    </div>
  </form>
  <h5>Your Debt-to-Income ratio is</h5>
  <h1>{incomesTotal() > 0 && formatPercent(ratio()) || ''}</h1>
  </>)
}