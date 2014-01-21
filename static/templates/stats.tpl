<strong style="text-transform:capitalize">	<!-- <span class="indicateurHisto" title="mode historique ON">{{safe indicateur_histo}}</span> --> {{hour}} </strong>
<br/><strong>{{ttl}}</strong> missions en cours 
<br/>
<br/>
<div id="camembert"></div>
<ul>
	<li><img src="./static/images/fleche_green.png" width="13"/> <strong>{{default ok 0}}</strong> trains &agrave; l'heure ({{percent ok ttl}})</li>
	<li><img src="./static/images/fleche_orange.png" width="13"/> <strong>{{default delayed 0}}</strong> trains en retard ({{percent delayed ttl}}) :
		<ul>
			<li><img src="./static/images/fleche_yellow.png" width="13"/>  Moins de 15min : <strong>{{default yellow 0}}</strong></li>
			<li><img src="./static/images/fleche_orange.png" width="13"/> Entre 15 et 30min : <strong>{{default orange 0}}</strong></li>
			<li><img src="./static/images/fleche_red.png" width="13"/> Plus de 30min : <strong>{{default red 0}}</strong></li>
		</ul>
	</li>
	<li><img src="./static/images/fleche_black.png" width="13"/> <strong>{{default cancelled 0}}</strong> trains supprim&eacute;s ({{percent cancelled ttl}})</li>
	<li><img src="./static/images/fleche_blue.png" width="13"/> <strong>{{default unknown 0}}</strong> au départ / retard NC ({{percent unknown ttl}})</li>
</ul>
<a id="stat_detail" href="http://www.raildar.fr/tools/rrd_circulation" target="_blank"><i class="fa fa-search-plus"></i> Plus de stats de circulation</a>