/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date
 * @property {string} location
 * @property {string} industry
 * @property {string} company
 * @property {number} attendees
 * @property {number} maxAttendees
 * @property {'conference'|'workshop'|'networking'|'seminar'} type
 */

/**
 * @typedef {Object} Vacancy
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {string} salary
 * @property {string} description
 * @property {string[]} requirements
 * @property {string} industry
 * @property {'full-time'|'part-time'|'contract'|'internship'} type
 * @property {string} postedDate
 * @property {string} deadline
 * @property {number} applicants
 */

/**
 * @typedef {Object} Tender
 * @property {string} id
 * @property {string} title
 * @property {string} company
 * @property {string} description
 * @property {string} budget
 * @property {string} deadline
 * @property {string} industry
 * @property {string[]} requirements
 * @property {string} location
 * @property {string} postedDate
 * @property {'open'|'closing-soon'|'closed'} status
 * @property {number} bidders
 */

/**
 * @typedef {Object} Profile
 * @property {string} id
 * @property {string} name
 * @property {string} title
 * @property {string} company
 * @property {string} location
 * @property {string} industry
 * @property {string} experience
 * @property {string[]} skills
 * @property {string[]} achievements
 * @property {string} education
 * @property {string} linkedinUrl
 * @property {string} avatar
 * @property {boolean} isAvailableForWork
 */