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
| IceRiver ALEO AE3 | Air | 3,400 | 2 GH/s | zkSNARK (Aleo) | Manufacturer specification as published by Kryptex and MiningBoard, 12 Nov 2026 (released Nov 2025) |
| IceRiver ALEO AE2 | Air | 1,300 | 720 MH/s | zkSNARK (Aleo) | Manufacturer specification as published by Kryptex, 12 Nov 2026 (one Kryptex summary says 750 MH/s; its spec table and sellers say 720 MH/s) |
| Antminer AL1 | Air | 3,730 | 16.6 TH/s | Blake3 (Alephium) | Bitmain official listing ("ALPH Miner AL1", shop.bitmain.com), 12 Nov 2026 |
| IceRiver AL3 | Air | 3,500 | 15 TH/s | Blake3 (Alephium) | Manufacturer specification as published by Kryptex, MiningBoard and Hashrate.no, 12 Nov 2026 (released Oct 2024) |
| Antminer S21 XP Hydro | Hydro | 5,676 | 473 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S21+ Hydro | Hydro | 5,370 | 358 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S21 Hydro | Hydro | 5,360 | | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 XP Hydro | Hydro | 5,304 | 246–257 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 Pro+ Hydro | Hydro | 5,445 | 184 TH/s | SHA-256 (Bitcoin) | Models tab |
| Antminer S19 Pro Hydro | Hydro | 5,445 | 177 TH/s | SHA-256 (Bitcoin) | Models tab |

## Aleo and Alephium machines (added 12 Nov 2026)
Ganushi KC asked to add the AL3 machines and the best-earning models of that kind. Checked 12 Nov 2026: the IceRiver AL3
mines Alephium (ALPH, Blake3), not Aleo; IceRiver's Aleo machines are the ALEO AE series (zkSNARK). Ganushi chose to add
all four leading machines: IceRiver ALEO AE3 and ALEO AE2 (Aleo), Antminer AL1 and IceRiver AL3 (Alephium).
- The fleet sheet's Models tab lists "IceRiver AL3 / AL-BOX" at 1,500 W, which matches neither the AL3 (3,500 W) nor any
  other listed model. The site uses the manufacturer's 3,500 W for the AL3. TODO: Ganushi to check the 1,500 W fleet entry.
