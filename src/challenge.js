const fs = require("fs");
const path = require("path");

/**
 * Read JSON
 *
 * @param {string} fileName - The name of the file to be loaded.
 * @returns {Array} - The parsed JSON data.
 */
const readJSONFile = (fileName) => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "..", "data", fileName),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${fileName}: `, error);
    return [];
  }
};

/**
 * Writes data to a file.
 *
 * @param {string} data - The data to write.
 * @param {string} fileName - The name of the output file.
 * @param {function} callback - The callback to handle results.
 */
const writeToFile = (data, fileName, callback) => {
  try {
    fs.writeFileSync(path.join(__dirname, "..", "output", fileName), data);
    callback(null, "Output file has been generated successfully.");
  } catch (error) {
    callback(error, null);
  }
};

/**
 * Validates if a user is valid based on predefined rules.
 *
 * @param {Object} user - The user object.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const isValidUser = (user) => {
  return (
    user &&
    typeof user.last_name === "string" &&
    typeof user.active_status === "boolean"
  );
};

/**
 * Validates if a company is valid based on predefined rules.
 *
 * @param {Object} company - The company object.
 * @returns {boolean} - Returns true if valid, otherwise false.
 */
const isValidCompany = (company) => {
  return (
    company &&
    typeof company.id === "number" &&
    typeof company.name === "string"
  );
};

// Load users and companies data from JSON.
const users = readJSONFile("users.json");
const companies = readJSONFile("companies.json");

const validCompanies = companies
  .filter(isValidCompany)
  .sort((a, b) => a.id - b.id);
const validUsers = users
  .filter(isValidUser)
  .sort((a, b) => a.last_name.localeCompare(b.last_name));

let output = "";

validCompanies.forEach((company) => {
  let totalTopUps = 0;
  let usersEmailed = "";
  let usersNotEmailed = "";

  validUsers.forEach((user) => {
    if (user.company_id === company.id && user.active_status) {
      const prevTokens = user.tokens;
      const newTokenBalance = prevTokens + company.top_up;
      totalTopUps += company.top_up;

      const emailStatus = company.email_status && user.email_status;
      const userInfo = `\t\t${user.last_name}, ${user.first_name}, ${user.email}\n\t\t\  Previous Token Balance, ${prevTokens}\n\t\t  New Token Balance ${newTokenBalance}\n`;

      if (emailStatus) {
        usersEmailed += userInfo;
      } else {
        usersNotEmailed += userInfo;
      }
    }
  });

  if (totalTopUps === 0) {
    return;
  }

  output += `\n\tCompany Id: ${company.id}\n`;
  output += `\tCompany Name: ${company.name}\n`;
  output += `\tUsers Emailed:\n${usersEmailed}`;
  output += `\tUsers Not Emailed:\n${usersNotEmailed}`;
  output += `\t\tTotal amount of top ups for ${company.name}: ${totalTopUps}\n`;
});

// Write to output file.
writeToFile(output, "output.txt", (error, message) => {
  if (error) {
    console.error(`An error occurred: ${error}`);
  } else {
    console.log(message);
  }
});

module.exports = {
  readJSONFile,
  isValidUser,
  isValidCompany,
  writeToFile
};