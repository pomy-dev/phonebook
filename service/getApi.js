import AsyncStorage from "@react-native-async-storage/async-storage";
import API_BASE_URL from "../config/env";

export const fetchAllCompanies = async () => {
  try {
    await AsyncStorage.removeItem("companiesList");

    const response = await fetch(`${API_BASE_URL}/api/companies`, {
      method: "GET", // HTTP method
      headers: {
        "Content-Type": "application/json", // Set content type to JSON
      },
    });

    // Check if the response is okay (status code 200-299)
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json(); // Parse JSON response

    // Filter to only include companies where paid is true
    const paidCompanies = data.companies.filter(
      (company) => company.paid === true
    );

  
    await AsyncStorage.setItem("companiesList", JSON.stringify(paidCompanies));

    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem("companies_timestamp", timestamp);

    // Return only the paid companies
    return paidCompanies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error; // Propagate the error for further handling
  }
};

export const fetchAllCompaniesOffline = async () => {
  try {
    const storedCompanies = await AsyncStorage.getItem("companiesList");
    const companyData = storedCompanies ? JSON.parse(storedCompanies) : [];


    return companyData;
  } catch (error) {
    console.error("Error retrieving companies from AsyncStorage:", error);
    return [];
  }
};

export const fetchCompaniesWithAge = async () => {
  try {
    const storedCompanies = await AsyncStorage.getItem("companies");
    const storedTimestamp = await AsyncStorage.getItem("companies_timestamp");

    if (storedCompanies && storedTimestamp) {
      const companies = JSON.parse(storedCompanies);
      const storedDate = new Date(storedTimestamp);
      const now = new Date();
      const diffInMilliseconds = now - storedDate;
      const diffInHours = diffInMilliseconds / (1000 * 60 * 60);

      console.log(`Data is ${diffInHours.toFixed(2)} hours old.`);
      return { companies, ageInHours: diffInHours };
    } else {
      return { companies: [], ageInHours: null };
    }
  } catch (error) {
    console.error("Error fetching companies from AsyncStorage:", error);
    return { companies: [], ageInHours: null };
  }
};

// Helper function to load offline data
export const loadOfflineData = async () => {
  try {
    const data = await fetchAllCompaniesOffline();
    const companyData = data ? JSON.parse(data) : [];

    return companyData;
  } catch (err) {
    console.log("Offline Data Error:", err.message);
  }
};
