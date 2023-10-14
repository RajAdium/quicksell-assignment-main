// Function to set a value in localStorage
export function setLocalStorageItem(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error("Error setting localStorage item:", error);
    }
}

// Function to get a value from localStorage
export function getLocalStorageItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error getting localStorage item:", error);
        return null;
    }
}
