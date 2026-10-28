import { Droplets, Fan, Server, Zap } from "lucide-react";

const racks = Array.from({ length: 6 }, (_, i) => i);
const slots = Array.from({ length: 7 }, (_, i) => i);

/** Decorative concept art. It does not show a real Segments site, inventory or live telemetry. */
export function FacilityVisual() {
  return (
    <div className="facility-art" role="img" aria-label="Concept illustration of six mining racks with cooling airflow. Not a photo of a Segments site.">
      <div className="facility-radar radar-one" />
      <div className="facility-radar radar-two" />
      <div className="facility-floor" />
      <div className="floor-glow" />
      <div className="rack-stage">
        {racks.map((rack) => (
          <div className="rack" key={rack}>
            <div className="rack-head"><span /> <span className="rack-label">RACK {String(rack + 1).padStart(2, "0")}</span><span /></div>
            <div className="rack-bays">
              {slots.map((slot) => (
                <div className="miner" key={slot}><i className="miner-light" /><div className="miner-fan"><div className="fan-lines" /></div><span className="miner-vent" /></div>
              ))}
            </div>
            <div className="rack-foot" />
          </div>
        ))}
      </div>
      <div className="art-label art-label-top" aria-hidden="true">
        <span className="signal"><Fan size={15} /></span>
        <span><b>CONCEPT ILLUSTRATION</b><small>Not a photo of our sites</small></span>
      </div>
      <div className="art-label art-label-bottom" aria-hidden="true">
        <span className="signal signal-gold"><Droplets size={15} /></span>
        <span><b>AIR + HYDRO COOLING</b><small>Halls at our UAE sites</small></span>
      </div>
      <div className="art-corner left" aria-hidden="true"><Zap size={15} /> POWER</div>
      <div className="art-corner right" aria-hidden="true"><Server size={15} /> ASIC RACKS</div>
    </div>
  );
}
