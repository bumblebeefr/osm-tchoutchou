{{#each missions}}
	<label>
		{{#if @first}}
			<input name='tracking_mission' type='radio' checked='checked' value='{{id_mission}}'/> 
		{{else}}
			<input name='tracking_mission' type='radio' value='{{id_mission}}'/> 
		{{/if}}
		Train n° {{num}}, départ à {{time_reel}}
	</label><br/>
{{else}}
	<i class="centered">Aucun train au départ dans cette gare.</i>
{{/each}}