const ngrokURL = process.env.REACT_APP_NGROK_ADDRESS;
/**
 *
 * @param {string} terms
 * @param {string[]} categories
 * @param {number} count
 * @returns The files corresponding to the request
 */
const searchData = async (terms, categories, count) => {
  const url = ngrokURL + "search?terms=" + terms + "&" + `categories=[\"movie\"]&count=100`;

  console.log(ngrokURL);
  console.log("url", url);

  let options = {
    method: "GET",
    cache: "no-cache",
    mode: "cors",
    headers: {
      "ngrok-skip-browser-warning": "true",
    },
  };

  let data = fetch(url, options).then(async (response) => {
    //console.log(await response.json());
    return response.json();
  });
  console.log(await data)
  return data;
};

export default searchData;