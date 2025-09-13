import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/env";

export const fetchAllCompanies = async () => {
  try {
    let allCompanies = [];

    const response = await fetch(
      `${API_BASE_URL}/api/companies`,
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

export const fetchPublications = async (onPageFetched) => {
  try {
    // Fetch the first page (3 items for fast UI load)
    const firstResponse = await fetch(
      `${API_BASE_URL}/api/news?page=1&limit=10`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!firstResponse.ok) {
      throw new Error(
        `Network response was not ok: ${firstResponse.statusText}`
      );
    }

    const firstData = await firstResponse.json();
    let allPublications = firstData.publications.map((item) => ({
      ...item,
      id: item._id,
      company_name: item.company_name,
      logo: item.company_logo,
      company_type: item.company_type,
      publications: item.news,
      email: item.email,
      phone: item.phone,
      address: item.address || "",
      social_media: item.social_media,
    }));

    // Trigger callback with initial data
    if (onPageFetched) {
      onPageFetched(allPublications);
    }

    // Background task to fetch remaining pages
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

          if (!res.ok) {
            console.warn(
              `Failed to fetch page ${currentPage}: ${res.statusText}`
            );
            break;
          }

          const pageData = await res.json();
          const newPublications = pageData.publications.map((item) => ({
            ...item,
            id: item._id,
            company_name: item.company_name || "",
            logo: item.company_logo || "",
            company_type: item.company_type || "",
            publications: item.news || [],
            email: item.email || "",
            address: item.address || "",
            phone: item.phone,
            social_media: item.social_media,
          }));

          allPublications = [...allPublications, ...newPublications];
          console.log(
            `Fetched page ${currentPage}, total publications:`,
            allPublications.length
          );

          // Trigger callback with updated data
          if (onPageFetched) {
            onPageFetched(allPublications);
          }

          currentPage++;
        }
      } catch (bgError) {
        console.warn("Background load failed:", bgError.message);
      }
    })();

    return { ...firstData, publications: allPublications };
  } catch (error) {
    console.error("Error fetching publications:", error.message);
    throw error;
  }
};

export const fetchPromotions = async (onPageFetched) => {
  try {
    // Map API promotion to UI-friendly format
    const mapPromotion = (item) => {
      const currentDate = new Date();

      // Filter ads to include only those with validUntil >= currentDate
      const validAds = item.ads.filter((adItem) => {
        const adValidUntil = new Date(adItem.validUntil);
        return adValidUntil >= currentDate;
      });

      // Only return the company object if it has at least one valid ad
      if (validAds.length === 0) {
        return null;
      }

      return {
        id: item._id || "",
        company_name: item.company_name || "",
        logo: item.company_logo || "",
        company_type: item.company_type || "",
        email: item.email || "",
        phone: item.phone || [],
        address: item.address || "",
        social_media: item.social_media || [],
        promotions: validAds,
      };
    };

    // Step 1: Fetch the first page (10 items for fast load)
    const firstResponse = await fetch(
      `${API_BASE_URL}/api/ads?page=1&limit=10`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!firstResponse.ok) {
      throw new Error(
        `Network response was not ok: ${firstResponse.statusText}`
      );
    }

    const firstData = await firstResponse.json();

    // Validate response
    if (!firstData.promotions || !Array.isArray(firstData.promotions)) {
      throw new Error("Invalid API response: promotions is not an array");
    }

    let currentAds = firstData.promotions
      .map(mapPromotion)
      .filter((item) => item !== null); // Remove companies with no valid ads

    // Trigger callback with initial data
    if (onPageFetched) {
      onPageFetched(currentAds);
    }

    // Step 2: Fetch remaining pages in background
    (async () => {
      try {
        let currentPage = 2;
        const totalPages = Number(firstData.totalPages) || 1;

        while (currentPage <= totalPages) {
          const res = await fetch(
            `${API_BASE_URL}/api/ads?page=${currentPage}&limit=10`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          if (!res.ok) {
            console.warn(
              `Failed to fetch page ${currentPage}: ${res.statusText}`
            );
            break;
          }

          const pageData = await res.json();

          if (!pageData.promotions || !Array.isArray(pageData.promotions)) {
            console.warn(
              `Invalid API response for page ${currentPage}: promotions is not an array`
            );
            break;
          }

          const newPromotions = pageData.promotions
            .map(mapPromotion)
            .filter((item) => item !== null); // Remove companies with no valid ads

          currentAds = [...currentAds, ...newPromotions];

          // Trigger callback with updated data
          if (onPageFetched) {
            onPageFetched(currentAds);
          }

          currentPage++;
        }
      } catch (bgError) {
        console.warn("Background load failed:", bgError.message);
      }
    })();

    return { ...firstData, promotions: currentAds };
  } catch (error) {
    console.error("Error fetching promotions:", error.message);
    throw error;
  }
};

export const fetchCompanyAds = async (companyId) => {
  try {
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }
    const response = await fetch(
      `${API_BASE_URL}/api/companyAds?companyId=${companyId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch promotions OR company has no recent ads");
    }
    const fetchedPromotions = await response.json();

    return fetchedPromotions;
  } catch (err) {
    console.error('Error fetching promotions:', err);
    // throw new Error(err.message)
  }
}

export const fetchCompanyNews = async (companyId) => {
  try {
    if (!companyId) {
      return res.status(400).json({ message: "Company ID is required" });
    }

    const response = await fetch(
      `${API_BASE_URL}/api/companyNews?companyId=${companyId}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch publications");
    }

    const fetchedPublications = await response.json();

    return fetchedPublications;
  } catch (err) {
    console.error('Error fetching publications:', err);
    // throw new Error(err.message)
  }
};

export const fetchNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const notifications = await response.json();
    return notifications;
  } catch (err) {
    console.error('Error fetching notifications:', err);
    throw new Error(err.message);
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
