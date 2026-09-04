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
  { name:"Muhammad", vehicle:"2023 Toyota Corolla", review:"From filling out the form to getting my keys, it was faster than I expected — now I'm driving a 2023 Toyota Corolla.", photo:"assets/gallery/060-muhammad.jpg" },
  { name:"Diego Barraza", vehicle:"2021 Ram 1500 Classic", review:"I honestly didn't think I'd qualify, but here I am with my new 2021 Ram 1500 Classic. So happy with my new ride!", photo:"assets/gallery/059-diego-barraza.jpg" },
  { name:"Balakrishnan", vehicle:"2019 Nissan Kicks", review:"Another dealership told me no. Easy Auto said yes and got me my 2019 Nissan Kicks. Thank you to the whole Easy Auto team.", photo:"assets/gallery/058-balakrishnan.jpg" },
  { name:"Utpal", vehicle:"2024 Audi Q3", review:"I'd been declined before, but the team found a way to get me into a 2024 Audi Q3. Thank you to the whole Easy Auto team.", photo:"assets/gallery/057-utpal.jpg" },
  { name:"Tapas", vehicle:"2023 Toyota RAV4 XLE Hybrid", review:"Getting approved for my 2023 Toyota RAV4 XLE Hybrid took way less time than I thought it would.", photo:"assets/gallery/056-tapas.jpg" },
  { name:"Shubham", vehicle:"2024 Toyota Corolla Hybrid", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2024 Toyota Corolla Hybrid. Thank you to the whole Easy Auto team.", photo:"assets/gallery/055-shubham.jpg" },
  { name:"Etchevery", vehicle:"2018 BMW 330", review:"I honestly didn't think I'd qualify, but here I am with my new 2018 BMW 330.", photo:"assets/gallery/054-etchevery.jpg" },
  { name:"Jerin", vehicle:"2024 Mazda CX-30", review:"I can't believe how easy this was — approved and driving a 2024 Mazda CX-30 within days.", photo:"assets/gallery/053-jerin.jpg" },
  { name:"Bahadur Singh", vehicle:"2024 Toyota Corolla LE", review:"I'd been declined before, but the team found a way to get me into a 2024 Toyota Corolla LE. Excited for the road ahead.", photo:"assets/gallery/052-bahadur-singh.jpg" },
  { name:"Sandesh", vehicle:"2025 Volkswagen Jetta", review:"I honestly didn't think I'd qualify, but here I am with my new 2025 Volkswagen Jetta. This was the credit win I needed.", photo:"assets/gallery/051-sandesh.jpg" },
  { name:"Muskan", vehicle:"2026 Mazda CX-70", review:"I can't believe how easy this was — approved and driving a 2026 Mazda CX-70 within days.", photo:"assets/gallery/050-muskan.jpg" },
  { name:"Fabiola", vehicle:"2020 Nissan Qashqai", review:"Another dealership told me no. Easy Auto said yes and got me my 2020 Nissan Qashqai. So glad I didn't give up on this.", photo:"assets/gallery/049-fabiola.jpg" },
  { name:"Vishal", vehicle:"2023 Nissan Rogue", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2023 Nissan Rogue.", photo:"assets/gallery/048-vishal.jpg" },
  { name:"Kari Risto", vehicle:"2021 Lexus IS300", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2021 Lexus IS300. This was the credit win I needed.", photo:"assets/gallery/047-kari-risto.jpg" },
  { name:"Hajir", vehicle:"2017 BMW 330", review:"My credit wasn't great, but Easy Auto still got me into a 2017 BMW 330.", photo:"assets/gallery/046-hajir.jpg" },
  { name:"Josianne", vehicle:"2021 Lexus NX300", review:"Thank you Easy Auto for getting me approved on my 2021 Lexus NX300 when other lenders said no. This was the credit win I needed.", photo:"assets/gallery/045-josianne.jpg" },
  { name:"Carolyn", vehicle:"2023 Nissan Qashqai", review:"My credit wasn't great, but Easy Auto still got me into a 2023 Nissan Qashqai.", photo:"assets/gallery/044-carolyn.jpg" },
  { name:"Ankit", vehicle:"2024 Mercedes Benz GLB 250", review:"From filling out the form to getting my keys, it was faster than I expected — now I'm driving a 2024 Mercedes Benz GLB 250. This was the credit win I needed.", photo:"assets/gallery/043-ankit.jpg" },
  { name:"Ekue", vehicle:"2024 Nissan Kicks SV", review:"I'd been declined before, but the team found a way to get me into a 2024 Nissan Kicks SV. Proud of myself for pushing through this.", photo:"assets/gallery/042-ekue.jpg" },
  { name:"Nikhil", vehicle:"2025 Hyundai Tucson", review:"Another dealership told me no. Easy Auto said yes and got me my 2025 Hyundai Tucson. Loving every mile so far.", photo:"assets/gallery/041-nikhil.jpg" },
  { name:"Rohit", vehicle:"2026 Honda Civic Sport Hybrid", review:"Getting approved for my 2026 Honda Civic Sport Hybrid took way less time than I thought it would. Thank you to the whole Easy Auto team.", photo:"assets/gallery/040-rohit.jpg" },
  { name:"Bajaj Singh", vehicle:"2022 Honda Civic EX", review:"I walked in expecting another \"no.\" I walked out with the keys to my new 2022 Honda Civic EX instead. This was the credit win I needed.", photo:"assets/gallery/039-bajaj-singh.jpg" },
  { name:"Prabhjot", vehicle:"2023 Honda Civic Touring", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2023 Honda Civic Touring. This was the credit win I needed.", photo:"assets/gallery/038-prabhjot.jpg" },
  { name:"Leila", vehicle:"2023 Mercedes Benz GLA 250", review:"I can't believe how easy this was — approved and driving a 2023 Mercedes Benz GLA 250 within days. So happy with my new ride!", photo:"assets/gallery/037-leila.jpg" },
  { name:"Bilel", vehicle:"2018 Volvo XC90", review:"I'd been declined before, but the team found a way to get me into a 2018 Volvo XC90. So glad I didn't give up on this.", photo:"assets/gallery/036-bilel.jpg" },
  { name:"Ziel", vehicle:"2017 Mazda CX90", review:"Thank you Easy Auto for getting me approved on my 2017 Mazda CX90 when other lenders said no. Thank you to the whole Easy Auto team.", photo:"assets/gallery/035-ziel.jpg" },
  { name:"Raphael", vehicle:"2024 Kia Seltos EX", review:"I walked in expecting another \"no.\" I walked out with the keys to my new 2024 Kia Seltos EX instead. So happy with my new ride!", photo:"assets/gallery/034-raphael.jpg" },
  { name:"Sunny", vehicle:"2019 Audi Q5", review:"I'd been declined before, but the team found a way to get me into a 2019 Audi Q5. Loving every mile so far.", photo:"assets/gallery/033-sunny.jpg" },
  { name:"Reegan", vehicle:"2019 Acura TLX", review:"From filling out the form to getting my keys, it was faster than I expected — now I'm driving a 2019 Acura TLX. Excited for the road ahead.", photo:"assets/gallery/032-reegan.jpg" },
  { name:"Varinder", vehicle:"2022 Audi Q3", review:"Thank you Easy Auto for getting me approved on my 2022 Audi Q3 when other lenders said no.", photo:"assets/gallery/031-varinder.jpg" },
  { name:"Gnonsian", vehicle:"2024 Audi Q3", review:"I walked in expecting another \"no.\" I walked out with the keys to my new 2024 Audi Q3 instead.", photo:"assets/gallery/030-gnonsian.jpg" },
  { name:"Siegfried", vehicle:"2024 Volkswagen Taos", review:"Another dealership told me no. Easy Auto said yes and got me my 2024 Volkswagen Taos. This was the credit win I needed.", photo:"assets/gallery/029-siegfried.jpg" },
  { name:"Ridham", vehicle:"2024 Ford Bronco", review:"Getting approved for my 2024 Ford Bronco took way less time than I thought it would. So glad I didn't give up on this.", photo:"assets/gallery/028-ridham.jpg" },
  { name:"Jithin", vehicle:"2017 Lexus IS300", review:"Another dealership told me no. Easy Auto said yes and got me my 2017 Lexus IS300.", photo:"assets/gallery/027-jithin.jpg" },
  { name:"Lakhandeep", vehicle:"2023 GMC Sierra Denali", review:"Another dealership told me no. Easy Auto said yes and got me my 2023 GMC Sierra Denali. So happy with my new ride!", photo:"assets/gallery/026-lakhandeep.jpg" },
  { name:"Ashish", vehicle:"2026 Honda Civic Sport Hybrid", review:"I can't believe how easy this was — approved and driving a 2026 Honda Civic Sport Hybrid within days.", photo:"assets/gallery/025-ashish.jpg" },
  { name:"Milandeep", vehicle:"2024 Honda Civic EX", review:"From filling out the form to getting my keys, it was faster than I expected — now I'm driving a 2024 Honda Civic EX. So glad I didn't give up on this.", photo:"assets/gallery/024-milandeep.jpg" },
  { name:"Sanjaygiri", vehicle:"2026 Honda Civic Touring", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2026 Honda Civic Touring. Loving every mile so far.", photo:"assets/gallery/023-sanjaygiri.jpg" },
  { name:"Christian", vehicle:"2023 Nissan Rogue Platinum", review:"I still can't believe I'm already driving my new 2023 Nissan Rogue Platinum. Excited for the road ahead.", photo:"assets/gallery/022-christian.jpg" },
  { name:"Surinderpal", vehicle:"2026 Toyota Camry XSE Hybrid", review:"I honestly didn't think I'd qualify, but here I am with my new 2026 Toyota Camry XSE Hybrid. Proud of myself for pushing through this.", photo:"assets/gallery/021-surinderpal.jpg" },
  { name:"Navdeep", vehicle:"2024 Mitsubishi Outlander PHEV", review:"I honestly didn't think I'd qualify, but here I am with my new 2024 Mitsubishi Outlander PHEV. So happy with my new ride!", photo:"assets/gallery/020-navdeep.jpg" },
  { name:"Ranelgba", vehicle:"2023 Toyota Corolla SE", review:"I honestly didn't think I'd qualify, but here I am with my new 2023 Toyota Corolla SE. Thank you to the whole Easy Auto team.", photo:"assets/gallery/019-ranelgba.jpg" },
  { name:"Vicky", vehicle:"2024 BMW 330e", review:"I'd been declined before, but the team found a way to get me into a 2024 BMW 330e.", photo:"assets/gallery/018-vicky.jpg" },
  { name:"Marie Carmen", vehicle:"2022 Subaru Legacy", review:"My credit score didn't tell the whole story, and Easy Auto actually took the time to see that — now I've got my 2022 Subaru Legacy. So glad I didn't give up on this.", photo:"assets/gallery/017-marie-carmen.jpg" },
  { name:"Mchenry", vehicle:"2020 Hyundai Elantra", review:"I'd been declined before, but the team found a way to get me into a 2020 Hyundai Elantra. Excited for the road ahead.", photo:"assets/gallery/016-mchenry.jpg" },
  { name:"Abdul", vehicle:"2019 Toyota Prius", review:"I can't believe how easy this was — approved and driving a 2019 Toyota Prius within days. Proud of myself for pushing through this.", photo:"assets/gallery/015-abdul.jpg" },
  { name:"Tesilian Chi", vehicle:"2022 Chevrolet Equinox", review:"Getting approved for my 2022 Chevrolet Equinox took way less time than I thought it would.", photo:"assets/gallery/014-tesilian-chi.jpg" },
  { name:"Simon", vehicle:"2016 Mazda Sport", review:"I'd been declined before, but the team found a way to get me into a 2016 Mazda Sport. This is exactly the fresh start I needed.", photo:"assets/gallery/013-simon.jpg" },
  { name:"Matthew Pimental", vehicle:"2018 Volkswagen Tiguan", review:"I got turned down everywhere else, but Easy Auto found me an approval on a 2018 Volkswagen Tiguan in no time.", photo:"assets/gallery/012-matthew-pimental.jpg" },
  { name:"Adheesh Pawar", vehicle:"2020 Hyundai Sonata", review:"I got turned down everywhere else, but Easy Auto found me an approval on a 2020 Hyundai Sonata in no time. This was the credit win I needed.", photo:"assets/gallery/011-adheesh-pawar.jpg" },
  { name:"Digvijay Singh", vehicle:"2024 Kia Forte EX", review:"I honestly didn't think I'd qualify, but here I am with my new 2024 Kia Forte EX.", photo:"assets/gallery/010-digvijay-singh.jpg" },
  { name:"Hikmat Yar Shinwari", vehicle:"2023 Hyundai Elantra", review:"I walked in expecting another \"no.\" I walked out with the keys to my new 2023 Hyundai Elantra instead. So happy with my new ride!", photo:"assets/gallery/009-hikmat-yar-shinwari.jpg" },
  { name:"Salam Bin Obaid", vehicle:"2022 Hyundai Elantra", review:"I honestly didn't think I'd qualify, but here I am with my new 2022 Hyundai Elantra. So glad I didn't give up on this.", photo:"assets/gallery/008-salam-bin-obaid.jpg" },
  { name:"Desmond", vehicle:"2019 Honda CRV", review:"From filling out the form to getting my keys, it was faster than I expected — now I'm driving a 2019 Honda CRV. Proud of myself for pushing through this.", photo:"assets/gallery/007-desmond.jpg" },
  { name:"Nittin Singla", vehicle:"2022 Hyundai Sonata", review:"I still can't believe I'm already driving my new 2022 Hyundai Sonata.", photo:"assets/gallery/006-nittin-singla.jpg" },
  { name:"Prabhjot", vehicle:"2021 Volkswagen Jetta", review:"My credit wasn't great, but Easy Auto still got me into a 2021 Volkswagen Jetta.", photo:"assets/gallery/005-prabhjot.jpg" },
  { name:"Franklin", vehicle:"2020 Hyundai Tucson", review:"I honestly didn't think I'd qualify, but here I am with my new 2020 Hyundai Tucson. This is exactly the fresh start I needed.", photo:"assets/gallery/004-franklin.jpg" },
  { name:"Gaurav Singh", vehicle:"2021 Hyundai Elantra", review:"I honestly didn't think I'd qualify, but here I am with my new 2021 Hyundai Elantra.", photo:"assets/gallery/003-gaurav-singh.jpg" },
  { name:"Marcus", vehicle:"2018 Hyundai Elantra", review:"Thank you Easy Auto for getting me approved on my 2018 Hyundai Elantra when other lenders said no. So happy with my new ride!", photo:"assets/gallery/002-marcus.jpg" },
  { name:"Rifan", vehicle:"2021 Mazda CX-5", review:"My credit wasn't great, but Easy Auto still got me into a 2021 Mazda CX-5.", photo:"assets/gallery/001-rifan.jpg" },

];
