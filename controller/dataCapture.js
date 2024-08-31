const asyncHandler = require('../middleware/asyncHandler')

const ErrorResponse = require('../utils/errorResponse')
const config = require('../config')

const { Client } = require('@notionhq/client');

module.exports = {
	log: asyncHandler(async (req, res, next) => {
		try {
			const { message } = req.body;
			if (!message) {
				return res.fail(new ErrorResponse(400, 'Message content is required'));

			}
			const { dataUsage, resetDate } = parseDataUsageMessage(message);

			const today = new Date();
			const month = today.toLocaleString('default', { month: 'short' });
			const year = today.getFullYear().toString();
			const monthYear = `${month}-${year}`;

			const notion = new Client({ auth: process.env.NOTION_API_KEY });
			const pageProperties = {
				'Month-Year': {
					type: "title",
					title: [{ type: "text", text: { content: monthYear } }],
				},
				'Month': {
					type: "select",
					select: { name: month, },
				},
				'Year': {
					type: "select",
					select: { name: year, },
				},
				'Usage (MB)': {
					type: "number",
					number: dataUsage,
				},
				'Usage (GB)': {
					type: "number",
					number: dataUsage / 1024,
				},
				'Record Created Date': {
					type: "date",
					date: { start: today.toISOString(), },
				},
			}

			const response = await notion.pages.create({
				parent: { database_id: config.notion.databaseId },
				properties: pageProperties,
			});


			res.ok(200, response)
		} catch (error) {
			const errorMessage = error.message;
			return res.fail(new ErrorResponse(500, errorMessage || 'Failed to log data', 500));
		}
	}),
}

function parseDataUsageMessage(message) {
	const dataUsagePatterns = [
		/used: (\d+\.?\d*)MB/,                 // Matches "used: 4.0MB"
		/used: (\d+\.?\d*)GB/,                 // Matches "used: 6.2GB"
		/You've used (\d+\.?\d*)GB/,           // Matches "You've used 6.2GB"
		/(\d+\.?\d*)GB of your data this month/, // Matches "You've used 6.2GB of your data this month"
	];

	const resetDatePatterns = [
		/Next data reset date: (\w+ \d+, \d+)/, // Matches "Next data reset date: Sep 29, 2024"
		/Both refresh on (\w+ \d+, \d+)/,       // Matches "Both refresh on Jul 31, 2024"
	];

	let dataUsage = null;
	let resetDate = null;

	// Try to extract data usage
	for (const pattern of dataUsagePatterns) {
		const match = message.match(pattern);
		if (match) {
			dataUsage = parseFloat(match[1]);

			// Check the unit in the matched pattern
			if (pattern.toString().includes("GB")) {
				dataUsage *= 1024; // Convert GB to MB
			}
			break;
		}
	}

	// Try to extract reset date
	for (const pattern of resetDatePatterns) {
		const match = message.match(pattern);
		if (match) {
			resetDate = match[1];
			break;
		}
	}

	if (!dataUsage || !resetDate) {
		throw new Error('Unable to parse the data usage or reset date from the message.');
	}

	return { dataUsage, resetDate };
}

