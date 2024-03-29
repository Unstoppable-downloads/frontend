const ngrokURL = process.env.REACT_APP_NGROK_ADDRESS;

/**
 *
 * @param {string} terms
 * @param {string[]} category
 * @param {number} count
 * @returns The files corresponding to the request
 */
const fetchSearchData = async(terms, categories, count) => {
    const url =
        ngrokURL +
        "search?terms=" +
        terms +
        "&" +
        `categories=[${categories}]&count=100`;

    console.log(ngrokURL);
    console.log("Fetching search url", url);

    let options = {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    };

    let data = fetch(url, options).then(async(response) => {
        //console.log(await response.json());
        return response.json();
    });
    console.log(await data);
    return data;
};

/**
 *
 * @returns The 10 most recent files
 */
const fetchRecentData = async () => {
    const url = ngrokURL + "recent?count=10";
    console.log("Fetching recent url", url);

    let options = {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    };

    let data = fetch(url, options).then(async(response) => {
        //console.log(await response.json());
        return response.json();
    });
    console.log(await data);
    return data;
};

const fetchSearchOne = async (terms, uid) => {
    const url = ngrokURL + "searchOne?count=100&uid=" + uid + "&terms=" + terms;

    console.log(ngrokURL);
    console.log("Fetching search url", url);

    let options = {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    };

    let data = fetch(url, options).then(async(response) => {
        //console.log(await response.json());
        return response.json();
    });
    console.log(await data);
    return data;
};

const fetchIMDBResult = async (terms) => {
    const url = ngrokURL + "fetchImdb?terms=" + terms

    console.log("Fetching search url", url);

    let options = {
        method: "GET",
        cache: "no-cache",
        mode: "cors",
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    };

    let data = fetch(url, options).then(async(response) => {
        //console.log(await response.json());
        return response.json();
    });
    console.log(await data);
    return data;
}

export { fetchSearchData, fetchRecentData, fetchSearchOne, fetchIMDBResult };