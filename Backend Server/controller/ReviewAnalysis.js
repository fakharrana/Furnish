const pythonShell = require("python-shell"); //To run python scripts

//Analyze Reviews
module.exports.analyzeReviews = function (req, res) {
  let options = {
    mode: "text",
    pythonOptions: ["-u"], //print results in real-time
    scriptPath: "./python/scripts",
    // scriptPath:"C:/Project/Furnish-Web-App/Server/python/scripts/",
  };

  pythonShell.PythonShell.run(
    "reviewAnalysis.py",
    options,
    function (err, response) {
      if (err) {
        return res.json({ Error: "Unable to Analyze Reviews" });
      } else {
        return res.json({ Success: response.toString() });
      }
    }
  );
};
