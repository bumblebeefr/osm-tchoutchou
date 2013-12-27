<strong>{{ttl}}</strong> missions en cours à {{hour}}
<ul>
	<li><img src="/static/images/fleche_green.png" width="10"/> <strong>{{ok}}</strong> trains à l'heure ({{percent ok ttl}})</li>
	<li><img src="/static/images/fleche_orange.png" width="10"/> <strong>{{delayed}}</strong> trains en retard ({{percent delayed ttl}}) :
		<ul>
			<li><img src="/static/images/fleche_yellow.png" width="10"/>  Moins de 15 minutes de retard : <strong>{{yellow}}</strong></li>
			<li><img src="/static/images/fleche_orange.png" width="10"/> Entre 15 et 30 minutes de retard : <strong>{{orange}}</strong></li>
			<li><img src="/static/images/fleche_red.png" width="10"/> Plus de 30 minutes de retard : <strong>{{red}}</strong></li>
		</ul>
	</li>
	<li><img src="/static/images/fleche_black.png" width="10"/> <strong>{{cancelled}}</strong> trains supprimés ({{percent cancelled ttl}})</li>
</ul>