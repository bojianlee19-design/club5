// brand.config.ts
export const BRAND = {
  name: 'HAZY Club',
  shortName: 'HAZY',

  // —— 门店地址（来自 hazyclub.co.uk）——
  addressLine: '28 Eyre St, Sheffield City Centre',
  city: 'Sheffield',
  postcode: 'S1 4QY',
  country: 'United Kingdom',

  // 联系方式
  email: 'matt@hazyclub.co.uk',
  phone: '', // 若暂无可留空

  // 地图链接（点击可打开 Google Maps）
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=28+Eyre+St%2C+Sheffield+S1+4QY',

  // 社交
  socials: {
    instagram: '',
    tiktok: '',
    facebook: '',
  },

  // 站点信息（SEO/OG 用；若你有自定义域名请替换）
  siteUrl: 'https://club5-gray.vercel.app',
  brandColor: '#111111',
} as const

export type BrandConfig = typeof BRAND
