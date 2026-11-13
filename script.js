
// Chart Vector — Aerodrome Directory
// Source: AAI eAIP list supplied by the user (October 2026)

const airports = [
    { icao: "VAAH", name: "Ahmedabad", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAAH-en-GB.html" },
    { icao: "VAAM", name: "Amravati", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAAM-en-GB.html" },
    { icao: "VAAU", name: "Aurangabad", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAAU-en-GB.html" },
    { icao: "VABB", name: "Mumbai", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VABB-en-GB.html" },
    { icao: "VABO", name: "Vadodara", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VABO-en-GB.html" },
    { icao: "VABP", name: "Bhopal", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VABP-en-GB.html" },
    { icao: "VABV", name: "Bhavnagar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VABV-en-GB.html" },
    { icao: "VADN", name: "Daman", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VADN-en-GB.html" },
    { icao: "VAGD", name: "Gondia", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAGD-en-GB.html" },
    { icao: "VAHS", name: "Rajkot INTL", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAHS-en-GB.html" },
    { icao: "VAID", name: "Indore", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAID-en-GB.html" },
    { icao: "VAJB", name: "Jabalpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAJB-en-GB.html" },
    { icao: "VAJJ", name: "Juhu", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAJJ-en-GB.html" },
    { icao: "VAJL", name: "Jalgaon", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAJL-en-GB.html" },
    { icao: "VAKE", name: "Kandla", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAKE-en-GB.html" },
    { icao: "VAKP", name: "Kolhapur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAKP-en-GB.html" },
    { icao: "VAKS", name: "Keshod", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAKS-en-GB.html" },
    { icao: "VAMA", name: "Mundra", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAMA-en-GB.html" },
    { icao: "VANM", name: "Navi Mumbai", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VANM-en-GB.html" },
    { icao: "VANP", name: "Nagpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VANP-en-GB.html" },
    { icao: "VAOZ", name: "Ozar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAOZ-en-GB.html" },
    { icao: "VAPO", name: "Pune", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAPO-en-GB.html" },
    { icao: "VAPR", name: "Porbandar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAPR-en-GB.html" },
    { icao: "VASD", name: "Shirdi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VASD-en-GB.html" },
    { icao: "VASL", name: "Solapur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VASL-en-GB.html" },
    { icao: "VASU", name: "Surat", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VASU-en-GB.html" },
    { icao: "VAUD", name: "Udaipur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VAUD-en-GB.html" },
    { icao: "VEAH", name: "Azamgarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEAH-en-GB.html" },
    { icao: "VEAP", name: "Ambikapur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEAP-en-GB.html" },
    { icao: "VEAT", name: "Agartala", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEAT-en-GB.html" },
    { icao: "VEAY", name: "Ayodhya", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEAY-en-GB.html" },
    { icao: "VEBI", name: "Barapani", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEBI-en-GB.html" },
    { icao: "VEBN", name: "Varanasi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEBN-en-GB.html" },
    { icao: "VEBD", name: "Bagdogra", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEBD-en-GB.html" },
    { icao: "VEBS", name: "Bhubaneswar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEBS-en-GB.html" },
    { icao: "VEBU", name: "Bilaspur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEBU-en-GB.html" },
    { icao: "VECC", name: "Kolkata", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VECC-en-GB.html" },
    { icao: "VECO", name: "Cooch-Behar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VECO-en-GB.html" },
    { icao: "VECT", name: "Chitrakoot", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VECT-en-GB.html" },
    { icao: "VEDG", name: "Durgapur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEDG-en-GB.html" },
    { icao: "VEGK", name: "Gorakhpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEGK-en-GB.html" },
    { icao: "VEDO", name: "Deoghar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEDO-en-GB.html" },
    { icao: "VEGT", name: "Guwahati", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEGT-en-GB.html" },
    { icao: "VEGY", name: "Gaya", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEGY-en-GB.html" },
    { icao: "VEHO", name: "Hollongi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEHO-en-GB.html" },
    { icao: "VEIM", name: "Imphal", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEIM-en-GB.html" },
    { icao: "VEJR", name: "Jagdalpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEJR-en-GB.html" },
    { icao: "VEJS", name: "Jamshedpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEJS-en-GB.html" },
    { icao: "VEJH", name: "Jharsuguda", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEJH-en-GB.html" },
    { icao: "VEJT", name: "Jorhat", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEJT-en-GB.html" },
    { icao: "VEKI", name: "Kushinagar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEKI-en-GB.html" },
    { icao: "VEKO", name: "Khajuraho", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEKO-en-GB.html" },
    { icao: "VEKU", name: "Kumbhigram", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEKU-en-GB.html" },
    { icao: "VELP", name: "Lengpui", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VELP-en-GB.html" },
    { icao: "VELR", name: "Lilabari", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VELR-en-GB.html" },
    { icao: "VEMN", name: "Dibrugarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEMN-en-GB.html" },
    { icao: "VEMR", name: "Dimapur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEMR-en-GB.html" },
    { icao: "VEPT", name: "Patna", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEPT-en-GB.html" },
    { icao: "VEPY", name: "Pakyong", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEPY-en-GB.html" },
    { icao: "VERC", name: "Ranchi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VERC-en-GB.html" },
    { icao: "VERK", name: "Rourkela", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VERK-en-GB.html" },
    { icao: "VERP", name: "Raipur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VERP-en-GB.html" },
    { icao: "VERU", name: "Rupsi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VERU-en-GB.html" },
    { icao: "VERW", name: "Rewa", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VERW-en-GB.html" },
    { icao: "VEST", name: "Satna", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VEST-en-GB.html" },
    { icao: "VETJ", name: "Tezu", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VETJ-en-GB.html" },
    { icao: "VIAG", name: "Agra", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIAG-en-GB.html" },
    { icao: "VIAH", name: "Aligarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIAH-en-GB.html" },
    { icao: "VIAR", name: "Amritsar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIAR-en-GB.html" },
    { icao: "VIBR", name: "Kullu Manali", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIBR-en-GB.html" },
    { icao: "VIBY", name: "Bareilly", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIBY-en-GB.html" },
    { icao: "VICG", name: "Chandigarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VICG-en-GB.html" },
    { icao: "VIDD", name: "Safdarjung", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIDD-en-GB.html" },
    { icao: "VIDN", name: "Dehradun", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIDN-en-GB.html" },
    { icao: "VIDP", name: "Delhi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIDP-en-GB.html" },
    { icao: "VIDX", name: "Hindan", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIDX-en-GB.html" },
    { icao: "VIDT", name: "Datia", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIDT-en-GB.html" },
    { icao: "VIGG", name: "Kangra", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIGG-en-GB.html" },
    { icao: "VIGR", name: "Gwalior", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIGR-en-GB.html" },
    { icao: "VIHR", name: "Hisar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIHR-en-GB.html" },
    { icao: "VIHX", name: "Halwara", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIHX-en-GB.html" },
    { icao: "VIJO", name: "Jodhpur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIJO-en-GB.html" },
    { icao: "VIJP", name: "Jaipur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIJP-en-GB.html" },
    { icao: "VIJU", name: "Jammu", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIJU-en-GB.html" },
    { icao: "VIKG", name: "Kishangarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIKG-en-GB.html" },
    { icao: "VILD", name: "Ludhiana", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VILD-en-GB.html" },
    { icao: "VILH", name: "Leh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VILH-en-GB.html" },
    { icao: "VILK", name: "Lucknow", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VILK-en-GB.html" },
    { icao: "VIMB", name: "Moradabad", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIMB-en-GB.html" },
    { icao: "VIND", name: "Jewar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIND-en-GB.html" },
    { icao: "VIPG", name: "Pithoragarh", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIPG-en-GB.html" },
    { icao: "VIPT", name: "Pantnagar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIPT-en-GB.html" },
    { icao: "VISM", name: "Shimla", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VISM-en-GB.html" },
    { icao: "VISP", name: "Sarsawaa", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VISP-en-GB.html" },
    { icao: "VISR", name: "Srinagar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VISR-en-GB.html" },
    { icao: "VIUT", name: "Uttarlai", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VIUT-en-GB.html" },
    { icao: "VOAT", name: "Agatti", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOAT-en-GB.html" },
    { icao: "VOBG", name: "Bengaluru (HAL)", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOBG-en-GB.html" },
    { icao: "VOBL", name: "Bengaluru (KIA)", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOBL-en-GB.html" },
    { icao: "VOBM", name: "Belagavi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOBM-en-GB.html" },
    { icao: "VOBR", name: "Bidar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOBR-en-GB.html" },
    { icao: "VOBZ", name: "Vijayawada", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOBZ-en-GB.html" },
    { icao: "VOCB", name: "Coimbatore", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOCB-en-GB.html" },
    { icao: "VOCI", name: "Cochin", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOCI-en-GB.html" },
    { icao: "VOCL", name: "Calicut", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOCL-en-GB.html" },
    { icao: "VOCP", name: "Kadapa", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOCP-en-GB.html" },
    { icao: "VOGA", name: "Mopa", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOGA-en-GB.html" },
    { icao: "VOGB", name: "Kalaburagi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOGB-en-GB.html" },
    { icao: "VOGO", name: "Goa", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOGO-en-GB.html" },
    { icao: "VOHB", name: "Hubballi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOHB-en-GB.html" },
    { icao: "VOHS", name: "Shamshabad (RGI)", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOHS-en-GB.html" },
    { icao: "VOHY", name: "Begumpet", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOHY-en-GB.html" },
    { icao: "VOJV", name: "Jindal Vijayanagar", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOJV-en-GB.html" },
    { icao: "VOKN", name: "Kannur", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOKN-en-GB.html" },
    { icao: "VOKU", name: "Kurnool", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOKU-en-GB.html" },
    { icao: "VOMD", name: "Madurai", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOMD-en-GB.html" },
    { icao: "VOML", name: "Mangaluru", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOML-en-GB.html" },
    { icao: "VOMM", name: "Chennai", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOMM-en-GB.html" },
    { icao: "VOMY", name: "Mysuru", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOMY-en-GB.html" },
    { icao: "VOND", name: "Nanded", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOND-en-GB.html" },
    { icao: "VOPB", name: "Portblair", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOPB-en-GB.html" },
    { icao: "VOPC", name: "Puducherry", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOPC-en-GB.html" },
    { icao: "VOPN", name: "Puttaparthi", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOPN-en-GB.html" },
    { icao: "VORY", name: "Rajahmundry", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VORY-en-GB.html" },
    { icao: "VOSM", name: "Salem", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOSM-en-GB.html" },
    { icao: "VOSH", name: "Shivamogga", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOSH-en-GB.html" },
    { icao: "VOSR", name: "Sindhudurg", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOSR-en-GB.html" },
    { icao: "VOTK", name: "Tuticorin", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOTK-en-GB.html" },
    { icao: "VOTP", name: "Tirupati", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOTP-en-GB.html" },
    { icao: "VOTR", name: "Tiruchirappalli", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOTR-en-GB.html" },
    { icao: "VOTV", name: "Thiruvananthapuram", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOTV-en-GB.html" },
    { icao: "VOVI", name: "Bhogapuram", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOVI-en-GB.html" },
    { icao: "VOVZ", name: "Visakhapatnam", sourceUrl: "https://aim-india.aai.aero.in/eaip/eaip-v2-10-2026/eAIP/IN-AD%202.1VOVZ-en-GB.html" }
];


const PAGE_SIZE = 10;

const airportList = document.getElementById("airport-list");
const search = document.getElementById("search");
const count = document.getElementById("airport-count");

const sortedAirports = [...airports].sort((a, b) =>
    a.name.localeCompare(b.name)
);

let currentPage = 1;
let filteredAirports = sortedAirports;

const pagination = document.createElement("nav");
pagination.className = "directory-pagination";
pagination.setAttribute("aria-label", "Airport directory pages");

airportList.insertAdjacentElement("afterend", pagination);

function makeButton(label, page, disabled = false, active = false) {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "page-button" + (active ? " active" : "");
    button.textContent = label;
    button.disabled = disabled;

    if (active) {
        button.setAttribute("aria-current", "page");
    }

    button.addEventListener("click", () => {
        currentPage = page;
        renderDirectory();

        document.getElementById("airports")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });

    return button;
}

function renderDirectory() {
    const total = filteredAirports.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    currentPage = Math.min(
        Math.max(1, currentPage),
        totalPages
    );

    const start = (currentPage - 1) * PAGE_SIZE;
    const visible = filteredAirports.slice(start, start + PAGE_SIZE);

    count.textContent = `${total} of ${airports.length} aerodromes`;

    airportList.replaceChildren();
    pagination.replaceChildren();

    if (!total) {
        const empty = document.createElement("p");
        empty.className = "directory-empty";
        empty.textContent =
            "No matching airports. Try another name or ICAO code.";

        airportList.appendChild(empty);
        return;
    }

    const fragment = document.createDocumentFragment();

    for (const airport of visible) {
        const row = document.createElement("a");
        row.className = "airport-row";

        row.href =
            `airport.html?icao=${encodeURIComponent(airport.icao)}` +
            `&name=${encodeURIComponent(airport.name)}` +
            `&source=${encodeURIComponent(airport.sourceUrl)}`;

        row.setAttribute(
            "aria-label",
            `Open charts for ${airport.name}, ${airport.icao}`
        );

        const code = document.createElement("span");
        code.className = "directory-icao";
        code.textContent = airport.icao;

        const details = document.createElement("span");
        details.className = "directory-details";

        const name = document.createElement("strong");
        name.className = "directory-name";
        name.textContent = airport.name;

        const subtitle = document.createElement("span");
        subtitle.className = "directory-caption";
        subtitle.textContent = "Aerodrome charts & information";

        details.append(name, subtitle);

        const arrow = document.createElement("span");
        arrow.className = "directory-arrow";
        arrow.textContent = "→";
        arrow.setAttribute("aria-hidden", "true");

        row.append(code, details, arrow);
        fragment.appendChild(row);
    }

    airportList.appendChild(fragment);

    if (totalPages <= 1) return;

    pagination.appendChild(
        makeButton("← Previous", currentPage - 1, currentPage === 1)
    );

    const pages = document.createElement("div");
    pages.className = "page-numbers";

    const wanted = new Set([1, totalPages]);

    for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages, currentPage + 1);
        i++
    ) {
        wanted.add(i);
    }

    let last = 0;

    for (const page of [...wanted].sort((a, b) => a - b)) {
        if (page > last + 1) {
            const dots = document.createElement("span");
            dots.className = "page-ellipsis";
            dots.textContent = "…";
            pages.appendChild(dots);
        }

        pages.appendChild(
            makeButton(
                String(page),
                page,
                false,
                page === currentPage
            )
        );

        last = page;
    }

    pagination.appendChild(pages);

    pagination.appendChild(
        makeButton(
            "Next →",
            currentPage + 1,
            currentPage === totalPages
        )
    );
}

search.placeholder = "Search airport or ICAO code...";

search.addEventListener("input", () => {
    const query = search.value.toLowerCase().trim();

    filteredAirports = sortedAirports.filter(airport =>
        airport.icao.toLowerCase().includes(query) ||
        airport.name.toLowerCase().includes(query)
    );

    currentPage = 1;
    renderDirectory();
});

renderDirectory();
