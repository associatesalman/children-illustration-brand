import characterSpread from '../assets/about/character-spread.webp'
import familyWorkshop from '../assets/about/family-workshop.webp'
import readerDiscovery from '../assets/about/reader-discovery.webp'
import type { Artwork } from './artwork'

/**
 * Example illustrations supplied by the brand owner in public/about-mockups,
 * cropped and converted to WebP. They are not studio originals or client work,
 * so captions present them as examples. Sources are recorded in
 * src/assets/artwork/ASSETS.md.
 */
export const exampleArt = {
  readerDiscovery: {
    src: readerDiscovery,
    alt: 'A girl gasps in surprise as she reads a yellow book titled Exotic Birds, while colorful birds peek out from the leaves around her',
    width: 808,
    height: 632,
  },
  characterSpread: {
    src: characterSpread,
    alt: 'A picture book spread showing the same girl with blue hair bows in four scenes: searching behind flower pots, peeking into a watering can, digging up pennies, and winking with a pocket full of coins',
    width: 1199,
    height: 781,
  },
  familyWorkshop: {
    src: familyWorkshop,
    alt: 'A grandmother and two children gather leaves, pinecones, and twigs on a garden table to make a picture together',
    width: 488,
    height: 328,
  },
} satisfies Record<string, Artwork>
