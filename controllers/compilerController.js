const axios = require("axios");

const languageMap = {
  javascript: 63,
  java: 62,
  cpp: 54,
  python: 71,
};

const runCode = async (req, res) => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      return res.status(400).json({
        message: "Code and language are required",
      });
    }

    const language_id = languageMap[language];

    if (!language_id) {
      return res.status(400).json({
        message: "Unsupported language",
      });
    }

    const response = await axios.post(
      "https://judge0-ce.p.rapidapi.com/submissions",
      {
        source_code: code,
        language_id,
        stdin: input || "",
      },
      {
        params: {
          base64_encoded: "false",
          wait: "true",
        },
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": process.env.JUDGE0_API_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    res.status(200).json({
      output:
        response.data.stdout ||
        response.data.stderr ||
        response.data.compile_output ||
        response.data.message ||
        "No output",
      status: response.data.status,
    });

  } catch (error) {
    res.status(500).json({
      message: "Code execution failed",
      error: error.response?.data || error.message,
    });
  }
};

module.exports = {
  runCode,
};