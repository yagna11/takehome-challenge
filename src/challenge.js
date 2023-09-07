const fs = require("fs");

// Constants
const dataPath= `${__dirname}/data/`;
const outputPath = `${__dirname}/output/output.txt`;

/**
 * Loads and parses a JSON file from the data directory.
 * 
 * @param {string} filename - The name of the file to be loaded.
 * @returns {Array} - The parsed JSON data.
 * @throws Will throw an error if reading or parsing fails.
 */

function loadAndParseJsonFile(filename) {
    try {
        return JSON.parse(fs.readFileSync(`${dataPath}${filename}`, "utf-8"));
    } catch (error) {
        console.error(`Error reading or parsing ${dataPath}${filename}:`, error);
        process.exit(1);
    }
}

/**
 * Formats individual user's data with top-up calculation.
 * 
 * @param {Object} user - The user object.
 * @param {Object} company - The company object.
 * @returns {string} - The formatted user information.
 */

function formatUserData(user, company) {
  const previousTokenBalance = user.tokens;
  const newTokenBalance = previousTokenBalance + company.top_up;

  const updatedUserInfo = `
            ${user.last_name}, ${user.first_name}, ${user.email}
              Previous Token Balance, ${previousTokenBalance}
              New Token Balance ${newTokenBalance}`;

  return updatedUserInfo;
}

/**
 * Generates the output string based on companies and users data.
 * 
 * @param {Array} companies - List of company objects.
 * @param {Array} users - List of user objects.
 * @returns {string} - The formatted output string.
 */

function generateFormattedOutput(companies, users) {
  let output = "";

  for (const company of companies) {
    let totalCompanyTopup = 0;
    let emailedUsers = [];
    let notEmailedUsers = [];

    const activeCompanyUsers = users.filter(
      (u) => u.company_id === company.id && u.active_status
    );
    if (!activeCompanyUsers.length) continue;  // Skiping companies with no active users

    for (const user of activeCompanyUsers) {
      const userInfo = formatUserData(user, company);
      totalCompanyTopup += company.top_up;

      if (user.email_status && company.email_status) {
        emailedUsers.push(userInfo);
      } else {
        notEmailedUsers.push(userInfo);
      }
    }

    output += `
    Company Id: ${company.id}
    Company Name: ${company.name}
    Users Emailed:${emailedUsers.join("")}
    Users Not Emailed:${notEmailedUsers.join("")}
            Total amount of top ups for ${company.name}: ${totalCompanyTopup}
            `;
  }

  return output;
}

function generateOutputFile() {
    const companies = loadAndParseJsonFile("companies.json");
    const users = loadAndParseJsonFile("users.json");

    companies.sort((a, b) => a.id - b.id);
    users.sort((a, b) => a.last_name.localeCompare(b.last_name));

    const output = generateFormattedOutput(companies, users);

    try {
        fs.writeFileSync(outputPath, output);
        console.log(`Output saved successfully to ${outputPath}`);
    } catch (error) {
        console.error(`Error writing to ${outputPath}:`, error);
        process.exit(1);
    }
}

generateOutputFile();


