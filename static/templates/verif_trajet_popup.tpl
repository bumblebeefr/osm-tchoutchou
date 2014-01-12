<div class="verifTrajetPopup">
	Trajet théorique du <span>{{mission.brand}} {{mission.num}}</span> 
	<br>
	en provenance de <span>{{#first markers.marker }}{{safe name}}{{/first}} </span> 
	<br>
	et à destination de <span>{{#last markers.marker }}{{safe name}}{{/last}}</span>
	
	<div class="help"> 
		Pour signaler un trajet erroné, zoomez au plus proche de l'erreur et cliquez sur le bouton :
	</div>
	<div style="text-align:center;">
		<button  type="button" onclick="sendErreurTrajet('{{markers.train.id}}',this);">Reporter une erreur</button>
	</div>
</div>

