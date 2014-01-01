<strong>{{brand}} n&deg; <a target ="sncf" href="http://www.infolignes.com/recherche.php?date_num_train={{date '' 'YYYY|MM|DD'}}&num_train={{num}}">{{num}}</a> </strong> &agrave; destination de {{terminus}}
<br/>
<em>Mission n&deg; {{id_mission}}</em>
<br/>
{{#when type nequals='black'}}
	Prochaine Gare : {{next_gare}}
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
<br/>
Position : {{pos_type}}

