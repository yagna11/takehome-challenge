# Code Challenge Solution
This project is a solution to a code challenge outlined in challenge.txt.

## Overview
You are provided with two JSON files: one representing users and another representing companies. The code processes these files and produces a formatted output.txt file as per the defined criteria.

Challenge Instructions:
For detailed challenge instructions, please refer to the challenge.txt file in the root directory.

## File structure: 
```bash
TAKEHOME/
│
├── src/
│   ├── data/
│   │   ├── companies.json   
            # Contains company data
│   │   └── users.json              
            # Contains user data
│   │
│   ├── output/
│   │   ├── example_output.txt  
            # Provided example of expected output
│   │   └── output.txt         
            # Generated output from the challenge.js script
│   │
│   └── challenge.js            
        # The main script to process data and generate the output.txt
│
├── challenge.txt               
    # Contains the challenge instructions
└── README.md                   
    # This documentation
```

## Instructions to run it on your system - 
1. Clone this repo
2. Ensure you have Node.js installed.
3. Navigate to the root directory (takehome)
4. Run the script using the command:
    ```bash
    node src/challenge.js
    ```
5. Once executed, the output.txt inside the output folder will be updated with the processed data

## Implementation:
The challenge.js script processes the company and user data stored in the data folder. Based on defined criteria, it calculates the token top-ups for active users and generates an output indicating which users were potentially emailed about the top-up. The final result is written to the output.txt file in the output directory.

