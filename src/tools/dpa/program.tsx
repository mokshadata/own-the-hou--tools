
import type { boundNames, ProgramRenderable, MatchingProgramParams } from "./calculate";
import { houseListingPrice, downPaymentLower, downPaymentUpper, downPaymentPercentLower, downPaymentPercentUpper } from "./store";

import { formatCurrency, formatPercent } from "../../utilities";


export function Program({ program }:{ program: ProgramRenderable }) {

  return (<section
      data-program-state={program.state}
      class={`card mb-4 border border-2
          ${(program.state === 'eligible-full') && 'border-primary' || ''}
          ${(program.state === 'eligible-partial') && 'border-primary-subtle opacity-75' || ''}
          ${(program.state === 'inactive' || program.state === 'ineligible') && 'opacity-25' || ''}
      `}
      data-is-active={program.isActive && "on" || "off"}
      data-meets-limit-household={(program.meetsHouseholdLimits && "met") || (program.meetsHouseholdLimits === null && "not-set") || "not-met"}
      data-meets-limit-geo={(program.meetsGeoLimits && "met") || (program.meetsGeoLimits === null && "not-set") || "not-met"}
    >
      <div class="card-header" data-details="header">
        <h2 class="d-flex flex-row align-items-center gap-2 card-title">
          <span>
            <img src={program.programLogo} style="width: 200px;"/>
          </span>
          <span>
            {program.program}
          </span>
        </h2>
      </div>
      <div class="card-body" data-details="about">
        <div class="card-text" innerHTML={`${program.about}`}></div>
      </div>
      <ul class="list-group list-group-flush" data-details="limits">
        <li class="list-group-item" data-limit="income">
          <p class="mb-0">
            Financial Limit: <strong>{program.upperLimit}</strong>
          </p>
          <ul>
            {program.limits.map((limit) => (limit.householdSize && 
              <li>
                For household size of <span class="border-bottom border-1 border-black fst-italic">{limit.householdSize}</span>, annual income limit is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(limit.upperLimit)}</span>.
              </li> ||
              <li>
                Annual income limit is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(limit.upperLimit)}</span>.
              </li>
            ))}
          </ul>
        </li>
        {program.geoLimits.map((geoLimit) => (
          <li class="list-group-item" data-limit="geo">
            <p class="mb-0">
              Geo Bound: <strong>{geoLimit}</strong>
            </p>
          </li>
        ))}
      </ul>
      <div class="card-footer" data-details="summary">
        {program.availableDPA > 0 && <div>
          <p>
            With this program, you could qualify for up to <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(program.availableDPA)}</span> in Down Payment Assistance.
          </p>
          {houseListingPrice() && program.buyerDownUpper < 1000 && <p>For a house listing price of <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(houseListingPrice())}</span>, your target down payment is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(downPaymentUpper())}</span> ({formatPercent(downPaymentPercentUpper())} of listing price). This Down Payment Assistance program would cover most of your target down payment cost.</p>}
          {houseListingPrice() && program.buyerDownUpper >= 1000 && <p>For a house listing price of <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(houseListingPrice())}</span>, your target down payment is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(downPaymentUpper())}</span> ({formatPercent(downPaymentPercentUpper())} of listing price). With this program, you would need to provide {formatCurrency(program.buyerDownUpper)} to cover your target down payment.</p>}
        </div>}
      </div>
    </section>)
}