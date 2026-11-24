import type { Component } from "solid-js";
import { createSignal } from "solid-js";
import { formatCurrency } from "../utilities/";

const MoneyInput: Component = (props) => {
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
      props.onChange({
        target: {
          dataset: {
            value: numericValue,
          },
        },
      })
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

export default MoneyInput;
