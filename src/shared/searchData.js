
const ngrokURL = process.env.REACT_APP_NGROK_ADDRESS;
/**
 *
 * @param {string} terms
 * @param {string[]} categories
 * @param {number} count
 * @returns The files corresponding to the request
 */
const searchData = async (terms, categories, count) => {
  const url = ngrokURL + terms + "&" + `categories=[\"movie\"]&count=100`;

  console.log(ngrokURL);
  console.log("url", url);
 
  let options = {
    method: "GET",
    cache: "no-cache",
  };

  return fetch(url, options).then((response) => {
    console.log(response);
    return response;
  });
};

export default searchData;
