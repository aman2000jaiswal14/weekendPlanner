var PORT = process.env.PORT || 5000;
const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    Math.round((orgVal.main.temp - 273.15) * 10) / 10
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    Math.round((orgVal.main.temp_min - 273.15) * 10) / 10
  );

  temperature = temperature.replace(
    "{%tempmax%}",
    Math.round((orgVal.main.temp_max - 273.15) * 10) / 10
  );

  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=gorakhpur&appid=ac379cb68989e5bafcae7d576f6470bd"
    )
      .on("data", (chunk) => {
        const objdata = JSON.parse(chunk);
        const arrData = [objdata];
        // console.log(arrData[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");
        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(5000, "127.0.0.1");
