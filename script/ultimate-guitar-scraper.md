# Ultimate Guitar Chords Scraper (TypeScript)

Script ini digunakan untuk mengambil (scrape) link chord dari Ultimate
Guitar menggunakan API internal mereka, dengan pagination otomatis.

------------------------------------------------------------------------

## 📦 Requirements

Install dependencies:

``` bash
pnpm add node-fetch
pnpm add -D typescript @types/node
```

------------------------------------------------------------------------

## 📁 File: `scraper.ts`

``` ts
import fetch from 'node-fetch'
import fs from 'fs'

type Tab = {
  tab_url: string
}

async function get_chords(page: number): Promise<string[]> {
  const url = `https://www.ultimate-guitar.com/explore?type[]=Chords&page=${page}&ajax=1`

  const res = await fetch(url, {
    headers: {
      'x-requested-with': 'XMLHttpRequest',
      'user-agent': 'Mozilla/5.0'
    }
  })

  const json = await res.json()

  const tabs: Tab[] = json.data?.tabs || []

  return tabs.map(t => t.tab_url)
}

async function scrape_all(max_page = 20) {
  const result: string[] = []

  for (let i = 1; i <= max_page; i++) {
    console.log(`Scraping page ${i}...`)

    try {
      const links = await get_chords(i)
      result.push(...links)

      console.log(`Page ${i}: ${links.length} links`)
    } catch (err) {
      console.error(`Error di page ${i}`, err)
    }

    // delay biar tidak kena rate limit
    await new Promise(r => setTimeout(r, 500))
  }

  return result
}

// run scraper
async function main() {
  const data = await scrape_all(50)

  console.log('TOTAL:', data.length)

  fs.writeFileSync('chords.json', JSON.stringify(data, null, 2))
}

main()
```

------------------------------------------------------------------------

## ▶️ Cara Menjalankan

``` bash
npx ts-node scraper.ts
```

------------------------------------------------------------------------

## 📄 Output

File akan tersimpan sebagai:

    chords.json

Isi contoh:

``` json
[
  "https://tabs.ultimate-guitar.com/tab/artist/song-chords-123",
  "https://tabs.ultimate-guitar.com/tab/artist/song-chords-456"
]
```

------------------------------------------------------------------------

## ⚠️ Tips

-   Gunakan delay untuk menghindari rate limit
-   Jangan scrape terlalu banyak sekaligus
-   Bisa tambahkan retry logic jika perlu

------------------------------------------------------------------------

## 🚀 Upgrade (Opsional)

-   Simpan ke database (Prisma)
-   Tambahkan filter artist
-   Jadikan service NestJS + cron job
-   Auto detect last page

------------------------------------------------------------------------
