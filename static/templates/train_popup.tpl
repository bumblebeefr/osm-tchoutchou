<strong>{{brand}} n&deg; <a target ="sncf" href="http://www.infolignes.com/recherche.php?date_num_train={{date '' 'YYYY|MM|DD'}}&num_train={{num}}">{{num}}</a> </strong> &agrave; destination de {{terminus}}
<br/>
<em>Mission n&deg; {{id_mission}}</em>
<br/>
{{#when type nequals='black'}}
	Prochaine Gare : {{next_gare}} (dans {{minutes_to_next_gare}} min)
	<br>
{{/when}}
<br>
{{#when type equals='green'}}
	Train &agrave; l'heure.
{{else}}
	{{#when type equals='black'}}
		<strong class="red">Train annul&eacute;.</strong>
	{{else}}
		En retard de {{retard}}min.
	{{/when}}
{{/when}}
<br>
Position : {{lib_pos_type}}
<br>
Derni&eagrave;re v&eacute;rif : {{human_last_check}}

