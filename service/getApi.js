import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/env";

export const fetchAllCompanies = async () => {
  try {
    let page = 1;
    const limit = 20; // how many companies per request
    let allCompanies = [];
    let totalPages = 1;

    // Keep fetching until we’ve got all pages
    do {
      const response = await fetch(
        `${API_BASE_URL}/api/companies?page=${page}&limit=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json();

      // Only take paid companies
      const paidCompanies = data.companies.filter((c) => c.paid === true);
      allCompanies = [...allCompanies, ...paidCompanies];

      totalPages = data.totalPages;
      page++;
    } while (page <= totalPages);

    // Save all companies to AsyncStorage
    await AsyncStorage.setItem("companiesList", JSON.stringify(allCompanies));

    const timestamp = new Date().toISOString();
    await AsyncStorage.setItem("companies_timestamp", timestamp);

    return allCompanies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
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

export const fetchPromotions = async () => {
  try {
    let adverts = [];

    const response = await fetch(`${API_BASE_URL}/api/ads`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    console.log(data.promotions)

    // Filter promotions where validUntil is greater than or equal to current date
    const currentAds = data.promotions.filter((c) => {
      const validUntilDate = new Date(c.validUntil);
      return validUntilDate >= new Date();
    });

    adverts = [...currentAds];

    return adverts;
  } catch (error) {
    console.error("Error fetching promotions:", error.message);
  }
}

export const fetchPublications = async () => {
  try {
    // Fetch the first 3 (fast load for UI)
    const firstResponse = await fetch(
      `${API_BASE_URL}/api/news?page=1&limit=3`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!firstResponse.ok) {
      throw new Error("Network response was not ok " + firstResponse.statusText);
    }

    const firstData = await firstResponse.json();
    let allPublications = [...firstData.publications];
    // console.log(allPublications)

    // Background task: fetch the rest
    (async () => {
      try {
        let currentPage = 2;
        const totalPages = firstData.totalPages;

        while (currentPage <= totalPages) {
          const res = await fetch(
            `${API_BASE_URL}/api/news?page=${currentPage}&limit=10`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!res.ok) break;

          const pageData = await res.json();
          allPublications = [...allPublications, ...pageData.publications];

          currentPage++;
        }

      } catch (bgError) {
        console.warn("Background load failed:", bgError.message);
      }
    })();

    // Return the first 3 immediately
    return { ...firstData, publications: allPublications }
  } catch (error) {
    console.error("Error fetching publications:", error.message);
    return [];
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
