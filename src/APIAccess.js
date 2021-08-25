/**
 *
 * @param {*} array to be sliced
 * @param {*} chunkSize size of the slices
 * @returns array of arrays each with size=chunkSize (last chunk will be arr.size % chunkSize)
 */
function sliceIntoChunks(array, chunkSize) {
  const res = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

/**
 * retrieve price data for requested item ids from the api
 * @param {number[]} ids the items requested
 * @returns Promise of array with requested prices' data
 */
async function fetchPrices(ids) {
  return fetchMany(ids, "commerce/prices");
}

/**
 * retrieve item data for requested item ids from the api
 * @param {number[]} ids the items requested
 * @returns Promise of array with requested items' data
 */
async function fetchItems(ids) {
  return fetchMany(ids, "items");
}

/**
 * wrapper for fetchStuff: removes duplicates and merges return into a single array
 * @param {number[]} ids the objects requested
 * @param {string} endpoint api endpoint to request from: (e.g. items, commerce/prices)
 * @returns Promise of array with requested objects' data
 */
async function fetchMany(ids, endpoint) {
  // const set = new Set(ids);
  // const cleaned = [...set];
  var arr = await fetchStuff([...new Set(ids)], endpoint);
  arr = arr.flat();
  return arr;
}

/**
 * Retrieves data from specified api endpoint (result separated in groups of <200 due to api limitations)
 * @param {number[]} ids
 * @param {string} endpoint type of request (e.g. items, tp)
 * @returns array of promised arrays with requested objects' data
 */
async function fetchStuff(ids, endpoint) {
  const chunks = sliceIntoChunks(ids, 200); //api accepts max number of 200 ids at a time
  var datas = [];
  for (var i = 0; i < chunks.length; i++) {
    console.log("i did a fetch from: " + endpoint);
    const response = await fetch(
      "https://api.guildwars2.com/v2/" + endpoint + "?ids=" + chunks[i]
    );
    const data = await response.json();
    datas.push(data);
  }
  console.log("objects:", datas);
  return datas;
}

export { fetchItems, fetchPrices };
