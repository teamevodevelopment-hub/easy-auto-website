# Easy Auto Website — How To Update Things

## 1. Add your logo
Save your logo as `assets/logo.png` (square works best, transparent background if you have it).
That's it — every page already points to that file and will pick it up automatically.
Until you add it, a placeholder "EA" mark shows instead, so nothing breaks.

## 2. Add delivery photos (the "Happy Drivers" gallery)
Open `assets/gallery-data.js`. Each delivery is one entry:

```js
{ name:"Customer Name", vehicle:"Year Make Model",
  review:"Short review of how we helped them.",
  photo:"assets/gallery/047.jpg" }
```

To add a new delivery:
1. Compress the photo to about 1200–1500px wide (keeps the site fast on mobile) and save it into `assets/gallery/`.
2. Add one new object to the top of the list in `assets/gallery-data.js` with that photo's path, the customer's name, vehicle, and a short review.
3. Save the file. Done — no other page needs to change. The gallery page shows 8 at a time with a "Load More" button, so this scales fine whether you have 20 photos or 2,000.

If you don't have the photo yet, leave `photo:null` and a placeholder tile shows instead.

## 3. Add real lender/bank names
Open `assets/lenders-data.js` and replace the placeholder entries with your real partner names.
**Important:** if you want to show an actual bank's logo image (not just text), check that bank's brand guidelines first — most require permission to display their logo.

## 4. Update the domain in SEO tags
Right now, `https://www.easyauto.ca` is used as a placeholder in a few places so search engines have something to read:
- `sitemap.xml`
- `robots.txt`
- The `<link rel="canonical">` and Open Graph tags near the top of each HTML file

Once your real domain is live, do a find-and-replace for `https://www.easyauto.ca` across these files.

## 5. Wire up real lead capture (important before running ads)
Right now, submitted applications only log to the browser console — they don't go anywhere yet.
Open `assets/chat.js` and look for the comment block starting with `LEAD PAYLOAD` — that's where a real
`fetch()` call to your CRM/webhook needs to go. Let me know where you want leads delivered (email, a webhook
into your internal system, a spreadsheet, etc.) and I can wire that in.

## 6. Add a real Open Graph preview image
Social links (Instagram/Facebook bio, etc.) will look for `assets/og-image.jpg` — a 1200×630px image
that shows up as a preview when the link is shared. Add that file once you have one ready.
