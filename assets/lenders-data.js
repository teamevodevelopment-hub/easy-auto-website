/* =========================================================
   EASY AUTO — Lender network data
   ---------------------------------------------------------
   Real lender names below. Logos aren't wired in yet — each
   entry has a "logo" field set to null, which shows a clean
   text plate. Once you have a lender's actual logo file (get
   it from their official media/brand kit, or your partner
   agreement — check their brand guidelines first):

   1. Save the logo image into assets/lenders/ using the exact
      filename shown below for that lender (e.g. assets/lenders/rbc.png)
   2. That's it — save the file with that exact name and the
      carousel will automatically detect and display it, no code
      changes needed. The "logo" field below is only needed if you
      want to override the auto-detected filename.

   Expected filenames (must match exactly):
   desjardins.png, bnc.png, scotiabank-prime.png, rbc.png, cibc.png,
   td-prime.png, ia-auto-finance.png, edenpark.png,
   santander-consumer-canada.png, autocapital-canada.png,
   td-non-prime.png, sda.png, northlake-financial.png, rifco.png,
   iceberg-finance.png, quantifi.png, access-credit-leasing.png
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
  { name:"TD Non-Prime", type:"Non-Prime", logo:null },
  { name:"SDA", type:"Non-Prime", logo:null },
  { name:"NorthLake Financial", type:"Subprime", logo:null },
  { name:"RIFCO", type:"Subprime", logo:null },
  { name:"Iceberg Finance", type:"Subprime", logo:null },
  { name:"Quantifi", type:"Subprime", logo:null },
  { name:"Access Credit Leasing", type:"Specialty", logo:null },
];
