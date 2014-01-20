{{#each missions}}
	<label>
		{{#if @first}}
			<input name='tracking_mission' type='radio' checked='checked' value='{{id_mission}}'/> 
		{{else}}
			<input name='tracking_mission' type='radio' value='{{id_mission}}'/> 
		{{/if}}
		Train n° {{train.num}}, à destination de {{terminus.name_gare}}
	</label><br/>
{{else}}
	<i class="centered">Aucun train au départ de cette gare.</i>
{{/each}}