- No revenue or profit figures are shown for any machine (CLAUDE.md rule); the choice of models is Ganushi's.
- Pictures: the Antminer AL1 shows Bitmain's own shop image (Adobe cut-out, Bitmain permission). IceRiver's website is
  behind a bot check and no IceRiver image permission is recorded, so the AE3, AE2 and AL3 rows show Segments' own rendered
  illustrations of each chassis (no logo or brand text; alt text says "illustration"), made the same way as the Whatsminer one.

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
| S21+ | 216 TH/s, 3,564 W | 235 TH/s, 3,564 W | Kept 235 TH/s from the Sep 2026 client report (a higher-hash S21+ variant). Ganushi KC confirmed on 12 Nov 2026 that both the air-cooled S21+ and the S21+ Hydro are hosted |
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
Ganushi KC asked for a small image of each miner in the machines table. Each Antminer row shows Bitmain's own product image from its official shop listing (shop.bitmain.com, 5 Nov 2026), with the white background removed using Adobe's background-removal tool and saved as a 192 x 144 transparent WebP in public/miners/thumbs. They are shown under the Bitmain permission recorded above (Ganushi KC confirmed on 5 Nov 2026 that the permission covers Bitmain's shop product images). Shared images, as on Bitmain's own listings: S21+ uses the S21 XP image; KS5 uses Bitmain's KS5 listing image, which is the same photo as the S21; S21+ Hydro and S21 Hydro use the S21 XP Hydro image. Discontinued models use the closest listed chassis: S19 XP uses the S19j XP image (same chassis) and S19 Pro Hydro uses the S19 Pro+ Hydro image. The Whatsminer M30S++ (MicroBT) row first showed a neutral fan tile. On 5 Nov 2026, at Ganushi KC's request, it was given a thumbnail: MicroBT no longer lists the M30S++ on microbt.com (discontinued), and the images online are on reseller sites with unclear rights, so the thumbnail is Segments' own rendered illustration of an M30S++ style chassis (silver case, end fan, power supply on top; public/miners/thumbs/whatsminer-m30s-plus-plus.webp, script kept outside the repo). Its alt text says "illustration"; it is not presented as a product photo. Specs unchanged: 112 TH/s at 3,472 W matches the published 112 TH/s variant.

## S21+ pictures (12 Nov 2026)
Ganushi KC asked for the S21+ air-cooled and S21+ Hydro rows to get their own pictures, made as before. Both now use
images from Bitmain's own S21+ and S21+ Hyd. listings (shop.bitmain.com gallery, 12 Nov 2026), cut out with Adobe's
background removal: the S21+ uses Bitmain's more frontal S21+ shot (same chassis family as the S21 XP), and the S21+ Hydro
uses Bitmain's S21+ Hyd. shot from the other side, so neither row repeats the S21 XP or S21 XP Hydro picture.

## Internals (for the calculator teardown illustration)

Researched 16 Nov 2026 from Bitmain support specification pages and user guides, MicroBT manuals and repair guides (D-Central). Reseller-only claims are left out; anything not stated by a reliable source is "not published" and the illustration shows that part as the typical layout without a count or name. Used in src/lib/miner-internals.ts. Dimensions L × W × H in mm.

| Model | Hashboards | Fans | Power supply | Control board | Coolant | Dimensions |
|---|---|---|---|---|---|---|
| Antminer Z15 Pro | 3 | 2 (position not published) | APW12, built in | not published | – | 428 × 195 × 290 |
| Antminer S21 XP | 3 | 4 | APW171215 | yes (name not published) | – | 449 × 219 × 293 |
| Antminer S21+ | not published | not published | APW171215 | not published | – | 450 × 219 × 293 |
| Antminer S21 | 3 | 4 (2 intake, 2 exhaust) | APW17 | Amlogic | – | 400 × 195 × 290 incl. PSU |
| Antminer S19 XP | 3 | 4 × 12038 (2 + 2) | APW12, on top | Zynq-based | – | 400 × 195.5 × 290 incl. PSU |
| Whatsminer M30S++ | 3 | 2 × 14 cm (front intake, rear exhaust) | P221B / P222B | CB6 | – | 430 × 155 × 226 |
| Antminer L9 | 3 | 4 × 12038 | APW171215 | CV1835 | – | 400 × 195 × 290 |
| Antminer L7 | 4 | 4 (2 + 2) | APW12 | Zynq-based, at the rear | – | 370 × 195.5 × 290 incl. PSU |
| Antminer D9 | not published | 4 × 12038 | APW12 | not published | – | 430 × 195.5 × 290 incl. PSU |
| Antminer KS5 | not published | 4 × 12038 | APW171215A | not published | – | 430 × 195.5 × 290 |
| Antminer AL1 | not published | not published | not published | not published | – | 430 × 195 × 290 |
| IceRiver ALEO AE3 / AE2, AL3 | not published (IceRiver states its product images are conceptual) | not published | not published | not published | – | AE3 370 × 195 × 290; AL3 430 × 195 × 290 |
| Antminer S21 XP Hydro | 3 (manifold for 3) | none listed | APW11 | Hyd. series | 2 quick connectors, OD10 | 339 × 173 × 207 |
| Antminer S21+ Hydro | not published | none listed | not published | not published | OD10 | 339 × 173 × 207 |
| Antminer S21 Hydro | 3 | none listed | APW11 | Hyd. series | 2 quick connectors, OD10 | 339 × 173 × 207 |
| Antminer S19 XP Hydro | 3 | none listed | APW11 | Hyd. series | 2 quick connectors, OD10 | 410 × 170 × 209 |
| Antminer S19 Pro+ Hydro | not published | none listed | not published | not published | OD10 | 410 × 196 × 209 |
| Antminer S19 Pro Hydro | not published | none listed | APW11 | not published | not published | 410 × 196 × 209 |

Not published for any hydro model: whether each hashboard has its own cold plate. Sources: support.bitmain.com specification pages for S21, S21 XP, S19 XP, L9, L7, D9, KS5 Pro, Z15 Pro, AL1, S21 XP Hyd, S21 Hyd, S19 XP Hyd, S19 Pro Hyd; Bitmain user guides and product manuals (S21+, S21 XP, S21 XP Hyd, S21 Hyd, S21+ Hyd, S19 XP Hyd, S19 Pro+ Hyd, S19 Pro Hydro); MicroBT M30S series manual and support.whatsminer.com; D-Central repair guides (S21, S19 XP, L7, M30S); iceriver.io product pages.

Source URLs:
- S21 https://support.bitmain.com/hc/en-us/articles/23794895251609-S21-Specification · https://d-central.tech/manuals/antminer-s21-maintenance-repair-guide
- S21 XP https://support.bitmain.com/hc/en-us/articles/35383015643673-S21-XP-Specifications
- S21+ (Bitmain guide) https://apextomining.com/apexto/uploads/2024/10/S21-User-Guide-V1.2.0.pdf
- S19 XP https://support.bitmain.com/hc/en-us/articles/8906244096409-S19-XP-Specifications · https://d-central.tech/manuals/antminer-s19-xp-maintenance-repair-guide/
- M30S++ https://jsbit.com/wp-content/uploads/2025/12/WhatsMiner-M30S-Series-Manual.pdf · https://support.whatsminer.com/en-US/article/676 · https://d-central.tech/whatsminer-m30s-maintenance-repair-guide/
- L9 https://support.bitmain.com/hc/en-us/articles/33850555425305-L9-Specifications
- L7 https://support.bitmain.com/hc/en-us/articles/4415138525337-L7-Specifications · https://d-central.tech/manuals/antminer-l7-maintenance-repair-guide/
- D9 https://support.bitmain.com/hc/en-us/articles/18573797811353-D9-Specifications
- KS5 https://cdn.webshopapp.com/shops/353164/files/456537090/ks5-product-datasheet-v20.pdf
- Z15 Pro https://support.bitmain.com/hc/en-us/articles/19259431024281-Z15-Pro-Specifications
- AL1 https://support.bitmain.com/hc/en-us/articles/35412695385881-ALPH-Miner-AL1-Specifications
- IceRiver https://www.iceriver.io/product/iceriver-aleo-ae3/ · https://www.iceriver.io/product/iceriver-alph-al3/
- S21 XP Hyd https://support.bitmain.com/hc/en-us/articles/34523540504857-S21-XP-Hyd-Specification
- S21 Hyd https://support.bitmain.com/hc/en-us/articles/26824251926681-S21-Hyd-Specification
- S21+ Hyd (Bitmain manual) https://oneminers.com/cdn/shop/files/Antminer_S21_Plus_Hyd_Manual-V1.2-oneminers.pdf
- S19 XP Hyd https://support.bitmain.com/hc/en-us/articles/36035119865113-Bitcoin-Miner-S19-XP-Hyd-Specifications
- S19 Pro+ Hyd https://tophash.ua/storage/5448/Antminer-S19-Pro+-Hyd-Product-Manual_V1.0.1.pdf
- S19 Pro Hyd https://www.antminerdistribution.com/wp-content/uploads/2022/05/S19-Pro-Hydro-Manual-1.pdf
