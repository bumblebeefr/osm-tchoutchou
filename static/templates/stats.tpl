<strong>{{ttl}}</strong> missions en cours 
<div class="right"><strong>{{hour}}</strong></div>
<div id="camembert"></div>
<ul>
	<li><img src="./static/images/fleche_green.png" width="13"/> <strong>{{ok}}</strong> trains &agrave; l'heure ({{percent ok ttl}})</li>
	<li><img src="./static/images/fleche_orange.png" width="13"/> <strong>{{delayed}}</strong> trains en retard ({{percent delayed ttl}}) :
		<ul>
			<li><img src="./static/images/fleche_yellow.png" width="13"/>  Moins de 15min de retard : <strong>{{yellow}}</strong></li>
			<li><img src="./static/images/fleche_orange.png" width="13"/> Entre 15 et 30min de retard : <strong>{{orange}}</strong></li>
			<li><img src="./static/images/fleche_red.png" width="13"/> Plus de 30min de retard : <strong>{{red}}</strong></li>
		</ul>
	</li>
	<li><img src="./static/images/fleche_black.png" width="13"/> <strong>{{cancelled}}</strong> trains supprim&eacute;s ({{percent cancelled ttl}})</li>
</ul>
