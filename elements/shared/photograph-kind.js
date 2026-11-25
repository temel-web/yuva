const SAMPLE_SIZE = 16;
const WHITE_FLOOR = 236;
const roomKindBySource = new Map();
let sampleCanvas = null;
let sampleContext = null;

function sharedSampleContext() {
  if (!sampleCanvas) {
    sampleCanvas = new OffscreenCanvas(SAMPLE_SIZE, SAMPLE_SIZE);
    sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
  }
  return sampleContext;
}

function isSameOriginSource(source, baseUri) {
  try {
    return new URL(source, baseUri).origin === location.origin;
  } catch {
    return false;
  }
}

const CORNER_OFFSETS = Object.freeze([
  0,
  SAMPLE_SIZE - 1,
  SAMPLE_SIZE * (SAMPLE_SIZE - 1),
  SAMPLE_SIZE * SAMPLE_SIZE - 1,
]);

/**
 * Tell a room photograph from a product cutout on white by its corners. A cutout keeps at least
 * three near-white corners; a room scene does not.
 * @param {HTMLImageElement} photograph A decoded, same-origin image.
 */
export function isRoomPhotograph(photograph) {
  const cacheKey = photograph.currentSrc || photograph.src;
  if (cacheKey && roomKindBySource.has(cacheKey)) {
    return roomKindBySource.get(cacheKey);
  }
  if (!cacheKey || !isSameOriginSource(cacheKey, photograph.baseURI)) return false;
  const context = sharedSampleContext();
  if (!context) return false;
  let data;
  try {
    context.clearRect(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    context.drawImage(photograph, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
    ({ data } = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE));
  } catch (error) {
    if (error instanceof DOMException && error.name === "SecurityError") {
      sampleCanvas = null;
      sampleContext = null;
      return false;
    }
    throw error;
  }
  let coloredCorners = 0;
  for (const offset of CORNER_OFFSETS) {
    const index = offset * 4;
    const isWhite =
      data[index] >= WHITE_FLOOR && data[index + 1] >= WHITE_FLOOR && data[index + 2] >= WHITE_FLOOR;
    if (!isWhite) coloredCorners += 1;
  }
  const isRoom = coloredCorners >= 2;
  roomKindBySource.set(cacheKey, isRoom);
  return isRoom;
}
