<div class="titleBlock "><span class="strong">{{safe gare.name_gare}}</span> : Liste des prochains trains </div>
<br/>

<table id="detailInfoMission">
	<tr>
		<th>Train</th>		
		<th>Heure&nbsp;&nbsp;</th>
		<th>Direction</th>
		<th>Info horaire</th>
	</tr>

{{#each trains}}
	<tr class="{{classe_retard}} ">
		<td>{{safe brand}} {{num}}</td>
		<td>
		  {{horaire}}
		  {{#when horaireTheorique nequals=horaire}}
		  	<span class="biffe">{{horaireTheorique}}</span>
		  {{/when}}
		</td>
		<td>{{safe terminus}}</td>
		<td>{{safe info}}</td>
	</tr>
{{else}}
  <tr><td class="help" colspan="2">Aucun train</td></tr>
{{/each}}
</table>
<a href="#" id="gare_filter" Id_gare="{{safe gare.name_gare}}|{{safe gare.id_gare}}" ><i class="fa fa-magic"></i> Filtrer les trains passant par {{safe gare.name_gare}}</button>
