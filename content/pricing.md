# Pricing

## Plug and play hosting (your machines in our halls)
- From $0.058 to $0.068 per kWh, depending on quantity. Source: Ganushi KC, 28 Oct 2026.
- Replaces the single $0.060 rate given on 27 Oct 2026.
- Tiers (Ganushi KC, 4 Nov 2026): 100 or more machines → $0.058 per kWh; 50 to 99 machines → $0.062 per kWh; fewer than 50 machines → $0.068 per kWh.

## Turnkey solution
- Power from $0.039 per kWh. Source: Ganushi KC, 28 Oct 2026.
- Capex USD 300,000 per MW. Source: Ganushi KC, 28 Oct 2026.
- TODO: what the capex covers, who owns the infrastructure, minimum MW, build timeline, contract term

## How the charge is calculated
Source: Drive › Kim_September_2026_Power_Hosting_Report (Sheet 1 header and Summary), Oct 2026.
- Charge per machine = watts × 24 hours × running days ÷ 1000 × rate.
- Billing day is 24 hours.
- Running days come from the pool: offline units are counted up to their last share; online units use measured pool uptime.
- Days a machine is offline are not charged.
- Wattage is the model's measured or nameplate figure from the fleet platform (Foreman).
- Repair cost is billed with the hosting invoice (Drive › 2Bminer reconciliation README, Sep 2026).

## Still needed
- TODO: what the plug and play rate includes besides power (cooling, operations, monitoring?)
- Setup fee: USD 100 per kW of the client's machine load, so it scales with the number and power of the miners (Ganushi KC, 4 Nov 2026).
- Deposit: one month of power (Ganushi KC, 4 Nov 2026).
- Minimum term: 12 months (Ganushi KC, 4 Nov 2026).
- TODO: minimum fleet size
- Payment currencies: USD or AED (Ganushi KC, 4 Nov 2026).
- TODO: payment methods
