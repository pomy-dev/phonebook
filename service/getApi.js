import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/env";

export const fetchAllCompanies = async () => {
  try {
    let page = 1;
    const limit = 30; // how many companies per request
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
      throw new Error("Failed to fetch promotions");
    }
    const fetchedPromotions = await response.json();

    return fetchedPromotions;
  } catch (err) {
    console.error("Error fetching promotions:", err);
    throw new Error(err.message);
  }
};

//fetching notifications
//helper function to format the notification data:

const originalData =
 [{"_id": "68bc0c7ea5870ae7b268ca59", "category": "information", "company": {"company_name": "RSTP", "company_type": "Government", "logo": "https://www.iasp.ws/media/imagegenerator/290x290/upscale(false)/canvascolor(0xffffffff)/RSTP_Logo-01_8.png"}, "duration": {"unit": "days", "value": 14}, "endDate": "2025-09-20T10:25:00.000Z", "message": "The Royal Science and Technology Park headquarters have been moved from Nokwana to Mphisifam, this followed the ongoing deliberations in parliament particularly concerning the ICT ministry under Savanna Mavuso. So far the minister has found it proper to come forth to make this statement publicly that the RSTP offices will have to relocate to Mphisifam.", "startDate": "2025-09-06T10:25:00.000Z", "targetAudience": "all", "title": "RSTP Offices Relocated"}, {"_id": "68bc11e1866aef4b652d4879", "category": "announcement", "company": {"company_name": "Nedbank", "company_type": "Financial", "logo": "data:image/png;base64,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"}, "duration": {"unit": "weeks", "value": 5}, "endDate": "2025-10-19T10:46:00.000Z", "message": "new atm is now opened in Manzini near Build-it ,  you now deposit and withdraw from the atm", "startDate": "2025-09-14T10:46:00.000Z", "targetAudience": "all", "title": "New Nedbank ATM"}, {"_id": "68bc13c5866aef4b652d4884", "category": "information", "company": {"company_name": "MTN", "company_type": "Telecommunication", "logo": "https://cdn.brandfetch.io/mtn.co.sz/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed"}, "duration": {"unit": "days", "value": 24}, "endDate": "2025-09-30T14:57:00.000Z", "message": "The current month the will deals of 50% of for everything the under the Marco branding ,hurry and get your self Macro ,s while stock last", "startDate": "2025-09-06T14:57:00.000Z", "targetAudience": "all", "title": "New Moja Deals"}, {"_id": "68bc14ce866aef4b652d488e", "category": "warning", "company": {"company_name": "Eswatini Police", "company_type": "Emergency", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzjUdgB3vcDkKZDCYQfzLtmcYc9zOJDMwZ6A&s"}, "duration": {"unit": "hours", "value": 24}, "endDate": "2025-09-15T10:58:00.000Z", "message": "Nine bekunene besicela kusti nikhuteke  ngoba, sekuhambe kwatfolakala kusti kuneli bandla leli kwabanisa tinstambo telitfusi ,sitsi kuwe wena weku nene lokulo noma lobalekelelako ,naloke lilahle kuwe", "startDate": "2025-09-14T10:58:00.000Z", "targetAudience": "all", "title": "Warnig to Public"}, {"_id": "68bc1670866aef4b652d4893", "category": "announcement", "company": {"company_name": "africa chicks", "company_type": "Agriculture", "logo": "https://media.licdn.com/dms/image/v2/C4D0BAQEZKtZ9Mst_LQ/company-logo_200_200/company-logo_200_200/0/1631329816790?e=2147483647&v=beta&t=4zbsIqHZvav8oXGTM2Ksly3ffi-OJukkCxSMyuw1agI"}, "duration": {"unit": "days", "value": 6}, "endDate": "2025-09-12T11:14:00.000Z", "message": "Don't import chickens from South Africa because Critics argue that chlorine washing may mask poor hygiene practices in poultry production and processing. They advocate for improved animal husbandry and processing standards instead", "startDate": "2025-09-06T11:14:00.000Z", "targetAudience": "all", "title": "Warnig to Public"}, {"_id": "68bc172e866aef4b652d4898", "category": "announcement", "company": {"company_name": "Eswatini Sugar Association", "company_type": "Agriculture", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0087uRpwizooludITCIauFV_ScOd_JCpHZA&s"}, "duration": {"unit": "days", "value": 24}, "endDate": "2025-10-29T11:10:00.000Z", "message": "There would be a price hike in sugar", "startDate": "2025-10-05T11:10:00.000Z", "targetAudience": "all", "title": "Price hike"}, {"_id": "68bc195debb8adeb4c027480", "category": "announcement", "company": {"company_name": "MTN", "company_type": "Telecommunication", "logo": "https://cdn.brandfetch.io/mtn.co.sz/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed"}, "duration": {"unit": "days", "value": 14}, "endDate": "2025-09-21T11:21:00.000Z", "message": "MTN has ventured into a network broadcast that would be counterpart with 5G. This has been briefed by CEO Mr Dlamini on Friday in the Hilton Garden.", "startDate": "2025-09-07T11:21:00.000Z", "targetAudience": "all", "title": "MTN to introduce a network!"}, {"_id": "68bc1a67ebb8adeb4c02748c", "category": "information", "company": {"company_name": "Nedbank", "company_type": "Financial", "logo": "data:image/png;base64,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"}, "duration": {"unit": "days", "value": 7}, "endDate": "2025-09-14T11:26:00.000Z", "message": "Nedbank has new CEO, Mrs Neli Nkosi who holds a doctorate in accounting and economics. Mr Khumalo who had been an acting CEO from July 2024 says he is happy with the coming of Mrs Nkosi and he believes things will be much better now.", "startDate": "2025-09-07T11:26:00.000Z", "targetAudience": "all", "title": "New CEO for NedBank"}, {"_id": "68bc1c8f866aef4b652d48a6", "category": "announcement", "company": {"company_name": "MVA", "company_type": "Insurance", "logo": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSA3FTi68Y9OmxqcHW-VN99A-Mp3Uq_JgwkoQ&s"}, "duration": {"unit": "months", "value": 2}, "endDate": "2025-11-25T11:31:00.000Z", "message": "You can now make a claim  using MTN mobile money", "startDate": "2025-09-25T11:31:00.000Z", "targetAudience": "all", "title": "Claim Available"}, {"_id": "68bc1d62866aef4b652d48b1", "category": "alert", "company": {"company_name": "MTN", "company_type": "Telecommunication", "logo": "https://cdn.brandfetch.io/mtn.co.sz/fallback/lettermark/theme/dark/h/256/w/256/icon?c=1bfwsmEH20zzEfSNTed"}, "duration": {"unit": "days", "value": 24}, "endDate": "2025-10-04T11:36:00.000Z", "message": "Make sure that you protect your self by keeping your information safe when registering because the is a rise in identity theft", "startDate": "2025-09-10T11:36:00.000Z", "targetAudience": "all", "title": "Vela Registration"}]




const formatNotifications = (data) => {
  return data.map((item) => ({
    _id: item._id,
    company_name: item.company.company_name,
    company_type: item.company.company_type,
    subscription_type: "Gold", // Default value, can be adjusted as needed
    logo: item.company.logo,
    address: "Default Address, Eswatini", // Placeholder for address
  }));
};

export const fetchAllNotifications = async (companyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notifications`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch promotions22");
    }
    const fetchedNotifications = await response.json();

    console.log("===================================");
    console.log("===================================");
    const formattedNotifications = formatNotifications(fetchedNotifications);
    console.log(formattedNotifications);

    return fetchedNotifications;
  } catch (err) {
    console.error("Error fetching notifications:", err.message);
    throw new Error(err.message);
  }
};

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
    console.error("Error fetching publications:", err);
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
