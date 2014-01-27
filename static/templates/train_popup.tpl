<a class="infoLigne strong"  id="infoLigne{{id_mission}}" >{{txtInfoTrain}}</a> &agrave; destination de {{terminus}}
<br/>
{{#when type nequals='black'}}
	{{#when id_depart equals=id_next_gare}}
		Départ dans {{human_time_to_next_gare}}
	{{else}}
		Prochaine Gare : {{next_gare}}, dans {{human_time_to_next_gare}}
	{{/when}}
	<br>
{{/when}}
{{#when type equals='blue'}}
  Pas d'information temp réel
{{else}}
	{{#when type equals='green'}}
		Train &agrave; l'heure.
	{{else}}
		{{#when type equals='black'}}
			<strong class="red">Train annul&eacute;.</strong>
		{{else}}
			En retard de {{retard}} min.
		{{/when}}
	{{/when}}
{{/when}}
<br>
Position : {{lib_pos_type}}
<br>
Derni&egrave;re v&eacute;rif : {{human_last_check}}
<br>
<!--<button type="button" onclick="showTrajet({{id_mission}},this)">Voir le trajet</button>-->

