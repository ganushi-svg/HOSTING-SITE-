# Services

Source: Drive › Kim_September_2026_Power_Hosting_Report, 2Bminer reconciliation README, Segments_Warehouse_Inventory, Site Balance Power (Sep–Oct 2026).

## Overview
Approved wording for the Services section (45 MW and hydro + air cooled wording from Ganushi KC, 3 Nov 2026; drafted 3 Nov 2026 from the facts below and in content/performance.md, content/sites.md):

We have mined Bitcoin for our own account since 2017, so we know what it takes to keep machines running in the UAE heat. Today Segments Cloud operates 45 MW of power at sites all around Abu Dhabi and hosts both hydro and air-cooled machines, with a site in-charge and hosting technicians at every site. Our repair center is staffed by technicians trained by Bitmain. Every machine you send us is tracked on our fleet platform, and if one fails we collect it, diagnose it and send you a quote before any work starts. Each month you receive a report with every machine's running days, energy and charge. You pay only for the days it actually ran.

Background facts, from Drive › "Segments Proposal" deck (About Segments slide):
- Segments has mined bitcoin for itself since 2017. Confirmed by Ganushi KC, 3 Nov 2026.
- The repair and maintenance center is run by technicians trained by Bitmain. Confirmed by Ganushi KC, 3 Nov 2026.
- Segments offers post-sale support for machines it sells.
Not used from that deck: "Buy, Host & Earn" and its ROI/profit table (no profit or returns language on the site), and the Abu Dhabi addresses (sites are published at UAE level only).

## Power
- Power capacity is tracked per site and zone, and load is read from the fleet platform before machines are placed.

## Cooling
- Air-cooled halls for air-cooled ASICs.
- A hydro-cooled zone for hydro models.

## Operations and repair
- On-site hosting technicians and a site in-charge for each site.
- In-house repair: pickup at the site, intake at the Segments repair center, diagnosis, quote, repair and return to the rack.
- Repair steps as shown on the site (Ganushi KC, 4 Nov 2026): Site Pickup → Intake & Diagnosis → Quote Approval → Repair by Bitmain-trained technicians → Return to Rack & Verification (the machine is checked on the fleet platform after it returns). Technicians are trained by Bitmain; do not describe them as certified.
- Clients approve repair quotes before work starts.
- Spare parts stock (fans, PSU fans, cables) is held in the Segments warehouse.

## Monitoring
- Every machine is tracked on the fleet platform (Foreman): status, hash rate, last share and repair state.
- Client fleet data is synced daily.
- Monthly power and hosting report per client, with per-machine running days, energy and charge.
- Repair log with every stage of each repair.

## Machines we host
Source: Site Balance Power › Models tab (fleet nameplate table).
- Air-cooled: Antminer Z15 Pro, S21 XP, S21+, S21, S19 XP, L9, L7, D9, KS5, AL1; Whatsminer M30S++; IceRiver AL3, ALEO AE3, ALEO AE2 (AE3, AE2 and AL1 added 12 Nov 2026; content/models.md).
- Hydro-cooled: Antminer S21 XP Hydro, S21+ Hydro, S21 Hydro, S19 XP Hydro, S19 Pro+ Hydro, S19 Pro Hydro.

## Still needed
- Hosting technicians are on site 24/7 and every site is fully monitored (Ganushi KC, 4 Nov 2026).

- Sample client report on the site: illustrative figures only, built from the published models and an example rate; not a real client extract (Ganushi KC, 4 Nov 2026).

- Repair video (4 Nov 2026): the supplied clip carries only about 4 real frames a second, so it is re-encoded with motion-compensated interpolation (ffmpeg minterpolate) to a true 30 fps, the out-of-focus funnel shot cut, keyframe every second, no audio, metadata stripped.

## Monitoring samples and site cameras (Ganushi KC, 12 Nov 2026)
- The Infrastructure section shows "How we watch your machines": sample views of three of Segments' own dashboards
  (the sites operations status deck, the Foreman site power planner and the repair-team monitoring board), cleaned for
  the public site at Ganushi's request ("all three sample in a very good way where clients won't get disturbed").
- Every figure in those views is illustrative, labelled "Sample view · illustrative figures" on the page, and lives in
  src/lib/monitoring-samples.ts. Halls, clients and repair tickets carry generic labels; no site name, person, IP,
  wallet, supplier or internal capacity figure from the source dashboards is used. The repair view uses the site's own
  five repair steps.
- Site camera recordings: two clips from the site cameras, labelled "Site camera · Recorded on site" (Ganushi chose
  this; recorded footage is never called live). Each clip must be trimmed, compressed and checked before use: faces,
  number plates and screen text blurred, and no camera positions, entrances or other security detail visible.
- Clips added 13 Nov 2026 from Ganushi's Drive (Taweelah1B.mp4, 702 MB, 30 min; Forest2CCTV_Footage.mp4, 259 MB,
  11 min): a 12-second real-time stretch of each, no audio, 1280 x 720, about 1.5 MB each (public/video/cam-hydro-aisle.mp4
  and cam-air-racks.mp4, with posters). Checked every two seconds: no people, number plates or outside views; the only
  door in view is the hydro container's internal end door. The cameras' own date stamps stay in the picture. Shown as
  "CAM 01 · Hydro container aisle · Abu Dhabi" and "CAM 02 · Air-cooled racks · Abu Dhabi"; site names stay off the page.
