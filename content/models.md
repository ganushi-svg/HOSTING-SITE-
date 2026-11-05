# Machine models

Wattage source: Drive › "Segments – Site Balance Power" › Models tab (fleet nameplate table), 22 Oct 2026,
unless noted otherwise. Hash rates are shown only where the fleet table or a client report names them.
Algorithm and coin are the manufacturer's published specification for the model.

Featured: Antminer Z15 Pro (requested by Ganushi KC, 28 Oct 2026).

| Model | Cooling | Nameplate W | Hash rate | Algorithm (coin) | Source of W |
|---|---|---|---|---|---|
| Antminer Z15 Pro | Air | 2,780 | 840 kSol/s | Equihash (Zcash) | Bitmain official listing (shop.bitmain.com, checked 5 Nov 2026): 840 KSol/s, 2,780 W. Updated from 2,560 W on 5 Nov 2026 at Ganushi KC's request to follow the Antminer site. Earlier web check 4 Nov 2026: hash rate 840 kSol/s agreed by all listings; power listed as 2,560 W (Kryptex, reseller), 2,650 W (MiningBoard) and 2,780 W (ASIC Miner Value). Ganushi KC chose 2,560 W on 4 Nov 2026. |
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

## Renders (updated 30 Oct 2026)
Source: two turntable videos uploaded by Ganushi KC on 30 Oct 2026 (antminer1.mp4 and main1.mp4). They replace the Miner Studio renders and 3D models, which Ganushi judged not good enough.
- public/miners/turntable/hydro.webp: from antminer1.mp4, a hydro-cooled unit. Used for every hydro model.
- public/miners/turntable/air.webp: from main1.mp4, an air-cooled Antminer on a lit plinth. Used for every other model (air-cooled).
- Processing: cropped to 4:3, white studio background cut out to transparency, 720 x 540 animated WebP at 15 fps (1.9 MB air, 0.9 MB hydro), plus a still first frame shown when paused or off screen.
- Shown in the Machines section beside each cooling tab (with a pause button), captioned as a representative render, not the exact model and not a product photo.
- The two turntable renders come from Bitmain (the manufacturer) and Segments has permission to publish them (Ganushi KC, 4 Nov 2026).
- The Miner Studio pack's product photos are not used (no reuse permission).

## Antminer logo on the renders (4 Nov 2026)
Ganushi KC asked for the original Antminer mark on the miners. The logo (ANTMINER antenna mark, public/brand/antminer-logo.png, 159 px) was taken from Bitmain's own website (www-static.bitmain.com) and composited, in perspective, onto the large flat side panel of both turntable renders for the frames where that panel faces the camera (air: frames 20-44 and 86-120; hydro: frames 14-50 and 76-112). The logo is Bitmain's trademark, shown on Bitmain machines under the permission recorded above. The paused still of each render is a frame that shows the logo. Update 5 Nov 2026: the calculator picture (air-calc / hydro-calc) and its blueprint traces now show the logo too, and the turntables use a slightly larger logo (air: 50% of the panel width; hydro: 40% of the panel length).

## Hash rates added 4 Nov 2026
At Ganushi KC's request every model now shows a hash rate. S21 XP 270 TH/s (Ganushi). Published specifications, web-checked the same day: S21 200 TH/s, S19 XP 140 TH/s, S21 Hydro 335 TH/s, KS5 20 TH/s, Whatsminer M30S++ 112 TH/s, D9 1,770 GH/s. The D9 is published at 2,839 W; the site keeps the fleet nameplate figure of 3,060 W.

- Logo placement (Ganushi, 5 Nov 2026): the Antminer logo is printed on the side panel of every miner render and stays fixed to the miner: it turns with it in the rotating turntables, and the static render beside the calculator (air and hydro, plus their blueprint traces) shows it on the visible side panel in perspective. Same panel position in every view; logo from Bitmain's site, used with permission.

## Bitmain official check (5 Nov 2026)
At Ganushi KC's request every model was checked against Bitmain's official shop (shop.bitmain.com, product list and product pages, 5 Nov 2026). Bitmain's listed figures, and what the site does:

| Model | Bitmain listing | Site | Action |
|---|---|---|---|
| Z15 Pro | 840 KSol/s, 2,780 W | 840 kSol/s, 2,780 W | Watts updated from 2,560 W |
| S21 XP | 270 TH/s, 3,645 W | same | None |
| S21+ | 216 TH/s, 3,564 W | 235 TH/s, 3,564 W | Kept 235 TH/s from the Sep 2026 client report (a higher-hash S21+ variant). TODO: Ganushi to confirm which S21+ variant is hosted |
| S21 | 200 TH/s, 3,500 W | same | None |
| S19 XP | not listed (discontinued) | 140 TH/s, 3,010 W | None |
| L9 | 16 GH/s, 3,360 W | 17 GH/s, 3,360 W | Kept 17 GH/s from the Sep 2026 client report. TODO: Ganushi to confirm the hosted L9 variant |
| L7 | 9,050 MH/s, 3,258 W | 3,260 W (9,500 MH/s variant: 3,425 W) | None (fleet nameplate) |
| D9 | 1,770 GH/s, 2,839 W | 1,770 GH/s, 3,060 W | Kept the fleet nameplate figure (already noted above) |
| KS5 | 20 TH/s, 3,000 W | same | None |
| S21 XP Hydro | 473 TH/s, 5,676 W | same | None |
| S21+ Hydro | 358 TH/s, 5,370 W | same | None |
| S21 Hydro | 319 TH/s, 5,104 W (current listing) | 335 TH/s, 5,360 W | Kept: 335 TH/s at 5,360 W is the S21 Hydro launch specification and matches the fleet nameplate |
| S19 XP Hydro | 257 TH/s, 5,346 W | 246–257 TH/s, 5,304 W | None (fleet nameplate) |
| S19 Pro+ Hydro | 191 TH/s, 5,252.5 W | 184 TH/s, 5,445 W | Kept the fleet nameplate and table figures. TODO: Ganushi to confirm |
| S19 Pro Hydro | not listed (discontinued) | 177 TH/s, 5,445 W | None |
| Whatsminer M30S++ | not a Bitmain machine (MicroBT) | 112 TH/s, 3,472 W | None |

Wattage on the site stays the fleet nameplate from the Site Balance Power sheet, because that is what the hosting charge is computed from; only the Z15 Pro, which had no fleet figure, follows the manufacturer.

## Machine thumbnails (5 Nov 2026)
Ganushi KC asked for a small image of each miner in the machines table. Each Antminer row shows Bitmain's own product image from its official shop listing (shop.bitmain.com, 5 Nov 2026), with the white background removed using Adobe's background-removal tool and saved as a 192 x 144 transparent WebP in public/miners/thumbs. They are shown under the Bitmain permission recorded above (Ganushi KC confirmed on 5 Nov 2026 that the permission covers Bitmain's shop product images). Shared images, as on Bitmain's own listings: S21+ uses the S21 XP image; KS5 uses Bitmain's KS5 listing image, which is the same photo as the S21; S21+ Hydro and S21 Hydro use the S21 XP Hydro image. Discontinued models use the closest listed chassis: S19 XP uses the S19j XP image (same chassis) and S19 Pro Hydro uses the S19 Pro+ Hydro image. The Whatsminer M30S++ (MicroBT) has no image permission, so its row shows a neutral fan tile.
