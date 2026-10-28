import { reportMeta, reportRows } from "@/lib/sample-report";

const usd = (n: number) => `$${n.toFixed(2)}`;
const num = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export function SampleReport() {
  return (
    <div className="report">
      <div className="report-head">
        <div>
          <p className="report-title">{reportMeta.title}</p>
          <p className="report-period">Period: {reportMeta.period}</p>
        </div>
        <dl>
          <dt>Example rate</dt><dd>${reportMeta.rate.toFixed(3)} / kWh</dd>
          <dt>Billing hours / day</dt><dd>{reportMeta.billingHours}</dd>
        </dl>
      </div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Sample report table, scrolls sideways">
        <table>
          <thead>
            <tr>
              <th scope="col">Machine</th>
              <th scope="col">Model</th>
              <th scope="col" className="num">Watts</th>
              <th scope="col" className="num">Running days</th>
              <th scope="col" className="num">Downtime days</th>
              <th scope="col" className="num">Energy kWh</th>
              <th scope="col" className="num">Charge</th>
              <th scope="col">Basis of running days</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((r) => (
              <tr key={r.unit}>
                <td>{r.unit}</td>
                <td>{r.model}</td>
                <td className="num">{r.watts.toLocaleString("en-US")}</td>
                <td className="num">{num(r.runningDays)}</td>
                <td className="num">{num(r.downtimeDays)}</td>
                <td className="num">{num(r.kwh)}</td>
                <td className="num strong">{usd(r.charge)}</td>
                <td className="muted">{r.basis}</td>
                <td className="muted">{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="report-formula">Charge = watts × {reportMeta.billingHours} × running days ÷ 1,000 × rate</p>
    </div>
  );
}
