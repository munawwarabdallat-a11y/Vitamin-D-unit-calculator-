// Vitamin D Calculator Logic

// Time of day factors
const TIME_FACTORS = {
    morning: 0.6,
    noon: 1.0,
    afternoon: 0.5
};

// Skin tone factors
const SKIN_FACTORS = {
    light: 1.0,
    medium: 0.7,
    dark: 0.5
};

// Base vitamin D production per hour (in IU) - varies by location/latitude
const LOCATION_FACTORS = {
    'south-asia': 300,          // High sun exposure
    'north-america': 250,       // Moderate
    'central-america': 350,     // High sun exposure
    'south-america': 350,       // High sun exposure
    'middle-east': 400,         // Very high sun exposure
    'gcc': 420,                 // Very high sun exposure (Gulf region)
    'north-europe': 100,        // Low sun exposure
    'west-europe': 150,         // Moderate
    'east-europe': 120,         // Low-moderate
    'russia': 80,               // Very low sun exposure
    'africa': 450,              // Very high sun exposure
    'china': 200,               // Moderate
    'japan': 200,               // Moderate
    'thailand': 400,            // High sun exposure (Tropical)
    'maldives': 450,            // Very high sun exposure (Tropical)
    'borabora': 450,            // Very high sun exposure (Tropical)
    'mauritius': 450,           // Very high sun exposure
    'general': 250              // General/Equatorial
};

// Form submission handler
document.getElementById('vitaminDForm').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateVitaminD();
});

// Real-time calculation as user changes inputs
document.querySelectorAll('input, select').forEach(element => {
    element.addEventListener('change', function() {
        if (document.getElementById('resultsSection').classList.contains('hidden') === false) {
            calculateVitaminD();
        }
    });
});

function calculateVitaminD() {
    // Get form values
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const timeOfDay = document.querySelector('input[name="timeOfDay"]:checked').value;
    const location = document.getElementById('location').value;
    const skinTone = document.querySelector('input[name="skinTone"]:checked').value;

    // Validation
    if (!location) {
        alert('Please select a location');
        return;
    }

    // Convert duration to hours (decimal)
    const totalDuration = hours + (minutes / 60);

    if (totalDuration === 0) {
        alert('Please enter a duration');
        return;
    }

    // Get factors
    const timeFactor = TIME_FACTORS[timeOfDay];
    const skinFactor = SKIN_FACTORS[skinTone];
    const locationFactor = LOCATION_FACTORS[location];

    // Calculate vitamin D production
    // Formula: Result = duration × time factor × skin factor × location factor
    const vitaminDResult = Math.round(totalDuration * timeFactor * skinFactor * locationFactor);

    // Display results
    displayResults(totalDuration, timeFactor, skinFactor, vitaminDResult, location, timeOfDay, skinTone);
}

function displayResults(duration, timeFactor, skinFactor, vitaminDResult, location, timeOfDay, skinTone) {
    // Update result values
    document.getElementById('resultDuration').textContent = formatDuration(duration);
    document.getElementById('resultTimeFactor').textContent = timeFactor.toFixed(1);
    document.getElementById('resultSkinFactor').textContent = skinFactor.toFixed(1);
    document.getElementById('resultVitaminD').textContent = vitaminDResult.toLocaleString();

    // Display formula breakdown
    const locationName = getLocationName(location);
    const locationFactor = LOCATION_FACTORS[location];
    const formulaText = `${duration.toFixed(2)} hours × ${timeFactor} (${timeOfDay}) × ${skinFactor} (${skinTone}) × ${locationFactor} (${locationName}) = ${vitaminDResult} IU`;
    document.getElementById('formulaBreakdown').textContent = formulaText;

    // Display status
    const statusElement = document.getElementById('resultStatus');
    const status = getVitaminDStatus(vitaminDResult);
    statusElement.textContent = status.message;
    statusElement.className = 'status ' + status.class;

    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    
    // Smooth scroll to results
    setTimeout(() => {
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function formatDuration(hours) {
    const wholeHours = Math.floor(hours);
    const minutesDecimal = (hours - wholeHours) * 60;
    const minutes = Math.round(minutesDecimal);
    
    if (wholeHours === 0) {
        return `${minutes} min`;
    } else if (minutes === 0) {
        return `${wholeHours} hr`;
    } else {
        return `${wholeHours} hr ${minutes} min`;
    }
}

function getLocationName(location) {
    const locationNames = {
        'south-asia': 'South Asia',
        'north-america': 'North America',
        'central-america': 'Central America',
        'south-america': 'South America',
        'middle-east': 'Middle East',
        'gcc': 'GCC (Gulf)',
        'north-europe': 'North Europe',
        'west-europe': 'West Europe',
        'east-europe': 'East Europe',
        'russia': 'Russia',
        'africa': 'Africa',
        'china': 'China',
        'japan': 'Japan',
        'thailand': 'Thailand',
        'maldives': 'Maldives',
        'borabora': 'Bora Bora',
        'mauritius': 'Mauritius',
        'general': 'General (Equatorial)'
    };
    return locationNames[location] || location;
}

function getVitaminDStatus(iuAmount) {
    // Based on daily recommended intake of 600-4,000 IU
    if (iuAmount < 600) {
        return {
            message: '⚠️ Insufficient - Below recommended daily intake',
            class: 'insufficient'
        };
    } else if (iuAmount >= 600 && iuAmount <= 4000) {
        return {
            message: '✅ Adequate - Within recommended daily intake range',
            class: 'adequate'
        };
    } else {
        return {
            message: '🌞 Optimal - High vitamin D synthesis. Good sun exposure!',
            class: 'optimal'
        };
    }
}

// Initialize with default values
document.addEventListener('DOMContentLoaded', function() {
    console.log('Vitamin D Calculator initialized');
    // Set default location if needed
    // document.getElementById('location').value = 'general';
});