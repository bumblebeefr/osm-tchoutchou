{{#each gares}}
	<label>
		{{#if @first}}
			<input name='tracking_gare' type='radio' checked='checked' value='{{id_gare}}'/> 
		{{else}}
			<input name='tracking_gare' type='radio' value='{{id_gare}}'/> 
		{{/if}}
		{{safe name_gare}}
	</label><br/>
{{else}}
	<i class="centered">Aucune gare proche</i>
{{/each}}