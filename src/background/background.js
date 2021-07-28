chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener((email, _, sendResponse) => {
  fetchData()
    .then((data) => ({
      data,
      email,
    }))
    .then((d) => {
      return fetch("https://transitstudy.web.illinois.edu/timeline-server", {
        method: "POST",
        body: JSON.stringify(d),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.text())
        .catch((err) => {
          throw err;
        });
    })
    .then(sendResponse);

  return true;
});

function fetchData() {
  const fromDate = new Date("7/15/2021");
  const toDate = new Date();

  const urls = [];
  for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
    const [year, month, day] = [d.getFullYear(), d.getMonth(), d.getDate()];
    const url = `https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${year}!2i${month}!3i${day}!2m3!1i${year}!2i${month}!3i${day}`;
    urls.push(url);
  }

  return Promise.all(urls.map((url) => fetch(url).then((resp) => resp.text())));
}
