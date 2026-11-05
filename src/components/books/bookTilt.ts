/** Static card tilts for the book showcase grids (wide screens only). */

/**
 * On wide screens the four cards in each row are set at fixed tilts of -2°, +2°,
 * -1° and +2° with small vertical offsets. Static: no transition or hover change.
 */
export const tiltFourPerRow = [
  'xl:[&:nth-child(4n+1)]:-rotate-2 xl:[&:nth-child(4n+1)]:top-3',
  'xl:[&:nth-child(4n+2)]:rotate-2',
  'xl:[&:nth-child(4n+3)]:-rotate-1 xl:[&:nth-child(4n+3)]:top-1',
  'xl:[&:nth-child(4n)]:rotate-2 xl:[&:nth-child(4n)]:top-3',
].join(' ')

/** The same small static tilts for a five-per-row grid: -2°, +1°, -1°, +2°, -1°. */
export const tiltFivePerRow = [
  'xl:[&:nth-child(5n+1)]:-rotate-2 xl:[&:nth-child(5n+1)]:top-3',
  'xl:[&:nth-child(5n+2)]:rotate-1',
  'xl:[&:nth-child(5n+3)]:-rotate-1 xl:[&:nth-child(5n+3)]:top-2',
  'xl:[&:nth-child(5n+4)]:rotate-2',
  'xl:[&:nth-child(5n)]:-rotate-1 xl:[&:nth-child(5n)]:top-3',
].join(' ')
