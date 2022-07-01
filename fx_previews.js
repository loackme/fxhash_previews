const puppeteer = require('puppeteer')
const fs = require('fs');

(async () => {
  let N = 3   // number of previews
  let w = 2000, h = 2000  // width and height of instance
  let url = "http://localhost/your_project"  //project url
  let saving_folder = "your_project"  //saving folder
  let timeout_preview = 15  // timeout for preview if custom event is not triggered

  if (!fs.existsSync(saving_folder)){
      fs.mkdirSync(saving_folder);
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width:w, height: h});
  await page.goto(url);

  // Custom event detection based on https://stackoverflow.com/a/65534026
  // For 'preview' event detection, add this custom event to your project
  //    const previewEvent = new Event('preview')
  // and fire it when you want the preview taken

    /**
   * Wait for the browser to fire an event (including custom events)
   * @param {string} eventName - Event name
   * @param {integer} seconds - number of seconds to wait.
   * @returns {Promise} resolves when event fires or timeout is reached
   */
  async function waitForEvent(eventName, seconds) {

      seconds = seconds || 30;

      // use race to implement a timeout
      return Promise.race([

          // add event listener and wait for event to fire before returning
          page.evaluate(function(eventName) {
              return new Promise(function(resolve, reject) {
                  document.addEventListener(eventName, function(e) {
                      resolve(); // resolves when the event fires
                  });
              });
          }, eventName),

          // if the event does not fire within n seconds, exit
          page.waitForTimeout(seconds * 1000)
      ]);
  }

  for (let n = 0; n < N; n++){
    const fxhash = await page.evaluate( () => {
        return  fxhash;
    });
    await waitForEvent('preview', timeout_preview)
    console.log(`Preview ${n}`)
    await page.screenshot({ path: `${saving_folder}/${fxhash}.png` })
    await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  }

  await browser.close()
})()
