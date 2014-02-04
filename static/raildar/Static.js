var statuses = {
    "green": "ok",
    "yellow": "delayed",
    "orange": "delayed",
    "red": "delayed",
    "black": 'cancelled',
    "blue": 'unknown'
};

function getDelayColor(delay){
	if (isNaN(delay)) {
		return "blue";
	} else if (delay < 0) {
		return "black";
	} else if (delay < 5) {
		return "green";
	} else if (delay < 15) {
		return "yellow";
	} else if (delay < 30) {
		return "orange";
	} else {
		return "red";
	}
}


var train_types = {
    'TGV/ICE': 'tgv',
    'TGV': 'tgv',
    'iDTGV': 'tgv',
    'Unknown': 'unknown',
    'TER/IC': 'simple',
    'Thalys': 'thalys',
    'TGV LYRIA': 'tgv',
    'Lunea': 'lunea',
    'LER': 'unknown',
    'Intercite': 'intercite',
    'TER': 'ter',
    'Eurostar': 'eurostar',
    'RER' : 'rer',
    'RER A' : 'rer',
    'RER B' : 'rer',
    'RER C' : 'rer',
    'RER D' : 'rer',
    'RER E' : 'rer',
    'RATP' : 'rer',
    'La Verrière - La Défense': 'transilien',
    'Paris Est': 'transilien',
    'Paris Nord': 'transilien',
    'Paris Rive Gauche': 'transilien',
    'Paris St Lazare': 'transilien',
    'Paris Sud Est': 'transilien',
    'Train' : 'transilien',
    'Tram' : 'tram'
};

var position_type = {
	1:"GPS théorique",
	2:"extrapolée"	
};