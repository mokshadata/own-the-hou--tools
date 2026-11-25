import { Table as CompareTable } from "../../components/DataTable/ColumnBased";
import { formatCurrency } from "../../utilities";
import { onSettled } from "solid-js";
import { handleWebComponentStyling } from "../../utilities";

export const LoanEstimateComparisonTool = (props, node) => {
  onSettled(handleWebComponentStyling(node))

  return (<CompareTable
    rowSettings={[
      { name: 'nickname', type: 'text', label: 'Lender Name', isDynamic: true, },
      { name: 'loan-amount', type: 'currency', label: 'Loan Amount', isDynamic: true, },
      { name: 'apr', type: 'percent', label: 'APR', isDynamic: true, },
      { name: 'tip', type: 'percent', label: 'TIP', isDynamic: true, },
      { name: 'loan-term', type: 'number', label: 'Loan Term', isDynamic: true, },
      { name: 'remove', type: 'remove', label: '', value: 'Remove from Table', isDynamic: true, },
    ]}
    footerSettings={[
      { name: 'cost-to-own', type: 'calculated', label: 'Cost to Own', isDynamic: true,
        calculate: (item) => ((item.tip + 1) * item['loan-amount']),
        format: (cost, item) => (`${formatCurrency(cost)} in ${item['loan-term']} years`),
      },
    ]}
    items={[
      { nickname: '', 'loan-amount': 0, apr: 0, tip: 0, 'loan-term': 30, },
      { nickname: '', 'loan-amount': 0, apr: 0, tip: 0, 'loan-term': 30, },
    ]}
    defaultItem={
      { nickname: '', 'loan-amount': 0, apr: 0, tip: 0, 'loan-term': 30, }
    }
  />)
}