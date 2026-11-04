// Layer-by-layer structure of the two cooling systems (content/cooling-structure.md, Ganushi KC, 4 Nov 2026).
// Air hall: drawing SC-CH-01 section A-A. Hydro container: HFSG1200 commissioning plan + content/quality.md.
export type Layer = { id: string; name: string; role: string; dim?: string };

export const airLayers: Layer[] = [
  { id: "hood", name: "Intake hood with bird mesh", role: "A sloped hood on the outside wall. It keeps rain, birds and large debris out and is the first barrier against wind-blown sand." },
  { id: "filters", name: "Panel filters", role: "Mesh (GI) pre-filters and disposable panel filters trap desert dust before it can reach the cooling pads. Mesh filters are cleaned weekly and disposable filters replaced monthly." },
  { id: "corridor1", name: "Filter corridor", role: "A walkway between the filters and the wet pad. The quality team cleans and swaps filters from here without stopping the hall.", dim: "940 mm" },
  { id: "wet", name: "Wet pad with water header", role: "A honeycomb evaporative pad fed by a water header on top. Water trickles down the pad and the air cools as it evaporates, the same way sweat cools skin." },
  { id: "corridor2", name: "Service corridor", role: "Access to both pads, the water line and the pump, so the pads can be inspected and the water header cleaned.", dim: "880 mm" },
  { id: "dry", name: "Dry pad", role: "A second pad run dry. It evens out the airflow and catches any droplets carried over from the wet pad, so the air that reaches the machines is cool but not wet." },
  { id: "cold", name: "Cold aisle", role: "Cool, filtered air collects here in front of the racks. The miners' own fans draw it in.", dim: "1,500 mm clear" },
  { id: "racks", name: "Miner racks through the rack board", role: "Machines sit in a partition board with their intake facing the cold aisle and their exhaust facing the hot aisle. The board stops hot air from circling back to the intake.", dim: "500 mm" },
  { id: "hot", name: "Hot aisle", role: "Every machine's exhaust lands here, separated from the fresh air by the rack board.", dim: "1,500 mm" },
  { id: "fans", name: "Exhaust fans", role: "Large wall fans pull the hot air out of the hall. That keeps the hall under slight negative pressure, so fresh air keeps flowing in through the pads." },
];

export const hydroLayers: Layer[] = [
  { id: "miners", name: "Hydro miners on racks", role: "Each hydro miner sits in a rack with its own quick-connect supply and return hose and a mini valve, so one machine can be isolated without touching its neighbours." },
  { id: "manifolds", name: "Rack manifolds", role: "Supply and return headers on each rack share the coolant evenly between the machines and carry the heated coolant back out." },
  { id: "loop", name: "Sealed coolant loop", role: "A closed circuit of approved coolant only. A circulation pump keeps it moving, automatic air vents keep it free of air, and the loop pressure is held at or above 0.05 MPa.", dim: "≥ 85 m³/h" },
  { id: "tank", name: "Make-up tank", role: "A small reserve tank with a sight glass. It tops the loop up if the pressure drops, and is kept at least two-thirds full.", dim: "≥ 2/3 full" },
  { id: "hx", name: "Plate heat exchanger", role: "The two-water boundary. The sealed loop gives up its heat through metal plates to the tower water without the two ever mixing. Rated for 35 °C supply and 45 °C return." },
  { id: "sensors", name: "Sensors, leak detection and PLC", role: "Temperature, pressure and flow transmitters plus leak-detection strips on the floor feed the container's PLC, which runs the pumps and fans and raises alarms to the team." },
  { id: "pipes", name: "External pipework and valves", role: "Insulated pipework with butterfly valves links the container to the cooling tower outside, with strainers to catch any debris." },
  { id: "tower", name: "Hybrid cooling tower", role: "A dry/wet tower: in cooler months the fans blow air over a finned coil (dry mode); in summer spray nozzles wet the fill and evaporation does the cooling (wet mode). A drift eliminator stops water leaving with the air." },
  { id: "basin", name: "Tower basin and water treatment", role: "The open spray water collects in a basin with a float valve and suction strainer. A side-stream filter removes dust and a conductivity-controlled blowdown keeps the water clean. This open side is the only side that gets cleaned." },
  { id: "supply", name: "Treated water supply", role: "Treated make-up water from a buffer tank replaces what evaporates, with level alarms so the spray never runs dry." },
];
