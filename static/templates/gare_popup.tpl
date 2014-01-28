<div class="titleBlock "><span class="strong">{{gare.name_gare}}</span> : Liste des prochains trains </div>
<br/>

<table id="detailInfoMission">
	<tr>
		<th>Train</th>
		<th>Heure&nbsp;&nbsp;</th>
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
		<td>{{safe info}}</td>
	</tr>
{{else}}
  <tr><td class="help" colspan="2">Aucun train</td></tr>
{{/each}}
</table>