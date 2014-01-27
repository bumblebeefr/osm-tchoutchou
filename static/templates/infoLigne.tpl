<div class="titleBlock"><strong>Liste des arrêts {{txtInfoTrain}}</strong></div>
<br/>

<table id="detailInfoMission">
	<tr>
		<th>Gare</th>
		<th>Heure&nbsp;&nbsp;</th>
		<th>Info horaire</th>
	</tr>

{{#each arrets}}
	<tr class="{{classe_retard}} {{#if arret_depasse}}arret_depasse{{/if}} {{#if is_next_gare}}arret_next{{/if}}">
		<td>{{safe name_gare}} {{human_time_to_gare}}</td>
		<td>
		  {{horaire}}
		  {{#when horaireTheorique nequals=horaire}}
		  	<span class="biffe">{{horaireTheorique}}</span>
		  {{/when}}
		</td>
		<td>{{safe info}}</td>
	</tr>
{{else}}
  <tr><td class="help" colspan="2">Aucun arrêt</td></tr>
{{/each}}
</table>