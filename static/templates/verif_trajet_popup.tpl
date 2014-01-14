<div class="verifTrajetPopup">
	Trajet théorique du <span>{{mission.brand}} {{mission.num}}</span> 
	<br>
	en provenance de <span>{{#indexOf  markers.marker i=0}}{{safe name}}{{/indexOf}} </span> 
	<br>
	et à destination de <span>{{#indexOf markers.marker i=-1}}{{safe name}}{{/indexOf}}</span>
	
	<div class="help"> 
		Pour signaler un trajet erroné, zoomez au plus proche de l'erreur et cliquez sur le bouton :
	</div>
	<div style="text-align:center;">
	  train id {{mission.id_train}}<br>
		<button  type="button" onclick="sendErreurTrajet('{{markers.train.id}}',this);">Reporter une erreur</button>
	</div>
</div>

