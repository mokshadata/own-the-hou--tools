
import type { ProgramRenderable } from "./calculate";
import { formatCurrency, formatPercent } from "../../utilities";

export function ProgramBadge({
  program,
}:{
  program: ProgramRenderable,
}) {

  return (<span
      data-program-state={program.state}
      class={`badge me-2 border rounded-pill
          ${(program.state === 'eligible-full') && 'border-primary text-primary' || ''}
          ${(program.state === 'eligible-partial' || program.state === 'needs-information') && 'border-info text-info opacity-75' || ''}
          ${(program.state === 'inactive' || program.state === 'ineligible') && 'border-info text-info opacity-25' || ''}
      `}
      data-is-active={program.isActive && "on" || "off"}
      data-meets-limit-household={(program.meetsHouseholdLimits && "met") || (program.meetsHouseholdLimits === null && "not-set") || "not-met"}
      data-meets-limit-geo={(program.meetsGeoLimits && "met") || (program.meetsGeoLimits === null && "not-set") || "not-met"}
    >
      {program.program}
    </span>)
}

export function Program({
  program,
  houseListingPrice,
  downPaymentPercentLower,
  downPaymentPercentUpper,
}:{
  program: ProgramRenderable,
  houseListingPrice: Function,
  downPaymentPercentLower: Function,
  downPaymentPercentUpper: Function,
}) {

  const downPaymentLower = () => ((houseListingPrice() || 0) * downPaymentPercentLower())
  const downPaymentUpper = () => ((houseListingPrice() || 0) * downPaymentPercentUpper())

  const buyerDownUpper = () => (Math.max(0, downPaymentUpper() - program.availableDPA))
  const buyerDownLower = () => (Math.max(0, downPaymentLower() - program.availableDPA))

  return (<section
      data-program-state={program.state}
      class={`card mb-4 border border-2
          ${(program.state === 'eligible-full') && 'border-primary' || ''}
          ${(program.state === 'eligible-partial' || program.state === 'needs-information') && 'border-primary-subtle opacity-75' || ''}
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
        <div class="card-text">
          <AboutProgram program={program.program} houseListingPrice={houseListingPrice}/>
        </div>
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
          {houseListingPrice() && buyerDownUpper() < 1000 && <p>For a house listing price of <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(houseListingPrice())}</span>, your target down payment is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(downPaymentUpper())}</span> ({formatPercent(downPaymentPercentUpper())} of listing price). This Down Payment Assistance program would cover most of your target down payment cost.</p>}
          {houseListingPrice() && buyerDownUpper() >= 1000 && <p>For a house listing price of <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(houseListingPrice())}</span>, your target down payment is <span class="border-bottom border-1 border-black fst-italic">{formatCurrency(downPaymentUpper())}</span> ({formatPercent(downPaymentPercentUpper())} of listing price). With this program, you would need to provide {formatCurrency(buyerDownUpper())} to cover your target down payment.</p>}
        </div>}
      </div>
    </section>)
}

export function AboutProgram({ program,...props}: { program: string, }) {
    const About = {
      'City of Houston Homebuyer Assistance': AboutCoHHomebuyerAssistance,
      'Houston Community Land Trust': AboutHCLT,
      'Harris County Down Payment Assistance Program': AboutHarrisCountyDPA,
      'The Texas Homebuyer Program': AboutTheTexasHomebuyerProgram,
      'Texas State Affordable Housing Corporation': AboutTSAHCProgram,
    }[program]

    return <About {...props}/>
}

export function AboutCoHHomebuyerAssistance() {
  return (<>
    <p>
      The City of Houston offers up to <span class="border-bottom border-1 border-black fst-italic">$50,000</span> to income-qualified residents.
    </p>
    <p>
      The City assists first-time homebuyers who buy a home within the city limits through their Homebuyer Assistance Program.
    </p>
    <p>
      For more information, please visit: <a href="https://houstontx.gov/housing/hap.html" target="_blank" rel="noopener noreferrer">houstontx.gov/housing/hap.html</a>.
    </p>
    <p>
      If you have questions or want to talk to someone with the City of Houston Housing and Community Development about this program, give them a call at 832-394-6200.
    </p>

  </>)
}

export function AboutHCLT() {
  return (<>
    <p>
      With the Houston Community Land Trust Homebuyer Choice Program, a qualified homebuyer can receive up to <span class="border-bottom border-1 border-black fst-italic">$150,000</span> or $100,000 in financial assistance grants to help lower the cost of buying a high-quality home in the City of Houston that meets the program criteria. 
    </p>
    <p>
      The homebuyer contributes what they can afford to their home purchase, usually in the form of a standard mortgage. The financial assistance grant helps cover the rest of the home's purchase price, as well as the buyer's reasonable closing costs.
    </p>
    <p>
      For more information, please visit: <a href="https://www.houstonclt.org/" target="_blank" rel="noopener noreferrer">houstonclt.org</a>.
    </p>
    <p>
      If you have questions or want to talk to someone with the Houston Community Land Trust about this program, give them a call at 713-512-5575.
    </p>
  </>)
}

export function AboutHarrisCountyDPA() {

  return (<>
    <p>
      Harris County offers up to <span class="border-bottom border-1 border-black fst-italic">$40,000</span> towards the purchase of new and pre-existing homes in the unincorporated areas of Harris County.  
    </p>
    <p>
      For more information, please visit: <a href="https://csd.harriscountytx.gov/Housing-and-Community-Development/Programs-and-Services/Downpayment-Assistance-Program" target="_blank" rel="noopener noreferrer">csd.harriscountytx.gov/Housing-and-Community-Development/Programs-and-Services/Downpayment-Assistance-Program</a>.
    </p>
    <p>
      If you have questions or want to talk to someone with the Harris County Community Services Department about this program, give them a call at 713-578-2000.  
    </p>
  </>)
  
}

export function AboutTheTexasHomebuyerProgram({houseListingPrice}: {houseListingPrice: Function}) {
  return (<>
    <p>
      The State of Texas offers up to 5% of the purchase price of your home{houseListingPrice() && <> (<span class="border-bottom border-1 border-black fst-italic">{formatCurrency(0.05 * houseListingPrice())}</span>)</> || <></>}.
    </p>
    <p>
      For more information, please visit:  <a href="https://thetexashomebuyerprogram.com/" target="_blank" rel="noopener noreferrer">thetexashomebuyerprogram.com</a>.
    </p>
    <p>
      If you have questions or want to talk to someone with the Texas Department of Housing and Community Affairs about this program, give them a call at 1-800-792-1119.  
    </p>
  </>)
}

export function AboutTSAHCProgram({houseListingPrice}: {houseListingPrice: Function}) {
  return (<>
    <p>
      The Texas State Affordable Housing Corporation offers up to 5% of the purchase price of your home{houseListingPrice() && <> (<span class="border-bottom border-1 border-black fst-italic">{formatCurrency(0.05 * houseListingPrice())}</span>)</> || <></>}.
    </p>
    <p>
      For more information, please visit: <a href="https://www.tsahc.org/home-buyer-programs" target="_blank" rel="noopener noreferrer">tsahc.org/home-buyer-programs</a>.
    </p>
    <p>
      If you have questions or want to talk to someone with the Texas State Affordable Housing Corporation about this program, give them a call at 1-877-508-4611.
    </p>
  </>)
}