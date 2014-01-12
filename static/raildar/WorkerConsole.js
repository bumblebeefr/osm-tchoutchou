try{
	console.log('Console is defined');
}catch(e){
	console = {
			log : function(){
				worker.postMessage(new WorkerMessage("console_log",Array.prototype.slice.call(arguments)));
			},
			error : function(){
				worker.postMessage(new WorkerMessage("console_error",Array.prototype.slice.call(arguments)));
			},
			info : function(){
				worker.postMessage(new WorkerMessage("console_info",Array.prototype.slice.call(arguments)));
			}
	};
};