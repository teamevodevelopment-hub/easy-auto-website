/* =========================================================
   EASY AUTO — Delivery gallery data
   ---------------------------------------------------------
   HOW TO ADD A NEW DELIVERY:
   1. Compress the photo to ~1200-1500px wide (keeps the site fast)
      and drop it in assets/gallery/ (e.g. assets/gallery/047.jpg)
   2. Add one object to the GALLERY_DATA array below:
        { name:"Customer Name", vehicle:"Year Make Model",
          review:"Short AI-drafted review of how we helped them.",
          photo:"assets/gallery/047.jpg" }
   3. Save. Newest entries should go at the TOP of the array —
      the gallery shows them most-recent-first automatically.
   Leave "photo" as null if you don't have the image yet — a
   placeholder tile will show instead so nothing breaks.
   ========================================================= */
const GALLERY_DATA = [
  { name:"Marcus J.", vehicle:"2021 Honda Civic", review:"Turned down at three dealerships — approved with us in under an hour and drove home the same day.", photo:null },
  { name:"Renee T.", vehicle:"2020 Hyundai Kona", review:"First car loan ever with zero credit history. They walked me through exactly how the payments build my score.", photo:null },
  { name:"Devon K.", vehicle:"2019 Toyota Corolla", review:"Post-repossession approval I honestly didn't think was possible. No judgment, just a real plan.", photo:null },
  { name:"Priya S.", vehicle:"2022 Kia Seltos", review:"New to Canada with no local credit file — matched with a lender built for exactly that situation.", photo:null },
  { name:"Kevin A.", vehicle:"2018 Ford Escape", review:"Approved during a consumer proposal. Didn't expect that to be possible, but the team found a way.", photo:null },
  { name:"Alicia M.", vehicle:"2021 Nissan Sentra", review:"Self-employed income made every other lender nervous. Ours actually looked at the full picture.", photo:null },
  { name:"Tyler B.", vehicle:"2020 Chevrolet Equinox", review:"Rebuilding after a rough patch. One year later my score is up 90 points from that first approval.", photo:null },
  { name:"Samantha O.", vehicle:"2019 Mazda CX-5", review:"$0 down and still got approved with a rate I could actually manage.", photo:null },
];
