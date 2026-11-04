import { reportMeta, reportRows, reportTotals, statusLabel } from "@/lib/sample-report";

const usd = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const num = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/**
 * Sample monthly report with illustrative figures (Ganushi, 4 Nov 2026), laid out like the real one:
 * a document header with a SAMPLE stamp, four summary tiles, one row per machine with a status pill,
 * and the charge formula. Nothing here is client data.
 */
export function SampleReport() {
  return (
    <div className="report">
      <div className="report-head">
        <div>
          <p className="report-title">{reportMeta.title}</p>
          <p className="report-period">{reportMeta.period} · example rate ${reportMeta.rate.toFixed(3)} / kWh · {reportMeta.billingHours} billing hours a day</p>
        </div>
        <span className="report-stamp" aria-label="Sample report, illustrative figures">Sample</span>
      </div>
      <div className="report-tiles">
        <div><span>Machines</span><b className="num">{reportTotals.machines}</b></div>
        <div><span>Running days</span><b className="num">{num(reportTotals.runningDays)}</b></div>
        <div><span>Energy</span><b className="num">{num(reportTotals.kwh)} kWh</b></div>
        <div className="is-total"><span>Hosting charge</span><b className="num">{usd(reportTotals.charge)}</b></div>
      </div>
      <div className="table-scroll" tabIndex={0} role="region" aria-label="Sample report table, scrolls sideways">
        <table>
          <thead>
            <tr>
              <th scope="col">Machine</th>
              <th scope="col">Status</th>
              <th scope="col" className="num">Watts</th>
              <th scope="col" className="num">Running days</th>
              <th scope="col" className="num">Offline days</th>
              <th scope="col" className="num">Energy kWh</th>
              <th scope="col" className="num">Charge</th>
              <th scope="col">Basis of running days</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((r) => (
              <tr key={r.unit} className={`is-${r.status}`}>
                <td><b>{r.unit}</b><small>{r.model}</small></td>
                <td><span className={`rep-pill rep-${r.status}`}>{statusLabel[r.status]}</span></td>
                <td className="num">{r.watts.toLocaleString("en-US")}</td>
                <td className="num"><span className="rep-bar" style={{ "--p": r.runningDays / reportMeta.days } as React.CSSProperties} aria-hidden="true" />{num(r.runningDays)}</td>
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
      <p className="report-formula">Charge = watts × {reportMeta.billingHours} × running days ÷ 1,000 × rate · Illustrative figures, not client data</p>
    </div>
  );
}
