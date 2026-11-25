import { Title } from '@solidjs/meta';
import { DPATool } from '../tools/dpa/component';
import { DTICalculator } from '../tools/dti-calculator/component';
import { LoanEstimateComparisonTool } from '../tools/loan-estimate-comparison/component';

export default function Home() {
  return (
    <main class="container py-5">
      <Title>Own the HOU - Tools Prototypes</Title>
      <h1>DPA Tool</h1>
      <DPATool/>
      <h1>DTI Calculator</h1>
      <DTICalculator/>
      <h1>Loan Estimate Comparison Tool</h1>
      <LoanEstimateComparisonTool/>
    </main>
  );
}
