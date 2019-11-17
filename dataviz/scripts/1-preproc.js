"use strict";

/**
 * Order Elements in chronological descending order
 *
 * @param a       First element
 * @param b       Second element
 * 
 */
function sortByDateDescending(a, b) {
	return b.created_at - a.created_at;
}



/**
 * We create a [id,name] list of all branches and districts
 *
 * @param countriesDict               	Countries with their COW code
 * @param imports               		All the arms imports
 * @param conflicts          			All the conflicts
 */
function createFromSources(countriesDict, imports, conflicts){

	var dataframe = [];

	Object.keys(countriesDict).forEach(function(key){

		var countryName = countriesDict[key]['name'];

		// Create entry
		var datum = {
			'name':countryName,
			'COW':key,
			'imports':imports[key],
			'conflicts':conflicts[key]
		};		

		// Add to dataframe
		dataframe.push(datum);
	});

	return dataframe;
}

/**
 * Set the time scale for the project
 *
 * @param xScale      X scale to be made proportional to the dates of the project
 * @param dataframe   The data object generated from the two CSV files
 */
function domainX(xScale, dataframe, dateparser){

	// Get first datum
	var datum = dataframe[0];
	
	// Get it's imports
	var datumImport = datum['imports'];

	// Grab all the imports years
	var allYears = Object.keys(datumImport);
	allYears = allYears.map(function(v){return +v});	// parse to int

	// Get the min/max
	const minYear = Math.min(...allYears);
	const maxYear = Math.max(...allYears);

	// parse to date
	var min = dateparser(minYear);
	var max = dateparser(maxYear+1);
	
	var min_date = new Date(min);
	var max_date = new Date(max);

	min_date.setDate(min.getDate());
	max_date.setDate(max.getDate());
	
	// Set the scale
	xScale.domain([min_date,max_date]);
}

/**
 * Restrict the data to the time constraints
 *
 * @param branches           The data object generated from the two CSV files
 * @param datemin           The earliest date defined by the sliders
 * 
 */
function timeBoundData(dataframe,slider_date){

	// Create a deep copy
	var timebound_data = [];
	
	dataframe.forEach(function(country){
		
		// Only countries with imports
		if(country['imports'] == null){
			return;
		}

		// Get the selected year
		var year = slider_date.getFullYear();

		// Only countries with imports for that year
		if(country['imports'][year] > 0){

			// add datum
			timebound_data.push({
				'name':country['name'],
				'COW':country['COW'],
				'imports':country['imports'][year],
				'conflicts':country['conflicts'][year]
			});
		}		
	});

	return timebound_data;
}