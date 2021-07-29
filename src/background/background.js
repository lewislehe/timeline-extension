chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.create({ url: chrome.runtime.getURL("index.html") });
});

chrome.runtime.onMessage.addListener(({ email, name }, _, sendResponse) => {
  const fromDate = new Date("7/15/2021");
  const toDate = new Date();

  const fetchRequests = [];
  for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
    const [year, month, day] = [d.getFullYear(), d.getMonth(), d.getDate()];
    const url = `https://www.google.com/maps/timeline/kml?authuser=0&pb=!1m8!1m3!1i${year}!2i${month}!3i${day}!2m3!1i${year}!2i${month}!3i${day}`;
    const fetchRequest = fetch(url).then((res) => res.text());
    fetchRequests.push(fetchRequest);
  }

  Promise.all(fetchRequests)
    .then((data) => {
      return fetch("https://transitstudy.web.illinois.edu/timeline-server", {
        method: "POST",
        body: JSON.stringify({ data, email, name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    })
    .then((res) => res.text())
    .then((responseText) => sendResponse(responseText))
    .catch((err) => {
      throw err;
    });

  return true;
});
