const fs = require("fs");
const path = require("path");
const {
    readJSONFile,
    writeToFile,
    isValidUser,
    isValidCompany,
} = require("../src/challenge");
const { users, companies } = require("./mocks/challengeMockData.json");

jest.mock('fs');

describe('test readJSONFile', () => {
  beforeEach(() => {
    fs.readFileSync.mockReturnValue(JSON.stringify({ users, companies }));
  });

  it('correctly reads and parses mock JSON file', () => {
    const result = readJSONFile('mockfile.json');
    expect(result).toEqual({ users, companies });
  });

  it('should return an empty array if JSON is not parseable', () => {
    fs.readFileSync.mockReturnValue("non-json data");
    const result = readJSONFile('invalid.json');
    expect(result).toEqual([]);
  });
});

describe('test isValidUser', () => {
  it('should validate a correct user', () => {
    const user = users[0]; 
    expect(isValidUser(user)).toBe(true);
  });

  it('should return false for a user missing last_name', () => {
    const user = { ...users[0], last_name: undefined };
    expect(isValidUser(user)).toBe(false);
  });

  it('should return false for a user with non-boolean active_status', () => {
    const user = { ...users[0], active_status: "true" };
    expect(isValidUser(user)).toBe(false);
  });
});

describe('test isValidCompany', () => {
  it('should validate a correct company', () => {
    const company = companies[0]; 
    expect(isValidCompany(company)).toBe(true);
  });

  it('should return false for a company missing name', () => {
    const company = { ...companies[0], name: undefined };
    expect(isValidCompany(company)).toBe(false);
  });

  it('should return false for a company with non-numeric id', () => {
    const company = { ...companies[0], id: "1" };
    expect(isValidCompany(company)).toBe(false);
  });
});

describe('writeToFile', () => {
    it('should call the callback with a success message on successful write', done => {
      const mockCallback = (error, message) => {
        expect(error).toBe(null);
        expect(message).toBe("Output file has been generated successfully.");
        done();
      };
  
      fs.writeFileSync.mockReturnValue(true);  
      writeToFile("test data", "testfile.txt", mockCallback);
    });
  
    it('should call the callback with an error message on failed write', done => {
      const mockError = new Error("Failed to write");
      const mockCallback = (error, message) => {
        expect(error).toBe(mockError);
        expect(message).toBe(null);
        done();
      };
  
      fs.writeFileSync.mockImplementation(() => { throw mockError; });
      writeToFile("test data", "testfile.txt", mockCallback);
    });
  });