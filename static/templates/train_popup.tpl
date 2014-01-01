<strong>{{brand}} n&deg; <a class="infoLigne" onClick="infoLigne({{id_mission}},'{{brand}} n° {{num}}')" id="mission{{id_mission}}" >{{num}}</a> </strong> &agrave; destination de {{terminus}}
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
Derni&egrave;re v&eacute;rif : {{human_last_check}}

