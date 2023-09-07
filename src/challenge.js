const fs = require("fs");

// Load and parse the JSON files with error handling
function loadAndParseJsonFile(filename) {
  try {
    return JSON.parse(
      fs.readFileSync(`${__dirname}/data/${filename}`, "utf-8")
    );
  } catch (error) {
    console.error(`Error reading or parsing ${__dirname}/data/${filename}:`, error);
    process.exit(1);
  }
}

// Format individual user's data
function formatUserData(user, company) {
  const previousTokenBalance = user.tokens;
  const newTokenBalance = previousTokenBalance + company.top_up;

  const updatedUserInfo = `
            ${user.last_name}, ${user.first_name}, ${user.email}
              Previous Token Balance, ${previousTokenBalance}
              New Token Balance ${newTokenBalance}`;

  return updatedUserInfo;
}

// Main logic to generate the output string
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

const companies = loadAndParseJsonFile("companies.json");
const users = loadAndParseJsonFile("users.json");

companies.sort((a, b) => a.id - b.id);
users.sort((a, b) => a.last_name.localeCompare(b.last_name));

const output = generateFormattedOutput(companies, users);
const outputPath = `${__dirname}/output/output.txt`;

try {
    fs.writeFileSync(outputPath, output);
    console.log(`Output saved successfully to ${outputPath}`);
  } catch (error) {
    console.error(`Error writing to ${outputPath}:`, error);
    process.exit(1);
  }
