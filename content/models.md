# Machine models

Wattage source: Drive › "Segments – Site Balance Power" › Models tab (fleet nameplate table), 22 Oct 2026,
unless noted otherwise. Hash rates are shown only where the fleet table or a client report names them.
Algorithm and coin are the manufacturer's published specification for the model.

Featured: Antminer Z15 Pro (requested by Ganushi KC, 28 Oct 2026).

| Model | Cooling | Nameplate W | Hash rate | Algorithm (coin) | Source of W |
|---|---|---|---|---|---|
| Antminer Z15 Pro | Air | 2,780 | 840 kSol/s | Equihash (Zcash) | Bitmain published spec. TODO: Ganushi to confirm against our units |
| Antminer S21 XP | Air | 3,645 | | SHA-256 (Bitcoin) | Models tab |
| Antminer S21+ | Air | 3,564 | 235 TH/s | SHA-256 (Bitcoin) | Models tab; hash rate from Sep 2026 client report |
| Antminer S21 | Air | 3,500 | | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 XP | Air | 3,010 | | SHA-256 (Bitcoin) | Models tab |
| Whatsminer M30S++ | Air | 3,472 | | SHA-256 (Bitcoin) | Models tab |
| Antminer L9 | Air | 3,360 | 17 GH/s | Scrypt (Litecoin, Dogecoin) | Models tab; hash rate from Sep 2026 client report |
| Antminer L7 | Air | 3,260 (9,500 MH/s variant: 3,425) | 9,500 MH/s variant | Scrypt (Litecoin, Dogecoin) | Models tab |
| Antminer D9 | Air | 3,060 | | X11 (Dash) | Models tab |
| Antminer KS5 | Air | 3,000 | | kHeavyHash (Kaspa) | Models tab |
| Antminer S21 XP Hydro | Hydro | 5,676 | 473 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S21+ Hydro | Hydro | 5,370 | 358 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S21 Hydro | Hydro | 5,360 | | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 XP Hydro | Hydro | 5,304 | 246–257 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 Pro+ Hydro | Hydro | 5,445 | 184 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 Pro Hydro | Hydro | 5,445 | 177 TH/s | SHA-256 (Bitcoin) | Models tab |

Not given a page yet: IceRiver AL3 / AL-BOX (1,500 W in the Models tab). TODO: confirm the model name.

Monthly power estimates on the model pages = nameplate W × 24 h × 30 days ÷ 1,000 × rate,
at the plug and play range in content/pricing.md. Power only, at 100% running days.

## Renders (added 29 Oct 2026)
Source: Miner-Studio-Assets.zip uploaded by Ganushi KC (Miner Studio pack, 29 Oct 2026).
- public/miners/posters/*.webp: 15 posters rendered from locally authored, photo-guided 3D models. Not manufacturer CAD and not product photos; captioned "3D render for illustration".
- public/miners/video/: 6-second turntable loops for the Z15 Pro and S21 XP Hydro, cropped to remove the pack's title text.
- The pack's 15 product photos are NOT used: the pack itself says reuse permission has not been obtained. TODO: get written permission from the manufacturer or reseller, or supply our own product photos.
- The interactive GLB 3D viewer is NOT installed yet: it needs a new dependency (@google/model-viewer). TODO: Ganushi to approve.
- Antminer KS5 has no render in the pack and keeps the SVG illustration. TODO: render for the KS5.
