function normalObject(obj: any): any {
	if (typeof obj !== "object" || obj === null) {
		return obj;
	}

	if (Array.isArray(obj)) {
		return obj.map(normalObject);
	}

	const sortedObj: any = {};
	Object.keys(obj)
		.sort()
		.forEach(key => {
			sortedObj[key] = normalObject(obj[key]);
		});
	return sortedObj;
}

export function normalizeObject(
	obj: Record<string | number, any>,
	stringify = false,
) {
	if (stringify) {
		return JSON.stringify(normalObject(obj));
	} else {
		return normalObject(obj) as Record<string | number, any>;
	}
}

export function normalizeAndCapitalize(
	inputStr: string,
	allCapital = false,
): string {
	// Replace multiple white spaces with a single space
	const singleSpaceStr = inputStr.replace(/\s+/g, " ").trim();

	if (allCapital) {
		return singleSpaceStr.toUpperCase();
	}

	// Convert the string to lowercase
	const lowerStr = singleSpaceStr.toLowerCase();

	// Capitalize the first letter of each word
	const words = lowerStr.split(" ");
	const capitalizedWords = words.map(
		word => word.charAt(0).toUpperCase() + word.slice(1),
	);

	// Join the words back together to form the final string
	const capitalizedStr = capitalizedWords.join(" ");

	return capitalizedStr;
}

export function deepCompare(obj1: any, obj2: any) {
	// Check for strict equality first
	if (obj1 === obj2) {
		return true;
	}

	// If one is null/undefined and the other isn't, they're not equal
	if (obj1 == null || obj2 == null) {
		return false;
	}

	// If their types differ, they're not equal
	if (typeof obj1 !== typeof obj2) {
		return false;
	}

	// If they're both Date objects, compare their time values
	if (obj1 instanceof Date && obj2 instanceof Date) {
		return obj1.getTime() === obj2.getTime();
	}

	// If they're both arrays, compare their lengths and elements
	if (Array.isArray(obj1) && Array.isArray(obj2)) {
		if (obj1.length !== obj2.length) {
			return false;
		}

		for (let i = 0; i < obj1.length; i++) {
			if (!deepCompare(obj1[i], obj2[i])) {
				return false;
			}
		}

		return true;
	}

	// If they're both objects, compare their keys and values
	if (typeof obj1 === "object" && typeof obj2 === "object") {
		const keys1 = Object.keys(obj1);
		const keys2 = Object.keys(obj2);

		if (keys1.length !== keys2.length) {
			return false;
		}

		for (const key of keys1) {
			if (!keys2.includes(key) || !deepCompare(obj1[key], obj2[key])) {
				return false;
			}
		}

		return true;
	}

	// If they're primitive types or anything else, use strict equality
	return false;
}

/**
 * Create a regex to match at least one word from the given sentence.
 *
 * @param sentence - The input sentence with different formats of separation.
 * @param caseInsensitive - Whether the regex should be case-insensitive.
 * @param regexOptions - Additional regex options (like 'g' for global, 'm' for multiline, etc.).
 * @returns - The generated regular expression.
 */
export function createWordMatchingRegex(
	sentence: string,
	caseInsensitive = true,
	regexOptions = "",
) {
	// Normalize the sentence to extract words
	// Split by common delimiters (space, dashes, underscores)
	const words = sentence.split(/[\s-_]+/);

	// Create a regex pattern to match any of the words
	const pattern = words
		.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
		.join("|");

	// Define the flags for the regex
	const flags = caseInsensitive ? "i" : "";

	// Combine with additional regex options
	const combinedFlags = flags + regexOptions;

	// Return the regex that matches any of the extracted words
	return new RegExp(pattern, combinedFlags);
}
