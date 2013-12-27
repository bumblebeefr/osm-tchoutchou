<strong>{{brand}} n° <a target ="sncf" href="http://www.infolignes.com/recherche.php?date_num_train={{date '' 'YYYY|MM|DD'}}&num_train={{num}}">{{num}}</a> </strong> à destination de {{terminus}}
<br/>
<em>Mission n° {{id_mission}}</em>
<br/>
Prochaine Gare : {{next_gare}}
<br>
{{#when type equals='green'}}
	Train à l'heure.
{{else}}
	{{#when type equals='black'}}
		<strong class="red">Train annulé.</strong>
	{{else}}
		En retard de {{retard}}min.
	{{/when}}
{{/when}}
<br/>
Position : {{pos_type}}

