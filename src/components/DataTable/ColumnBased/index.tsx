import { createSignal, createStore, Switch, Match, For, createEffect, Show } from "solid-js"
import MoneyInput from "../../MoneyInput"

export const Table = (props) => {

  // const rowSettings = props.rows.map((row) => ({
  //   setting: row,
  //   ...(row.isDynamic && { controls: createSignal(row.default), } || {}),
  // }))

  const [items, setItems] = createStore(props.items)

  const canAddItem = () => (items.find((item) => (Object.entries(item).find(([key, value]) => (!value)))) === undefined)

  const renderRows = (rowSetting, rowIndex) => (
    <tr>
      <th scope="row" style="text-align: right; padding-right: 0.5em;">{rowSetting.label}</th>
      <For each={items}>{
        (item, itemIndex) => (
          <td>{
          rowSetting.isDynamic && (<Switch>
            <Match when={rowSetting.type === 'text'}>
              <input
                type="text"
                class="form-control"
                defaultValue={item[rowSetting.name]}
                onInput={(inputEvent) => {
                  setItems((draft) => {
                    draft[itemIndex()][rowSetting.name] = inputEvent.currentTarget.value
                  })
                }}/>
            </Match>
            <Match when={rowSetting.type === 'number'}>
              <input
                type="number" min="15" max="30" step="5"
                class="form-control"
                defaultValue={item[rowSetting.name]}
                onInput={(inputEvent) => {
                  setItems((draft) => {
                    draft[itemIndex()][rowSetting.name] = inputEvent.currentTarget.valueAsNumber
                  })
                }}/>
            </Match>
            <Match when={rowSetting.type === 'percent'}>
              <input
                type="number" min="0" max="100" step="1"
                class="form-control"
                defaultValue={item[rowSetting.name]}
                onInput={(inputEvent) => {
                  setItems((draft) => {
                    draft[itemIndex()][rowSetting.name] = inputEvent.currentTarget.valueAsNumber / 100
                  })
                }}/>
            </Match>
            <Match when={rowSetting.type === 'currency'}>
              <MoneyInput
                class="form-control"
                name={rowSetting.name}
                id={rowSetting.name}
                step="1000" min="0"
                onChange={(inputEvent) => {
                  setItems((draft) => {
                    draft[itemIndex()][rowSetting.name] = inputEvent.target.dataset.value
                  })
                }}
                defaultValue={
                  item[rowSetting.name]
                }
                required
              />
            </Match>
            <Match when={rowSetting.type === 'remove'}>
              <button
                class="btn"

                onClick={() => {
                  setItems((draft) => {
                    draft.splice(itemIndex(), 1)
                  })
                }}
              >{rowSetting.value}</button>
            </Match>
            <Match when={rowSetting.type === 'calculated'}>
              {rowSetting.format(rowSetting.calculate(item), item)}
            </Match>
          </Switch>) || <></>
        }</td>
      )}</For>
    </tr>
  )

  return (<form><div class="table-card table-responsive"><table class="table table-striped-columns table-hover align-middle">
    <thead>
      <tr>
        <th scope="col"></th>
        <For each={items}>{
          (item, itemIndex) => (<th scope="col">Lender # {itemIndex() + 1 }</th>)
        }</For>
      </tr>
    </thead>
    <tbody class="table-group-divider">
      <For each={props.rowSettings}>{renderRows}</For>
    </tbody>
    <tfoot class="table-group-divider">
      <For each={props.footerSettings}>{renderRows}</For>
    </tfoot>
  </table>
  </div>
  <div class="text-end">
    <button
      class="btn btn-subtle theme-primary"
      disabled={!canAddItem()}
      onClick={() => {
        setItems((draft) => {
          draft.push({ ...props.defaultItem })
        })
      }}>Add another lender to compare</button>
  </div>
  </form>)

}