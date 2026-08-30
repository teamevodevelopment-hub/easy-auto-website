/* =========================================================
   EASY AUTO — Lender network data
   ---------------------------------------------------------
   Real lender names below. Logos aren't wired in yet — each
   entry has a "logo" field set to null, which shows a clean
   text plate. Once you have a lender's actual logo file (get
   it from their official media/brand kit, or your partner
   agreement — check their brand guidelines first):

   1. Save the logo image into assets/lenders/ (e.g. assets/lenders/td.png)
   2. Set that entry's "logo" field to the path, e.g.
      logo:"assets/lenders/td.png"
   3. Save — the carousel swaps from text to the logo image
      automatically, no other changes needed.
   ========================================================= */
const LENDER_DATA = [
  { name:"Desjardins", type:"Prime", logo:null },
  { name:"BNC", type:"Prime", logo:null },
  { name:"Scotiabank Prime", type:"Prime", logo:null },
  { name:"RBC", type:"Prime", logo:null },
  { name:"CIBC", type:"Prime", logo:null },
  { name:"TD Prime", type:"Prime", logo:null },
  { name:"iA Auto Finance", type:"Near-Prime", logo:null },
  { name:"EdenPark", type:"Subprime", logo:null },
  { name:"Santander Consumer Canada", type:"Near-Prime", logo:null },
  { name:"AutoCapital Canada", type:"Subprime", logo:null },
  { name:"NorthLake Financial", type:"Subprime", logo:null },
  { name:"RIFCO", type:"Subprime", logo:null },
  { name:"Iceberg Finance", type:"Subprime", logo:null },
  { name:"Quantifi", type:"Subprime", logo:null },
  { name:"Access Credit Leasing", type:"Specialty", logo:null },
];
