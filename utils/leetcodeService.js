const axios = require("axios");

const extractLeetCodeUsername = (leetcodeUrl) => {
  if (!leetcodeUrl) return "";

  let input = leetcodeUrl.trim();

  input = input.replace("https://", "");
  input = input.replace("http://", "");
  input = input.replace("www.", "");
  input = input.replace("leetcode.com/", "");
  input = input.replace("u/", "");
  input = input.replace("profile/", "");

  input = input.split("?")[0];
  input = input.split("#")[0];
  input = input.split("/")[0];

  return input.trim();
};

const fetchLeetCodeStats = async (username) => {
  if (!username) {
    return {
      success: false,
      message: "LeetCode username missing",
    };
  }

  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        submitStats: submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://leetcode.com/graphql",
      {
        query,
        variables: {
          username,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          Referer: "https://leetcode.com",
        },
        timeout: 12000,
      }
    );

    const matchedUser = response.data?.data?.matchedUser;

    if (!matchedUser) {
      return {
        success: false,
        message: "LeetCode user not found",
      };
    }

    const stats =
      matchedUser.submitStats?.acSubmissionNum || [];

    const getCount = (difficulty) => {
      const item = stats.find(
        (s) => s.difficulty === difficulty
      );

      return item?.count || 0;
    };

    return {
      success: true,
      username: matchedUser.username,
      totalSolved: getCount("All"),
      easySolved: getCount("Easy"),
      mediumSolved: getCount("Medium"),
      hardSolved: getCount("Hard"),
    };
  } catch (error) {
    return {
      success: false,
      message:
        error?.response?.data?.errors?.[0]?.message ||
        error.message ||
        "Failed to fetch LeetCode stats",
    };
  }
};

module.exports = {
  extractLeetCodeUsername,
  fetchLeetCodeStats,
};