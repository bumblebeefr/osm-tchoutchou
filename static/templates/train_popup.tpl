<strong>{{brand}} n&deg; <a class="infoLigne" onClick="infoLigne({{id_mission}})" id="mission{{id_mission}}" >{{num}}</a> </strong> &agrave; destination de {{terminus}}
<br/>
{{#when type nequals='black'}}
	{{#when id_depart equals=id_next_gare}}
		Départ dans {{human_time_to_next_gare}}
	{{else}}
		Prochaine Gare : {{next_gare}}, dans {{human_time_to_next_gare}}
	{{/when}}
	<br>
{{/when}}
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
Derni&egrave;re v&eacute;rif : {{human_last_check}}

